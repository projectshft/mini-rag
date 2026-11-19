# Project: By-Hand Toolkit. Your Own Test Runner

> **In this lesson:** you'll build a small version of the tool that has been checking your work since the first week. Then you'll write your first decision memo, where you explain the choices you made in this project. This is the last of three parts, and the last code you'll write with no agent at all.

## Words you need first

- **Test runner.** The program that finds your tests, runs them, and reports what passed.
- **Throw.** To stop what's happening and signal an error.
- **Catch.** To intercept a thrown error so the program can carry on.
- **Decision memo.** A short written explanation of what you chose and why.

## What `node --test` has been doing

Every time you ran your tests, something did four jobs for you:

1. Collected every `test(name, fn)` you wrote.
2. Ran each function.
3. Decided, for each, whether it passed or failed.
4. Kept going after a failure, and printed a report.

None of that is magic. A test passes when its function finishes. It fails when its function **throws an error**. That's the whole rule, and it's how nearly every test tool in every language works.

## Throwing and catching

When something goes wrong, code can throw:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("can't divide by zero");
  }
  return a / b;
}
```

A thrown error stops the current function and travels up the call stack, ending each function it passes through. If nothing stops it, the program crashes and prints the stack. You've read plenty of those by now.

`try` and `catch` stop it:

```js
try {
  divide(4, 0);
  console.log("this line never runs");
} catch (err) {
  console.log("caught:", err.message);   // caught: can't divide by zero
}
console.log("the program carries on");
```

`err.message` is the text that was passed to `new Error(...)`.

Now look at an assertion with fresh eyes:

```js
assert.strictEqual(greet("Ada"), "Hello, Ada!");
```

It compares two values. If they match, it does nothing. If they don't, it throws an error whose message describes the difference. The test runner catches that error and marks the test as failed.

So a test runner needs two pieces: a function that throws when things don't match, and a loop that calls each test inside `try` and `catch`.

```order
title: What a test runner does with one failing test
---
The test function is remembered, with its name, but not run yet
The runner calls the test function inside a try block
The assertion compares two values and they don't match
The assertion throws an error with a message describing both values
The runner's catch block receives the error
The runner records the test as failed, with the message, and moves to the next test
```

## The brief

Open `toolkit/runner/runner.js`. Write two things.

**`expectEqual(actual, expected)`.** Does nothing when the two are exactly equal. Otherwise throws an `Error`. The message has to include both values, because a failure that says only "values differ" tells the reader nothing.

**`createRunner()`.** Gives back an object with two methods:

- `test(name, fn)` remembers a test without running it.
- `run()` runs every remembered test in order and gives back a report.

The report looks like this:

```js
{
  passed: 2,
  failed: 1,
  results: [
    { name: "adds", ok: true },
    { name: "subtracts", ok: false, error: "expected 1 but got 3" },
    { name: "multiplies", ok: true }
  ]
}
```

A failing test must not stop the ones after it. And each runner keeps its own tests, so think about where that list has to live. You've solved that problem twice already.

**You owe four tests.** The file comes with four. Add at least four more. You are testing a test runner with a test runner, which is as odd as it sounds. Keep clear in your head which is which: `node:test` is checking *your* `createRunner`.

From inside `toolkit/runner`:

```bash
node --test
```

## Use it

Once it works, use it for real. Make a file called `check.js` in the same folder that tests your own `Stack` with your own runner:

```js
const { createRunner, expectEqual } = require("./runner.js");
const { Stack } = require("../structures/structures.js");

const runner = createRunner();

runner.test("pop gives the last item pushed", () => {
  const s = new Stack();
  s.push(1);
  s.push(2);
  expectEqual(s.pop(), 2);
});

console.log(runner.run());
```

Add two or three more, including one you make fail on purpose, and run `node check.js`. Your tool is reporting on your code. Commit it.

## Write your decision memo

Every project from here on ends with a memo. Code shows what you built. The memo shows whether you understood the choices.

This matters more than it used to. When an agent writes the code, your explanation of *why it's built this way* is most of your value on a team, and it's what interviewers ask about.

Open `toolkit/runner/MEMO.md`. It has four questions about your queue, your hash map, which structure fits which job, and what you'd change. Answer each in a few sentences.

Rules for every memo you write here:

- **Your own words.** No agent writes it. An agent may read it afterwards and tell you where it's unclear.
- **Say what it costs.** "I used an array because it's simple" is half an answer. "It's simple, and removing from the front gets slow past a few thousand items" is a whole one.
- **Short.** If a question takes more than a short paragraph, you're hedging. Pick a position.

Your mentor reads your memo and will ask you about it.

## Hand it in

```submit
assignment: toolkit-runner
```

We need `runner.js` and `MEMO.md` in `toolkit/runner`, at least 8 passing tests of yours, and then ours run.

When this passes, your first project is done.

## Tell the story

At your next mentor session, explain this project out loud, without notes, as if to someone who wasn't there:

- What you built, in two sentences.
- The hardest part, and how you got through it.
- One decision you made and what it cost.

That shape, what, hardest part, decision and cost, is how you'll answer "tell me about a project you worked on" in an interview. You're practicing it on a small project so it's easy on a big one.

## Stretch

Make your runner handle tests that return a promise. A test like `async () => { expectEqual(await after(10, 5), 5); }` should be waited for before it's marked passed, which means `run` has to become async too. Test it.

```quiz
[
  {
    "q": "How does a test runner know a test failed?",
    "options": ["The test function threw an error, and the runner caught it", "The test function returned false", "It reads the test's name", "It compares the output to a saved file"],
    "answer": 0,
    "explain": "A test passes when its function finishes and fails when it throws. Assertions are functions that throw when values don't match."
  },
  {
    "q": "Your runner stops at the first failing test and reports nothing after it. What did you leave out?",
    "options": ["A try and catch around each test, so one error doesn't end the loop", "A return statement", "A second loop", "The test names"],
    "answer": 0,
    "explain": "Without catching it, the first thrown error travels up and ends run itself. Catching inside the loop lets the next test start."
  },
  {
    "q": "Which sentence belongs in a decision memo?",
    "options": ["I tracked the front of the queue with a number, which keeps removal fast but leaves old items in memory until I clear them", "I used the best approach for the queue", "The queue works and all tests pass", "Queues are a first in, first out data structure"],
    "answer": 0,
    "explain": "A memo states the choice and what it costs. The others are a claim, a status report and a definition."
  }
]
```

## Key takeaways

- A test passes when its function finishes and fails when it throws.
- An assertion is a function that throws when two values don't match.
- A runner is a list of tests and a loop with `try` and `catch`.
- A decision memo says what you chose and what it cost, in your own words.
- Telling a project's story has a shape: what, hardest part, decision and cost.

## Work with AI

```ai-prompt
title: Tell me where my memo is unclear
---
I'm a beginner. I wrote a short decision memo about data structures I built by hand: a
queue, a hash map, and when to use each. I'll paste it. Don't rewrite it and don't add
content. For each answer, tell me: did I state a clear choice, did I say what it costs,
and is anything vague or wrong? Quote the exact sentence you mean. Then ask me the one
follow-up question a senior engineer would most likely ask about it, and wait for my
answer.
```
