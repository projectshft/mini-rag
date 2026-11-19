# Project: Orders Under Load. At the Same Moment

> **In this lesson:** you make your orders API correct when many requests arrive together. You'll write a test that catches your own API overselling, find every race in it, close each one with the right database tool, and hand in an API that survives thirty orders fighting over ten items. This is the third of four parts.

## Words you need first

- **Concurrent.** Running at overlapping times. Two concurrent requests are both in progress at once.
- **Conditional update.** An `UPDATE` whose `WHERE` checks the rule, like `stock >= $1`, so the check and the change happen in one step.
- **Rollback.** Undoing every change in a transaction, as if it never ran.
- **Reproduce.** Make a bug happen on purpose, reliably, so you can see it and later prove it's gone.

## The brief

Read the Milestone 3 section of the README. The rules haven't changed. What's new is that the hidden tests send many requests at once, and your API must still keep every rule:

- **Never sell stock that isn't there.** Thirty orders for ten items: exactly ten succeed, twenty get a 409, stock ends at 0.
- **Never leave half an order.** An order for a lamp and a bulb that loses the race for the bulb takes nothing, and leaves no order behind.
- **Never restock twice.** Five cancels of one order at the same moment: one 200, four 409s.
- **Never make two orders from one retry.** The same `Idempotency-Key` arriving five times at once makes one order.
- **Take stock the way a real server needs.** A conditional update, a locked row, or a serializable transaction.

Your routes, responses and tables stay the same. This part is almost entirely inside your store.

## First, catch yourself overselling

Don't change any code yet. Write a test that proves the bug exists. A fix you can't see failing first is a guess.

There's one catch. PGlite runs inside your process, so it answers queries without the short wait that a real database across a network has. With no wait, each request finishes before the next one starts, and a race never shows. The README gives you a small wrapper, `overNetwork`, that adds that wait back. Copy it into your test file and wrap the database you give `createApp`:

```js
async function start() {
  const db = new PGlite();
  await migrate(db);
  const server = createApp({ db: overNetwork(db) });
  // ... the rest of your start() helper
}
```

The hidden tests use the same wrapper. Then fire two orders for the last item at once with `Promise.all`:

```js
test("two orders for the last item: exactly one wins", async () => {
  const api = await start();
  const lamp = await api.call("POST", "/products", { name: "Lamp", priceCents: 2500, stock: 1 });
  const ada = await api.call("POST", "/customers", { name: "Ada", email: "ada@example.com" });
  const body = { customerId: ada.body.id, items: [{ productId: lamp.body.id, qty: 1 }] };

  const results = await Promise.all([
    api.call("POST", "/orders", body),
    api.call("POST", "/orders", body),
  ]);

  const codes = results.map((r) => r.status).sort();
  assert.deepStrictEqual(codes, [201, 409]);
  const lampNow = await api.call("GET", `/products/${lamp.body.id}`);
  assert.strictEqual(lampNow.body.stock, 0);
  await api.close();
});
```

`Promise.all` starts both requests before waiting for either. Run it. If your store reads stock, checks it in JavaScript and writes it back, you'll see `[201, 201]`. That's the oversell, on your machine, in your code. Commit the failing test.

## Find every race

Overselling is the famous one. There are more. For each route that changes data, find the place where it reads something, awaits, and then decides based on what it read.

Fill this in, in `PLAN.md`, before your agent touches anything:

| Route | What it reads, then writes | What goes wrong when two run at once | The guard you'll use |
| --- | --- | --- | --- |
| `POST /orders` | Each product's stock | | |
| `POST /orders` | Whether the idempotency key was seen | | |
| `POST /orders/:id/cancel` | The order's status | | |
| `POST /customers` | Whether the email is taken | | |

Then answer two more:

1. **What makes an order all or nothing when it loses a race halfway?** Say the lamp is taken and then the bulb fails. Where does the lamp go back, and where does the order row go?
2. **In what order will you take stock for an order with several items, and why?** Think about two orders for the same two products, listed in opposite orders.

```match
{
  "title": "Match the race to its guard",
  "note": "Tap the race, then the database tool that closes it.",
  "pairs": [
    { "left": "Two orders take the last lamp", "right": "UPDATE ... SET stock = stock - $1 WHERE id = $2 AND stock >= $1" },
    { "left": "Two cancels both put stock back", "right": "UPDATE orders SET status = 'cancelled' WHERE id = $1 AND status = 'placed'" },
    { "left": "Two retries with one key both make an order", "right": "INSERT the key first, with ON CONFLICT (key) DO NOTHING" },
    { "left": "Two sign-ups with the same email both succeed", "right": "A UNIQUE constraint on email" },
    { "left": "The bulb fails after the lamp was taken", "right": "One transaction around the whole order, rolled back on failure" }
  ]
}
```

## Fix it with your agent

Give your agent the README, your plan and your failing test. Ask it to make the test pass using the guards in your table, one route at a time. Then review the diff against this list:

- **No stock read into JavaScript and written back.** Look for `stock - qty` computed in code and passed as a value. The subtraction belongs in the SQL.
- **One transaction per order, and per cancel.** Every statement for one order goes through `tx`, inside `db.transaction`.
- **`tx.query` inside the transaction, never `db.query`.** On PGlite, a `db.query` inside a transaction waits for the transaction to finish, which waits for the query. Your test hangs until it times out. On a real server, it runs outside the transaction and isn't rolled back.
- **The order row is created inside the same transaction**, so a rollback removes it too.
- **Items are taken in a fixed order**, for example sorted by product id, so two orders can't lock the same rows in opposite orders.
- **Zero rows back means 409.** Then check whether the product exists at all, because a missing product is still a 400.
- **No slow work inside the transaction.** Nothing in there should wait on anything but the database.

Then write more tests that fire requests at once:

- Thirty orders for ten items. Count the 201s and the 409s, and check the stock and the customers' totals.
- An order for two products racing an order for one of them, where only one can win. Check that the loser left no stock missing and no order behind.
- Five cancels of one order at once.
- Five copies of one retry at once.

You owe at least 14 passing tests in this part, and at least two of them should send requests at the same moment.

## When the test hangs

If a test never finishes, it's almost always one of two things:

- A `db.query` inside a `db.transaction` callback. Use `tx.query`.
- A server that a failing test never closed. The starter's `start()` closes every server in an `after` hook. Keep that.

If you're stuck for more than 30 minutes, draw the two requests as two columns with time going down, write each `await` on its own line, and find the line where the second request steps in.

## Hand it in

Commit and push, then paste the link to your `parsity-labs` repository.

```submit
assignment: orders-3
```

We need `orders/src/app.js`, `orders/src/migrate.js` and at least 14 passing tests of yours. Then ours fire requests at once: two orders for the last item, thirty orders for ten items, orders that lose a race halfway, cancels and retries that arrive together. We also check how your code takes stock, because PGlite runs one transaction at a time and can hide a race that a real server would show.

```quiz
[
  {
    "q": "Your race test passes even with the old read-then-write code. You're using a plain PGlite with no wrapper. Why might the race not show?",
    "options": ["PGlite answers without a network wait, so each request finishes before the next starts", "Promise.all runs requests one after another", "Node can't run two requests at once", "The test is correct and the code has no race"],
    "answer": 0,
    "explain": "A real database is a network call away, and that wait is where the second request steps in. The overNetwork wrapper adds the wait back so the race shows up in tests."
  },
  {
    "q": "An order takes the lamp with a conditional update, then the bulb's conditional update returns zero rows. The code returns a 409 and stops. No transaction is used. What's left behind?",
    "options": ["The lamp's stock is gone and the order row may still exist, for an order that failed", "Nothing, because the bulb update failed", "The bulb's stock goes negative", "Postgres rolls back the lamp on its own"],
    "answer": 0,
    "explain": "Each statement outside a transaction commits on its own. Only a transaction around the whole order lets you roll back the lamp and the order row together."
  },
  {
    "q": "Inside db.transaction(async (tx) => ...), the agent's code calls db.query to look up the customer. On PGlite, the test hangs. Why?",
    "options": ["db.query waits for the open transaction to finish, and the transaction is waiting for db.query", "PGlite can't look up customers inside a transaction", "The customers table is locked forever", "db.query is slower than tx.query"],
    "answer": 0,
    "explain": "Each waits for the other. Inside a transaction, every statement goes through tx, the connection the transaction is running on."
  }
]
```

## Key takeaways

- Reproduce a race with a failing test before fixing it. `Promise.all` starts requests together.
- PGlite has no network wait, so add one in tests or races hide.
- Every route that reads, awaits and then writes based on what it read has a race. Find each one.
- Close each race with a guard the database enforces: a conditional update, a conditional insert, a unique constraint or a row lock.
- Wrap each order in one transaction, use `tx` inside it, take items in a fixed order, and keep slow work out.

## Work with AI

```ai-prompt
title: Attack my order code with interleavings
---
I made an order API safe against concurrent requests using Postgres. I'll paste my
store's placeOrder and cancelOrder functions. Don't rewrite them. Act as an attacker
who controls timing: describe one specific interleaving of two or three requests,
step by step, statement by statement, that you think might break a rule (overselling,
half an order left behind, stock returned twice, a retry making two orders). Ask me
what my code does at each step and whether the rule holds. Wait for my answer each
time. If my code survives, try a harder interleaving. Do four rounds, then tell me
which part of my code you'd look at hardest in review and why.
```
