# Start Here: How This Program Works

> **In this lesson:** what you're going to learn, how the work runs, what "passing" means, and why you'll write some code by hand even though an agent will write most of it. No setup yet. That starts in the next lesson.

## Words you need first

- **Coding agent.** An AI tool that reads your files, writes code and runs commands on your computer when you ask it to. Claude Code is the one we recommend.
- **Project.** A larger piece of software you build over a few lessons, in parts called milestones.
- **Hidden tests.** Tests we run on your work that you can't see. They check the cases people tend to forget.
- **Mentor.** A working software engineer you meet one on one.

## What this program is

Most places that teach programming spend months on syntax. Where the brackets go. Which method does what.

An AI coding agent already knows all of that, in every language, and types faster than you ever will.

So you won't spend months on syntax here. You'll spend them on the things that don't go out of style and that an agent can't do for you:

- **How computers, networks and databases actually work.** You can't direct work you don't understand.
- **How to build real software with an agent** and prove it works, instead of hoping.
- **How to make decisions and defend them.** One database or two? A server or serverless? Build the login or buy it?
- **How to get hired.** Interviews haven't caught up with how the work is done, so you'll prepare for them as their own skill.

You don't need any coding experience to start. If you're comfortable on a computer, you're ready.

## What you'll build

Eight projects. Each one is hard because it's open-ended, and because it has to pass tests you can't see.

1. Your own toolkit of data structures, by hand, with no agent
2. A web server, built up from a raw network connection
3. One app built three ways
4. An order system that has to survive two orders arriving at the same moment
5. Login done three ways, attacked by a test suite
6. One app deployed two ways
7. A notification system that keeps working when the other side goes down
8. A capstone that's yours: real data, an agent, and one technology we never taught you

## How the work runs

You go at your own pace. Some people finish in as little as 12 weeks. Others take most of a year. We support you for up to 12 months.

Most of the time you have two kinds of work going at once.

| Kind | What you do | How it's checked |
| --- | --- | --- |
| Build | The next piece of your current project | Your own tests, then our hidden tests. Your mentor reads your decision memos |
| By hand | A problem or two written by you, with no agent | Your own tests, then our hidden tests |

Now and then a lesson also asks you to **explain**: record a short video where you talk through an idea and draw it. Those only show up where saying it out loud really helps. The first one comes early.

You have up to 12 one-on-one sessions with a mentor. Your mentor is a working engineer. They don't grade you. They listen to you explain what you built, tell you where your understanding is thin, and help you get unstuck.

There are weekly office hours and a guest speaker every month.

## What passing means

- A project passes when its tests pass. That includes a second set of tests you can't see. When one of those fails, you're told what kind of case failed, not the test itself.
- You can fix and resubmit as many times as you need.
- Do the projects in order, because each one builds on the last. Lessons and by-hand problems stay open, so being stuck on a project never stops you learning.
- There are no deadlines inside the program. Miss a week and you pick up where you stopped.

Some lessons end with a **stretch**: a harder extra that's clearly marked and never graded. It's there if you want to reach. Skipping it never holds you back.

## Why write code by hand at all?

Fair question, since an agent will write nearly all of your project code.

Two reasons.

**You can't judge what you can't read.** An agent will hand you code that looks right and is wrong. The only way to catch it is to know what right looks like, and you learn that by writing small things yourself.

**Interviews still ask for it.** Many companies will hand you a problem and watch you solve it with no AI. That may be out of date. It's also the door you have to walk through.

So the by-hand work is small and steady: a problem or two at a time, getting harder slowly. For the interview problems, use any language you like.

## When the agent arrives

For the whole first part of the program, the setup lessons, the basics and your first project, no agent writes any code for you. You can ask an AI to explain an idea or an error message. You write every line.

The agent arrives in the second part, in two lessons on setting one up and working with it. Any coding agent is allowed. We recommend Claude Code, and the examples use it. From then on the agent writes most of your project code, and two rules never change: you plan the change before it writes anything, and you read every line it changes before you keep it.

## Why you'll sometimes explain on video

If you can't explain something simply, you don't understand it yet. Explaining out loud is the fastest way to find the hole.

It will feel awkward the first few times. Record it anyway, especially when it's rough. Rough videos are where the learning is.

There's a career reason too. In interviews, and at work, you'll be asked to explain what you built and why. You're practicing that from the start.

```quiz
[
  {
    "q": "Your project passes every test you can see, but the grader says a hidden category failed: \"two requests at the same moment\". What do you do?",
    "options": ["Work out what happens in your code when two requests arrive together, fix it and resubmit", "Ask for the hidden test so you can make it pass", "Move on to the next project", "Rewrite the whole project"],
    "answer": 0,
    "explain": "The category tells you what kind of case you missed. Finding it yourself is the skill. You can resubmit as often as you need."
  },
  {
    "q": "Why does this program have you write some code by hand when an agent writes your projects?",
    "options": ["So you can read and judge what the agent writes, and because interviews still test it", "Because agents can't write algorithms", "To slow you down", "Because typing is the main skill of a developer"],
    "answer": 0,
    "explain": "Small by-hand work builds the judgment you need to direct an agent, and it prepares you for interviews that don't allow one."
  },
  {
    "q": "What is your mentor for?",
    "options": ["Hearing you explain your work, finding where your understanding is thin, and getting you unstuck", "Grading every assignment", "Writing code for you", "Checking your attendance"],
    "answer": 0,
    "explain": "Tests check your work. Your mentor is the person who listens, pushes on what you said, and has done the job."
  }
]
```

## Key takeaways

- You're here to understand how software works and to direct an agent that builds it. Syntax is not the goal.
- Two kinds of work: build and by hand. Sometimes a video where you explain. Plus up to 12 sessions with a mentor who has done the job.
- No agent writes code until the agent lessons. After that, you plan first and review every line it writes.
- Passing means the tests pass, including ones you can't see. Resubmit as often as you need.
- By-hand work and the explanation videos are how you prove, to yourself first, that you understand what got built.

## Work with AI

```ai-prompt
title: Tell me what I'm getting into
---
I am starting a self-paced program to become a software engineer. I have no
coding experience. I'll learn how computers, networks and databases work, build eight
projects with an AI coding agent, write small problems by hand and sometimes record a
short video explaining what I learned. Ask me five questions, one at a time, about my
schedule, what I do for work now, why I'm doing this and what worries me most. Then
give me a short, honest list of the three habits that will matter most for someone in
my situation. Don't flatter me.
```
