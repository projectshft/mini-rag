const test = require("node:test");
const assert = require("node:assert");
const { fromArray, toArray } = require("./tree.js");
const { mirrorTree } = require("./mirror-tree.js");

test("a root with two children", () => {
  assert.deepStrictEqual(toArray(mirrorTree(fromArray([2, 1, 3]))), [2, 3, 1]);
});

test("the same root comes back", () => {
  const root = fromArray([2, 1, 3]);
  assert.strictEqual(mirrorTree(root), root);
});

test("an empty tree", () => {
  assert.strictEqual(mirrorTree(null), null);
});
