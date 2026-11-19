// Flatten a nested list.
//
// nested is an array. Some of its items are arrays, which can hold more
// arrays, as deep as you like. Give one flat array of every value that is
// not an array, in the order you meet them reading left to right.
//
// flatten([1, [2, [3, [4]], 5]]) gives [1, 2, 3, 4, 5].
// flatten([[], [[]]]) gives [].
//
// Rules: use recursion. Don't use the built-in flat or flatMap. Don't change
// the array you were given. Array.isArray(x) tells you whether x is an array.
function flatten(nested) {
  // your code here
}

module.exports = { flatten };
