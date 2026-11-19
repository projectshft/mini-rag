const test = require("node:test");
const assert = require("node:assert");
const { largest, totalPrice, addItem, countWords } = require("./collections.js");

test("largest finds the biggest number", () => {
  assert.strictEqual(largest([3, 9, 2]), 9);
});

test("largest gives undefined for an empty array", () => {
  assert.strictEqual(largest([]), undefined);
});

test("totalPrice multiplies price by quantity and adds it up", () => {
  const cart = [
    { name: "pen", price: 2, quantity: 3 },
    { name: "notebook", price: 5, quantity: 1 },
  ];
  assert.strictEqual(totalPrice(cart), 11);
});

test("an empty cart costs 0", () => {
  assert.strictEqual(totalPrice([]), 0);
});

test("addItem gives back a cart with the item at the end", () => {
  const cart = [{ name: "pen", price: 2, quantity: 3 }];
  const bigger = addItem(cart, { name: "ink", price: 4, quantity: 1 });
  assert.strictEqual(bigger.length, 2);
  assert.strictEqual(bigger[1].name, "ink");
});

test("addItem leaves the original cart alone", () => {
  const cart = [{ name: "pen", price: 2, quantity: 3 }];
  addItem(cart, { name: "ink", price: 4, quantity: 1 });
  assert.strictEqual(cart.length, 1);
});

test("countWords counts each word", () => {
  assert.deepStrictEqual(countWords("the cat and the hat"), { the: 2, cat: 1, and: 1, hat: 1 });
});

test("countWords ignores capital letters", () => {
  assert.deepStrictEqual(countWords("The the THE"), { the: 3 });
});
