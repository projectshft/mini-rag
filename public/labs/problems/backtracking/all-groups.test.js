const test = require("node:test");
const assert = require("node:assert");
const { allGroups } = require("./all-groups.js");

function has(groups, wanted) {
  return groups.some((g) => JSON.stringify(g) === JSON.stringify(wanted));
}

test("a group of one item", () => {
  const groups = allGroups(["a", "b", "c"]);
  assert.ok(has(groups, ["b"]), "missing [b]");
});

test("groups of two keep the original order", () => {
  const groups = allGroups(["a", "b", "c"]);
  assert.ok(has(groups, ["a", "b"]), "missing [a, b]");
  assert.ok(has(groups, ["a", "c"]), "missing [a, c]");
  assert.ok(has(groups, ["b", "c"]), "missing [b, c]");
});

test("the group with everything", () => {
  const groups = allGroups(["a", "b", "c"]);
  assert.ok(has(groups, ["a", "b", "c"]), "missing [a, b, c]");
});
