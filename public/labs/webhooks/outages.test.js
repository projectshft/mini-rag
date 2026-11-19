// Milestone 3. Change false to true when you start it.
const MILESTONE_3 = false;

const test = require("node:test");
const assert = require("node:assert");
const { createDispatcher } = require("./dispatcher.js");
const { createFakeClock } = require("./fake-clock.js");

const skip = !MILESTONE_3;
const never = () => new Promise(() => {});

test("a send that never answers times out and is tried again", { skip }, async () => {
  const clock = createFakeClock();
  let calls = 0;
  const d = createDispatcher({
    clock,
    random: () => 0.5,
    maxAttempts: 2,
    timeoutMs: 5000,
    send: () => {
      calls++;
      return calls === 1 ? never() : Promise.resolve({ status: 200, headers: {} });
    },
  });
  d.subscribe("https://slow.example.com/x");
  d.publish({ id: "evt_1", type: "t", data: {} });
  await clock.advance(20000);
  assert.strictEqual(d.delivered().length, 1);
  assert.strictEqual(d.delivered()[0].attempts, 2);
});

test("a 429 with retry-after: 30 means no second attempt before 30 seconds", { skip }, async () => {
  const clock = createFakeClock();
  const times = [];
  const d = createDispatcher({
    clock,
    random: () => 0.5,
    maxAttempts: 3,
    send: async () => {
      times.push(clock.now());
      return times.length === 1 ? { status: 429, headers: { "retry-after": "30" } } : { status: 200, headers: {} };
    },
  });
  d.subscribe("https://busy.example.com/x");
  d.publish({ id: "evt_1", type: "t", data: {} });
  await clock.advance(60000);
  assert.strictEqual(times.length, 2);
  assert.ok(times[1] >= 30000, `second attempt at ${times[1]}`);
});

test("no more than perHostConcurrency sends to one host at once", { skip }, async () => {
  const clock = createFakeClock();
  let inFlight = 0;
  let most = 0;
  const d = createDispatcher({
    clock,
    concurrency: 10,
    perHostConcurrency: 2,
    send: async () => {
      inFlight++;
      most = Math.max(most, inFlight);
      await clock.sleep(1000);
      inFlight--;
      return { status: 200, headers: {} };
    },
  });
  d.subscribe("https://one.example.com/x");
  for (let i = 0; i < 10; i++) d.publish({ id: "evt_" + i, type: "t", data: {} });
  await clock.advance(10000);
  assert.strictEqual(most, 2);
  assert.strictEqual(d.delivered().length, 10);
});

test("after enough failures in a row, the breaker stops sends for the cooldown", { skip }, async () => {
  const clock = createFakeClock();
  const times = [];
  const d = createDispatcher({
    clock,
    concurrency: 1,
    maxAttempts: 10,
    random: () => 0,
    breaker: { failureThreshold: 3, cooldownMs: 10000 },
    send: async () => {
      times.push(clock.now());
      throw new Error("connection refused");
    },
  });
  d.subscribe("https://down.example.com/x");
  for (let i = 0; i < 5; i++) d.publish({ id: "evt_" + i, type: "t", data: {} });
  await clock.advance(9000);
  assert.strictEqual(times.length, 3);
});
