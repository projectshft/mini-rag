const test = require("node:test");
const assert = require("node:assert");
const { longestNoRepeat } = require("./longest-no-repeat.js");

test("a repeating pattern", () => {
  assert.strictEqual(longestNoRepeat("abcabcbb"), 3);
});

test("the best stretch is in the middle", () => {
  assert.strictEqual(longestNoRepeat("pwwkew"), 3);
});

test("no repeats at all", () => {
  assert.strictEqual(longestNoRepeat("abcdef"), 6);
});
