# Is Your Test Suite Lying? Mutation Testing and Fresh Eyes

> **In this lesson:** a passing test suite can still be a weak one. Driftwood's money code has one passing test and one that's been skipped for months. You'll break that code on purpose with mutation testing to see what the tests actually catch, write tests for a script that has none, and learn the review rule I never break: the agent that wrote the code never reviews it.

## How do you know your tests are any good?

A suite that always passes might just be a suite that doesn't check much. Coverage won't tell you. A line can be "covered" by a test that never asserts anything about it.

Mutation testing finds out by breaking your code on purpose. A tool makes lots of small changes to your source, one at a time. Each broken copy is a **mutant**:

- `cents - cents * percent` becomes `cents + cents * percent`
- `available < 0` becomes `available <= 0`
- a whole function body disappears

Then it runs your tests against each one.

- A test fails: the mutant was **killed**. Your tests caught the bug.
- Everything still passes: the mutant **survived**. You could ship that bug and nothing would tell you.

You get a **mutation score**, the percentage of mutants killed. For JavaScript and TypeScript, [StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/) is the go-to, and it has a [Jest runner](https://stryker-mutator.io/docs/stryker-js/jest-runner/), which is what `apps/api` uses.

This is a perfect agent job. Tedious for a human, cheap for a model, and it produces hard evidence about tests, including the ones the agent wrote.

```order
title: What happens in a mutation testing run
---
Run the existing tests to confirm they pass
Generate a small change to the source (a mutant)
Run the tests against the mutant
Mark it killed if a test fails, survived if all pass
Report the score and every survivor
```

## Lab, part 1: mutate the money code

Every order total at Driftwood goes through [`apps/api/src/utils/money.ts`](https://github.com/projectshft/driftwood-ops/blob/main/apps/api/src/utils/money.ts). You spent the last lesson finding out how much one cent matters to a customer. Its tests are in `money.test.ts` next to it.

1. Run `npm test` in `apps/api` yourself. It passes. Read the output closely. How many tests ran, and how many were skipped?
2. Open `money.test.ts`. One test is skipped with a note calling it flaky. Is it flaky? Remove the `.skip`, run it a few times, and see. A test that fails the same way every time has a different name.
3. Ask your agent why that test fails. You now know enough about this code to check its answer. Decide what the right fix is: the test, the function, or both. Think about who you'd have to ask before changing how discounts round.
4. Ask your agent to set up StrykerJS with the Jest runner, scoped to `src/utils/money.ts`.
5. Run it. Write down the score.
6. Ask the agent to list the surviving and uncovered mutants and explain, for three of them, what real bug would slip through. Read those three yourself. A flipped sign in a discount charges the customer more instead of less. Does any test notice?
7. Have it add tests that kill the survivors that matter. Run Stryker again. Write down the new score.

## Lab, part 2: a script with no tests at all

Open [`docs/exercises/testing-reconciliation-script.md`](https://github.com/projectshft/driftwood-ops/blob/main/docs/exercises/testing-reconciliation-script.md). `scripts/reconcile_inventory.py` runs every night, is the only thing that catches inventory drift, and has zero tests.

1. Before any tests, ask your agent what the script actually does, and compare that to what the comment at the top of the file says it does. They don't match. Which one will you test?
2. The ticket leaves you a design choice: mock the database, or run against a throwaway Postgres. Ask the agent for the tradeoffs, then choose yourself and say why. You already have Postgres in Docker.
3. Have it write the tests the ticket lists. Pay attention to the boundary: exactly zero available stock.
4. Break `find_drift` by hand. Change `<` to `<=`. Run the tests. Does one fail? Put it back.
5. The ticket ends with "note anywhere the script's behavior surprised you." There's a constant in that file worth a note.

Part 2 is in Python. You may not write Python. You can still judge these tests, because you know what the script is supposed to catch.

```quiz
[
  {
    "q": "A mutant changes `available < 0` to `available <= 0` and survives. What does that mean?",
    "options": ["No test checks an item with exactly zero available stock", "The script is wrong", "The mutation tool has a bug", "You need more code coverage"],
    "answer": 0,
    "explain": "A survivor means your tests can't tell the difference. The boundary case isn't tested. Coverage can be 100% and still miss it."
  },
  {
    "q": "A test is marked as skipped because it's 'flaky'. It fails the same way on every run. What is it really?",
    "options": ["A failing test that found a real problem and got switched off", "Flaky", "A slow test", "A test for a deleted feature"],
    "answer": 0,
    "explain": "Flaky means it passes and fails without the code changing. This one fails every time. Skipping it hid the problem, and the test report stayed green."
  },
  {
    "q": "The agent adds a test that kills a mutant by asserting a log line's exact text. Good test?",
    "options": ["Usually no. It kills the mutant without protecting any behavior a user cares about", "Yes, a higher score is always better", "Yes, logs are the most important output", "Only if it runs fast"],
    "answer": 0,
    "explain": "Chasing the score produces brittle tests. Kill the mutants that represent real bugs, and accept some survivors that don't."
  }
]
```

## Fresh eyes: the author never reviews its own work

A session remembers everything: your instructions, the files it read, its mistakes and the reasons it gave. Great while it's building. Terrible when you ask it to review what it built. It'll review through the same reasoning that wrote the code, and surprise, it'll find the code is great. Humans do the same thing, which is why code review exists.

**The rule:** open a new session, a different tool or a different model. Give it only the diff and what the change was supposed to do.

```
Review this diff as a skeptical senior engineer. The goal of the change was:
[one sentence]. Look for bugs, security issues, missing tests and anything that
doesn't match the goal. Don't summarize what it does. Only list problems.
```

Take the findings back to the builder. Repeat until the reviewer has nothing worth fixing. And you still review too. AI-written code rarely knows your team's conventions. It has its own slightly different way of solving every problem, and it won't tell you.

Context also leaks between tasks. Spend an hour on the money code, then write the Python tests in the same session, and some of that baggage sneaks into its decisions. New task, new session. It costs nothing.

Try it now: take the diff from either part of this lab to a fresh session and run the review prompt.

## Key takeaways

- Passing tests and good tests aren't the same thing. Mutation testing measures the difference.
- A skipped test is a green checkmark hiding a red one. Find out why it was skipped.
- Kill the survivors that represent real bugs. Don't chase 100%.
- The session that wrote the code is the worst possible reviewer of that code. New task, new session.

## Work with AI

```ai-prompt
title: Run mutation testing on the money code
---
In apps/api, set up StrykerJS with the Jest runner, scoped only to src/utils/money.ts
and its test file. Run it and show me the full report. Then list every surviving or
uncovered mutant with: the exact change, the real-world billing bug it represents, and
whether you think it's worth a test. Don't write any new tests until I pick which ones
matter. Separately, tell me why the skipped test in money.test.ts fails, and do not
change money.ts to make it pass without asking me first.
```

```ai-prompt
title: Fresh-eyes review of the new tests
---
You did not write this code. Here is a diff that adds tests for an inventory
reconciliation script and for money helpers. Review it as a skeptical senior engineer.
Flag any test that passes without protecting real behavior, any brittle assertion, any
test that would still pass if the function were broken, and any important boundary
case still missing. Only list problems.
```
