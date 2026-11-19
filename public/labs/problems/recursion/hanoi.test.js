const test = require("node:test");
const assert = require("node:assert");
const { hanoi } = require("./hanoi.js");

test("one disk is one move", () => {
  assert.deepStrictEqual(hanoi(1, "A", "C", "B"), [["A", "C"]]);
});

test("two disks", () => {
  assert.deepStrictEqual(hanoi(2, "A", "C", "B"), [
    ["A", "B"],
    ["A", "C"],
    ["B", "C"],
  ]);
});

test("three disks take seven moves", () => {
  assert.strictEqual(hanoi(3, "A", "C", "B").length, 7);
});
