// Towers of Hanoi.
//
// There are three pegs. n disks sit on the from peg, biggest at the bottom.
// Move them all to the to peg. The rules:
//   - move one disk at a time, the top disk of a peg
//   - never put a bigger disk on a smaller one
// The spare peg is the third one, for parking disks on the way.
//
// Give the list of moves, in order. Each move is [fromPeg, toPeg].
// Use the peg names you were given.
//
// hanoi(1, "A", "C", "B") gives [["A", "C"]].
// hanoi(2, "A", "C", "B") gives [["A", "B"], ["A", "C"], ["B", "C"]].
// hanoi(0, "A", "C", "B") gives [], because there is nothing to move.
//
// Use recursion. The lesson shows you how to think about it.
function hanoi(n, from, to, spare) {
  // your code here
}

module.exports = { hanoi };
