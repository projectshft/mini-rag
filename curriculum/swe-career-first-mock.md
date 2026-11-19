# Career: Your First Mock Interview

> **In this lesson:** what a mock interview is, the kinds of rounds a real hiring process has, and how to prepare for your first one with your mentor. You'll learn what your mentor scores and why, and how to turn the feedback into a plan. Most people want to wait until they feel ready. Don't. The first one is supposed to show you where you aren't.

## Words you need first

- **Mock interview.** A practice interview run like the real thing, with honest feedback afterwards.
- **Round.** One interview within a company's hiring process, with its own focus, such as coding or design.
- **Rubric.** The list of things an interviewer scores, with what each score looks like.
- **Thinking aloud.** Saying what you're considering as you work, so the interviewer can follow your reasoning.
- **Behavioral question.** A question about how you've handled real situations: "Tell me about a time..."

## Why do one now

You've built servers, databases, login, deploys and designs. You can explain more than you think. You've also never done it under the pressure of someone watching and a clock running, and that's a separate skill.

A mock interview finds the gap between what you know and what you can show. That gap is almost always bigger than people expect the first time, and it closes quickly with practice. Doing your first mock early means you have the rest of the program to close it.

## The rounds in a real hiring process

Companies differ, but most hiring processes for software engineers are built from these:

| Round | What happens | What they're looking for |
| --- | --- | --- |
| Recruiter screen | A short call about your background and what you want | Can you explain your story clearly and briefly? |
| Coding by hand | A problem to solve in an editor or on a shared screen, no AI | Can you reason through a problem, write working code and test it? |
| Coding with AI | A task on a small codebase, with an AI tool allowed | Can you direct the tool, check its work and explain the result? |
| System design | "Design a ..." on a whiteboard or drawing tool | Can you go from vague to concrete, with numbers and tradeoffs? |
| Behavioral | Questions about your past work and decisions | Do you own your decisions, learn from mistakes and work well with others? |
| Take-home | A small project done on your own time | Is the work clean, tested, and explained? |

Your first mock with your mentor uses a few of these, usually some coding by hand, some behavioral questions about your projects, and a short design question. Your mentor will tell you the format when you book it. Book it the same way you book any mentor session.

## How to prepare

### Coding by hand

Use the same steps every time, out loud, so they become habit:

```order
title: Working a coding problem in an interview
---
Repeat the problem in your own words and ask about anything unclear
Work two or three small examples by hand, including an edge case
Describe the simplest approach that works, and its Big O
Improve it if you can, and say what the improvement costs
Write the code, saying what each part is for
Walk through it with one of your examples, line by line, and fix what you find
State the final time and space complexity
```

Practice three problems this way, out loud, with a timer set to 30 minutes each and nobody helping. Recording yourself is uncomfortable and very effective. Use the problems from your by-hand practice, in any language you like.

When you're stuck in the interview, say so and say what you're trying: "I'm looking for a way to avoid the second loop. I'm thinking about whether a set would let me remember what I've seen." An interviewer can help someone who's thinking out loud. They can't help silence.

### Behavioral

You've been practicing this since the first project: what you built, the hardest part, a decision and what it cost. Now prepare four stories, each from a different project, and know which questions each one answers:

- "Tell me about a project you're proud of."
- "Tell me about a hard bug."
- "Tell me about a decision you'd make differently."
- "Tell me about a time you disagreed with someone." Your mentor, a code review comment, or an agent that confidently said something wrong all count.

Keep each answer under two minutes. Specific beats general: "the last item in stock could be sold twice when two orders arrived together, so I replaced the read-then-write with a conditional update" beats "I learned a lot about databases". Say "I", and own the decisions, including the ones that didn't work.

### System design

Use the eight steps from the system design lesson. Practice one design out loud against a 30-minute timer, drawing as you go. Spend the first few minutes on requirements and numbers even when it feels slow. That's the part beginners skip and interviewers notice.

### The setup

- A quiet room, a working camera and microphone, and a charger.
- A plain editor with AI suggestions turned off for the by-hand round.
- A drawing tool open, or paper and a pen you can hold up to the camera.
- Water. Your mouth goes dry when you're nervous.

## What your mentor scores

Your mentor uses a rubric, so the feedback is concrete and you can see it change from one mock to the next. Each area is scored from 1 to 4.

| Area | A 1 looks like | A 4 looks like |
| --- | --- | --- |
| Understanding the problem | Starts coding straight away, solves the wrong problem | Restates it, asks good questions, works examples first |
| Problem solving | Stuck with no way forward | Starts simple, improves step by step, explains why |
| Communication | Long silences, or talking without saying what they're doing | The interviewer could follow every step, and hints are used well |
| Code | Doesn't run, or is hard to read | Correct, clear names, simple structure |
| Checking the work | Says "I think it works" | Walks through examples, finds and fixes own bugs, states the complexity |
| Design | Boxes with no reasons | Requirements, numbers, a bottleneck and tradeoffs, in order |
| Telling your story | Vague, says "we", skips the decisions | Specific, says "I", names a decision and its cost |

A first mock usually lands at 1s and 2s in a few areas. That's what it's for. Nobody is hiring based on this score, and it's the starting point you'll measure yourself against.

```scenario
{
  "who": "Your mock interviewer",
  "setting": "Halfway through a coding problem. You have a working solution with a loop inside a loop.",
  "ask": "This works. Could you make it faster?",
  "options": [
    { "text": "Right now it's O(n squared), because for each item I scan the whole list again. If I keep a set of what I've seen, each check is constant time, so it becomes one pass, O(n), at the cost of memory for the set. Shall I write that version?", "verdict": "best", "feedback": "It names the current cost, says exactly where it comes from, proposes the improvement with its cost, and checks before diving in. That's the whole skill in four sentences." },
    { "text": "Sure, let me think.", "verdict": "ok", "feedback": "Thinking is fine, and silence after it isn't. Say what you're thinking about: where the time goes, and what you could remember to avoid repeating work." },
    { "text": "It's fast enough for these inputs.", "verdict": "weak", "feedback": "The interviewer asked because the inputs could be large. Defending the slow version without saying its Big O sounds like you don't know it." },
    { "text": "I'd probably use a hash map somehow.", "verdict": "ok", "feedback": "Right direction, and too vague to score. Say what goes in the map, why it helps, and what it costs." }
  ]
}
```

## Using the feedback

The mock is only half of it. The other half is what you do afterwards.

1. **Write it down the same day.** Make a file called `career/mocks.md` in your `parsity-labs` repository. Note the date, the problems, your scores, and your mentor's comments in their words while you remember them.
2. **Pick two things.** Not everything. The two that would have changed the outcome most. Usually one is about communication and one is about a skill.
3. **Make a practice plan for each.** Specific and small: "do two problems out loud each week and say the Big O before writing code" works. "Get better at coding" doesn't.
4. **Redo the same problem** a week later, cold, out loud. Compare.
5. **Bring the plan to your next mock**, and ask your mentor to watch those two areas.

Feedback can sting, especially from someone you respect. Write down what was said before you decide how you feel about it. The comment that stings most is often the most useful one.

```quiz
[
  {
    "q": "You're stuck in a coding round and don't know the next step. What helps most?",
    "options": ["Say what you're stuck on and what you're considering, so the interviewer can follow and help", "Stay quiet until you've worked it out", "Start typing anything so it looks like progress", "Ask the interviewer for the answer"],
    "answer": 0,
    "explain": "Interviewers score how you think. Thinking aloud shows them, and it lets them give a hint that moves you forward. Silence shows nothing."
  },
  {
    "q": "Which is the strongest answer to 'Tell me about a hard bug'?",
    "options": ["A specific bug, how I found it, the fix I chose over another option, and what it cost", "A general description of how I usually debug", "A bug the team fixed together, told as 'we'", "A list of every bug in the project"],
    "answer": 0,
    "explain": "Specific and owned. The interviewer wants to see how you reason and decide, which only comes through in a real example told in the first person."
  },
  {
    "q": "After your first mock you got low scores in four areas. What's the best next step?",
    "options": ["Pick the two that matter most, make a small practice plan for each, and redo a problem a week later", "Practice everything at once until the next mock", "Wait until you feel ready before the next one", "Focus only on the area you scored lowest in"],
    "answer": 0,
    "explain": "Two specific targets with a small plan improve fastest. Everything at once spreads you thin, and waiting to feel ready means waiting a long time."
  }
]
```

## Key takeaways

- A mock interview shows the gap between what you know and what you can show under pressure. Do the first one early.
- Real hiring uses a mix of rounds: coding by hand, coding with AI, system design, behavioral, take-home.
- Use the same steps for every coding problem, out loud, and test your own code before you say it's done.
- Prepare four specific project stories that say "I" and name a decision and its cost.
- Your mentor scores against a rubric. Write the feedback down, pick two things, and practice them on purpose.

## Work with AI

```ai-prompt
title: Run a behavioral round with me
---
You're interviewing me for a junior software engineer role. Ask me four behavioral
questions, one at a time: a project I'm proud of, a hard bug, a decision I'd make
differently, and a disagreement. Wait for my full answer each time. Don't coach me
between questions. After all four, score each answer from 1 to 4 on: specific rather
than general, says "I" and owns the decisions, names a decision and what it cost, and
stays under two minutes. Quote the sentence from each answer that most helped or
most hurt it. Then tell me which story I should practice first, and why.
```
