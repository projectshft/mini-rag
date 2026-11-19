// Basics by hand, part one: functions and scope.
// Fill in each function, then run `node --test` in this folder.
// Write these yourself. No agent.

// clamp keeps a number inside a range.
// clamp(15, 0, 10) gives 10. clamp(-3, 0, 10) gives 0. clamp(4, 0, 10) gives 4.
function clamp(n, min, max) {
  // your code here
}

// applyTwice takes a function and a value, and runs the function two times.
// If double(x) gives x * 2, then applyTwice(double, 3) gives 12.
function applyTwice(fn, value) {
  // your code here
}

// makeCounter gives back a NEW FUNCTION.
// Each time you call that function, it gives the next number, starting at 1.
//   const next = makeCounter();
//   next() gives 1
//   next() gives 2
// Two counters must not share their count.
function makeCounter() {
  // your code here
}

module.exports = { clamp, applyTwice, makeCounter };
