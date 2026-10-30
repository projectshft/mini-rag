# Course Site Setup & Deploy (`/learn` + `/admin`)

The course site lives in this repo's Next.js app. It renders the day-by-day
lessons in `curriculum/day-NN.md`. This doc is instructor-facing.

> **Deploys come off `lms`.** The Vercel project is
> `brianjenneys-projects/mini-rag`, Git-connected to `projectshft/mini-rag`
> with production branch **`lms`**, so a push to `lms` goes live on its own.
> Until 2026-10-30 the project had no Git connection at all, so nothing
> pushed between late September and then reached production. If a push
> doesn't show up, check the commit has a Vercel status on GitHub. There is no
> promote or merge step, and nothing needs to reach `main` for a change to
> ship. `main` still exists and now carries the full LMS (it trails `lms` by
> a commit or two), but it is **not** the deploy branch — don't merge into it
> expecting that to publish anything.

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

For self-serve purchases (see "Track access & self-serve purchase" below):
```
STRIPE_SECRET_KEY=rk_live_...                      # restricted key: Checkout Sessions → Read, nothing else
AGENTIC_PAYMENT_LINK_ID=plink_1UW4riFr3Atv9Fpa1T71ZGEW  # only this Payment Link can claim
AGENTIC_CREDIT_USD=5                               # optional, default 5
```

## Run locally
```
yarn install           # postinstall generates the LMS Prisma client
yarn lms:push          # create LMS tables (first time)
yarn dev
```
- `/learn` → redirects to Clerk sign-in if not authenticated.
- Sign in with an `LMS_ADMIN_EMAILS` address → `/admin` to invite students.

## Deploy (Vercel, `lms`)
- Connect the repo, production branch = **`lms`**. Pushing to `lms` is the
  deploy — there is no separate promote step.
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

## Track access & self-serve purchase
- **Entitlements** live in Clerk `publicMetadata.tracks` (track slugs, e.g.
  `["intro-to-agentic-engineering"]`). No `tracks` key = full access to every
  track (all existing students). With `tracks`, `/learn` only lists those
  tracks, other tracks' days 404, and bonus/interview lessons are hidden.
  Edit it on the user in the Clerk dashboard to grant or remove a track.
- **Purchase**: the Stripe Payment Link
  (https://buy.stripe.com/eVq9ATgrv0Mkbd75Lx4wM0y) redirects to
  `/claim?session_id={CHECKOUT_SESSION_ID}` (public route). `/claim` looks up
  the session with `STRIPE_SECRET_KEY`, requires `payment_status = paid` and
  `payment_link = AGENTIC_PAYMENT_LINK_ID`, then sends a Clerk invite to the
  checkout email with `tracks: ["intro-to-agentic-engineering"]`,
  `creditUsd`, `source: "agentic-47"`. Reloading is safe: a pending invite
  shows "check your inbox", an existing account shows "sign in". An existing
  track-restricted user gets the track appended; full-access users are never
  touched. No webhook — if a buyer closes the tab before the redirect, invite
  them from `/admin` and set their `tracks` in Clerk by hand.
- **Credit key**: on a restricted buyer's first `/learn` visit (LiteLLM
  configured, no key yet) a key with budget `creditUsd` is minted and shown
  on `/learn` with the proxy URL. Clerk `privateMetadata.creditKeyMintedAt`
  records it, so revoking the key in `/admin` does not trigger a re-mint.
  Full-access students never see a key on `/learn`.

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
