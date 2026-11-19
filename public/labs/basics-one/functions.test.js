const test = require("node:test");
const assert = require("node:assert");
const { clamp, applyTwice, makeCounter } = require("./functions.js");

test("clamp leaves a number inside the range alone", () => {
  assert.strictEqual(clamp(4, 0, 10), 4);
});

test("clamp pulls a big number down to the max", () => {
  assert.strictEqual(clamp(15, 0, 10), 10);
});

test("clamp pulls a small number up to the min", () => {
  assert.strictEqual(clamp(-3, 0, 10), 0);
});

test("applyTwice runs the function two times", () => {
  const double = (x) => x * 2;
  assert.strictEqual(applyTwice(double, 3), 12);
});

test("makeCounter counts up from 1", () => {
  const next = makeCounter();
  assert.strictEqual(next(), 1);
  assert.strictEqual(next(), 2);
  assert.strictEqual(next(), 3);
});

test("two counters keep separate counts", () => {
  const a = makeCounter();
  const b = makeCounter();
  a();
  a();
  assert.strictEqual(b(), 1);
});
