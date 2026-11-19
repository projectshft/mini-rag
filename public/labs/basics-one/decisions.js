// Basics by hand, part one: decisions and loops.
// Fill in each function, then run `node --test` in this folder.
// Write these yourself. No agent.

// A museum ticket costs:
//   under 5 years old: 0
//   5 to 17: 8
//   18 to 64: 12
//   65 and over: 6
// ticketPrice(30) gives 12
function ticketPrice(age) {
  // your code here
}

// countVowels("banana") gives 3. Vowels are a, e, i, o and u.
// Capital letters count too: countVowels("APPLE") gives 2
function countVowels(text) {
  // your code here
}

// sumTo(4) gives 10, because 1 + 2 + 3 + 4 is 10.
// For zero or a negative number, give 0.
function sumTo(n) {
  // your code here
}

// fizzbuzz(n) gives back text:
//   "FizzBuzz" when n divides evenly by both 3 and 5
//   "Fizz" when n divides evenly by 3
//   "Buzz" when n divides evenly by 5
//   otherwise the number as text: fizzbuzz(7) gives "7"
function fizzbuzz(n) {
  // your code here
}

module.exports = { ticketPrice, countVowels, sumTo, fizzbuzz };
