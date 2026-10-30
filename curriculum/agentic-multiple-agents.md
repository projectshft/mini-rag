# Multiple Agents, Worktrees and Chasing Trends

> **Today:** once one agent feels comfortable, the obvious next thought is "what if I ran five?" You'll learn when that helps, how worktrees keep agents out of each other's way, and how I think about the buzzword of the week. Then you'll write down what you actually think about all of this.

## When more than one agent makes sense

Sometimes five agents is great. Often it's five times the mess.

- **The work is independent.** Three unrelated bugs. A new agent in the registry and a separate fix to the upload route. If two agents would edit the same files, they'll step on each other.
- **You want a second opinion.** One builds, a different one reviews. The most useful multi-agent setup there is, and it only needs two.
- **You're comparing approaches.** Two agents try two chunking strategies. Keep the better one (and measure it, you know how now).
- **Boring work runs in the background.** Upgrading a dependency or writing tests for an old module while you do something else.

## When it doesn't

- The tasks depend on each other. Agent B needs Agent A's output, so you're waiting anyway.
- You can't review fast enough. Five agents opening five PRs an hour that you only skim just gets you a pile of unreviewed code with your name on it.
- You don't know what you want yet. Figure that out with one agent first.

Your review capacity is the real limit, not how many terminals you can open.

## Worktrees

If several agents work in the same repo at once, give each its own copy. [Git worktrees](https://git-scm.com/docs/git-worktree) check out several branches of one repo into separate folders, so each agent gets its own folder, branch and running dev server. No more two agents fighting over the same file.

```bash
git worktree add ../mini-rag-sources -b feature/sources
git worktree add ../mini-rag-reranker -b feature/reranker
```

Start a separate agent session in each folder. Merge through pull requests like you would with any teammate. Many tools will set this up for you now.

```match
{
  "title": "One agent or several?",
  "note": "Tap a situation, then tap the approach.",
  "pairs": [
    { "left": "Fix a bug in the selector and restyle the landing page", "right": "Two agents in two worktrees" },
    { "left": "Add an API field, then build the UI that uses it", "right": "One agent, in order" },
    { "left": "Not sure if hybrid search is worth it", "right": "Two agents, two approaches, measure both" },
    { "left": "Review the PR another agent just opened", "right": "A fresh session that didn't write it" }
  ]
}
```

## Chasing trends (on purpose)

Agentic coding gets a new buzzword about every three weeks. While I was writing this track, people went all in on:

- **Ralph loops.** Running an agent in a loop against a plan file until the work is done ([Geoffrey Huntley's write-up](https://ghuntley.com/ralph/)).
- **Skill maxing.** A skill for everything.
- **Token maxing.** As much context and as many tokens as you can throw at a problem.
- **Harness engineering.** Elaborate custom setups wrapped around the agent.

Some hold up. Plenty don't. Most of them boil down to giving the agent the right context and clear instructions for a task... truly novel.

My non-standard advice: **follow them anyway.** Nobody knows which ideas will last. Me included. These tools are less than three years old.

- Find a few people you trust who build real things with agents. Follow them.
- Try the interesting ideas on a real project, one at a time. Change five things at once and you'll never know what helped.
- Keep what works, drop what doesn't, and write one sentence about why.

Before you take anyone's blanket advice (or worse, parrot it), look at the context they work in. A solo founder's prototype and a bank's payment system need very different habits.

```quiz
[
  {
    "q": "Two agents are working in the same folder on the same branch. What's the most likely problem?",
    "options": ["They overwrite each other's changes and confuse each other's context", "They run out of tokens faster", "Git refuses to let them both run", "Nothing, agents coordinate automatically"],
    "answer": 0,
    "explain": "Same files, same working tree, no coordination. Worktrees give each agent its own folder and branch."
  }
]
```

## Retro: form your own opinions

Stop and write a page, for yourself or to share in Slack. There are no right answers. The point is to notice what you actually think instead of repeating what you read on LinkedIn (including from me).

1. What did you like about working this way? Be specific.
2. Where did it waste your time, confidently lie to you, or make you feel out of control?
3. Name a mistake you caught because you understood the code.
4. What did you stop checking that you probably shouldn't have?
5. Where in your RAG app would more than one agent actually help?
6. What can you imagine building now that you wouldn't have attempted a month ago?

## Key takeaways

- More agents only helps when the work is independent and you can review what they produce.
- Worktrees give each agent its own folder and branch.
- Try the trends sparingly, one at a time, and keep notes on what worked.
- Nobody has this figured out. You're not as far behind as you think.

## Work with AI

```ai-prompt
title: Plan a parallel sprint on my RAG app
---
Here's my backlog for my Next.js RAG app: [paste 4-6 tasks]. For each pair of tasks,
tell me whether they can safely run in parallel in separate git worktrees, based on
which files and modules they'd likely touch. Then propose a plan: which tasks run in
parallel, which must run in order, and which one should get a separate review session.
Be blunt about anything that will collide.
```
