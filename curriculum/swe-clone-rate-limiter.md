# Clone: A Rate Limiter

> **In this lesson:** you build the piece of software that answers "too many requests, slow down": a token bucket and a sliding window, both tested with a clock you control. Then you design one limit that holds across 20 servers at once. It's the second of three clones.

## Words you need first

- **Rate limit.** A cap on how many requests one caller may make in some stretch of time, like 100 a minute.
- **Key.** Who the limit belongs to: an IP address, an account or an API key. Each key gets its own count.
- **Token bucket.** A limiter that gives each key a bucket of tokens. Each request spends one. Tokens drip back in at a steady rate.
- **Sliding window.** A limiter that counts a key's requests in the last stretch of time, measured back from right now.
- **429 Too Many Requests.** The status code for "you're over the limit", usually with a `retry-after` header saying how many seconds to wait.

## Why limit at all

Every public API has a rate limiter in front of it. It protects three things:

- **The service.** One buggy script in a loop can send more requests than every real customer put together.
- **Fairness.** One heavy customer shouldn't make the service slow for everyone else.
- **Money.** If each request calls a paid model or sends an email, an unlimited caller is an unlimited bill.

You've been on the other side of this. The class key you use for model calls has a limit, and the webhooks project later in this part has to respect other people's limits. Building one shows you what the other side is counting.

## The obvious way, and its flaw

The first idea most people have: count each key's requests per minute, and reset the count when the clock reaches a new minute. That's a **fixed window**.

It's simple, and it has a hole. With a limit of 100 a minute:

| Time | Requests | Allowed by a fixed window? |
| --- | --- | --- |
| 12:00:59 | 100 | Yes, the 12:00 minute had none |
| 12:01:01 | 100 | Yes, a new minute started |

That's 200 requests in two seconds, from a limit of 100 a minute. Anyone who knows where your minute starts can double their limit. One hidden test does exactly this.

## Sliding window: look back from now

A sliding window keeps, for each key, the times of its recent requests. On each new request:

1. Drop every time that's `windowMs` or more in the past.
2. If fewer than `limit` are left, record this one and allow it.
3. Otherwise, block it.

There's no "start of the minute". The window is always the last 60 seconds measured from right now, so the boundary trick doesn't work.

Two details the hidden tests check:

- **The exact edge.** A request at time 0 with a window of 1000 stops counting at exactly 1000. At 999 it still counts. Whether you write `>` or `>=` decides it. Write a test for both sides.
- **Blocked requests don't count.** The starter says a request that's turned away isn't recorded. Otherwise a caller who keeps trying while blocked keeps pushing their own wait further out.

And one cost. Each key holds up to `limit` timestamps. A limit of 10,000 an hour means up to 10,000 numbers per key. Remove old ones from the front of the list without moving everything, the problem you solved for your queue in the toolkit project.

## Token bucket: a steady drip

A token bucket allows short bursts and a steady average. Each key has a bucket that holds up to `capacity` tokens. It starts full. A request takes one token. Tokens drip back in at `refillPerSecond`, and the bucket never holds more than `capacity`.

The trick is that you never run a timer to add tokens. You work out how many would have dripped in since you last looked, at the moment someone asks:

```blanks
{
  "title": "Refilling a bucket when a request arrives",
  "note": "Each blank is a choice people get wrong.",
  "code": "const elapsed = now() - bucket.last;\nbucket.tokens = Math.___1___(capacity, bucket.tokens + elapsed * refillPerSecond / 1000);\nbucket.last = ___2___;\nif (bucket.tokens >= 1) {\n  bucket.tokens = bucket.tokens - 1;\n  // allowed\n}",
  "blanks": [
    { "options": ["min", "max", "floor"], "answer": "min", "explain": "min keeps the bucket from holding more than capacity. Without it, a key that was quiet for an hour could fire thousands of requests at once." },
    { "options": ["now()", "bucket.last + 1000", "0"], "answer": "now()", "explain": "You've added everything that dripped in up to now, so now is the new starting point. Anything else counts the same time twice or loses it." }
  ]
}
```

Notice there's no `Math.floor` on the tokens. Here's why that matters, with a bucket of capacity 1 that refills 1 token a second, and a request every 600 milliseconds:

| Time | Tokens before | Allowed? | Tokens after |
| --- | --- | --- | --- |
| 0 | 1 | Yes | 0 |
| 600 | 0.6 | No | 0.6 |
| 1200 | 1.2 | Yes | 0.2 |
| 1800 | 0.8 | No | 0.8 |
| 2400 | 1.4 | Yes | 0.4 |

Keep fractions, and the caller gets the rate they were promised. Round down to whole tokens on each check, and 0.6 becomes 0 every time, the last-refill time moves forward anyway, and the bucket never refills. A caller making steady requests gets blocked forever. The visible tests miss this bug. A hidden one catches it.

When a request is blocked, `retryAfterMs` is how long until one token has dripped in: with 0.6 tokens at 1 a second, that's 400 milliseconds. Round it **up**. Rounding down tells the caller to come back a moment too early, so they're blocked again.

```order
title: One check of a token bucket
---
Find this key's bucket, or make a full one
Work out how long it's been since the bucket was last refilled
Add that many tokens, but never go over capacity
Remember now as the last refill time
If there's at least one token, take it and allow the request
Otherwise, block it and work out how long until one token is back
```

## Saying no politely

`withRateLimit(limiter, handler)` wraps a request handler. When a request is blocked, it answers `429` with a `retry-after` header in whole seconds, and the handler never runs.

Round the seconds up, and never send `0`. A wait of 300 milliseconds is `retry-after: 1`. A well-behaved client that reads `0` comes straight back, gets blocked, reads `0` again, and you've built a loop.

## Get the starter

If you did the URL shortener, you already have the `clones` folder. Don't download it again, because that would overwrite your work. If you don't have it, from the top of your `parsity-labs` repository:

```bash
curl -sL https://ai.parsity.io/labs/clones.tar.gz | tar xz
```

Work in `clones/rate-limiter`. `limiter.js` describes both limiters and `withRateLimit` in its comments. `limiter.test.js` has five tests and a `fakeClock` helper you'll use in your own.

## Plan before you prompt

Make a branch and write your plan before prompting. Answer:

- **What each limiter stores per key.** Write the shape of it.
- **The refill sum**, with a worked example: capacity 4, 2 tokens a second, empty bucket, a request 300 milliseconds later. How many tokens, allowed or not, and what's `retryAfterMs`?
- **The edge of the window.** Does a request exactly `windowMs` old still count? Which comparison gives the answer the starter asks for?
- **Removing old times.** How you drop old timestamps without searching or shifting the whole list on every request. A hidden test makes 300,000 checks.
- **Rounding.** Where you round, which way, and why.
- **Tests first.** At least one test for the 600-millisecond pattern in the table above, one for a burst on both sides of a window boundary, and one for the exact edge.

Give your agent the plan and ask for the tests first.

## Check the agent's work

- A `Math.floor` or `Math.round` anywhere near the token count.
- A missing cap at `capacity`. Test it: advance the clock an hour, then fire 50 requests.
- A blocked request that changes the stored count or tokens.
- A "sliding" window that's really a fixed window: look for `Math.floor(now / windowMs)`.
- `array.filter` over every timestamp on every request. It works, and it slows down as the list grows.
- Keys stored on a plain object, where a key like `constructor` or `__proto__` already exists. Use a `Map`.
- `Date.now()` called directly anywhere in `limiter.js`.

**You owe five tests.** At least ten must pass. From `clones/rate-limiter`:

```bash
node --test
```

If one test has you stuck for more than 30 minutes, write the trace table for it by hand, like the one above, and compare each row with what your code does.

## Design it across many servers

Your limiter keeps its counts in one process's memory. That's fine for one server. Open `DESIGN.md`. The starting point: a public API allows each customer 100 requests a minute, and next month it moves from one server to 20 behind a load balancer, which spreads requests across them.

Use the method from the lesson on how to think about a system. Some questions to work through:

**What happens if you change nothing?** Each server keeps its own counts. A customer whose requests are spread across 20 servers gets 100 a minute *from each one*: 2,000 a minute.

**Where do the counts live?** If they move to one shared store, such as Redis (a very fast in-memory database you'll meet properly in the cache lesson), every request now waits for a trip to that store. How long can you afford, on every request?

**Two servers at once.** Server A reads "1 token left". Server B reads "1 token left". Both allow a request and both write "0". Two requests got through on one token. You've seen this shape before, in the lesson on transactions. How do you make the read and the write happen as one step?

**When the store is down.** Do you allow every request (fail open) or block every request (fail closed)? Which hurts your customers more, and which hurts you more?

**How exact does it need to be?** An exact sliding window stores every timestamp. Big systems often use an approximation that stores two counters per key and blends them. Being off by a few requests can be a fine trade for using much less memory.

```scenario
{
  "who": "A teammate",
  "setting": "Planning the move to 20 servers. The limit is 100 requests a minute per customer.",
  "ask": "Why don't we just set each server's limit to 5 a minute? 20 times 5 is 100.",
  "note": "More than one answer is defensible. Pick the one you'd say.",
  "options": [
    { "text": "That only works if the load balancer spreads each customer's requests evenly, and it won't. A customer who lands on one server a lot gets cut off at 5 while the other 19 servers sit idle. It's a decent fallback for when the shared store is down, though.", "verdict": "best", "feedback": "This finds the hidden assumption, even spreading, and shows how it fails. Then it keeps the useful part of the idea as a fallback. That's how to disagree with a teammate." },
    { "text": "Sure, that's simple and it adds up.", "verdict": "weak", "feedback": "The arithmetic is right and the outcome isn't. Customers will be blocked at a fraction of their limit, and support will hear about it." },
    { "text": "No, we need Redis.", "verdict": "ok", "feedback": "Probably where you end up, but with no reason given it's a preference, not an argument. Say what goes wrong with the split first." },
    { "text": "It's fine if we make requests from each customer always go to the same server.", "verdict": "ok", "feedback": "This is a real technique, called sticky routing. It also means one server going down resets those customers' limits, and one huge customer can overload one server. Worth mentioning, with its costs." }
  ],
  "debrief": "Splitting a limit evenly assumes traffic is even. It almost never is."
}
```

Write the design yourself. The grader checks every section has real writing. Your mentor reads it for whether the reasoning holds up.

## Hand it in

```submit
assignment: clone-rate-limiter
```

We need `limiter.js` and `DESIGN.md` in `clones/rate-limiter`, and at least ten passing tests of yours. Ours check refills in small steps, a long quiet spell, the exact edge of the window, a burst on both sides of a boundary, the 429 answer, and hundreds of thousands of checks.

## Stretch

Keys never go away: a limiter that has seen a million IP addresses holds a million buckets forever. Add a way to forget keys that have been quiet for longer than they need to be remembered, and test that a forgotten key comes back with a full bucket, which is the right answer.

```quiz
[
  {
    "q": "A limit is 100 requests a minute, using a counter that resets at the start of each minute. What can a caller get away with?",
    "options": ["About 200 requests in a couple of seconds, by sending 100 just before the minute ends and 100 just after", "Nothing, the counter is exact", "Unlimited requests", "Only 50 requests a minute"],
    "answer": 0,
    "explain": "A fixed window forgets everything at the boundary. A sliding window looks back from now, so the first 100 still count when the second 100 arrive."
  },
  {
    "q": "A token bucket refills 1 token a second. Each check adds Math.floor(seconds since last check) tokens and then sets the last check time to now. Requests arrive every 600 milliseconds. What happens?",
    "options": ["The bucket never refills, because each check adds 0 and throws away the 0.6 seconds", "It works perfectly", "The caller gets twice the rate", "The first request is blocked"],
    "answer": 0,
    "explain": "Rounding down loses the fraction each time, and moving the last check time forward loses the time too. Keep fractional tokens instead."
  },
  {
    "q": "Twenty servers each run the limiter in their own memory, with a limit of 100 a minute. What limit does a customer really get?",
    "options": ["Up to 2,000 a minute, because each server counts separately", "Exactly 100 a minute", "5 a minute", "It depends only on the customer's internet speed"],
    "answer": 0,
    "explain": "Counts in memory are per process. The load balancer spreads requests, so each server sees part of the traffic and allows up to its own 100."
  }
]
```

## Key takeaways

- A fixed window lets a caller double their limit at the boundary. A sliding window looks back from now.
- A token bucket allows bursts up to its capacity and a steady rate after that. Work out the refill when a request arrives, keep fractions, and cap at capacity.
- Requests that are turned away shouldn't count, and the wait you report should be rounded up, never to zero.
- `>` versus `>=` at the edge of a window is a real decision. Test both sides of it.
- Counts in one process's memory don't survive more than one server. A shared store makes every check a network trip and a possible race.

## Work with AI

```ai-prompt
title: Trace my token bucket with me
---
I'm a beginner who just built a token bucket rate limiter. Don't write or fix code. Give
me a bucket (a capacity and a refill rate) and a list of six request times in
milliseconds, including at least one gap shorter than one token's worth and one long quiet
spell. Ask me to fill in a table: time, tokens before, allowed or not, tokens after, and
retryAfterMs when blocked. Wait for my table. Check every row, and for each wrong one tell
me which step I got wrong. Then do one more with a sliding window, including a request at
exactly the edge of the window.
```
