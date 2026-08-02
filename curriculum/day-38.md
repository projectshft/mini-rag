# Day 38 — Capstone Development II


> **Today:** push your capstone from "one query works" to "the real dataset works" — the messy middle, where sample data stops flattering you.

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

```quiz
[
  {
    "q": "Your 3 saved test queries all passed on 40 sample documents. After ingesting all 900, two return worse answers. Where do you look first?",
    "options": ["Move to a larger embedding model — a bigger corpus needs more dimensions to stay separable", "Read the chunks that actually came back: at 20x the corpus, boilerplate and near-duplicate chunks now outrank the ones that used to win", "Raise top-k so the good chunk is somewhere in the window and let the model sort it out"],
    "answer": 1,
    "explain": "Nothing about your pipeline changed except what it's competing against. Headers, footers and duplicated passages that were harmless in a 40-document index are now the most numerous thing in it. Print the top-k chunks for the failing queries before touching a parameter — the answer is usually visible in the text. Swapping models rewrites the whole index to fix a problem you haven't diagnosed; padding top-k just buries the good chunk in more noise."
  },
  {
    "q": "Your ingest script dies at document 400 of 900 on a rate limit. What's the fix that makes tomorrow better, not just today?",
    "options": ["Rerun with a longer timeout and bigger retry backoff", "Append each completed document id to a local file and skip those ids on rerun, so a failure never costs work you already paid to embed", "Cut the corpus to the 400 that made it in and call it a scoping decision"],
    "answer": 1,
    "explain": "You'll run this script again — after a chunking change, before the demo, on polish day. A checkpoint file turns every future failure into a resume instead of a restart, for about five lines. Retries alone still lose everything on the failure they don't survive."
  }
]
```

---

## Optional lab: finish the SQL agent

Not required, and not graded — but if the SQL agent caught your interest, this is a good week to finish it. It's self-contained and it makes a strong portfolio piece.

RAG doesn't require vectors. When your data is structured, an LLM that writes *queries* instead of reading *chunks* is often the better retrieval tool.

### What to build

Complete the `databaseSearchAgent`:

- Define the **Zod schema** the LLM's structured output must match
- Build the **Prisma WHERE clause** from the LLM's parsed query intent
- Implement the **full agent flow**: user question -> structured query plan -> database query -> results -> natural-language answer

### The code

The lab lives in its own repo. Clone the `sql-agent` branch:

```bash
git clone -b sql-agent https://github.com/projectshft/killer_agents.git
```

**File to complete:** `app/agents/databaseSearchAgent.ts`

<details>
<summary>Hint — where to start in databaseSearchAgent.ts</summary>

Work backwards from the Prisma call. Decide what a valid `WHERE` clause needs (fields, operators, values), make your Zod schema capture exactly those decisions — nothing more — and let structured outputs force the LLM to fill it. If the LLM can express something your WHERE-builder can't handle, tighten the schema, don't loosen the builder.

</details>

### If you finish it

There's nothing to submit — post it in Slack instead, especially any query your schema *couldn't* express. Those make great discussion.

```quiz
[
  {
    "q": "Why define a Zod schema for the SQL agent's output instead of letting the LLM write raw SQL?",
    "options": ["The schema constrains the LLM to queries your code can safely build and execute — no injection, no unsupported syntax", "Zod makes the LLM respond faster", "Prisma requires Zod schemas to connect to the database"],
    "answer": 0,
    "explain": "Structured outputs turn 'trust the LLM's SQL string' into 'validate a typed query plan, then build the query yourself' — the same graceful-degradation instinct as structured outputs."
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
title: Make my ingestion survive going 10x
---
I'm scaling my capstone ingestion from a sample to my full corpus (roughly [N] documents). Right now the script embeds in batches and upserts to Pinecone, with no checkpointing — if it dies partway I start over.

Ask me what my current script does, then help me make it resumable: where to record progress, what to record (document id? chunk id?), how to skip already-done work on rerun, and how to handle a partial batch that failed mid-upsert. Push back if my scheme would double-write or silently skip. Then tell me the smallest version that's actually worth writing tonight versus what's over-engineering for a capstone.
```
