const test = require("node:test");
const assert = require("node:assert");
const { climbStairs } = require("./climb-stairs.js");

test("two steps", () => {
  assert.strictEqual(climbStairs(2), 2);
});

test("three steps", () => {
  assert.strictEqual(climbStairs(3), 3);
});

test("five steps", () => {
  assert.strictEqual(climbStairs(5), 8);
});
