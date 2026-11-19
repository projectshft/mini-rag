# Basics by Hand: Values and Variables

> **In this lesson:** what a program is doing with your computer's memory, the three kinds of value you'll use most, and how a variable holds one. You'll also set up the one repository that holds your by-hand work, and write your first three functions.

## Words you need first

- **Value.** One piece of data: a number, some text, a yes or a no.
- **Variable.** A name you give a value so you can use it again.
- **Memory.** Where the computer keeps values while a program is running. It's wiped when the program ends.
- **String.** The programmer's word for text.

## No agent for this part

You'll write everything in these basics lessons yourself. No agent, no autocomplete that finishes the line for you.

This is the slow part, on purpose. You're building the picture in your head that lets you read what an agent writes later. Reading comes from writing.

You can still ask an agent to *explain* something. Ask it what a word means or why an error happened. Don't ask it for the answer.

## What the computer is doing

When you run `node hello.js`, three parts of your computer get involved.

| Part | What it does | Like |
| --- | --- | --- |
| Disk | Keeps your files when the power is off | A filing cabinet |
| Memory | Holds what the running program is working with | A desk |
| Processor | Carries out one tiny instruction at a time, very fast | The person at the desk |

Node reads your file from the disk, and the processor works through it line by line. Every value the program makes sits in memory, on the desk, until the program ends.

That's why a program forgets everything when it stops. If you want something kept, you have to write it to the disk or send it somewhere. That idea comes back when you meet databases.

## Three kinds of value

```js
42            // a number
"hello"       // a string (text), always in quotes
true          // a boolean: true or false
```

Numbers do math. Strings hold text. Booleans answer yes-or-no questions.

The quotes matter. `42` is a number and `"42"` is text that happens to look like one:

```js
console.log(42 + 1);     // 43
console.log("42" + 1);   // "421"
```

With a number, `+` adds. With a string, `+` glues. This catches every beginner once.

## Variables

A variable is a label on a box in memory.

```js
const name = "Ada";
let score = 10;
score = score + 5;
console.log(name, score);   // Ada 15
```

- `const` makes a label that can't be moved to a different value.
- `let` makes one that can.

Start with `const`. Switch to `let` only when you find you need to change it. Code is easier to read when most things can't change.

Read `score = score + 5` right to left: take what's in `score`, add 5, put the result back in `score`. The `=` sign means "store this", not "these are equal".

## A few things strings and numbers can do

```js
const word = "parsity";
word.length            // 7
word[0]                // "p"   (counting starts at 0)
word.toUpperCase()     // "PARSITY"

Math.round(4.6)        // 5
Math.round(22.9885 * 100) / 100   // 22.99
```

That last line is how you round money to cents: multiply by 100, round, divide by 100.

```blanks
{
  "title": "Predict the output",
  "note": "Work each one out in your head before you pick.",
  "code": "const a = \"7\";\nconst b = 7;\nconsole.log(a + b);   // ___1___\nconsole.log(b + b);   // ___2___\nconsole.log(a[0]);    // ___3___",
  "blanks": [
    { "options": ["\"77\"", "14", "an error"], "answer": "\"77\"", "explain": "a is a string, so + glues. The number 7 gets turned into text and stuck on the end." },
    { "options": ["14", "\"77\"", "7"], "answer": "14", "explain": "Both are numbers, so + adds." },
    { "options": ["\"7\"", "7", "undefined"], "answer": "\"7\"", "explain": "Position 0 of the string \"7\" is the character \"7\". It's still text." }
  ]
}
```

## Set up your labs repository

All your by-hand work goes in one repository. You'll add a folder to it for each set of exercises.

In your terminal, from your `parsity` folder:

```bash
mkdir parsity-labs
cd parsity-labs
git init
curl -sL https://ai.parsity.io/labs/basics-one.tar.gz | tar xz
ls
```

That last command downloads a folder called `basics-one` and unpacks it. Open it:

```bash
cd basics-one
code .
```

You'll see three files with unfinished functions, and a test file next to each one.

Commit the starting point before you change anything, then put it on GitHub as a new repository called `parsity-labs`:

```bash
cd ..
git add .
git commit -m "Add the first set of exercises"
```

Create the repository on GitHub the same way you did before, and push.

## Your exercises

Open `values.js`. It has three functions with a comment above each one saying what it should do. A function takes something in and gives something back with the word `return`:

```js
function double(n) {
  return n * 2;
}
```

Fill in `fullName`, `initials` and `totalWithTip`. Then, inside the `basics-one` folder, run only this file's tests:

```bash
node --test values.test.js
```

Read each failure the way you learned to: expected, then actual. Fix one test at a time.

If you're stuck on one function for more than 20 minutes, ask an agent to explain the idea you're missing, not to write the function. Then close it and write the code.

When all five pass, commit and push. You'll hand this folder in once the other two files are done.

```quiz
[
  {
    "q": "Your program adds up a score while it runs. You close the terminal and run it again, and the score is back to 0. Why?",
    "options": ["Values live in memory, which is cleared when the program ends", "Node has a bug", "const variables reset themselves", "The file wasn't saved"],
    "answer": 0,
    "explain": "Memory only holds values while the program runs. To keep something, a program has to write it to disk or send it somewhere."
  },
  {
    "q": "What does `score = score + 5` do?",
    "options": ["Takes the value in score, adds 5, and stores the result back in score", "Checks whether score equals score plus 5", "Makes a new variable", "Causes an error, because nothing equals itself plus 5"],
    "answer": 0,
    "explain": "A single = stores a value. The right side is worked out first, then stored under the name on the left."
  },
  {
    "q": "A form gives you the text \"19\" for someone's age and you write age + 1. What do you get?",
    "options": ["\"191\"", "20", "An error", "19"],
    "answer": 0,
    "explain": "Text from a form is a string. With a string, + glues. You'd turn it into a number first with Number(age)."
  }
]
```

## Key takeaways

- A running program keeps its values in memory. They're gone when it stops.
- Numbers, strings and booleans are the three values you'll use most.
- `+` adds numbers and glues strings. Know which one you have.
- Use `const` unless the value has to change.
- The basics are written by you. An agent can explain. It doesn't write.

## Work with AI

```ai-prompt
title: Explain it, don't solve it
---
I'm a beginner learning JavaScript by hand. I'm not allowed to have you write my
exercise code. I'll paste a function I wrote and the failing test output. Tell me
which line the problem is on and what idea I'm missing, in two or three plain
sentences. Don't show me corrected code. If I ask for the answer, remind me why I'm
writing it myself and give me a smaller hint.
```
