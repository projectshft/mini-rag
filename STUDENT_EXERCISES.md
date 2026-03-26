# Student Exercises - RAG Applications Course

This document lists all the exercises you'll complete throughout the course. Each exercise builds on previous knowledge.

---

## Before You Start: Pre-Course Homework ⚠️

**REQUIRED:** Complete the [Pre-Course Homework](./15-applied-ai/week-0-setup/PRE-COURSE-HOMEWORK.md) before Week 0!

This includes:
- 3Blue1Brown videos on vectors, embeddings, and LLMs
- Agent architecture readings (Anthropic)
- Re-ranking concepts (Qdrant)
- Creating API accounts

**Time:** 3-4 hours (spread over a few days)

---

## Week 0: Setup & Orientation

Complete the [Week 0 Setup Guide](./15-applied-ai/week-0-setup/README.md):
- Install Node.js, Git, IDE
- Clone repository
- Configure environment variables
- Test all API connections

**Time:** 2-3 hours

---

## Module 2: Vector Math Basics

### Exercise 1: Document Similarity
**File:** `app/scripts/exercises/vector-similarity.ts`

**TODO:** Implement `findTopSimilarDocuments()` function
- Calculate cosine similarity between query and documents
- Filter by minimum similarity threshold
- Sort and return top K results

**Test:** `yarn exercise:vectors:test`

### Exercise 2: Word Arithmetic
**File:** `app/scripts/exercises/vector-word-arithmetic.ts`

**Run:** `yarn exercise:word-math`
- Explore vector analogies (king - man + woman = queen)

### 📝 Homework: Explain Dot Products
**Due:** Before Module 4

Create a video (3-5 min) or written explanation:
- Explain dot product to a non-math person interested in LLMs
- Why it matters for embeddings and similarity
- Use analogies and concrete examples
- Connect to how LLMs understand meaning

---

## Module 4.5: Chunking Fundamentals

### Exercise: Text Chunking with Overlap
**File:** `app/libs/chunking.ts`

**TODO:** Implement `getLastWords()` helper function
- Extract last N characters as complete words (no partial words)
- Used to create overlap between chunks

**Test:** `yarn test:chunking`

### 📝 Homework: Research Chunking Strategies
**Due:** Before Module 5

Create a video (5-7 min) or written report:
- Research 2 alternative chunking strategies (semantic, sliding window, recursive, etc.)
- Explain how each works and when to use them
- Compare with sentence-based chunking (pros/cons)
- Include code examples and use cases
- Create comparison table of all strategies

---

## Module 5: Fine-Tuning

### Exercise: Run Fine-Tuning Job
**File:** `app/scripts/upload-training-data.ts` (already implemented)

**Steps:**
1. Review training data: `app/scripts/data/linkedin_training.jsonl`
2. Run: `yarn train`
3. Monitor job at: https://platform.openai.com/finetune
4. Add model ID to `.env.local`:
   ```bash
   OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:org:name:abc123
   ```

---

## Module 7: Agent Architecture

### Exercise 1: Text-Based Selector
**File:** `app/api/select-agent/route.ts`

**TODO:** Implement agent routing logic
1. Call OpenAI to analyze conversation
2. Parse text response for agent and refined query
3. Validate and return selection

**Test:** `curl` commands in lesson 7.3

### Exercise 2: Structured Output Selector (Optional Upgrade)
**Same file**

**TODO:** Upgrade to use Zod schemas for type-safe responses
- Use `zodTextFormat()` for guaranteed JSON structure
- No manual parsing needed

---

## Module 8: LinkedIn Agent

### Exercise: Implement LinkedIn Agent
**File:** `app/agents/linkedin.ts`

**TODO:** Complete the LinkedIn agent
1. Get fine-tuned model ID from environment
2. Build system prompt with context
3. Stream response using Vercel AI SDK

---

## Module 9: RAG Agent

### Exercise 1: Basic RAG Agent
**File:** `app/agents/rag.ts`

**TODO:** Implement 5-step RAG pipeline
1. Generate query embedding
2. Query Pinecone for similar docs
3. Extract text content
4. Build context-aware system prompt
5. Stream LLM response

**Test:** Via `/api/chat` endpoint

### Exercise 2: Add Re-Ranking (Optional Enhancement)
**Same file**

**TODO:** Improve retrieval quality
- Over-fetch results (topK: 10)
- Use Pinecone re-ranker
- Return top 3 re-ranked results

### 📝 Homework: Explain Re-Ranking with Examples
**Due:** Before Module 11

Create a video (5-8 min) or written guide:
- Explain why semantic search alone isn't always enough
- What is re-ranking and how does it work
- Show 2-3 concrete examples where re-ranking helps
- When to use re-ranking vs basic retrieval
- Cost/latency trade-offs
- Include visual diagrams and realistic examples

---

## Module 13: Testing

### Exercise: Write Agent Tests
**File:** `app/agents/__tests__/selector.test.ts`

**Test:** `yarn test:selector`
- Verify routing decisions (not exact text)
- Test structure validation
- Check error handling

---

## Module 14: Capstone Project

### Final Project: Multi-Source RAG System

**Requirements:**
1. Add one new data source
2. Create one new agent
3. Update selector routing
4. Write tests
5. Document your work

**Deliverables:**
- Working implementation
- Documentation
- 3-5 minute demo video

---

## Quick Reference

### Available Commands

```bash
# Development
yarn dev                    # Start dev server
yarn build                  # Build for production
yarn test                   # Run all tests

# Exercises
yarn exercise:vectors       # Vector similarity exercise
yarn exercise:word-math     # Word arithmetic exercise
yarn test:chunking          # Test chunking implementation
yarn test:selector          # Test agent selector

# Fine-Tuning
yarn train                  # Upload training data & start fine-tuning
yarn estimate-costs         # Estimate training costs

# Other
yarn scrape-content         # Scrape and vectorize content
```

### Key Files

```
app/
├── agents/
│   ├── linkedin.ts         # TODO: Implement LinkedIn agent
│   ├── rag.ts              # TODO: Implement RAG agent
│   └── config.ts           # Agent descriptions
├── api/
│   ├── select-agent/
│   │   └── route.ts        # TODO: Implement selector
│   ├── chat/route.ts       # Chat endpoint (pre-built)
│   └── upload-document/    # Upload API (pre-built)
├── libs/
│   ├── chunking.ts         # TODO: Implement getLastWords()
│   ├── pinecone.ts         # Pinecone client (pre-built)
│   └── openai/openai.ts    # OpenAI client (pre-built)
└── scripts/
    └── exercises/
        └── vector-similarity.ts  # TODO: Implement similarity search
```

### Environment Variables

Create `.env.local` with:

```bash
# Required
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=rag-tutorial

# After fine-tuning
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:...

# LangSmith (Observability)
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_pt_...
```

---

## Getting Help

- Reference the `student-working-version` branch for complete solutions
- Review tests for expected behavior
- Ask questions in course forum

Good luck! 🚀
