const test = require("node:test");
const assert = require("node:assert");
const { findInSorted } = require("./find-in-sorted.js");

test("a number in the middle", () => {
  assert.strictEqual(findInSorted([1, 3, 5, 7, 9], 7), 3);
});

test("the first and the last", () => {
  assert.strictEqual(findInSorted([1, 3, 5, 7, 9], 1), 0);
  assert.strictEqual(findInSorted([1, 3, 5, 7, 9], 9), 4);
});

test("a number that is not there", () => {
  assert.strictEqual(findInSorted([1, 3, 5, 7, 9], 4), -1);
});
