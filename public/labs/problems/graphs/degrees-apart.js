// How many steps between two people?
//
// friends lists each person's friends:
//   { ana: ["ben", "cy"], ben: ["ana", "dee"], cy: ["ana"], dee: ["ben"] }
// Friendship goes both ways, and both people list each other. Someone with
// no friends may be missing from the object entirely.
//
// Give the fewest friend-to-friend steps from the person called from to the
// person called to. A person is 0 steps from themselves. If there is no
// chain of friends between them, give -1.
//
// With the friends above:
// degreesApart(friends, "ana", "ben") gives 1.
// degreesApart(friends, "cy", "dee") gives 3: cy, ana, ben, dee.
function degreesApart(friends, from, to) {
  // your code here
}

module.exports = { degreesApart };
