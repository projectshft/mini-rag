# Project: Deploy It Twice. A Container, a Rollback and a Memo

> **In this lesson:** you put the same app in a container and deploy it to a host that keeps it running all the time. You'll learn how a host starts and stops your app, write a Dockerfile line by line, add a check that runs your tests on every pull request, ship a bad release on purpose and roll it back, and measure both deploys. Then you write the memo that says which one you'd choose. This is the second of two parts.

## Words you need first

- **Image.** Your app packaged with Node and a small operating system, built from a Dockerfile.
- **Container.** One running copy of an image.
- **Signal.** A short message the operating system sends a running program, such as "please stop".
- **Rollback.** Switching a host back to a version that was already built and worked, without building anything new.
- **Latency.** How long a request takes from the moment it's sent to the moment the answer arrives.

## What's different about a container host

On Vercel, the host decided when your code ran. On a container host, your app is a long-running server. It starts once, stays up, and handles request after request. That means three jobs that used to be the host's are now yours:

- **Listen where the host tells you.** The host picks a port and tells your app through `PORT`.
- **Be reachable from outside the container.** More on that below.
- **Stop cleanly when asked.** Every deploy, restart and scale-down stops your old container. How it stops decides whether users see errors.

All three live in `server.js`, which you haven't touched yet.

## Install Docker

You need a way to build and run containers on your laptop. [Docker Desktop](https://docs.docker.com/get-started/get-docker/) is the common choice. Check that it works:

```bash
docker run --rm hello-world
```

If your computer can't run Docker, you can still finish: the container host builds the image from your Dockerfile for you. You'll just have fewer ways to check your work before you push, so push small changes.

## Listening in a container

Here is the starter's `server.js`:

```js
server.listen(3000, "localhost", () => { ... });
```

Two problems.

**The port is fixed.** The host decides the port. Use `loadConfig().port`, which reads `PORT`.

**`localhost` means "this machine only".** Inside a container, "this machine" is the container itself. Requests from the outside world arrive on the container's network address, and a server listening only on `localhost` never sees them. The app runs, the logs look fine, and every request times out. Listen on `"0.0.0.0"`, which means every address this machine has, or leave the address out, which in Node does the same.

## Stopping cleanly

A **signal** is a short message the operating system delivers to a running program. You've sent one already: pressing Ctrl+C sends `SIGINT`. Three matter here:

| Signal | Sent when | Can your code catch it? |
| --- | --- | --- |
| `SIGINT` | You press Ctrl+C | Yes |
| `SIGTERM` | A host or `docker stop` asks your app to stop | Yes |
| `SIGKILL` | The host gives up waiting | No. The process just ends |

A host stopping a container sends `SIGTERM`, waits a short grace period, then sends `SIGKILL`. If your app ignores `SIGTERM`, every request still in progress when `SIGKILL` arrives is cut off, and those users get errors. On every single deploy.

There's a container twist. The first program in a container gets special treatment from the operating system, and one effect is that it **ignores `SIGTERM` unless your code handles it.** So a Node server with no handler doesn't stop when asked. It sits there until it's killed.

A clean stop has three steps: stop accepting new connections, let the requests in progress finish, then exit with code 0. In Node:

```js
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
```

`server.close` stops new connections and calls its function once the open ones have finished. Think about what happens if a connection never finishes, and add a backstop so the process exits anyway after a few seconds.

```order
title: A container host replaces your app with a new version
---
The host builds the new image and starts a container from it
The host calls /health on the new container until it answers 200
The host starts sending new requests to the new container
The host sends SIGTERM to the old container
The old server stops accepting connections and finishes the requests it has
The old process exits with code 0, and nobody saw an error
```

## The Dockerfile

Create `deploy/Dockerfile`. Here are the pieces and the reason for each.

```dockerfile
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY . .

USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

**`FROM` with a version.** `node:latest` means "whatever is newest the day you build". The same Dockerfile can build a different Node next month and break with no change on your side. Pin at least the major version, `node:22-alpine`. An exact version such as `node:22.11.0-alpine` is stricter. Either way, you decide when it changes.

**`ENV NODE_ENV=production`.** Sets the setting your `loadConfig` checks, so the container refuses to start without its required settings.

**`USER node`.** By default a container runs as `root`, the user allowed to do anything. If someone finds a hole in your app, they get whatever the app's user can do. The official Node images include an ordinary user called `node`. Use it.

**`EXPOSE 3000`.** A note for people and tools about which port the app usually uses. It doesn't open anything by itself.

**`CMD` in exec form.** `CMD ["node", "server.js"]`, with the square brackets, starts Node directly. The other way to write it, `CMD node server.js`, quietly starts a shell first and the shell starts Node. The host's `SIGTERM` goes to the shell, which doesn't pass it on, so Node never hears it. `CMD ["npm", "start"]` has a similar problem: npm sits between the host and your app. Start Node directly.

If your app has packages, copy the package files and install before copying the rest:

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
```

Docker builds an image in **layers**, one per instruction, and reuses a layer when nothing it depends on has changed. With this order, changing your code reuses the install layer, so builds stay fast. `npm ci` installs exactly what the lockfile says, and `--omit=dev` leaves out test tools that production doesn't need.

### Keep things out of the image

`COPY . .` copies everything in the folder, including your `.env` file with real secrets in it. Anyone who gets the image can read every file inside. Create `deploy/.dockerignore`, which works like `.gitignore` for images:

```
node_modules
.env
.git
```

`node_modules` is there too: packages installed on your laptop may be built for a different operating system from the one in the image.

```blanks
{
  "title": "Finish the Dockerfile",
  "note": "Each blank is a choice a host will punish you for getting wrong.",
  "code": "FROM node:___1___\nENV NODE_ENV=production\nWORKDIR /app\nCOPY . .\nUSER ___2___\nCMD ___3___",
  "blanks": [
    { "options": ["22-alpine", "latest", "alpine"], "answer": "22-alpine", "explain": "latest and alpine change under you whenever a new Node comes out. 22-alpine pins the major version." },
    { "options": ["node", "root", "0"], "answer": "node", "explain": "root and user 0 are the same all-powerful user. The node user can run your app and very little else." },
    { "options": ["[\"node\", \"server.js\"]", "node server.js", "[\"npm\", \"start\"]"], "answer": "[\"node\", \"server.js\"]", "explain": "Without brackets a shell starts first and swallows SIGTERM. With npm, npm sits in between. The exec form starts Node directly, so it hears the host." }
  ]
}
```

## Build and run it on your laptop

From inside `deploy`:

```bash
docker build -t parsity-deploy .
docker run --rm -p 3000:3000 -e PORT=3000 parsity-deploy
```

`-t` gives the image a name. `-p 3000:3000` connects port 3000 on your laptop to port 3000 in the container: the left number is yours, the right one is the container's. `-e` sets an environment variable.

It should refuse to start, naming `ADMIN_TOKEN`. That's your fail-fast check working, because the Dockerfile set `NODE_ENV=production`. Run it again with the token:

```bash
docker run --rm -p 3000:3000 -e PORT=3000 -e ADMIN_TOKEN=local-test-token parsity-deploy
```

In another terminal, `curl http://localhost:3000/health`. Then stop it the way a host would:

```bash
docker ps
docker stop <the container id from docker ps>
```

`docker stop` sends `SIGTERM`, waits, then sends `SIGKILL`. If it stops at once and your shutdown handler logged a line, you got it right. If `docker stop` hangs for about ten seconds, your app ignored the signal and was killed.

Check that your secrets stayed out. This lists the files inside the image:

```bash
docker run --rm --entrypoint ls parsity-deploy -a /app
```

No `.env`, no `node_modules`.

## Tests on every pull request

You're about to let a host deploy every change to `main` automatically. Before you do, make sure nothing reaches `main` without the tests passing.

Create `.github/workflows/test.yml` at the **top** of your `parsity-labs` repository, not inside `deploy`:

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  deploy-app:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: deploy
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: node --test
```

It tells GitHub: on every push to `main` and every pull request, start a fresh machine, get the code, install Node 22, and run the tests in `deploy`. Push it and find the run under your repository's **Actions** tab. The lesson on automating checks explains every line, extends it to the whole repository, and makes `main` refuse changes that fail it.

## Build it with your agent

Plan it first, in your own words: the changes to `server.js`, the Dockerfile, `.dockerignore`, the workflow, and the tests you'll add. Then work through it with your agent one piece at a time, and read each diff.

Watch for these in what the agent writes:

- `server.listen(port, "localhost")`, or a `HOST` setting that defaults to `localhost`.
- A Dockerfile with `FROM node`, `FROM node:latest`, no `USER`, or `CMD npm start`.
- A shutdown handler that calls `process.exit(0)` straight away, cutting off the requests in progress.

**You owe ten tests now.** Add at least two more. Good ones: `server.js` answers on the `PORT` it's given, and it exits with code 0 after `SIGTERM`. To test those, start `server.js` as a child process with `spawn` from `node:child_process`, wait until `/health` answers, and send it a signal with `child.kill("SIGTERM")`.

If you're stuck on one piece for more than 30 minutes, write down what you tried and bring it to office hours.

## Deploy to a container host

Pick one container host. [Render](https://render.com/docs) and [Fly.io](https://fly.io/docs/) both build from a Dockerfile, and so do several others. Screens and plans change, so follow what you see and check their docs when a label differs. Look at the current pricing page before you start, and set up a spending limit or billing alert if the host offers one. Some cheap plans put an app to sleep when nobody uses it. If yours does, you'll see it in your numbers, and that's worth writing about.

What every container host needs from you:

1. **The repository and folder.** Connect your GitHub repository and set the root directory, or the folder to build from, to `deploy`.
2. **How to build.** Choose Docker, or let it find your Dockerfile.
3. **The port.** Most hosts set `PORT` for you. If yours asks which port the app listens on, give it a number and set `PORT` to the same number in its settings. On Fly.io this is `internal_port` in `fly.toml`, and you can set `PORT` under `[env]` in the same file.
4. **Settings.** Add `ADMIN_TOKEN`, with a new random value, wherever the host keeps secrets. On Fly.io that's `fly secrets set ADMIN_TOKEN=...`.
5. **The health check.** Find the health check setting and point it at `/health`.

Deploy, then run the same checks as last time against the new address: `/health`, `/config.js`, and a POST without the token.

Now try the notes experiment again. Add a note and list notes several times. With one container running, the note stays, because one process keeps its memory between requests. Now redeploy, and look again. A long-running server keeps memory longer than a serverless function, and it still loses everything when it restarts. It only takes a second container behind the same address for you to see the serverless problem again.

## Ship a bad release, then roll it back

Do this on purpose now, so the first time isn't during a real outage.

1. Change `version` in `package.json` to `1.1.0`, and make `GET /` throw an error. Commit and push to `main`. Both hosts deploy it.
2. Check both: `/health` says `1.1.0`, and `/` answers 500. That's your outage.
3. Roll back each host, and time it from the moment you decide to the moment `/health` says `1.0.0` again.
   - **Vercel:** find your list of deployments, choose the previous production deployment, and look for the option to roll back to it or promote it.
   - **Container host:** find the list of past deploys or releases and look for a rollback option on the previous one. On Fly.io, `fly releases --image` lists past images, and `fly deploy --image <that image>` puts one back.
4. Write down both times and what you clicked.

A rollback points the host at a build it already has. Nothing is rebuilt, which is why it's fast. But your `main` branch still holds the bad commit, and the next push deploys it again. Some hosts turn off automatic deploys after a rollback for exactly this reason, so read what yours says on screen.

So finish the job in Git: undo the bad commit with `git revert`, which makes a new commit that reverses it, and push. The lesson on automating checks covers reverting properly. Check that both hosts end up healthy on the fixed code.

## Measure both

`measure.js` sends requests one at a time and prints how long each took, then the median and the 95th percentile of all but the first. From inside `deploy`:

```bash
node measure.js https://YOUR-SERVERLESS-APP/health 50
node measure.js https://YOUR-CONTAINER-APP/health 50
```

Run them from the same place, one after the other, so your own network is the same for both.

Then measure a cold start. Leave both apps completely alone for at least an hour, then send five requests to each:

```bash
node measure.js https://YOUR-SERVERLESS-APP/health 5
node measure.js https://YOUR-CONTAINER-APP/health 5
```

Look at the first request and at the uptime the script prints. If uptime is near zero, a fresh copy of the app answered you.

One trap: the first request from your laptop to any address is slower anyway, because your laptop has to look up the address and set up a secure connection before sending anything. Later requests reuse that connection. So compare the first request after an idle hour with the first request when the app was already warm. The difference between those two is the cold start.

Also find out which region each host runs your app in. It's in the settings. A request that crosses an ocean pays for the trip both ways.

## Write your decision memo

Open `deploy/MEMO.md` and answer every question in your own words, with the numbers you measured. No agent writes it. An agent may read it afterwards and tell you where it's unclear.

The question underneath it all: for this app, at this size, which deploy would you choose, what does it cost, and what would change your mind? A whole answer names a cost. "The container was faster" is half. "The container's warm median was lower because it sits in my region and never starts cold, and I pay for it every hour whether anyone uses it or not" is whole.

## Hand it in

Add a second line to the top of `deploy/README.md`:

```
Serverless: https://YOUR-SERVERLESS-APP
Container: https://YOUR-CONTAINER-APP
```

Commit, push, and paste your `parsity-labs` link here.

```submit
assignment: deploy-2
```

We need `app.js`, `config.js`, `server.js`, `package.json` and `MEMO.md` in `deploy`, and at least 10 passing tests of yours. Then ours run. They read your `Dockerfile` and `.dockerignore` as text, start `server.js` on a port we choose and stop it with `SIGTERM`, look for the workflow file at the top of your repository, and check that everything from the first part still works.

Our grader has no network and doesn't run Docker, so a lot of this project is checked by a person. **Your mentor checks** that both addresses are live and on the fixed code, the rollback (be ready to show each host's deploy history with the rollback in it), and your numbers. Your mentor may ask you to run `measure.js` in the session, and will ask about your memo.

## Tell the story

At your next mentor session, explain this project out loud, without notes:

- What you built and where it runs, in two sentences.
- The hardest part, and how you got through it.
- The decision you made in your memo, and what it costs.

## Stretch

Prove that a request in progress survives a shutdown. Add a route that waits a second before answering, start a request to it, send `SIGTERM` while it's waiting, and show in a test that the request still gets its answer and the process then exits with code 0.

```quiz
[
  {
    "q": "Your container deploys, the logs say 'listening', and every request to the host's address times out. What's the most likely cause?",
    "options": ["The server listens on localhost, which inside a container only accepts connections from the container itself", "The Dockerfile is missing EXPOSE", "The health check is cached", "Node 22 doesn't work in containers"],
    "answer": 0,
    "explain": "Requests from outside arrive on the container's network address. A server on localhost never sees them. Listen on 0.0.0.0 or leave the address out."
  },
  {
    "q": "Every deploy, a handful of users get errors, and docker stop takes about ten seconds to finish. What's wrong?",
    "options": ["The app ignores SIGTERM, so it's killed mid-request when the grace period runs out", "The image is too big", "The health check is too slow", "The host's network is unreliable"],
    "answer": 0,
    "explain": "With no SIGTERM handler, or a shell in front of Node, the app never hears the request to stop. The host waits, then kills it, cutting off whatever was in progress."
  },
  {
    "q": "You rolled back on the host and the site is healthy. What's still wrong?",
    "options": ["main still has the bad commit, so the next push deploys it again", "Nothing, a rollback fixes it for good", "The rollback deleted your database", "The old version has no health check"],
    "answer": 0,
    "explain": "A rollback points the host at an older build. Git doesn't know. Revert the bad commit on main so the next deploy is good."
  }
]
```

## Key takeaways

- On a container host, your server reads `PORT`, listens on every address, and stops cleanly on `SIGTERM`.
- Pin the base image, run as a user that isn't root, start Node directly with an exec-form `CMD`, and keep `.env` and `node_modules` out of the image.
- A workflow that runs the tests on every pull request is the guard in front of automatic deploys.
- A rollback is fast because nothing is rebuilt. Follow it with a revert in Git, or the bad commit comes back.
- Measure the median, the 95th percentile and the cold start from the same place, and say what explains the difference.

## Work with AI

```ai-prompt
title: Cross-examine my memo
---
I'm a beginner who deployed the same small app to a serverless host and to a container
host, measured both, and wrote a decision memo. I'll paste the memo with my numbers.
Don't rewrite it. Act as a skeptical senior engineer. Ask me one question at a time,
waiting for my answer each time, about: whether my numbers support my conclusion,
what I left out of the cost, what happens at 100 times the traffic, and what would make
me change my choice. After five questions, tell me the weakest sentence in my memo and
why, quoting it exactly.
```
