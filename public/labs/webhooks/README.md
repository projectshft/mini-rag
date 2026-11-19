# Reliable webhooks

A system that delivers events to other companies' servers and keeps working
when they're slow, down or overwhelmed. Three milestones, one folder.

- Milestone 1: `queue.js` and the first half of `dispatcher.js`. A job queue
  with workers and a concurrency limit.
- Milestone 2: retries with backoff and jitter, dead letters, idempotency keys,
  and `receiver.js`.
- Milestone 3: timeouts, Retry-After, a limit per subscriber, a circuit
  breaker, and `MEMO.md`.

Run the tests with `node --test`. The tests for later milestones are switched
off at the top of `retries.test.js` and `outages.test.js`. Switch each file on
when you start that milestone.

`fake-clock.js` is a clock you control in tests, so nothing ever waits for
real. `demo.js` runs the dispatcher with a real clock against a pretend
subscriber that fails half the time, so you can watch it work.

Never run the download command again once you've started. It would overwrite
your work.
