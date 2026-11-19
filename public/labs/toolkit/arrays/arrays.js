// By-hand toolkit. You write this project yourself. No agent.
//
// The rule for this file: loops only.
// Don't call the built-in map, filter, reduce, find, forEach, some, every or
// findIndex. You are building them. push and length are fine.

// map([1, 2, 3], (n) => n * 2) gives [2, 4, 6]
// fn is called with two arguments: the item, and its index.
function map(array, fn) {
  // your code here
}

// filter([1, 2, 3, 4], (n) => n % 2 === 0) gives [2, 4]
// fn is called with the item and its index. Keep the item when fn gives true.
function filter(array, fn) {
  // your code here
}

// reduce([1, 2, 3], (total, n) => total + n, 0) gives 6
// fn is called with the running result and the item. start is the first result.
function reduce(array, fn, start) {
  // your code here
}

// find([5, 12, 8], (n) => n > 6) gives 12, the first item where fn gives true.
// If nothing matches, give undefined.
function find(array, fn) {
  // your code here
}

// unique([3, 1, 3, 2, 1]) gives [3, 1, 2]
// Each value once, in the order it first appeared. It has to be fast on big arrays.
function unique(array) {
  // your code here
}

module.exports = { map, filter, reduce, find, unique };
