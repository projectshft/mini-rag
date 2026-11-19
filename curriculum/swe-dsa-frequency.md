# Interview Problems: Frequency Counters

> **In this lesson:** the first of the interview problems you'll solve by hand through the rest of the program, and a seven-step method for solving any of them out loud. The pattern is the frequency counter: one pass over the data with an object that keeps count. You'll solve two classic problems with it.

## Words you need first

- **Interview problem.** A short puzzle an interviewer asks you to solve in front of them, usually by writing one function. They watch how you think as much as whether you finish.
- **Pattern.** A way of solving that works for a whole family of problems. Learn the pattern and you've learned dozens of problems at once.
- **Frequency.** How often something shows up. The frequency of "a" in "banana" is 3.
- **Tally.** An object whose keys are the things you've seen and whose values are how many times you've seen each.
- **Edge case.** An input at the edge of what's allowed: empty, one item, all the same, negative, huge. Most bugs live there.

## Why interview problems, and why by hand

Most companies still ask candidates to solve small coding problems live. You'll write the code yourself, with no agent and often no autocomplete, while explaining your thinking.

That sounds like a strange test for a job where an agent writes much of the code. It isn't as strange as it looks. An interviewer is checking whether you can break a problem down, spot when code will be slow, think of the inputs that break it, and explain your choices. Those are the same skills you use every time you review an agent's work.

Through the rest of the program you'll get one problem lesson every so often, each on one pattern. The rules for all of them:

- **Write them yourself.** No agent writes any of this code. An agent may quiz you or explain an idea after you've tried, never hand you a solution.
- **Any language you like, for practice and in interviews.** Interviewers almost always let you choose. Pick the one you know best.
- **The version you hand in is JavaScript.** Our hidden tests run JavaScript, so that's what gets graded.
- **Talk out loud while you solve, even alone.** It feels silly. It's also exactly what the interview asks of you, and it gets easier only with practice.

## The seven steps

Here is a method that works on every problem in this program, and on most of what you'll see in interviews. Every problem lesson after this one uses it, by name. Learn the steps now.

1. **Say it back.** Restate the problem in your own words. "So I get two strings, and I give back true if one is a rearrangement of the other."
2. **Ask about the edges.** Can the input be empty? Can there be repeats? Negative numbers? Capital letters? How big can it get? Write the answers down.
3. **Work an example by hand.** Pick a small input and solve it on paper, with no code. Notice what you did in your head. That's usually the algorithm.
4. **Say the slow answer and its Big O.** Describe the obvious way, even if it's slow, and say how it grows. "Compare every pair: that's O(n²)." Now you have something that works.
5. **Make it faster.** Ask what work the slow answer repeats. Can you remember something instead of looking for it again?
6. **Write the code.** Only now. Say what each part is for as you write it.
7. **Test it out loud.** Walk your example through the code line by line, then one edge case. Find your own bug before the interviewer does.

Interviewers care about steps 1 to 5 more than candidates expect. Someone who asks good questions, finds the slow answer, and improves it with clear reasoning often does better than someone who silently writes a perfect answer.

```order
title: Put the seven steps in order
---
Say the problem back in your own words
Ask about empty input, repeats, negatives and size
Solve a small example on paper
Describe the slow answer and its Big O
Find the repeated work and remove it
Write the code
Walk an example and an edge case through your code
```

## The pattern: keep a tally

You've already used a `Set` to remember what you've seen and an object to count words. Interviewers call that a **frequency counter**. Here it is on its own:

```js
function tally(text) {
  const counts = {};
  for (const ch of text) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}
```

The one odd-looking line: `counts[ch]` is `undefined` the first time you see a letter. `undefined || 0` gives `0`, so the first count becomes 1. After that, the count is a number and `||` keeps it.

### Work it by hand

Trace `tally("banana")`. One row per pass of the loop:

| Pass | ch | counts after this pass |
| --- | --- | --- |
| 1 | b | { b: 1 } |
| 2 | a | { b: 1, a: 1 } |
| 3 | n | { b: 1, a: 1, n: 1 } |
| 4 | a | { b: 1, a: 2, n: 1 } |
| 5 | n | { b: 1, a: 2, n: 2 } |
| 6 | a | { b: 1, a: 3, n: 2 } |

Six letters, six passes. Each pass does a lookup and an update in the object, and both are O(1) no matter how big the object gets.

```blanks
{
  "title": "Finish the tally",
  "note": "Each blank is a choice beginners get wrong.",
  "code": "function tally(items) {\n  const counts = ___1___;\n  for (const item of items) {\n    counts[item] = (counts[item] ___2___ 0) + 1;\n  }\n  return ___3___;\n}",
  "blanks": [
    { "options": ["[]", "{}", "0"], "answer": "{}", "explain": "The tally maps each item to a count, so it needs keys. That's an object." },
    { "options": ["&&", "+", "||"], "answer": "||", "explain": "counts[item] is undefined the first time. undefined || 0 gives 0. With && you'd get undefined, and undefined + 1 is NaN." },
    { "options": ["counts", "items", "item"], "answer": "counts", "explain": "The tally is what you built. Returning the input gives the caller back what they already had." }
  ]
}
```

### Slow and fast

Without a tally, counting every letter means, for each letter, looping over the whole text again to count it. A loop inside a loop over the same data: O(n²).

With a tally, it's one pass: O(n). You pay with memory, because the object holds one entry per different item. Developers call the extra memory **space** and describe it with Big O too. Here the space is at most O(n), and for lowercase letters it can't pass 26 entries.

### When to reach for it

Listen for these in a problem:

- "How many times...", "most common", "appears more than once".
- "Same letters", "same items in a different order".
- "Have I seen this before?"
- "Find two items that go together." Keep what you've seen in an object, and for each new item, look up the partner it needs.

That last one surprises people. A tally doesn't have to hold counts. It can hold anything you'll want to look up later, such as the position where you saw a value.

```match
{
  "title": "Which tool fits?",
  "note": "Tap the problem, then what you'd keep as you walk the list.",
  "pairs": [
    { "left": "Do two words use exactly the same letters?", "right": "An object of letter counts" },
    { "left": "Is any number in the list repeated?", "right": "A Set of numbers already seen" },
    { "left": "Which earlier number adds to this one to make 50?", "right": "An object from number to its position" },
    { "left": "What's the largest number in the list?", "right": "One variable holding the best so far" }
  ]
}
```

## Get the problems

You'll download every problem for the rest of the program now, once. From the top of your `parsity-labs` folder:

```bash
curl -sL https://ai.parsity.io/labs/problems.tar.gz | tar xz
git add .
git commit -m "Add the interview problems"
```

You now have a `problems` folder with one folder per pattern. Only `problems/frequency` is for this lesson. Leave the others alone until their lessons come up.

**Don't run that download line again later.** It would replace your finished answers with empty files.

Each problem is one file with an empty function and a comment that explains it, plus a test file with a few tests you can see. From inside a pattern's folder:

```bash
cd problems/frequency
node --test
```

The tests you can see are small on purpose. Ours, which run when you hand in, check empty input, one item, repeats, negative numbers, and inputs of hundreds of thousands of items. The slow answer won't pass them.

## How to work each problem

1. Read the comment at the top of the file.
2. Do the seven steps on paper first, out loud. Write down your edge-case questions and decide the answers from the comment.
3. Then write the code, and run the tests.

**Try it yourself first.** Give each problem 30 minutes of real effort before you open a hint: paper, a trace table, saying it out loud. Then open one hint and give it another 15 minutes before the next. If you're still stuck after the last hint, bring it to office hours or your mentor. Struggling with these is normal, and the struggle is where you learn them.

## Problem 1: Same letters, different order

Open `same-letters.js`. Write `sameLetters(a, b)`: true when `b` uses exactly the same letters as `a`, the same number of times each, in any order. `"listen"` and `"silent"` are a match. `"cat"` and `"car"` aren't.

Before you code, ask yourself the step-two questions. What about two empty strings? What about `"aab"` and `"abb"`, which use the same letters but not the same number of times?

<details>
<summary>Hint 1: start with the cheap check</summary>

If the two strings have different lengths, can they possibly use the same letters the same number of times? That check is O(1) and rules out a lot.

</details>

<details>
<summary>Hint 2: what would you count?</summary>

Tally the letters of `a`. Now, what would the tally of `b` have to look like for the answer to be true?

</details>

<details>
<summary>Hint 3: one tally is enough</summary>

Tally `a`. Then walk through `b` and take one off the count for each letter. If you ever need to take one off a letter whose count is already zero, or missing, the answer is false. If you get to the end with equal lengths, it's true.

</details>

## Problem 2: A pair that adds up

Open `pair-sum.js`. Write `pairSum(numbers, target)`: find two different positions whose values add up to `target`, and give them back as `[i, j]` with `i` smaller than `j`. If no pair works, give `null`.

This is one of the most asked interview problems there is. The slow answer, checking every pair with a loop inside a loop, is O(n²). Say it out loud anyway: it's step four. Then make it faster.

<details>
<summary>Hint 1: what are you looking for?</summary>

You're standing on one number. You know the target. Which exact number would complete the pair? Write it as a sum.

</details>

<details>
<summary>Hint 2: remember instead of searching</summary>

The slow answer searches the rest of the list for that partner. What if, as you walk the list once, you keep an object of every number you've already passed, and where you saw it?

</details>

<details>
<summary>Hint 3: the order of the two steps matters</summary>

For each number: first look up whether its partner is already in your object. If it is, you're done. Only after that, store the current number and its position. Doing it in this order means a number can never pair with itself. Try `pairSum([3, 4], 6)` by hand to see why.

</details>

## Hand it in

When all six tests pass, commit and push.

```submit
assignment: dsa-frequency
```

Paste the link to your `parsity-labs` repository. We check the `problems/frequency` folder: your six tests first, then ours.

If one of our categories fails, read its name closely. "A letter used a different number of times" tells you exactly which input to try by hand.

```quiz
[
  {
    "q": "An interviewer gives you a problem. What should you do before writing any code?",
    "options": ["Say it back, ask about edge cases, work an example by hand and describe a slow answer", "Start typing so they see you're fast", "Ask for the optimal answer", "Write the fastest version you can think of straight away"],
    "answer": 0,
    "explain": "Steps one to four show how you think, catch misunderstandings early and give you a working answer to improve. Interviewers score that heavily."
  },
  {
    "q": "Someone checks whether two words use the same letters by testing that every letter of the first appears somewhere in the second, and that the lengths match. Which input proves them wrong?",
    "options": ["\"aab\" and \"abb\"", "\"abc\" and \"cba\"", "\"\" and \"\"", "\"cat\" and \"dog\""],
    "answer": 0,
    "explain": "Every letter of \"aab\" appears in \"abb\" and the lengths match, but a is used twice in one and once in the other. Counting catches it. Checking presence doesn't."
  },
  {
    "q": "In the fast pair-sum answer, you store each number in an object before checking for its partner. What goes wrong?",
    "options": ["A number can pair with itself, so [3, 4] with target 6 gives [0, 0]", "It becomes O(n²)", "Negative numbers stop working", "Nothing, the order doesn't matter"],
    "answer": 0,
    "explain": "3 is stored first, then you look for 6 - 3 = 3 and find the 3 you just stored. Check first, then store."
  }
]
```

## Key takeaways

- Use the seven steps on every problem: say it back, ask about the edges, work an example, say the slow answer, make it faster, code it, test it out loud.
- A frequency counter is one pass with an object or a `Set` that remembers what you've seen. It often turns O(n²) into O(n).
- The tally can hold counts, or anything you'll want to look up later, such as a position.
- Faster answers often cost memory. Say so when you give one.
- Interview problems are written by hand in any language you like. The graded version is JavaScript.

## Work with AI

```ai-prompt
title: Be my interviewer for one problem
---
Act as a friendly but realistic coding interviewer. I'm a beginner practicing a
seven-step method: say it back, ask about edge cases, work an example by hand, say
the slow answer and its Big O, make it faster, write the code, test it out loud.
Give me one easy problem that can be solved with a frequency counter (an object or
Set that remembers what I've seen). Don't name the pattern. Wait for me at each step.
If I skip a step, ask me about it the way an interviewer would. Don't give me the
answer or write code for me. If I'm stuck, ask me a question that points me in the
right direction. At the end, tell me which step I did best and which one I rushed.
```
