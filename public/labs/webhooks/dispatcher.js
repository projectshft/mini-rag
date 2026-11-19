// The webhook dispatcher. It delivers events to subscribers' URLs. Your agent
// writes the code. You plan each milestone first and review every line.
//
// createDispatcher(options) takes:
//
//   send      async ({ url, body, headers }) => ({ status, headers })
//             Delivers one webhook. In real use it makes an HTTP POST. In
//             tests it's a fake that can succeed, fail, throw, take a long
//             time, never answer at all, or answer 429. Header names in the
//             answer are lowercase.
//   clock     { now(), sleep(ms) }. Use it for every wait and every time.
//             Never call setTimeout or Date.now yourself.
//   random    () => a number from 0 up to 1, like Math.random. For jitter.
//
//   Milestone 1
//   concurrency         the most sends in flight at once. Default 5.
//
//   Milestone 2
//   maxAttempts         tries per delivery, counting the first. Default 1.
//   baseDelayMs         default 1000
//   maxDelayMs          default 60000
//
//   Milestone 3
//   timeoutMs           a send with no answer after this long has failed.
//                       Default 30000.
//   perHostConcurrency  the most sends in flight to one host, like
//                       hooks.example.com. Default: no extra limit.
//   breaker             { failureThreshold, cooldownMs }. Default: none.
//
// It gives back an object with:
//
//   subscribe(url, types)  types is an array of event types, or ["*"] for
//                          every type. Defaults to ["*"]. Gives back an id
//                          like "sub_1".
//   publish(event)         event is { id, type, data }. Queues one delivery
//                          for each subscriber whose types match. Gives back
//                          how many it queued.
//   onIdle()               a promise that resolves once every delivery has
//                          finished, delivered or dead.
//   delivered()            [{ eventId, subscriptionId, url, attempts }]
//   deadLetters()          [{ eventId, subscriptionId, url, attempts, reason }]
//                          deliveries that will never be tried again. reason
//                          is a short string that includes the status code
//                          when there was one, like "status 500".
//
// Every send gets body JSON.stringify(event) and the header
// "content-type": "application/json".
//
// An answer with a status from 200 to 299 means delivered.
//
// MILESTONE 1
//   Anything else, including send throwing, goes straight to deadLetters.
//   Nothing is ever lost: every delivery ends up in exactly one of the lists.
//
// MILESTONE 2
//   Retry when send throws, and on 408, 429 and 500 to 599. Dead-letter
//   anything else at once. Give up after maxAttempts.
//   The wait before each retry grows: at most baseDelayMs before the second
//   attempt, at most twice that before the third, and so on, never more than
//   maxDelayMs. Each wait has jitter: a random part, from random().
//   Every attempt of one delivery has the same "idempotency-key" header.
//   Every other delivery has a different one.
//   Publishing an event id that was already published queues nothing and
//   gives back 0.
//
// MILESTONE 3
//   A send that hasn't answered after timeoutMs has failed, and frees its
//   worker.
//   A 429 with a "retry-after" header, in whole seconds: wait that long
//   before the next attempt, and send nothing else to that host until then.
//   No more than perHostConcurrency sends in flight to one host.
//   The breaker: after failureThreshold failures in a row to one host
//   (thrown, timed out, 408, or 500 to 599), send nothing to it for
//   cooldownMs. Its deliveries wait, and waiting doesn't use up attempts.
//   Then let exactly one send through. If it works, carry on as normal. If
//   it fails, wait cooldownMs again. Any other answer means the host is up.

const realClock = {
  now: () => Date.now(),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

function createDispatcher({ send, clock = realClock, random = Math.random, concurrency = 5 } = {}) {
  return {
    subscribe(url, types = ["*"]) {},
    publish(event) {},
    onIdle() {},
    delivered() {},
    deadLetters() {},
  };
}

module.exports = { createDispatcher, realClock };
