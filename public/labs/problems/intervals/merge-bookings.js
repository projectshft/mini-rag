// Combine overlapping bookings.
//
// bookings is a list of [start, end] pairs, in any order. Each start is less
// than or equal to its end. Two bookings overlap when one starts before or
// exactly when the other ends: [1, 3] and [3, 5] overlap.
//
// Give a new list where every group of overlapping bookings has become one
// booking, sorted by start. Don't change the list you were given.
//
// mergeBookings([[1, 3], [2, 6], [8, 10], [15, 18]])
//   gives [[1, 6], [8, 10], [15, 18]].
// mergeBookings([]) gives [].
function mergeBookings(bookings) {
  // your code here
}

module.exports = { mergeBookings };
