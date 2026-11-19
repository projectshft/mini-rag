const test = require("node:test");
const assert = require("node:assert");
const { mostWater } = require("./most-water.js");

test("the example from the comment", () => {
  assert.strictEqual(mostWater([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
});

test("two walls", () => {
  assert.strictEqual(mostWater([1, 1]), 1);
});

test("the tallest walls are not the best pair", () => {
  assert.strictEqual(mostWater([1, 2, 4, 3]), 4);
});
