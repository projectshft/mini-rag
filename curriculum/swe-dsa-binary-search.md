# Interview Problems: Binary Search

> **In this lesson:** binary search, the way to find something in sorted data by halving where it could be, again and again. It finds one number among a million in about twenty looks. You'll learn to write it without the off-by-one bugs that catch nearly everyone, and use it on two classic problems.

## Words you need first

- **Sorted.** In order, smallest to largest.
- **Range.** The part of the list where the answer could still be, from a `low` position to a `high` position.
- **Middle.** The position halfway between `low` and `high`, rounded down.
- **Off-by-one bug.** A mistake where a loop or a position is wrong by exactly one: stopping one step early, or starting one place late.
- **Logarithm.** How many times you can halve a number before you reach 1. For a million, it's about 20. Written log n.

## The guessing game

I'm thinking of a number from 1 to 100. You guess, and I say "higher" or "lower".

Guessing 1, 2, 3 and so on takes up to 100 guesses. Everyone guesses 50 first. "Lower." Now it's between 1 and 49, so you guess 25. Every guess cuts what's left in half, and you'll have it in 7 guesses at most.

That's binary search. It needs one thing: **sorted data**, so that one look tells you which half the answer must be in.

| Items | Walking the list, worst case | Halving, worst case |
| --- | --- | --- |
| 100 | 100 | 7 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

Walking is O(n). Halving is O(log n). On a billion items, that's 30 steps.

## Work one by hand

Find 23 in this sorted list:

```js
const sorted = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
//  position:   0  1  2   3   4   5   6   7   8   9
```

Keep `low` and `high`, the first and last positions where 23 could still be. Look at the middle. If it's too small, everything up to the middle is too small, so move `low` past it. If it's too big, move `high` below it.

| Step | low | high | middle | value there | decision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | too small: low = 5 |
| 2 | 5 | 9 | 7 | 56 | too big: high = 6 |
| 3 | 5 | 6 | 5 | 23 | found at 5 |

Now look for 20, which isn't there:

| Step | low | high | middle | value there | decision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | too small: low = 5 |
| 2 | 5 | 9 | 7 | 56 | too big: high = 6 |
| 3 | 5 | 6 | 5 | 23 | too big: high = 4 |
| 4 | 5 | 4 | | | low is past high: not there, give -1 |

When `low` passes `high`, the range is empty. That's how you know to stop.

## Writing it without off-by-one bugs

Binary search is short and famously easy to get slightly wrong. Pick one style and use it every time. This one keeps `low` and `high` as the first and last positions that could still hold the answer:

```js
let low = 0;
let high = sorted.length - 1;
while (low <= high) {
  const middle = Math.floor((low + high) / 2);
  // compare sorted[middle] with the target, then
  // either return middle, or set low = middle + 1, or set high = middle - 1
}
```

Each piece is there for a reason:

- **`high = sorted.length - 1`**: the last real position. `sorted.length` is one past the end.
- **`low <= high`**: when they're equal, there's still one item left to check. Using `<` skips it, so a list of one item never finds anything.
- **`Math.floor`**: positions are whole numbers. `(0 + 9) / 2` is 4.5.
- **`middle + 1` and `middle - 1`**: you've already checked `middle`. If you set `low = middle`, the range can stop shrinking and the loop runs forever.

```blanks
{
  "title": "Finish the search loop",
  "note": "low and high are the first and last positions that could still hold the target.",
  "code": "while (low ___1___ high) {\n  const middle = Math.floor((low + high) / 2);\n  if (sorted[middle] === target) return middle;\n  if (sorted[middle] < target) low = ___2___;\n  else high = ___3___;\n}\nreturn -1;",
  "blanks": [
    { "options": ["<=", "<", "!=="], "answer": "<=", "explain": "When low equals high, one item is still in range. With < you'd never check it, and a one-item list could never be searched." },
    { "options": ["middle + 1", "middle", "high"], "answer": "middle + 1", "explain": "middle was too small, and so is everything before it. The range starts after it. low = middle can loop forever." },
    { "options": ["middle - 1", "middle", "low"], "answer": "middle - 1", "explain": "middle was too big, and so is everything after it. The range ends before it." }
  ]
}
```

## When to reach for it

- The data is **sorted**, and you're looking for something in it.
- The problem asks for O(log n), or the input is huge and you're told looking at all of it is too slow.
- There's a yes-or-no question that flips once as you go along the data: everything before some point is "no" and everything after is "yes". Binary search finds the flip.

That last one is how binary search turns up in problems that don't look like searching. Your second problem is one.

```match
{
  "title": "Which search fits?",
  "note": "Tap the situation, then the approach.",
  "pairs": [
    { "left": "Find a price in a sorted list of a million prices", "right": "Binary search: O(log n)" },
    { "left": "Find a name in an unsorted list, once", "right": "Walk the list: O(n)" },
    { "left": "Look up thousands of names in an unsorted list", "right": "Build a Set first, then each lookup is O(1)" },
    { "left": "Find where a sorted list was cut and turned around", "right": "Binary search on which half is out of order" }
  ]
}
```

## Open the problems

Use the `problems` folder you downloaded with the first set of interview problems. **Don't download it again.** That would replace your finished answers with empty files. If you have no `problems` folder at all, run `curl -sL https://ai.parsity.io/labs/problems.tar.gz | tar xz` once from the top of `parsity-labs`.

```bash
cd problems/binary-search
node --test
```

Write these by hand, in any language you like while you practice. The version you hand in is JavaScript. Use the seven steps: say it back, ask about the edges, work an example by hand, say the slow answer and its Big O, make it faster, write the code, test it out loud.

**How we check speed here.** Walking a million numbers is fast on a laptop, so a timer can't tell the two answers apart reliably. Our tests count how many items your code looks at in a list of a million. Binary search needs about 20. Walking the list, `indexOf`, `includes` or copying the list will fail.

**Try it yourself first.** Give each problem 30 minutes of real effort, with a trace table, before you open a hint. Then one hint at a time, with 15 more minutes between them.

## Problem 1: Find a number in a sorted list

Open `find-in-sorted.js`. Write `findInSorted(sorted, target)`: the position of `target`, or -1 if it isn't there.

Step two questions: an empty list? A list of one? A target smaller than everything, or bigger than everything? Negative numbers?

<details>
<summary>Hint 1: start from the trace</summary>

Your code should do exactly what the trace tables above did. Write the table for finding 9 in `[1, 3, 5, 7, 9]` before you write code, then turn each column into a variable.

</details>

<details>
<summary>Hint 2: when does the loop stop?</summary>

It stops when you find the target, or when the range is empty. The range is empty when `low` is greater than `high`. Trace a list of one item, `[5]`, looking for 5 and then for 7.

</details>

<details>
<summary>Hint 3: the four lines that matter</summary>

Start `low` at 0 and `high` at the last position. Loop while `low <= high`. Work out `middle` with `Math.floor`. Then: equal, give back `middle`; too small, `low = middle + 1`; too big, `high = middle - 1`. After the loop, give back -1.

</details>

## Problem 2: The smallest number in a turned list

Open `smallest-rotated.js`. A sorted list was turned: some items cut off the front and stuck on the end. `[1, 2, 3, 4, 5]` turned by two is `[3, 4, 5, 1, 2]`. Write `smallestRotated(numbers)` to find the smallest number.

The slow answer walks the list looking for the place where a number is smaller than the one before it. Say its Big O. Then find a way to halve.

Draw it first. A turned list is two sorted runs, one after the other, and the smallest number is where the second run starts.

<details>
<summary>Hint 1: one comparison tells you a lot</summary>

Compare the middle number with the **last** number in your range. If the middle is bigger than the last, can the list be in order between them? So where must the drop, and the smallest number, be?

</details>

<details>
<summary>Hint 2: the other case</summary>

If the middle is smaller than the last, everything from the middle to the end is in order. The smallest number could be the middle itself, or something to its left. So don't skip the middle: set `high = middle`.

</details>

<details>
<summary>Hint 3: a slightly different loop</summary>

Because you set `high = middle` in one case, use `while (low < high)`, and stop when the range is down to one item. That item is the smallest. Trace `[3, 4, 5, 1, 2]` and a list that wasn't turned at all, `[1, 2, 3]`. Then explain out loud why this loop uses `<` when the first problem used `<=`.

</details>

## Hand it in

When all six tests pass, commit and push.

```submit
assignment: dsa-binary-search
```

Paste the link to your `parsity-labs` repository. We check the `problems/binary-search` folder, including empty and one-item lists, every possible turn of a list, and lists of a million numbers where you may look at only a few.

```quiz
[
  {
    "q": "Someone writes binary search with `while (low < high)` and returns -1 after the loop. What fails?",
    "options": ["Searching a one-item list for the item it holds gives -1", "Every search is slower", "Searching for something smaller than every item", "Nothing fails"],
    "answer": 0,
    "explain": "With one item, low and high are both 0. 0 < 0 is false, so the loop never runs and the item is never checked."
  },
  {
    "q": "Roughly how many looks does binary search need to find one item among a million?",
    "options": ["About 20", "About 1,000", "About 500,000", "About 1,000,000"],
    "answer": 0,
    "explain": "Halving a million about 20 times gets you down to one. That's log n."
  },
  {
    "q": "In the turned list, the middle number is bigger than the last number in the range. Where is the smallest number?",
    "options": ["Somewhere after the middle", "At the middle", "Somewhere before the middle", "You can't tell without walking the list"],
    "answer": 0,
    "explain": "A sorted run would rise from the middle to the end. Since the end is smaller, the drop, which is where the smallest sits, must be between them."
  }
]
```

## Key takeaways

- Binary search finds something in sorted data by halving the range each look: O(log n).
- Keep `low` and `high` as the first and last positions that could still hold the answer, and loop while `low <= high`.
- Move past `middle` with `+ 1` and `- 1`, or the range can stop shrinking.
- Trace one-item lists and missing targets. Off-by-one bugs live there.
- Binary search also finds the point where a yes-or-no answer flips, which is how it solves problems that don't look like searching.

## Work with AI

```ai-prompt
title: Find the off-by-one bug
---
I'm a beginner learning binary search. Write me five short binary search functions in
JavaScript, one at a time. Four should each have exactly one off-by-one mistake, such
as the wrong loop condition, low = middle, or high starting at length. One should be
correct. Don't tell me which is which. For each, I'll pick a small input and trace it
in a table with low, high and middle, and tell you whether it's broken and on which
line. Tell me if my trace is right. If I call the correct one broken, ask me to find
an input that proves it.
```
