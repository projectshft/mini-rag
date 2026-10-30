# Docs Q&A

This repo is for the Intro to Agentic Engineering course from Parsity. You will
work on it with a coding agent (Claude Code, Codex, or Cursor) across the labs.

Docs Q&A is a small Next.js app. You ask a question about a few documents and
it answers using only the parts of those documents that match your question.

How it works:

1. The documents are split into overlapping chunks (`lib/chunking.ts`).
2. Each chunk gets a score based on how many of the question's keywords it
   contains (`lib/retrieve.ts`). There is no vector database and no embeddings.
3. The top chunks and the question go to the model (`lib/llm.ts`).
4. The API route (`app/api/ask/route.ts`) returns `{ answer, sources }` and the
   page (`app/page.tsx`) shows both.

If you leave the document box empty, the app uses the sample docs in `data/`.
They describe a made-up note-taking app called Northwind Notes.

## Prerequisites

- Node 20 or newer (`node -v` to check)
- npm (comes with Node)
- Git
- An API key and base URL from the course page

## Setup

```bash
git clone <repo-url> agentic-engineering-starter
cd agentic-engineering-starter
npm install
cp .env.example .env.local
```

Open `.env.local` and fill it in with the values from the course page:

```
OPENAI_API_KEY=your-class-key
OPENAI_BASE_URL=the-class-base-url
MODEL=gpt-4o-mini
```

Then start the app:

```bash
npm run dev
```

Open http://localhost:3000 and ask something like "How long is the refund
window?" or "What happens when I go over the API rate limit?"

`.env.local` is ignored by git. Do not commit your key.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm test` | Run the unit tests (Jest) |
| `npm run typecheck` | Type check with `tsc --noEmit` |

## Project layout

```
app/
  api/ask/route.ts   API route: chunk, retrieve, ask the model
  layout.tsx
  page.tsx           The UI
  globals.css
lib/
  chunking.ts        Split text into overlapping chunks
  retrieve.ts        Keyword-overlap scoring
  llm.ts             OpenAI SDK client and prompt
  docs.ts            Load the sample docs from data/
  *.test.ts          Unit tests, next to the code they test
data/                Sample markdown docs
```

## Troubleshooting

- "OPENAI_API_KEY is not set": you have not created `.env.local`, or you need
  to restart `npm run dev` after editing it.
- 401 errors: check that the key and base URL match the course page exactly.
