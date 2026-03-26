Use yarn as package manager.

# Branch Structure

This repository uses the following branches:

## `student-working-version` (This Branch - Source of Truth)

### Purpose:

- **Complete working solutions** used in video demos
- Reference implementation for students when stuck
- All TODOs filled in with working code
- Ready to run and test

### Key Files with Solutions:

- `app/agents/linkedin.ts` - Complete LinkedIn agent implementation
- `app/agents/rag.ts` - Complete RAG agent with reranking
- `app/api/select-agent/route.ts` - Complete selector with structured outputs
- `app/api/upload-document/route.ts` - Complete document upload pipeline
- `app/libs/chunking.ts` - Complete chunking implementation

### Use This Branch:

- As reference when students get stuck
- For video demos and live coding
- To verify expected behavior
- To test the complete system

---

## `student-starter` (Exercise Branch)

Code with implementations removed and TODOs for students to complete.

### Purpose:

- Hands-on learning exercises
- Step-by-step guidance via TODO comments
- Students implement features themselves

### Use This Branch:

- For students to work through exercises
- Students can compare their work to `student-working-version`

---

## `curriculum`

Contains curriculum materials (lessons, slides, etc.) but NOT the working solution code.

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

---

## Quick Start

```bash
yarn install
yarn dev
yarn test  # Verify everything works
```

---

## Environment Variables Needed

Create `.env` or `.env.local`:

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:...  # After fine-tuning

# Pinecone
PINECONE_API_KEY=...
PINECONE_INDEX=rag-tutorial

# LangSmith (Observability)
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_pt_...
```

---

## Branch Workflow

### For Instructors:

1. Keep `student-working-version` as the reference (this branch)
2. Direct students to `student-starter` for exercises
3. Use this branch for all video demos

### For Students:

1. Start with `student-starter`
2. Follow README exercises in order
3. Reference `student-working-version` when stuck
