const test = require("node:test");
const assert = require("node:assert");
const { smallestRotated } = require("./smallest-rotated.js");

test("turned by two", () => {
  assert.strictEqual(smallestRotated([3, 4, 5, 1, 2]), 1);
});

test("turned by three", () => {
  assert.strictEqual(smallestRotated([4, 5, 6, 7, 0, 1, 2]), 0);
});

test("the smallest is the last item", () => {
  assert.strictEqual(smallestRotated([2, 3, 4, 5, 1]), 1);
});
