# Interview Problems: Greedy Choices

> **In this lesson:** greedy algorithms, which build an answer by taking the best-looking move at each step and never looking back. When they work, they're short and fast. When they don't, they're confidently wrong. You'll learn to test a greedy idea with counterexamples before you trust it, and solve a classic problem where greedy is exactly right.

## Words you need first

- **Greedy.** Making the choice that looks best right now, without trying the alternatives or undoing it later.
- **Counterexample.** One input where an idea gives the wrong answer. A single counterexample is enough to prove an idea wrong.
- **Optimal.** The best possible answer, such as the fewest coins or the largest total.
- **Reach.** In this lesson's problem, the farthest position you can get to so far.

## The cashier's way

A cashier owes you 63 cents in US coins: 25, 10, 5 and 1. Without thinking about it, they hand over the biggest coin that still fits, again and again.

| Step | Still owed | Biggest coin that fits | Coins so far |
| --- | --- | --- | --- |
| 1 | 63 | 25 | 25 |
| 2 | 38 | 25 | 25, 25 |
| 3 | 13 | 10 | 25, 25, 10 |
| 4 | 3 | 1 | 25, 25, 10, 1 |
| 5 | 2 | 1 | 25, 25, 10, 1, 1 |
| 6 | 1 | 1 | 25, 25, 10, 1, 1, 1 |

Six coins, the fewest possible. That's a **greedy** algorithm: at each step, take the move that looks best right now, and never reconsider. It's one pass, often O(n) or O(n log n) with a sort, and very short to write.

## When greedy is wrong

Now imagine a country with coins of 1, 3 and 4, and you owe 6.

- Greedy: take a 4 (2 left), then a 1, then a 1. **Three coins.**
- Best: 3 and 3. **Two coins.**

Same algorithm, different coins, wrong answer. Taking the 4 looked best and boxed you in. That's the risk with every greedy idea: a choice that's best now can make later choices worse.

So the rule for interviews: **before you trust a greedy idea, try to break it.** Hunt for a counterexample with small inputs. If you can't find one, try to say in a sentence why the greedy choice can never hurt. If you can say it, you've probably got it. If you find a counterexample, greedy is out, and the problem usually wants dynamic programming or backtracking instead.

```scenario
{
  "who": "Your interviewer",
  "setting": "You've just proposed a greedy answer: always take the biggest coin that fits.",
  "ask": "How do you know that always gives the fewest coins?",
  "note": "More than one answer is reasonable. Pick the one you'd actually say.",
  "options": [
    { "text": "For these coins I tried a few amounts by hand and it held. But it isn't true for every set of coins: with 1, 3 and 4, making 6 greedily takes three coins when 3 and 3 takes two. So I'd want to check the coins we're given, or use an approach that tries the options.", "verdict": "best", "feedback": "You showed you tested it, gave a concrete counterexample, and said what you'd do about it. That's exactly what the question is probing for." },
    { "text": "Taking the biggest coin first means fewer coins are left to give, so it has to be the fewest.", "verdict": "weak", "feedback": "It sounds right and it's the reasoning greedy ideas usually rely on. The interviewer will hand you coins 1, 3 and 4 and the amount 6, and it falls apart." },
    { "text": "It's a well-known algorithm, cashiers use it every day.", "verdict": "weak", "feedback": "That's true for the coins cashiers have. It doesn't answer whether it's always right, and the interviewer will ask what happens with different coins." },
    { "text": "I'm not sure it does. Can I try some small amounts to look for a case where it fails?", "verdict": "ok", "feedback": "Honest, and testing is the right instinct. It's stronger if you do the test out loud right then and report what you found." }
  ],
  "debrief": "A greedy idea is a claim. Interviewers want to see you test the claim, ideally by looking for a counterexample, before you build on it."
}
```

## When to reach for it

- The problem asks for the **most**, **fewest**, **farthest** or **earliest** of something.
- There's a natural "best move right now": the biggest coin, the meeting that ends first, the farthest you can reach.
- You can explain why the best move now never makes a later move worse. If you can't, look for a counterexample.

Greedy often follows a sort: sort meetings by end time, then take each one that doesn't clash. Many interval problems work the same way.

## Work one by hand: how far can you reach?

Here's the shape of your problem. A row of stones, and each number says how far you can jump forward from that stone: any distance from 1 up to that number. You start on the first stone. Can you reach the last?

```js
canReachEnd([2, 3, 1, 1, 4])   // true
canReachEnd([3, 2, 1, 0, 4])   // false
```

You could try every path: from stone 0, try jumping 1, then 2, and from each of those, every jump again. That's backtracking, and on long rows the number of paths explodes.

The greedy insight: you don't need to know **which** path. You only need to know **the farthest stone you can reach so far**. Walk the stones in order. If you're standing on a stone you can reach, it might let you reach farther, so update the farthest. If you ever arrive at a stone past the farthest reach, you're stuck.

Trace `[3, 2, 1, 0, 4]`:

| Stone | Jump | Can I stand here? (stone <= farthest) | Farthest after |
| --- | --- | --- | --- |
| 0 | 3 | yes, it's the start | 0 + 3 = 3 |
| 1 | 2 | yes, 1 <= 3 | max(3, 1 + 2) = 3 |
| 2 | 1 | yes, 2 <= 3 | max(3, 2 + 1) = 3 |
| 3 | 0 | yes, 3 <= 3 | max(3, 3 + 0) = 3 |
| 4 | 4 | no, 4 > 3 | stuck: false |

Every path ends on the 0 at stone 3. You didn't have to try a single path to know.

Why is this safe? If you can reach stone 5, you can reach every stone before it, because the jumps are "up to" a number, so you can always jump shorter. The farthest reach is the only thing that matters.

```order
title: The greedy walk, one stone at a time
---
Check whether this stone is past the farthest reach, and if so, stop with false
Work out how far you could get from this stone
If that's farther than the farthest reach, update it
Move on to the next stone
After the last stone, give back true
```

### Slow and fast

- Trying every path: exponential in the worst case.
- Marking every stone you could land on, from every stone you can stand on: O(n²) when the jumps are long.
- The greedy walk: each stone once, O(n) time and O(1) memory.

## Open the problem

Use the `problems` folder you downloaded with the first set of interview problems. **Don't download it again.** That would replace your finished answers with empty files. If you have no `problems` folder at all, run `curl -sL https://ai.parsity.io/labs/problems.tar.gz | tar xz` once from the top of `parsity-labs`.

```bash
cd problems/greedy
node --test
```

Write it by hand, in any language you like while you practice. The version you hand in is JavaScript. Use the seven steps: say it back, ask about the edges, work an example by hand, say the slow answer and its Big O, make it faster, write the code, test it out loud. For greedy, add one more thing to step five: try to break your idea before you code it.

**Try it yourself first.** You've seen the trace, so the work is in the details and the edges. Give it 30 minutes of real effort before you open a hint. Then one hint at a time, with 15 more minutes between them.

## Problem: Can you reach the last stone?

Open `reach-the-end.js`. Write `canReachEnd(jumps)`: true if you can get from the first stone to the last.

Step two: one stone? (You're already there.) A first stone of 0? Zeros you can jump over, as in `[2, 0, 0]`? A row of 100,000 stones where every jump is huge?

<details>
<summary>Hint 1: one number to track</summary>

Keep `farthest`, starting at 0. For each stone `i` in order, the farthest you could get from it is `i + jumps[i]`.

</details>

<details>
<summary>Hint 2: when are you stuck?</summary>

Before you use stone `i`, check that you could have got there: `i` must be no more than `farthest`. If it's more, give back false right away.

</details>

<details>
<summary>Hint 3: the edges</summary>

Trace `[0]`: you start on the last stone, so the answer is true. Trace `[0, 1]`: stone 1 is past `farthest`, so false. Check your loop handles both without a special case.

</details>

## Hand it in

When all three tests pass, commit and push.

```submit
assignment: dsa-greedy
```

Paste the link to your `parsity-labs` repository. We check the `problems/greedy` folder, including zeros you can and can't get past, a single stone, and 100,000 stones with long jumps.

## Stretch: the best run of numbers

Not graded. Do it by hand first. Given a list of numbers, some negative, find the biggest total of any run of numbers next to each other. `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` gives 6, from `[4, -1, 2, 1]`.

A greedy idea: walk once, keeping a running total. If the running total ever drops below zero, it can only drag down whatever comes next, so throw it away and start fresh from the next number. Try to break that idea with small inputs. Then ask: what if every number is negative?

```quiz
[
  {
    "q": "Coins are 1, 3 and 4. Taking the biggest coin that fits, how many coins does it take to make 6, and what's the fewest possible?",
    "options": ["Greedy takes 3 (4, 1, 1). The fewest is 2 (3, 3).", "Both are 2", "Greedy takes 2, the fewest is 3", "Both are 3"],
    "answer": 0,
    "explain": "Taking the 4 looked best and left 2, which needs two 1s. This one counterexample proves greedy doesn't work for these coins."
  },
  {
    "q": "In the stones problem, why is it enough to track only the farthest reach?",
    "options": ["Jumps are \"up to\" a distance, so if you can reach a stone you can reach every stone before it", "Because the stones are sorted", "Because the last stone is always reachable", "It isn't enough, you need every path"],
    "answer": 0,
    "explain": "Reaching far never stops you landing somewhere nearer. So all you need to know is how far is possible."
  },
  {
    "q": "You have a greedy idea for a problem. What should you do before you code it?",
    "options": ["Look for a counterexample with small inputs, and try to explain why the greedy choice never hurts", "Code it, since greedy is always fast", "Switch to backtracking to be safe", "Ask the interviewer whether greedy is allowed"],
    "answer": 0,
    "explain": "Greedy is often wrong, and it's wrong confidently. Trying to break it first is the habit interviewers look for."
  }
]
```

## Key takeaways

- A greedy algorithm takes the best-looking move at each step and never goes back.
- It's short and fast when it works, and wrong with no warning when it doesn't.
- Before you trust one, look for a counterexample, and try to say why the greedy choice can never hurt.
- For the stones problem, the farthest reach is all you need: O(n) time and O(1) memory.
- When a counterexample breaks greedy, the problem usually wants dynamic programming or backtracking.

## Work with AI

```ai-prompt
title: Help me break greedy ideas
---
I'm a beginner learning greedy algorithms. Give me four small optimization problems,
one at a time, each with a tempting greedy idea, such as picking the most valuable
item first, taking the shortest task first, or always taking the biggest coin. For
each, tell me the greedy idea and ask me whether it's always right. If I say yes, ask
me to explain why. If I say no, ask me for a counterexample with small numbers. At
least one of the four should be one where greedy really is right. Don't give me the
answers before I try.
```
