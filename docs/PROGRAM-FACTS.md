# Program facts

This file is the source of truth for anything a Parsity page, email or lesson
says about the core program. If you are an agent writing website copy, read
this first and copy the facts from here. If a fact is missing, ask. Do not
guess.

The curriculum itself lives next to this file: `curriculum/README.md` has the
lesson order under "## Week index", and the lessons for this program are the
`curriculum/swe-*.md` files.

Last updated 2026-11-19.

## The program

| Fact | Value |
| --- | --- |
| Name | Parsity core program (the Software Engineering track on the LMS) |
| Where it runs | ai.parsity.io |
| Price | $4,900. Whether it is shown on public pages is still to confirm with Brian (the live pages show it) |
| Financing | $0 down with Climb Credit |
| Length | As little as 12 weeks, or as long as a year. Support for up to 12 months. Never say "6 months" |
| Start date | Any time. No cohorts |
| Mentor sessions | Up to 12 one-on-one sessions with a working software engineer |
| Career help | Career support and mock interviews. There is no career coach |
| Live time | Weekly office hours and a monthly guest speaker |
| Student costs | About $20 a month for a coding agent. Claude is recommended and any tool is allowed. $10 of API credit is included |
| Languages | JavaScript and TypeScript for the projects. Interview problems in any language the student wants |
| How work is checked | Students submit a GitHub repo. Their own tests run, then hidden tests. A failed hidden test reports the kind of case, never the test |
| Explanation videos | Not weekly. A handful, only where explaining out loud really helps: the event loop, how a request reaches a server, a race condition, sessions versus tokens, a system design, and the capstone demo |
| Experience needed | None |

## Who it is for

People changing careers, CS students and grads, product managers, and people
already in tech. A product manager who has never used Git should be able to
start.

## The promise

The gap between what a CS degree teaches and how the work is done now. A
student learns how computers, networks and databases work, builds real
software with a coding agent and proves it works, makes design decisions and
defends them, and prepares for interviews as their own skill. The student is
not a vibe coder: they can read and judge what the agent wrote.

## What a student builds

1. By-hand toolkit: data structures written with no agent
2. HTTP from scratch: a web server built up from a raw network connection
3. One app three ways
4. Orders under load: two orders arriving at the same moment
5. Auth three ways, attacked by a test suite
6. Deploy it twice
7. Webhooks and queues: keeps working when the other side goes down
8. Capstone: a real or scraped data source, an agent, and one technology we did not teach

## The five phases

| Phase | What it covers |
| --- | --- |
| A. Foundations | Terminal, Git and GitHub, tests, basics by hand, working with an agent |
| B. The web | Networks, HTTP, servers, front ends |
| C. Data and trust | SQL and Postgres, auth, testing that proves something |
| D. Shipping and scale | Deploys, queues, system design |
| E. Capstone | The student's own project |

Interview problems, Git and GitHub, and LinkedIn run through all five. Do not
put week counts on a page. Students go at their own pace.

## Add-ons

| Add-on | Price | Notes |
| --- | --- | --- |
| Agentic engineering | $47 | Ten lessons, seven tickets and a capstone on the Driftwood codebase, plus a month of office hours. Sold on its own or with the core program |
| AI engineering (RAG) | Not set here | The existing track. Current students are enrolled in this one |

## Gone from the program

Do not mention any of these:

- Weather app
- Google Books bookshelf
- Full stack movie app
- Redux
- MongoDB
- jQuery
- A career coach

Towers of Hanoi stays, as one of the recursion interview problems.

## Wording rules

- Never call it a course. Say program, or say what the student builds.
- No buzzwords. Say "plan the feature first", never "spec" or "spec-driven development".
- No em dashes, no emojis, no hype.
- Never say how long a lesson or assignment takes.
- Do not promise "a fraction of the time".
- Do not promise a job.

## Pages that must match this file

| Page | Where it lives | State on 2026-11-19 |
| --- | --- | --- |
| parsity.io homepage | Kajabi site theme, section "Home: two offers" | Program card updated to 12 weeks, 12 sessions, $4,900 |
| parsity.io/Course | Kajabi site theme, section "Course: new program page (Nov 18)" | Mostly matches. Still says "specs" in the Build track, and says every project from the web phase on is explained on video |
| parsity.io/faqs | Kajabi site theme, FAQ section | Matches |
| parsity.io/syllabus | Kajabi | Out of date. Still shows the old curriculum |
| Syllabus email | Kajabi | Not checked |
| ai.parsity.io/agentic-engineering | This repo, `app/agentic-engineering/page.tsx` | Matches. Does not mention the cap of 10 a month |

## What's built

All five parts are written and on ai.parsity.io, in the Software Engineering
track: 79 lessons, eight projects plus three small clones (a URL shortener, a
rate limiter and a cache), and 22 interview problems. 42 assignments are
checked automatically against hidden tests. Design docs, memos, videos, live
deploys and the capstone are checked by the mentor.

Not built yet: an AI review of code and memos, and locking the next project
until the current one passes. Lessons say "do the projects in order" for now.
`curriculum/README.md` has the full lesson list.
