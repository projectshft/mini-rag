# Day 40 — Capstone Polish & Documentation

**Time:** ~2 hrs · Polish

> **Today:** feature freeze. No new capabilities — you're making what exists presentable: a README that sells the project, error handling that holds up, and a codebase you'd be comfortable showing in an interview.

## The goal: a repo a stranger can run

Your capstone will be judged largely through its README and a fresh-clone experience. Assume the reviewer gives it ten minutes: clone, read, run, ask two queries. Make those ten minutes smooth.

- [ ] **Write the README** — required sections: what the project does, tech stack **and why you chose it**, how to run it, your chunking strategy, and example queries with expected behavior
- [ ] **Fresh-clone test**: clone your own repo into a new folder and follow only the README. Every missing env var, undocumented step, or hardcoded path you hit, a reviewer hits too
- [ ] **Add a `.env.example`** with every required variable (names only, no secrets — and double-check no real keys are committed anywhere in history)
- [ ] **Error handling pass**: wrap the external calls (LLM, vector DB, data fetching) so failures produce a clear message, not a raw stack trace
- [ ] **Cleanup pass**: delete dead code and commented-out experiments, name things honestly, remove `console.log` debugging noise
- [ ] **Run all your saved test queries one last time** — polish has broken more demos than bugs have

<details>
<summary>💡 The README formula (steal this structure)</summary>

1. **One-paragraph pitch** — the problem, and the 10x question it answers
2. **Demo section** — 2–3 example queries with real (trimmed) responses, right at the top; reviewers decide here whether to keep reading
3. **Architecture** — a small diagram or 5-line pipeline description: source → chunking → embeddings → store → retrieval → generation
4. **Tech choices, each with a "why"** — one sentence per choice beats a paragraph of hedging
5. **Chunking strategy** — size, overlap, structure-awareness, and *why for this data*
6. **Setup** — prerequisites, env vars, install, ingest, run. Numbered, copy-pasteable
7. **The unique feature** — name it explicitly; don't make the reviewer discover it

</details>

<details>
<summary>💡 Short on time? Polish in this order</summary>

README first — it's read by 100% of reviewers. Then the "no results" / API-failure error paths your demo might actually hit. Then code cleanup in the 2–3 files a reviewer will open (your agent/retrieval core), not the whole repo. Skip: refactoring working code for elegance, test coverage beyond your saved queries, CI.

</details>

## ✅ Key takeaways

- Feature freeze is a discipline: from here on you're reducing risk, not adding scope
- The README is the highest-leverage file in the repo — it's your project's demo, pitch, and defense of technical choices in one place
- The fresh-clone test is the only honest measure of "how to run it" docs
- Error handling on external calls (LLM, vector DB) is what separates a demo that survives from one that face-plants live

## 🤖 Work with AI

```ai-prompt
title: Review my README like a hiring manager
---
Here is the README for my capstone RAG project: [paste the full README].

Review it as a hiring manager who screens engineering portfolios and gives each repo 3 minutes. Tell me: (1) after the first paragraph, could you say what it does and why it's useful — yes or no, and what's missing; (2) which technical choices lack a "why"; (3) whether you could run it from the setup section alone — list every assumed step; (4) the one section you'd cut and the one you'd expand. Then rewrite my opening paragraph to be sharper without overselling.
```

```ai-prompt
title: Audit my error handling before the demo
---
Here's the core retrieval/agent code from my capstone: [paste your main pipeline file(s)].

List every line where an external call can fail (LLM API, vector DB, network fetches, JSON parsing of model output) and what the user currently sees when it does. For each, propose the minimal fix: what to catch, what honest message to return, and whether to retry, fall back, or fail fast. Rank the fixes by "likelihood this fires during a live 5-minute demo" so I fix the risky ones first.
```
