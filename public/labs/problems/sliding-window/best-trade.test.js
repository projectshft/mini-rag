const test = require("node:test");
const assert = require("node:assert");
const { bestTrade } = require("./best-trade.js");

test("buy low, sell later and higher", () => {
  assert.strictEqual(bestTrade([7, 1, 5, 3, 6, 4]), 5);
});

test("prices only fall", () => {
  assert.strictEqual(bestTrade([7, 6, 4, 3, 1]), 0);
});

test("prices only rise", () => {
  assert.strictEqual(bestTrade([1, 2, 3, 4, 5]), 4);
});
