Use yarn as package manager.

# Branch Structure

This repository has two main branches:

## `curriculum` (Main Branch)

The primary branch with complete working implementations.

### Purpose:

-   Complete reference implementation
-   All features fully implemented
-   Clean, well-structured code
-   Ready to run and test

### Key Files:

-   `app/agents/linkedin.ts` - Complete LinkedIn agent implementation
-   `app/agents/rag.ts` - Complete RAG agent with reranking
-   `app/api/select-agent/route.ts` - Complete selector with structured outputs
-   `app/agents/__tests__/selector.test.ts` - Full test suite

### Use This Branch:

-   For instructor demos and live coding
-   To verify expected behavior
-   To show working examples when students are stuck
-   As the source of truth for the complete system

---

## `student-todo-exercises` (Exercise Branch)

Code with implementations removed and detailed TODOs for students to complete.

### Purpose:

-   Hands-on learning exercises
-   Step-by-step guidance via TODO comments
-   Students implement features themselves
-   Follows curriculum modules in `curriculum/`

### Key Files:

-   `app/agents/linkedin.ts` - TODOs for LinkedIn agent
-   `app/agents/rag.ts` - TODOs for RAG agent with reranking
-   `app/api/select-agent/route.ts` - TODOs for selector
-   All imports and types intact, only implementations removed

### Use This Branch:

-   For students to work through exercises
-   Pair with curriculum modules in `curriculum/`
-   Students build everything from scratch with guided TODOs

---

## Curriculum Structure

The curriculum is organized in `curriculum/`:

1. **How to Learn** (`0-how-to-learn/`)
2. **Intro to RAG** (`1-intro-to-rag/`)
3. **Vector Math Basics** (`2-vector-math-basics/`)
4. **Pinecone Integration** (`3-pinecone-integration/`)
5. **Chunking Fundamentals** (`4-chunking-fundamentals/`)
6. **Document Upload** (`5-document-upload/`)
7. **Fine-tuning** (`6-fine-tuning/`)
8. **Agent Architecture** (`7-agent-architecture/`)
    - Understanding agents
    - Prompting strategies
    - Text-based selector
    - Structured outputs
9. **LinkedIn Agent** (`8-linkedin-agent/`)
10. **RAG Agent** (`9-rag-agent/`)
    - Basic implementation
    - Reranking
    - Sparse and dense vectors
11. **AI Frameworks** (`10-ai-frameworks/`)
12. **Chat Interface** (`11-chat-interface/`)
13. **Observability** (`12-observability/`)
14. **Testing Agents** (`13-testing-agents/`)
15. **Tool Calling** (`14-tool-calling-exploration/`)
16. **SQL Agent** (`15-sql-agent/`)
17. **Agent Patterns** (`16-agent-patterns/`)
18. **Capstone Project** (`17-capstone-project/`)
19. **Interview Prep** (`18-interview-prep/`)

---

## Testing

### Run All Tests:

```bash
yarn test
```

### Run Specific Tests:

```bash
yarn test:selector    # Selector agent routing tests
yarn test:chunking    # Text chunking tests
```

### Test Setup:

-   Jest configured for TypeScript
-   Environment variables loaded from `.env` or `.env.local`
-   Tests call API handlers directly (no server needed)
-   ~15 second runtime for selector tests

---

## Quick Start

### For Instructors (Complete Code):

```bash
git checkout curriculum
yarn install
yarn dev
yarn test:selector  # Verify everything works
```

### For Students (Learning Exercises):

```bash
git checkout student-todo-exercises
yarn install

# Work through curriculum modules in order
# Implement TODOs in:
# - app/agents/linkedin.ts
# - app/agents/rag.ts
# - app/api/select-agent/route.ts

# Test your implementations:
yarn test:selector
```

---

## Environment Variables Needed

Create `.env` or `.env.local`:

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:...  # Optional

# Pinecone
PINECONE_API_KEY=...
PINECONE_INDEX=your-index-name

# LangSmith (Observability)
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_pt_...
LANGSMITH_PROJECT="your-project-name"
```

---

## Branch Workflow

### For Instructors:

1. Keep `curriculum` as the source of truth
2. Direct students to `student-todo-exercises` for hands-on learning
3. Show working examples from `curriculum` branch when students need help
4. Update both branches when curriculum changes

### For Students:

1. Work in `student-todo-exercises` branch
2. Follow curriculum modules in order
3. Implement features with TODO guidance
4. Ask instructors or attend office hours when stuck (working code shown selectively)
