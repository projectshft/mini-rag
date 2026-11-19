// Watch the dispatcher work with a real clock. Already written.
//   node demo.js
// The pretend subscriber fails half the time. Until milestone 2, failures go
// straight to the dead letters. After it, they're retried.
const { createDispatcher, realClock } = require("./dispatcher.js");

const started = Date.now();
const log = (msg) => console.log(`${String(Date.now() - started).padStart(5)}ms  ${msg}`);

const d = createDispatcher({
  clock: realClock,
  concurrency: 3,
  maxAttempts: 4,
  baseDelayMs: 200,
  maxDelayMs: 2000,
  send: async ({ url, body, headers }) => {
    await realClock.sleep(50 + Math.random() * 100);
    const status = Math.random() < 0.5 ? 503 : 200;
    log(`${JSON.parse(body).id} -> ${url}  key=${headers["idempotency-key"] || "none"}  ${status}`);
    return { status, headers: {} };
  },
});

d.subscribe("https://shop.example.com/hooks", ["order.paid"]);
d.subscribe("https://crm.example.com/hooks");
for (let i = 1; i <= 5; i++) d.publish({ id: "evt_" + i, type: "order.paid", data: { order: i } });

Promise.resolve(d.onIdle()).then(() => {
  log(`delivered ${(d.delivered() || []).length}, dead ${(d.deadLetters() || []).length}`);
});
