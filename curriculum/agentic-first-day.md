# Your First Day: Get It Running When the Docs Disagree

> **In this lesson:** your onboarding ticket. Get the rate engine running locally. Four documents tell you how, and they don't agree. You'll use your agent to work out which one is right, and learn the habit that makes agents useful in old codebases: when text and code disagree, the code wins.

## The ticket

Open [`docs/exercises/onboarding-get-rate-engine-running.md`](https://github.com/projectshft/driftwood-ops/blob/main/docs/exercises/onboarding-get-rate-engine-running.md). Priya gives this to every new engineer.

The short version: get the Rust rate engine to start, answer a request without crashing, and be able to explain where the real carrier API key lives and why more than one document claims to know.

You may never have written Rust. Good. You don't need to write any today. You need to get a service you don't understand to run, which is a very normal Tuesday.

## Why this is a good first agent task

Agents are great at this kind of work:

- Reading four documents and a few source files faster than you can open them.
- Installing a toolchain and reading a wall of compiler output.
- Telling you what an error means in a language you don't know.

They're also quietly bad at one part of it: when documents conflict, an agent tends to pick one and present it as fact. It often picks the one it read first, or the one that sounds most official. It rarely says "these disagree" unless you ask.

So the skill here is in how you ask.

## Text is a claim. Code is evidence.

Every codebase older than a year has documents that used to be true. A README from before a rewrite. A runbook written during an incident. A design page whose author left.

When you work alone, you learn to squint at these. An agent doesn't squint. It reads `the key is in X` and plans around X.

Three questions fix most of this:

1. **"What does the code actually read?"** Config comes from somewhere specific. Find the line that reads the environment variable, opens the file, or panics when it's missing.
2. **"Which document is newest, and does any document call another one outdated?"** People leave warnings. Look for them.
3. **"What can't you verify from here?"** Some answers live in systems you can't reach. An honest "I can't confirm that" is worth more than a confident guess.

```order
title: Resolving a conflict between docs
---
List every place that claims to answer the question
Find the line of code that actually uses the value
Check which documents are marked stale, and by whom
Decide what's true, and write down what you couldn't verify
Fix or flag the documents that were wrong
```

## Lab: the onboarding ticket

1. Give your agent the ticket file and ask it to read every document the ticket points to before doing anything. Have it make a table: document, what it says about the carrier key, when it was written or last edited, and whether another document contradicts it.
2. Ask what the rate engine does at startup and on a request if the key is missing. Make it show you the line. Then open that file yourself and read it. You can read Rust well enough for this.
3. Get the service running. `cargo run` in `services/rate-engine`. You don't have a real carrier key and you can't get one. Work out with your agent what the service needs in order to start and respond anyway, and whether that satisfies the ticket's definition of done. Read the ticket's wording carefully.
4. Send it a request:

```bash
curl -X POST localhost:8080/rates \
  -H 'content-type: application/json' \
  -d '{"originWarehouseCode":"PDX1","destZip":"97201","weightOz":24}'
```

5. Write your answer to the ticket's last bullet in your own words: where does the real key live, and why do several documents seem to answer that question?
6. One of the documents the ticket lists doesn't exist anywhere you can reach. Did your agent tell you that, or did it describe the document anyway?

Notice how long the request takes to come back, and ask your agent why. The answer is in the code, and the team already knows about it.

Don't fix the stale docs yet. Make a list. You'll come back to it.

```quiz
[
  {
    "q": "Two documents disagree about where a secret is stored. What's the strongest evidence for which is right?",
    "options": ["A later note in one of them saying the other is outdated, plus what the code reads", "Whichever document is longer", "Whichever the agent mentioned first", "The one at the repo root"],
    "answer": 0,
    "explain": "Look for people correcting each other in writing, and check what the code actually uses. Length and position tell you nothing."
  },
  {
    "q": "Your agent confidently summarizes a Google Drive doc that the ticket mentions. You never gave it access to Google Drive. What happened?",
    "options": ["It guessed what the doc probably says and presented the guess as a summary", "It has access to every Google Drive", "The doc is cached in the repo", "Nothing is wrong"],
    "answer": 0,
    "explain": "Models fill gaps with plausible text. Ask what it could not read or verify, every time a task depends on documents."
  },
  {
    "q": "The service responds with an empty list of quotes. Is the ticket done?",
    "options": ["Check the ticket. It says an empty quotes array is fine and expected in local dev", "No, any empty result is a bug", "Yes, any 200 means done", "Only if the agent says so"],
    "answer": 0,
    "explain": "Done is defined by the ticket's acceptance criteria. Read them yourself. Agents regularly solve a slightly different problem than the one written down."
  }
]
```

## Key takeaways

- Agents believe documents. In an old codebase, a lot of documents are wrong.
- Ask what the code reads. Config and secrets always come from a specific line.
- Ask what the agent could not verify. Silence is not confirmation.
- "Done" comes from the ticket's acceptance criteria, which you read yourself.

## Work with AI

```ai-prompt
title: Settle a conflict between documents
---
Read docs/exercises/onboarding-get-rate-engine-running.md and every document it points
to. Several of them describe how the rate engine gets its carrier API key and they do
not agree. Build a table with one row per document: what it claims, who wrote it and
roughly when, and which other document contradicts it. Then find the lines of code in
services/rate-engine that read the key and tell me what happens when it's missing.
Finish with three lists: what you're confident is true, what is stale, and what you
could not verify from this machine. Do not summarize any document you could not open.
```
