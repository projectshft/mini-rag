# Basics by Hand: Arrays and Objects

> **In this lesson:** how to hold many values at once, in a list or as a labelled record, and the one idea about them that causes more bugs than any other: two names pointing at the same thing. You'll start the second set of exercises.

## Words you need first

- **Array.** An ordered list of values.
- **Object.** A set of labelled values, like a form with fields.
- **Index.** An item's position in an array. Counting starts at 0.
- **Key.** A label in an object.

## Arrays: a list in order

```js
const scores = [70, 85, 92];

scores[0]            // 70
scores.length        // 3
scores[scores.length - 1]   // 92, the last one
scores.push(60);     // adds 60 to the end
```

Walk through every item with a loop:

```js
let total = 0;
for (const score of scores) {
  total = total + score;
}
```

That shape, a variable that starts empty and a loop that builds it up, solves a huge number of problems. Finding the biggest, counting matches, adding up: all the same shape.

## Objects: a record with labels

```js
const book = { title: "Dune", pages: 412, read: false };

book.title           // "Dune"
book.pages = 500;    // change a value
book.rating = 5;     // add a new key
```

When the key is held in a variable, use square brackets:

```js
const field = "title";
book[field]          // "Dune"
```

That second form lets you use an object as a tally. Each key is a thing you're counting:

```js
const votes = {};
for (const choice of ["tea", "coffee", "tea"]) {
  if (votes[choice] === undefined) {
    votes[choice] = 0;
  }
  votes[choice] = votes[choice] + 1;
}
// { tea: 2, coffee: 1 }
```

Looking up a key in an object is fast no matter how many keys it has. Remember that. It matters a lot in the next lesson.

Real data is usually arrays of objects:

```js
const cart = [
  { name: "pen", price: 2, quantity: 3 },
  { name: "notebook", price: 5, quantity: 1 },
];
cart[0].price   // 2
```

Almost everything a web app sends and receives looks like this.

## Two names, one thing

This is the part to slow down for.

With a number or a string, copying a variable copies the value:

```js
let a = 5;
let b = a;
b = 9;
console.log(a);   // 5, untouched
```

With an array or an object, copying a variable does **not** copy the contents. Both names now point at the same thing in memory:

```js
const first = [1, 2, 3];
const second = first;
second.push(4);
console.log(first);   // [1, 2, 3, 4]   first changed too
```

There was only ever one array. `first` and `second` are two labels stuck on it.

The same thing happens when you pass an array into a function. The function gets the original, not a copy:

```js
function addBonus(scores) {
  scores.push(100);
  return scores;
}

const mine = [70, 85];
addBonus(mine);
console.log(mine);   // [70, 85, 100]   the caller's array was changed
```

Whoever called `addBonus` now has a changed array and may not know it. Bugs like this are hard to find because the damage shows up far from the cause. Agents write this bug too, and it passes most quick tests.

To make a real copy, spread the items into a new array with three dots:

```js
const copy = [...first];        // a new array with the same items
const bigger = [...first, 4];   // a new array with one more
```

A safer `addBonus` gives back a new array and leaves the caller's alone:

```js
function addBonus(scores) {
  return [...scores, 100];
}
```

```blanks
{
  "title": "Predict the output",
  "note": "Work out each one before you pick. Two names for one array, or two arrays?",
  "code": "const a = [1, 2];\nconst b = a;\nconst c = [...a];\nb.push(3);\nconsole.log(a.length);   // ___1___\nconsole.log(c.length);   // ___2___\n\nconst book = { title: \"Dune\" };\nconst field = \"title\";\nconsole.log(book[field]); // ___3___",
  "blanks": [
    { "options": ["2", "3", "an error"], "answer": "3", "explain": "b is a second name for the same array as a. Pushing through b changes the one array both names point at." },
    { "options": ["3", "0", "2"], "answer": "2", "explain": "c was made with [...a] before the push, so it's a separate array with its own two items." },
    { "options": ["\"Dune\"", "\"title\"", "undefined"], "answer": "\"Dune\"", "explain": "Square brackets use the value inside field, which is \"title\", so this reads book.title." }
  ]
}
```

```quiz
[
  {
    "q": "const a = { n: 1 }; const b = a; b.n = 2; What is a.n?",
    "options": ["2, because a and b are two names for the same object", "1, because b is a copy", "undefined", "An error, because a is const"],
    "answer": 0,
    "explain": "Assigning an object to another name doesn't copy it. const only stops the name being pointed at something else. The contents can still change."
  },
  {
    "q": "A function receives a list of orders and sorts it in place before returning it. Why might that be a bug?",
    "options": ["The caller's own list is now sorted too, and they may rely on the original order", "Sorting is slow", "Functions can't change arrays", "It isn't, sorting is always safe"],
    "answer": 0,
    "explain": "The function got the caller's actual array. Changing it changes it for everyone who holds it. Copy first when the caller shouldn't be affected."
  },
  {
    "q": "To find the biggest number, you start with let best = 0 and loop. What do you get for [-4, -9, -2]?",
    "options": ["0, a number that isn't even in the array", "-2", "-9", "undefined"],
    "answer": 0,
    "explain": "No negative number is bigger than 0, so best never changes. Start with the first item of the array instead."
  }
]
```

## Get the second set of exercises

From the top of your `parsity-labs` folder:

```bash
curl -sL https://ai.parsity.io/labs/basics-two.tar.gz | tar xz
git add .
git commit -m "Add the second set of exercises"
```

Same rule as before: you write these. No agent. Commit and push after each function you finish.

## Your exercises

Open `basics-two/collections.js` and fill in:

- `largest`: the biggest number in an array. Think about what your starting value should be. What if every number is negative?
- `totalPrice`: the cost of a cart.
- `addItem`: a new cart with one more item, leaving the original alone.
- `countWords`: a tally of the words in some text. `"a b".split(" ")` gives `["a", "b"]`. Watch out: `"a  b".split(" ")`, with two spaces, gives `["a", "", "b"]`. An empty string isn't a word.

From inside `basics-two`:

```bash
node --test collections.test.js
```

If you're stuck on one for more than 20 minutes, trace it on paper with a three-item array. Then ask an agent to explain the idea, not write the code.

Commit and push when all eight pass.

## Key takeaways

- An array is an ordered list. An object is a set of labelled values. Real data is usually arrays of objects.
- "Start empty, loop, build up" solves most list problems.
- An object can be a tally: one key per thing you're counting.
- Assigning or passing an array or object doesn't copy it. Two names, one thing.
- Return a new array with `[...old, item]` when the caller's shouldn't change.

## Work with AI

```ai-prompt
title: Find the shared-reference bug
---
I'm a beginner who just learned that arrays and objects are shared when you assign or
pass them, not copied. Write a short JavaScript snippet, fifteen lines or fewer, that
looks fine and has a bug caused by two names pointing at the same array or object.
Don't tell me where it is. Ask me what gets printed and why. Then ask how I'd fix it
without changing what the function returns. Give me three of these, and make the last
one an object inside an array.
```
