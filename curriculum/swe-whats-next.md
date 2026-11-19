# What's Next

> **In this lesson:** how to finish the program well, how to keep your skills sharp while you search and once you're hired, the two add-ons you can take next and who each one is for, and how to stay connected to the people you've learned alongside.

## Words you need first

- **Add-on.** A separate program you can take after, or alongside, this one, focused on one area in more depth.
- **Legacy codebase.** A large, older codebase that real people have changed for years, with all the mess that comes with that.
- **RAG.** Short for retrieval-augmented generation. A system that finds relevant pieces of your own documents and hands them to a model so it can answer from them.
- **Alumni.** People who have finished the program.

## Look at what you did

Before you look ahead, look back. When you started, you may never have opened a terminal. Since then you have:

- Written a stack, a queue, a hash map and a test runner by hand.
- Built a web server from a raw network connection.
- Built the same app three ways, and explained the differences.
- Kept an order system correct when two customers bought the last item at the same moment.
- Built login three ways and survived a test suite that attacked it.
- Deployed an app twice, and rolled one back.
- Built a delivery system that keeps working when the other side goes down.
- Called a model from your own code, given it tools, and proved it works.
- Designed, built, shipped and demoed a capstone with real data, an agent and a technology you taught yourself.
- Written decision memos you can defend, and solved interview problems by hand.

That's a lot. On a hard day in the job search, read that list again.

## Finishing well

Finishing is a skill, and the last stretch is where people drift. A few things to close out properly:

- **Get every project to passing,** including any you left on "nearly". Your repository is a portfolio, and a failing project is the one someone will click.
- **Tidy your repositories.** READMEs that a stranger can follow, no secrets in the history, pinned on your GitHub profile.
- **Get your capstone signed off** by your mentor, with the recorded demo linked at the top of its README.
- **Use your remaining mentor sessions well.** Mock interviews, a resume review, a second design mock. You have support for up to 12 months from when you started, so plan which sessions you'll use for what.
- **Write your own retrospective.** One page, just for you: what was hardest, what you're proudest of, what you'd tell someone starting today. It's useful in interviews, and you'll be glad you wrote it.

## Staying sharp

Skills fade when you stop using them, and a job search can take a while. Keep a small, steady routine:

- **A by-hand problem or two a week.** Out loud, with a timer. Revisit the patterns you found hardest.
- **Keep building.** Add a feature to your capstone. Build something small for a friend or for a problem in your own life. Each one gives you something new to talk about in interviews.
- **Read code you didn't write.** Pick an open-source project you use and read how one feature works. Then try fixing a small issue and opening a pull request. Reading unfamiliar code is most of the job.
- **Keep up with the tools without chasing every one.** Coding agents and models change fast. When a new one comes out, try it on a real task, and judge it by what you've learned: does it plan well, can you review what it writes, does it pass your tests?
- **Teach something.** Write a short post about a bug you fixed or a decision you made. Answer a beginner's question. Explaining is still the fastest way to find the holes in what you know.

```match
{
  "title": "Which habit fits the goal?",
  "note": "Tap the goal, then the habit.",
  "pairs": [
    { "left": "Stay ready for by-hand coding rounds", "right": "A problem or two a week, out loud, with a timer" },
    { "left": "Get better at working in code you didn't write", "right": "Read and fix a small issue in an open-source project" },
    { "left": "Have something fresh to talk about in interviews", "right": "Add a real feature to your capstone and write about it" },
    { "left": "Find the gaps in what you know", "right": "Explain a topic in a short post or to a beginner" }
  ]
}
```

## The two add-ons

You have the foundations. Two add-ons go deeper in directions many graduates want next. Neither is required, and neither is a condition of anything in this program.

### Agentic Engineering

This one is about working with coding agents on a real, messy codebase.

Every project in this program started from a clean folder you understood. Jobs rarely look like that. On your first day you'll be handed a large codebase that many people have changed for years, with a `README` that's out of date, comments that lie, tests that are skipped, and instructions for the agent that are partly wrong.

Agentic Engineering puts you in exactly that situation, on a practice codebase built to be realistic, traps included. You work through tickets the way you would on a team: investigating before changing anything, deciding what to trust, keeping an agent on track in code it doesn't understand either, and proving each change works.

It's a good fit if you want to be ready for your first weeks on a real team, or if you liked the part of this program where you checked an agent's claims and want much more of it.

### AI Engineering

This one is about building systems where a model answers from your own data.

In the model basics lesson and your capstone, you gave a model tools to look things up. AI Engineering goes deep on a specific, very common kind of AI system: one that answers questions from a large collection of documents. That's RAG. You learn how documents are split up and turned into numbers that capture meaning, how the right pieces are found for a question, how to measure whether retrieval is any good, how to defend against poisoned documents, and how to put it all into production.

It's a good fit if your capstone's agent was your favorite part, or if you want to aim at roles building AI features into products.

```scenario
{
  "who": "A classmate",
  "setting": "You're both finishing the program and talking about what to do next.",
  "ask": "Should I take one of the add-ons, or just focus on applying?",
  "note": "There isn't one right answer. Pick what you'd say to them.",
  "options": [
    { "text": "What kind of role are you aiming for? If you want to be ready for a real codebase on day one, Agentic Engineering fits. If you want to build AI features, AI Engineering does. Either way, keep applying while you do it, and put what you build on your resume.", "verdict": "best", "feedback": "You tied the choice to their goal, and you didn't make it either-or. Learning while searching keeps skills sharp and gives you new things to talk about." },
    { "text": "Take both. More skills means more offers.", "verdict": "weak", "feedback": "More isn't automatically better. Without a reason tied to the jobs they want, it's a way of putting off the search." },
    { "text": "Just apply. You've learned enough.", "verdict": "ok", "feedback": "Applying is right, and they may well have enough. But if they're aiming at a kind of role an add-on prepares for, it could help them get it. Ask what they want first." }
  ],
  "debrief": "Choose what to learn next by the job you want, and keep searching while you learn."
}
```

## Staying connected

The people you've learned alongside are the start of your professional network. Many first jobs come from someone who knows your work.

- **Stay in the community.** Keep showing up where Parsity students and graduates talk. Answer questions from people earlier in the program: it helps them and keeps you sharp.
- **Keep coming to office hours and the monthly guest speakers** for as long as your support lasts. The guest speakers are working engineers, and a good question afterward is a good way to start a conversation.
- **Help the people behind you.** When you get hired, tell us and tell the community. Offer a referral or a short chat to someone still searching. Someone did that for most of the engineers you'll ever work with.
- **Keep in touch with your mentor.** Tell them when you get an interview, an offer, or a hard rejection. They've seen it all before.

```quiz
[
  {
    "q": "You're a few weeks into the job search and haven't written any code. What's the best way to stay sharp?",
    "options": ["A small steady routine: a couple of by-hand problems a week and one real feature or small project", "Wait until you have an interview, then cram", "Start a new tutorial series from the beginning", "Read about new frameworks every day"],
    "answer": 0,
    "explain": "Small and steady keeps skills from fading and gives you fresh things to talk about. Cramming before an interview is stressful and shows."
  },
  {
    "q": "Which add-on fits someone who wants to be ready for a large, messy codebase on their first day at a job?",
    "options": ["Agentic Engineering", "AI Engineering", "Neither, that only comes from a job", "Both, in either order"],
    "answer": 0,
    "explain": "Agentic Engineering puts you in a realistic, imperfect codebase and has you work through tickets with an agent, the way you would on a team."
  },
  {
    "q": "What's the most useful thing to do with your remaining mentor sessions?",
    "options": ["Plan them: mock interviews, a resume review and a design mock, aimed at your weakest round", "Save them all in case something comes up", "Use them to have your mentor write your applications", "Skip them now that the capstone is done"],
    "answer": 0,
    "explain": "Your mentor is a working engineer who can run realistic mocks and tell you where you're weak. Planned sessions aimed at your gaps are worth the most."
  }
]
```

## Key takeaways

- Finish well: every project passing, clean repositories, a signed-off capstone, and remaining mentor sessions planned.
- Stay sharp with a small, steady routine: by-hand problems, building, reading code you didn't write, and explaining what you learn.
- Agentic Engineering is for working with agents on real, messy codebases. AI Engineering is for building systems that answer from your own documents.
- Choose what to learn next by the job you want, and keep searching while you learn.
- Your classmates, mentor and the community are your first professional network. Help the people behind you.

## Work with AI

```ai-prompt
title: Plan my next three months
---
I've just finished a program that took me from no coding experience to building and
deploying full-stack apps with an AI coding agent, including a capstone with an AI
agent in it. I'm now job searching. I'll tell you what kind of role I want, what I did
before this, which parts of the program I found hardest, and how many hours a week I
have. Don't make the plan for me. Ask me questions, one at a time, until you understand
my situation. Then help me draft a weekly routine that balances applying, practicing
interview rounds and building something new, and ask me what I think is missing from
it. Push back if I'm overcommitting.
```
