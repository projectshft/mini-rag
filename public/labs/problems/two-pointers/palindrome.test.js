const test = require("node:test");
const assert = require("node:assert");
const { isPalindrome } = require("./palindrome.js");

test("a plain word", () => {
  assert.strictEqual(isPalindrome("level"), true);
  assert.strictEqual(isPalindrome("hello"), false);
});

test("capitals and spaces are ignored", () => {
  assert.strictEqual(isPalindrome("Race car"), true);
});

test("punctuation is ignored", () => {
  assert.strictEqual(isPalindrome("A man, a plan, a canal: Panama"), true);
});
