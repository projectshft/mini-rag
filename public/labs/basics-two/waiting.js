// Basics by hand, part two: code that waits.
// Fill in each function, then run `node --test` in this folder.
// Write these yourself. No agent.

// after gives back a promise.
// The promise finishes with `value` once `ms` milliseconds have passed.
//   after(100, "done").then((v) => console.log(v))   prints "done" after 0.1 seconds
function after(ms, value) {
  // your code here
}

// inOrder takes an array of tasks. Each task is a function that gives back a promise.
// Run them ONE AT A TIME: start the second only after the first has finished.
// Give back a promise for an array of their results, in the same order.
function inOrder(tasks) {
  // your code here
}

// retry runs a task that might fail.
// If the task works, give back its result.
// If it fails, try again, up to `times` tries in total.
// If every try fails, fail with the error from the last try.
function retry(task, times) {
  // your code here
}

module.exports = { after, inOrder, retry };
