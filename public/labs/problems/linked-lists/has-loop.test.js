const test = require("node:test");
const assert = require("node:assert");
const { fromArray, withLoop } = require("./list.js");
const { hasLoop } = require("./has-loop.js");

test("a chain that ends", () => {
  assert.strictEqual(hasLoop(fromArray([1, 2, 3])), false);
});

test("the last node points back to the second", () => {
  assert.strictEqual(hasLoop(withLoop([1, 2, 3, 4], 1)), true);
});

test("the last node points back to the head", () => {
  assert.strictEqual(hasLoop(withLoop([1, 2, 3], 0)), true);
});
