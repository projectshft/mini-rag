# 6-Week Study Plan

Complete the RAG & AI Agents curriculum in 6 weeks with ~30-45 minutes of daily study (weekdays only).

**Structure:** 5 weeks of learning + 1 week for capstone project (30 study days total)

---

## Week 1: How to Learn & Foundations

**Theme:** Learning techniques and RAG concepts

**Before Day 3:** Set up your environment variables! Copy `.env.example` to `.env` and add your `OPENAI_API_KEY`. See Quick Reference below.

| Day | Module | Lesson | Time | Focus |
|-----|--------|--------|------|-------|
| 1 | 0 | How to Learn | 30 min | Feynman Technique, video expectations, office hours |
| 2 | 1 | What is RAG | 30 min | Watch videos, understand RAG vs fine-tuning |
| 3 | 2 | Vectors and Embeddings | 45 min | Video + quiz + `findTopSimilarDocuments()` |
| 4 | 2 | Word Math Fun | 45 min | Code exercise: word arithmetic |
| 5 | 3 | Setting Up Pinecone | 45 min | OpenAI + Pinecone client setup |

**Assignment Due:** Vector math explanation video + word equation examples

---

## Week 2: Infrastructure & Data Pipeline

**Theme:** Chunking, document upload, and fine-tuning

| Day | Module | Lesson | Time | Focus |
|-----|--------|--------|------|-------|
| 1 | 3-4 | Challenge + Scraping Intro | 45 min | Embedding dimensions + data quality |
| 2 | 4 | Understanding Chunking | 50 min | Code exercise: `getLastWords()` |
| 3 | 5 | Uploading with a Script | 40 min | Batch upload process |
| 4 | 5 | Building the API Route | 50 min | Code exercise: 9-step upload pipeline |
| 5 | 5-6 | Querying + Fine-Tuning | 50 min | Retrieval + when to fine-tune vs RAG |

**Assignment Due:** Chunking + Sanitization code submission

---

## Week 3: Agent Architecture

**Theme:** Building intelligent routing and agents

| Day | Module | Lesson | Time | Focus |
|-----|--------|--------|------|-------|
| 1 | 7 | Understanding Agent Systems | 45 min | Agent pattern, routing concepts |
| 2 | 7 | Prompting + Text Selector | 50 min | Temperature, model selection, basic selector |
| 3 | 7 | Structured Outputs | 50 min | Code exercise: Zod schemas |
| 4 | 7-8 | Graceful Degradation + LinkedIn | 50 min | Fallback strategies + few-shot prompting |
| 5 | 9 | RAG Agent | 45 min | Code exercise: retrieval + generation |

**Assignment Due:** Agent selector with structured outputs

---

## Week 4: RAG Deep Dive & Interface

**Theme:** Advanced retrieval and chat interface

| Day | Module | Lesson | Time | Focus |
|-----|--------|--------|------|-------|
| 1 | 9 | Implementing Reranking | 45 min | Over-fetch and rerank pattern |
| 2 | 9 | Sparse & Dense Vectors | 40 min | Hybrid search concepts |
| 3 | 11 | Understanding the Interface | 50 min | React streaming, state management |
| 4 | 11 | Challenge | 50 min | Add source references to chat |
| 5 | 12 | Integrating LangSmith | 40 min | Monitoring setup |

**Assignment Due:** RAG agent with reranking + video on retrieval quality

---

## Week 5: Testing, Advanced & Interview Prep

**Theme:** Production readiness and career preparation

| Day | Module | Lesson | Time | Focus |
|-----|--------|--------|------|-------|
| 1 | 13 | Testing Agents | 50 min | Test cases + LLM as Judge |
| 2 | 14 | Tool Calling | 50 min | Concepts + implementation patterns |
| 3 | 15 | SQL Agent | 45 min | RAG without vectors |
| 4 | 17-18 | Capstone + Signature Story | 50 min | Project requirements + your narrative |
| 5 | 18 | Interview Practice | 60 min | Strong opinions + live practice videos |

**Assignment Due:** SQL Agent code + interview prep videos + capstone proposal

---

## Week 6: Capstone Project

**Theme:** Build something real

| Day | Focus | Time |
|-----|-------|------|
| 1-2 | Implementation | 3-4 hours |
| 3-4 | Polish + Documentation | 2-3 hours |
| 5 | Demo Video + Submission | 1-2 hours |

**Choose your path:**
- **Option A (Extend):** Add new agent + data source to class project
- **Option B (From Scratch):** Build RAG system for your own domain

**Deliverables:**
- Working RAG application
- README documentation
- 5-7 minute demo video
- GitHub repository

---

## Time Investment Summary

| Week | Theme | Total Time |
|------|-------|------------|
| 1 | How to Learn & Foundations | ~3.5 hours |
| 2 | Infrastructure & Data Pipeline | ~4 hours |
| 3 | Agent Architecture | ~4 hours |
| 4 | RAG Deep Dive & Interface | ~3.5 hours |
| 5 | Testing, Advanced & Interview Prep | ~4.5 hours |
| 6 | Capstone | ~8-10 hours |

**Total:** ~28-30 hours over 6 weeks (30 study days)

---

## Tips for Success

### Daily Habits
- **Same time each day** - builds consistency
- **No distractions** - 30 focused minutes beats 60 distracted minutes
- **Take notes** - especially on concepts you'd explain to someone else

### Weekly Rhythm
- **Monday-Wednesday:** New content
- **Thursday:** Practice/exercises
- **Friday:** Review + record Feynman video

### When You're Stuck
- **Check the cheat codes** (Module 99) for quick patterns
- **Re-watch the video** - often catches what you missed reading
- **Office hours** - bring specific questions, not "I don't get it"

### Code Exercises
- **Read the TODOs carefully** - they guide you step by step
- **Run tests early** - `yarn test` shows what's expected
- **Compare to reference** - curriculum branch has complete implementations

---

## Bonus: MCP Integration (Optional)

**Module 19: Exposing RAG Over MCP**

After completing the core curriculum, explore how to expose your RAG system via the Model Context Protocol:

| Topic | Time | Focus |
|-------|------|-------|
| MCP Fundamentals | 30 min | Protocol concepts, server architecture |
| Building the Server | 45 min | Code exercise: expose RAG as MCP tools |
| Client Integration | 30 min | Connect to Claude Code, Cursor, or Inspector |

**Bonus Challenge:** Design an MCP server for your company's workflows.

---

## Modules NOT in This Plan

These modules are marked as **DRAFT** and not part of the core curriculum:

- **Module 10:** AI Frameworks (LangGraph)
- **Module 16:** Agent Patterns (Advanced HITL)

You may explore these after completing the core curriculum if interested.

---

## Quick Reference

**Environment Setup (do this first!):**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys:
# - OPENAI_API_KEY (required for all exercises)
# - PINECONE_API_KEY (required for RAG exercises)
# - See .env.example for all available options
```

**Run tests:**
```bash
yarn test:selector    # Agent routing tests
yarn test:chunking    # Chunking tests
yarn test            # All tests
```

**Start development:**
```bash
yarn dev             # Start Next.js server
```

**Run exercises:**
```bash
npx ts-node app/scripts/exercises/vector-similarity.ts
npx ts-node app/scripts/exercises/vector-word-arithmetic.ts
```

**Key files to implement:**
- `app/libs/chunking.ts` - Week 2
- `app/api/upload-document/route.ts` - Week 2
- `app/api/select-agent/route.ts` - Week 3
- `app/agents/linkedin.ts` - Week 3
- `app/agents/rag.ts` - Week 3-4
