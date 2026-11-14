# Trust the Code, Not the Claims

> **In this lesson:** the most important habit in the course, on a real outage bug. Searching for a customer with an apostrophe in their name takes the whole Driftwood API down. You'll reproduce it, have your agent fix it, and then refuse to believe it's fixed until you've seen proof.

## Two camps, both right

You'll hear two camps online. One says "don't look at the code, trust the agent." The other says "verify every line." Both are right, depending on the context they're working in. Nuanced opinions don't go viral, so here's mine.

**Trust it with the code.** Good models write clean, idiomatic code. On line-by-line quality, the model is very likely better than you. Probably better than me too. Stop nitpicking variable names.

**Distrust what it tells you.** The same model will say, with a straight face:

- "All tests pass." (It didn't run them. Or it ran a different command.)
- "This endpoint is secure." (Anyone can call it.)
- "I've handled the edge cases." (The ones it thought of.)
- "Here's the link to the docs." (That page has never existed.)

None of this is malicious. The model predicts what a helpful answer looks like, and "it works" looks very helpful.

There's a cost to getting this wrong. CodeRabbit's analysis of real pull requests found AI-authored PRs had about 1.4x more critical issues and 1.7x more major issues than human-written ones. AI gets you about 80% of the way. The last 20% (edge cases, security gaps, the conventions your team actually uses) is where you earn your paycheck.

```scenario
{
  "who": "Your manager",
  "setting": "Standup. You mention the agent fixed the customer search crash yesterday.",
  "ask": "Great, so it's tested and ready to ship?",
  "note": "Pick what you'd actually say.",
  "options": [
    { "text": "I reproduced the crash first, and the same request now returns results. There's a test that failed before the fix and passes after. I also tried quotes, percent signs and underscores myself. I want a second session to review the diff before we merge.", "verdict": "best", "feedback": "Specific evidence, plus a plan for independent review. Nobody has to take anyone's word for anything." },
    { "text": "Yep, the agent said all the tests pass.", "verdict": "weak", "feedback": "You're repeating a claim you didn't verify. This repo had one passing test before the fix. It didn't cover search at all." },
    { "text": "I haven't really looked yet, I'll check the code line by line this afternoon.", "verdict": "ok", "feedback": "Honest, but reading every line is the slow way to get confidence. Reproducing the bug, testing the weird inputs and getting a fresh review is faster and catches more." }
  ],
  "debrief": "Your job is turning the agent's claims into evidence someone else can see."
}
```

## What you own

- **Does it do what I actually want?** You know the product. It only knows your prompt.
- **Is it safe?** Injection, leaked keys, missing validation. The agent won't bring these up unless you do.
- **How far does the problem go?** One bad query is a symptom. Is the same pattern sitting in other routes?
- **What's in scope?** The ticket says small and contained. Agents love to fix the whole neighborhood.

## Make it prove it

No human writes 40 tests for a one-line fix. For an agent it's a few minutes and some tokens. Use that. We're not writing tests as ceremony. We write them so we can move faster and refactor without freaking out.

The order matters:

```order
title: Fixing a bug so you can prove it's fixed
---
Reproduce the bug yourself and watch it fail
Have the agent write a test that fails for the same reason
Have the agent make the fix
Run the test and the original reproduction yourself
Try the inputs nobody mentioned
Get a review from a session that didn't write the fix
```

A test written after the fix proves the code does what the code does. A test that failed first proves the bug existed and is now gone.

## Lab: the apostrophe bug

Open [`docs/exercises/bug-customer-search-apostrophe.md`](https://github.com/projectshft/driftwood-ops/blob/main/docs/exercises/bug-customer-search-apostrophe.md). Dana reported "search just spins." Tom looked closer and it's worse than that.

1. **Reproduce it first, by hand.** With the API running:

```bash
cd apps/api
TOKEN=$(npm run -s token)
curl -H "Authorization: Bearer $TOKEN" "localhost:4000/customers/search?q=bright"
curl -H "Authorization: Bearer $TOKEN" "localhost:4000/customers/search?q=O'Brien"
curl localhost:4000/health
```

Look at the terminal where the API was running. What happened to the process, and to every other user of it?

2. Before any fix, ask your agent to explain the cause and to write a test that reproduces it. There's no test setup for routes in this repo, so it will have to build one. Read what it proposes before you let it.
3. Run that test yourself. It should fail. If it passes, the test isn't testing the bug.
4. Now ask for the fix. Then read the diff. Every file. Did it touch anything the ticket didn't ask for?
5. Run the test again, and rerun your three `curl` commands. Then try the inputs in the ticket's definition of done: quotes, `%`, `_`. Does a search for `%` return every customer? Should it? That's your call, not the agent's.
6. The crash had two causes: the bad query, and the fact that one bad query could kill the process. Which did your agent fix? Does the ticket ask for both?
7. The ticket asks for a line about whether other routes have the same pattern. Ask your agent, then check its answer with a search of your own.

```quiz
[
  {
    "q": "The agent writes a test after making the fix, and it passes. What do you know?",
    "options": ["Only that the test passes now. You never saw it fail, so you don't know it detects the bug", "The bug is fixed", "The test is thorough", "Nothing is fixed"],
    "answer": 0,
    "explain": "A test proves something only if it can fail. Watch it fail on the broken code first, or revert the fix and run it again."
  },
  {
    "q": "The ticket says the fix should be small and contained. The agent's diff also rewrites three other routes it thinks are risky. What do you do?",
    "options": ["Keep the fix for this ticket, and list the other routes as a follow-up like the ticket asks", "Merge it all, more fixes are better", "Reject the whole change", "Ask the agent to add even more"],
    "answer": 0,
    "explain": "Scope is yours. A small reviewed fix ships today. A sprawling one sits in review, and the ticket already says how to handle the rest."
  },
  {
    "q": "Why did one bad search take down the API for everyone?",
    "options": ["The database error was never caught, and an unhandled rejection ends the Node process", "Postgres shut itself down", "The rate engine crashed", "The portal overloaded the API"],
    "answer": 0,
    "explain": "The injection-shaped query caused the error. The missing error handling turned one failed request into an outage. Those are two different problems."
  }
]
```

## Key takeaways

- Trust the agent's code. Treat its claims about the code as hypotheses.
- Reproduce first. A test that never failed proves nothing.
- Read the diff for scope. The agent will happily fix things nobody asked about.
- Your job is turning claims into evidence: a failing test that now passes, real output, the inputs nobody mentioned.

## Work with AI

```ai-prompt
title: Fix the search crash, proof first
---
Read docs/exercises/bug-customer-search-apostrophe.md. Do not change any application
code yet. First explain the root cause, citing file and line, and say separately why
the request fails and why the whole process dies. Then set up the minimum needed to
test Express routes in apps/api and write a test that reproduces the failure. Run it
and paste the real output showing it fail. Stop there and wait for me. When I say go,
make the smallest fix that satisfies the ticket's definition of done, rerun the test,
paste the output, and list every input you did NOT test.
```
