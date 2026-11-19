const test = require("node:test");
const assert = require("node:assert");
const { pairSum } = require("./pair-sum.js");

test("the pair at the start", () => {
  assert.deepStrictEqual(pairSum([2, 7, 11, 15], 9), [0, 1]);
});

test("the pair is not next to each other", () => {
  assert.deepStrictEqual(pairSum([3, 2, 4], 6), [1, 2]);
});

test("no pair adds up", () => {
  assert.strictEqual(pairSum([1, 2, 3], 100), null);
});
