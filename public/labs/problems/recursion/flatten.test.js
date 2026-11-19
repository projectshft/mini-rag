const test = require("node:test");
const assert = require("node:assert");
const { flatten } = require("./flatten.js");

test("already flat", () => {
  assert.deepStrictEqual(flatten([1, 2, 3]), [1, 2, 3]);
});

test("one level of nesting", () => {
  assert.deepStrictEqual(flatten([1, [2, 3], 4]), [1, 2, 3, 4]);
});

test("several levels of nesting", () => {
  assert.deepStrictEqual(flatten([1, [2, [3, [4]], 5]]), [1, 2, 3, 4, 5]);
});
