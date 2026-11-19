// Milestone 2. The other side: a server that receives webhooks and makes
// sure each one's work happens once, even when the same delivery arrives
// twice. Your agent writes the code. You plan it first and review every line.
//
// createReceiver({ handle })
//   handle(event) does the real work, like sending an email or charging a
//   card. It may be async. It may throw.
//
// It gives back { receive }.
//
// receive({ headers, body }) gives back a promise of { status, body }.
//   body is the JSON string the dispatcher sent.
//   No "idempotency-key" header: 400.
//   A key that was already handled: 200, and handle is not called again.
//   A key that's being handled right now: wait for that one to finish and
//     give back the same answer. handle is not called again.
//   handle throws: 500, and the key is not remembered, so a retry can try
//     again.
//   Otherwise: call handle with the parsed event, remember the key, give
//     back 200.

function createReceiver({ handle }) {
  return {
    async receive(request) {},
  };
}

module.exports = { createReceiver };
