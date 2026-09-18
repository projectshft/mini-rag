# Parsity AI course platform

The private course site: day-by-day lessons at `/learn`, instructor console at
`/admin`. Next.js, Clerk for auth, Neon + Prisma for student progress, lesson
content in `curriculum/day-NN.md`.

The RAG chat app the course builds is **not** on this branch. It lives on
`student-todo-exercises` (student starting point) and `student-working-version`
(complete solution).

## Quick start

```bash
yarn install     # postinstall generates the LMS Prisma client
yarn lms:push    # create the LMS tables, first run only
yarn dev
```

Copy `.env.example` to `.env` and fill it in. `/learn` redirects to sign-in;
sign in with an address in `LMS_ADMIN_EMAILS` to reach `/admin`.

## Docs

| File | What's in it |
| --- | --- |
| `CLAUDE.md` | Repo map, branch table, layout, commands, gotchas. Start here. |
| `docs/LMS-SETUP.md` | Provisioning Neon and Clerk, env vars, Vercel deploy, how the pieces map. |
| `curriculum/AUTHORING.md` | Lesson file format and the interactive blocks. |
| `curriculum/README.md` | The canonical week index. Lesson ordering comes from here. |
| `docs/INSTRUCTOR-TODOS.md` | Open instructor-side work. |
| `docs/RAG-MVP-DESIGN-DOC.md` | Design notes for the RAG app the course builds. |

## Editing lessons

One file per study day in `curriculum/`. Add, remove, or reorder days by
editing the "## Week index" in `curriculum/README.md`, then run
`yarn check:curriculum`. Progress is keyed by day slug, so renaming a file
orphans student progress for that day.
