# Orders under load

An order and inventory API. Shops add products, customers place orders, and stock
goes down. You build it in four milestones, all in this folder:

1. **No database.** Every route below, with data kept in memory.
2. **Postgres.** The same API, stored in tables, with migrations.
3. **At the same moment.** Two orders for the last item must never both win.
4. **Documents.** The same data as JSON documents in a file, and your decision memo.

The routes, shapes and status codes below are the contract. They stay the same in
every milestone. Hidden tests call them exactly as written here, so read this page
before you plan anything, and hand it to your coding agent along with your plan.

## Run it

```bash
npm install
npm test          # runs node --test
npm start         # starts the API on http://localhost:3000
```

Then, in another terminal:

```bash
curl -s -X POST localhost:3000/products -H 'content-type: application/json' \
  -d '{"name": "Desk lamp", "priceCents": 2500, "stock": 3}'
```

## What the code must export

- `src/app.js` exports `createApp(options)`. It returns a Node `http.Server` that
  is **not** listening yet. Tests call `server.listen(0)` themselves.
  - Milestone 1: `createApp()` keeps everything in memory.
  - Milestone 2 and 3: `createApp({ db })`, where `db` is a Postgres connection
    with `db.query(sql, params)`, `db.exec(sql)` and `db.transaction(fn)`. Tests
    pass a fresh in-memory PGlite each time.
  - Milestone 4: `createApp({ dataFile })`, where `dataFile` is the path of a JSON
    file. `createApp({ db })` must keep working.
- `src/migrate.js` exports `async migrate(db)` (from milestone 2). It applies every
  `.sql` file in `migrations/` that hasn't been applied yet, in name order. Running
  it twice must be safe.

Keep the HTTP code (routes, validation, status codes) apart from the storage code.
You will swap the storage twice.

## The data

All money is in whole cents, as integers. `2500` means $25.00.

**Product**

```json
{ "id": 1, "name": "Desk lamp", "priceCents": 2500, "stock": 3 }
```

**Customer**

```json
{ "id": 1, "name": "Ada Lovelace", "email": "ada@example.com", "orderCount": 2, "totalSpentCents": 7500 }
```

`orderCount` and `totalSpentCents` count **placed** orders only. Cancelled orders
don't count.

**Order**

```json
{
  "id": 1,
  "customerId": 1,
  "status": "placed",
  "items": [{ "productId": 1, "qty": 2, "priceCents": 2500 }],
  "totalCents": 5000,
  "createdAt": "2026-11-19T15:04:05.000Z"
}
```

- `status` is `"placed"` or `"cancelled"`.
- `priceCents` on an item is the product's price at the moment the order was placed.
- `items` may come back in any order.

**A page of results**

```json
{ "items": [ ... ], "nextCursor": "MjA" }
```

`nextCursor` is `null` on the last page. To get the next page, send it back as
`?cursor=`. Clients treat it as an opaque string and never build one themselves.

**An error**

```json
{ "error": "qty must be a whole number, 1 or more" }
```

Every response, including every error, is JSON with `content-type: application/json`.
The message says what to fix.

## Routes

| Method and path | Body | Success |
| --- | --- | --- |
| `POST /products` | `{ name, priceCents, stock }` | `201` and the product |
| `GET /products?limit=&cursor=` | | `200` and a page of products, lowest id first |
| `GET /products/:id` | | `200` and the product |
| `POST /customers` | `{ name, email }` | `201` and the customer |
| `GET /customers/:id` | | `200` and the customer, with totals |
| `GET /customers/:id/orders?limit=&cursor=` | | `200` and a page of that customer's orders, **newest first** |
| `POST /orders` | `{ customerId, items: [{ productId, qty }] }` | `201` and the order |
| `GET /orders/:id` | | `200` and the order |
| `POST /orders/:id/cancel` | | `200` and the cancelled order |

## Rules

**Validation (400).**

- `name`: a string that isn't empty or only spaces, at most 200 characters.
- `priceCents` and `stock`: whole numbers, zero or more. `"5"`, `2.5` and `-1` are
  all rejected.
- `email`: a string that looks like `something@something`.
- `customerId`, `productId`: whole numbers, 1 or more.
- `qty`: a whole number, 1 or more.
- `items`: a list of 1 to 50 items. The same `productId` twice in one order is a 400.
- A `customerId` or `productId` that doesn't exist is a 400 that names it.
- A body that isn't valid JSON, or isn't a JSON object, is a 400.
- `limit`: a whole number from 1 to 100. Default 20. Anything else is a 400.
- A `cursor` the server didn't hand out is a 400.

**Not found (404).** An id in the path that doesn't exist, or isn't a positive whole
number. Any path that isn't in the table above.

**Wrong method (405).** A path from the table with a method it doesn't support, for
example `DELETE /products/1`.

**Conflict (409).** The request is fine, but the current state says no:

- Not enough stock for any item. **An order is all or nothing.** If one item can't be
  filled, no stock is taken for any item.
- Cancelling an order that is already cancelled. Stock goes back exactly once.
- Creating a customer with an email that already exists.

**Retries (Idempotency-Key).** `POST /orders` may carry an `Idempotency-Key` header,
a string of 1 to 200 characters.

- The same key with the same body again: answer `201` with the **same order**, and
  take no more stock.
- The same key with a different body: `422`, with an error.
- A request that failed (a 400 or a 409) isn't remembered. Retrying it runs it again.
- No header: every request is a new order.

**Server errors (500).** Only for bugs. One bad request must never stop the server
from answering the next one.

## Milestone 2: Postgres

Use these table and column names. Hidden tests read them directly. You may add
columns, but any column you add needs a default.

| Table | Columns |
| --- | --- |
| `products` | `id`, `name`, `price_cents`, `stock` |
| `customers` | `id`, `name`, `email` |
| `orders` | `id`, `customer_id`, `status`, `created_at` |
| `order_items` | `order_id`, `product_id`, `qty`, `price_cents` |

Where you keep idempotency keys is up to you, as long as they survive a restart.

The database must refuse bad data on its own, even if the app has a bug: negative
stock, a `qty` below 1, a duplicate email, and an order item that points at an order
or product that doesn't exist.

Tests use PGlite, which is real Postgres running inside Node, in memory. To keep your
data between runs of `npm start`, open PGlite with a folder:

```js
const { PGlite } = require("@electric-sql/pglite");
const { migrate } = require("./src/migrate.js");

const db = new PGlite("./.data/pg");
await migrate(db);
const server = createApp({ db });
```

**Optional: a real Postgres server.** If you have Docker, you can run one with
`docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16`. To use it, add
the `pg` package and write a small adapter that gives `createApp` the same three
methods (`query`, `exec`, `transaction`). You never need to. The tests only use
PGlite.

## Milestone 3: at the same moment

Hidden tests fire many requests at once. Your API must never sell stock it doesn't
have, never restock twice, and never create two orders for one retried request.

PGlite has a single connection and runs one transaction at a time, so a transaction
alone can hide a bug that a real server with many connections would show. We also
check that stock is taken with a conditional update or a locked row, the way it must
be on a real server.

## Milestone 4: documents

`createApp({ dataFile })` stores everything as JSON documents in that one file. Each
order is one document that holds its own items. No second database. Data must
survive a restart, many requests at once must not lose writes or oversell, and any
data you copy between documents (for example, totals kept on a customer) must stay
right after orders and cancellations.

Then answer every question in `MEMO.md`.
