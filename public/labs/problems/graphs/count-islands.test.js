const test = require("node:test");
const assert = require("node:assert");
const { countIslands } = require("./count-islands.js");

test("the map from the comment", () => {
  assert.strictEqual(countIslands(["##...", "##...", "..#..", "...##"]), 3);
});

test("one big island", () => {
  assert.strictEqual(countIslands(["###", "###"]), 1);
});

test("only water", () => {
  assert.strictEqual(countIslands(["...", "..."]), 0);
});
