const test = require("node:test");
const assert = require("node:assert");
const { fullName, initials, totalWithTip } = require("./values.js");

test("fullName joins first and last with a space", () => {
  assert.strictEqual(fullName("Ada", "Lovelace"), "Ada Lovelace");
});

test("initials gives two capital letters", () => {
  assert.strictEqual(initials("Ada", "Lovelace"), "AL");
});

test("initials capitalizes lowercase names", () => {
  assert.strictEqual(initials("ada", "lovelace"), "AL");
});

test("totalWithTip adds the tip to the bill", () => {
  assert.strictEqual(totalWithTip(50, 20), 60);
});

test("totalWithTip rounds to cents", () => {
  assert.strictEqual(totalWithTip(19.99, 15), 22.99);
});
