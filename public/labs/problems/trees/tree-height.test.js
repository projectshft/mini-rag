const test = require("node:test");
const assert = require("node:assert");
const { fromArray } = require("./tree.js");
const { treeHeight } = require("./tree-height.js");

test("the tree from the comment", () => {
  assert.strictEqual(treeHeight(fromArray([3, 9, 20, null, null, 15, 7])), 3);
});

test("a full tree of seven", () => {
  assert.strictEqual(treeHeight(fromArray([1, 2, 3, 4, 5, 6, 7])), 3);
});

test("only right children", () => {
  assert.strictEqual(treeHeight(fromArray([1, null, 2, null, 3])), 3);
});
