// The smallest number in a turned list.
//
// numbers was sorted from smallest to largest, with no repeats. Then it was
// turned: some items were cut off the front and stuck on the end.
// [1, 2, 3, 4, 5] turned by two is [3, 4, 5, 1, 2].
// It may have been turned by zero, so it may still be in order.
// numbers always has at least one item.
//
// Give the smallest number.
//
// smallestRotated([3, 4, 5, 1, 2]) gives 1.
// smallestRotated([4, 5, 6, 7, 0, 1, 2]) gives 0.
//
// Rule: halve the search each step. Our tests use a list of a million
// numbers and count how many items you look at.
function smallestRotated(numbers) {
  // your code here
}

module.exports = { smallestRotated };
