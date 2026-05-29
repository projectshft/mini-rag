# Assignments

5 assignments over 42 days.

---

## Assignment Schedule

| # | Name | Due |
|---|------|-----|
| 1 | Document Upload | Day 13 |
| 2 | RAG Agent | Day 27 |
| 3 | Reranking | Day 34 |
| 4 | SQL Agent | Day 38 |
| 5 | Capstone | Day 42 |

---

## Document Upload

**Video (3-4 minutes):** Explain chunking strategy tradeoffs for medical records, Confluence docs, and Twitter posts.

**Code:** Complete the TODOs in the ingestion route, then add text sanitization (strip HTML, normalize whitespace, handle special characters, remove boilerplate).

**Files:** `app/api/upload-document/route.ts`, `app/libs/chunking.ts`

**Submit:**
- [Video Submission](https://form.typeform.com/to/NdVcsThQ)
- [Code Submission](https://form.typeform.com/to/A0pGKPqU)

---

## RAG Agent

**Video (3-4 minutes):** Explain how you evaluate retrieval quality - chunk sizing, retrieval accuracy, similarity thresholds, and metrics.

**Code:** Complete the TODOs in the RAG agent, then add query preprocessing (expand abbreviations, normalize casing, strip filler words).

**Files:** `app/agents/rag.ts`

**Submit:**
- [Video Submission](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission](https://form.typeform.com/to/EWWcsorL)

---

## Reranking

**Video (3-5 minutes):** Explain the two-stage retrieval pattern - when to rerank, when to skip, stage cutoffs, and cost analysis.

**Code:** Extend your RAG agent with reranking and score thresholding (minimum confidence, filter low results, graceful "I don't know" responses).

**Files:** `app/agents/rag.ts` (add reranking to your ragAgent function)

**Submit:**
- [Video Submission](https://form.typeform.com/to/pwjkAruL)
- [Code Submission](https://form.typeform.com/to/q3mEuSmX)

---

## SQL Agent

**Video (3-4 minutes):** Explain SQL query types (filtering, aggregation, joins, full-text search), pgvector, and when SQL beats dedicated vector DBs.

**Code:** Complete the `databaseSearchAgent` - define Zod schema, build Prisma WHERE clause, implement full agent flow.

**Repo:** Clone `sql-agent` branch from `https://github.com/projectshft/killer_agents.git`

**Files:** `app/agents/databaseSearchAgent.ts`

**Submit:**
- [Video Submission](https://form.typeform.com/to/QR9Vohg0)
- [Code Submission](https://form.typeform.com/to/FNEjXTwk)

---

## Capstone Project

Build a complete RAG application for a domain of your choice.

**Option A:** Extend the existing RAG project with a new data source and agent

**Option B:** Build your own RAG system from scratch

**Proposal Submit:**
- [Proposal Video](https://form.typeform.com/to/Z9JApCkF)
- [Proposal Notes](https://form.typeform.com/to/DXPyafyJ)

**Final Submit:**
- [Final Video](https://form.typeform.com/to/SF6b6edL)
- [Code Submission](https://form.typeform.com/to/TXjlfrlr)

---

## LLM-as-Judge (Practice)

**Code:** Implement the LLM-as-judge test pattern to evaluate agent routing quality.

**Files:** `app/agents/__tests__/llm-judge.test.ts`

**Submit:**
- [Code Submission](https://form.typeform.com/to/FNEjXTwk)
