const test = require("node:test");
const assert = require("node:assert");
const { TokenBucket, SlidingWindow, withRateLimit } = require("./limiter.js");

// A clock you control. Tests move time forward by calling advance.
function fakeClock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms) => (t += ms) };
}

test("a new bucket lets a burst through, up to its capacity", () => {
  const clock = fakeClock();
  const bucket = new TokenBucket({ capacity: 3, refillPerSecond: 1, now: clock.now });
  assert.strictEqual(bucket.check("ada").allowed, true);
  assert.strictEqual(bucket.check("ada").allowed, true);
  assert.strictEqual(bucket.check("ada").allowed, true);
  assert.strictEqual(bucket.check("ada").allowed, false);
});

test("a bucket refills as time passes", () => {
  const clock = fakeClock();
  const bucket = new TokenBucket({ capacity: 1, refillPerSecond: 2, now: clock.now });
  bucket.check("ada");
  assert.strictEqual(bucket.check("ada").allowed, false);
  clock.advance(500);
  assert.strictEqual(bucket.check("ada").allowed, true);
});

test("a sliding window allows the limit and then blocks", () => {
  const clock = fakeClock();
  const window = new SlidingWindow({ limit: 2, windowMs: 1000, now: clock.now });
  assert.strictEqual(window.check("ada").allowed, true);
  assert.strictEqual(window.check("ada").allowed, true);
  const third = window.check("ada");
  assert.strictEqual(third.allowed, false);
  assert.strictEqual(third.retryAfterMs, 1000);
});

test("old requests stop counting once the window has passed", () => {
  const clock = fakeClock();
  const window = new SlidingWindow({ limit: 1, windowMs: 1000, now: clock.now });
  window.check("ada");
  clock.advance(1500);
  assert.strictEqual(window.check("ada").allowed, true);
});

test("a blocked request gets a 429 and the handler doesn't run", () => {
  const clock = fakeClock();
  let calls = 0;
  const handler = () => {
    calls++;
    return { status: 200, headers: {}, body: "hello" };
  };
  const limited = withRateLimit(new SlidingWindow({ limit: 1, windowMs: 60000, now: clock.now }), handler);
  assert.strictEqual(limited({ ip: "1.2.3.4" }).status, 200);
  assert.strictEqual(limited({ ip: "1.2.3.4" }).status, 429);
  assert.strictEqual(calls, 1);
});
