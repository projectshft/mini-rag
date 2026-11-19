// Milestone 2. Change false to true when you start it.
const MILESTONE_2 = false;

const test = require("node:test");
const assert = require("node:assert");
const { createDispatcher } = require("./dispatcher.js");
const { createReceiver } = require("./receiver.js");
const { createFakeClock } = require("./fake-clock.js");

const skip = !MILESTONE_2;

test("a delivery that fails twice and then works is delivered on the third attempt", { skip }, async () => {
  const clock = createFakeClock();
  let calls = 0;
  const d = createDispatcher({
    clock,
    random: () => 0.5,
    maxAttempts: 5,
    send: async () => {
      calls++;
      return { status: calls < 3 ? 503 : 200, headers: {} };
    },
  });
  d.subscribe("https://hooks.example.com/x");
  d.publish({ id: "evt_1", type: "t", data: {} });
  await clock.advance(60000);
  assert.strictEqual(d.delivered()[0].attempts, 3);
});

test("a 404 is not retried", { skip }, async () => {
  const clock = createFakeClock();
  let calls = 0;
  const d = createDispatcher({
    clock,
    maxAttempts: 5,
    send: async () => {
      calls++;
      return { status: 404, headers: {} };
    },
  });
  d.subscribe("https://hooks.example.com/x");
  d.publish({ id: "evt_1", type: "t", data: {} });
  await clock.advance(60000);
  assert.strictEqual(calls, 1);
  assert.strictEqual(d.deadLetters().length, 1);
});

test("every attempt carries the same idempotency key", { skip }, async () => {
  const clock = createFakeClock();
  const keys = [];
  const d = createDispatcher({
    clock,
    maxAttempts: 3,
    send: async (req) => {
      keys.push(req.headers["idempotency-key"]);
      return { status: 500, headers: {} };
    },
  });
  d.subscribe("https://hooks.example.com/x");
  d.publish({ id: "evt_1", type: "t", data: {} });
  await clock.advance(60000);
  assert.strictEqual(keys.length, 3);
  assert.ok(keys[0]);
  assert.strictEqual(new Set(keys).size, 1);
});

test("the receiver handles a repeated delivery only once", { skip }, async () => {
  let handled = 0;
  const r = createReceiver({ handle: async () => handled++ });
  const request = { headers: { "idempotency-key": "k1" }, body: JSON.stringify({ id: "evt_1", type: "t", data: {} }) };
  assert.strictEqual((await r.receive(request)).status, 200);
  assert.strictEqual((await r.receive(request)).status, 200);
  assert.strictEqual(handled, 1);
});
