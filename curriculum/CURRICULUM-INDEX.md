# RAG Applications - Complete Curriculum Index

This document provides a complete overview of the course structure, including all lessons, exercises, and resources.

---

## Course Structure

**Total Duration:** 4 weeks
**Format:** Async homework + live sessions
**Project:** Multi-source RAG application with agents

---

## Pre-Course: Homework (Required Before Week 0)

**📂 Location:** `week-0-setup/PRE-COURSE-HOMEWORK.md`

### Visual Learning Resource
- 🔗 [AI Accelerator Compendium](https://projectshft.github.io/ai-accelerator-compendium/) - Interactive visual guides covering vectors, dot products, LLMs, transformers, and attention

### Part 1: Linear Algebra Foundations (90 min)
- ✅ Vectors - What are they?
- ✅ Linear combinations, span, basis vectors
- ⭐ Dot products and duality (CRITICAL for RAG)

### Part 2: Large Language Models (60 min)
- ✅ Mini LLM explanation
- ✅ Transformers architecture
- ✅ Attention mechanisms
- 📖 Optional: Building an LLM from scratch

### Part 3: Vector Databases (30 min)
- 🔗 Pinecone overview and docs
- 🔗 Qdrant comparison

### Part 4: Observability (15 min)
- 🔗 Helicone features and pricing

### Part 5: Building Effective Agents ⭐ (45 min)
- 📖 Anthropic: Building Effective Agents
- 📖 Qdrant: Re-ranking for Semantic Search
- 📖 Anthropic: Prompt Engineering for Business

### Part 6: Create Accounts (30 min)
- OpenAI (with $5+ credit)
- Pinecone (free tier)
- Helicone (free tier)
- Vercel
- GitHub

**Total Time:** ~3-4 hours (spread over multiple days)

---

## Week 0: Setup & Orientation

**📂 Location:** `week-0-setup/`

### Setup Tasks
1. Install Node.js 20+
2. Install Git
3. Install VS Code (or preferred IDE)
4. Clone starter repository
5. Install dependencies
6. Configure environment variables
7. Run test script
8. Verify development server

### Files
- `README.md` - Complete setup guide
- `PRE-COURSE-HOMEWORK.md` - Pre-course videos/readings
- `kickoff-session-guide.md` - Live session agenda
- `package-json-scripts.md` - Available commands
- `FILES.md` - Project structure overview
- `test-setup-script.js` - API verification script

**Time:** 2-3 hours

---

## Module 1: Introduction to RAG

**📂 Location:** `1-intro-to-rag/`

### Lessons
1. What is RAG?
   - Problem: LLM hallucinations
   - Solution: Retrieval-Augmented Generation
   - Real-world applications
   - Learning path overview

**No exercises** - Purely conceptual foundation

**Time:** 30 minutes

---

## Module 2: Vector Math Basics

**📂 Location:** `2-vector-math-basics/`

### Lessons
1. Vectors and Embeddings
   - Vectors as lists of numbers
   - Text → Embeddings via OpenAI API
   - Dot product calculation
   - Cosine similarity (the foundation of RAG)

2. Implementing Document Similarity
   - **💻 EXERCISE:** Implement `findTopSimilarDocuments()`
   - Calculate similarity for documents
   - Filter by threshold
   - Sort and return top K

3. Word Math Fun
   - **💻 EXERCISE:** Vector arithmetic
   - Word analogies: king - man + woman = queen
   - Explore embedding relationships

### Exercises
- `app/scripts/exercises/vector-similarity.ts` - Implement similarity search
- `app/scripts/exercises/vector-word-arithmetic.ts` - Word math

### Homework Assignment
**Explain Dot Products for LLMs** (Due: Before Module 4)
- Video (3-5 min) or written explanation (500-800 words)
- Explain dot product to non-math person interested in LLMs
- Why it matters for embeddings and similarity
- Use analogies and concrete examples

### Commands
```bash
yarn exercise:vectors:test    # Test similarity implementation
yarn exercise:word-math        # Word arithmetic demo
```

**Time:** 2-3 hours + homework (1-2 hours)

---

## Module 4: Pinecone Integration

**📂 Location:** `4-pinecone-integration/`

### Lessons
1. Setting Up Pinecone Client
   - OpenAI embedding client setup
   - Pinecone client configuration
   - searchDocuments function
   - **CHALLENGE:** Analyze embedding dimensions for different content types

### Key Files
- `app/libs/openai/openai.ts` - OpenAI client (pre-built)
- `app/libs/pinecone.ts` - Pinecone client (pre-built)

**Time:** 1-2 hours

---

## Module 4.5: Chunking Fundamentals

**📂 Location:** `4.5-chunking-fundamentals/`

### Lessons
1. Introduction to Web Scraping
   - What is web scraping
   - Ethics and best practices
   - Quality content selection

2. Understanding Text Chunking
   - Why chunking matters
   - Bad approaches (character/word splitting)
   - Good approach (sentence-aware + overlap)
   - **💻 EXERCISE:** Implement `getLastWords()` helper

### Exercise
- `app/libs/chunking.ts` - Implement `getLastWords()` for overlap

### Homework Assignment
**Research Chunking Strategies** (Due: Before Module 5)
- Video (5-7 min) or written report (800-1200 words)
- Research 2 alternative chunking strategies
- Explain how each works and when to use them
- Compare with sentence-based (pros/cons/use cases)
- Include code examples and comparison table

### Commands
```bash
yarn test:chunking    # Test chunking implementation
```

**Time:** 2 hours + homework (2-3 hours)

---

## Module 5: Document Upload & Retrieval

**📂 Location:** `5-document-upload/`

### Lessons
1. Uploading with a Script
   - Pipeline: URLs → Scrape → Chunk → Embed → Upload
   - Batch processing
   - **RUN:** Upload script for your documents

2. Building the API Route
   - Accept URLs from UI
   - Process and vectorize
   - Upload to Pinecone

3. Querying Documents
   - Query flow: Query → Embedding → Search → Results
   - Understanding similarity scores

### Key Files
- `app/scripts/scrapeAndVectorizeContent.ts` - Upload script (pre-built)
- `app/api/upload-document/route.ts` - Upload API (pre-built)
- `app/api/upload-text/route.ts` - Text upload alternative (pre-built)

### Commands
```bash
yarn scrape-content    # Upload documents to Pinecone
```

**Time:** 2-3 hours

---

## Module 5 (Alt): Fine-Tuning

**📂 Location:** `5-fine-tuning/`

### Lessons
1. Fine-Tuning Overview
   - What is fine-tuning
   - Fine-tuning vs RAG (when to use each)
   - Cost-benefit analysis
   - Training data format (JSONL)

2. Running the Fine-Tuning Process
   - **💻 EXERCISE:** Upload training data and start job
   - Monitor training progress
   - Get model ID
   - Configure environment

### Files
- `app/scripts/upload-training-data.ts` - Upload script (pre-built)
- `app/scripts/data/linkedin_training.jsonl` - Training data (provided)

### Commands
```bash
yarn train              # Start fine-tuning job
yarn estimate-costs     # Estimate training cost
```

### Environment
```bash
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:org:name:abc123
```

**Time:** 1-2 hours (plus training time)

---

## Module 7: Agent Architecture

**📂 Location:** `7-agent-architecture/`

### Lessons
1. Understanding Agent Systems
   - Agent types (LinkedIn, RAG)
   - Routing flow
   - Agent configuration

2. Prompting for Agents
   - Message roles (system, user, assistant)
   - Best practices
   - Output format specification

3. Implementing Selector - Text-Based
   - **💻 EXERCISE:** Build agent router
   - Call OpenAI with context
   - Parse text response
   - Validate and return

4. Upgrading to Structured Outputs
   - **💻 OPTIONAL:** Refactor to Zod schemas
   - Type-safe responses
   - Guaranteed JSON structure

### Exercise
- `app/api/select-agent/route.ts` - Implement selector

### Files
- `app/agents/config.ts` - Agent descriptions (pre-built)
- `app/agents/types.ts` - Type definitions (pre-built)

### Commands
```bash
yarn test:selector    # Test selector routing
```

**Time:** 3-4 hours

---

## Module 8: LinkedIn Agent

**📂 Location:** `8-linkedin-agent/`

### Lessons
1. Implementing the LinkedIn Agent
   - **💻 EXERCISE:** Build fine-tuned agent
   - Get model ID from environment
   - Build system prompt
   - Stream response

### Exercise
- `app/agents/linkedin.ts` - Implement LinkedIn agent

**Time:** 1-2 hours

---

## Module 9: RAG Agent

**📂 Location:** `9-rag-agent/`

### Lessons
1. Implementing the RAG Agent
   - **💻 EXERCISE:** Build 5-step RAG pipeline
   - Generate query embedding
   - Query Pinecone
   - Extract context
   - Build prompt
   - Stream response

2. Implementing Re-Ranking
   - **💻 OPTIONAL:** Add re-ranking
   - Over-fetch results
   - Re-rank with Pinecone inference
   - Improved retrieval quality

3. Tool-Calling in Agents
   - Workflows vs tool-calling
   - When to use each approach
   - Trade-offs

### Exercise
- `app/agents/rag.ts` - Implement RAG agent

### Homework Assignment
**Explain Re-Ranking with Examples** (Due: Before Module 11)
- Video (5-8 min) or written guide (1000-1500 words)
- Explain why semantic search alone isn't enough
- What is re-ranking and how does it work
- Show 2-3 concrete examples where re-ranking helps
- When to use it vs basic retrieval
- Include diagrams and realistic examples

**Time:** 3-4 hours + homework (2-4 hours)

---

## Module 10: LangGraph

**📂 Location:** `10-langgraph/`

### Lessons
1. Introduction to LangGraph
   - What is LangGraph and why it's useful
   - Core concepts: graphs, nodes, edges, state
   - When to use LangGraph vs AI SDK
   - Key features: checkpointing, human-in-the-loop, memory
   - Common patterns (ReAct, Reflection, Multi-Agent)

2. Building a LangGraph Agent
   - **💻 EXERCISE:** Build stateful research agent
   - Define state schema with Annotation
   - Create nodes (analyze, search, evaluate, answer)
   - Add conditional routing
   - Implement graph-based workflow

### Exercise
- `app/api/langgraph-agent/route.ts` - Implement LangGraph agent

### Key Concepts
- Graph-based workflows vs linear workflows
- Stateful agents with persistent memory
- Decision-making and conditional routing
- Production features (fault tolerance, HITL)

**Time:** 3-4 hours

---

## Module 10.5: Tool-Calling Exploration

**📂 Location:** `10.5-tool-calling-exploration/`

### Lessons
1. Exploring Tool-Calling Patterns
   - Three approaches to RAG (workflows, tool-calling, LangGraph)
   - When to use each approach
   - Cost comparison and trade-offs
   - **💻 EXPLORATION:** Build tool-calling agent
   - Implement separate route for experimentation

### Exercise
- `app/api/tool-calling-agent/route.ts` - Explore tool-calling patterns

### Important Note
This is an exploratory module. Students will implement tool-calling in a separate file to understand the pattern, but will continue using workflows in the main application. Understanding when to use each approach is valuable for production systems.

**Time:** 2-3 hours

---

## Module 11: Chat Interface

**📂 Location:** `11-chat-interface/`

### Lessons
1. Understanding the Interface
   - Flow: User input → Selector → Agent → Response
   - State management
   - Streaming implementation
   - Custom streaming (not using Vercel SDK)

### Files
- `app/page.tsx` - Chat UI (pre-built)

**Time:** 1 hour (reading/understanding)

---

## Module 12: Observability

**📂 Location:** `12-observability/`

### Lessons
1. Integrating Helicone
   - Why observability matters
   - 2-line integration
   - Dashboard features
   - Monitoring metrics

### Files
- `app/libs/openai/openai.ts` - Add Helicone proxy

**Time:** 30 minutes

---

## Module 13: Testing Agents

**📂 Location:** `13-testing-agents/`

### Lessons
1. Testing the Selector Agent
   - **💻 EXERCISE:** Write agent tests
   - Test structure, not content
   - Verify routing decisions
   - Error handling

### Exercise
- `app/agents/__tests__/selector.test.ts` - Agent tests

### Commands
```bash
yarn test:selector    # Run selector tests
yarn test             # Run all tests
```

**Time:** 2 hours

---

## Module 15: Capstone Project

**📂 Location:** `15-capstone-project/`

### Final Project: Multi-Source RAG System

**Requirements:**
1. Add one new data source
2. Create one new agent
3. Update selector routing
4. Write tests
5. Document your work
6. Record 3-5 minute demo

**Deliverables:**
- Working implementation
- Deployed URL (Vercel)
- GitHub repository
- Demo video

**Evaluation:**
- Correct embeddings & chunking
- Clear separation of indexes/agents
- Clean, readable code
- Clear design explanations

**Time:** 8-12 hours

---

## Appendix: Additional Resources

### Proposed 4-Week Structure
**📄 File:** `PROPOSED-4-WEEK-STRUCTURE.html`

Detailed breakdown of weekly themes and session structure.

### Transcript
**📄 File:** `transcript.md`

Original course transcript and notes.

---

## Quick Reference

### All Available Commands

```bash
# Development
yarn dev                    # Start dev server
yarn build                  # Build for production
yarn test                   # Run all tests

# Exercises
yarn exercise:vectors:test  # Vector similarity tests
yarn exercise:word-math     # Word arithmetic demo
yarn test:chunking          # Chunking tests
yarn test:selector          # Selector tests

# Fine-Tuning
yarn train                  # Upload training data
yarn estimate-costs         # Estimate training costs

# Data Upload
yarn scrape-content         # Scrape and vectorize URLs

# Other
yarn lint                   # Run linter
```

### Key Files to Implement (TODOs)

```
app/
├── agents/
│   ├── linkedin.ts              # TODO: Module 8
│   ├── rag.ts                   # TODO: Module 9
│   └── __tests__/selector.test.ts  # TODO: Module 13
├── api/
│   └── select-agent/route.ts    # TODO: Module 7
└── libs/
    └── chunking.ts              # TODO: Module 4.5 (getLastWords)
scripts/
└── exercises/
    └── vector-similarity.ts     # TODO: Module 2
```

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=rag-tutorial

# After fine-tuning (Module 5)
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:...

# Optional
HELICONE_API_KEY=sk-helicone-...
```

---

## Learning Path Summary

**Week 0 (Pre-work):**
- Videos: Vectors, LLMs, attention
- Readings: Agents, re-ranking, prompting
- Setup: Accounts, development environment

**Week 1: Foundations**
- Modules 1-2: Intro, vector math
- Module 4: Pinecone integration
- Module 4.5: Chunking
- Module 5: Document upload

**Week 2: Agents**
- Module 5 (alt): Fine-tuning
- Module 7: Agent architecture
- Module 8: LinkedIn agent
- Module 9: RAG agent

**Week 3: Advanced Patterns**
- Module 10: LangGraph
- Module 10.5: Tool-calling exploration
- Module 11: Chat interface
- Module 12: Observability

**Week 4: Testing & Capstone**
- Module 13: Testing
- Module 15: Final project
- Deployment
- Demo & presentation

---

## Total Time Estimate

- **Pre-course homework:** 3-4 hours
- **Week 0 setup:** 2-3 hours
- **Modules 1-13 (lessons + exercises):** 30-42 hours
- **Homework assignments (3 videos/reports):** 5-9 hours
- **Capstone project:** 8-12 hours

**Total:** ~48-70 hours over 4 weeks (including homework)

---

## Getting Help

- **Slack:** #general for questions
- **Office Hours:** Mondays after each module
- **Documentation:** Check lesson markdown files
- **Reference Solutions:** Marked with ⚠️ warnings (try first!)

---

**Ready to build RAG applications? Start with the [Pre-Course Homework](./week-0-setup/PRE-COURSE-HOMEWORK.md)! 🚀**
