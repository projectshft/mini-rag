# New RAG Assignments

Three self-contained assignments that extend the existing mini-rag system.
Each one lives in its own route file and has a dedicated frontend page.

---

## Assignment 1 — Custom Chunking + Secure Ingestion

**Route:** `POST /api/ingest/custom`
**Frontend:** `/ingest`
**Files:** `app/api/ingest/custom/route.ts`, `app/ingest/page.tsx`

### What You Learn

- **Chunking strategy is a design choice.** The default ingestion route uses character-based chunking with character-level overlap. This route uses sentence-boundary chunking (3-5 sentences per chunk, 1 sentence overlap). Different strategies produce different retrieval quality depending on your data.
- **Index design is intentional.** Vectors go into a separate Pinecone index (`custom-chunks-index`) rather than mixing with existing data. In production you'd maintain separate indexes for different data sources, domains, or tenants.
- **What you let INTO your RAG system matters as much as how you retrieve from it.** The route validates all input before chunking:
  - Prompt injection scanning (patterns like "ignore previous instructions")
  - Repetitive content detection (manipulation through repetition)
  - Metadata poisoning prevention (script tags, SQL keywords in metadata fields)
  - Payload size limits

### What "Done" Looks Like

- You can paste a news article into the form, fill in metadata, and submit
- Valid content is chunked into sentences, embedded, and stored in `custom-chunks-index`
- Submitting text with "ignore previous instructions" returns a clear error
- Submitting a field with `<script>` or `DROP TABLE` returns a field-level error
- Text over 50,000 characters is rejected with the actual character count
- On success, the UI shows how many chunks and vectors were created

---

## Assignment 2 — Structured Query Builder with Prisma

**Route:** `POST /api/agent/prisma-query`
**Frontend:** `/query-builder`
**Files:** `app/api/agent/prisma-query/route.ts`, `app/query-builder/page.tsx`, `prisma/schema.prisma`, `prisma/seed.ts`

### What You Learn

- **RAG doesn't require a vector database.** Structured data with known fields is often better served by a traditional database with typed queries. Not everything needs embeddings.
- **Prisma is an ORM** (Object-Relational Mapper) that generates safe, parameterized SQL from TypeScript objects. You describe what you want with types and objects — Prisma handles the query generation.
- **SQL injection is real and preventable.** The route includes a commented-out `dangerousRawQuery` function showing exactly how string interpolation into SQL lets an attacker run `DROP TABLE`. Prisma prevents this by design — values are always sent as parameters, never concatenated into the query string.

### Setup

```bash
yarn prisma:setup
# This runs: prisma generate → prisma migrate dev → prisma db seed
```

The seed script creates 17 products across 4 categories (electronics, books, home-office, fitness) with 30+ reviews at varied ratings.

### What "Done" Looks Like

- The database is seeded and you can query it through the UI
- Filtering by category, price range, rating, and stock status works
- The Prisma `where` clause is displayed as JSON so you can see the exact mapping from filters → query
- Products show with their average rating calculated from reviews
- You understand why `dangerousRawQuery` is dangerous and why Prisma prevents it

---

## Assignment 3 — Reranking Pipeline

**Route:** `POST /api/search/rerank`
**Frontend:** `/rerank`
**Files:** `app/api/search/rerank/route.ts`, `app/rerank/page.tsx`

### What You Learn

- **Retrieval and ranking are two separate steps.** Vector similarity gets you in the neighborhood — reranking picks the best house on the street. The first results from a vector DB are sorted by mathematical similarity, not by how well they actually answer your question.
- **Reranking improves quality at the cost of latency and tokens.** Stage 1 (vector search) is fast and cheap. Stage 2 (LLM reranking) reads every chunk and reasons about relevance, which is slower and costs tokens.
- **In production, use a dedicated reranker.** Models like Cohere Rerank, Pinecone's built-in inference reranker, or BGE Reranker are purpose-built for scoring relevance — they're cheaper and faster than a general-purpose LLM. The LLM approach here makes the scoring logic transparent so you can see the reasoning.

### What "Done" Looks Like

- You enter a search query and see results from both stages side by side
- The "Before" column shows top 5 by vector similarity score
- The "After" column shows top 5 by LLM relevance score (0-10) with a one-sentence reason for each score
- You can see results that moved up, moved down, or got filtered out
- The full scores table shows how the LLM scored all 20 retrieved chunks
- You can explain why the ordering changed for at least one query

---

## Routes Summary

| Assignment | Route | Frontend | Key Concept |
|---|---|---|---|
| 1 | `POST /api/ingest/custom` | `/ingest` | Chunking strategy + input security |
| 2 | `POST /api/agent/prisma-query` | `/query-builder` | ORMs + SQL injection prevention |
| 3 | `POST /api/search/rerank` | `/rerank` | Two-stage retrieval + reranking |
