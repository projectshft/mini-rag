# Project: Orders Under Load. Documents and the Memo

> **In this lesson:** you store the same orders as JSON documents in a single file, with no second database, and keep them correct through restarts, cancels and many requests at once. Then you write the decision memo that explains every choice you made in this project: how you stopped overselling, locks versus conflict checks, and tables versus documents. This is the last of four parts.

## Words you need first

- **Data file.** The one JSON file that holds every document your app stores in this part.
- **Embed.** Put related data inside a document instead of somewhere else. An order embeds its items.
- **Atomic write.** Saving a file so that anyone reading it sees either the old version or the new one, never half of each.
- **Version number.** A counter on a document that goes up on every write, used to notice that someone else wrote first.

## The brief

Read the Milestone 4 section of the README. In short:

- `createApp({ dataFile })` stores everything as JSON documents in that one file. `createApp({ db })` keeps working exactly as before.
- **Each order is one document that holds its own items.** The hidden tests open your file and look for it.
- Data survives a restart: a new app on the same file sees everything.
- Many requests at once never lose a write and never oversell.
- Anything you copy between documents stays right after orders and cancels, and after a restart.
- Every question in `MEMO.md` gets a real answer.

The routes, responses and rules are the same contract you've been building to all along. Only the store changes again.

## Design your documents

This part is mostly design. The code is short once the design is right. Add a section to `PLAN.md` and decide:

1. **The shape of the file.** One top-level object with a key per kind of document? What else must be in it? Think about where the next id comes from after a restart.
2. **What each order embeds.** Its items, certainly. What else, and is each copy a snapshot or something that must stay current?
3. **What the customer document holds.** `GET /customers/:id` needs `orderCount` and `totalSpentCents`, and `GET /customers/:id/orders` needs that customer's orders, newest first. You can work them out from the orders each time, or keep them on the customer. If you keep them, list **every** change that must update them.
4. **Where stock lives,** and how an order changes it.
5. **Where idempotency keys live,** so a retry after a restart still finds them.
6. **How two writes are kept from overwriting each other.** A lock, or a version check with retries. Pick one, and write down what it costs.

Draw one example of the whole file, with two products, one customer and two orders, one of them cancelled. If you can't draw it, you're not ready for the agent.

## Writing the file safely

Two problems sink a naive file store, and the hidden tests look for both.

**Lost writes.** Each change reads the file, changes the data, and writes the file back. Two requests that overlap both read the same old data, and the second write wipes out the first. You met this in the documents lesson. With `fs.promises`, every read and write is an `await`, so the gap is real. Whatever you chose, a lock or a version check, it must cover the whole read, change and write.

**Half-written files.** `fs.writeFile` first empties the file, then writes the new contents. A crash in between, or a read at the wrong moment, sees an empty or cut-off file, and `JSON.parse` throws. The fix is to write the new version to a different file, then rename it over the old one. On the same disk, a rename is atomic: anyone opening the file gets the whole old version or the whole new one.

```blanks
{
  "title": "Save the data file without ever leaving half of it",
  "note": "Every blank is a real decision.",
  "code": "async function save(file, data) {\n  const tmp = `${file}.___1___`;\n  await fs.___2___(tmp, JSON.stringify(data));\n  await fs.___3___(tmp, file);\n}",
  "blanks": [
    { "options": ["tmp", "json", "bak"], "answer": "tmp", "explain": "Any name works as long as it's a separate file next to the real one, on the same disk. A clear name like .tmp tells the next reader what it's for." },
    { "options": ["writeFile", "appendFile", "rename"], "answer": "writeFile", "explain": "Write the complete new version into the temporary file first. If the program dies here, the real file is untouched." },
    { "options": ["rename", "copyFile", "writeFile"], "answer": "rename", "explain": "A rename replaces the real file in one step. Copying or writing again would bring back the moment where the file is half done." }
  ]
}
```

## Build it with your agent

Give the agent the README, your plan and your drawing of the file. Ask for a new store, `src/doc-store.js` or whatever you like, with the same functions as your Postgres store, and for `createApp` to pick it when it gets a `dataFile`.

Review the diff against this list:

- **Every change is one locked read, change and write** (or one version-checked write with a retry). No `await` between reading the data and saving it, outside the lock.
- **Checks before changes.** All the "is there enough stock" and "does this customer exist" checks happen before anything in the data is changed, so a 409 or a 400 leaves nothing half done.
- **Every copy is updated by every change that affects it.** Find each place that changes an order's status and check it also updates whatever you copied.
- **The file is saved with a temporary file and a rename.**
- **A missing file means an empty store**, so the first run works.
- **Ids keep counting up after a restart.** They come from the file. A counter that starts at 1 on every run hands out ids that already exist.

## Your tests

You owe at least 16 passing tests in this part. Add tests for the document store:

- Write, close the app, start a new one on the same file, and read everything back.
- A retry with the same `Idempotency-Key` after a restart.
- Two orders for the last item at once, on the document store.
- Twenty orders at once on different products. All of them saved, after a restart too.
- Customer totals after orders, a cancel, a second cancel, a failed order and a restart.

Use a fresh file in the system's temporary folder for each test, so tests never share data:

```js
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const newFile = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), "orders-")), "data.json");
```

Keep your Postgres tests too. Both stores must pass.

If a test fails only sometimes, suspect a race. Draw two requests as two columns and find the `await` where the second one steps in. Don't spend more than 30 minutes before bringing it to office hours.

## Write your decision memo

Open `orders/MEMO.md`. It asks five questions:

1. How your Postgres version stops two orders taking the last item, with the exact statement, and why your first version didn't.
2. A conditional update versus `SELECT ... FOR UPDATE`, and a lock versus a conflict check for your file. What you chose, what it costs, and when you'd pick the other.
3. Which data you copied between documents and what keeps it in sync. One question that's easy with tables and hard with your documents, and one the other way round. Which you'd ship, and why.
4. What breaks first at 100 times the orders, what you'd change and what that costs.
5. What you'd do differently.

The same rules as every memo:

- **Your own words.** No agent writes it. An agent may read it afterwards and tell you where it's unclear.
- **Say what it costs.** Every choice gives something up. Name it.
- **Short.** A paragraph per question. Pick a position.

The hidden tests only check that each question has a real answer. Your mentor reads what it says and will ask you about it.

## Hand it in

Commit and push, then paste the link to your `parsity-labs` repository.

```submit
assignment: orders-4
```

We need `orders/src/app.js`, `orders/src/migrate.js`, `orders/MEMO.md` and at least 16 passing tests of yours. Then ours run against a fresh data file each time: each order stored as one document with its items, data and retries across a restart, totals that stay in sync, many writes at once with none lost, the last item fought over, every rule from the earlier parts, the Postgres version, and your memo.

When this passes, the project is done.

## Tell the story

At your next mentor session, explain this project out loud, without notes:

- What you built, in two sentences.
- The hardest part, and how you got through it. For most people it's the first time they watched their own code sell one item twice.
- One decision you made and what it cost.

This project is one of the best stories you'll have in interviews. "Two customers bought the last item at the same moment, here's how I found it and here's the one SQL statement that fixed it" is exactly what an interviewer wants to hear.

## Stretch

Put a cache in front of `GET /products/:id`: keep each product in memory after the first read, with an expiry of a few seconds. Then decide what must happen to the cached copy when an order changes the stock, and write a test that fails if a stale stock number is ever shown after an order. Add a paragraph to your memo about whether the cache was worth it.

```quiz
[
  {
    "q": "Your file store uses fs.writeFile directly. Under load, a few requests fail with 'Unexpected end of JSON input'. What's happening?",
    "options": ["A read is landing while a write has emptied the file and not finished, so it sees half a file", "The JSON is too big", "Two orders got the same id", "fs.writeFile is asynchronous and never finishes"],
    "answer": 0,
    "explain": "writeFile empties the file before writing. Writing to a temporary file and renaming it over the real one means readers only ever see a whole file."
  },
  {
    "q": "Each customer document keeps totalSpentCents. Placing an order updates it, and so does cancelling. Six months later someone adds refunds. What's the risk?",
    "options": ["The refund code forgets to update the copy, and totals drift without any error", "Refunds will be slower", "The file will get too big", "None, because the copy is updated on orders and cancels"],
    "answer": 0,
    "explain": "A copy that must stay current has to be updated by every change that affects it, including ones nobody has written yet. That ongoing cost belongs in your memo."
  },
  {
    "q": "Your file store uses an in-process lock. A teammate wants to run two copies of the server on the same file. What do you tell them?",
    "options": ["Each copy has its own lock, so they can overwrite each other's writes. Sharing data between servers needs a real database that does the check for you", "It's fine, the lock is in the file", "It's fine, Node runs one thing at a time", "Only reads will be affected"],
    "answer": 0,
    "explain": "A lock held in one process's memory means nothing to another process. Even a version check in your own code has a gap between reading the version and renaming the file, so two processes can both pass it. A database, or a document store with conditional writes, does the check and the write as one step for every server."
  }
]
```

## Key takeaways

- A document store design starts with drawing the documents: what each embeds, and which copies must stay current.
- Every read, change and write of a document must be locked or version-checked as one unit.
- Write a new file and rename it over the old one, so no one ever reads half a file.
- Copies that must stay current cost something forever: every future change has to update them.
- A decision memo states each choice and what it gives up. That's what you'll be asked about.

## Work with AI

```ai-prompt
title: Tell me where my memo is unclear
---
I finished a project where I built an order API three ways: in memory, in Postgres
with conditional updates to stop overselling, and as JSON documents in a file with a
lock or version check. I wrote a decision memo in my own words. I'll paste it. Don't
rewrite it and don't add content. For each answer, tell me: did I state a clear
choice, did I say what it costs, and is anything vague or technically wrong? Quote
the exact sentence you mean. Then ask me the one follow-up question a senior engineer
would most likely ask about it, and wait for my answer.
```
