# Career: Your LinkedIn Profile

> **In this lesson:** how to write a LinkedIn profile that tells a hiring manager, in the few seconds they give it, what you build and why they should keep reading. You'll write a headline and an about section, list your projects, and start posting once a week from five templates. You'll also learn why likes don't matter, and what does. Your mentor goes through it with you against a checklist.

## Words you need first

- **Headline.** The line under your name. It shows up everywhere your name does: search results, comments, connection requests.
- **About section.** A few short paragraphs near the top of your profile, in your own voice.
- **Recruiter.** Someone whose job is finding people to hire. Some work inside one company, others for agencies that fill jobs for many.
- **Post.** Something you share to your feed for the people you're connected with, and the people they're connected with, to see.

## What a profile can and can't do

A good profile won't get you hired. Nothing on this page will. What it does is make the next step more likely: a recruiter's search finds you, a hiring manager who got your resume clicks through and keeps reading, someone you messaged checks you out and writes back.

People skim. Most visitors read your headline, the first lines of your about section, and maybe one project. Write for that reader first.

As a career changer, your profile has one extra job: it has to make the change make sense. Your previous career isn't something to hide. A product manager who can build an API, or a nurse who built a scheduling tool, is more interesting than someone with neither background.

## Your headline

A useful pattern: **what you do now, what you build, and one thing that makes you different.**

| Weak | Why it's weak | Stronger |
| --- | --- | --- |
| Aspiring developer seeking opportunities | Tells them what you want and nothing about what you do | Software engineer building APIs in Node and Postgres. Former product manager |
| Passionate coder and lifelong learner | Every profile says this | Software engineer. I build back ends with coding agents and test them like an attacker would |
| Full stack, React, Node, Python, Java, AWS, Docker, Kubernetes | A list of words, half of which you'd struggle to defend | Software engineer working in TypeScript, React and Postgres. Ten years in logistics before that |

You build software, so "software engineer" describes what you do. What you shouldn't do is imply a job you haven't had. Never write a company name or a job title you didn't hold.

```match
{
  "title": "What's wrong with each line?",
  "note": "Tap the headline, then its problem.",
  "pairs": [
    { "left": "Aspiring software engineer | Open to work", "right": "Says what you want and nothing about what you can do" },
    { "left": "Senior engineer at Parsity", "right": "Claims a job you didn't have" },
    { "left": "Coding ninja and tech enthusiast", "right": "Words that tell the reader nothing" },
    { "left": "JavaScript, Python, Go, Rust, C++, Kotlin, Swift", "right": "A list you couldn't defend in an interview" }
  ]
}
```

## Your about section

Three or four short paragraphs, in the first person. Keep it under about 200 words.

1. **What you do now.** One or two sentences. What you build and how.
2. **Proof.** Your two strongest projects, each in a sentence, with the hard part. Numbers and specifics beat adjectives.
3. **Where you came from.** Your previous career, and one way it makes you better at this one.
4. **What you're looking for.** The kind of role and team. Optional, and one sentence if you include it.

An example:

> I build back-end software with coding agents: I plan the feature, the agent writes most of the code, and I review every line and write the tests that try to break it.
>
> My last project added login to an orders API three ways, with sessions, signed tokens and a login provider, and had to survive a suite of attack tests. Before that I built an order system that stays correct when two customers buy the last item at the same moment.
>
> I spent eight years running warehouse operations, which is why I care about what happens when things go wrong at scale.
>
> I'm looking for a back-end or full-stack role on a team that ships often.

Notice what's missing: "passionate", "self-starter", "fast learner". Show those with what you built instead.

## Listing your projects

Each finished project gets an entry. Use the **Projects** section of your profile, or one **Experience** entry for this program with your projects underneath. Pick one and be consistent.

For each project:

- **Title.** What it is, plainly. "Auth three ways: login for a multi-customer orders API."
- **One line on what it does.**
- **One line on the hard part.** "Passes a hidden suite of attack tests: tampered tokens, session fixation, reading another customer's data."
- **One line on a decision and its cost.** "Chose sessions for the web app because they log out instantly. The cost is a lookup on every request."
- **A link** to the repository.

The link only helps if the repository is readable. Before you link it, make sure its README says what the project is and how to run it, and pin your best repositories on your GitHub profile.

## A post for each finished project

Every time you finish a project, write one short post about it. Over the program that's a steady record of real work, and posts are what show up in other people's feeds.

Build it from the story you already tell your mentor: **what you built, the hardest part, and one decision with its cost.** Add one thing you learned, and stop.

> Finished a project where I added login to the same API three ways: my own sessions, my own signed tokens, and then a login provider.
>
> The hardest part was a hidden test suite that attacked it. My first version let a staff member move an order to another company by adding one field to a request. The fix was one line. Finding it took an evening.
>
> The decision I'd defend in an interview: roles and customers stay in my database even with a login provider. The provider knows who you are. Only my app knows what you're allowed to touch.
>
> What I learned: a passing test only proves what it checks.

Rules for every post:

- **True and specific.** Real numbers, real bugs, real decisions.
- **Short.** If it needs a "see more" click, the first two lines have to earn it.
- **One picture if you have one:** a diagram you drew, or a short screen recording of it working.
- **Skip the hype.** No "thrilled to announce", no wall of hashtags.
- **Never post secrets.** No keys, no customer data, no screenshots of your `.env` file.

```scenario
{
  "who": "A friend who works in tech",
  "setting": "You mention you're going to post about your first finished project.",
  "ask": "I wouldn't post anything until you're actually good. People will judge beginner stuff.",
  "note": "More than one answer is defensible. Pick the one you'd actually say.",
  "options": [
    { "text": "I'll keep it honest and specific: what I built, what was hard and what I'd change. People who hire seem to like seeing the work and the thinking, even early on.", "verdict": "best", "feedback": "You took the worry seriously and answered it with how you'll post. Specific, honest posts about real work rarely read as beginner noise." },
    { "text": "You're probably right, I'll wait until the capstone.", "verdict": "ok", "feedback": "Safe, and the capstone will be your strongest post. You'll also have months of silence, and a much harder first post to write." },
    { "text": "Everyone exaggerates on LinkedIn anyway, so I'll make it sound bigger than it is.", "verdict": "weak", "feedback": "An interviewer will ask about it. Anything you inflated becomes the thing you have to defend." }
  ],
  "debrief": "Posting about real work, in plain words, is how people who don't know you yet get to see how you think."
}
```

## Why you post, and why likes don't matter

Getting famous on LinkedIn or X is a silly goal if what you want is a job. You don't need a big following. You need the right people to see real work.

So the goal of every post is to **show technical depth and show your work.** Not to collect likes, and not to get sympathy for the hundredth rejection.

Three reasons to post anyway, even if you hate it:

- **Recruiters filter for it.** Recruiters search LinkedIn with a paid tool, and one of its filters shows only people who posted recently. Very few people post. One post a week puts you near the top of that list.
- **It makes you findable for the right reason.** When a hiring manager looks you up after seeing your resume, a few posts about real bugs and real decisions do more than any headline.
- **It's how you meet people.** A post gives someone a reason to comment, and a comment gives you a reason to start a conversation.

What doesn't work:

- Posts that romanticize rejection ("Just bombed my 101st interview. Who can refer me?").
- Messages to strangers asking them to look at your resume or refer you.
- Long blocks of text full of big words. Write the way you talk, in short lines.

What does work:

- Posts that share what you're learning, including what you're stuck on.
- Comments on other people's posts that add something. Comment more than you post.
- Messages where you give first: a link that helps them, a real compliment on something they built, a question about their work.

Write what you actually think. People can tell when you're faking it.

## Five templates to start from

The hardest part is starting. These templates take the blank page away. Fill in the parts in double curly braces with something true from your own work. Change the wording until it sounds like you.

**1. "So I thought..."** Use it when something surprised you.

```text
So I thought {{technology}} was supposed to {{popular opinion}} but {{unexpected experience}}.

Here are my 3 takeaways so far:
1. {{thing}}
2. {{thing}}
3. {{thing}}

Curious, what's been your experience with {{technology}}?
```

> So I thought wrapping my order code in a transaction would stop two customers buying the last item. It didn't. My test still sold it twice.
>
> Here are my 3 takeaways so far:
> 1. A transaction doesn't mean "nobody else can touch this row"
> 2. One UPDATE with a condition in it fixed what twenty lines of checks couldn't
> 3. I only found it because a test fired two orders at the same moment
>
> Curious, what's been your experience with race conditions?

Put a link to your repository in the first comment, not the post.

**2. "The hardest part nobody talks about."** Use it for the unglamorous part of the work.

```text
The hardest part about {{common thing}} that no one talks about?

{{Unexpected thing}}.

So now, instead of {{normal activity}}, I'm:
- {{unexpected thing}}
- {{unexpected thing}}
- {{unexpected thing}}

{{A question about one of those things}}
```

> The hardest part about building a web app that no one talks about?
>
> Deploying it.
>
> So now, instead of writing code, I'm:
> - Reading logs to find out why it works on my laptop and not on the server
> - Making sure my environment variables are actually set
> - Clicking through the whole site by hand before every release
>
> What's the best way you've found to check a site before you ship it?

**3. "I've done this a few times now."** Use it once you have a number of something.

```text
{{A specific number of times you've done a thing}}.

Here are my {{x}} takeaways:
1. {{observation}}
2. {{observation}}
3. {{unexpected or contrary observation}}

Hope that's helpful.
```

> Just did my fifth technical interview since I started looking.
>
> Here are my 3 takeaways:
> 1. Closures and promises come up a lot
> 2. Coffee right before an interview is a bad idea
> 3. Nobody has asked to see my portfolio. Every one of them asked about a decision I made
>
> Hope that's helpful.

**4. "What no one tells you."** Use it when you have opinions after doing something for real.

```text
What no one tells you about {{thing}}:
- {{observation}}
- {{observation}}
- {{observation}}
- {{contrary observation}}

What advice would you give someone just starting {{this thing}}?
```

> What no one tells you about writing tests:
> - You don't have to write them first every time
> - The hardest part is setting them up
> - Once you've tested a few common cases, most other tests can reuse that setup
> - You don't need 100% coverage. I had 100% and my tests still missed a bug
>
> What advice would you give someone just starting to write tests?

**5. "Still wrestling with it."** Use it when you're stuck. These often get the most helpful replies.

```text
Wrestled with {{technology}} for the last {{amount of time}} trying to {{goal}}.

If you were expecting this to be a story of my triumph... well, it hasn't happened.

Yet.

I still have a few things to figure out:
- {{thing}}
- {{thing}}
- {{thing}}

Yeah, it's been frustrating, and also a lot of fun. I'll report back when I've got them.
```

> Wrestled with deploying my API to a container host for the last two evenings.
>
> If you were expecting this to be a story of my triumph... well, it hasn't happened.
>
> Yet.
>
> I still have a few things to figure out:
> - Why the health check passes locally and fails on the host
> - Where my environment variables actually go
> - How to roll back without losing the data
>
> Yeah, it's been frustrating, and also a lot of fun. I'll report back when I've got them.

## What to write about

You'll never run out, because the program hands you something worth posting every week. Some prompts, roughly in the order you'll hit them:

- A bug that took you an evening, and the one-line fix.
- A hidden test that caught you, and what kind of case it was.
- Something your coding agent got confidently wrong, and how you caught it.
- A decision from one of your memos and what it cost. "Sessions or tokens? I picked sessions. Here's why."
- A design you sketched for 100 times the traffic, with the drawing.
- An interview problem pattern you finally understood, explained in three lines.
- Your deployment: what broke, what you checked, how you rolled back.
- Your previous career meeting your new one. "Eight years in warehouses taught me more about queues than any tutorial."
- A short screen recording of something you built working.
- An honest question. "How do your teams decide what a new engineer works on?"

**On X,** the same rules apply. Posts are shorter, so lead with the one surprising thing and put the details in a short thread or a reply. Build in public: a screenshot and two lines about what you're working on today is enough. Follow and reply to engineers who work on what you want to work on.

Don't post the same thing everywhere word for word. Pick one place to post every week, LinkedIn for most people, and treat the other as optional.

## Your weekly rhythm

From now until you're hired:

- **One post a week.** Pick a day and keep it. Use a template if you're stuck.
- **A few comments most days.** On posts by engineers, hiring managers and recruiters in the areas you want to work in. Say something real: agree with a reason, disagree politely, or ask a question.
- **Grow toward 500 connections.** Under 500, LinkedIn shows you to fewer people. Connect with people you meet, people from the program, people whose posts you comment on, and people from your past career. A short note helps.
- **Curate your feed.** Follow engineers, hiring managers and recruiters. Mute people who only post about how to go viral.

That's a small habit, and it compounds.

## Your turn

1. Create `career/linkedin.md` in your `parsity-labs` repository. Draft everything there first, so you and your mentor can see changes over time.
2. Write your headline, about section, and an entry for every project you've finished.
3. Write a post for each finished project, from its story.
4. Draft four weekly posts from the templates, about things that actually happened in your projects.
5. Update your real profile, publish your first post, and pick your posting day. From here on it's one post a week. If posting publicly isn't possible for you, for example because of your current job, tell your mentor and work out an alternative together.

If you're stuck on the headline for more than 20 minutes, write three bad versions on purpose, then pick the least bad and fix one thing in it.

## Hand it in

Commit `career/linkedin.md` and bring your profile to your next mentor session. Your mentor goes through it with you against this checklist:

- [ ] The headline says what you do now and what you build, with one thing that sets you apart. No "aspiring", no claimed jobs.
- [ ] The about section's first two sentences make sense on their own.
- [ ] Every project names a hard part and a decision, and links to a repository with a readable README.
- [ ] Your previous career is there, and connected to the new one.
- [ ] Each finished project has a post that's true, specific and free of hype.
- [ ] Four drafted weekly posts, each about something real, and the first one published.
- [ ] A posting day, and a plan for a few comments most days.
- [ ] A plan to reach 500 connections.
- [ ] Nothing claims more than you did, and you can talk about every line for two minutes.
- [ ] No secrets, keys or private data anywhere.

```quiz
[
  {
    "q": "Which headline does the most work for a career changer?",
    "options": ["Software engineer building APIs in Node and Postgres. Former product manager", "Aspiring software engineer, open to work", "Passionate lifelong learner in tech", "Engineer at Parsity"],
    "answer": 0,
    "explain": "It says what you do and what you build, and turns the old career into a strength. The others say what you want, say nothing, or claim a job you didn't have."
  },
  {
    "q": "What's the best source for a post about a finished project?",
    "options": ["The project story you tell your mentor: what, the hardest part, and a decision with its cost", "A list of every technology you used", "The project's test output", "A summary an agent wrote from your repository"],
    "answer": 0,
    "explain": "The story already holds what makes a post worth reading: something hard and a decision you can defend. It also matches what you'll say in interviews."
  },
  {
    "q": "A recruiter clicks through from your post to your project repository. What should they find?",
    "options": ["A README that says what it is, how to run it and what was hard", "Only the code, since good code explains itself", "A private repository", "Your .env file, to prove it works"],
    "answer": 0,
    "explain": "Most people who visit won't run anything. The README is what they read, so it has to tell the story on its own."
  }
]
```

## Key takeaways

- A profile doesn't get you hired. It makes the next step more likely: a search that finds you, a manager who keeps reading.
- Headline: what you do now, what you build, and one thing that sets you apart.
- Your previous career is an asset. Connect it to the new one.
- Every project gets a hard part, a decision and a readable repository.
- Each finished project gets a short, true, specific post built from its story.
- Post to show your work to the right people, not to collect likes. One post a week, and comment more than you post.
- When you're stuck for something to say, start from a template and fill it with something true.

## Work with AI

```ai-prompt
title: Read my profile like a hiring manager
---
I'm changing careers into software engineering. I'll paste my LinkedIn headline, about
section and project entries. Read them as a busy hiring manager who spends ten seconds
on a profile. Don't rewrite anything. First, tell me what you'd remember about me after
those ten seconds, in one sentence. Then point to the one line that does the most work
and the one line that does the least, quoting each, and ask me a question about the
weakest line that would help me improve it myself. Then pick one project and ask me the
follow-up question an interviewer would ask about it, and wait for my answer.
```
