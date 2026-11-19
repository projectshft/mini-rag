# Software Engineering track: build plan

The working plan for finishing the core program on the LMS. `docs/PROGRAM-FACTS.md`
holds the facts that marketing copies. This file holds how the curriculum is built:
every lesson still to write, who owns it, and the rules every lesson follows.

## Who it's for, and the bar

A complete beginner, career changer or product manager, who ends the program able
to get hired as a software engineer who works with coding agents. "World class"
here means:

- Every concept is explained from zero, with a "Words you need first" list.
- Every lesson makes the student do something, and most hand something in.
- Projects are hard because of open decisions and hidden tests, not because of size.
- The student can explain every choice: each project ends with a decision memo.
- Big-picture thinking runs all the way through: tradeoffs, cost, what breaks at
  100 times the traffic, and how to reason about a system they didn't build.

## Rules every lesson follows

Read `curriculum/AUTHORING.md` first. It defines the file format and every block
(quiz, blanks, match, order, scenario, mermaid, visual, try-it, ai-prompt, submit).

Copy the voice and shape of the finished lessons. The best models are
`curriculum/swe-basics-speed.md`, `curriculum/swe-basics-waiting.md`,
`curriculum/swe-toolkit-structures.md` and `curriculum/swe-toolkit-runner.md`.

Each lesson has, in this order:

1. `# Title` then a `> **In this lesson:** ...` line.
2. `## Words you need first`: three to five plain definitions.
3. Teaching sections with short code examples and at least one interactive block
   (blanks, match, order or scenario) besides the quiz.
4. The lab or project work, with exact commands.
5. A `submit` block when something is handed in.
6. A `quiz` block with three questions. Wrong options must be plausible. Each
   `explain` says why the right answer is right.
7. `## Key takeaways`: four to six bullets.
8. `## Work with AI`: one `ai-prompt` that makes the student think, never one that
   does their work.

Voice and wording:

- Plain words, short sentences, second person. Explain every term the first time.
- No em dashes. No emojis. No hype. No "not X, it's Y" constructions.
- Never call it a course. Say program, project or lesson.
- No buzzwords: say "plan the feature first", never "spec" or "spec-driven".
- Never say how long a lesson or task takes. Time-boxes are fine and encouraged:
  "if you're stuck for more than 30 minutes, ...".
- No links to other lessons and no "Day N" or "Lesson N" references. Say "the
  lesson on hash maps" or "in the toolkit project". `yarn check:curriculum` checks.
- Never rename a lesson file once it's in the index.

Code and tools:

- JavaScript (CommonJS, `require`) through project 2. TypeScript is introduced in
  the front-end lessons and is fine from project 3 on. Node 22.
- Tests use `node:test` and `node:assert` unless a lesson says otherwise.
- Students have a coding agent from the agent basics lessons on (Claude Code is
  recommended, Codex CLI and Cursor are fine). Before that, no agent writes code.
- From project 2 on the agent writes most project code. The student plans the
  feature first, reviews every diff, and must be able to explain every line.
  Interview problems are always written by hand, in any language. Hidden tests
  run JavaScript, so the graded version of an interview problem is JavaScript.

## How work is handed in and checked

All by-hand labs and projects live in one repository per student, `parsity-labs`,
one folder per lab or project. A lesson gives a one-line download:

    curl -sL https://ai.parsity.io/labs/<name>.tar.gz | tar xz

- Starter files go in `public/labs/<name>/` in this repo. Run `yarn build:labs`
  after changing them. That rebuilds `public/labs/<name>.tar.gz`.
- Hidden tests go in the private grader repo, checked out at
  `/home/user/parsity-grader`, as `assignments/<assignment-id>/` with an
  `assignment.json` and a `hidden/` folder. Read its README.
- `"dir"` in `assignment.json` points at the folder inside `parsity-labs`, for
  example `"dir": "http-server"`. Milestones of one project share a folder and
  each has its own assignment id, such as `http-server-1` and `http-server-2`.
- If the folder has a `package-lock.json`, the grader runs `npm ci` first, so
  projects may use npm packages. Tests then run with no network.
- The grader has Node 22 and npm. It has no browser and no database server.
  For Postgres, use `@electric-sql/pglite` (real Postgres, in memory) in tests.
  For browser code, test with `jsdom` or test the logic outside the page.
  Things that truly can't be checked automatically (a live deploy, a video) are
  checked by the mentor, and the lesson says so plainly.
- Category names are the only thing a student sees when a hidden test fails.
  Write them as the kind of case: "Two orders for the last item at the same moment".

Every graded assignment needs three fixtures in the grader repo under
`test/fixtures/<assignment-id>/`: `good` (passes), `naive` (a plausible answer
that passes the visible tests but fails several hidden categories) and
`starter` (the untouched download, which fails). Each fixture holds the labs
folder at its real path, for example `test/fixtures/http-server-1/good/http-server/`.
Check each one:

    cd /home/user/parsity-grader
    node grade.mjs --repo-dir test/fixtures/<id>/<kind> --assignment <id> --sandbox none

Then add the id to the list in `test/run.mjs` and run `node test/run.mjs`.

## The remaining lessons

Slugs are file names in `curriculum/`. The order below is the order in the index.
Problem lessons (`swe-dsa-*`) are interleaved where they appear.

### Part 2: The web

| Slug | Covers | Hands in |
| --- | --- | --- |
| swe-agent-setup | Installing a coding agent, what it is, how it reads a repo, permissions, reading the commands it runs, cost and limits of a $20 plan | none |
| swe-agent-workflow | Plan the feature first, a branch per change, reading a diff, checking an agent's claims, committing, a first pull request on your own repo | a short practice change as a PR, mentor-checked |
| swe-net-journey | DNS, IP addresses, ports, TCP, what happens when you type a URL. Uses the `request-journey` visual | none |
| swe-net-http | HTTP requests and responses, methods, status codes, headers, bodies, TLS, CORS in brief, curl and DevTools | none |
| swe-dsa-frequency | Frequency counters, two problems | dsa-frequency |
| swe-http-server-1 | Project 2 milestone 1: a server on a raw TCP socket (`node:net`), parse a request, send a valid response | http-server-1 |
| swe-http-server-2 | Project 2 milestone 2: routing, static files, the right status codes, bad requests, many connections, the memo. This is "build your own web server", a clone of the core of Express | http-server-2 |
| swe-dsa-two-pointers | Two pointers, two problems | dsa-two-pointers |
| swe-browser | The DOM, events, how a page renders, storage, DevTools | none |
| swe-frontend-frameworks | Components, state, props, where rendering happens, React with Vite and Next.js, enough TypeScript to read it | none |
| swe-dsa-sliding-window | Sliding window | dsa-sliding-window |
| swe-taskboard-dom | Project 3 milestone 1: a task board against a provided API, in plain DOM code | taskboard-dom |
| swe-taskboard-react-1 | Project 3 milestone 2: the same board in React with Vite, components and state | taskboard-react |
| swe-taskboard-react-2 | Project 3 milestone 3: data fetching, loading and error states, a few small components written by hand | taskboard-react |
| swe-dsa-stack | Stack problems | dsa-stack |
| swe-taskboard-next | Project 3 milestone 4: the same board in Next.js, server and client rendering, the memo | taskboard-next |
| swe-dsa-recursion | Recursion, including Towers of Hanoi | dsa-recursion |

### Part 3: Data and trust

| Slug | Covers | Hands in |
| --- | --- | --- |
| swe-api-design | Designing an API: resources, routes, validation, errors, idempotency, pagination, rate limits. Uses the `api-request-lifecycle` visual | none |
| swe-orders-api | Project 4 milestone 1: an order and inventory API with no database | orders-1 |
| swe-sql | Tables, keys, SQL, joins, indexes. Uses the `sql-joins` visual | none |
| swe-orders-postgres | Project 4 milestone 2: Postgres tables, queries and migrations | orders-2 |
| swe-dsa-binary-search | Binary search | dsa-binary-search |
| swe-transactions | Transactions, isolation, race conditions, locking versus conditional updates | none |
| swe-orders-concurrency | Project 4 milestone 3: two orders for the last item at the same moment | orders-3 |
| swe-documents | Document stores, caching, when a table fits and when a document does | none |
| swe-orders-documents | Project 4 milestone 4: the same data as JSON documents, and the memo | orders-4 |
| swe-dsa-linked-lists | Linked lists | dsa-linked-lists |
| swe-git-teamwork | Merge conflicts, reviewing someone else's pull request, good review comments | a review, mentor-checked |
| swe-auth-concepts | Who you are versus what you may do, passwords and hashing, sessions versus tokens, OAuth, roles and tenants, common attacks. Uses the `sessions-vs-tokens` visual | none |
| swe-auth-sessions | Project 5 milestone 1: sessions, tenants and roles on the orders app | auth-1 |
| swe-auth-tokens | Project 5 milestone 2: tokens, and what changes | auth-2 |
| swe-auth-provider | Project 5 milestone 3: an off-the-shelf provider, learned from its docs alone, and the build-versus-buy memo | auth-3 or mentor-checked |
| swe-dsa-trees | Trees | dsa-trees |
| swe-testing-proof | Unit, integration and end-to-end tests, the testing pyramid, mutation testing. Uses the `mutation-testing` visual | a mutation-testing exercise |
| swe-career-linkedin | LinkedIn profile, a post per finished project | mentor checklist |
| swe-career-stories | Telling project stories as interview answers | mentor checklist |
| swe-dsa-intervals | Intervals | dsa-intervals |

### Part 4: Shipping and scale

| Slug | Covers | Hands in |
| --- | --- | --- |
| swe-shipping | Environments, config and secrets, CI/CD, containers, logs, cost, serverless versus a running server | none |
| swe-deploy-serverless | Project 6 milestone 1: deploy the app to Vercel, health checks, logs | deploy-1 plus mentor check |
| swe-deploy-container | Project 6 milestone 2: deploy to a container host, a rollback, a latency comparison, the memo | deploy-2 plus mentor check |
| swe-git-automation | Tests on every pull request, protecting main, undoing a bad change | a CI workflow in the repo |
| swe-dsa-backtracking | Backtracking | dsa-backtracking |
| swe-architecture | One app versus services versus serverless, queues, caching, consistency. Uses the `architecture-three-ways` visual | none |
| swe-system-design | How to think about a system: requirements, rough numbers, data model, API, components, bottlenecks, tradeoffs. The method used in every design lesson after it | none |
| swe-clone-url-shortener | Build a tiny URL shortener, then design it for 100 times the traffic | clone-url-shortener |
| swe-clone-rate-limiter | Build a rate limiter (token bucket and sliding window), then design it across many servers | clone-rate-limiter |
| swe-clone-cache | Build a tiny cache with expiry and least-recently-used eviction, like a small Redis, then design a cache in front of a database | clone-cache |
| swe-dsa-greedy | Greedy | dsa-greedy |
| swe-webhooks-queue | Project 7 milestone 1: a job queue with workers | webhooks-1 |
| swe-webhooks-retries | Project 7 milestone 2: retries with backoff, duplicate deliveries, idempotency | webhooks-2 |
| swe-webhooks-outages | Project 7 milestone 3: outages, bursts, rate limits on the other side, the memo | webhooks-3 |
| swe-dsa-graphs | Graphs | dsa-graphs |
| swe-design-practice | Design prompts with no build: a news feed, a notification system, the order system at 100 times the traffic | a written design, mentor-checked |
| swe-capstone-proposal | Choosing a capstone, the four requirements, writing the proposal | proposal, mentor-checked |
| swe-career-first-mock | What a mock interview is, how to prepare, what the mentor scores | mentor-run |

### Part 5: Capstone

| Slug | Covers | Hands in |
| --- | --- | --- |
| swe-model-basics | Calling a model from code with the student's class key, giving it a tool, checks that show it works | model-basics |
| swe-dsa-dynamic-programming | An easy dynamic programming problem | dsa-dynamic-programming |
| swe-capstone-design | The design doc | design doc, mentor-checked |
| swe-capstone-build | Building in milestones with an agent, tests the student writes | progress check-ins |
| swe-capstone-ship | Deploy, harden, the README a stranger can follow | mentor check |
| swe-capstone-demo | The live walkthrough and the recorded demo | mentor sign-off |
| swe-career-resume | A resume that sounds like an engineer | mentor checklist |
| swe-career-job-search | Where the jobs are, outreach people answer, referrals, tracking it all | mentor checklist |
| swe-career-interview-rounds | Every kind of round: by-hand coding, AI-assisted coding, system design, behavioral, take-home | none |
| swe-career-system-design-interview | Running a design interview out loud: URL shortener and news feed | mock with mentor |
| swe-whats-next | Finishing, staying sharp, the add-ons, alumni | none |

## Interview problems

Twenty problems over the program, mostly from the Blind 75 buckets. Each problem
lesson teaches the pattern from zero, works one example by hand with a trace table,
then gives one or two problems. Problems live in `parsity-labs/problems/<pattern>/`,
one file per problem with a few visible tests. Hidden tests check edge cases and
speed at large sizes. Assignment ids are the `dsa-*` names above.

## Explanation videos

Not weekly. Required only where saying it out loud really helps: the event loop
(done), how a request reaches a server, a race condition, sessions versus tokens,
a system design walkthrough, and the capstone demo. Each is a short screen
recording with a drawing, brought to the mentor session.

## Still to build outside the lessons

- AI review of code and memos against a rubric
- An admin view of submissions
- Unlocking the next project only when the current one passes (lessons say
  "do them in order" until then)
