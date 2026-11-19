# Career: Telling Project Stories

> **In this lesson:** how to answer "tell me about a project you worked on" and the questions that grow out of it, using the shape you've practiced since your first project: what, the hardest part, and a decision with its cost. You'll build a bank of stories from your own projects, ready for the questions interviewers ask most, and tell them to your mentor.

## Words you need first

- **Behavioral question.** An interview question about something you did, usually starting "Tell me about a time when...".
- **Story bank.** A short written list of your best stories, each ready to tell, with the questions it answers.
- **Follow-up.** The question an interviewer asks after your answer, to see how deep your understanding goes.
- **Tradeoff.** What you gave up to get what you chose.

## Why stories

Most interviews include a conversation about your past work. Sometimes it's a whole round. Sometimes it's the first ten minutes of a technical one. The questions sound different and want the same thing:

- Tell me about a project you're proud of.
- Tell me about a hard bug.
- Tell me about a decision you made and would defend.
- Tell me about a time you were wrong.
- What would you do differently?
- How do you use AI tools in your work?

The interviewer is checking whether you understand what you built, whether you make decisions on purpose, and whether you'd be good to work with. A story answers all three at once. A list of technologies answers none of them.

As a career changer, you have more stories than you think. Every project in this program had a hard part and a decision. Your previous career has some too, and "a time you disagreed with someone" doesn't have to involve code.

## The shape

You've told your mentor each project's story in the same shape. In an interview it stretches a little:

```order
title: The shape of a project answer
---
One sentence on what it is and who it was for
The hardest part, and what made it hard
What you did about it, using "I" and real details
One decision, what you chose, and what it cost
How you knew it worked
What you'd change now
```

Keep it under two minutes. Stop at the end and let them ask. A short answer with a good follow-up beats a long answer that tries to cover everything.

Three habits make the difference:

- **Say "I".** "We decided" leaves the interviewer guessing what you did. On your projects it was you, so say so.
- **Use specifics.** "It was slow" is forgettable. "Taking an item off the front of a 200,000-item queue moved every other item, so emptying it took minutes" sticks.
- **Name the cost.** Every decision gave something up. Saying so shows you saw it.

## Here's one told well

> **Interviewer:** Tell me about a project you're proud of.
>
> I added login to the same orders API three ways: my own sessions, my own signed tokens, and then a login provider. The point was to compare them, and each version had to pass a hidden suite of attack tests.
>
> The hardest part was that my first version passed all my own tests and still failed four attack categories. The worst was that a staff member could move an order to another company by adding a `customerId` to an update. The route copied the whole request body onto the order. I'd reviewed that diff and missed it.
>
> So I changed how I review. Every route now copies only the fields it allows, and I wrote an attack test per route that checks the stored data as well as the status code.
>
> The decision I'd defend is keeping roles and customers in my own database even with the login provider. It means a users table I have to maintain. In exchange, a role change takes effect on the next request, and my permission tests don't need the provider at all.
>
> If I did it again, I'd write the attack tests before any code, from the list of attacks, so they'd have failed first.

Notice: it's about two minutes out loud. It admits a mistake, which interviewers like because it shows you can find your own. And it leaves obvious follow-ups open.

## Be honest about the agent

You'll be asked how you use AI tools. A coding agent wrote much of your project code, so say so plainly, and say what you did:

- You planned each feature before any code was written.
- You reviewed every diff and can explain every line.
- You wrote or chose the tests, and you found the bugs the agent didn't.
- You made the decisions, and you wrote the memos.

That's how a lot of software gets built now. Pretending you typed every line is risky, because a good follow-up will expose it. Pretending the agent did the thinking undersells you.

```scenario
{
  "who": "An interviewer",
  "setting": "You've just described your auth project.",
  "ask": "So the AI wrote the code?",
  "note": "More than one answer is defensible. Pick the one you'd actually say.",
  "options": [
    { "text": "It wrote most of the typing. I planned each piece first, reviewed every diff, and wrote the attack tests. For example, I caught that it was comparing signatures with a plain equals check, which leaks timing, and had it switch to a constant-time comparison.", "verdict": "best", "feedback": "Honest, specific about your part, and backed by a real example from your own review. The example is what makes it believable." },
    { "text": "No, I wrote it all myself.", "verdict": "weak", "feedback": "If that's not true, the next question about a line you didn't write will show it, and you'll have spent your credibility on the one thing that didn't matter." },
    { "text": "Yes, but that's how everyone works now.", "verdict": "weak", "feedback": "Probably true, and it gives them no reason to hire you over the agent. Say what you did that it couldn't." },
    { "text": "It helped. I'm comfortable using AI tools.", "verdict": "ok", "feedback": "Not wrong, but vague. They'll have to dig for what you did, and a vaguer answer makes them wonder." }
  ],
  "debrief": "Say what the agent did and what you did, with one concrete example of judgment it didn't have."
}
```

## Getting ready for follow-ups

The first answer gets you in the door. The follow-ups are where the interview is decided. For every story, prepare for these:

| Follow-up | What they're checking |
| --- | --- |
| Why not the other option? | That you knew there was another option |
| How did you know it worked? | That you test, and what "works" means to you |
| What would break at 100 times the traffic? | That you think beyond the happy path |
| What was your part, exactly? | That "I" is true |
| What would you do differently? | That you learn from your own work |

You've already written most of these answers. Your decision memos say why you chose what you chose and what it cost. Reread them before an interview.

```match
{
  "title": "Which story answers which question?",
  "note": "Tap the question, then the best story to tell.",
  "pairs": [
    { "left": "Tell me about a hard bug", "right": "The order that moved to another company through one extra field" },
    { "left": "Tell me about a decision you'd defend", "right": "Keeping roles in my own database instead of the login provider" },
    { "left": "Tell me about a time something was slow", "right": "The queue that moved every item each time one was taken off the front" },
    { "left": "Tell me about a time you learned something new on your own", "right": "Setting up a login provider from its documentation alone" }
  ]
}
```

## Build your story bank

Create `career/stories.md` in your `parsity-labs` repository. For **every project you've finished**, write:

- **What:** two sentences.
- **Hardest part:** what made it hard, in specifics.
- **What I did:** the steps, with "I".
- **Decision and cost:** one choice, the alternative, and what it cost. Pull this from your memo.
- **Proof it worked:** tests, numbers, a measurement.
- **What I'd change.**
- **Answers these questions:** which of the common questions this story fits.

Then add two stories from **before** this program: a hard problem you solved at work, and a time you disagreed with someone and how it ended. They answer the teamwork questions, and they show the person behind the code.

Finally, check coverage: every common question in this lesson should have at least one story next to it. If one doesn't, find a story for it.

## Say them out loud

Writing a story and telling it are different skills. For two of your stories:

1. Record yourself answering "tell me about a project you're proud of" without notes.
2. Watch it back. Count the times you said "we", "basically" or "kind of". Check you named a cost.
3. Record it again.

If you're still reading from notes after three tries, the story is too long. Cut it to the shape and try again.

## Hand it in

Commit `career/stories.md` and bring it to your next mentor session. Your mentor will ask you two or three of the common questions, cold, and then follow up. They check:

- [ ] Every finished project has a story in the bank, with a hard part, a decision and its cost.
- [ ] Two stories come from before this program.
- [ ] Every common question in this lesson has at least one story.
- [ ] Told out loud, each answer is under two minutes, uses "I", and includes specifics.
- [ ] You can explain honestly what the agent did and what you did.
- [ ] You handle at least one follow-up per story without going vague.

```quiz
[
  {
    "q": "An interviewer asks about a project and you start with the list of technologies you used. What's the problem?",
    "options": ["It doesn't show what was hard, what you decided or whether you understand it", "Interviewers dislike technology names", "It takes too little time", "Nothing, that's the best opening"],
    "answer": 0,
    "explain": "A list could describe anyone's project. The hard part and a decision with its cost are what show your thinking, so lead with what it is and get to them quickly."
  },
  {
    "q": "Which line belongs in a strong project story?",
    "options": ["I chose to keep roles in my own database, which means maintaining a users table, so a role change takes effect on the next request", "We used best practices for security", "It was a really challenging project", "I'm passionate about authentication"],
    "answer": 0,
    "explain": "It says what you chose, what it cost and what it bought. The others are claims with nothing behind them."
  },
  {
    "q": "After your story, the interviewer asks \"What would break at 100 times the traffic?\" Where should most of your answer already be?",
    "options": ["In your decision memo, which said what each choice costs", "In the project's README", "In the test output", "Nowhere, you can't prepare for that"],
    "answer": 0,
    "explain": "Your memos already name the costs of your decisions. Those costs are usually what breaks first at scale. Reread them before an interview."
  }
]
```

## Key takeaways

- Project questions all want the same thing: proof you understood what you built and decided things on purpose.
- The shape: what, the hardest part, what you did, a decision and its cost, how you knew it worked, what you'd change.
- Say "I", use specifics, name the cost, and keep it under two minutes.
- Be plain about the agent: it typed, you planned, reviewed, tested and decided. Have one example ready.
- A story bank covers every common question before the interview does. Your memos hold the follow-up answers.

## Work with AI

```ai-prompt
title: Interview me on one story
---
I'm preparing for software engineering interviews as a career changer. I'll paste one
story from my story bank about a project I built. Act as an experienced interviewer.
First, ask me to tell the story out loud, as I would in the interview, and I'll type
it. Then ask me four follow-up questions, one at a time, waiting for each answer: one
about an alternative I didn't choose, one about how I knew it worked, one about what
would break at much larger scale, and one about exactly which part was mine and which
was the coding agent's. Don't answer for me. At the end, tell me which answer was most
convincing and which went vague, and quote the vague sentence.
```
