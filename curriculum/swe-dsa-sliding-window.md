# Interview Problems: Sliding Window

> **In this lesson:** the sliding window, a pattern for questions about runs of items next to each other: the best three days in a row, the longest stretch with no repeats. Instead of re-checking every run from scratch, you slide one window along and update it as you go. You'll solve two classic problems with it.

## Words you need first

- **Run.** Items that sit next to each other in a list or string, with nothing skipped. In `[4, 1, 7, 2]`, `[1, 7]` is a run and `[4, 7]` isn't.
- **Window.** The run you're looking at right now, marked by a `left` position and a `right` position.
- **Slide.** Move the window along: add the item that comes in on the right, drop the one that falls off on the left.
- **Running total.** A total you keep updated as items come and go, instead of adding everything up again.

## The slow way first

A bakery wants the best three days in a row for sales:

```js
const sales = [2, 1, 5, 1, 3, 2];
```

The obvious answer looks at every run of three and adds it up:

```js
function bestThree(sales) {
  let best = -Infinity;
  for (let start = 0; start + 3 <= sales.length; start++) {
    let total = 0;
    for (let i = start; i < start + 3; i++) total += sales[i];
    if (total > best) best = total;
  }
  return best;
}
```

With a window of 3 that's fine. Now ask for the best 1,000 days in a row out of a million. Every run is added up from scratch: about a billion additions. And notice what's wasted. The run starting on the first day and the run starting on the second day share all but two days.

## The idea: slide it

When the window moves one step right, exactly one item comes in and one goes out. So don't add it all up again. Take the old total, add the new item, subtract the one that left.

| Window | Comes in | Goes out | Total |
| --- | --- | --- | --- |
| [2, 1, 5] | | | 8 |
| [1, 5, 1] | 1 | 2 | 8 + 1 - 2 = 7 |
| [5, 1, 3] | 3 | 1 | 7 + 3 - 1 = 9 |
| [1, 3, 2] | 2 | 5 | 9 + 2 - 5 = 6 |

Best is 9. Each slide is O(1) work, so the whole thing is O(n) whatever the window size.

```js
function bestRun(sales, size) {
  let total = 0;
  for (let i = 0; i < size; i++) total += sales[i];
  let best = total;
  for (let right = size; right < sales.length; right++) {
    total = total + sales[right] - sales[right - size];
    if (total > best) best = total;
  }
  return best;
}
```

```blanks
{
  "title": "Slide the window by one",
  "note": "The window has size items and ends at right.",
  "code": "total = total ___1___ sales[right] ___2___ sales[___3___];",
  "blanks": [
    { "options": ["+", "-", "*"], "answer": "+", "explain": "The item at right is coming into the window, so it's added." },
    { "options": ["-", "+", "/"], "answer": "-", "explain": "One item falls off the left as the window moves, so its value comes out of the total." },
    { "options": ["right - size", "right - 1", "0"], "answer": "right - size", "explain": "The window is size long and now ends at right, so the item that just fell off sits size places back." }
  ]
}
```

## Windows that grow and shrink

Many problems don't give you a size. They give you a rule, and ask for the longest (or shortest) run that keeps it. The window then changes size:

1. Move `right` one step to bring in a new item.
2. While the rule is broken, move `left` one step to drop an item.
3. Now the window follows the rule. Check whether it's the best so far.

Work one by hand: the longest run of these numbers with a total of 8 or less.

```js
const numbers = [3, 1, 2, 7, 1, 1];
```

| right | Brings in | Total | Rule broken? Drop from left | Window after | Best |
| --- | --- | --- | --- | --- | --- |
| 0 | 3 | 3 | no | [3] | 1 |
| 1 | 1 | 4 | no | [3, 1] | 2 |
| 2 | 2 | 6 | no | [3, 1, 2] | 3 |
| 3 | 7 | 13 | drop 3, then 1, then 2: total 7 | [7] | 3 |
| 4 | 1 | 8 | no | [7, 1] | 3 |
| 5 | 1 | 9 | drop 7: total 2 | [1, 1] | 3 |

The answer is 3. This only works because every number is positive, so dropping one always lowers the total. When you meet a variation, check that the same reasoning still holds.

### The Big O surprise

That loop has a `while` inside a `for`. You learned that a loop inside a loop is often O(n²). Here it isn't. Count what happens to each item: it enters the window once, when `right` reaches it, and leaves at most once, when `left` passes it. `left` never moves backwards. So across the whole run there are at most `n` steps of `right` and `n` steps of `left`: O(n).

Counting how many times each item is touched, instead of counting loops, is a skill interviewers like to hear. Say it when you use this pattern.

```order
title: One step of a growing and shrinking window
---
Move right one step and bring the new item in
Update what you know about the window
While the rule is broken, drop the item at left and move left on
Check whether this window is the best so far
```

## When to reach for it

- The problem says **in a row**, **consecutive**, **substring** (a run of characters) or **subarray** (a run of items).
- It asks for the **longest**, **shortest**, **biggest** or **smallest** such run.
- The slow answer checks every start and every end.

If the items don't have to be next to each other, a window won't help. "Any two numbers" is a different problem from "two numbers in a row".

## Open the problems

Use the `problems` folder you downloaded with the first set of interview problems. **Don't download it again.** That would replace your finished answers with empty files. If you have no `problems` folder at all, run `curl -sL https://ai.parsity.io/labs/problems.tar.gz | tar xz` once from the top of `parsity-labs`.

```bash
cd problems/sliding-window
node --test
```

Write these by hand, in any language you like while you practice; the version you hand in is JavaScript. Use the seven steps: say it back, ask about the edges, work an example by hand, say the slow answer and its Big O, make it faster, write the code, test it out loud.

**Try it yourself first.** Give each problem 30 minutes of real effort, with a trace table like the ones above, before opening a hint. Then one hint at a time, with 15 more minutes between them.

## Problem 1: The best day to buy and sell

Open `best-trade.js`. Write `bestTrade(prices)`: buy on one day, sell on a later day, and give the most you can make. If no trade makes money, give 0.

Step two: what if there are no days? One day? What if the lowest price comes after the highest, as in `[3, 8, 1, 4]`? Taking the biggest number minus the smallest gives 7 there, which is wrong. Why?

<details>
<summary>Hint 1: the slow answer</summary>

Try every buy day, and for each one every later sell day. Say its Big O. Now: when you look at a sell day, which buy day is the only one worth knowing about?

</details>

<details>
<summary>Hint 2: what to remember</summary>

The best day to have bought, for any sell day, is the cheapest day before it. So walk the days once and remember the lowest price you've seen so far. That's the left edge of your window, and it only moves when a new low shows up.

</details>

<details>
<summary>Hint 3: the order inside the loop</summary>

For each price: update the lowest so far, then work out what selling today would make against that lowest, and keep it if it's the best so far. Trace `[3, 8, 1, 4]` and check you get 5.

</details>

## Problem 2: The longest stretch with no repeats

Open `longest-no-repeat.js`. Write `longestNoRepeat(text)`: the length of the longest run of characters with no character in it twice. In `"abcabcbb"` it's 3, for `"abc"`.

This is a grow-and-shrink window. The rule is "no character appears twice in the window".

<details>
<summary>Hint 1: what does the window need to know?</summary>

To check the rule fast, you need to answer "is this character already in the window?" in O(1). Which tool you already know remembers what you've seen and answers that in O(1)?

</details>

<details>
<summary>Hint 2: breaking the rule</summary>

Keep a `Set` of the characters in the window. When the character at `right` is already in the set, the rule is about to break. Drop characters from the left, removing each from the set, until it isn't in there any more. Then add it.

</details>

<details>
<summary>Hint 3: the case that catches people</summary>

Trace `"abba"` by hand. The right answer is 2. If you tried jumping `left` straight to "just after where I last saw this character", check whether `left` can ever move backwards. It mustn't.

</details>

## Hand it in

When all six tests pass, commit and push.

```submit
assignment: dsa-sliding-window
```

Paste the link to your `parsity-labs` repository. We check the `problems/sliding-window` folder, including 200,000 days of prices and text with 50,000 different characters.

```quiz
[
  {
    "q": "A grow-and-shrink window has a while loop inside a for loop. Why is it O(n) and not O(n²)?",
    "options": ["Each item enters the window once and leaves at most once, and left never moves back", "Because while loops are faster than for loops", "Because the window is small", "It is O(n²)"],
    "answer": 0,
    "explain": "Count the moves of each pointer over the whole run, not the loops. right moves n times and left moves at most n times."
  },
  {
    "q": "Which of these is a sliding window problem?",
    "options": ["The highest total of any 7 days in a row", "The two highest numbers anywhere in the list", "Whether a word is a palindrome", "How many times each word appears"],
    "answer": 0,
    "explain": "\"In a row\" means a run of items next to each other. The others don't care which items are neighbors."
  },
  {
    "q": "For bestTrade([3, 8, 1, 4]), someone gives back the highest price minus the lowest. What's wrong?",
    "options": ["They'd be buying at 1 after selling at 8, which isn't allowed, so they give 7 instead of 5", "Nothing, 7 is right", "It fails on empty lists only", "It's too slow"],
    "answer": 0,
    "explain": "You have to buy before you sell. The cheapest price only counts against prices that come after it."
  }
]
```

## Key takeaways

- A sliding window looks at runs of items next to each other without starting from scratch each time.
- A fixed window adds the item coming in and removes the one going out: O(1) per step.
- A growing and shrinking window moves `right` to add and `left` to restore the rule. `left` never moves back.
- Count how many times each item is touched to find the Big O. A loop inside a loop isn't always O(n²).
- Words like "in a row", "substring" and "longest stretch" are the signal.

## Work with AI

```ai-prompt
title: Give me windows to trace
---
I'm a beginner learning the sliding window pattern, using the rule "move right to add
an item, move left while the rule is broken". Give me three small problems, one at a
time, each with a short input: one fixed-size window and two that grow and shrink.
Don't name the answer. For each, ask me to fill in a trace table with one row per step
of right, showing the window and what I'm keeping track of. Check each row I write.
After the third, ask me to explain in two sentences why the growing and shrinking
version is O(n). Don't write any code for me.
```
