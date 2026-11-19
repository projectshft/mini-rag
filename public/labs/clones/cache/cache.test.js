const test = require("node:test");
const assert = require("node:assert");
const { Cache } = require("./cache.js");

// A clock you control. Tests move time forward by calling advance.
function fakeClock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms) => (t += ms) };
}

test("set then get gives the value back", () => {
  const c = new Cache({ maxEntries: 10, now: fakeClock().now });
  c.set("user:1", { name: "Ada" });
  assert.deepStrictEqual(c.get("user:1"), { name: "Ada" });
});

test("a missing key gives undefined", () => {
  const c = new Cache({ maxEntries: 10, now: fakeClock().now });
  assert.strictEqual(c.get("nope"), undefined);
});

test("an entry with a ttl is gone once the ttl has passed", () => {
  const clock = fakeClock();
  const c = new Cache({ maxEntries: 10, now: clock.now });
  c.set("a", 1, 1000);
  clock.advance(2000);
  assert.strictEqual(c.get("a"), undefined);
});

test("when full, the least recently used entry goes first", () => {
  const c = new Cache({ maxEntries: 2, now: fakeClock().now });
  c.set("a", 1);
  c.set("b", 2);
  c.get("a");
  c.set("c", 3);
  assert.strictEqual(c.has("a"), true);
  assert.strictEqual(c.has("b"), false);
});

test("getOrLoad calls the loader on a miss", async () => {
  const c = new Cache({ maxEntries: 10, now: fakeClock().now });
  const value = await c.getOrLoad("user:2", async () => "Grace");
  assert.strictEqual(value, "Grace");
  assert.strictEqual(c.get("user:2"), "Grace");
});
