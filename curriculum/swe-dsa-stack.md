# Interview Problems: Stacks

> **In this lesson:** how a stack solves problems about things that open and must be closed in the right order: brackets in code, tags in a web page, undo. You built a stack by hand. Now you'll see how to spot when a problem wants one, and solve the classic bracket problem with it.

## Words you need first

- **Stack.** A pile where the last thing in is the first thing out. You add with `push` and take the top with `pop`.
- **Top.** The most recently added item, the only one you can take.
- **Nesting.** One thing inside another of the same kind, like `( [ ] )`: the square brackets sit inside the round ones.
- **Unfinished.** Opened but not yet closed. A stack is good at remembering unfinished things in order.

## The idea

Read this line of code and check that its brackets match:

```js
if (list[i] === map[key(x)]) { run(); }
```

Your eyes did something like this: every time you saw an opening bracket, you made a mental note. Every time you saw a closing one, you checked it against the **most recent note** that was still open, and crossed that note off.

"The most recent unfinished thing is the one that must finish next" is the signal for a stack. The newest note sits on top, and it's the only one you're allowed to check.

An array is a fine stack in JavaScript, because adding and removing at the end is O(1):

```js
const stack = [];
stack.push("(");     // ["("]
stack.push("[");     // ["(", "["]
stack.pop();         // gives "[", leaves ["("]
stack[stack.length - 1];   // looks at the top without taking it: "("
```

## Work it by hand

Check `{[()]}`. Push every opener. For every closer, pop the top and check it's the matching opener.

| Step | Character | What happens | Stack after |
| --- | --- | --- | --- |
| 1 | { | opener: push | { |
| 2 | [ | opener: push | { [ |
| 3 | ( | opener: push | { [ ( |
| 4 | ) | closer: pop "(", it matches | { [ |
| 5 | ] | closer: pop "[", it matches | { |
| 6 | } | closer: pop "{", it matches | (empty) |

The stack is empty at the end, so everything matched. Now `([)]`:

| Step | Character | What happens | Stack after |
| --- | --- | --- | --- |
| 1 | ( | opener: push | ( |
| 2 | [ | opener: push | ( [ |
| 3 | ) | closer: pop "[", but ")" needs "(" | stop: false |

Counting wouldn't have caught that. `([)]` has one of each opener and one of each closer, so every count balances. Only the order is wrong, and order is what a stack remembers.

There's a third way to fail. In `(()` every closer matches, but when you reach the end, a `(` is still on the stack. Something was opened and never closed.

```order
title: What to do with each character
---
If it's an opening bracket, push it
If it's a closing bracket and the stack is empty, the text doesn't match
If it's a closing bracket, pop the top and check it's the same kind
At the end, the text matches only if the stack is empty
```

## Slow and fast

There's a well-known slow answer: keep deleting every `()`, `[]` and `{}` pair from the text until none are left, then check whether the text is empty. It's clever and it works, but each pass makes a new copy of the text, and deep nesting needs one pass per level. On text nested 100,000 deep, that's O(n²).

The stack answer looks at each character once and does O(1) work for it: O(n) time. The stack can hold up to `n` items, so it uses O(n) memory in the worst case.

## When to reach for a stack

- Things **open and close**, and inner ones must close before outer ones: brackets, HTML tags, function calls.
- You need to **undo** the most recent action, then the one before.
- You're walking forward and need to **look back at the most recent thing that's still waiting**.

```match
{
  "title": "Stack, queue or tally?",
  "note": "Tap the job, then the structure that fits.",
  "pairs": [
    { "left": "Check that every <div> in a page has a matching </div> in the right place", "right": "A stack of tags still open" },
    { "left": "Undo the user's last three edits, newest first", "right": "A stack of past edits" },
    { "left": "Send support tickets in the order they arrived", "right": "A queue" },
    { "left": "Count how many tickets each customer opened", "right": "A tally object" }
  ]
}
```

## Open the problem

Use the `problems` folder you downloaded with the first set of interview problems. **Don't download it again.** That would replace your finished answers with empty files. If you have no `problems` folder at all, run `curl -sL https://ai.parsity.io/labs/problems.tar.gz | tar xz` once from the top of `parsity-labs`.

```bash
cd problems/stack
node --test
```

Write it by hand, in any language you like while you practice. The version you hand in is JavaScript. Use the seven steps: say it back, ask about the edges, work an example by hand, say the slow answer and its Big O, make it faster, write the code, test it out loud.

**Try it yourself first.** Give the problem 30 minutes of real effort, with a trace table, before you open a hint. Then one hint at a time, with 15 more minutes between them.

## Problem: Brackets that match

Open `brackets.js`. Write `bracketsMatch(text)`: true when every opening bracket is closed by the same kind, in the right order. The kinds are `( )`, `[ ]` and `{ }`. Ignore every other character.

Step two questions to answer before you code: what about empty text? Text with no brackets at all? A closing bracket with nothing open? Brackets left open at the end?

<details>
<summary>Hint 1: which closer goes with which opener?</summary>

You'll need to ask "what opener does this closer need?" many times. An object answers that in one lookup: `{ ")": "(", "]": "[", "}": "{" }`.

</details>

<details>
<summary>Hint 2: the three ways to fail</summary>

There are exactly three: a closer that doesn't match the top of the stack, a closer when the stack is empty, and openers still on the stack at the end. Trace `"([)]"`, `")("` and `"(("` by hand and find each one.

</details>

<details>
<summary>Hint 3: popping an empty stack</summary>

In JavaScript, `[].pop()` gives `undefined` and doesn't crash. Comparing `undefined` with the opener you need gives false, which happens to be the right answer. Say that out loud in an interview. It shows the interviewer you saw the edge coming.

</details>

## Hand it in

When all three tests pass, commit and push.

```submit
assignment: dsa-stack
```

Paste the link to your `parsity-labs` repository. We check the `problems/stack` folder, including brackets in the wrong order, brackets left open and nesting 200,000 deep.

## Stretch: days until warmer

Not graded. Do it on paper, then in code if you like.

You get a list of daily temperatures. For each day, give the number of days until a warmer one, or 0 if none comes. `[73, 74, 75, 71, 69, 72, 76, 73]` gives `[1, 1, 4, 2, 1, 1, 0, 0]`.

The slow answer looks ahead from every day: O(n²). The fast one walks forward once with a stack of days that are still waiting for a warmer day. When a warm day arrives, it answers every waiting day on top of the stack that's colder. Trace it by hand with the stack in its own column. This "stack of things still waiting" shape shows up in a surprising number of interview problems.

```quiz
[
  {
    "q": "Why can't you check brackets by counting openers and closers of each kind?",
    "options": ["\"([)]\" has balanced counts but closes in the wrong order", "Counting is too slow", "Counting can't handle empty text", "You can, counting works"],
    "answer": 0,
    "explain": "Counts only know how many. A stack knows which one was opened most recently, and that's what has to close next."
  },
  {
    "q": "Every closing bracket in \"(()\" matched the top of the stack. Why is the answer still false?",
    "options": ["A \"(\" is still on the stack at the end, so something was opened and never closed", "The first character is an opener", "It has an odd number of characters", "It isn't false"],
    "answer": 0,
    "explain": "Matching every closer isn't enough. When the text ends, the stack must also be empty."
  },
  {
    "q": "Which of these problems most clearly wants a stack?",
    "options": ["Check that every HTML tag is closed in the right order", "Find the most common word", "Process orders in the order they arrived", "Find a number in a sorted list"],
    "answer": 0,
    "explain": "Tags open and close with inner ones finishing first. That's the most recent unfinished thing, every time."
  }
]
```

## Key takeaways

- A stack fits whenever the most recent unfinished thing is the one that must finish next.
- Push openers. For each closer, pop and compare. At the end, the stack must be empty.
- Counting can't see order. A stack can.
- The stack answer is O(n) time and up to O(n) memory.
- Say the edge cases out loud: an empty stack when a closer arrives, and leftovers at the end.

## Work with AI

```ai-prompt
title: Break my bracket checker
---
I'm a beginner and I've written a function that checks whether brackets ( ), [ ] and
{ } in a string match, using a stack. I'll paste it below. Don't fix it and don't
rewrite it. Instead, act as a tester: give me five inputs, one at a time, that you
think might break it, and for each one ask me to predict the answer and then trace my
code by hand with the stack in its own column. If my code gives the wrong answer, ask
me questions until I find the line that's wrong.

[paste your bracketsMatch here]
```
