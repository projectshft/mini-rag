# Interview Problems: Two Pointers

> **In this lesson:** the two-pointer pattern, where you keep one position at each end of a list and walk them toward each other. It finds answers in one pass with no extra memory. You'll solve two classic problems with it, using the seven steps.

## Words you need first

- **Pointer.** In these problems, a variable that holds a position in an array or string, such as `left = 0`. It "points at" one item.
- **Sorted.** In order, smallest to largest.
- **In place.** Without making a copy. The work happens on the data you were given, so the extra memory is O(1).
- **Palindrome.** Text that reads the same forwards and backwards, such as "level".

## The idea

Most of the problems you've solved walk a list with one position, `i`, from the start to the end. Two pointers keep two positions at once, usually one at each end, and move them toward each other until they meet.

```js
let left = 0;
let right = items.length - 1;
while (left < right) {
  // look at items[left] and items[right]
  // then move one of them, or both, toward the middle
}
```

Each pass moves at least one pointer one step closer. They start `n - 1` apart, so the loop runs at most `n` times: O(n). And you only ever hold two numbers, so the extra memory is O(1).

The whole trick is in the comment: **deciding which pointer to move.** Every two-pointer problem has a reason why one side can safely be dropped.

## Work one by hand

Here's a warm-up that isn't one of your graded problems: in a **sorted** list, find two numbers that add up to a target.

```js
// pairInSorted([1, 3, 4, 6, 8, 11], 10) gives [2, 3], because 4 + 6 is 10
```

Start with a pointer at each end. Add the two values.

- Too big? The right value is too large to pair with anything. Every other value is at least as big as the left one, so the sum could only grow. Move `right` in.
- Too small? The left value is too small to pair with anything, for the same reason the other way round. Move `left` in.
- Just right? Done.

| Pass | left | right | values | sum | what to do |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 1 + 11 | 12 | too big, move right in |
| 2 | 0 | 4 | 1 + 8 | 9 | too small, move left in |
| 3 | 1 | 4 | 3 + 8 | 11 | too big, move right in |
| 4 | 1 | 3 | 3 + 6 | 9 | too small, move left in |
| 5 | 2 | 3 | 4 + 6 | 10 | found it: [2, 3] |

Five passes for six numbers. The slow way, every pair, would check up to 15. On a million numbers, it's a million steps against about 500 billion.

```js
function pairInSorted(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return [left, right];
    if (sum > target) right--;
    else left++;
  }
  return null;
}
```

Compare this with the pair problem you solved with an object. That one worked on any list and used O(n) memory. This one needs the list sorted, and uses O(1). Knowing which one fits, and saying why, is exactly what interviewers listen for.

```order
title: One pass of pairInSorted, in order
---
Add the values at left and right
If the sum equals the target, give back both positions
If the sum is too big, move right one step left
Otherwise, move left one step right
Check that left is still less than right before the next pass
```

## When to reach for it

- The input is **sorted**, or sorting it first is allowed and cheap enough.
- You're comparing the **two ends** of something: palindromes, reversing in place.
- You're looking for a **pair** and can argue that one side can be dropped after each look.
- The problem asks for O(1) extra memory.

```match
{
  "title": "Two pointers, or something else?",
  "note": "Tap the problem, then the best first tool.",
  "pairs": [
    { "left": "Is this word the same backwards?", "right": "Two pointers from both ends" },
    { "left": "Two numbers in a sorted list that add to 100", "right": "Two pointers, moving the side that's too big or too small" },
    { "left": "Two numbers in an unsorted list that add to 100", "right": "An object of numbers already seen" },
    { "left": "How many times does each word appear?", "right": "A tally object" }
  ]
}
```

## Open the problems

Use the `problems` folder you downloaded with the first set of interview problems. **Don't download it again.** That would replace your finished answers with empty files.

If you have no `problems` folder at all, run this once from the top of `parsity-labs`:

```bash
curl -sL https://ai.parsity.io/labs/problems.tar.gz | tar xz
```

Then:

```bash
cd problems/two-pointers
node --test
```

Write these by hand, in any language you like while you practice. The version you hand in is JavaScript. Use the seven steps on each: say it back, ask about the edges, work an example by hand, say the slow answer and its Big O, make it faster, write the code, test it out loud.

**Try it yourself first.** Give each problem 30 minutes of real effort before you open a hint, including a trace table on paper. Then one hint at a time, with 15 more minutes between them.

## Problem 1: Reads the same both ways

Open `palindrome.js`. Write `isPalindrome(text)`: true when the text reads the same forwards and backwards once you ignore capital letters and anything that isn't a letter or a digit. `"A man, a plan, a canal: Panama"` is one.

Step two matters here. What about empty text? Text that's all punctuation? Digits, as in `"0P"`?

You could build a cleaned-up copy and compare it with its reverse. That works, and it's a fine slow answer to say out loud. The two-pointer version skips the copy.

<details>
<summary>Hint 1: what do the pointers compare?</summary>

Put `left` at the first character and `right` at the last. If both are letters or digits, compare them in lowercase. What should happen if they're different? If they're the same?

</details>

<details>
<summary>Hint 2: skipping the junk</summary>

If the character at `left` isn't a letter or digit, move `left` on and go round again without comparing. Same for `right`. The comment in the file gives you a test for "letter or digit", which works on a lowercase character.

</details>

<details>
<summary>Hint 3: when are you done?</summary>

When the pointers meet or cross, every pair has matched. Give back true. Trace `"0P"` by hand: it should be false, because `0` and `p` are both characters that count.

</details>

## Problem 2: The biggest water tank

Open `most-water.js`. Write `mostWater(heights)`. Each number is a wall. Pick two walls: the water they hold is the shorter wall's height times the distance between them. Give the most any two walls can hold.

Draw the example from the comment on paper before anything else. Bars on a grid make it obvious.

The slow answer tries every pair of walls. Say its Big O, then ask yourself: after looking at the two outer walls, which one can never be part of a better answer?

<details>
<summary>Hint 1: start wide</summary>

Start with the two outermost walls. That's the widest tank you'll ever have. Every other tank is narrower, so to do better it would have to be taller.

</details>

<details>
<summary>Hint 2: which wall limits the water?</summary>

The water level is set by the shorter of the two walls. If you move the taller wall inward, the width shrinks and the level can't rise above the shorter wall. Can that ever beat what you have?

</details>

<details>
<summary>Hint 3: the move</summary>

Each pass: work out the water for `left` and `right`, keep it if it's the best so far, then move whichever pointer is at the shorter wall. If they're equal, moving either is fine.

</details>

## Hand it in

When all six tests pass, commit and push.

```submit
assignment: dsa-two-pointers
```

Paste the link to your `parsity-labs` repository. We check the `problems/two-pointers` folder, including a row of 200,000 walls. The answer that tries every pair won't finish in time.

```quiz
[
  {
    "q": "In pairInSorted on a sorted list, the sum of the two pointers is bigger than the target. Why is it safe to move right inward?",
    "options": ["Every other left value is at least as big, so the right value can't be part of any pair that works", "Because the list is short", "Because the right side is always bigger than the target", "It isn't safe, you have to check every pair"],
    "answer": 0,
    "explain": "The left value is the smallest one still in play. If even that is too big with the right value, nothing will work with it. Dropping it loses nothing."
  },
  {
    "q": "What is the extra memory of the two-pointer palindrome check?",
    "options": ["O(1), just two positions", "O(n), because it copies the text", "O(n²)", "O(log n)"],
    "answer": 0,
    "explain": "It reads the text where it is and keeps two numbers. The version that builds a cleaned copy and reverses it uses O(n)."
  },
  {
    "q": "In the water tank problem, the left wall is 2 high and the right wall is 9. Which pointer do you move?",
    "options": ["Left, because the shorter wall limits the water and moving the taller one can't help", "Right, because it's taller", "Both at once", "Neither, try every pair from here"],
    "answer": 0,
    "explain": "With the left wall at 2, every narrower tank using it holds less. The only hope of more water is a taller wall in its place."
  }
]
```

## Key takeaways

- Two pointers keep one position at each end and walk them toward each other: O(n) time and O(1) extra memory.
- The real work is the argument for which pointer to move. Say it out loud.
- Sorted input is the strongest hint that two pointers fit.
- An unsorted pair problem usually wants a frequency counter instead. Know both and say why you picked one.
- Follow the seven steps. Drawing the input, as with the water walls, is part of working an example by hand.

## Work with AI

```ai-prompt
title: Make me defend the pointer move
---
I'm a beginner learning the two-pointer pattern. I'll explain my solution to the
"biggest water tank" problem: walls of different heights, the water between two walls
is the shorter height times the distance, find the most water. Don't give me code or
the answer. After I explain, act as a skeptical interviewer: ask me why moving the
shorter wall is safe, then give me a specific list of heights and ask me to trace my
pointers on it, one row per step. If my reasoning has a hole, give me an input that
exposes it and let me find the problem myself.
```
