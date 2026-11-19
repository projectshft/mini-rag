// Basics by hand, part two: arrays and objects.
// Fill in each function, then run `node --test` in this folder.
// Write these yourself. No agent.

// largest([3, 9, 2]) gives 9.
// For an empty array, give undefined.
function largest(numbers) {
  // your code here
}

// A cart is an array of items. Each item looks like:
//   { name: "pen", price: 2, quantity: 3 }
// totalPrice gives the cost of everything in the cart.
// For the cart above, that's 6. An empty cart costs 0.
function totalPrice(cart) {
  // your code here
}

// addItem gives back a NEW cart with the item added at the end.
// The cart that was passed in must not change.
function addItem(cart, item) {
  // your code here
}

// countWords("the cat and the hat") gives
//   { the: 2, cat: 1, and: 1, hat: 1 }
// Capital letters don't matter: "The" and "the" are the same word.
// Words are separated by spaces. Extra spaces don't make extra words:
// countWords("  big   dog ") gives { big: 1, dog: 1 }. Empty text gives {}.
function countWords(text) {
  // your code here
}

module.exports = { largest, totalPrice, addItem, countWords };
