const test = require("node:test");
const assert = require("node:assert");
const { createDispatcher } = require("./dispatcher.js");
const { createFakeClock } = require("./fake-clock.js");

test("an event reaches its subscriber", async () => {
  const sent = [];
  const d = createDispatcher({
    clock: createFakeClock(),
    send: async (req) => {
      sent.push(req);
      return { status: 200, headers: {} };
    },
  });
  d.subscribe("https://hooks.example.com/orders", ["order.paid"]);
  d.publish({ id: "evt_1", type: "order.paid", data: { total: 40 } });
  await d.onIdle();
  assert.strictEqual(sent.length, 1);
  assert.strictEqual(sent[0].url, "https://hooks.example.com/orders");
  assert.deepStrictEqual(JSON.parse(sent[0].body), { id: "evt_1", type: "order.paid", data: { total: 40 } });
  assert.strictEqual(d.delivered().length, 1);
});

test("a 500 answer ends up in the dead letters", async () => {
  const d = createDispatcher({ clock: createFakeClock(), send: async () => ({ status: 500, headers: {} }) });
  d.subscribe("https://hooks.example.com/x");
  d.publish({ id: "evt_1", type: "anything", data: {} });
  await d.onIdle();
  assert.strictEqual(d.deadLetters().length, 1);
  assert.match(d.deadLetters()[0].reason, /500/);
});
