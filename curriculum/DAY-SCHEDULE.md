# Day-Based Curriculum Schedule

Complete the RAG & AI Agents curriculum in 45 days with 1-2 hours of daily study.

**Structure:** 6 weeks of learning (6 days on, 1 rest day) + final push to capstone

**Pace:** Working engineers using AI tools - focused, practical, no fluff

---

## Overview

| Week | Theme | Days | Assignment |
|------|-------|------|------------|
| 1 | Foundations | 1-7 | Document Upload (Due Day 13) |
| 2 | Data Pipeline | 8-14 | - |
| 3 | Agent Architecture | 15-21 | Agent Selector (Due Day 27) |
| 4 | RAG Agent | 22-28 | RAG + Reranking (Due Day 34) |
| 5 | Testing & Tools | 29-35 | SQL Agent (Due Day 41) |
| 6 | Capstone | 36-45 | Capstone (Due Day 45) |

**Total:** 45 days, 39 working days, ~42 hours

---

## Weekly Guides

- [Week 1: Foundations](./days/week-1.md) (Days 1-7)
- [Week 2: Data Pipeline](./days/week-2.md) (Days 8-14)
- [Week 3: Agent Architecture](./days/week-3.md) (Days 15-21)
- [Week 4: RAG Agent](./days/week-4.md) (Days 22-28)
- [Week 5: Testing & Tools](./days/week-5.md) (Days 29-35)
- [Week 6: Capstone](./days/week-6-final.md) (Days 36-45)

---

## Assignment Schedule

| # | Name | Assigned | Due | Focus |
|---|------|----------|-----|-------|
| 1 | Document Upload | Day 6 | Day 13 | Chunking + Upload Route |
| 2 | Agent Selector | Day 19 | Day 27 | Structured Outputs |
| 3 | RAG + Reranking | Day 23 | Day 34 | Retrieval Quality |
| 4 | SQL Agent | Day 33 | Day 41 | Alternative Retrieval |
| 5 | Capstone | Day 36 | Day 45 | Full Integration |

See [ASSIGNMENTS.md](./ASSIGNMENTS.md) for submission links.

---

## Daily Time Budget

| Day Type | Duration |
|----------|----------|
| Read/Watch | 45-60 min |
| Hands-on | 60-90 min |
| Assignment | 60-90 min |
| REST | 0 min |

---

## Environment Setup

**Do this before Day 3:**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys:
# - OPENAI_API_KEY (required for all exercises)
# - PINECONE_API_KEY (required for RAG exercises)
# - See .env.example for all available options
```

---

## Quick Commands

```bash
# Run tests
yarn test:selector    # Agent routing tests
yarn test:chunking    # Chunking tests
yarn test             # All tests

# Start development
yarn dev              # Start Next.js server

# Run exercises
npx ts-node app/scripts/exercises/vector-similarity.ts
npx ts-node app/scripts/exercises/vector-word-arithmetic.ts
```

---

## Key Files to Implement

| Week | Files |
|------|-------|
| 1-2 | `app/libs/chunking.ts`, `app/api/upload-document/route.ts` |
| 3 | `app/api/select-agent/route.ts`, `app/agents/linkedin.ts` |
| 4 | `app/agents/rag.ts` |
| 5 | `app/agents/__tests__/*.ts`, SQL Agent repo |

---

## Tips for Success

### Daily Habits
- **Same time each day** - builds consistency
- **No distractions** - 60 focused minutes beats 90 distracted minutes
- **Take notes** - especially on concepts you'd explain to someone else

### When You're Stuck
- **Check the cheat codes** (Module 99) for quick patterns
- **Re-watch the video** - often catches what you missed reading
- **Office hours** - bring specific questions, not "I don't get it"

### Code Exercises
- **Read the TODOs carefully** - they guide you step by step
- **Run tests early** - `yarn test` shows what's expected
- **Compare to reference** - curriculum branch has complete implementations

---

## Modules NOT in Core Path

These modules are **optional/bonus** and not part of the 45-day schedule:

- **Module 16:** Agent Patterns (Advanced HITL) - Draft, excluded
- **Module 19:** MCP Integration - Day 45 bonus if time permits

## Week 5 Extension: LangGraph

**Module 10: AI Frameworks** is recommended for students who want deeper coverage of agent orchestration.

| Lesson | Content | Time |
|--------|---------|------|
| 1 | [ReAct Agent Quick Start](./10-ai-frameworks/1-react-agent-quick-start.md) | 45 min |
| 2 | [LangGraph Concepts](./10-ai-frameworks/2-langgraph-concepts.md) | 60 min |
| 3 | [Custom State Graphs](./10-ai-frameworks/3-custom-state-graphs.md) | 90 min |

Do this content:
- During Week 5 rest day (Day 35)
- After completing the main curriculum
- When you need more control than `createReactAgent` provides
