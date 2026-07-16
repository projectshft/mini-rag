# Day 41 — Capstone Demo Recording

**Time:** ~90 min · Record

> **Today:** record your capstone demo video. You're not just proving the thing works — you're practicing the skill this course has drilled all along: explaining a real AI system clearly to someone who didn't build it.

## The goal: a demo you'd send to a hiring manager

Plan for a tight 3–5 minute core (the final submission allows 5–7 — use the extra minutes only if they earn their keep). Structure it in four beats:

1. **The problem (~30s)** — the 10x question your project answers. One concrete before/after: "finding X used to take 10 minutes of grepping; watch it take 10 seconds"
2. **The architecture (~60s)** — walk the pipeline: data source → chunking → embeddings → vector store → retrieval → generation. Name your stack and give the one-sentence *why* for each major choice
3. **The live demo (~90–120s)** — 2–3 real queries: one easy win, one hard query that shows retrieval quality, and one out-of-domain query that shows graceful "I don't know" behavior. Show your unique feature here
4. **One hard tradeoff (~30–45s)** — the decision you sweated: chunk size vs. context quality, reranking cost vs. accuracy, SQL vs. vectors, build vs. framework. What you chose, what it cost you, and what you'd try next

Today's checklist:

- [ ] **Script the four beats** as bullet points (not sentences — you want to talk, not read)
- [ ] **Pre-run every demo query** minutes before recording; never type a query on camera you haven't tested today
- [ ] **Do one throwaway take** start to finish, watch it, then record the real one — take two is always dramatically better
- [ ] **Watch your final take once** at 1.5x: can a stranger follow the architecture? Is any dead air worth trimming?
- [ ] Keep the recording somewhere safe — you submit it tomorrow ([Day 42](/learn/day-42))

<details>
<summary>💡 Recording nerves? Lower the stakes</summary>

You are not producing a film. Screen recording + your voice is the format; a webcam bubble is optional. Stumbles are fine — restart the sentence and keep going, or just re-record that beat. If a query misbehaves on camera, narrating *why* ("scores came back low, so it declined to answer — that's the threshold doing its job") often demos better than a perfect run. Done and clear beats polished and unrecorded.

</details>

<details>
<summary>💡 Over 5 minutes? Cut in this order</summary>

Setup narration ("first I'll open my terminal…"), the second easy query, tool tours (nobody needs to see your Pinecone dashboard for 40 seconds), and any code walkthrough — point at architecture, don't scroll files. Never cut: the problem statement, the hard query, or the tradeoff. Those three carry the grade.

</details>

## ✅ Key takeaways

- Four beats: problem → architecture → live demo → one hard tradeoff — in that order, weighted toward the demo
- Demo queries are rehearsed, never improvised: one easy win, one hard retrieval, one graceful "I don't know"
- Discussing a tradeoff honestly signals more engineering maturity than pretending everything worked first try
- Record a throwaway take first; the real take is tomorrow-you's gift

## 🤖 Work with AI

```ai-prompt
title: Coach my demo script
---
Here's my bullet-point script for my capstone demo video (target: 3–5 min, structure: problem → architecture → live demo → one hard tradeoff): [paste your bullets, including the exact demo queries you plan to run].

Coach me like a demo-day mentor: (1) estimate the runtime of each beat and flag where I'll blow the budget; (2) check my three demo queries — do I have an easy win, a hard retrieval showcase, and a graceful-failure moment? Suggest replacements if not; (3) sharpen my problem statement into one sentence a non-engineer would understand; (4) poke at my chosen tradeoff — ask me the two follow-up questions a skeptical viewer would, so I can address them preemptively in the video.
```

```ai-prompt
title: Find my hardest tradeoff
---
I need to close my capstone demo with one hard engineering tradeoff, and I'm not sure which to pick. Here are the decisions I made: [list 3–5, e.g. "chunked by section headers instead of fixed size", "skipped reranking", "chose pgvector over Pinecone", "capped top-k at 3"].

Interview me about each one: what the alternative was, what it would have cost, and what I actually observed. Then tell me which decision makes the most compelling tradeoff story — one with real tension, a measurable consequence, and a "what I'd try next" — and draft the 45-second version of how I should tell it.
```
