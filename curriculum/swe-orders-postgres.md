# Project: Orders Under Load. Postgres

> **In this lesson:** you move your orders API from memory into Postgres. You'll design the tables, write a migration runner, let the database itself refuse bad data, and prove with a query plan that looking up a customer's orders doesn't read every order in the table. The routes and responses don't change at all. This is the second of four parts.

## Words you need first

- **Schema.** The structure of a database: its tables, columns, constraints and indexes.
- **PGlite.** Real Postgres, built to run inside a Node program. In memory for tests, or saved to a folder.
- **Migration runner.** The small program that applies each migration file once, in order, and remembers which have run.
- **Query plan.** The database's description of how it will run a query: which tables it reads, and whether it uses an index.

## What changes, and what doesn't

Everything a caller sees stays the same. Same routes, same bodies, same status codes. If you split the HTTP layer from the store in the last part, you're writing a new store with the same functions, and the routes don't change.

What's new:

- `createApp({ db })` takes a database connection, and stores everything in it.
- `src/migrate.js` exports `migrate(db)`, which applies every file in `migrations/` that hasn't run yet.
- Your data survives a restart, and two copies of the app can share it.
- The database refuses bad data even if your code has a bug.

Read the Milestone 2 section of the README now. It fixes the table and column names, because the hidden tests look inside your tables:

| Table | Columns |
| --- | --- |
| `products` | `id`, `name`, `price_cents`, `stock` |
| `customers` | `id`, `name`, `email` |
| `orders` | `id`, `customer_id`, `status`, `created_at` |
| `order_items` | `order_id`, `product_id`, `qty`, `price_cents` |

Notice there's no `items` column on `orders`. An order with three products is one row in `orders` and three rows in `order_items`, each pointing back at the order. Columns in the database use `snake_case`. Fields in your JSON stay `camelCase`. The store translates between them.

## PGlite, and a real server if you want one

You don't need to install a database server. PGlite is real Postgres compiled to run inside Node, and it's already in `package.json`.

In tests, each test gets its own fresh database in memory:

```js
const { PGlite } = require("@electric-sql/pglite");
const { migrate } = require("../src/migrate.js");

async function freshDb() {
  const db = new PGlite();
  await migrate(db);
  return db;
}
```

In `server.js`, open it with a folder so your data is still there next time you run `npm start`. The README shows the three lines. Add `.data/` to what Git ignores; the starter's `.gitignore` already does.

Your app may only use three methods on `db`, because tests sometimes hand you a wrapper around PGlite instead of PGlite itself:

| Method | Does |
| --- | --- |
| `await db.query(sql, params)` | Runs one statement with `$1`-style values. Returns `{ rows }`. |
| `await db.exec(sql)` | Runs one or more statements with no values. Good for migration files. |
| `await db.transaction(async (tx) => { ... })` | Runs your function inside a transaction, using `tx.query`. You'll need this in the next part. |

If you have Docker and want a real Postgres server, the README has the command and what an adapter needs. It's optional, and the tests never use it.

## Plan the feature first

Add a section to `orders/PLAN.md` before your agent writes anything.

**Draw the tables.** On paper or in text, every table, every column with its type, every primary key, and an arrow for every foreign key. Then answer:

1. **Which constraints?** For every rule in the README's validation list, can the database enforce it too? Stock never below zero. `qty` at least 1. Email unique. Status only `placed` or `cancelled`. Every item points at a real order and a real product.
2. **Which indexes?** List every query your store will run. For each one that finds rows by a column other than a primary key, name the index that serves it.
3. **Where do idempotency keys live now?** They must survive a restart, so a JavaScript `Map` is out. What table, which columns, and what makes a key unique?
4. **Customer totals.** Worked out with a query each time, or kept in a column and updated with every order and cancel? What does each cost?
5. **Which migrations?** List the files and what each does.

## Write the migration runner

`migrate(db)` is short, and every step is there for a reason. Put these in order:

```order
title: What migrate(db) does, in order
---
Create a schema_migrations table if it doesn't exist yet
Read the names of the migrations already recorded in it
List the .sql files in migrations/ and sort them by name
For each file not yet recorded, run its SQL inside a transaction
In the same transaction, record the file's name, so it never runs again
```

Why each step matters:

- **The record table** is how the runner remembers. Without it, the second run tries `CREATE TABLE products` again and fails, because the table exists.
- **Sorting by name** is why the files start with `001_`, `002_`. Order matters: you can't index a table before it exists.
- **A transaction around each file** means a migration that fails halfway leaves nothing behind. Without one, half a migration can apply, the record isn't written, and the next run trips over the half that did.

The hidden tests run `migrate` twice, and three times, on the same database, and check your data is still there.

A note on `CREATE TABLE IF NOT EXISTS` inside migration files: it makes a second run quiet, but it also hides mistakes and does nothing for the next change, like adding a column. A runner that records what ran is the real fix.

## Let the database say no

Put every constraint in your first migration. A good test of your schema: try to break it from SQL directly. In a test, insert a product with `stock = -1`, an order item with `qty = 0`, two customers with the same email, an order item for order 999999. Each one should throw.

The hidden tests do exactly this, straight against your tables, with no app involved.

## Prove the index works

Your app answers `GET /customers/:id/orders`. With an index on `orders.customer_id`, the database jumps to that customer's rows. Without one, it reads every order in the table and throws most of them away.

On a test database with ten orders, you can't tell the difference by timing it. So ask the database what it did. In a test or a scratch script:

```js
await db.query("ANALYZE");
const plan = await db.query(
  "EXPLAIN ANALYZE SELECT id FROM orders WHERE customer_id = $1 ORDER BY id DESC LIMIT 21",
  [customerId],
);
console.log(plan.rows.map((r) => r["QUERY PLAN"]).join("\n"));
```

Fill the table with a few thousand orders for other customers first, then look at the plan:

- `Index Scan using orders_customer_id_idx` and a handful of rows: good.
- `Seq Scan on orders`, or `Rows Removed by Filter: 4998`: it read everything.

The hidden test does this: it puts thousands of other customers' orders in the table, asks for one customer's three orders, and counts how many rows of `orders` your queries actually read.

It also catches a mistake that no index can fix: loading every order into JavaScript and filtering there. If you see `SELECT * FROM orders` followed by `.filter(...)` in a diff, stop the agent.

## Update your tests

Your tests from the first part call `createApp()` with no database. Change the one `start()` helper so every test gets a fresh, migrated PGlite. Every test should still pass. If one doesn't, the move to Postgres changed behavior somewhere, and that's a bug.

Then add tests for what's new:

- Running `migrate` twice is safe.
- A second app on the same database sees the first app's orders.
- A retry with the same `Idempotency-Key` still returns the same order after a restart.
- The database refuses negative stock, a zero `qty`, a duplicate email and an orphan order item.

You owe at least 12 passing tests in this part.

## Reading the agent's SQL

Check every diff for these:

- **Values glued into SQL strings.** Every value goes through `$1`, `$2`. No exceptions, even for ids.
- **`UPDATE` or `DELETE` without a `WHERE`.**
- **Reading everything and filtering in JavaScript.**
- **Money as `numeric` or `real`.** Keep it `integer` cents, the same as your JSON.
- **Columns `NOT NULL` with no default** added later, which break inserts that don't name them.
- **A migration file edited after it ran.** Add a new one instead.

```scenario
{
  "who": "A teammate",
  "setting": "Reviewing your pull request that adds migrations/ and a migration runner.",
  "ask": "This feels like a lot of machinery. Can't we just run CREATE TABLE IF NOT EXISTS for every table when the server starts?",
  "options": [
    {
      "text": "That works until the first change. Next month we'll add a column or an index, and IF NOT EXISTS skips the whole table on every database that already has it. Numbered migrations apply each change once, in order, on every copy of the database, and we can see exactly which ones production has run.",
      "verdict": "best",
      "feedback": "This answers the real question: what happens on the second change. It names the failure precisely and the property that migrations give you."
    },
    {
      "text": "Migrations are the industry standard, so we should use them.",
      "verdict": "weak",
      "feedback": "True and unconvincing. 'Everyone does it' invites 'but why', and you haven't said what breaks without them."
    },
    {
      "text": "Fair point. We could do that now and add migrations when we need to change the schema.",
      "verdict": "ok",
      "feedback": "It defers the problem honestly, but you'll need them within weeks, and by then production has a schema nobody recorded. Starting with two small files is cheaper than retrofitting."
    }
  ],
  "debrief": "The question to ask of any schema setup is what happens on the second change, on a database that already has data."
}
```

## Hand it in

Commit and push, then paste the link to your `parsity-labs` repository.

```submit
assignment: orders-2
```

We need `orders/src/app.js`, `orders/src/migrate.js` and at least 12 passing tests of yours. Then ours run, with a fresh PGlite for each test: your migrations twice, data and retries across a restart, the database refusing bad data on its own, a customer's orders found among thousands of others, and every rule from the first part again.

If you're stuck on one category for more than 30 minutes, write a test that reproduces it before asking for help. Most of the time, writing the test shows you the bug.

```quiz
[
  {
    "q": "Your migration runner runs every .sql file each time it's called. The second call fails with 'relation products already exists'. What's the real fix?",
    "options": ["Record each migration's name in a table when it runs, and skip names already recorded", "Wrap the CREATE TABLE in a try and catch", "Drop all tables before running migrations", "Only call migrate once in production"],
    "answer": 0,
    "explain": "The runner needs a memory. A table of applied migrations lets it run only new files, which also works for the next change, like adding a column."
  },
  {
    "q": "Why put CHECK (stock >= 0) in the database when your app already validates stock?",
    "options": ["Because code has bugs and data lives for years, so the database is the last line of defense", "Because Postgres requires a CHECK on every number", "Because it makes queries faster", "It isn't needed if the app validates"],
    "answer": 0,
    "explain": "Validation in the app catches bad requests. A constraint catches everything else: a bug, a script, a teammate's query. With it, negative stock can't be saved by anyone."
  },
  {
    "q": "EXPLAIN ANALYZE on a customer's orders shows 'Rows Removed by Filter: 4997' and returns 3 rows. What does that tell you?",
    "options": ["The database read about 5000 rows to find 3, so the lookup column needs an index", "The query is fast enough", "Three rows were deleted", "The table has a broken foreign key"],
    "answer": 0,
    "explain": "Rows removed by filter were read and thrown away. Reading the whole table to find a few rows is what an index prevents."
  }
]
```

## Key takeaways

- With a clean split, moving to Postgres is a new store with the same functions. Routes and responses don't change.
- An order is one row in `orders` plus one row per item in `order_items`, tied by foreign keys.
- A migration runner records what has run, runs only what's new, in order, each inside a transaction.
- Constraints let the database refuse bad data even when the app has a bug.
- Index every column you look rows up by. Check with EXPLAIN ANALYZE on a table with real numbers of rows.

## Work with AI

```ai-prompt
title: Quiz me on my own schema
---
I moved an order API into Postgres. I'll paste my migration files: tables for
products, customers, orders, order_items and idempotency keys, with constraints and
indexes. Don't rewrite them. Ask me questions one at a time, waiting for each answer:
for each constraint, what bad data it stops and what would happen without it; for
each index, which query uses it; and at least two questions about bad data my schema
would still let in. If I can't answer one, give me a hint, not the answer. At the
end, tell me the one change you'd most want me to make and why, in two sentences.
```
