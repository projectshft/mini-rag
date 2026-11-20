# Career: A Resume That Sounds Like an Engineer

> **In this lesson:** how to write a one-page resume that reads like it came from someone who builds software. You'll learn what a reader looks for in the first few seconds, how to turn your projects into lines that show judgment, what to do with the career you had before this one, and how to get past the software that screens resumes before a person sees them. Your mentor checks it against a checklist.

## Words you need first

- **Bullet.** One line on a resume describing one thing you did. Most of a resume is bullets.
- **Applicant tracking system (ATS).** The software companies use to collect applications. It turns your resume into text and lets recruiters search and filter it.
- **Keyword.** A word or phrase from the job post, like "PostgreSQL" or "REST APIs", that a recruiter might search for.
- **Recruiter.** The person, often not an engineer, who reads applications first and decides who moves on.

## Who reads it, and how

Your resume is read twice, by two very different readers.

**First, a recruiter, quickly.** They have a stack of applications and spend seconds on each one. They're checking a short list: does this person have the skills in the post, have they built real things, is anything confusing or alarming? They're often not engineers, so plain words win.

**Then, if you get through, an engineer, carefully.** Usually right before your interview. They're looking for things to ask about. Every line is a question you might get, so every line should be one you're glad to answer.

Write for both: easy to scan, and every claim something you can talk about for five minutes.

## The shape

One page. Plain layout, one column, no photos, no graphics, no skill bars with stars. Those confuse tracking systems and tell an engineer nothing.

In this order:

1. **Name and links.** Name, city or "Remote", email, LinkedIn, GitHub, and a portfolio link if you have one. No full street address.
2. **One-line summary.** Optional. If you use one, make it specific: "Software engineer who builds full-stack apps with AI agents. Previously six years running operations for a logistics company." Skip phrases like "passionate self-starter".
3. **Projects.** For a career changer, this is the main event, so it goes above experience. Your capstone first, then two or three of the strongest program projects. You'll start applying while you're still building the capstone, so list it as in progress with a link to the repository, and add the live link the day it ships.
4. **Experience.** Your previous jobs. Yes, even if they weren't in tech. More on this below.
5. **Skills.** A short, honest list grouped by kind: languages, front end, back end, data, tools.
6. **Education.** Degrees, and the program. Short.

## Bullets that sound like an engineer

Weak bullets list what you used. Strong ones say what you built, what was hard about it, and how you know it works.

A shape that works: **what you built + a decision or a hard part + how you know it worked.**

| Weak | Strong |
| --- | --- |
| Built a web server in Node.js | Built an HTTP server from a raw TCP socket in Node.js: request parsing, routing and static files, with a test suite of malformed requests |
| Used PostgreSQL and transactions | Built an order API in Postgres that stays correct when two customers buy the last item at the same moment, using conditional updates, proven with concurrent tests |
| Made a chatbot with OpenAI | Built a support agent that looks up orders and stock through tools, with a turn limit, structured output and an eval set of 12 cases including ones it must refuse |
| Worked on authentication | Implemented session and token login for a multi-tenant app, and a test suite that tries cross-tenant access and replayed tokens |

Notice what the strong ones do:

- **They start with a verb.** Built, designed, cut, moved, measured.
- **They name the hard part.** That's what an engineer wants to ask about.
- **They say how you know.** Tests, numbers, a load test, an eval pass rate.
- **They use real numbers where you have them.** "Cut page load from 3.1 to 0.8 seconds by adding an index" beats "improved performance".

Don't invent numbers. If you didn't measure it, don't put a figure on it. An engineer will ask how you measured it.

```match
{
  "title": "What's wrong with this bullet?",
  "note": "Tap the bullet, then its problem.",
  "pairs": [
    { "left": "Responsible for the backend", "right": "Says nothing about what was built or how well" },
    { "left": "Leveraged cutting-edge AI to revolutionize task management", "right": "Buzzwords with no claim anyone could check" },
    { "left": "Improved app speed by 300%", "right": "A number with no way to know where it came from" },
    { "left": "React, Node, Postgres, Docker, Redis, Kafka, Kubernetes, GraphQL", "right": "A list of tools with no evidence of using them" }
  ]
}
```

### Your capstone

Give your capstone three or four bullets and a one-line description, with the repository link while you're building and the live link once it ships. Write the bullets about what you've planned and built so far, and update them as it grows. Cover:

- What it does and for whom, in plain words.
- The agent: what it does, its tools, and how you made it safe and measurable.
- The technology you learned on your own, and why you picked it.
- One hard decision, and how you know it was right.

### Saying you used a coding agent

Say it. That's how software is built now, and hiring managers know it. What they want to know is whether you can direct one well. A line in your summary or under the capstone does it: "Built with a coding agent: I planned each change, reviewed every diff and wrote the tests for the rules that mattered." Then be ready to explain any line of the code.

## Your previous career is an asset

You didn't appear from nowhere. You worked somewhere, solved problems, dealt with people and deadlines. That counts.

Keep your past jobs on the resume, and rewrite their bullets to show the things engineering teams value:

- **Problems you solved with systems or data.** "Built a spreadsheet model that cut weekly scheduling from a day to an hour" is an engineer's instinct, in a different job.
- **Working with people.** Leading a team, training others, handling difficult customers, explaining technical things to non-technical people.
- **Domain knowledge.** If you were a nurse, a teacher, a product manager or a warehouse manager, you know how that world works. Companies building software for that world want you.

Two or three bullets per past job is enough. Lead with the ones closest to engineering.

If you were a product manager, you have an extra card: you know how products get planned and shipped. Say so, and say what you can now do that you couldn't before.

## Getting past the tracking system

Most applications go through a tracking system first. It doesn't reject you on its own, usually, but recruiters search it with keywords. To show up:

- **Use the words from the job post**, where they're true. If the post says "PostgreSQL" and your resume says "Postgres", add the full name once. If it says "REST APIs" and you built them, use those words.
- **Use plain headings**: Projects, Experience, Skills, Education. Clever headings confuse it.
- **Send a PDF**, unless the post asks for something else, and make sure the text in it can be selected and copied. Paste it into a plain text editor. If it comes out jumbled, so does what the recruiter sees.
- **Keep one base resume**, and adjust the summary and the order of bullets for each kind of role you apply to. Don't rewrite from scratch every time.

```scenario
{
  "who": "A friend who works as a recruiter",
  "setting": "You asked them to look at your resume over coffee.",
  "ask": "Honestly, it reads like a bootcamp grad. What makes you different from the hundred others I see a week?",
  "note": "Pick what you'd change based on that.",
  "options": [
    { "text": "Rewrite the project bullets around the hard part and the proof, put my capstone first with its link, and move my operations experience up with bullets about the systems I built there.", "verdict": "best", "feedback": "You answered the real question: what's specific to you. Hard problems with proof, a live product, and a past career that already shows engineering instincts are things the hundred others don't all have." },
    { "text": "Add more technologies to the skills section so I match more searches.", "verdict": "weak", "feedback": "A longer list of tools makes you look more like everyone else, and every one is something an engineer can quiz you on." },
    { "text": "Take the program off so it doesn't look like a bootcamp.", "verdict": "weak", "feedback": "Hiding your training makes the gap in your history harder to explain, and the projects are what make the impression." },
    { "text": "Add a summary saying I'm a fast learner who's passionate about technology.", "verdict": "ok", "feedback": "A summary can help, but those words are on every resume in the pile. Make it specific: what you build and what you did before." }
  ],
  "debrief": "What sets you apart is specific: the problems you solved, how you proved it, and the experience you brought with you."
}
```

## The mentor checklist

Write your resume, export it as a PDF, and send it to your mentor before your next session. They'll check it against this list, and you should check it yourself first:

- [ ] One page, one column, plain layout, text that copies cleanly out of the PDF.
- [ ] Name, email, LinkedIn and GitHub at the top. All links work.
- [ ] Capstone first under Projects, with a one-line description and three or four bullets. Marked in progress with a repository link until it ships, then the live link.
- [ ] Two or three more projects, each with at least one bullet that names a hard part and how you know it worked.
- [ ] Every bullet starts with a verb. No "responsible for", no "helped with" unless you then say what you did.
- [ ] No buzzwords: no "leveraged", "cutting-edge", "passionate", "revolutionize", "synergy".
- [ ] No invented numbers. Every figure is one you can explain.
- [ ] Past jobs kept, with bullets rewritten to show problem solving, people and domain knowledge.
- [ ] Skills grouped and honest: nothing you couldn't answer a question about.
- [ ] Says plainly that you build with a coding agent, and what your part is.
- [ ] No typos. Read it out loud, backwards one line at a time, to catch them.
- [ ] Every line is something you'd be glad to be asked about.

Your mentor will pick two bullets and ask you to talk about each for a few minutes, the way an interviewer would. If you can't, the bullet changes or goes.

If you're stuck on a bullet for more than 20 minutes, write the plain version: "I built X. The hard part was Y. I know it works because Z." Then trim.

```quiz
[
  {
    "q": "For a career changer, why do projects go above experience?",
    "options": ["They're the strongest evidence you can do the job you're applying for, and the reader sees them first", "Experience doesn't matter anymore", "Tracking systems require it", "It hides the gap in your history"],
    "answer": 0,
    "explain": "Your projects show engineering work. Your past jobs still count and stay on the page, below the evidence the reader is looking for first."
  },
  {
    "q": "Which bullet is strongest?",
    "options": ["Built an order API that stays correct when two customers buy the last item at once, using conditional updates, proven with concurrent tests", "Used Node.js, Express and PostgreSQL to build an API", "Responsible for building a robust and scalable order system", "Built an amazing order API from scratch"],
    "answer": 0,
    "explain": "It names what was built, the hard part, and how you know it works. The others list tools, use empty adjectives, or make a claim nobody can check."
  },
  {
    "q": "The job post says \"experience with REST APIs and PostgreSQL\". Your resume says \"built web services with Postgres\". What should you do?",
    "options": ["Use the post's words where they're true: REST APIs and PostgreSQL", "Leave it, they mean the same thing", "Add every database you've heard of", "Copy the whole job post into a hidden section"],
    "answer": 0,
    "explain": "Recruiters search for the post's words. Using them, honestly, makes sure you show up. Hidden text gets you caught."
  }
]
```

## Key takeaways

- A recruiter scans in seconds, then an engineer reads every line looking for questions. Write for both.
- One page, plain layout. Projects first for a career changer, with the capstone at the top.
- A strong bullet says what you built, the hard part, and how you know it worked.
- Your past career is evidence of problem solving, people skills and domain knowledge. Keep it and rewrite it.
- Use the job post's words where they're true, and never put anything on the page you can't talk about.

## Work with AI

```ai-prompt
title: Interview me about my resume bullets
---
I'm changing careers into software engineering. I'll paste my resume. Don't rewrite it.
Act as an engineer who's about to interview me and has read it once. Pick the bullet
you'd most want to ask about and ask me about it, the way an interviewer would: what I
built, why I made the choices I did, what was hard, and how I know it works. Wait for my
answer. Then tell me whether my spoken answer was stronger or weaker than the bullet,
and what that suggests I change. Do this for four bullets. Then point out any bullet
that uses a buzzword or a number I didn't explain.
```
