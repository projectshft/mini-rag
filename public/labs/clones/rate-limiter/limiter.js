// A rate limiter, two ways. Your agent writes the code. You plan it first and
// review every line.
//
// Both limiters take a now() function that gives the time in milliseconds.
// It's passed in so tests can move time forward without waiting. Never call
// Date.now directly inside a limiter.
//
// Both have the same method, check(key). key says who is asking, such as an
// IP address or an account id. Each key has its own limit.
//
// check(key) decides whether this request may go ahead right now. If it may,
// it counts it. It gives back:
//
//   {
//     allowed: true or false,
//     remaining: how many more requests this key could make right now,
//                a whole number, 0 when blocked,
//     retryAfterMs: 0 when allowed. When blocked, how many milliseconds
//                until a request from this key would be allowed, rounded
//                up to a whole number.
//   }
//
// A request that's turned away doesn't count against the key.

// A bucket of tokens per key. Each key starts with a full bucket.
// Each request takes one token. Tokens drip back in at refillPerSecond,
// smoothly, including fractions of a token. The bucket never holds more
// than capacity.
class TokenBucket {
  constructor({ capacity, refillPerSecond, now = Date.now }) {}

  check(key) {}
}

// At most limit requests per key in any windowMs-long stretch of time.
// A request made at time t stops counting at exactly t + windowMs.
class SlidingWindow {
  constructor({ limit, windowMs, now = Date.now }) {}

  check(key) {}
}

// Wraps a request handler so it's rate limited by request.ip.
// handler(request) gives back { status, headers, body }.
//
// Allowed: call the handler and give back its response, with an extra
//   "x-ratelimit-remaining" header (a string).
// Blocked: don't call the handler. Give back status 429, a "retry-after"
//   header holding the number of whole seconds to wait as a string,
//   rounded up, and a body of { error: "Too many requests" }.
function withRateLimit(limiter, handler) {
  return (request) => {};
}

module.exports = { TokenBucket, SlidingWindow, withRateLimit };
