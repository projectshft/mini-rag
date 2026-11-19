const test = require("node:test");
const assert = require("node:assert");
const { waysToTotal } = require("./ways-to-total.js");

function sum(list) {
  let total = 0;
  for (const n of list) total += n;
  return total;
}

test("one number on its own", () => {
  assert.deepStrictEqual(waysToTotal([7], 7), [[7]]);
});

test("the same number used more than once", () => {
  assert.deepStrictEqual(waysToTotal([2], 6), [[2, 2, 2]]);
});

test("every combination adds up to the target", () => {
  const ways = waysToTotal([2, 3, 6, 7], 7);
  assert.ok(ways.length > 0, "found nothing");
  for (const way of ways) assert.strictEqual(sum(way), 7);
});
