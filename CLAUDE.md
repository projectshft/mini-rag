# Repo guide (branch: `lms`)

Package manager: **yarn**.

This branch is the **course platform** — the private site at `/learn` and
`/admin` that serves the day-by-day curriculum. The RAG chat demo no longer
runs here (`middleware.ts` locks everything behind Clerk and the demo route is
gone); students get that from the `student-*` branches below.

## Branches that matter

| Branch | What it is |
| --- | --- |
| `lms` | **This branch.** Course platform + the curriculum markdown. Where course work happens. |
| `student-working-version` | Complete RAG app. Reference solution for demos and stuck students. Also holds the MCP server reference (`app/mcp`). |
| `student-todo-exercises` | Same RAG app with implementations stripped out and TODOs left behind. What students clone. |
| `main` | **Stale, do not branch from it.** Last touched July 2026. It holds an old TODO-stub copy of the RAG app and **none** of the LMS: no `curriculum/`, `app/learn/`, `app/admin/`, `lib/lms/`, `prisma/`, or `middleware.ts`. `docs/LMS-SETUP.md` still calls it the deploy branch, which does not match what is on it. See the warning in that doc. |

Everything else on origin (`cohort-*`, `solution*`, `curriculum`, `music-rag`,
`langgraph`, `working_version`, `claude/*`, `cursor/*`) is historical. Ignore it
unless you were sent there by name.

Older docs referenced a `student-starter` branch. It does not exist.

## Layout on this branch

**Course platform**

- `app/learn`, `app/learn/[slug]` — lesson pages, gated by Clerk.
- `app/admin` — instructor console: invites, progress, interview unlock, minting student API keys.
- `app/challenge/[token]`, `challenge/` — public-but-unlisted build challenge, access is an unguessable URL token.
- `app/ai-interview-quiz`, `app/api/quiz-lead` — public lead-capture quiz.
- `lib/lms/` — `curriculum.ts` (markdown parsing), `progress.ts`, `admin.ts`, `litellm.ts`, `prisma.ts`, `challenge.ts`.
- `components/lms/` — interactive lesson blocks (`Quiz`, `FillBlanks`, `OrderSteps`, `TryIt`, `Mermaid`, …).
- `prisma/lms/schema.prisma` — student progress only. Separate Neon project.
- `curriculum/day-NN.md` — lesson content. `curriculum/README.md`'s "## Week index" is the canonical ordering. `curriculum/AUTHORING.md` documents the block formats.
- `middleware.ts` — the public-route allowlist. Everything not listed there requires sign-in.

**RAG app (stubs, not a running app)**

This branch carries a copy of the RAG app, but the agents are TODO stubs that
throw. It is not the answer key and not meant to run here. Use
`student-todo-exercises` for the exercises and `student-working-version` for
the solutions.

- `app/agents/` — `linkedin.ts`, `rag.ts`, `registry.ts`, `config.ts`.
- `app/libs/` — `chunking.ts`, `pinecone.ts`, `dataProcessor.ts`, `openai/openai.ts`, `scrapers/`.
- `app/api/` — `chat`, `select-agent`, `upload-document`, `upload-text`, `linkedin`, `rag-test`.
- `app/scripts/` — scraping, fine-tuning data prep, and the `exercises/` students run.

Note that `yarn test` on this branch runs the RAG app's jest suite against
those stubs. The selector and vector-similarity suites fail here by design.
Only the chunking suite passes.

## Commands

```bash
yarn install            # postinstall generates the LMS Prisma client
yarn lms:push           # create/update LMS tables (first run)
yarn dev
yarn test               # jest
yarn test:selector      # agent routing
yarn test:chunking      # chunking
yarn check:curriculum   # validate curriculum files against the week index
```

## Setup

`.env.example` is annotated and accurate. `docs/LMS-SETUP.md` is the real setup
and deploy guide: Neon, Clerk, env vars, Vercel, and how lessons, progress,
invites, and student API keys map to each other. Read it before touching LMS
infrastructure.

## Gotchas

- **Import `openaiProvider` from `app/libs/openai/openai.ts`**, never `{ openai }` from `@ai-sdk/openai`. The bare import is hardcoded to api.openai.com, silently bypasses the class LiteLLM proxy, and 401s on a student key.
- **Never run `prisma db push --force-reset`** against `prisma/lms/schema.prisma`. It holds student progress.
- Progress is keyed by day slug, so renaming a `day-NN.md` file orphans it. Editing content is safe.
- The Helicone comment block in `app/libs/openai/openai.ts` is vestigial. Nothing on this branch sends telemetry anywhere. LangSmith is wired up on `student-working-version` only.
