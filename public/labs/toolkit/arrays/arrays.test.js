const test = require("node:test");
const assert = require("node:assert");
const { map, filter, reduce, find, unique } = require("./arrays.js");

test("map doubles every number", () => {
  assert.deepStrictEqual(map([1, 2, 3], (n) => n * 2), [2, 4, 6]);
});

test("filter keeps the even numbers", () => {
  assert.deepStrictEqual(filter([1, 2, 3, 4], (n) => n % 2 === 0), [2, 4]);
});

test("reduce adds numbers up", () => {
  assert.strictEqual(reduce([1, 2, 3], (total, n) => total + n, 0), 6);
});

test("find gives the first match", () => {
  assert.strictEqual(find([5, 12, 8], (n) => n > 6), 12);
});

test("find gives undefined when nothing matches", () => {
  assert.strictEqual(find([1, 2], (n) => n > 6), undefined);
});

test("unique keeps each value once, in first-seen order", () => {
  assert.deepStrictEqual(unique([3, 1, 3, 2, 1]), [3, 1, 2]);
});

// These six are a start. Add at least six more of your own below.
// Think about: empty arrays, the index argument, and whether the original array changes.
