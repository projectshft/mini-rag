# Is Your Test Suite Lying? Mutation Testing and Fresh Eyes

> **Today:** a passing test suite can still be a weak one. You'll break your own chunking code on purpose with mutation testing to find out what your tests actually catch, then learn the review rule I never break: the agent that wrote the code never reviews it.

## How do you know your tests are any good?

A suite that always passes might just be a suite that doesn't check much. Coverage won't tell you. A line can be "covered" by a test that never asserts anything about it.

Mutation testing finds out by breaking your code on purpose. A tool makes lots of small changes to your source, one at a time. Each broken copy is a **mutant**:

- `if (chunk.length >= maxSize)` becomes `if (chunk.length > maxSize)`
- `start + overlap` becomes `start - overlap`
- a whole line disappears

Then it runs your tests against each one.

- A test fails: the mutant was **killed**. Your tests caught the bug.
- Everything still passes: the mutant **survived**. You could ship that bug and nothing would tell you.

You get a **mutation score**, the percentage of mutants killed. For JavaScript and TypeScript, [StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/) is the go-to, and it has a [Jest runner](https://stryker-mutator.io/docs/stryker-js/jest-runner/), which is what your repo uses.

This is a perfect agent job. Tedious for a human, cheap for a model, and it produces hard evidence about tests the agent wrote.

```order
title: What happens in a mutation testing run
---
Run the existing tests to confirm they pass
Generate a small change to the source (a mutant)
Run the tests against the mutant
Mark it killed if a test fails, survived if all pass
Report the score and every survivor
```

## Lab: mutate your chunking code

Your repo already has a chunking test suite: [`chunking.test.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/chunking.test.ts) testing [`chunking.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/chunking.ts).

1. Run `yarn test:chunking` yourself. Confirm it passes.
2. Ask your agent to set up StrykerJS with the Jest runner, scoped to `app/libs/chunking.ts` only.
3. Run it. Write down the score.
4. Ask the agent to list the surviving mutants and explain, for three of them, what real bug would slip through.
5. Read those three yourself. Do you agree it matters? Off-by-one in overlap math matters a lot for retrieval quality. A mutated log message doesn't.
6. Have it add tests that kill the survivors that matter. Run Stryker again. Write down the new score.

```quiz
[
  {
    "q": "A mutant changes `>=` to `>` in your chunk size check and survives. What does that mean?",
    "options": ["No test checks a chunk that's exactly the max size", "Your chunking code is wrong", "Stryker has a bug", "You need more code coverage"],
    "answer": 0,
    "explain": "A survivor means your tests can't tell the difference. The boundary case, exactly maxSize, isn't tested. Coverage can be 100% and still miss it."
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

Context also leaks between tasks. Spend an hour debugging retrieval, then build a settings page in the same session, and some of that retrieval baggage sneaks into its decisions. New task, new session. It costs nothing.

## Key takeaways

- Passing tests and good tests aren't the same thing. Mutation testing measures the difference.
- Kill the survivors that represent real bugs. Don't chase 100%.
- The session that wrote the code is the worst possible reviewer of that code.
- New task, new session. Context leaks.

## Work with AI

```ai-prompt
title: Run mutation testing on my chunking code
---
Set up StrykerJS with the Jest runner in this repo, scoped only to
app/libs/chunking.ts and its test file app/libs/chunking.test.ts. Run it and show me
the full report. Then list every surviving mutant with: the exact change, the real-world
bug it represents for RAG retrieval, and whether you think it's worth a test. Don't
write any new tests until I pick which survivors matter.
```

```ai-prompt
title: Fresh-eyes review of the new tests
---
You did not write this code. Here is a diff that adds tests to kill surviving mutants
in a chunking module. Review it as a skeptical senior engineer. Flag any test that
kills a mutant without protecting real behavior, any brittle assertion, and any
important boundary case still missing. Only list problems.
```
