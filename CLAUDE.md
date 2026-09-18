# Repo guide (branch: `student-todo-exercises`)

Package manager: **yarn**.

This branch is the **student starting point**. The app does not work yet. Types
and imports are intact, implementations are replaced with TODO comments that
walk through what to build.

## Branches that matter

| Branch | What it is |
| --- | --- |
| `student-todo-exercises` | **This branch.** The exercises students clone and complete. |
| `student-working-version` | Complete RAG app, used for demos and when a student is stuck. See the drift warning below. |
| `lms` | The course platform: `/learn` and `/admin`, plus the current lessons in `curriculum/day-NN.md`. |
| `main` | **Stale, do not branch from it.** Last touched July 2026. An older TODO-stub copy of this branch, from before the few-shot rewrite, with none of the LMS code that `docs/LMS-SETUP.md` on `lms` claims it carries. |

Everything else on origin (`cohort-*`, `solution*`, `curriculum`, `music-rag`,
`langgraph`, `working_version`, `claude/*`, `cursor/*`) is historical. Ignore it
unless you were sent there by name.

Older docs referenced a `student-starter` branch. It does not exist.

Lessons are the day files on `lms`, ordered by the "## Week index" in
`curriculum/README.md` there. The numbered module folders (`0-how-to-learn/`,
`1-intro-to-rag/`, …) on the `curriculum` branch are the superseded format.

## Where the TODOs are

- `app/agents/linkedin.ts` — few-shot LinkedIn post generator.
- `app/agents/rag.ts` — retrieval plus reranking.
- `app/api/select-agent/route.ts` — the router, using structured outputs.
- `app/api/upload-document/route.ts` — the document upload pipeline.
- `app/libs/chunking.ts` — chunking, including `getLastWords()`.
- `app/scripts/exercises/` — the vector-math exercises students run first.

Supporting code that is already built: `app/libs/pinecone.ts`,
`app/libs/openai/openai.ts`, `app/libs/scrapers/`, `app/agents/registry.ts`,
`app/agents/config.ts`, `app/agents/types.ts`.

## Fine-tuning is gone (May 2026)

OpenAI closed fine-tuning access and the model this course used to ship with is
dead. The LinkedIn agent uses **few-shot prompting** instead.

- Example posts live in `app/agents/example-posts.ts`, with defaults drawn from `data/brian_posts.csv` (850+ real posts with engagement stats).
- Students pick their own examples from that CSV or from any creator whose style they like.
- `yarn train` is disabled and exits with an explanation. The fine-tuning scripts in `app/scripts/` remain as historical artifacts.

## Commands

```bash
yarn install
yarn dev
yarn test            # jest, everything
yarn test:selector   # agent routing, ~15s
yarn test:chunking   # chunking
yarn exercise:word-math
```

Tests call the API handlers directly, so no dev server is needed. Environment
variables load from `.env` or `.env.local`.

## Environment

```bash
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=your-index-name        # 512 dims, cosine
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_pt_...
LANGSMITH_PROJECT="your-project-name"
```

## Gotchas

- **Import `openaiProvider` from `app/libs/openai/openai.ts`**, never `{ openai }` from `@ai-sdk/openai`. The bare import is hardcoded to api.openai.com, bypasses the class LiteLLM proxy, and 401s on a student key.
- **Drift warning:** `student-working-version` still solves the LinkedIn agent with a fine-tuned model and the bare `@ai-sdk/openai` import. It has not caught up to the few-shot rewrite here, so it is not a line-for-line answer key for `app/agents/linkedin.ts`.
- When you change the shape of an exercise here, change the matching solution on `student-working-version` too. The two drift easily.
