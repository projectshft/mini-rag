Use yarn as package manager.

# Branch Structure

This repository has two main student-facing branches:

## `student-starter`

### Purpose:

-   Reference implementation for students
-   All TODOs removed
-   Clean, well-structured code
-   Ready to run and test

### Key Files:

-   `app/agents/linkedin.ts` - Complete LinkedIn agent implementation
-   `app/agents/rag.ts` - Complete RAG agent with reranking
-   `app/api/select-agent/route.ts` - Complete selector with structured outputs
-   `app/agents/__tests__/selector.test.ts` - Full test suite

### Use This Branch:

-   As reference when students get stuck
-   For demos and live coding
-   To verify expected behavior
-   To test the complete system

---

## `student-todo-exercises` (Exercise Branch)

Code with implementations removed and detailed TODOs for students to complete.

### Purpose:

-   Hands-on learning exercises
-   Step-by-step guidance via TODO comments
-   Students implement features themselves
-   Follows curriculum modules in `curriculum/`

### Key Files:

-   Same files as student-starter, but with:
    -   Implementations removed
    -   Detailed TODO comments with step-by-step instructions
    -   `throw new Error()` placeholders
    -   All imports and types intact

### Use This Branch:

-   For students to work through exercises
-   Pair with curriculum in `curriculum/`
-   Students can compare their work to `student-starter`

---

## Curriculum Structure

The curriculum is organized in `curriculum/`:

1. **Vector Math Basics** (`2-vector-math-basics/`)
2. **Pinecone Integration** (`4-pinecone-integration/`)
3. **Chunking Fundamentals** (`4.5-chunking-fundamentals/`)
4. **Document Upload** (`5-document-upload/`)
5. **Fine-tuning** (`5-fine-tuning/`)
6. **Agent Architecture** (`7-agent-architecture/`)
    - Understanding agents
    - Prompting strategies
    - Text-based selector
    - Structured outputs
7. **LinkedIn Agent** (`8-linkedin-agent/`)
8. **RAG Agent** (`9-rag-agent/`)
    - Basic implementation
    - Reranking
    - Sparse and dense vectors
9. **Chat Interface** (`11-chat-interface/`)
10. **Observability** (`12-observability/`)
11. **Testing Agents** (`13-testing-agents/`)
12. **Capstone Project** (`14-capstone-project/`)

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

### Student-Starter (Complete Code):

```bash
git checkout student-starter
yarn install
yarn dev
yarn test:selector  # Verify everything works
```

### Student-Todo-Exercises (For Learning):

```bash
git checkout student-todo-exercises
yarn install

# Work through curriculum modules
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

1. Keep `student-starter` as the reference
2. Direct students to `student-todo-exercises` for exercises
3. Update both branches when curriculum changes

### For Students:

1. Start with `student-todo-exercises`
2. Follow curriculum in order
3. Compare work to `student-starter` when needed
4. Switch to `student-starter` to see complete implementation
