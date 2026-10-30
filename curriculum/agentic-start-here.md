# Start Here: Building With Agents

> **Today:** you stop typing most of the code. You'll pick a coding agent, point it at a small starter app, and have it ship a real feature. Then you'll check its work like a skeptical senior engineer, because that's the job now.

## Why there are (almost) no videos in this track

On purpose.

Watching someone else work with an agent is like watching someone else go to the gym. The skill is in the back and forth: what you ask for, what you catch, when you push back. You only get that by doing it.

Also, these tools change so fast that a screen recording from six months ago shows buttons that don't exist anymore. Text is easier to keep honest.

## What hasn't changed in two years

I've been building with coding agents pretty much every day for the last two years. The tools have changed a ridiculous amount. These habits haven't:

1. **Trust the model to write the code. Distrust what it tells you about the code.** Syntax and boilerplate are solved problems. "All tests pass" and "this is secure" are not.
2. **You drive the architecture.** Where it runs, which patterns and frameworks you use, what the product actually needs. That's yours.
3. **Make it prove its work.** Tests, screenshots, end-to-end runs. Tests are cheap for an agent, so ask for more than feels reasonable.
4. **The agent that wrote the code never reviews the code.** Fresh session, fresh eyes.
5. **Write things down only when you have to.** Correct it three times, then write a short note. Not before.

Coding was never the bottleneck. Good ideas were. They still are.

```quiz
[
  {
    "q": "Your agent says \"Done! All tests pass.\" What's the right next move?",
    "options": ["Run the tests yourself and read the actual output", "Merge it, the agent ran them", "Ask the same session if it's sure", "Delete the tests so they can't fail later"],
    "answer": 0,
    "explain": "Treat claims about the code as hypotheses. The evidence is the output, not the summary. Asking the same session to confirm just gets you the same confident answer."
  },
  {
    "q": "Which of these is still squarely your job when an agent writes most of the code?",
    "options": ["Deciding where it's deployed and how the data is shaped", "Remembering exact library syntax", "Formatting and naming variables", "Typing out boilerplate"],
    "answer": 0,
    "explain": "Syntax, naming and boilerplate are what models are great at. Architecture, deployment and what the product actually needs come from you."
  }
]
```

## Pick a tool

A coding agent is a language model with tools. It reads your files, runs commands, edits code and checks its own output. It's not that deep.

- **Terminal agents:** [Claude Code](https://code.claude.com/docs/en/overview) or [Codex CLI](https://developers.openai.com/codex/cli).
- **Editor agents:** [Cursor](https://cursor.com/docs).
- **Cloud agents:** most of the above also run in the cloud and come back with a pull request.

Use whichever one you'll actually use. There's not as much difference between the models as YouTubers want you to believe. Give one a few days before switching. Tool hopping is a great way to feel productive without shipping anything.

## Stop typing the code

Once it's set up, stop writing the code yourself. Keep your brain switched on: you describe what you want, the agent writes it, and you read it, run it and question it. Fixing a typo by hand is fine. Writing a whole function by hand? Ask yourself why.

## The starter app

Every lab in this track runs against a small Next.js app called Docs Q&A: a few markdown docs, a chunker, a simple retriever, and one route that asks a model to answer questions about the docs.

```bash
git clone -b agentic-engineering-starter https://github.com/projectshft/mini-rag.git agentic-starter
cd agentic-starter
npm install
cp .env.example .env.local
```

Put the API key and base URL from your course page into `.env.local`, then `npm run dev`. [Browse the code on GitHub](https://github.com/projectshft/mini-rag/tree/agentic-engineering-starter).

If you're in the full RAG program, you can run every lab against your own RAG app instead. You know that codebase even better.

## First reps

Start your agent in the starter folder.

1. Ask it to explain how the project is structured. Then open the files it names and check. Where is it wrong, or suspiciously vague?
2. Ask it to add a real feature. Something like:

```
/api/ask already rejects empty questions. Also reject whitespace-only questions and
anything over 500 characters with a 400 and a clear error message, and show that
message in the UI. Add tests for the validation.
```

3. Before you believe it's done:
   - **Run it.** Send a question that's just spaces, a normal one, and a 600-character one.
   - **Read the diff.** Every file. Did it touch anything you didn't ask for?
   - **Run the tests yourself** with `npm test`. Do they cover exactly 500 characters, or just the obvious cases?
   - **Ask it to explain one part you don't get.** Then read the code and see if the explanation holds up.

If setup fights you for more than 20 minutes, paste the exact error into your agent and ask it what's wrong. That's the job now too.

## Key takeaways

- The model is better at syntax than you. You're better at knowing what should exist and why.
- "Done" from an agent is a claim. The test output, the diff and the running app are the evidence.
- A small app you can read end to end is the perfect place to practice judging an agent's work.
- Pick a tool, stick with it for a few days, and stop typing the code.

## Work with AI

```ai-prompt
title: Interrogate the feature your agent just built
---
I just had a coding agent add input validation to the /api/ask route in a small
Next.js docs Q&A app. Act as a skeptical senior engineer reviewing this change. Ask me
5 pointed questions, one at a time, about how I verified it: boundary lengths,
whitespace-only questions, what the UI shows on a 400, whether the tests cover failure
paths, and whether anything outside the feature changed. Wait for my
answer each time and tell me what I should go check.
```
