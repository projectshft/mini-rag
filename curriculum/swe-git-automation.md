# Git: Checks on Every Pull Request

> **In this lesson:** how to make GitHub run your tests on every change, read what it tells you, and refuse to merge anything that fails. Then the other half of working safely: undoing a bad change that already reached `main`, without rewriting history your teammates depend on. You'll hand in a pull request your checks blocked, and a revert.

## Words you need first

- **Workflow.** A file that tells GitHub Actions what to run and when. It lives in `.github/workflows/`.
- **Status check.** The result a workflow posts on a commit or pull request: a green tick, a red cross, or a yellow dot while it runs.
- **Ruleset.** Rules GitHub enforces on a branch, such as "no merging until the checks pass". Older screens call this branch protection.
- **Revert.** A new commit that undoes an earlier one, leaving the history in place.

## Why a machine runs the tests

You run your tests before you push. Usually. Your teammates do too. Usually. An agent says it ran them, and sometimes it ran a different command, or ran them before its last change.

"Usually" is how broken code reaches production. A workflow runs the same tests, the same way, on a fresh machine, for every change, and posts the result where everyone can see it. Nobody has to remember, and nobody can skip it.

## A workflow, line by line

You added this file to the top of your `parsity-labs` repository in the deploy project:

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

It's written in **YAML**, a format for settings. Three rules cover most of it:

- `key: value` sets something.
- Indentation shows what belongs inside what. Use spaces, never tabs. A wrong indent is the most common YAML mistake.
- A line starting with `- ` is one item in a list.

Now each part:

| Part | What it means |
| --- | --- |
| `name: Tests` | The name shown in the Actions tab |
| `on:` | What starts it: a push to `main`, or any pull request being opened or updated |
| `jobs:` | The work to do. Each job runs on its own fresh machine, and jobs run side by side |
| `deploy-app:` | The job's id. This is the name you'll pick when you make the check required |
| `runs-on: ubuntu-latest` | The kind of machine. GitHub lends you one, starting from nothing |
| `working-directory: deploy` | Run every command inside `deploy` |
| `steps:` | What the job does, in order. If one fails, the job stops and fails |
| `uses: actions/checkout@v4` | A ready-made step that copies your repository onto the machine. Without it the machine is empty |
| `uses: actions/setup-node@v4` | A ready-made step that installs the Node version you ask for |
| `run: node --test` | A command, exactly as you'd type it. A nonzero exit code fails the step |

`uses` runs a step someone else wrote and published. `run` runs your own command. The `@v4` pins a version of that step, for the same reason you pinned your Docker base image.

The machine GitHub lends you is called a **runner**. It's a different thing from the test runner you built by hand: this one is a whole computer that runs your workflow and is thrown away afterwards.

```blanks
{
  "title": "Run the tests on every pull request",
  "note": "Each blank changes what the workflow does.",
  "code": "on:\n  ___1___:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/___2___@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - ___3___: node --test",
  "blanks": [
    { "options": ["pull_request", "release", "schedule"], "answer": "pull_request", "explain": "pull_request runs the workflow whenever a pull request is opened or gets new commits. release and schedule run it at other moments." },
    { "options": ["checkout", "setup-node", "cache"], "answer": "checkout", "explain": "The machine starts empty. checkout copies your code onto it. Without it, node --test finds nothing." },
    { "options": ["run", "uses", "with"], "answer": "run", "explain": "run executes your own command. uses runs a published step, and with passes it settings." }
  ]
}
```

## Check the whole repository

Right now only `deploy` is checked. Every project folder in `parsity-labs` has tests, so check them all. A **matrix** runs the same job once for each value in a list, side by side:

```yaml
jobs:
  labs:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        folder: [toolkit/arrays, toolkit/structures, toolkit/runner, deploy]
    defaults:
      run:
        working-directory: ${{ matrix.folder }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: if [ -f package-lock.json ]; then npm ci; fi
      - run: node --test
```

- `${{ matrix.folder }}` is replaced by each folder in turn, so this one job becomes one run per folder.
- `fail-fast: false` keeps the others running when one fails, so you see every failure at once.
- The `npm ci` line installs packages only in folders that have a lockfile.

Put every project folder you have in the list. Make sure every one passes on your laptop first. If one of them never passed, this is the moment to find out.

Keep the `pull_request` trigger, `setup-node` and the `deploy` folder in the file, because the deploy project's checks look for them.

## Reading a red check

Push the change on a branch and open a pull request. At the bottom of the pull request you'll see one check per folder.

When one goes red:

1. Click **Details** next to it. You land on that job's log.
2. Open the step with the red cross. The error is usually near the bottom.
3. Read it the way you'd read a failing test on your laptop: which test, what was expected, what happened.
4. Fix it on the same branch and push. The checks run again on their own.

Two failures that only happen on the runner, and what they mean:

- **It passes on my laptop.** Something on your laptop isn't in Git: a file you never committed, a package installed globally, a different Node version, or a setting in your `.env`. The runner is the honest one.
- **It passes sometimes.** A flaky test, usually one that depends on timing or on the order tests run in. Don't rerun until it's green. Find out why.

## Make main refuse failing changes

A red check is only advice until you make it a rule. In your `parsity-labs` repository on GitHub, open **Settings** and look for **Rules** and then **Rulesets**. On some screens it's **Branches** and a branch protection rule. Make a rule for the `main` branch that:

- **Requires a pull request before merging.** Nothing lands on `main` by a direct push.
- **Requires status checks to pass.** Search for your job's name and add it. If it doesn't appear, the workflow has to have run at least once on a pull request first.
- **Blocks force pushes.** More on why below.

GitHub may offer you, as the owner, a way to bypass the rules. Don't add yourself. A rule you can skip when you're in a hurry protects nothing when it matters. GitHub's [documentation on rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) explains each option. Rules on a free account work on public repositories, which `parsity-labs` is.

Now prove it works:

1. Make a branch, break a test on purpose, push, and open a pull request.
2. Watch the check go red and the merge button refuse.
3. Fix it on the branch, push, watch it go green, and merge.

Keep that pull request. It's part of what you hand in.

## Undoing a change that already reached main

Sooner or later something bad gets merged. The checks were green, and the change was still wrong. Git gives you two ways back, and only one is safe on a shared branch.

**`git revert`** makes a new commit that does the exact opposite of an old one. If the old commit added a line, the revert removes it. History keeps both, so anyone can see what happened and why.

```bash
git switch -c revert-bad-change
git revert <the bad commit's id>
git push -u origin revert-bad-change
```

Then open a pull request, let the checks run, and merge it like any other change. If the bad change came in through a merged pull request, GitHub usually shows a **Revert** button on that pull request, which does the same thing for you.

**`git reset`** moves the branch back to an older commit, as if the newer ones never happened. On your own unpushed branch, that's fine. On `main`, it means rewriting history that other people, other branches and your host have already seen, and pushing it needs `--force`. Everyone else's copy now disagrees with GitHub's. That's why your rule blocks force pushes.

| | `git revert` | `git reset` plus force push |
| --- | --- | --- |
| What it does | Adds a commit that undoes another | Throws commits away |
| History | Kept, with the undo recorded | Rewritten |
| Safe on `main`? | Yes | No, and your rule blocks it |
| Goes through checks and review? | Yes, as a normal pull request | No |

### Revert and rollback work together

In the deploy project you rolled back on the host. That's the fast fix: the host serves an older build within moments. The revert is the lasting fix: `main` no longer holds the bad change, so the next deploy is good. In a real outage you do both, in that order.

```order
title: A bad change is live. Fix it properly
---
Roll back on the host so users get the last good version
Find the commit that caused it
Revert that commit on a new branch
Open a pull request and let the checks run
Merge it, and the host deploys the fixed main
Check /health shows the new version and the problem is gone
```

```scenario
{
  "who": "A teammate, in the team chat",
  "setting": "A bad merge broke checkout twenty minutes ago. The host is rolled back.",
  "ask": "Easiest fix: I'll reset main to yesterday's commit and force push. Two seconds. Can you turn off the branch rule for a minute?",
  "options": [
    { "text": "Let's revert instead. I'll open a pull request that reverts the merge, the checks run, and we merge it. History stays intact, nobody's local copy breaks, and the rule stays on.", "verdict": "best", "feedback": "It solves the same problem without rewriting shared history or turning off the guard during an incident, which is exactly when mistakes happen." },
    { "text": "Sure, but only for a minute, and turn it back on right after.", "verdict": "weak", "feedback": "Turning off protection mid-incident is how a second incident starts. A force push also drops any good commits merged since yesterday, and breaks every teammate's copy of main." },
    { "text": "We're rolled back on the host, so there's no rush. Let's leave main as it is until Monday.", "verdict": "ok", "feedback": "The rollback buys time, but main still holds the bad commit. The next merge from anyone deploys it again. A revert takes minutes and closes that gap." },
    { "text": "Let's just fix the bug forward with a new commit.", "verdict": "ok", "feedback": "Sometimes right, when the fix is small and obvious. Under pressure, a revert is the change you can be most sure of. Fix forward once main is safe." }
  ]
}
```

## Secrets in workflows, briefly

If a workflow ever needs a key, for example to deploy, store it in the repository's settings under Actions secrets and refer to it as `${{ secrets.NAME }}`. GitHub hides it in logs. Never print it yourself, and know that workflows started from someone else's fork don't receive your secrets, which is deliberate. Your test workflow needs none.

## Hand it in

This one is checked by your mentor, because it lives in GitHub's settings and history and our grader only reads your files. Bring links to:

1. The pull request where your check failed and blocked the merge, then passed after your fix.
2. A revert. Merge a small, harmless change to `main`, then revert it through a pull request. Bring the link to the revert pull request.
3. Your ruleset. A screenshot of the rule for `main` is fine.

Your workflow file itself is also checked automatically when you hand in the container part of the deploy project.

```quiz
[
  {
    "q": "Your tests pass on your laptop and fail on the GitHub runner with 'Cannot find module ./helpers.js'. What's the most likely cause?",
    "options": ["helpers.js was never committed, so it only exists on your laptop", "GitHub's runner is broken", "The runner uses a slower computer", "node --test works differently on Linux"],
    "answer": 0,
    "explain": "The runner starts from your repository and nothing else. A file that works locally and is missing there almost always wasn't committed."
  },
  {
    "q": "A bad commit is on main and teammates have already pulled it. Which undo is safe?",
    "options": ["git revert, through a pull request", "git reset --hard to the commit before, then force push", "Delete the repository and push a fresh copy", "Edit the commit message"],
    "answer": 0,
    "explain": "A revert adds a commit and keeps history, so everyone's copy stays valid and the change goes through the checks. A reset plus force push rewrites history others depend on."
  },
  {
    "q": "The workflow runs on every pull request and shows red when tests fail, but people still merge red pull requests. What's missing?",
    "options": ["A rule on main that requires the status check to pass before merging", "A second workflow", "More tests", "A faster runner"],
    "answer": 0,
    "explain": "A check reports. A rule enforces. Until the check is required on main, red is only advice."
  }
]
```

## Key takeaways

- A workflow runs your tests the same way on a fresh machine for every change, so nobody has to remember and nobody can skip it.
- `on` says when, `jobs` say what, `steps` run in order, `uses` borrows a published step and `run` runs your command.
- A red check is advice until a rule on `main` requires it. Don't give yourself a way around the rule.
- On a shared branch, undo with `git revert` through a pull request. Never reset and force push `main`.
- Roll back on the host for speed, then revert in Git so the next deploy is good.

## Work with AI

```ai-prompt
title: Break my workflow on purpose
---
I'm a beginner who just wrote a GitHub Actions workflow that runs node --test in several
folders of my repository using a matrix. I'll paste it. Don't fix it for me. Instead,
describe five realistic ways a change to my repository could make this workflow fail
on GitHub while my tests still pass on my laptop. One at a time, ask me what I'd see in
the log and how I'd fix it, and wait for my answer before going on. At the end, tell me
which of the five my workflow is most exposed to, and why.
```
