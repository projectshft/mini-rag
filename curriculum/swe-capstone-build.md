# Capstone: Building in Milestones

> **In this lesson:** how to build your capstone one working slice at a time with your coding agent, which tests you write yourself and why, how the weekly check-in works, and how to cut scope without cutting the project. The habits here are the ones you'll use on a job.

## Words you need first

- **Vertical slice.** A thin piece of the product that works from top to bottom: screen, server, database and agent, for one small thing.
- **Check-in.** A short written update on where the project stands, what's blocking you, and what's next.
- **Scope cut.** Deciding on purpose to leave something out, so the rest gets finished.
- **Regression.** Something that used to work and broke because of a later change.

## Build in slices

The tempting way to build is in layers: the whole database, then the whole server, then the whole front end, then the agent. It feels organized. It also means nothing works until the very end, and the last layer is where you find out the first one was wrong.

Build in **vertical slices** instead. Each milestone in your design doc is one or more slices: a thin path through every layer that a person can actually use.

For a repair-tracking app, the first slice might be: a tenant types a repair into one plain form, it's saved, and the agent can answer "what repairs are open in unit 3?" Ugly, small, and real. Every slice after that makes it wider or nicer.

Slices give you three things layers don't:

- Something to show at every check-in.
- Early warning when a piece doesn't fit.
- A project that's always shippable, so a scope cut late on costs you features, not the whole thing.

## The loop for every change

You've worked with an agent on every project since the web server. The capstone uses the same loop, with more at stake because you designed it:

```order
title: One change to your capstone, start to finish
---
Write what the change should do, and how you'll know it works, in a few lines
Make a branch for it
Give the agent the plan and the part of DESIGN.md it touches
Read every line of the diff, and run it yourself
Write or check the tests that prove it works, and see them fail without the change
Commit, open a pull request on your own repo, and merge it when it's green
```

Some habits that matter more on a long project:

- **Small changes.** If a diff is too long to read carefully in one go, the change was too big. Ask the agent for the first half.
- **Keep the agent's context current.** When the design changes, update `DESIGN.md` first, then point the agent at it. An agent working from last week's plan writes last week's code.
- **Check the agent's claims.** "All tests pass" means nothing until you've run them. "I fixed the bug" means nothing until you've seen the bug and then seen it gone.
- **When you don't understand a line, stop.** Ask the agent to explain it, then check the explanation against the docs. You'll be asked about this code in interviews. Code you can't explain is code you can't defend.

## The tests you write yourself

The agent can write tests, and it'll write lots of them. Many will test that the code does what the code does. That proves nothing.

So some tests are yours. You may not type them, but you **choose** them: you decide what case matters, you write the name and the expected result, and you read the test line by line. For your capstone, these are the ones you own:

- **The rules of your domain.** "A tenant can never see another tenant's repairs." "A repair can't go from closed back to new." These are where bugs cost the most, and the agent doesn't know your rules unless you tell it.
- **The agent's tool loop, with a fake model.** The same pattern as the model basics lab: script a model that sends broken arguments, calls a missing tool, or never stops, and check your code survives. These are the ones that catch a 2 a.m. bill.
- **Your data source failing.** The scraper gets a page with no data. The API you pull from returns an error. Your code should say so clearly, not crash or save nonsense.
- **One test per bug.** Every time you find a bug, write a test that fails because of it before you fix it. That's how a bug stays fixed.
- **Your evals.** Run them against the real model at the end of every milestone, and keep the pass rate in your check-in.

One way to check a test is worth having, from the testing lessons: break the code on purpose and see if the test notices. If you delete the line that checks the tenant, and every test still passes, you don't have a test for that rule.

```match
{
  "title": "Who should decide this test?",
  "note": "Tap the test, then who should own it.",
  "pairs": [
    { "left": "A landlord can't close a repair in a building they don't own", "right": "You. It's a rule of your domain, and the agent can't guess it" },
    { "left": "The date formatting helper pads single-digit months", "right": "Fine for the agent to write. You read it" },
    { "left": "The agent stops after six tool calls and tells the tenant it couldn't finish", "right": "You. It's the limit that protects your budget" },
    { "left": "The scraper saves nothing when the page layout changes", "right": "You. It's how your data source fails in real life" }
  ]
}
```

## The weekly check-in

Once a week, while you're building, write a check-in. Add it to the top of a file called `CHECKINS.md` in your capstone repository, commit it, and push. Your mentor reads it.

Keep it short and use the same five headings every time:

```markdown
## Week of 2026-12-07

**Done:** Milestone 2. Tenants can report repairs with a photo. The agent can list
and summarize open repairs. Evals: 7 of 9 pass.

**Not done:** Photo upload on phones. iOS sends a format my resizer doesn't read.

**Blocked on:** Nothing yet. If the photo format isn't fixed by Wednesday, I'll ask in
office hours.

**Changed in the design:** Dropped landlord-to-tenant chat. Moved it to won't-do.
Reason in DESIGN.md under Changes.

**Next week:** Milestone 3: the landlord's view, and the two failing evals.
```

Why bother writing it down?

- **It keeps you honest about pace.** Three check-ins in a row with the same "Next week" line is a signal no one can miss, including you.
- **It's how you get help early.** A blocker written on Monday gets an answer. A blocker you sit on until it's urgent costs you a week.
- **It becomes your project story.** When an interviewer asks "what was the hardest part?", your check-ins have the answer, with dates.

Skipped a week? Write the check-in anyway, saying so. A gap with an honest note is far better than a gap.

Bring the latest check-in to each mentor session, and come with a question.

## Cutting scope

Almost every capstone runs into the same wall partway through: there's more left than there's energy or calendar to do it. That's normal. What separates a finished project from an abandoned one is cutting well.

Cutting well means:

- **Cut features, not quality.** A smaller app that works, with tests, a README and a live link, beats a bigger one that half works. Nobody hiring you will count features. They'll click around and see if it breaks.
- **Cut from the edges.** The core path, the one thing your person comes to do, stays. Settings pages, extra filters and a second kind of user are edges.
- **Keep the requirements.** Real data you found, an agent doing real work with checks, your new technology, and an app that's deployed and tested are what make it a capstone. Cut around them.
- **Write it down.** Move the cut item to the won't-do list in `DESIGN.md` with one line on why. In an interview, "I cut chat to ship the core on time, and here's how I'd add it" is a strong answer.

A rule of thumb: if you're stuck on one feature for more than two sittings, decide that day whether to cut it, shrink it or ask for help. Don't let it quietly eat a week.

```scenario
{
  "who": "You, reading your own check-in",
  "setting": "You have one milestone left in your plan and noticeably less energy than when you started. The landlord dashboard is half built. The agent's evals pass 6 of 10.",
  "ask": "What do I do with what's left?",
  "note": "Pick the plan you'd actually follow.",
  "options": [
    { "text": "Shrink the dashboard to one page that lists open repairs, fix the evals that fail on the core path, and move the charts I'd planned to won't-do with a note.", "verdict": "best", "feedback": "The core path gets solid, the agent gets better where it matters, and the cut is written down so you can talk about it. This is what a working engineer does with a deadline." },
    { "text": "Push through and build the full dashboard. The evals can wait.", "verdict": "weak", "feedback": "The agent is a requirement and the dashboard isn't. Shipping more screens on top of an agent that fails four questions in ten makes the whole thing look broken." },
    { "text": "Spend the time on the evals and leave the half-built dashboard in.", "verdict": "ok", "feedback": "Right priority, but a half-built page in the live app is the first thing a visitor clicks. Either finish a small version or hide it." },
    { "text": "Start over with a simpler idea.", "verdict": "weak", "feedback": "You'd throw away a nearly working project and the story of how you built it. Cutting scope keeps both." }
  ],
  "debrief": "Finishing is a skill. It means deciding what not to do, and saying so out loud."
}
```

## When you're stuck

Long projects get stuck in a different way from short ones. It's rarely one bug. It's a week where nothing moves. Some ways out:

- **Shrink the next step until it's obvious.** "Build the landlord view" is stuck. "Show one hard-coded repair on a page at /landlord" isn't.
- **Time-box it.** Give a problem 45 minutes of real effort. If it's still stuck, write down what you tried and ask: office hours, your mentor, or a classmate.
- **Explain it out loud.** Describe the problem to an empty room or a voice memo, step by step. Half the time you hear the answer.
- **Use the agent to understand, not to escape.** "Explain why this query returns duplicates" teaches you something. "Make the duplicates go away" may hide the bug under a second one.

```quiz
[
  {
    "q": "Why build in vertical slices instead of finishing the database first, then the server, then the front end?",
    "options": ["Because each slice works end to end, so problems show up early and the project is always shippable", "Because databases are the hardest part", "Because the agent can only write one layer at a time", "Because it uses fewer tests"],
    "answer": 0,
    "explain": "Layers mean nothing works until the end, which is where you find out the early layers were wrong. Slices give you something real at every step."
  },
  {
    "q": "The agent wrote 40 tests and they all pass. You delete the line that stops tenants seeing each other's repairs, and they still all pass. What does that tell you?",
    "options": ["None of the tests checks that rule, so you need to write one", "The code is correct", "The tests are too slow", "The agent made a mistake in the line you deleted"],
    "answer": 0,
    "explain": "A test that can't fail when the rule breaks isn't testing the rule. Rules of your domain are the tests you decide on yourself."
  },
  {
    "q": "You're running behind. What's the best thing to cut?",
    "options": ["An extra feature at the edge, written into the won't-do list with a reason", "The tests", "The agent, since it's the hardest part", "The README"],
    "answer": 0,
    "explain": "Cut features, not quality, and never cut a requirement. Writing it down turns the cut into a decision you can explain."
  }
]
```

## Key takeaways

- Build in vertical slices that work end to end, so the project is always shippable.
- Keep each change small enough to review line by line, and keep `DESIGN.md` current so the agent works from today's plan.
- You decide the important tests: the rules of your domain, the agent loop with a fake model, your data source failing, and one per bug.
- A short weekly check-in keeps your pace visible, gets you help early, and becomes your project story.
- Cut features from the edges, never quality or requirements, and write every cut down.

## Work with AI

```ai-prompt
title: Find the tests I'm missing
---
I'm building my capstone with a coding agent. I'll paste two things: the "Must do" and
"Quality bars" sections of my design doc, and the list of test names I have so far.
Don't write any tests. Compare the two and tell me which rules from my design doc have
no test that would fail if the rule broke. For each one, describe in one sentence a
case that would catch it, and ask me what the expected result should be. Wait for my
answer before moving to the next. Then ask me which of my current tests I think would
still pass if the feature were deleted.
```
