# Start Here: What This Course Is

> **In this lesson:** what you'll be able to do by the end of the course, how it's laid out, what you need installed, and the five habits everything else hangs on. No code yet. That starts in the next lesson.

## What this course is

You're about to join a company. It's made up, but the codebase is real enough to hurt.

Driftwood Logistics stores and ships products for online brands. Its engineering team left you a backend API, a customer portal, a pricing service written in Rust by a contractor who's gone, a Python script that runs off a box under someone's desk, and docs that disagree with each other. There's a backlog of tickets from support, product and infra.

You'll work that backlog with a coding agent. Every lesson is one ticket, and every ticket teaches one habit.

I picked a messy, multi-language codebase on purpose. Agents look like magic on a to-do app. The job is using them on code you didn't write, in a language you may not know, with context scattered across five documents. If you can direct an agent there, you can do it anywhere.

## What you'll be able to do

By the end you'll have done all of this yourself, on Driftwood:

- Get an unfamiliar system running when the setup docs contradict each other.
- Fix a production bug and prove the fix, instead of taking the agent's word for it.
- Run an investigation where nobody knows if there's a bug at all, and write up what you found.
- Find out whether a test suite is any good by breaking the code on purpose.
- Ship a feature that crosses a database, an API and a front end, from a spec you wrote.
- Clean up the instructions an agent reads, and write your first skill.
- Run more than one agent at a time without making a mess.
- Build a software factory: agents that turn a chat message into a reviewed pull request.

## How the course is laid out

Four parts, ten lessons. Go at your own pace. Do them in order, because each ticket assumes you know the codebase a little better than the last one did.

| Part | What you do |
| --- | --- |
| 1. Get oriented | Meet the codebase, get it running, do your onboarding ticket |
| 2. Trust and verify | A bug fix, an investigation, and a test suite that might be lying |
| 3. Build | A feature across two apps, agent instructions and skills, parallel agents |
| 4. Capstone | Your own software factory |

Each lesson has a short read, a lab on a real ticket, a couple of questions to check yourself, and a prompt you can paste into your agent.

There are almost no videos, on purpose. Watching someone else work with an agent is like watching someone else go to the gym. The skill is in the back and forth: what you ask for, what you catch, when you push back. You only get that by doing it. Also, these tools change so fast that a screen recording from six months ago shows buttons that don't exist anymore. Text is easier to keep honest.

## What you need

- **A coding agent.** [Claude Code](https://code.claude.com/docs/en/overview), [Codex CLI](https://developers.openai.com/codex/cli) or [Cursor](https://cursor.com/docs). Use whichever one you'll actually use. There's not as much difference between the models as YouTubers want you to believe. Give one a few days before switching. Tool hopping is a great way to feel productive without shipping anything.
- **Git, Node 20 or newer, and Docker** (or your own Postgres).
- **Rust and Python**, but only for the tickets that touch those parts. You don't need to know either language. That's part of the point.

You don't need to be a JavaScript developer. The course is language agnostic. Driftwood has TypeScript, Rust, Python and SQL in it because real companies do.

Your course page also shows an API key with $5 of credit. Driftwood doesn't need it. Save it for the capstone, where your factory calls a model to sort incoming requests.

## What hasn't changed in two years

I've been building with coding agents pretty much every day for the last two years. The tools have changed a ridiculous amount. These habits haven't, and each one gets its own lesson:

1. **Trust the model to write the code. Distrust what it tells you about the code.** Syntax and boilerplate are solved problems. "All tests pass" and "this is secure" are not.
2. **You drive the architecture.** Where it runs, which patterns you use, what the product actually needs. That's yours.
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
  },
  {
    "q": "Why does this course use a messy codebase in three languages instead of a small clean app?",
    "options": ["Agents are easy on small clean apps. The skill is directing them through code and context you didn't write", "To teach you Rust", "Because bigger codebases use more tokens", "So the labs take longer"],
    "answer": 0,
    "explain": "On a toy app almost any prompt works. Stale docs, unfamiliar languages and changes that cross services are where your judgment starts to matter."
  }
]
```

## Stop typing the code

One rule for the whole course: once your agent is set up, stop writing the code yourself. Keep your brain switched on. You describe what you want, the agent writes it, and you read it, run it and question it. Fixing a typo by hand is fine. Writing a whole function by hand? Ask yourself why.

## Key takeaways

- You're joining a made-up company with a real mess. Every lesson is one ticket from its backlog.
- The model is better at syntax than you. You're better at knowing what should exist and why.
- "Done" from an agent is a claim. The test output, the diff and the running app are the evidence.
- Pick a tool, stick with it, and stop typing the code.

## Work with AI

```ai-prompt
title: Check my setup before I start
---
I'm about to start a course where I work in an unfamiliar codebase with you as my
coding agent. Check that this machine is ready and report what you find. Don't install
anything yet. I need: Git, Node 20 or newer, Docker (or a local Postgres 15+), and
optionally Rust (cargo) and Python 3. For each one, run the version command, show me
the real output, and tell me plainly whether it's present, missing or too old. Then
list the exact install steps for anything missing on my operating system and wait for
me to say go.
```
