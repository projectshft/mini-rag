# Setup: Reading and Running a Test

> **In this lesson:** almost everything you hand in here is checked by tests, so you'll learn to run one, read one and make a failing one pass. Then you'll hand in your first piece of work.

## Words you need first

- **Function.** A named set of instructions that takes something in and gives something back.
- **Test.** A small program that runs your code and checks the result is what it should be.
- **Pass and fail.** A test passes when the result matches. It fails when it doesn't.

## What a test is

A test is a claim, written as code: "when I give this function *this*, I should get *that*."

That's all. A computer runs the claim and tells you whether it held.

Tests matter more in this program than they did for developers ten years ago, for one reason. An agent will tell you its code works. A test is how you find out.

## Set it up

Make a new folder next to `hello`, inside `parsity`:

```bash
cd ~/parsity
mkdir first-test
cd first-test
git init
code .
```

Create a file called `greet.js` and type this in:

```js
function greet(name) {
  return "Hello, " + name + "!";
}

module.exports = { greet };
```

The last line makes the function available to other files.

Now create `greet.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert");
const { greet } = require("./greet.js");

test("greets a person by name", () => {
  assert.strictEqual(greet("Ada"), "Hello, Ada!");
});

test("greets a stranger when no name is given", () => {
  assert.strictEqual(greet(), "Hello, stranger!");
});
```

## Read it before you run it

Take the first test one piece at a time.

- `test("greets a person by name", ...)` gives the claim a name. Good names read like a sentence about what the code should do.
- `greet("Ada")` runs your function with the name Ada.
- `assert.strictEqual(a, b)` is the check. It says: these two must be exactly equal. If they aren't, the test fails.

So the first test says: when I greet Ada, I should get back exactly "Hello, Ada!".

What does the second one say? Work it out before you read on.

## Run it

```bash
node --test
```

One test passes and one fails. Read the failure. It shows two things:

- **expected:** `'Hello, stranger!'`
- **actual:** `'Hello, undefined!'`

That gap is the whole story. When nobody gives a name, the function glues the word "undefined" into the greeting. JavaScript uses `undefined` to mean "nothing was given".

## Make it pass

Change `greet.js` so that it uses "stranger" when there's no name. There are a few ways to do it. Try it yourself for 15 minutes before you look anything up. If you're stuck after that, ask an AI chat to explain what `undefined` means and how to check for it, but write the fix yourself. No agent writes code for you until the agent lessons.

Run `node --test` again. When both pass, commit:

```bash
git add .
git commit -m "Greet a stranger when no name is given"
```

Notice the order of what just happened. The test existed first and failed. You changed the code. The test passed. You'll repeat that loop on every project.

```order
title: The loop you'll repeat on every project
---
Write a test that says what should happen
Run it and watch it fail
Change the code
Run it again and watch it pass
Commit, with a note that says what changed
```

## Now break it on purpose

Change `"Hello, "` to `"Hi, "` in `greet.js` and run the tests. Both fail. Good. A test that can't fail isn't checking anything.

Put it back and confirm both pass.

## Hand it in

This is your setup checkpoint.

1. Add a third test of your own to `greet.test.js`. Pick something the first two don't cover. What should happen with a name that's just spaces? You decide, and the test is how you write your decision down.
2. Make it pass.
3. Commit. Create a repository on GitHub called `first-test` and push, the same way you pushed `hello`. Paste the link below.

`greet.js` and `greet.test.js` have to sit at the top of the repository, not inside another folder. That's where the grader looks for them.

```submit
assignment: first-test
```

We run your three tests, and a few of our own that you can't see. If one of ours fails, you'll be told what kind of case it was, not the test itself. Fix it, push, and submit again as often as you need.

```quiz
[
  {
    "q": "A test fails with expected 'Hello, stranger!' and actual 'Hello, undefined!'. What does that tell you?",
    "options": ["The code ran and returned the wrong text when no name was given", "The test file has a typo", "Node is not installed", "The test passed"],
    "answer": 0,
    "explain": "Expected is what the test asked for. Actual is what your code returned. The difference points straight at the case your code doesn't handle."
  },
  {
    "q": "You change the code so it's clearly wrong, and every test still passes. What does that mean?",
    "options": ["The tests aren't checking that behavior", "The code was never wrong", "Tests can't detect changes", "You need to restart Node"],
    "answer": 0,
    "explain": "A test only protects what it checks. If breaking the code doesn't turn anything red, there's a gap in the tests."
  },
  {
    "q": "Why write the test before the fix?",
    "options": ["Seeing it fail first proves the test can catch the problem", "It's faster to type", "Node requires it", "So the code is shorter"],
    "answer": 0,
    "explain": "If you never saw the test fail, you don't know it detects the bug. Fail first, then fix, then pass."
  }
]
```

## Key takeaways

- A test is a claim in code: given this, I should get that.
- Expected versus actual tells you exactly what went wrong.
- Fail first, then fix. A test you never saw fail proves nothing.
- Your work in this program is handed in as a GitHub link and checked by tests.

## Work with AI

```ai-prompt
title: Help me think of cases, don't write them for me
---
I have a function greet(name) that returns "Hello, <name>!" and returns "Hello,
stranger!" when no name is given. I'm a beginner learning to write tests. Don't write
any code. Ask me what should happen in five unusual situations, one at a time: a name
that is only spaces, a name with a number in it, a very long name, a name in another
alphabet, and two names passed at once. After each answer, tell me whether my choice
is reasonable and how I'd state it as "given this, I should get that".
```
