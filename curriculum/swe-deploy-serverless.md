# Project: Deploy It Twice. Serverless First

> **In this lesson:** you start Project 6. You take an app that works on your laptop and make it ready to run where nobody is watching: settings from the environment, no secrets in Git, a health check, and logs you can search. Then you deploy it to Vercel, a serverless host, and watch what happens to data kept in memory. This is the first of two parts.

## Words you need first

- **Serverless function.** Code the host starts when a request arrives and stops when it's quiet. You never manage the machine.
- **Request handler.** The one function that receives every request and sends every response. In Node it looks like `(req, res) => { ... }`.
- **Health check.** A small route that answers "I'm up" so the host, and you, can tell the app is running.
- **Structured log.** A log line written as JSON, so a computer can search it by field.
- **Preview deployment.** A private copy of your app built from a branch, at its own address, for checking before you merge.

## The project

You'll deploy one app two ways and then decide, with numbers you measured, which way you'd run it.

1. **This part:** make the app ready, and deploy it to a serverless host.
2. **Next part:** put it in a container, deploy it to a container host, roll back a bad release, measure both, and write the memo.

Which app? You have two choices:

- **Your app from the auth project.** If it's a Node server, plain `node:http` or Express, you can bring it. It has to keep the shape the hidden tests expect, which is listed below.
- **The provided notes app.** A small API with no database and no packages, so nothing gets in the way of the deploy. Choose it if your auth project is built differently, or if you'd like a clean base. You'll learn the same things.

The shape, if you bring your own:

| File | What it must do |
| --- | --- |
| `app.js` | Export one request handler. An Express app counts, because it is one |
| `config.js` | Export `loadConfig(env)` and `REQUIRED_IN_PRODUCTION` |
| `server.js` | Start the app as a server |
| `api/index.js` | Export the same handler, for the serverless host |
| `package.json` | Name and version |

If your app needs Postgres, it needs a hosted database too. Most hosts link to a Postgres provider. Its connection string goes in `DATABASE_URL` in the host's settings, and never in code.

## Get the starter

From the top of your `parsity-labs` folder:

```bash
curl -sL https://ai.parsity.io/labs/deploy.tar.gz | tar xz
git add .
git commit -m "Add the deploy project"
```

If you're bringing your own app, copy its files into `deploy/` now, alongside the starter's `api/`, `vercel.json`, `measure.js`, `public/` and `MEMO.md`.

Run it and poke it:

```bash
cd deploy
npm start
```

In a second terminal:

```bash
curl http://localhost:3000/
curl http://localhost:3000/api/notes
curl -X POST http://localhost:3000/api/notes -H "Content-Type: application/json" -d '{"text":"first note"}'
```

The last one is refused with 401, because adding a note needs a token. Find the token in `config.js`. It's typed straight into the code. That's the first thing that has to go.

Read `app.js`, `config.js` and `server.js` before you change anything. The comments say what each part is for. Then run the tests:

```bash
node --test
```

Three of six fail. They're waiting on you.

## What "ready to deploy" means here

Four things, each from the shipping lesson.

### 1. Settings come from the environment

`loadConfig(env)` in `config.js` reads every setting from `env`, which is `process.env` unless a test passes something else. Taking `env` as an argument makes it easy to test: a test hands in a plain object and checks the result, without touching the real environment.

- `port` comes from `PORT`, as a number, and is 3000 when `PORT` isn't set. A `PORT` that isn't a whole number throws an error that names `PORT`.
- `adminToken` comes from `ADMIN_TOKEN`.
- `REQUIRED_IN_PRODUCTION` lists the settings production can't run without. When `NODE_ENV` is `"production"` and one of them is missing or empty, `loadConfig` throws an error that names it. Never the value of anything.
- When `NODE_ENV` isn't `"production"`, the app starts with nothing set, so a fresh download runs. You decide what a safe stand-in for the token is locally, and you explain it in your memo.

`NODE_ENV` is a setting most hosts set to `"production"` for you. Check that yours does, or set it yourself.

### 2. A health check

`GET /health` answers with status 200 and JSON like this:

```json
{ "status": "ok", "version": "1.0.0", "uptime": 42.17 }
```

- `version` is `APP_VERSION` if it's set, and otherwise the `version` from `package.json`. This is how you'll prove which release is live.
- `uptime` is how many seconds this copy of the app has been running. Node gives you `process.uptime()`. A tiny number means the copy just started, which is how you'll spot cold starts.
- It sends the header `Cache-Control: no-store`. Some hosts put a cache in front of your app, and a cached health check can say "ok" about an app that died ten minutes ago.
- It needs no login and shows no settings. Anyone can call it, so it must never say anything an attacker could use.

### 3. One JSON log line per request

Replace the `console.log` at the top of `handler` with one JSON line per request, written when the response is finished:

```json
{"time":"2026-11-19T10:04:12.481Z","method":"GET","path":"/api/notes","status":200,"ms":3.2}
```

The response object emits an event called `finish` once the response has been sent. Listening for it is how you know the final status and how long the request took. `path` is the path alone, with no query string, because `?token=...` is exactly where people put things that shouldn't be logged. Never log headers or the request body. Every line your app prints should be JSON, so the log search can read all of it.

```blanks
{
  "title": "Log each request once it has finished",
  "note": "Every blank is a real decision.",
  "code": "async function handler(req, res) {\n  const started = performance.now();\n  const path = new URL(req.url, \"http://localhost\").___1___;\n  res.on(\"___2___\", () => {\n    console.log(JSON.stringify({\n      method: req.method,\n      path,\n      status: res.___3___,\n      ms: performance.now() - started,\n    }));\n  });\n  // ...route the request\n}",
  "blanks": [
    { "options": ["pathname", "href", "search"], "answer": "pathname", "explain": "pathname is the path alone. href is the whole address, query string included, and search is only the query string: both can carry a token." },
    { "options": ["finish", "request", "data"], "answer": "finish", "explain": "finish fires after the response has been sent, so the status is final and the time covers the whole request." },
    { "options": ["statusCode", "status", "headers"], "answer": "statusCode", "explain": "On a Node response, the status that was sent is res.statusCode. res.status doesn't exist on a plain node:http response." }
  ]
}
```

### 4. No secrets in the repository

- The token typed into `config.js` is gone. Its value is in nobody's code.
- `.env` is listed in `.gitignore`, so your local settings never get committed. If you ignore `.env*`, also add the line `!.env.example`, or your example file disappears from Git too.
- `.env.example` lists every setting the code reads, including `APP_VERSION`, with secret values left empty.

Make yourself a strong token for local use and for the host. This prints a random one:

```bash
node -e "console.log(require('node:crypto').randomBytes(24).toString('hex'))"
```

Put it in `deploy/.env` as `ADMIN_TOKEN=...` and start the app with `npm run dev`, which reads `.env`.

## Build it with your agent

Plan the feature first. Before your agent writes anything, write a short plan in your own words in a scratch file: the four changes above, which file each touches, and the tests you'll add. Hand the agent the plan, one change at a time, and read every diff before you accept it.

Things to check in the diffs, because agents get them wrong:

- The log line logs `req.url`, which still has the query string.
- The health check spreads `process.env` or the config object into its response "for debugging".
- `loadConfig` reads `process.env` directly instead of the `env` it was given, so your tests pass by luck.
- The error for a missing setting includes the whole config, values and all.

**You owe eight tests.** The starter has six. Add at least two. Good candidates: production refuses to start without the token, `/health` is never cached, and a request with `?token=something` doesn't put it in the log. To check a log line in a test, you can swap `console.log` for a function that collects lines, and put it back afterwards.

If you're stuck on one piece for more than 30 minutes, write down what you expected and what happened, and bring it to office hours.

## Deploy to Vercel

Hosts change their screens often, so these steps say what to look for. When a label differs, look for the closest match, and check [Vercel's documentation](https://vercel.com/docs).

1. Commit and push your `parsity-labs` repository.
2. Sign in to Vercel with your GitHub account and import the `parsity-labs` repository as a new project. Vercel has a plan for personal projects. Read its current limits on the pricing page, and set a spending limit if it offers one.
3. Find the **root directory** setting and set it to `deploy`. Vercel only looks in that folder.
4. For the framework, pick the option for no framework, usually called **Other**. There's no build step.
5. Find **environment variables** and add `ADMIN_TOKEN` with a new random value. Use a different value from your local one.
6. Deploy. You'll get an address ending in `.vercel.app`.

How this works: Vercel turns each file in `api/` into a serverless function. `vercel.json` sends every path to `api/index.js`, which exports the same handler as `server.js` uses. Files in `public/` are served as they are. That's why the folder exists: with no `public/` folder, some hosts serve every file in the project, your source code included.

## Check it

Use your own address in place of `YOUR-APP`.

```bash
curl -i https://YOUR-APP.vercel.app/health
```

You should see 200, your JSON, and `cache-control: no-store` among the headers. Then check the things that should *not* work:

```bash
curl -i https://YOUR-APP.vercel.app/config.js
curl -i -X POST https://YOUR-APP.vercel.app/api/notes -H "Content-Type: application/json" -d '{"text":"hi"}'
```

The first should be your app's 404, not your code. The second should be 401.

Now add a note with your production token, then list the notes several times:

```bash
curl -X POST https://YOUR-APP.vercel.app/api/notes \
  -H "Authorization: Bearer YOUR-PRODUCTION-TOKEN" \
  -H "Content-Type: application/json" -d '{"text":"is this still here?"}'

for i in 1 2 3 4 5 6 7 8; do curl -s https://YOUR-APP.vercel.app/api/notes; echo; done
```

You may see your note every time, for now. Leave the app alone for a while, or deploy again, and look again. It will be gone.

The notes live in a variable in memory, inside one copy of the function. When the host stops that copy, the memory goes with it. When it runs two copies at once, each has its own array. Nothing is wrong with your code. Memory in a serverless function is a scratchpad, never storage. Anything that has to last belongs in a database.

## Read the logs

Find your project's logs in the Vercel dashboard. They're usually under a tab called **Logs**. Look for:

- Your JSON lines, one per request. Search or filter for `"status":401` and find the note you tried to add without a token.
- A cold start. Leave the app alone, then call `/health`. If `uptime` is under a second or two, a fresh copy answered you.
- Anything that isn't JSON. If you find a line your code printed that isn't, fix it.

## Preview deployments

Make a branch, change the `name` in the `GET /` response, and push it. Vercel builds a preview deployment of the branch at its own address, while production stays as it was. Open it, check the change, then merge or delete the branch.

Environment variables can be set separately for production and for previews. Look at which environments your `ADMIN_TOKEN` applies to and decide whether previews should share it. Say what you decided in your memo.

## Hand it in

Add one line to the very top of `deploy/README.md` with your live address:

```
Serverless: https://YOUR-APP.vercel.app
```

Commit, push, and paste your `parsity-labs` link here.

```submit
assignment: deploy-1
```

We need `app.js`, `config.js`, `server.js` and `package.json` in `deploy`, and at least 8 passing tests of yours. Then ours run: the health check, settings and production startup, secrets in the repository, the log lines, and the serverless entry point.

Our grader runs your code without a network, so it can't visit your deploy. **Your mentor checks the live address**: that `/health` answers with your version, that `/config.js` doesn't show code, and that a POST without the token is refused. Make sure it's up before your next session.

```quiz
[
  {
    "q": "Your notes app on Vercel shows a note on one request and an empty list on the next. Nothing was deleted. Why?",
    "options": ["Two copies of the function are running, and each keeps its own array in memory", "Vercel deletes data every request", "The health check cleared it", "The note failed to save"],
    "answer": 0,
    "explain": "Memory belongs to one running copy. A serverless host can run several copies and stop any of them at any time. Data that must last goes in a database."
  },
  {
    "q": "Why does the log line use the path alone and not req.url?",
    "options": ["req.url includes the query string, which can carry tokens and other secrets", "req.url is slower to read", "The path is shorter, so logs cost less", "req.url doesn't exist on Vercel"],
    "answer": 0,
    "explain": "People put tokens in query strings all the time. Logs are read by many people and kept for a long time, so you log only what you know is safe."
  },
  {
    "q": "In production, ADMIN_TOKEN is missing. What should loadConfig do?",
    "options": ["Throw an error that names ADMIN_TOKEN, so the app refuses to start", "Use a default token so the app stays up", "Log every setting so you can see what's missing", "Start normally and refuse every POST"],
    "answer": 0,
    "explain": "Failing loudly at startup gets caught on the first deploy. A default token in production is a known password, and logging every setting leaks the ones that are set."
  }
]
```

## Key takeaways

- One request handler can run under a long-running server and under a serverless host. Only the entry point differs.
- Settings come from `env`. Production refuses to start without its required settings and names what's missing, never a value.
- A health check is fast, open, uncached, says which version is live and shows nothing secret.
- Log one JSON line per request when it finishes, with the path and not the query string, headers or body.
- Memory in a serverless function can vanish between requests. Anything that must last goes in a database.

## Work with AI

```ai-prompt
title: Review my deploy for leaks, without fixing it
---
I'm a beginner who just deployed a small Node app to a serverless host. I'll paste my
config.js, the /health route and my request-logging code. Don't rewrite any of it. Act
as a security-minded reviewer. For each file, tell me one way a secret could still
leak: into a log, a response, an error message or Git. Quote the exact line. If you
can't find one, say so and tell me what you checked. Then ask me what would happen if
someone sent my app a request with a token in the query string and a password in the
body, and wait for my answer.
```
