# Repo guide (branch: `student-working-version`)

Package manager: **yarn**.

This branch is the **completed reference implementation** of the RAG chat app.
Every TODO is filled in. Use it for video demos, live coding, and as the answer
key when a student is stuck. Students do not start here.

## Branches that matter

| Branch | What it is |
| --- | --- |
| `student-working-version` | **This branch.** Complete RAG app, all TODOs implemented. Also holds the MCP server reference (`app/mcp/server.ts`) and the LLM-as-judge test. |
| `student-todo-exercises` | The same app with implementations stripped out and TODOs left behind. What students clone. |
| `lms` | The course platform: `/learn` and `/admin`, Clerk auth, Neon progress DB, and the curriculum markdown. No RAG chat app there. **Also the branch Vercel deploys** — a push there is live immediately, with no promote or merge step. |
| `main` | **Don't work from it — but it is no longer the stale July-2026 stub older notes describe.** It has since been fast-forwarded from `lms` and now carries the full course platform. It is not what Vercel deploys and not what students clone, so ignore it and use the branches above. |

Everything else on origin (`cohort-*`, `solution*`, `curriculum`, `music-rag`,
`langgraph`, `working_version`, `claude/*`, `cursor/*`) is historical. Ignore it
unless you were sent there by name.

Older docs referenced a `student-starter` branch. It does not exist.

## Layout

- `app/agents/` — the agents themselves. `linkedin.ts` (fine-tuned model), `rag.ts` (retrieval plus reranking), `registry.ts`, `config.ts`, `types.ts`.
- `app/api/` — `chat`, `select-agent` (router, structured outputs), `upload-document`, `upload-text`, `linkedin`, `rag-test`, `tool-calling-agent`.
- `app/libs/` — `chunking.ts`, `pinecone.ts`, `dataProcessor.ts`, `openai/openai.ts`, `scrapers/`.
- `app/mcp/server.ts` — MCP server reference implementation.
- `app/scripts/` — scraping, fine-tuning data prep, cost estimation, and `exercises/` (the vector-math exercises students run first).
- `STUDENT_EXERCISES.md` — the exercise list this branch answers.

## Commands

```bash
yarn install
yarn dev
yarn test            # jest, everything
yarn test:selector   # agent routing
yarn test:chunking   # chunking
yarn test:judge      # LLM-as-judge response quality
```

Scripts run through ts-node, not tsx:

```bash
npx ts-node app/scripts/scrapeAndVectorizeContent.ts
yarn exercise:word-math
yarn estimate-costs
yarn train
```

## Environment

Create `.env` or `.env.local`:

```bash
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=...                                    # set if using a class key
PINECONE_API_KEY=...
PINECONE_INDEX=rag-tutorial                            # 512 dims, cosine
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_pt_...
```

## Gotchas

- Observability here is **LangSmith**, not Helicone. Helicone was removed. Stray Helicone mentions in comments are vestigial.
- The Pinecone index must be 512 dimensions with cosine metric, matching the embedding call in `app/libs/pinecone.ts`.
- **Import `openaiProvider` from `app/libs/openai/openai.ts`**, never `{ openai }` from `@ai-sdk/openai`. The bare import is hardcoded to api.openai.com, silently bypasses the class LiteLLM proxy, and 401s on a student key.
- Changes that students are meant to implement belong on `student-todo-exercises` as TODOs too. The two branches drift easily, so touch both when you change an exercise's shape.
