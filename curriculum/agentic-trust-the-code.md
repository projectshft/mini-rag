# Trust the Code, Not the Claims

> **Today:** the most important habit in this track. You'll learn to trust the agent's code and distrust its claims about that code, then make it prove its work with screenshots and end-to-end tests against your own chat interface.

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
  "setting": "Standup. You mention the agent wrote the new upload endpoint yesterday.",
  "ask": "Great, so it's tested and ready to ship?",
  "note": "Pick what you'd actually say.",
  "options": [
    { "text": "The agent wrote tests and they pass on my machine. I also ran the upload with an empty file and a 50MB PDF myself. I want a second session to review the diff before we merge.", "verdict": "best", "feedback": "Specific evidence, plus a plan for independent review. Nobody has to take anyone's word for anything." },
    { "text": "Yep, the agent said all the tests pass.", "verdict": "weak", "feedback": "You're repeating a claim you didn't verify. The first bug report will be about the case it didn't think of." },
    { "text": "I haven't really looked yet, I'll check the code line by line this afternoon.", "verdict": "ok", "feedback": "Honest, but reading every line is the slow way to get confidence. Running it, testing the weird cases and getting a fresh review is faster and catches more." }
  ],
  "debrief": "Your job is turning the agent's claims into evidence someone else can see."
}
```

## What you own

- **Does it do what I actually want?** You know the product. It only knows your prompt.
- **Is it safe?** Prompt injection, leaked keys, missing validation. The agent won't bring these up unless you do.
- **Where does it run?** Deployment, env vars, cost.
- **Which patterns?** The ones you learned here, or the new thing you want to try. This is a great time to experiment.

## Make it prove it

No human writes 200 tests for a small feature. For an agent it's a few minutes and some tokens. Use that. We're not writing tests as ceremony. We write them so we can move faster and refactor without freaking out.

- **Run it.** Have it start the app and use the feature.
- **Screenshots.** Most agents can drive a browser. Ask for screenshots at desktop and phone width.
- **End-to-end tests.** A program opens a real browser, types into your chat, and checks what shows up. [Playwright](https://playwright.dev/docs/intro) is the common choice.
- **More tests than feels sane.** Empty input, huge input, the emoji in the question. Then ask which cases it skipped.

## Lab: end-to-end tests for your chat

1. Write down the three things a user does most in the starter app. Probably: ask a question the docs answer, ask one they don't, and check the sources listed under the answer.
2. Ask your agent to set up Playwright and write E2E tests for those three flows. Have it run them and paste the real output.
3. Ask for [screenshots](https://playwright.dev/docs/screenshots) of the chat at desktop and phone width. Look at every one.
4. Break something on purpose (rename the chat input's label, or make the API route return a 500). Run the tests again. Do they fail?
5. Undo your change.

LLM responses aren't deterministic, so tests that assert the exact answer text will flake. Ask the agent how it plans to handle that, and check its answer.

```quiz
[
  {
    "q": "Your Playwright test checks that the RAG answer equals an exact sentence. It passes, then fails, then passes. What's the better assertion?",
    "options": ["Assert on structure: an answer rendered, sources listed, no error state", "Retry the test until it passes", "Set temperature to 2 so it's consistently random", "Delete the test"],
    "answer": 0,
    "explain": "Model output varies. Assert on what must be true about the UI and the response shape. Retrying until green just hides real failures."
  },
  {
    "q": "You broke the chat route on purpose and your E2E tests still pass. What does that tell you?",
    "options": ["The tests aren't checking what you think they're checking", "The tests are robust", "Playwright is caching the old build", "Nothing, broken routes don't matter in E2E tests"],
    "answer": 0,
    "explain": "Tests that can't fail aren't tests. Next lesson you'll do this systematically with mutation testing."
  }
]
```

## Key takeaways

- Trust the agent's code. Treat its claims about the code as hypotheses.
- Your job is turning claims into evidence: test output, screenshots, a running app.
- E2E tests on an LLM app should assert structure and behavior, not exact wording.
- If you break the app and the tests still pass, the tests are the bug.

## Work with AI

```ai-prompt
title: Make the agent prove the chat works
---
In this Next.js docs Q&A app, set up Playwright and write end-to-end tests for: asking
a question the sample docs answer, asking one they don't, and checking that sources
render under the answer. Don't assert exact model wording; assert that an answer
renders, sources appear when they should, and no error state shows. Run
the tests and paste the full output. Then take screenshots of the chat at 1280px and
390px wide and show them to me. Finally, list every case you did NOT test.
```
