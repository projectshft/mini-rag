const test = require("node:test");
const assert = require("node:assert");
const { bracketsMatch } = require("./brackets.js");

test("pairs side by side and inside each other", () => {
  assert.strictEqual(bracketsMatch("()[]{}"), true);
  assert.strictEqual(bracketsMatch("([]{})"), true);
});

test("the wrong kind of closing bracket", () => {
  assert.strictEqual(bracketsMatch("(]"), false);
});

test("other characters are ignored", () => {
  assert.strictEqual(bracketsMatch("if (x) { y[0] }"), true);
});
