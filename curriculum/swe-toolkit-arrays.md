# Project: By-Hand Toolkit. Your Own Array Methods

> **In this lesson:** your first project starts. You'll build, by hand, the tools that every JavaScript developer and every agent reaches for daily: `map`, `filter`, `reduce` and `find`. Once you've built them you'll never be confused by them again. This is the first of three parts.

## Words you need first

- **Method.** A function that belongs to a value, called with a dot: `names.push("Ada")`.
- **Built-in.** Something the language gives you for free.
- **Milestone.** One part of a project, handed in and checked on its own.

## How projects work

The basics were exercises: we told you exactly what to write and gave you every test.

A project is different in three ways.

- **It comes in milestones.** This one has three. You hand each in separately. Do them in order, and get one passing before you start the next.
- **You write most of the tests.** You get a few to start. The brief says how many more you owe.
- **The hidden tests are harder.** They're still reported by category, and you still get as many tries as you need.

This project has one more rule that the others won't: **no agent, for any of it.** This is the last thing you build completely by hand. After this you'll direct an agent for project work, and you'll be able to judge what it writes because of what you do here.

## Why build something that already exists?

JavaScript arrays come with these methods built in:

```js
const prices = [5, 12, 8];

prices.map((p) => p * 2);                  // [10, 24, 16]
prices.filter((p) => p > 6);               // [12, 8]
prices.reduce((total, p) => total + p, 0); // 25
prices.find((p) => p > 6);                 // 12
```

Agents write code like this constantly, often several chained on one line. If these are magic words to you, you can't review that code. You're trusting it.

Each one is a loop you've already written, with a name on it.

| Method | What it does | The loop underneath |
| --- | --- | --- |
| `map` | Turns every item into something else | Start with an empty array, push a changed item each pass |
| `filter` | Keeps only some items | Start empty, push the item only if it passes a check |
| `reduce` | Boils the array down to one value | Start with a value, update it each pass |
| `find` | Gives the first item that passes a check | Return as soon as one passes |

The part that's new is that each takes **a function as an argument**. `map` doesn't know what you want done to each item. You hand it a function and it calls that function once per item. You met this idea with `applyTwice`.

```js
function double(n) {
  return n * 2;
}

[1, 2, 3].map(double);   // map calls double(1), double(2), double(3)
```

## Reading reduce

`reduce` is the one people find hard, so here it is slowly.

```js
[1, 2, 3].reduce((total, n) => total + n, 0);
```

It keeps one running result. The `0` at the end is where the result starts. On each pass it calls your function with the result so far and the next item, and whatever your function returns becomes the new result.

| Pass | total coming in | n | returned |
| --- | --- | --- | --- |
| 1 | 0 | 1 | 1 |
| 2 | 1 | 2 | 3 |
| 3 | 3 | 3 | 6 |

The result doesn't have to be a number. It can be a string you're building or an object you're filling in. That's why `reduce` shows up everywhere.

```order
title: What happens in [4, 9].filter((n) => n > 5)
---
An empty result array is made
The function is called with 4 and gives false, so 4 is left out
The function is called with 9 and gives true, so 9 is pushed
The result [9] is returned, and the original array is unchanged
```

## Get the project

From the top of your `parsity-labs` folder:

```bash
curl -sL https://ai.parsity.io/labs/toolkit.tar.gz | tar xz
git add .
git commit -m "Add the toolkit project"
```

You now have a `toolkit` folder with three parts inside. This lesson is `toolkit/arrays`.

## The brief

Open `toolkit/arrays/arrays.js`. Write five functions:

- `map(array, fn)`
- `filter(array, fn)`
- `reduce(array, fn, start)`
- `find(array, fn)`
- `unique(array)`: each value once, in the order it first appeared

The comments in the file say exactly what each one takes and gives back.

**The rule: loops only.** Don't call the built-in `map`, `filter`, `reduce`, `find`, `forEach`, `some`, `every` or `findIndex`. You're building them. `push` and `length` are fine. Our tests switch the built-ins off while your code runs, so we'll know.

**You owe six tests.** `arrays.test.js` comes with six. Add at least six more of your own. Don't pad the count with tests that can't fail. Before you write code for a function, ask what could go wrong with it:

- What should happen with an empty array?
- Your function is called with the item *and its index*. Does anything check the index?
- Is the array that was passed in still the same afterwards?
- Does `find` work when the thing it finds is `0`?

Write a test for each answer, watch it fail, then make it pass. That order still matters.

From inside `toolkit/arrays`:

```bash
node --test
```

**A way to work.** One function at a time: write its tests, write the function, run, commit. Five small commits with clear notes beat one big one. Your mentor will read them.

**When you're stuck.** Give a function 30 minutes of real effort, including tracing it on paper. After that, you can ask an agent to explain a concept. You still can't ask it for code. If you're stuck for a whole sitting, bring it to office hours or your mentor.

## Hand it in

```submit
assignment: toolkit-arrays
```

Paste the link to your `parsity-labs` repository. We need at least 12 passing tests of yours, and then ours run.

If a hidden category fails, read its name closely. "The index passed to your callback" tells you which argument to go and look at.

## Stretch

Write `chunk(array, size)`, which splits an array into groups: `chunk([1, 2, 3, 4, 5], 2)` gives `[[1, 2], [3, 4], [5]]`. Test it. It isn't graded, and it's a common interview warm-up.

```quiz
[
  {
    "q": "What does [1, 2, 3].map((n) => n > 1) give?",
    "options": ["[false, true, true]", "[2, 3]", "[1, 2, 3]", "true"],
    "answer": 0,
    "explain": "map always gives back one result per item. Here each result is the true or false from the check. To keep only the matching items you'd use filter."
  },
  {
    "q": "An agent writes orders.filter(isPaid).map(toTotal).reduce(add, 0). What is it working out?",
    "options": ["The sum of the totals of the paid orders", "The number of paid orders", "A list of unpaid orders", "The largest order"],
    "answer": 0,
    "explain": "Read it left to right: keep the paid ones, turn each into its total, then add them all up starting from 0."
  },
  {
    "q": "Your find function returns as soon as it gets a match. Why is that better than checking every item and returning at the end?",
    "options": ["It does less work, and it gives the first match, which is what find promises", "It uses less memory", "It's not better, both are the same", "Loops must always return early"],
    "answer": 0,
    "explain": "Checking everything wastes work on a long array, and a version that keeps going may end up with the last match by mistake."
  }
]
```

## Key takeaways

- A project comes in milestones, and you write most of its tests.
- `map`, `filter`, `reduce` and `find` are loops with names. Each takes a function and calls it per item.
- `reduce` carries one running result from pass to pass.
- Ask "what could go wrong?" before you write the code, and turn each answer into a test.
- This project is yours alone. No agent writes any of it.

## Work with AI

```ai-prompt
title: Read chained array code out loud
---
I'm a beginner who just built my own map, filter, reduce and find. I want to get fast
at reading them. Show me one line of JavaScript that chains two or three of these on a
small array of objects, and show me the array. Ask me to say in plain words what the
line produces, step by step. Wait for my answer and correct it. Do six, getting harder,
and make the last two use reduce to build an object. Don't write any code for my
project.
```
