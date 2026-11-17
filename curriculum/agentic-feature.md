# Ship a Feature Across Two Apps

> **In this lesson:** your first real build. Customers want to see an estimated delivery date in the portal. The data exists for a moment inside the API and is then thrown away. You'll plan the feature on one page before any code exists, break it into tickets, and direct your agent through a change that touches the database, the API and the front end, one piece at a time.

## Why features go wrong with agents

Bugs come with a target: make this stop happening. Features come with a paragraph from product and a lot of decisions nobody wrote down.

Hand that paragraph straight to an agent and you get a feature. It'll run. It'll also contain a dozen decisions the agent made silently: where the data lives, what happens to old orders, what the date means. You find them in production.

You drive the architecture. On a feature, that means making those decisions before the agent starts typing.

## Plan it, split it, build one piece at a time

**1. Write a one-page plan.** Yourself, in plain words. Not the agent.

- What the user sees, and when. Including when they see nothing.
- Where the data comes from and where it's stored.
- The decisions and why you made them.
- What's out of scope.
- How you'll know it works.

Then ask your agent to poke holes in it. Use plan mode or tell it not to write code. Good questions from the agent are worth more than fast code.

**2. Break it into tickets.** Each one small enough to review in one sitting, and ordered so each can be verified on its own.

**3. One ticket at a time.** Build, run it, read the diff, commit. Then the next. If you let the agent do all four at once, you review one giant diff, and you'll skim it.

**4. Prove it end to end.** A feature that crosses services needs a check that crosses them too: a real browser, a real login, the real date on the page.

```order
title: A feature that crosses services, in a safe order
---
Write the plan and decide the open questions
Add the database column with a migration
Capture and store the value in the API
Expose it on the route the portal calls
Show it in the portal
Run an end-to-end check in a real browser
```

Each step works without the ones after it. That's what makes it reviewable.

## Lab: estimated delivery date

Open [`docs/exercises/feature-order-eta.md`](https://github.com/projectshft/driftwood-ops/blob/main/docs/exercises/feature-order-eta.md). Sarah wants the portal's order page to say something like "Estimated delivery: Nov 18" once an order has shipped.

**Understand it first.** Read-only.

1. Ask your agent to trace how shipping gets quoted and how an order gets marked as shipped. Where does `etaDays` appear, and where does it disappear? Have it draw the flow, then check it against `orderService.ts`, the orders and shipments routes, and the rate engine.
2. While it's there, ask it what the comment above the ship route says about the order of operations, and what `SUP-54` in `docs/linear-export` is about. You're about to add to that flow. Don't make it worse.

**Write the plan.** One page. The ticket leaves you real decisions:

3. Quote time or ship time: when do you save the estimate?
4. Is the delivery date counted from when the order shipped, or from when the quote was taken? Pick one and write down why.
5. What does a customer see for an order that hasn't shipped? For one that shipped before your change, with no estimate stored? Most of the orders in your database are in that second group.
6. Calendar days or business days? What does the rate engine's number mean? Check the code. If you can't tell, say so in the plan.
7. Your local rate engine has no carrier to call, so it returns no quotes and no estimate. How will you develop and test this anyway? Decide before the agent decides for you by hardcoding something.

Ask your agent to review the plan and list what's still ambiguous. Fix the plan, not the code.

**Build it.** One ticket at a time, a commit for each.

8. Have the agent turn your plan into four or five tickets with acceptance criteria. Reorder them if you disagree.
9. For each ticket: let it build, run it yourself, read the diff, then commit. The portal and the API are separate apps with separate types. When the API response changes, what tells the portal?
10. Don't let it "fix" the things it finds along the way. `orderService.ts` has a comment that says the file does too much. It does. That's a different ticket.

**Prove it.**

11. Ask the agent to set up [Playwright](https://playwright.dev/docs/intro) and write an end-to-end test: log in to the portal as BrightGear, open a shipped order that has an estimate, and check the date shows. Then one for an order with no estimate.
12. Ask for a [screenshot](https://playwright.dev/docs/screenshots) of the order page at desktop and phone width. Look at them.
13. Break it on purpose. Rename the field in the API response. Does a test fail?
14. Fresh session, review prompt, the full diff. You know the rule.
15. Write the PR description. The ticket asks you to record which date logic you picked and why.

```quiz
[
  {
    "q": "You paste the ticket into your agent and say \"build this.\" It works. What's the main risk?",
    "options": ["It made product decisions silently, like what old orders show, and you don't know what they were", "The code won't compile", "It used too many tokens", "There's no risk if tests pass"],
    "answer": 0,
    "explain": "Working code can still embody choices nobody approved. Write the decisions down first so the agent implements yours instead of inventing its own."
  },
  {
    "q": "Why add the database column before changing the API or the portal?",
    "options": ["Each step can be run and reviewed by itself, and nothing depends on a later step", "Databases are more important", "The agent prefers SQL", "It makes the diff bigger"],
    "answer": 0,
    "explain": "Ordering work so every step stands alone is what keeps each diff small enough to actually review."
  },
  {
    "q": "The agent can't get an ETA locally because the rate engine has no carrier, so it hardcodes `etaDays = 3` in the order service. What should you do?",
    "options": ["Reject it. Decide how local dev gets test data without changing what production code does", "Accept it, it's only local", "Change it to 5", "Remove the feature"],
    "answer": 0,
    "explain": "Agents take the shortest path to a green result. A hardcoded value in the real code path ships to production. Seed data or a test double keeps the fake out of the product."
  }
]
```

## Key takeaways

- On a feature, the decisions are the work. Make them in a written plan before the agent starts.
- Break it into tickets that each run and review on their own, then do one at a time.
- A change that crosses services needs a test that crosses services.
- Watch for shortcuts taken to make something pass locally. They ship.

## Work with AI

```ai-prompt
title: Poke holes in my plan before any code
---
Here is my one-page plan for showing an estimated delivery date on the customer
portal's order page: [paste your plan]. The ticket is in
docs/exercises/feature-order-eta.md. Do not write code. Read the quote flow, the ship
flow and the portal's order page, then act as a staff engineer reviewing the plan.
List every decision I left ambiguous, every case I didn't cover (orders not shipped,
orders shipped before this change, no quote available, time zones), and anything in
the current code that makes my plan harder than I think. Then propose four or five
tickets in a safe order, each with acceptance criteria I can check by running
something.
```
