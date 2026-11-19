const test = require("node:test");
const assert = require("node:assert");
const { ticketPrice, countVowels, sumTo, fizzbuzz } = require("./decisions.js");

test("ticketPrice: a toddler is free", () => {
  assert.strictEqual(ticketPrice(3), 0);
});

test("ticketPrice: an adult pays 12", () => {
  assert.strictEqual(ticketPrice(30), 12);
});

test("ticketPrice: a 70 year old pays 6", () => {
  assert.strictEqual(ticketPrice(70), 6);
});

test("countVowels counts the vowels in a word", () => {
  assert.strictEqual(countVowels("banana"), 3);
});

test("countVowels gives 0 when there are none", () => {
  assert.strictEqual(countVowels("rhythm"), 0);
});

test("sumTo adds every number from 1 up to n", () => {
  assert.strictEqual(sumTo(4), 10);
});

test("fizzbuzz gives the number as text", () => {
  assert.strictEqual(fizzbuzz(7), "7");
});

test("fizzbuzz gives Fizz for 9", () => {
  assert.strictEqual(fizzbuzz(9), "Fizz");
});

test("fizzbuzz gives FizzBuzz for 15", () => {
  assert.strictEqual(fizzbuzz(15), "FizzBuzz");
});
