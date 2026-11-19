# Capstone: Choosing It and Writing the Proposal

> **In this lesson:** what your capstone has to include, how to find an idea that's yours and small enough to finish, and how to write the proposal your mentor approves before you build. You'll prove your data source works before you commit to it, and you'll name the one technology you'll learn on your own.

## Words you need first

- **Capstone.** The last project of the program. You choose it, you build it, and you defend it.
- **Data source.** Where your app's information comes from: a public API, an open dataset, pages you're allowed to collect, or data you own.
- **Agent.** In your app, code that gives a language model a goal and some tools, which are functions it may ask your code to run, and lets it work through the steps.
- **Scope.** What's in the project and, just as important, what isn't.
- **Proposal.** A short document that says what you'll build, why, how you'll know it works, and what could go wrong.

## The four requirements

Every capstone has all four. Each one is there because it's something a hiring team will ask you about.

### 1. A real data source that you find

Your app works on real information that you went and found: a public API, an open government dataset, a public data feed, pages you're allowed to collect, or data you own, such as exports from a tool you use.

Fake data in a JSON file doesn't count. Real data is messy. It has missing fields, odd formats, rate limits and outages, and dealing with that is most of the engineering. It's also what makes the project yours: nobody else will have picked the same source for the same problem.

If you collect pages from a website, which is called scraping, read its terms and its `robots.txt` file first, go slowly, and don't collect personal information. If the terms forbid it, pick another source.

### 2. At least one agent doing real work, with checks

Calling a model from code is the first thing the capstone part teaches, so you don't need to know how yet. You need to know what you're aiming at.

An **agent** here is a loop. Your code gives a model a goal and a list of **tools**: functions, such as `searchListings` or `draftReply`, that the model may ask your code to run. The model picks a tool, your code runs it and hands back the result, and that repeats until the job is done.

**Real work** means the agent produces or changes something a person relies on: it sorts, extracts, drafts, reconciles or plans. A chat box that answers questions about your data is not enough on its own.

**Checks** means you can show it works and stop it doing damage:

- **Its output is checked** before anything uses it. If it must return a list of dates, your code confirms it did.
- **Example cases**, a set of inputs with answers you know are right, that you run like tests to measure how often it gets them right.
- **Limits** on steps, time and cost, so it can't loop forever or spend without end.
- **A person approves** anything risky: sending a message, spending money, deleting something.

### 3. One technology the program never taught

Learning a tool from its documentation alone, with nobody to walk you through it, is a large part of the job. So pick one technology that the program didn't cover, learn it yourself, and make it do something your project depends on.

Kinds of thing that work well: a search engine, a realtime library, a mapping service, a payments system in test mode, a mobile framework, a vector database, a background job framework, or a second language for one part. Your mentor knows what the program covered and approves your choice. They'll say no if it was already taught, if it's decoration the project would work fine without, or if it's so large it would swallow the project.

### 4. Deployed, tested and defended

- **Deployed** at an address your mentor can visit, the way you did in the deploy project.
- **Tested**: your own tests, run on every pull request, plus the agent's example cases.
- **Defended**: a README a stranger can follow, a design doc with your decisions and what each one cost, a live walkthrough with your mentor, and a recorded demo. You'll be asked why you built it this way, and "the agent did it" is not an answer.

## Finding an idea

The best capstones come from something you already know well.

- **Your previous work.** If you were a nurse, a teacher, an accountant or a product manager, you know problems in that work that software people don't. That knowledge is your advantage over a computer science graduate. Use it.
- **Something you do.** A sport, a hobby, a community, a side business.
- **Something that annoys you every week.** A task you do by hand that has data behind it.

Write down five ideas without judging them. Then test each one.

## Small enough to finish

Almost every capstone that fails was too big. Three tests:

- **One sentence.** "It helps a dog groomer answer booking requests by checking the calendar and drafting replies for the owner to approve." If you need two sentences and the word "platform", it's too big.
- **One user, one job.** Who exactly uses it, and what single job does it do for them? Not "small businesses". One kind of person.
- **One loop.** Data comes in, the agent does its work, a person sees a result. Everything else is out of scope for the first version.

Here's what shrinking an idea looks like:

| Too big | Right size |
| --- | --- |
| An AI assistant for small businesses | For one dog groomer: reads booking requests from a form, checks the calendar, drafts a reply with free slots for the owner to approve |
| A platform for job seekers | Pulls new posts from three public job feeds each morning, scores each against my resume with a short reason, and sends me a digest |
| A trading bot that buys and sells stocks | Reads a company's public filings each quarter and flags what changed in the risk section, with links to the exact paragraphs |
| An app for my whole city | Groups new public complaint reports for one neighborhood into issues and drafts a weekly summary, every claim linked to its source reports |

Notice the right-size versions keep a person in charge of anything risky, and each one has a data source you can check exists today.

```match
{
  "title": "What's wrong with this proposal?",
  "note": "Tap the idea, then its biggest problem.",
  "pairs": [
    { "left": "A marketplace for freelancers with payments, reviews, messaging and an AI matcher", "right": "Far too big to finish" },
    { "left": "A recipe planner using a recipes.json file the student wrote", "right": "The data isn't real" },
    { "left": "A chat box that answers questions about a dataset, and nothing else", "right": "The agent does no real work" },
    { "left": "A project using a new charting library to draw one chart nobody needs", "right": "The new technology is decoration" }
  ]
}
```

## Prove the risky parts first

Before you write the proposal, spend a little time on the two parts most likely to sink you. This is called a **spike**: a quick, throwaway experiment to find out if something is possible.

- **The data.** Fetch real data from your source and save a sample in your repository. Check the rate limits, whether you need a key, and whether the fields you need are actually there. If you can't get usable data after two sittings, pick another source. That's a cheap discovery now and an expensive one in the middle of building.
- **The new technology.** Get its smallest example running. If you can't get "hello world" working from its documentation after two sittings, it's the wrong choice, or you need to ask your mentor about it.

## Write the proposal

Make a new public GitHub repository for your capstone, separate from `parsity-labs`, because this is the project you'll show employers. Put the proposal in it as `PROPOSAL.md`, so its history starts with the plan. Keep it short. If a section takes more than a few paragraphs, you're hedging.

```
# <Project name>

## In one sentence

## Who it's for, and the problem
One kind of person, and the job you do for them. How do they do it today?

## The data source
What it is, how you get it, any key or rate limit, and a link to the sample you saved.
What will you do when it's down or returns something odd?

## The agent
Its goal. Its tools, each one a function with a one-line description.
Its checks: how its output is checked, your first five example cases,
its limits on steps and cost, and what it must never do without a person approving.

## The new technology
What it is, what your project uses it for, and why the project needs it.
What you got working in your spike.

## The first version
The must-haves, as a short list.
Out of scope: what you're choosing not to build.

## Milestones
Three to five, each one something you could show working.

## Risks
The two things most likely to go wrong, and your plan B for each.

## Cost
Roughly what model calls and hosting will cost a month at the size you expect.
```

Write it yourself. An agent may read it afterwards and ask you hard questions. It may not write it, because the proposal is where you show you understand what you're about to build.

```scenario
{
  "who": "Your mentor",
  "setting": "Reviewing your first proposal.",
  "ask": "I count three apps in here: a scraper, a dashboard, and a chat assistant. Which one is the project?",
  "options": [
    { "text": "You're right. The one I care about is the weekly summary the agent drafts from the scraped reports. The scraper is how data gets in, so it stays, small. The dashboard and chat go to out of scope. I'll rewrite the first version around that one loop.", "verdict": "best", "feedback": "It picks the loop that matters, keeps only what that loop needs, and moves the rest out of scope in writing." },
    { "text": "I think I can do all three if I work weekends. The agent will write most of the code.", "verdict": "weak", "feedback": "An agent writes code fast and you still have to review every line, test it and defend it. Three apps means three times the decisions to explain and three half-finished things to demo." },
    { "text": "Can I keep all three but make each one simpler?", "verdict": "ok", "feedback": "Better than keeping them full size, but three thin things make a weak demo. One complete loop, done well, is what impresses in an interview." },
    { "text": "Which one do you think I should keep?", "verdict": "ok", "feedback": "Asking is fine, and your mentor will help. But it's your capstone. Come with a choice and a reason, and let the mentor push on it." }
  ]
}
```

## Hand it in

Send your mentor the link to your capstone repository with `PROPOSAL.md` and your data sample in it. **Your mentor reads and checks it.** They'll approve it, or send it back with questions, and they approve your new technology specifically. Expect at least one round of changes. That's normal, and it's far cheaper than changing direction halfway through the build.

Don't start building the full project until the proposal is approved. Spikes are fine.

```quiz
[
  {
    "q": "Which agent fits the capstone's 'real work, with checks' requirement best?",
    "options": ["An agent that reads new support emails, sorts each into a category with a reason, and drafts a reply that a person approves before sending, measured against 30 example emails", "A chat box that answers any question about the app", "An agent that sends replies to customers automatically with no review", "A button that calls a model once to summarize a page"],
    "answer": 0,
    "explain": "It does work people rely on, its output is checked against known examples, and a person approves the risky step. The others either do no real work, have no checks, or act with no safeguard."
  },
  {
    "q": "Your data source's API needs a paid plan you didn't know about, which you found during your spike. What should you do?",
    "options": ["Look for another source now, or check with your mentor, before writing the proposal around it", "Write the proposal anyway and hope for a free option later", "Make up data in the same format", "Drop the data requirement"],
    "answer": 0,
    "explain": "That's exactly what a spike is for. Finding it now costs a day. Finding it halfway through the build costs the project."
  },
  {
    "q": "Why does the program ask for one technology it never taught?",
    "options": ["Because learning a tool from its documentation, with nobody walking you through it, is a big part of the job", "To make the project longer", "Because the taught tools are out of date", "So the project uses as many tools as possible"],
    "answer": 0,
    "explain": "Teams constantly adopt tools nobody on them has used. Showing you can learn one alone, and use it for something that matters, is strong evidence in an interview."
  }
]
```

## Key takeaways

- Four requirements: a real data source you find, an agent doing real work with checks, one technology the program never taught, and a project that's deployed, tested and defended.
- Start from something you know well. Your previous work is an advantage.
- Small enough means one sentence, one user and one job, and one loop.
- Spike the data and the new technology before you propose. Finding a dead end early is cheap.
- The proposal is yours: who it's for, the data, the agent and its checks, the new technology, what's out of scope, milestones, risks and cost.

## Work with AI

```ai-prompt
title: Find the hole in my capstone idea
---
I'm choosing a capstone project. It must use a real data source I find, include at
least one agent (a model with tools) doing real work with checks, use one technology
my program never taught, and be deployed, tested and defended. I'll describe my idea
in a few sentences. Don't improve it or suggest a better one. Ask me one question at
a time, waiting for each answer, about: whether I can actually get the data, what the
agent does that a person relies on, how I'd know the agent is right, what could go
wrong if it's wrong, and what I'd cut if I had half the time. After six questions,
tell me the single biggest risk in my idea, in two sentences.
```
