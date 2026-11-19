# Basics by Hand: Decisions and Loops

> **In this lesson:** how a program chooses between paths and how it repeats work. Those two ideas, plus variables, are most of what any program does. You'll write four functions, including one that interviewers have asked for twenty years.

## Words you need first

- **Condition.** A question with a true or false answer, like "is age under 18?"
- **Loop.** A piece of code that runs more than once.
- **Bug.** Code that runs but does the wrong thing.

## Asking questions

A condition compares two values and gives back `true` or `false`.

```js
5 > 3          // true
5 === 5        // true   (three equals signs: "is exactly equal to")
5 !== 4        // true   ("is not equal to")
"a" === "A"    // false  (capital letters are different characters)
```

Use three equals signs to compare. One stores a value. Two exists and does something looser that causes bugs, so leave it alone.

Join questions with `&&` (and) and `||` (or):

```js
age >= 13 && age <= 19     // true only when both are true
day === "Sat" || day === "Sun"   // true when either is true
```

## Choosing a path

```js
function shipping(total) {
  if (total >= 50) {
    return 0;
  } else if (total >= 20) {
    return 4;
  } else {
    return 8;
  }
}
```

The program checks each condition from the top and takes the first one that's true. The rest are skipped.

Order matters. If you checked `total >= 20` first, an order of 80 would stop there and pay 4.

**Check the edges.** What does `shipping(50)` give? What about `shipping(49.99)`? Most bugs in code like this sit exactly on the boundary, where someone wrote `>` and meant `>=`. Whenever you write a condition with a limit in it, try the value on the limit and the values on either side.

## Repeating work

A `for` loop runs a block of code a set number of times.

```js
for (let i = 1; i <= 3; i++) {
  console.log(i);
}
// 1
// 2
// 3
```

Read the first line as three parts: start `i` at 1, keep going while `i` is 3 or less, add 1 to `i` after each pass.

Most loops build something up as they go:

```js
let total = 0;
for (let i = 1; i <= 3; i++) {
  total = total + i;
}
console.log(total);   // 6
```

To walk through the characters of a string, there's a shorter form:

```js
for (const letter of "cat") {
  console.log(letter);
}
// c
// a
// t
```

## Trace it on paper

When a loop confuses you, stop guessing and write a table. One row per pass, one column per variable.

| Pass | i | total after |
| --- | --- | --- |
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | 6 |

This feels childish and it's what experienced developers do when something doesn't make sense. You'll do the same thing with an agent's code: walk through it one step at a time and see whether it does what it claims.

```order
title: What happens in: for (let i = 1; i <= 2; i++) { console.log(i); }
---
i is set to 1
The check i <= 2 is true, so the block runs and prints 1
i goes up to 2
The check i <= 2 is true, so the block runs and prints 2
i goes up to 3
The check i <= 2 is false, so the loop ends
```

## One more tool: the remainder

`%` gives what's left over after dividing.

```js
10 % 3    // 1   (3 goes into 10 three times, with 1 left over)
9 % 3     // 0   (nothing left over, so 9 divides evenly by 3)
```

When `n % 3 === 0`, n divides evenly by 3. You'll use that today.

## Your exercises

In your labs repository, open `basics-one/decisions.js`. Fill in the four functions:

- `ticketPrice`: a price that depends on age.
- `countVowels`: count the vowels in some text.
- `sumTo`: add up every number from 1 to n.
- `fizzbuzz`: the classic. The order of your checks decides whether it works.

Run this file's tests from inside `basics-one`:

```bash
node --test decisions.test.js
```

Before you call it done, try the edges yourself. The tests you can see don't check every boundary. Ours do. Add a line at the bottom of the file, run it with `node decisions.js`, and delete it afterwards:

```js
console.log(ticketPrice(5), ticketPrice(17), ticketPrice(18));
```

If one function has you stuck for more than 20 minutes, trace it on paper with a small input. If you're still stuck, ask an agent to explain the idea, not to write the code.

Commit and push when all nine pass.

```quiz
[
  {
    "q": "A function gives a discount with `if (age > 65)`. The rule says \"65 and over\". Who gets the wrong price?",
    "options": ["Someone who is exactly 65", "Everyone over 65", "Everyone under 65", "Nobody"],
    "answer": 0,
    "explain": "> 65 leaves out 65 itself. The rule needs >= 65. Bugs like this live exactly on the limit."
  },
  {
    "q": "In fizzbuzz, you check `n % 3 === 0` first and return \"Fizz\". What does fizzbuzz(15) give?",
    "options": ["\"Fizz\", because the first true condition wins and the rest are skipped", "\"FizzBuzz\"", "\"Buzz\"", "\"15\""],
    "answer": 0,
    "explain": "15 divides by 3, so the first check is true and the function returns. The check for both has to come first."
  },
  {
    "q": "A loop isn't giving the total you expect. What's the most reliable next step?",
    "options": ["Write a table with one row per pass and the value of each variable", "Rewrite it from scratch", "Change numbers until the test passes", "Add more loops"],
    "answer": 0,
    "explain": "Tracing by hand shows you exactly where the values stop matching what you expected. Changing things at random teaches you nothing."
  }
]
```

## Key takeaways

- A condition is a true-or-false question. `if` picks a path with it.
- Conditions are checked top to bottom, and the first true one wins.
- Test the value on the limit and the values on either side of it.
- A loop repeats work. When one confuses you, trace it on paper.

## Work with AI

```ai-prompt
title: Give me code to trace
---
I'm a beginner learning loops and conditions in JavaScript. Write a short function,
eight lines or fewer, that uses one for loop and one if statement. Don't tell me what
it does. Give me an input and ask me to trace it: I'll tell you the value of every
variable after each pass and what it returns. Tell me exactly where I went wrong if I
did. Do five of these, each a little harder than the last, and include one with an
off-by-one mistake for me to find.
```
