# Day 38 — Capstone Development II + Assignment 4


> **Today:** two things — push your capstone from "one query works" to "the real dataset works," and ship Assignment 4: the SQL agent you started in [Day 33](/learn/day-33).

## Capstone: from sample to real

Yesterday you proved the pipeline on a small sample. Today, make it real:

- [ ] **Ingest your full dataset** (or as much as your rate limits and wallet allow) — batch your upserts, log progress, and make the script resumable so a failure at document 400 doesn't restart from zero
- [ ] **Re-run your 3 saved test queries** against the full index — did retrieval get better (more candidates) or worse (more noise)? If worse, your chunking or top-k needs tuning, not your prompt
- [ ] **Start your unique feature** — the "one thing not covered in the curriculum" from your proposal. Get its skeleton in place today so Days 39–40 are refinement, not invention

<details>
<summary>Ingestion taking forever or blowing up? </summary>

- **Batch embeddings** — most embedding APIs accept arrays; embedding one chunk per request is 10–50x slower.
- **Batch upserts** — Pinecone and friends take ~100 vectors per call comfortably.
- **Checkpoint** — write processed document IDs to a local file so re-runs skip completed work.
- **Sample it if desperate** — a demo over 30% of your corpus that works beats a full corpus that finished ingesting an hour before the deadline.

</details>

---

## Assignment

**Assignment 4: SQL Agent — due today.**

RAG doesn't require vectors. When your data is structured, an LLM that writes *queries* instead of reading *chunks* is often the better retrieval tool — that's the pattern from [Day 33](/learn/day-33), and now you'll finish it.

### What to build

Complete the `databaseSearchAgent`:

- Define the **Zod schema** the LLM's structured output must match
- Build the **Prisma WHERE clause** from the LLM's parsed query intent
- Implement the **full agent flow**: user question -> structured query plan -> database query -> results -> natural-language answer

### The code

This assignment lives in its own repo. Clone the `sql-agent` branch:

```bash
git clone -b sql-agent https://github.com/projectshft/killer_agents.git
```

**File to complete:** `app/agents/databaseSearchAgent.ts`

<details>
<summary>Hint — where to start in databaseSearchAgent.ts</summary>

Work backwards from the Prisma call. Decide what a valid `WHERE` clause needs (fields, operators, values), make your Zod schema capture exactly those decisions — nothing more — and let structured outputs force the LLM to fill it. If the LLM can express something your WHERE-builder can't handle, tighten the schema, don't loosen the builder.

</details>

### Video (3–4 minutes)

Feynman-style — explain it like you're teaching a teammate, not reading docs:

- The **SQL query types** your agent can express: filtering, aggregation, joins, full-text search
- What **pgvector** is and where it fits
- **When SQL beats a dedicated vector DB** — and when it doesn't

### Submit

- [Video Submission](https://form.typeform.com/to/QR9Vohg0)
- [Code Submission](https://form.typeform.com/to/FNEjXTwk)

Post your working agent in Slack for feedback — especially any query your schema *couldn't* express; those make great discussion.

```quiz
[
  {
    "q": "Why define a Zod schema for the SQL agent's output instead of letting the LLM write raw SQL?",
    "options": ["The schema constrains the LLM to queries your code can safely build and execute — no injection, no unsupported syntax", "Zod makes the LLM respond faster", "Prisma requires Zod schemas to connect to the database"],
    "answer": 0,
    "explain": "Structured outputs turn 'trust the LLM's SQL string' into 'validate a typed query plan, then build the query yourself' — the same graceful-degradation instinct from Day 18."
  },
  {
    "q": "Your data is 50k product rows with prices, categories, and stock counts, and users ask things like 'cheapest laptops in stock'. Best retrieval tool?",
    "options": ["Embed every row and do vector search", "A SQL agent — this is filtering and aggregation over structured fields, which vectors are bad at", "Fine-tune a model on the product table"],
    "answer": 1,
    "explain": "'Cheapest' and 'in stock' are exact predicates, not semantic similarity. SQL answers them precisely; vector search can only find rows that *sound* like the query."
  }
]
```

## Key takeaways

- Full-dataset ingestion is an engineering problem: batch, checkpoint, and make scripts resumable
- Re-running the same saved test queries after every change is how you know a change helped
- A SQL agent is RAG without vectors: structured output -> validated query plan -> precise database retrieval
- SQL wins when questions are predicates and aggregations; vectors win when questions are about meaning

## Work with AI

```ai-prompt
title: Generate adversarial questions for my SQL agent
---
I built a databaseSearchAgent (from the killer_agents sql-agent branch) that turns natural-language questions into a Zod-validated query plan, then a Prisma WHERE clause. My schema supports: [paste your Zod schema].

Generate 12 test questions in three tiers: (1) four my schema clearly supports, (2) four at the edge — ambiguous phrasing, implicit filters, superlatives like "most recent" or "top 5", and (3) four it CANNOT express, where the agent should degrade gracefully instead of guessing. For each, tell me the query plan you'd expect (or the refusal you'd expect). I'll run them and report back — then help me fix the worst failure.
```

```ai-prompt
title: Rehearse my SQL agent video
---
I'm recording a 3–4 minute Feynman-style video covering: SQL query types (filtering, aggregation, joins, full-text search), pgvector, and when SQL beats a dedicated vector database.

I'll explain each to you as if you're a backend dev who's never touched RAG. After each section, ask me one sharp follow-up ("why not just embed the rows?", "so when would you still want Pinecone?"). Flag jargon I didn't define. Then rate my explanation 1–10 and tell me the weakest section to redo before I record.
```
