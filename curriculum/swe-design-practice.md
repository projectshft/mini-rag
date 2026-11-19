# System Design: Practice Without a Build

> **In this lesson:** three design problems that come up again and again at work and in interviews: a news feed, a notification system, and the order system you built, at 100 times the traffic. There's no code. You'll use the eight-step method on each, learn the handful of ideas each one turns on, and hand in one complete written design for your mentor to push on.

## Words you need first

- **Fan-out.** Taking one event and delivering it to many places, such as one post appearing in a million feeds.
- **Hot spot.** One piece of data that gets far more traffic than the rest, such as the stock row for an item in a flash sale.
- **Read replica.** A read-only copy of a database that follows the main one, used to spread out reads.
- **Backoff.** Waiting longer after each failed attempt before trying again.
- **Idempotency key.** A unique id sent with a request so that if it's repeated, the server knows and does the work only once.

## How to work through these

For each prompt, before you open anything hidden:

1. Write the requirements and what's out of scope. Make up sensible answers to your own clarifying questions, and write them down as assumptions.
2. Do the numbers on paper.
3. Go through the data model, API, components, bottleneck, tradeoffs, and 10 and 100 times.
4. Only then open "What a strong design covers" and compare. Note what you missed and why.

Give each prompt a real attempt first. If you're stuck on one step for more than 20 minutes, write down what's blocking you, make an assumption, and move on. Interviewers would rather see an assumption stated out loud than a stalled answer.

## Prompt 1: A news feed

> **Design the home feed for a social app.** People follow other accounts. Each account posts short text with an optional photo. Your home feed shows recent posts from everyone you follow, newest first.

Numbers to start from:

- 20 million accounts, 5 million use it on a given day.
- About 1 million new posts a day.
- Each daily user opens the feed about 10 times a day.
- The average account follows 200 others. A few accounts have tens of millions of followers.
- Ranking by what's interesting is out of scope. Newest first.

The idea this one turns on is **fan-out**. When someone posts, their followers' feeds need it. There are two ways to get it there:

- **Fan-out when posting.** Each user has a ready-made feed, a list of post ids. When someone posts, add the new post's id to every follower's list. Reading a feed is then one quick lookup. Posting is expensive: one post from an account with 200 followers is 200 writes.
- **Fan-out when reading.** Store each account's own posts. When someone opens their feed, fetch the recent posts of everyone they follow and merge them. Posting is one write. Reading is expensive: 200 lookups and a merge, on every open.

Do the numbers for both. Then think hard about the accounts with tens of millions of followers.

<details>
<summary>What a strong design covers. Open after you've written yours</summary>

- **The numbers.** 50 million feed opens a day is about 500 a second, a few thousand at peak. Fan-out when posting means about 1 million × 200 = 200 million feed writes a day, about 2,000 a second. Reads outnumber posts by about 50 to 1, which argues for doing the work at posting time.
- **The celebrity problem.** One post from an account with 30 million followers means 30 million writes, and that account's followers wait while they happen. A common answer is a **hybrid**: fan out when posting for ordinary accounts, and for the few very large accounts, fetch their recent posts when reading and merge them in.
- **Feeds hold post ids only.** Each feed is a list of the most recent few hundred post ids, kept in a fast in-memory store. The post text and photo are fetched separately, from a cache of posts. A post edited or deleted changes in one place.
- **Deletes.** Rather than removing a deleted post from millions of feeds, filter it out when reading.
- **Inactive users.** Don't fan out to accounts that haven't opened the app in a month. Build their feed when they come back.
- **Pagination** with a cursor, the id of the last post seen, so new posts arriving don't shift the pages.
- **Consistency.** Eventual is fine: a post appearing in followers' feeds a few seconds late harms nobody. The author must see their own post straight away.
- **At 100 times**, the in-memory feed store is split across many machines by user id, and the fan-out work runs through a queue with many workers so posting stays fast.

</details>

## Prompt 2: A notification system

> **Design the notification system for an online shop.** It tells customers things by email, text message and phone push notification: order confirmations, shipping updates, password resets, a weekly digest, and marketing campaigns.

Numbers to start from:

- 10 million customers.
- About 20 million notifications a day on a normal day.
- A marketing campaign sometimes goes to 5 million people at once.
- A password reset must arrive within seconds, even during a campaign.
- The email provider accepts a limited number of messages a second. Text messages cost money each.
- Customers choose which kinds of message they get on which channel, and must be able to unsubscribe from marketing.

The ideas this one turns on are **separating urgent from bulk**, and **delivering at least once without sending twice**. Other teams call your system when something happens: "order 1042 shipped". Everything after that is yours.

<details>
<summary>What a strong design covers. Open after you've written yours</summary>

- **An API other teams call** with an event and a user, never the message text. Your system decides the channel, the template and whether to send at all.
- **Preferences checked first.** Look up what this customer allows. Unsubscribed from marketing means never, and in many countries that's the law. Quiet hours need the customer's time zone.
- **Separate queues by priority.** Password resets and order updates go in one queue, campaigns and digests in another, each with its own workers. A 5-million-message campaign can't sit in front of a password reset.
- **One worker type per channel**, each knowing its provider's rate limit and sending no faster. A campaign of 5 million at a provider limit of, say, 1,000 a second takes well over an hour, so say so to whoever schedules campaigns.
- **Retries with backoff** when a provider fails, with a cap on attempts, then a record that it failed. A second provider to fail over to, for urgent messages.
- **Duplicates.** Queues deliver at least once, so a worker may get the same message twice. Each message carries an idempotency key built from the event, the user and the channel, and the worker records it before sending. Seen it already? Skip it.
- **Delivery records**, so support can answer "did my reset email go out?"
- **Cost.** Text messages cost money each. Prefer push or email where the customer allows it, and never send a text for marketing by default.
- **Digests** gather events over a week into one message, which needs a store of pending items per user and a scheduled job.

</details>

## Prompt 3: Your order system at 100 times the traffic

> **Take the order and inventory API you built and design it for 100 times the traffic.** Then design for a flash sale: a popular item, 1,000 units, and 50,000 people trying to buy it in the same minute.

Start from your own project. Say it handles about 2,000 orders a day today. Assume product pages are read about 100 times for every order.

Numbers to work out yourself: orders a second at 100 times, product page reads a second, and what the flash sale does to the single row holding that item's stock.

You built the conditional update that stops two orders taking the last item. It's still correct at 100 times. The question is what it does when 50,000 requests all want the same row.

<details>
<summary>What a strong design covers. Open after you've written yours</summary>

- **The numbers.** 200,000 orders a day is about 2 a second, maybe 20 at peak. A single Postgres server handles that. Product reads at 100 to 1 are about 200 a second, a few thousand at peak. Normal traffic at 100 times is mostly a read problem.
- **Reads.** Product pages and images go behind a CDN and a cache with a short expiry. The stock number shown on a page can be a little stale. The stock decrement at checkout cannot, so it always happens in the database.
- **The flash sale is a hot spot.** 50,000 checkouts on one row in a minute is over 800 a second against one row. Every one waits its turn for the row lock. Correct, but slow, and the slowness spreads: connections pile up and the rest of the shop slows too.
- **Ways out of the hot spot**, each with a cost:
  - A **waiting room**: put buyers in a queue and let them into checkout at a rate the database handles. Fair and simple. Users wait.
  - **Split the stock** into, say, 10 rows of 100 units each, and spread buyers across them. Less waiting per row. Handling "this row is empty, try another" is more code.
  - **Reserve, then pay.** Take a unit when the buyer starts checkout, hold it for a few minutes, and release it if they don't pay. Nobody pays for an item that's gone. Abandoned holds need a cleanup job.
- **Idempotency keys on checkout**, so a buyer who taps "Pay" twice, or a phone that retries after a timeout, makes one order.
- **Work after the order** (emails, warehouse, analytics) goes through a queue. Write the message to an outbox table in the same transaction as the order, and have a worker send it, so you never save an order and lose its message.
- **Connections.** If checkout runs on serverless functions, thousands of copies can each open a database connection. A connection pooler between them and Postgres keeps the count sane.
- **Order history** reads go to a read replica, with the customer's own just-placed order read from the main database.
- **The payment provider** has rate limits too. A flash sale can hit them before your database struggles.

</details>

```match
{
  "title": "Which idea fixes it?",
  "note": "Tap the problem, then the idea that fits it best.",
  "pairs": [
    { "left": "One post from a huge account means millions of feed writes", "right": "Fetch that account's posts at read time and merge them in" },
    { "left": "A marketing campaign delays password reset emails", "right": "Separate queues for urgent and bulk messages" },
    { "left": "A phone retries a checkout after a timeout and makes two orders", "right": "An idempotency key on the checkout request" },
    { "left": "50,000 buyers all update one stock row in a minute", "right": "A waiting room that lets buyers in at a steady rate" },
    { "left": "The email provider rejects messages when you send too fast", "right": "Workers that send at the provider's limit and retry with backoff" }
  ]
}
```

```scenario
{
  "who": "Your interviewer",
  "setting": "A design interview. You've just described fan-out when posting for the news feed.",
  "ask": "Okay. What happens when someone with 30 million followers posts?",
  "options": [
    { "text": "That post alone is 30 million feed writes, which would take a while and delay everyone's feed. So I'd treat the very largest accounts differently: no fan-out for them. When you open your feed, I take your ready-made feed and merge in recent posts from the few large accounts you follow. Reads get slightly more expensive, only for those accounts.", "verdict": "best", "feedback": "It does the arithmetic out loud, names the cost, and proposes a targeted fix that keeps the design for everyone else." },
    { "text": "We'd add more workers so the 30 million writes happen faster.", "verdict": "ok", "feedback": "It helps, and it's part of the answer at scale. But it spends a lot of work on one post, much of it for followers who won't open the app today. The interviewer will ask what it costs." },
    { "text": "I'd switch the whole design to fan-out when reading instead.", "verdict": "weak", "feedback": "It fixes the rare case by making every feed open, thousands a second, do hundreds of lookups. The follow-up question is about read cost, and the answer isn't good." },
    { "text": "That's an edge case. Most accounts are small.", "verdict": "weak", "feedback": "Those accounts are why many people use the app, and the interviewer asked on purpose. Dismissing it reads as not having thought about it." }
  ]
}
```

## Hand it in

Make a folder called `designs` at the top of your `parsity-labs` repository.

1. **One complete design.** Pick one of the three prompts and write it up in full in `designs/<prompt>.md`, for example `designs/news-feed.md`, using the template below. Your own words. An agent may read it afterwards and ask you questions, and may not write any of it.
2. **Rough notes for the other two**, in one file, `designs/notes.md`: at least the requirements, the numbers, the components and the bottleneck for each.

```
# Design: <name>

## 1. Requirements
Functional:
Non-functional:
Out of scope:
Assumptions I made:

## 2. Rough numbers
(show the arithmetic)

## 3. Data model

## 4. API

## 5. Components
(a drawing: a photo of paper, or an image from a drawing tool, linked here)

## 6. The bottleneck

## 7. Tradeoffs
| Choice | What it buys | What it costs |

## 8. At 10 and 100 times
```

Before you hand it in, check it yourself:

- Every component traces to a requirement or a number. Point at which.
- The arithmetic is shown, not just the answers.
- At least three tradeoffs, each with a real cost.
- Something you said is out of scope, and something you said you'd change at 100 times.

Commit and push. **Your mentor reads it and checks it**, then asks you to defend it at your next session: expect "why this and not that?" about your two biggest choices, and a change to the numbers to see if your design bends or breaks. No grader is involved, because a design has no single right answer to test against.

```quiz
[
  {
    "q": "A news feed gets about 50 feed opens for every post. Which approach does that favor for ordinary accounts?",
    "options": ["Fan-out when posting, so the frequent action, reading, is a quick lookup", "Fan-out when reading, so posting is one write", "Neither, the ratio doesn't matter", "Storing the whole feed in the posts table"],
    "answer": 0,
    "explain": "Do the expensive work on the rare action. With reads far more frequent, it's cheaper overall to build feeds when posts are made."
  },
  {
    "q": "During a 5-million-message campaign, password reset emails take 40 minutes to arrive. What's the design fix?",
    "options": ["Put urgent and bulk messages in separate queues with their own workers", "Buy a faster email provider", "Send the campaign as one big email", "Retry the password resets more often"],
    "answer": 0,
    "explain": "The resets were stuck behind the campaign in one line. Separate queues mean urgent messages never wait behind bulk ones."
  },
  {
    "q": "In a flash sale, the conditional update on the stock row keeps stock correct, but the whole shop slows down. Why?",
    "options": ["Every checkout waits for a lock on the same row, so requests and connections pile up behind it", "The conditional update has a bug", "The product page cache is too big", "Postgres can't handle 1,000 rows"],
    "answer": 0,
    "explain": "Correctness holds, because each update waits its turn. The waiting is the problem: thousands of requests holding connections while they queue for one row."
  }
]
```

## Key takeaways

- Every design problem has one or two ideas it turns on. Find them with the numbers before reaching for components.
- Do expensive work on the rare action: fan-out when posting suits a feed because reads far outnumber posts.
- Very large accounts, flash-sale items and campaigns are hot spots. Treat them separately so everyone else isn't slowed down.
- Separate urgent work from bulk work, and send no faster than the other side allows.
- At-least-once delivery and retrying clients both make duplicates. Idempotency keys make repeats harmless.
- State your assumptions out loud. A stated assumption is a design decision, and silence is a gap.

## Work with AI

```ai-prompt
title: Change the numbers on me
---
I'm practicing system design. I'll paste a design I wrote using this method:
requirements, rough numbers, data model, API, components, bottleneck, tradeoffs, and
10 and 100 times. Don't rewrite it or add components. First, check my arithmetic and
point to any number that's off by more than a factor of ten. Then change one thing
about the situation, such as traffic ten times spikier, a new rule that data must
stay in one country, or a provider that halves its rate limit, and ask me what in my
design bends or breaks. Wait for my answer. Do this three times, with a different
change each time. End by naming the one tradeoff in my design I explained least well.
```
