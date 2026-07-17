# Day 42 — Capstone Submission


> **Today:** ship it. Final checks, submit your capstone video and code, and close out 42 days of building. This is also your buffer day — if anything slipped, today's slack absorbs it.

## Pre-flight checks

Before you submit, run through the bar you scoped against on [Day 36](/learn/day-36):

- [ ] **Working RAG system** — retrieves relevant context and generates grounded responses
- [ ] **Chunking strategy** appropriate to your data, and explained in the README
- [ ] **Vector embeddings** stored in a vector database (or documented SQL/hybrid retrieval, with reasoning)
- [ ] **Working demo with example queries** — your saved test queries all pass right now, on a fresh run
- [ ] **One unique feature** not covered in the curriculum, named explicitly in the README
- [ ] **README** covers: what it does, tech stack and why, how to run it, chunking strategy, example queries with expected behavior
- [ ] **Repo is clean**: no committed secrets, `.env.example` present, fresh clone runs from README alone
- [ ] **Demo video** from [Day 41](/learn/day-41) is exported and watchable

If you extended the class project, double-check the Option A additions: new data source, new vector index, new agent, and routing updated so the selector reaches it.

```quiz
[
  {
    "q": "Your demo video is great but your README doesn't explain the chunking strategy. Submit as-is?",
    "options": ["Yes — the video shows chunking works, that's enough", "No — the README chunking explanation is an explicit requirement, and writing it takes 15 minutes", "No — delay submission a week to rewrite all docs"],
    "answer": 1,
    "explain": "Evaluation explicitly includes 'correct use of embeddings and chunking' and 'thoughtful documentation of technical choices'. It's a 15-minute fix on buffer day — make it."
  },
  {
    "q": "What's the guiding principle for how the capstone is judged?",
    "options": ["Build something that works. Explain your choices. Show us what you learned.", "Use the most advanced techniques from the course — reranking, hybrid search, and agents are all required", "Ship the largest dataset you can afford to embed"],
    "answer": 0,
    "explain": "A working system, justified decisions, and evidence of learning. Not maximal complexity — several requirements are about *explaining*, not building."
  }
]
```

## Assignment

**Assignment 5: Capstone — final submission.**

### What you're submitting

Your complete RAG application for the domain you chose — either **Option A** (the class project extended with a new data source and agent) or **Option B** (your own system from scratch) — plus the demo video and your GitHub repository.

### Video (5–7 minutes)

Your [Day 41](/learn/day-41) recording should demonstrate:

1. **Demo** — your RAG system in action with real queries
2. **Data** — your data source and how you collected/processed it
3. **Retrieval** — example queries demonstrating retrieval quality
4. **Technical choices** — brief explanation of your decisions
5. **Challenges** — any challenges you faced and how you solved them
6. **Unique feature** — show off the thing that makes your project different

Feynman-style, as always: explain it like you're teaching a smart colleague who hasn't taken this course. If watching your take exposed a gap, that's the technique working — patch the gap, re-record the beat, then submit.

### Submit final project

- [Final Video Submission](https://form.typeform.com/to/SF6b6edL)
- [Code Submission](https://form.typeform.com/to/TXjlfrlr) (GitHub repo link)

Then **post your project in Slack** — repo link, one screenshot or query example, and the problem it solves. Your classmates' capstones are worth studying too: every one is a different answer to "how do I make retrieval work for *this* data?"

> **Build something that works. Explain your choices. Show us what you learned.**

## You built the whole thing

Six weeks ago, RAG was an acronym. Since then you've built vector similarity from raw math ([Day 3](/learn/day-03)), a chunking and ingestion pipeline ([Day 8](/learn/day-08)–[Day 10](/learn/day-10)), a multi-agent router with structured outputs and graceful degradation ([Day 17](/learn/day-17)–[Day 19](/learn/day-19)), a RAG agent with reranking and hybrid search ([Day 22](/learn/day-22)–[Day 24](/learn/day-24)), agent tests and an LLM judge ([Day 29](/learn/day-29)–[Day 30](/learn/day-30)), a SQL agent that does retrieval without vectors ([Day 33](/learn/day-33)), and a security mindset for all of it ([Day 34](/learn/day-34)). The capstone proves you can do it without training wheels — keep it running, keep using it, and let it be the project you talk about in your next technical interview.

## Key takeaways

- The capstone bar: working pipeline, real chunking strategy, demo queries, one unique feature, and documentation that defends every choice
- Buffer day exists to be spent — fix the small gaps (README sections, a flaky query) before submitting, not after
- The graded skill all course long was the same one: build it, then explain it simply — that's what makes you the AI person on your team
- Your capstone is a living portfolio piece: keep the repo public, keep the demo link handy

## Work with AI

```ai-prompt
title: Grade my capstone before the graders do
---
Act as this course's capstone evaluator. The criteria: correct use of embeddings and chunking; working retrieval and generation pipeline; clean, readable code; clear explanation of design decisions; working demo with example queries; thoughtful documentation of technical choices; one unique feature showing creativity.

Here's my README: [paste it]. Here's my demo video outline and the queries I show: [paste]. Grade each criterion pass / borderline / fail with one sentence of evidence from what I gave you. For every borderline or fail, tell me the smallest concrete fix I can make in under 30 minutes, today, before I submit.
```

```ai-prompt
title: Turn my capstone into interview answers
---
I just finished a 6-week RAG course and my capstone is: [one-paragraph description — problem, stack, unique feature, hardest tradeoff].

Help me turn it into interview material. Draft answers (in my voice, first person, 60–90 seconds spoken each) for: (1) "Tell me about a recent project" — problem-first, not tech-first; (2) "What was the hardest technical decision?" — using my tradeoff; (3) "How would you scale it to 100x the data?"; (4) "What would you do differently?". Then ask me the follow-up a sharp interviewer would push on after answer 2, and critique my reply.
```
