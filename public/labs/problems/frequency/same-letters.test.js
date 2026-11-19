const test = require("node:test");
const assert = require("node:assert");
const { sameLetters } = require("./same-letters.js");

test("the same letters in a different order", () => {
  assert.strictEqual(sameLetters("listen", "silent"), true);
});

test("one letter is different", () => {
  assert.strictEqual(sameLetters("cat", "car"), false);
});

test("different lengths", () => {
  assert.strictEqual(sameLetters("cats", "cat"), false);
});
