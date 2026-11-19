# Career: Your LinkedIn Profile

> **In this lesson:** how to write a LinkedIn profile that tells a hiring manager, in the few seconds they give it, what you build and why they should keep reading. You'll write a headline and an about section, list your projects, and turn each finished project into a short post. Your mentor goes through it with you against a checklist.

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

## Your turn

1. Create `career/linkedin.md` in your `parsity-labs` repository. Draft everything there first, so you and your mentor can see changes over time.
2. Write your headline, about section, and an entry for every project you've finished.
3. Write a post for each finished project, from its story.
4. Update your real profile and publish the posts when you're happy with them. Publishing is your call. Drafting them isn't optional.

If you're stuck on the headline for more than 20 minutes, write three bad versions on purpose, then pick the least bad and fix one thing in it.

## Hand it in

Commit `career/linkedin.md` and bring your profile to your next mentor session. Your mentor goes through it with you against this checklist:

- [ ] The headline says what you do now and what you build, with one thing that sets you apart. No "aspiring", no claimed jobs.
- [ ] The about section's first two sentences make sense on their own.
- [ ] Every project names a hard part and a decision, and links to a repository with a readable README.
- [ ] Your previous career is there, and connected to the new one.
- [ ] Each finished project has a post that's true, specific and free of hype.
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
