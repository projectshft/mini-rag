# Course Site Setup & Deploy (`/learn` + `/admin`)

The course site lives in this repo's Next.js app. It renders the day-by-day
lessons in `curriculum/day-NN.md`. This doc is instructor-facing.

> ⚠️ **The deploy branch below is out of date.** As of September 2026 the
> course site lives on **`lms`**, not `main`. `origin/main` was last touched
> in July 2026 and contains none of it: no `curriculum/`, `app/learn/`,
> `app/admin/`, `components/lms/`, `lib/lms/`, `prisma/`, or `middleware.ts`.
> `main` is an ancestor of `lms`, so `lms` merges into it as a fast-forward.
> Confirm the Vercel production branch before trusting anything below that
> names `main`. If Vercel still builds `main`, nothing you push to `lms`
> reaches the site until that merge happens.

## What you provision (one-time)

### 1. A Neon database for the LMS
Holds student progress (`students`, `lesson_progress`). Nothing the
students' own projects touch.
- Create a Neon project → copy the **pooled** connection string → that
  is `LMS_DATABASE_URL`.
- Create the tables: `yarn lms:push` (targets `prisma/lms/schema.prisma`).
- **Never** run `--force-reset` against this schema — it holds progress.

### 2. A Clerk application
- Create an app at https://dashboard.clerk.com.
- Enable **Email** sign-in with a **verification code / magic link**.
- Set sign-up to **Restricted** (invite-only) so only invited emails join.
- Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.

### 3. Env vars (`.env` locally, Vercel project settings in prod)
```
LMS_DATABASE_URL=postgresql://...          # the Neon LMS DB, pooled
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
LMS_ADMIN_EMAILS=brian@parsity.io          # comma-separated allowlist
NEXT_PUBLIC_APP_URL=https://your-domain    # used for invite redirects
```
Keep the existing OpenAI/Pinecone vars too (the chat app shares the deploy).

## Run locally
```
yarn install           # postinstall generates the LMS Prisma client
yarn lms:push          # create LMS tables (first time)
yarn dev
```
- `/learn` → redirects to Clerk sign-in if not authenticated.
- Sign in with an `LMS_ADMIN_EMAILS` address → `/admin` to invite students.

## Deploy (Vercel, `main`)
- Connect the repo, production branch = `main`.
- Set all env vars above (Clerk **production** keys + a configured
  production instance domain).
- Build runs `postinstall` (generates the LMS Prisma client) then `next build`.
- Curriculum markdown ships in the bundle via `outputFileTracingIncludes`
  in `next.config.ts`.

## How the pieces map
- Identity / invites / bans: **Clerk** (revoke = ban → session killed).
- Student progress: the **LMS Neon DB** (`Student`, `LessonProgress`).
- Lesson content: the **markdown files** (`lib/lms/curriculum.ts` parses
  them; `curriculum/README.md`'s "## Week index" is the canonical order;
  `AUTHORING.md` documents the format and the interactive blocks).
- Assignments: submitted by posting video + code in the Slack channel
  **#all-parsity-dev-accelerator** (no in-app submission, no forms).
  Feedback happens in the same channel.
- Interview prep (`curriculum/interview-NN.md`): gated per student.
  Locked by default; unlock each student with the 🎤 toggle in `/admin`
  near the end of the program. State lives in
  `Student.interviewUnlockedAt` (null = locked).
- Student API keys: `/admin` mints budget-capped keys ($10 / 60 days by
  default) against the class **LiteLLM proxy** — the same proxy the
  medical-rag course runs (`infra/litellm/` in that repo, live at
  parsity-litellm.fly.dev). Set `LITELLM_PROXY_URL` +
  `LITELLM_MASTER_KEY` (optional: `LITELLM_KEY_BUDGET_USD`,
  `LITELLM_KEY_DURATION_DAYS`). Per student you can: **Mint** (one key
  each), **✉️ Send** (opens a prefilled email in your mail client),
  **+$** (raises the ceiling, spend preserved), **Revoke** (kills the
  key on the proxy immediately). Live spend shows in the table. Keys
  only work through the proxy, so a leaked key without the base URL is
  useless, and the budget cap bounds the blast radius either way.

## Editing the curriculum
- One file per study day: `curriculum/day-NN.md` (see `curriculum/AUTHORING.md`
  for the format and the `quiz` / `visual` / `ai-prompt` / `reveal` blocks).
- Reorder / add / remove days by editing the "## Week index" in
  `curriculum/README.md`.
- Progress is keyed by day slug, so editing content never disturbs
  student progress; renaming a file does (avoid renames after launch).

## ⚠️ Branch discipline
`lms` carries the LMS + curriculum (`main` does not yet — see the warning at
the top). The **`student-todo-exercises`**
branch is what students clone — it must **never** receive any of:
`curriculum/`, `app/learn/`, `app/admin/`, `components/lms/`, `lib/lms/`,
`prisma/lms/`, `middleware.ts`, or the Clerk/LMS deps. Syncs to the
student branch are path-scoped (never a full merge).
