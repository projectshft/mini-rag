const test = require("node:test");
const assert = require("node:assert");
const { canReachEnd } = require("./reach-the-end.js");

test("a path that works", () => {
  assert.strictEqual(canReachEnd([2, 3, 1, 1, 4]), true);
});

test("every path lands on a zero", () => {
  assert.strictEqual(canReachEnd([3, 2, 1, 0, 4]), false);
});

test("one big jump", () => {
  assert.strictEqual(canReachEnd([5, 0, 0, 0, 0, 0]), true);
});
