# The Rule of Three (and Why I Stopped Writing Comments)

> **In this lesson:** agents forget everything between sessions, so you'll learn when to write something down for them (not often), where it goes, and how to keep it short. You'll finally deal with the instructions file that's been lying to your agent since you cloned Driftwood. Then a take that might surprise you: in a codebase built for agents, I don't write code comments.

## Agents start every session from zero

So how do you stop correcting the same mistake every day? You write it down. But only after it's earned it.

**The rule of three:** if you've told the agent the same thing three times and it keeps getting it wrong, write it down. Once is a fluke. Twice is a coincidence. Three times is a pattern. Before that, you're writing rules for problems you don't have.

## Where it goes

**A project instructions file.** Most tools read a markdown file at the root of the project at the start of every session. Claude Code reads `CLAUDE.md` ([docs](https://code.claude.com/docs/en/memory)). Lots of other tools read `AGENTS.md` ([agents.md](https://agents.md)). Short, always-true facts go here:

```markdown
- Use npm. There is no yarn.lock.
- Money is integer cents everywhere. Never store or pass dollars as floats.
- The API runs on port 4000. Tests: `npm test` in apps/api (Jest).
```

**A skill.** A folder with a `SKILL.md` that teaches the agent one specific procedure, plus any scripts it needs. The agent only loads it when the task calls for it. Anthropic created the format and released it as an open standard at [agentskills.io](https://agentskills.io). See [Claude Code's skills docs](https://code.claude.com/docs/en/skills).

Rough guide: a fact about this project goes in the instructions file. A repeatable procedure ("how we add a new API route with validation and tests") is a skill.

Driftwood already has a [`CLAUDE.md`](https://github.com/projectshft/driftwood-ops/blob/main/CLAUDE.md) at its root. Jake started it and the team kept adding to it. Open it. Count the lines. Ask yourself which ones an agent actually needs on every single task, and which ones are just wrong. You've worked in this codebase for a while now, so you can tell. Remember the wrong port and the wrong test command from your first tour? This is where they came from.

## Keep it short

Markdown files are a new surface area for code rot. For most developers I talk to, they're doing more harm than good.

- Every line costs the agent attention. A 500-line instructions file gets skimmed by models and people alike.
- Rules, not essays. "Use X, not Y" beats a paragraph of backstory.
- Delete lines that stop being true. A stale rule is worse than no rule.
- Open every link an agent adds to these files. Models invent URLs that look perfect and lead nowhere.

## We're writing code for agents now

Look at what happened to the amount of code being written. GitHub's [Octoverse 2026 report](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/) counted 34.3 billion commits in the last year, up from 12.9 billion the year before. Developers pushed code 17.9 billion times, more than 2024 and 2025 combined. By September, more than 40% of pull requests on GitHub started with an agent's first draft.

And it isn't all good code. GitClear's [2026 study](https://www.gitclear.com/write_only_mode_ai_research) of 623 million changes found copy-pasted lines rising from 9.4% to 15.7% of changed code, while refactored (moved) code fell from 21% to 3.8%. We're writing a lot more code and cleaning up a lot less of it.

Nobody is reading all of that line by line. The main reader of your codebase is increasingly an agent. Which changes what "readable" means.

## Why I avoid comments

Large language models. Emphasis on *language*.

An agent reads a comment and decides that's what the code means. It treats the text as truth. If the comment says `// retries 3 times` and the code retries 5 times, the agent will happily build on "3." If a comment says `// TODO: not implemented` above a function that works fine, it'll rewrite the function.

This has bitten me more than once. Comments drift. Code gets changed, the comment doesn't, and now there's a confident lie sitting right next to the truth. Humans learned to skim past stale comments. Agents don't. They believe them.

So in codebases that are mostly built and maintained with agents, I avoid comments entirely. Instead:

- **Name things so the name is the documentation.** `retryWithBackoff(fn, { attempts: 5 })` doesn't need a comment.
- **Put intent in tests.** A test named `splits on paragraph boundaries before hitting max size` is a comment that fails when it stops being true.
- **Put the genuinely weird stuff in the instructions file.** One line about money being integer cents beats a comment block nobody updates.

Driftwood is full of comments, and you've already met a few that are wrong. The header of `scripts/reconcile_inventory.py` describes a script that was never built. A comment in `apps/api/src/middleware/auth.ts` says there isn't much customer-facing code, and there's a whole portal now. A test is marked flaky when it fails every time. Each one cost you or your agent a few minutes. Find the rest before your agent trips over them.

```quiz
[
  {
    "q": "A comment says a function 'returns null when no results', but the code now returns an empty array. What will an agent most likely do?",
    "options": ["Write new code that checks for null, introducing a bug", "Ignore the comment and read the code", "Fix the comment automatically", "Refuse to edit the file"],
    "answer": 0,
    "explain": "LLMs weight the text heavily. A stale comment is a confident lie the agent will build on."
  },
  {
    "q": "You've corrected the agent about using npm instead of yarn once. What should you do?",
    "options": ["Nothing yet. Write it down if it happens a third time", "Write a skill for package management", "Add a paragraph about package managers to every file", "Switch to npm"],
    "answer": 0,
    "explain": "Rule of three. Writing rules for problems you don't have yet is how instruction files rot."
  }
]
```

```scenario
{
  "who": "A senior engineer on your team",
  "setting": "Code review. Your PR removes most of the comments from a module the agent maintains.",
  "ask": "Why would you delete comments? Comments are good practice.",
  "note": "Pick the reply you'd actually give.",
  "options": [
    { "text": "In this module the main reader is an agent, and agents treat comments as truth. Two of these were already wrong. I moved the real intent into test names and one line in AGENTS.md, so it fails loudly when it drifts.", "verdict": "best", "feedback": "Concrete evidence (stale comments), plus where the intent went instead. That's a tradeoff argument, not a vibe." },
    { "text": "Comments are outdated now that AI writes the code.", "verdict": "weak", "feedback": "A slogan. It invites the obvious follow-up: then how does anyone know what the code is for?" },
    { "text": "I can put them back if you want.", "verdict": "ok", "feedback": "Keeps the peace, but you haven't explained the real risk. The next stale comment will cost someone a debugging session." }
  ],
  "debrief": "Comments aren't evil. Unverified text that an agent will trust is the problem. Put intent where it gets checked."
}
```

## Lab, part 1: fix the instructions file

1. Go through Driftwood's `CLAUDE.md` line by line. Sort every line into one of three piles: true and needed on every task, true but not needed, and false. Check the ones you aren't sure about against the code. Don't ask the agent to sort them yet.
2. Now ask your agent to do the same audit, citing the file that proves each line right or wrong. Compare lists. Where did it trust the file over the code?
3. Rewrite the file. Aim for under 20 lines. Every line should be something you've had to correct the agent about, or something that would cost real money to get wrong.
4. Start a **new session** and ask the three questions from your first tour again: what port, what test command, which package manager. Did the answers change?
5. Pull out the list of stale docs you made during your onboarding ticket. Fix them or delete them. An agent will read those too.

## Lab, part 2: write your first skill

Look back over the course so far. What have you told your agent three or more times about this repo? How to get a staff token and call the API, how you want a bug fix proven, how you want a migration added and applied.

1. Write the `SKILL.md` yourself first. Keep it short enough that a teammate can read it in a minute.
2. Ask your agent to improve it. Reject anything that makes it longer without making it clearer.
3. Open every link in it. Delete any that don't work.
4. Start a **new session** and give it a task the skill should apply to. Don't mention the skill. Does the agent use it?

## Key takeaways

- Write things down for the agent after the third correction, not before.
- Facts go in the instructions file, procedures go in skills, and both stay short.
- The main reader of your codebase is increasingly an agent, and agents believe what text tells them.
- Put intent in names and tests, which fail when they drift, instead of comments, which don't.

## Work with AI

```ai-prompt
title: Audit my repo for text that will mislead an agent
---
Scan this repo for comments, TODOs and instructions in CLAUDE.md or AGENTS.md that no
longer match the code. For each one, show the comment, show the code it describes, and
explain how an agent might be misled by it. Then propose: delete it, turn it into a test
name, or move it to a single line in AGENTS.md. Don't change anything until I approve.
```
