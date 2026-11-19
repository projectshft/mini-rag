# Basics by Hand: How Fast Is It?

> **In this lesson:** why code that works on ten items can fall over on a million, how developers describe that with Big O, and the one trick that fixes it more often than any other. You'll write two functions where the obvious answer is too slow to pass.

## Words you need first

- **Input size.** How much data a piece of code is given. Usually written as n.
- **Step.** One small unit of work, like one comparison.
- **Nested loop.** A loop inside another loop.
- **Set.** A collection that holds each value once and can tell you fast whether it has one.

## Working isn't the same as working at size

Here's a function that checks whether a name is in a list:

```js
function includesName(names, target) {
  for (const name of names) {
    if (name === target) return true;
  }
  return false;
}
```

With 10 names, it does at most 10 comparisons. With a million names, at most a million. The work grows in step with the list. Double the list, double the work.

Now here's one that checks whether any two people in a list share a birthday:

```js
function sharedBirthday(days) {
  for (let i = 0; i < days.length; i++) {
    for (let j = i + 1; j < days.length; j++) {
      if (days[i] === days[j]) return true;
    }
  }
  return false;
}
```

It compares every person against every other person. With 10 people that's 45 comparisons. With 1,000 it's about 500,000. With a million it's about 500 billion, and your program appears to hang.

Both functions are correct. Only one survives real data.

## Big O: a name for the shape

Developers describe this with **Big O**. It answers one question: when the input gets bigger, how does the work grow?

| Name | Said as | When the input doubles | Looks like |
| --- | --- | --- | --- |
| O(1) | constant | the work stays the same | Looking up one key in an object |
| O(log n) | logarithmic | the work goes up by one step | Finding a word in a dictionary by halving |
| O(n) | linear | the work doubles | One loop over the data |
| O(n²) | quadratic | the work goes up four times | A loop inside a loop over the same data |

Here is what that means in steps:

| Items | O(1) | O(log n) | O(n) | O(n²) |
| --- | --- | --- | --- | --- |
| 10 | 1 | 4 | 10 | 100 |
| 1,000 | 1 | 10 | 1,000 | 1,000,000 |
| 1,000,000 | 1 | 20 | 1,000,000 | 1,000,000,000,000 |

Big O ignores small details on purpose. A loop that does three things per item is still O(n). You're describing the shape of the growth, not counting exactly.

To find the Big O of a piece of code, look for the loops:

- No loop over the input: probably O(1).
- One loop over the input: O(n).
- A loop inside a loop over the same input: O(n²).
- Cutting the remaining work in half each time: O(log n).

Watch for hidden loops. `names.includes(x)` and `names.indexOf(x)` each walk the array. Put one inside a loop and you've written O(n²) without typing a second `for`.

```match
{
  "title": "What's the Big O?",
  "note": "n is the length of the array. Tap the code, then its growth.",
  "pairs": [
    { "left": "Return the first item of an array", "right": "O(1)" },
    { "left": "Add up every number in an array", "right": "O(n)" },
    { "left": "For each item, loop over the whole array again", "right": "O(n²)" },
    { "left": "Guess a number from 1 to n by halving the range each time", "right": "O(log n)" }
  ]
}
```

## The trick: remember what you've seen

The slow birthday check keeps going back to compare against people it already looked at. The fix is to walk the list once and remember.

A `Set` holds values and answers "have you got this one?" in constant time, no matter how big it is.

```js
const seen = new Set();
seen.add(5);
seen.has(5);    // true
seen.has(9);    // false
```

With it, the birthday check becomes one loop:

```js
function sharedBirthday(days) {
  const seen = new Set();
  for (const day of days) {
    if (seen.has(day)) return true;
    seen.add(day);
  }
  return false;
}
```

One pass. O(n) in place of O(n²). On a million people that's the difference between a blink and a coffee break.

You paid for the speed with memory, because the set holds a copy of what you've seen. Trading memory for time is one of the most common deals in software. A plain object used as a tally does the same job when you need counts.

This single pattern, one loop plus a set or object to remember, answers a large share of interview questions. You'll see it again under the name "frequency counter".

## Why this matters when an agent writes the code

An agent's code is usually tested with a handful of items. A nested loop passes those tests in no time, ships, and then meets a customer with 80,000 orders.

You're the one who has to look at a function and ask how it behaves at size. You can do that now.

## Your exercises

Open `basics-two/speed.js` in your labs repository and fill in:

- `hasDuplicate`: does any number appear twice?
- `firstRepeat`: the first character to show up a second time.

Write the obvious version of `hasDuplicate` first, with a loop inside a loop, and run the tests:

```bash
node --test speed.test.js
```

Watch the test with 100,000 numbers. Then rewrite it with one loop and a `Set`, and run it again. Seeing the difference on your own machine is the point of this lesson.

If you're stuck for more than 20 minutes, reread the `sharedBirthday` rewrite and ask what you'd need to remember as you walk the list.

Commit and push when all five pass.

```quiz
[
  {
    "q": "A function loops over a list of n customers, and for each one calls orders.includes(customer.id), where orders also has about n items. What's the growth?",
    "options": ["O(n²), because includes is a hidden loop inside your loop", "O(n), because there's only one for loop", "O(1)", "O(log n)"],
    "answer": 0,
    "explain": "includes walks the array to find a match. One walk per customer is n times n."
  },
  {
    "q": "An agent writes a feature and its tests pass in 3 milliseconds with 5 sample rows. What should you check before trusting it with real data?",
    "options": ["How the work grows as the data grows, by looking for loops inside loops", "That the test file is long enough", "That it uses arrow functions", "Nothing. Passing tests prove it's fast"],
    "answer": 0,
    "explain": "Small test data hides O(n²) completely. Reading for nested and hidden loops is how you catch it before a customer does."
  },
  {
    "q": "You replace a nested loop with one loop and a Set. What did you give up to get the speed?",
    "options": ["Memory, because the Set stores what you've seen", "Correctness", "Nothing at all", "The ability to return early"],
    "answer": 0,
    "explain": "The Set takes space that grows with the input. Trading memory for time is usually a good deal, and it is a deal."
  }
]
```

## Key takeaways

- Code can be correct and still be useless at real size.
- Big O describes how the work grows as the input grows. Look for the loops.
- A loop inside a loop over the same data is O(n²). `includes` and `indexOf` are hidden loops.
- One pass plus a `Set` or object to remember turns many O(n²) answers into O(n).
- Small test data hides slow code. Asking "what happens at size?" is your job.

## Work with AI

```ai-prompt
title: Drill me on Big O
---
I'm a beginner who just learned Big O: O(1), O(log n), O(n) and O(n²). Show me a short
JavaScript function, ten lines or fewer, and ask me for its Big O and why. Wait for my
answer. If I'm wrong, point at the exact line that sets the growth. Do eight of these.
Include at least two with a hidden loop such as includes, indexOf or slice inside a
loop, and at least two where I should then rewrite it to be faster. Don't write the
faster version for me. Tell me whether mine is right.
```
