const test = require("node:test");
const assert = require("node:assert");
const { hasDuplicate, firstRepeat } = require("./speed.js");

test("hasDuplicate finds a repeated number", () => {
  assert.strictEqual(hasDuplicate([1, 2, 3, 2]), true);
});

test("hasDuplicate gives false when every number is different", () => {
  assert.strictEqual(hasDuplicate([1, 2, 3]), false);
});

test("hasDuplicate is fast on 100,000 numbers", () => {
  const numbers = [];
  for (let i = 0; i < 100000; i++) numbers.push(i);
  const started = Date.now();
  const answer = hasDuplicate(numbers);
  const took = Date.now() - started;
  assert.strictEqual(answer, false);
  assert.ok(took < 1000, "took " + took + "ms. It needs to finish in under a second.");
});

test("firstRepeat gives the first character seen twice", () => {
  assert.strictEqual(firstRepeat("abcbad"), "b");
});

test("firstRepeat gives null when nothing repeats", () => {
  assert.strictEqual(firstRepeat("abc"), null);
});
