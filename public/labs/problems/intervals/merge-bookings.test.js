const test = require("node:test");
const assert = require("node:assert");
const { mergeBookings } = require("./merge-bookings.js");

test("two bookings overlap and two don't", () => {
  assert.deepStrictEqual(mergeBookings([[1, 3], [2, 6], [8, 10], [15, 18]]), [
    [1, 6],
    [8, 10],
    [15, 18],
  ]);
});

test("nothing overlaps", () => {
  assert.deepStrictEqual(mergeBookings([[1, 2], [5, 6]]), [
    [1, 2],
    [5, 6],
  ]);
});

test("everything overlaps", () => {
  assert.deepStrictEqual(mergeBookings([[1, 4], [2, 5], [3, 6]]), [[1, 6]]);
});
