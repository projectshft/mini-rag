# Course Site Setup & Deploy (`/learn` + `/admin`)

The course site lives in this repo's Next.js app and deploys from **`main`**.
It renders the day-by-day lessons in `curriculum/day-NN.md` — edit a day
file, push to `main`, and the site updates on the next Vercel deploy.
This doc is instructor-facing.

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
- Assignments: Typeform links stay inline in the day files (no in-app
  submission in this version). Feedback happens in Slack.
- Interview prep (`curriculum/interview-NN.md`): gated per student.
  Locked by default; unlock each student with the 🎤 toggle in `/admin`
  near the end of the program. State lives in
  `Student.interviewUnlockedAt` (null = locked).

## Editing the curriculum
- One file per study day: `curriculum/day-NN.md` (see `curriculum/AUTHORING.md`
  for the format and the `quiz` / `visual` / `ai-prompt` / `reveal` blocks).
- Reorder / add / remove days by editing the "## Week index" in
  `curriculum/README.md`.
- Progress is keyed by day slug, so editing content never disturbs
  student progress; renaming a file does (avoid renames after launch).

## ⚠️ Branch discipline
`main` carries the LMS + curriculum. The **`student-todo-exercises`**
branch is what students clone — it must **never** receive any of:
`curriculum/`, `app/learn/`, `app/admin/`, `components/lms/`, `lib/lms/`,
`prisma/lms/`, `middleware.ts`, or the Clerk/LMS deps. Syncs to the
student branch are path-scoped (never a full merge).
