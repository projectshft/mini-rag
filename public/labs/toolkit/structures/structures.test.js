const test = require("node:test");
const assert = require("node:assert");
const { Stack, Queue, HashMap } = require("./structures.js");

test("a stack gives back the last item first", () => {
  const s = new Stack();
  s.push("a");
  s.push("b");
  assert.strictEqual(s.pop(), "b");
  assert.strictEqual(s.pop(), "a");
});

test("peek on a stack doesn't remove the item", () => {
  const s = new Stack();
  s.push(1);
  assert.strictEqual(s.peek(), 1);
  assert.strictEqual(s.size(), 1);
});

test("a new stack is empty", () => {
  assert.strictEqual(new Stack().isEmpty(), true);
});

test("a queue gives back the first item first", () => {
  const q = new Queue();
  q.enqueue("a");
  q.enqueue("b");
  assert.strictEqual(q.dequeue(), "a");
  assert.strictEqual(q.dequeue(), "b");
});

test("dequeue on an empty queue gives undefined", () => {
  assert.strictEqual(new Queue().dequeue(), undefined);
});

test("a hash map stores and finds a value", () => {
  const m = new HashMap();
  m.set("ada", 36);
  assert.strictEqual(m.get("ada"), 36);
  assert.strictEqual(m.has("ada"), true);
});

test("a hash map gives undefined for a missing key", () => {
  assert.strictEqual(new HashMap().get("nobody"), undefined);
});

test("setting the same key twice replaces the value", () => {
  const m = new HashMap();
  m.set("ada", 36);
  m.set("ada", 37);
  assert.strictEqual(m.get("ada"), 37);
  assert.strictEqual(m.size(), 1);
});

// These eight are a start. Add at least eight more of your own below.
// Think about: empty structures, deleting, many items, and keys that collide.
