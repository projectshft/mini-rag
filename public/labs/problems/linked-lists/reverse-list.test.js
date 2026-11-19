const test = require("node:test");
const assert = require("node:assert");
const { fromArray, toArray } = require("./list.js");
const { reverseList } = require("./reverse-list.js");

test("three nodes", () => {
  assert.deepStrictEqual(toArray(reverseList(fromArray([1, 2, 3]))), [3, 2, 1]);
});

test("five nodes", () => {
  assert.deepStrictEqual(toArray(reverseList(fromArray([5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5]);
});

test("the old last node is the new head", () => {
  const head = fromArray([1, 2]);
  const last = head.next;
  assert.strictEqual(reverseList(head), last);
});
