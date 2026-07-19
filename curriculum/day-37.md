# Day 37 — Capstone Development I


> **Today:** get your core retrieval pipeline working end-to-end — real data in, real answer out — even if it's ugly. A thin working slice today beats a beautiful half-pipeline on Day 41.

## The goal: one honest query, answered

By the end of today you should be able to run **one real query against your real data and get a grounded answer back**. Not polished. Not handling edge cases. Just: data -> chunks -> embeddings -> vector DB -> retrieve -> generate.

Build in this order — each step is testable on its own:

- [ ] Get a **sample of your data** locally (10–50 documents is plenty for today — don't ingest everything yet)
- [ ] Write the **ingest + chunking** step and print a few chunks — eyeball them: would *you* be able to answer a question from one chunk alone?
- [ ] **Embed and upsert** the chunks into your vector DB (your `scrapeAndVectorizeContent`-style script from [Day 9](/learn/day-09) is a good template)
- [ ] Write a **retrieval function**: query in, top-k chunks out — log the scores
- [ ] Wire retrieval into **generation**: stuff the chunks into the prompt, get an answer
- [ ] Run **3 test queries** you know the answers to, and save them — they're your regression suite for the rest of the week

<details>
<summary>Stuck on scope? Cut these things first</summary>

In order, without guilt:

1. **The UI.** A script or a single API route is a fine demo. A terminal running queries is a fine demo.
2. **The full dataset.** Demo on 50 documents; mention in the README how you'd scale.
3. **Auth, deployment, streaming.** Nobody is grading these.
4. **Multiple data sources.** One source done well beats three done badly.

Do NOT cut: chunking quality, the retrieval -> generation wiring, or your test queries. That's the actual assignment.

</details>

<details>
<summary>Retrieval returns garbage? Debug in this order</summary>

1. **Look at the chunks, not the code.** 80% of bad retrieval is bad chunking — chunks that are too big (diluted meaning), too small (no context), or full of boilerplate.
2. **Check you're embedding query and documents with the same model.** Mismatched models = meaningless similarity scores.
3. **Print the top-k scores.** All hovering near the same value? Your chunks may be too homogeneous, or your query too vague.
4. Only then look at prompt construction.

</details>

## Key takeaways

- End-to-end first, quality second: a thin working pipeline gives you something to improve every remaining day
- Ingest a small sample today — full dataset ingestion is a scaling chore, not a design risk
- Your 3 saved test queries are the yardstick for every change you make this week

## Work with AI

```ai-prompt
title: Rubber-duck my pipeline architecture
---
I'm building my capstone RAG project today. Here's my plan: [data source, chunking approach, vector DB, LLM provider, and how retrieval feeds generation].

Rubber-duck it with me: walk through the pipeline step by step and, at each step, ask me exactly what the input and output look like (actual shapes/examples, not hand-waving). Flag any step where I couldn't give you a concrete example — that's the step I haven't actually designed. Finish with the single riskiest step I should build and test first today.
```

```ai-prompt
title: Design my chunking for this specific data
---
My capstone data source is: [describe it — format, typical document length, structure like headings/threads/records]. Here's one representative raw document: [paste it].

Propose a chunking strategy for exactly this data: chunk size, overlap, whether to split on structure (headings, messages, records) vs. fixed size, and what metadata to attach to each chunk for retrieval filtering. Then chunk my pasted sample with your strategy and show me the actual chunks so I can judge whether each one could answer a question standalone.
```
