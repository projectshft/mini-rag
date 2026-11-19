# Capstone: The Demo

> **In this lesson:** how to show your capstone to people. First a live walkthrough with your mentor, where you show it working and answer hard questions about it. Then a short recorded demo you can send to anyone, and a LinkedIn post that puts it in front of the people you want to work with. Your mentor's sign-off at the end is what finishes the capstone.

## Words you need first

- **Walkthrough.** Showing the project live to someone, using it in front of them and explaining it as you go.
- **Demo video.** A short screen recording of the project working, with you talking over it.
- **Happy path.** The main thing a person comes to do, working the way it should.
- **Sign-off.** Your mentor saying, on the record, that the capstone is done.

## Why the demo matters so much

Nobody will read your code first. They'll watch you show it, or watch a video of it, and decide from that whether to look further. The same goes for interviews: "walk me through something you built" is one of the most common questions there is, and the people who do it well have practiced.

A demo shows three things at once: that the thing works, that you understand it, and that you can explain it to someone who doesn't. The third one is rarer than the first two, and it's what gets people hired.

## The shape of a good demo

Every demo you give, live or recorded, has the same shape. It's the project story you've been practicing since the toolkit project, with the product on screen:

```order
title: The shape of a capstone demo
---
The problem, and the person who has it, in two sentences
The happy path, live, start to finish
One moment where the agent does something plain code couldn't
What's under the hood: one diagram, and the decision you'd defend first
Something that went wrong while building it, and what you did
What you'd do next, and what you cut on purpose
```

Some rules that make it land:

- **Lead with the person, not the stack.** "Landlords with a few units track repairs in group chats and lose them" beats "I built a Next.js app with Postgres and pgvector."
- **Show, then explain.** Do the thing first, then say how it works. People follow a story better than a list of parts.
- **Use real data.** Your capstone uses a real or scraped data source. Show it. Made-up rows called "Test 1" make a real project look like a toy.
- **Prepare for the agent to misbehave.** It's a model, and it won't give the same answer every time. Pick questions your evals pass reliably. If it does something odd live, say what happened and why. Handling that calmly is more impressive than a perfect run.
- **Have a fallback.** A recording of the happy path, in case the network or the proxy is down when you present.

## The live walkthrough with your mentor

Book a session for it. Before the session, send your mentor the live link, the repository, and `DESIGN.md`. Check that your model key has budget left.

The session has two halves.

**You present.** Give the demo, in the shape above, from the live app. Aim for something you could deliver comfortably in a short meeting. You'll learn quickly whether it's too long.

**Your mentor asks.** This is the half that matters. Expect questions like:

- Why did you store this as a table and not a document?
- Show me what happens when the data source is down.
- What stops one user seeing another's data? Show me the test.
- Walk me through what happens, step by step, when I ask the agent this question.
- How many model calls does that take, and what does it cost?
- What breaks first at 100 times the users, and what would you change?
- Open this file. Explain this function.

That last one is the real test. Your mentor may pick any file in your repository and ask you to explain it. Code your agent wrote counts as yours. If you can't explain a function, you'll be asked to come back once you can. It's the same question you'll get in an interview, so better to meet it here.

If a question stumps you, don't bluff. Say what you do know, say what you'd check, and offer to come back with the answer. That's what a good engineer does in a design review.

```scenario
{
  "who": "Your mentor",
  "setting": "The live walkthrough. They've opened a file in your repository and pointed at a function the agent wrote in the second milestone.",
  "ask": "What does this function do, and why does it retry three times?",
  "note": "You remember what it does, and not why it's three.",
  "options": [
    { "text": "It fetches the listings page from the source site, and retries when the request fails because the site drops connections under load. The agent picked three, and I didn't question it at the time. Looking at it now, I'd want it to wait longer between tries and to log each failure. Can I come back to you on what the right number is?", "verdict": "best", "feedback": "You explained what it does and why retrying makes sense, admitted the gap plainly, and showed you can reason about it now. That's honest and it's strong." },
    { "text": "Three is a standard number for retries.", "verdict": "weak", "feedback": "That's a guess dressed up as a fact. The follow-up is \"standard according to whom, and why does it suit this site?\" and there's nowhere to go from there." },
    { "text": "The agent wrote that part, so I'm not sure.", "verdict": "weak", "feedback": "Code in your repository is yours, whoever typed it. Saying the agent wrote it tells an interviewer you didn't review it." },
    { "text": "It retries the fetch three times. I'd need to look at the code more closely to say why.", "verdict": "ok", "feedback": "Honest, and better than bluffing. You can do more, though: reason out loud about why a retry would be there, and what you'd check." }
  ],
  "debrief": "Nobody remembers every number in their code. What they're testing is whether you reviewed it, whether you can reason about it, and whether you'll say plainly when you don't know."
}
```

After the session, fix what came up, and note it in `DESIGN.md` under `Changes`.

## The recorded demo

Once the walkthrough has gone well, record a short version you can send to anyone. Keep it under three minutes. People stop watching long demos, and a tight one shows you know what matters.

- **Script it loosely.** Write the six beats from the shape above as bullet points, not a word-for-word script. Read-aloud scripts sound read.
- **Record your screen and your voice.** Your face in a corner is a nice touch, not required. Any free screen recorder is fine.
- **Clean up first.** A fresh browser window, no other tabs, no notifications, bookmarks bar hidden, real data loaded, and your text big enough to read on a phone.
- **Do a few takes.** The second or third is usually the one. Don't chase perfect: a small stumble that you recover from sounds human.
- **Put it somewhere with a link.** An unlisted video on YouTube or Loom both work. Put the link at the top of your README.

Watch it once on your phone, with the sound off, then once with the sound on. Without sound, is it clear what the app does? With sound, could someone outside tech follow it?

## Post it on LinkedIn

You've posted after every project since the LinkedIn lesson. This is the post that matters most. Write it for someone who doesn't know you and is skimming on a phone:

- **First line:** the problem, in plain words. That's all most people see before "see more".
- **Then:** what you built, in two or three sentences, and the video or a short clip.
- **Then:** one thing you learned that someone else could use. A real one, from your check-ins. "Getting the agent to say 'that order doesn't exist' instead of making something up took four tries at the tool's description" is far more interesting than "I learned a lot."
- **Last:** the live link and the repository.

Keep it honest. Say you built it with a coding agent and what your part was. Don't claim users you don't have. And don't write it with an agent: people can tell, and the post is meant to show how you think.

Tag Parsity, and comment on the posts of others finishing their capstones. The people who engage in your comments are the beginning of your network.

## Sign-off

Your mentor signs off on the capstone when:

- The live walkthrough went well, including the questions about your code.
- The fixes that came out of it are done.
- The recorded demo is linked at the top of your README.
- Your LinkedIn post is up.

Your mentor's sign-off is the one part of the capstone a person grades. Everything before it was checked by tests, the AI review and the checks in earlier lessons. This part checks that you can stand behind what you built.

```quiz
[
  {
    "q": "How should a capstone demo open?",
    "options": ["With the problem and the person who has it, in a sentence or two", "With the tech stack and why you chose it", "With the architecture diagram", "With the hardest bug you fixed"],
    "answer": 0,
    "explain": "People follow a story. The problem makes them care about what comes next. The stack and the diagram come after they've seen it work."
  },
  {
    "q": "During the live walkthrough, the agent gives a strange answer to one of your questions. What's the best move?",
    "options": ["Say what happened and why a model can do that, then show how your evals or limits handle it", "Refresh and hope", "Say it never does that", "Skip to the next part without mentioning it"],
    "answer": 0,
    "explain": "Models vary. Explaining it calmly, and showing you planned for it, shows more understanding than a perfect run would."
  },
  {
    "q": "Your mentor points at a function the agent wrote and asks why it works the way it does. What are they checking?",
    "options": ["That you reviewed and understand the code in your project, whoever typed it", "Whether you used an agent", "Your typing speed", "That the function has tests"],
    "answer": 0,
    "explain": "Code in your repository is yours to defend. Interviewers ask the same thing, so the walkthrough is practice for it."
  }
]
```

## Key takeaways

- A demo shows it works, that you understand it, and that you can explain it. The third is what gets people hired.
- Use one shape every time: the problem, the happy path live, the agent's moment, under the hood, what went wrong, what's next.
- In the walkthrough, expect to explain any file in your repository. Don't bluff. Say what you know and what you'd check.
- Keep the recorded demo short, rehearsed but not scripted, and linked at the top of your README.
- Post it on LinkedIn in your own words, leading with the problem and something real you learned.

## Work with AI

```ai-prompt
title: Grill me like a mentor at my capstone walkthrough
---
I'm about to give a live walkthrough of my capstone project. I'll describe it: the
problem, who it's for, the stack, the data source, what the agent does and its tools,
and the main decisions in my design doc. Don't praise it and don't suggest features.
Ask me the questions a senior engineer would ask in a design review, one at a time:
why I chose each piece, what happens when something fails, how I stop users seeing each
other's data, what one request costs, and what breaks first at 100 times the users.
Wait for my answer each time. If I'm vague, push once for specifics. At the end, tell
me which two answers were weakest and why.
```
