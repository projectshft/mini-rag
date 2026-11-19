# Interview Problems: Intervals

> **In this lesson:** problems about ranges with a start and an end: meetings, bookings, shifts, time a server was down. Almost all of them start the same way: sort by start time, then walk once. You'll learn to sort with a compare function, the one-line rule for overlap, and solve the classic merging problem.

## Words you need first

- **Interval.** A range with a start and an end, written `[start, end]`. A meeting from 9 to 11 is `[9, 11]`.
- **Overlap.** Two intervals share at least one moment. In this lesson, `[1, 3]` and `[3, 5]` overlap, because they meet at 3.
- **Merge.** Replace overlapping intervals with one that covers them all.
- **Compare function.** A small function you hand to `sort` that says which of two items comes first.

## Where intervals show up

A meeting room booking system has to know if two bookings clash. A status page shows when a service was down, and five overlapping alerts should become one outage. A payroll system adds up shifts that might overlap. Each of these is a list of intervals, and in each one the interesting question is about overlap.

## The overlap rule

Take two intervals where `a` starts no later than `b`. They overlap if `b` starts before `a` ends, or exactly when it ends:

```js
// a[0] <= b[0] is already true
const overlaps = b[0] <= a[1];
```

Draw a few pairs on a number line to convince yourself: `[1, 5]` and `[2, 3]` (one inside the other), `[1, 3]` and `[3, 5]` (touching), `[1, 2]` and `[4, 6]` (a gap). The rule only needs one comparison because you know which one starts first. That's the reason to sort.

## Sorting with a compare function

JavaScript's `sort` puts things in order, but by default it compares them as text. That gives surprises:

```js
[10, 9, 1].sort();   // [1, 10, 9], because "10" comes before "9" as text
```

Give it a compare function. It gets two items, `a` and `b`, and returns a negative number if `a` should come first, a positive number if `b` should, and 0 if it doesn't matter. Subtracting does all three at once:

```js
[10, 9, 1].sort((a, b) => a - b);                  // [1, 9, 10]
bookings.sort((a, b) => a[0] - b[0]);              // by start time
```

Two things to know about `sort`:

- **It changes the array you call it on.** If the caller didn't ask for that, copy first: `[...bookings].sort(...)`. If the items are arrays too, and you'll change them, copy those as well.
- **It's O(n log n).** That's a little slower than O(n) and far faster than O(n²). On a million items it's about 20 million steps. Interviewers expect you to know this number for sorting.

## Work one by hand: merging

Merge these bookings:

```js
[[8, 10], [1, 3], [15, 18], [2, 6], [9, 12]]
```

First, sort by start: `[[1, 3], [2, 6], [8, 10], [9, 12], [15, 18]]`. Then walk once, keeping a list of merged bookings. For each booking, look only at the **last** merged one. Because of the sort, nothing earlier can overlap.

| Booking | Last merged | Overlap? | What happens | Merged after |
| --- | --- | --- | --- | --- |
| [1, 3] | (none) | | add it | [1, 3] |
| [2, 6] | [1, 3] | 2 <= 3, yes | stretch the end to 6 | [1, 6] |
| [8, 10] | [1, 6] | 8 <= 6, no | add it | [1, 6], [8, 10] |
| [9, 12] | [8, 10] | 9 <= 10, yes | stretch the end to 12 | [1, 6], [8, 12] |
| [15, 18] | [8, 12] | 15 <= 12, no | add it | [1, 6], [8, 12], [15, 18] |

One detail in "stretch the end". When a booking overlaps, the merged end becomes the **bigger** of the two ends. Take `[1, 10]` then `[2, 3]`: they overlap, and the merged booking is still `[1, 10]`. Setting the end to 3 would shrink it. Trace that pair on your own before you code.

```order
title: Merge a list of bookings
---
Copy the bookings so the caller's list isn't changed
Sort the copy by start time
Walk the sorted bookings once
If one overlaps the last merged booking, stretch that booking's end
Otherwise, add it as a new merged booking
```

### Slow and fast

The slow answer compares every booking with every other, merges any pair that overlaps, and repeats until a full pass changes nothing. Each pass is O(n²), and it can need many passes. With sorting first, it's O(n log n) for the sort plus O(n) for the walk: O(n log n) overall. The merged list takes O(n) memory.

## When to reach for it

- The items have a **start and an end**.
- The question is about **overlap**, gaps, clashes, or covering time.
- The slow answer compares every pair. Sorting by start often turns that into one walk.

```match
{
  "title": "Overlap or not?",
  "note": "Each pair is already sorted by start. Tap the pair, then the answer.",
  "pairs": [
    { "left": "[1, 5] and [2, 3]", "right": "Overlap: one is inside the other" },
    { "left": "[1, 3] and [3, 5]", "right": "Overlap: they touch at 3" },
    { "left": "[1, 2] and [4, 6]", "right": "No overlap: there's a gap from 2 to 4" }
  ]
}
```

## Open the problem

Use the `problems` folder you downloaded with the first set of interview problems. **Don't download it again.** That would replace your finished answers with empty files. If you have no `problems` folder at all, run `curl -sL https://ai.parsity.io/labs/problems.tar.gz | tar xz` once from the top of `parsity-labs`.

```bash
cd problems/intervals
node --test
```

Write it by hand, in any language you like while you practice. The version you hand in is JavaScript. Use the seven steps: say it back, ask about the edges, work an example by hand, say the slow answer and its Big O, make it faster, write the code, test it out loud. For intervals, step three means drawing them on a number line.

**Try it yourself first.** Give the problem 30 minutes of real effort before you open a hint. Then one hint at a time, with 15 more minutes between them.

## Problem: Combine overlapping bookings

Open `merge-bookings.js`. Write `mergeBookings(bookings)`: a new list where every group of overlapping bookings has become one booking, sorted by start. Don't change the list you were given.

Step two questions: no bookings? One booking? Bookings that only touch? A booking entirely inside another? Bookings given out of order? Negative numbers?

<details>
<summary>Hint 1: get them in order</summary>

Copy the list and sort the copy by start time with a compare function. Check that the caller's list is unchanged afterwards. If you plan to change the end of a merged booking, make sure it's your own copy of that booking, not the caller's.

</details>

<details>
<summary>Hint 2: compare with one booking only</summary>

Walk the sorted list. For each booking, compare it with the last booking in your merged list, `merged[merged.length - 1]`. When the merged list is empty, there's nothing to compare with, so just add it.

</details>

<details>
<summary>Hint 3: stretching the end</summary>

When they overlap, the merged booking's end becomes `Math.max(` its own end, the new booking's end `)`. Trace `[[1, 10], [2, 3], [4, 5]]`: the answer is `[[1, 10]]`.

</details>

## Hand it in

When all three tests pass, commit and push.

```submit
assignment: dsa-intervals
```

Paste the link to your `parsity-labs` repository. We check the `problems/intervals` folder, including bookings out of order, one inside another, touching, repeated and negative, 200,000 bookings, and whether your function changed the list it was given.

## Stretch: can one person attend them all?

Not graded. Do it on paper. Given a list of meetings, can one person attend every one of them? Sort, then walk once. What are you comparing on each step, and what's the Big O? Then try the follow-up interviewers love: what's the fewest meeting rooms needed so every meeting has one?

```quiz
[
  {
    "q": "Why sort bookings by start time before merging?",
    "options": ["Then each booking can only overlap the last merged one, so one walk is enough", "Sorting removes overlaps", "The answer has to be sorted, and that's the only reason", "Sorting makes it O(n)"],
    "answer": 0,
    "explain": "After sorting, every earlier merged booking ends before the last one starts, so it can't reach the new one. You only ever compare with one booking."
  },
  {
    "q": "Merging [1, 10] and then [2, 3], someone sets the merged end to the new booking's end. What do they get?",
    "options": ["[1, 3], which loses the time from 3 to 10", "[1, 10]", "[2, 3]", "Two separate bookings"],
    "answer": 0,
    "explain": "The new booking sits inside the old one. The merged end must be the bigger of the two ends."
  },
  {
    "q": "What does [10, 9, 1].sort() give in JavaScript?",
    "options": ["[1, 10, 9], because it compares them as text", "[1, 9, 10]", "[10, 9, 1]", "An error"],
    "answer": 0,
    "explain": "With no compare function, sort turns items into text. \"10\" comes before \"9\" as text, the way \"ba\" comes before \"c\". Pass (a, b) => a - b."
  }
]
```

## Key takeaways

- An interval is a `[start, end]` pair. Most interval problems start by sorting by start.
- Once sorted, two intervals overlap when the second starts no later than the first ends.
- Merging compares each interval with the last merged one only, and keeps the bigger end.
- `sort` changes the array it's called on and compares as text unless you give it a compare function.
- Sorting is O(n log n), which is what most interval answers cost.

## Work with AI

```ai-prompt
title: Give me interval puzzles on a number line
---
I'm a beginner learning interval problems. I know to sort by start, then walk once
comparing with the last merged interval. Give me four small lists of intervals, one
at a time, unsorted, including one inside another, two that only touch, and repeats.
For each, ask me to sort it, then fill in a table with one row per interval showing
what I compare it with, whether they overlap, and the merged list after. Check every
row. Then ask me one question about how I'd change the approach to count how many
intervals overlap at the busiest moment. Don't write code for me.
```
