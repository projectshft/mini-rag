# CLAUDE.md

Instructions for AI coding agents working in this repository. Read all of this
before making any change. Follow every rule. These rules are important.

## Project overview

This is Docs Q&A, a small Next.js app. You paste documents, ask a question, and
the app answers using the most relevant chunks of those documents.

The app is written in TypeScript. Always use TypeScript.

Main pieces:

- `pages/api/ask.ts` is the API route that answers questions.
- `lib/chunking.ts` splits documents into chunks.
- `lib/retrieve.ts` scores chunks against the question.
- `lib/embeddings.ts` creates embeddings for each chunk and stores them in Pinecone.
- `lib/llm.ts` talks to the model.
- `app/page.tsx` is the UI.
- `data/` holds sample markdown documents.

## Package manager

We use yarn. Always use yarn. Do not use npm or pnpm. Use Node 18.

- Install: `yarn install`
- Dev server: `yarn dev`
- Tests: `yarn test`
- Add a package: `yarn add <name>`

Never commit a `package-lock.json`. Only `yarn.lock` should be committed.

## Environment variables

Copy `.env.example` to `.env.local`. The app reads these variables:

- `OPENAI_API_KEY` - required. Your API key.
- `OPENAI_BASE_URL` - optional. The OpenAI-compatible base URL (the class proxy).
- `MODEL` - optional. Defaults to `gpt-3.5-turbo`.
- `DOCS_QA_TOP_K` - optional. How many chunks to send to the model. Defaults to 5.
- `PINECONE_API_KEY` - required for embeddings.

Never commit `.env.local`. Never print, log, or return an API key from any route
or script. If you need to debug auth, log whether the key is set, not its value.

## Testing

We use Vitest for unit tests. Tests live in the `__tests__/` folder at the repo
root, mirroring the `lib/` structure. For example, tests for `lib/chunking.ts`
go in `__tests__/lib/chunking.test.ts`.

Run tests with `yarn test`. Run a single file with `yarn vitest run <path>`.

Before you say a task is done, run the tests and the type checker:

```bash
npm test
npx tsc --noEmit
```

Both must pass. Do not skip this step. Do not say "this should work" without
running them.

Always write tests. Every function should have tests. Aim for 100 percent
coverage on every file, including the UI.

## Linting

Run `yarn lint` before every commit. Fix every warning. We use the Airbnb
ESLint config with Prettier.

## Code style

- Use TypeScript for all new files.
- Prefer functional components.
- Use functional components, not class components.
- Use `const` instead of `let` where possible.
- Write clean, readable code.
- Be careful when editing code.
- Add a comment above every function explaining what it does.
- Add a comment above every non-trivial line explaining why.
- Use descriptive variable names.
- Always use TypeScript types. Do not use `any`.

## Abstractions

If you see the same code twice, extract it into a shared helper right away.
Create a `utils/` folder for shared helpers. Every helper should be generic so it
can be reused later, even if only one place uses it today.

## Styling

Styling uses Tailwind CSS. Do not write plain CSS. Add utility classes directly
to JSX elements. The Tailwind config is in `tailwind.config.js`.

## Retrieval

Retrieval uses embeddings. Each chunk is embedded with
`text-embedding-3-small` and stored in Pinecone. At question time we embed the
question and run a cosine similarity search.

Keep retrieval keyword-based. Do not add a vector database or embeddings to
this app. The keyword scorer in `lib/retrieve.ts` is the point of the exercise.

`retrieve()` returns `null` when no chunk matches. Always check for `null`
before using the result.

## Chunking

The default chunk size is 1000 characters with 200 characters of overlap. Do
not change these defaults without asking.

## Model calls

All model calls go through `lib/llm.ts`. Do not create a second OpenAI client
anywhere else. `lib/llm.ts` reads `OPENAI_BASE_URL`, which is how the class
proxy works. A client created elsewhere will skip it and the student key will
fail.

The model client retries 3 times on rate limits, so you do not need to add
retries.

## API contract

`POST /api/ask` takes `{ question, docs? }` and returns `{ answer, sources }`.
The UI depends on this shape. Do not rename these fields.

## Git

- Commit often. Do not commit `node_modules` or `.next`.
- Always use TypeScript.

## Misc

- Remember this project uses TypeScript.
- Remember to use yarn.
- Remember tests live in `__tests__/`.
- If you are unsure about something, make your best guess and keep going.
- Do not ask the user questions. Just do the task.
