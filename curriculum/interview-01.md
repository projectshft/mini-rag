# The AI Engineering Interview Playbook


> **This session:** how AI engineering interviews actually work, why the conversation portion — not the coding portion — is where most candidates lose the offer, and the plan for the next four sessions: a signature story, defensible opinions, system design frameworks, and live practice.

## The hardest part of AI interviews

You've built an end-to-end RAG system. You understand chunking, embeddings, agents, and retrieval. You've made real architectural decisions and seen what works.

Now comes the hard part: **proving you know what you're talking about.**

The coding portion of AI interviews typically follows traditional software engineering patterns. But the conversation portion — where you explain what you've built, why you made certain choices, and how you'd approach new problems — is where AI engineering interviews diverge.

Most candidates stumble here. Not because they lack knowledge, but because they haven't practiced articulating it.

## Why stories matter

Having a bank of well-rehearsed stories creates:

- **Confidence** — you know exactly what you're going to say
- **Clarity** — you've refined your explanations through practice
- **Credibility** — you can speak fluidly about real decisions you made

When an interviewer asks "Tell me about a project you've worked on" or "How would you design a RAG system?", you won't be improvising. You'll be drawing from prepared, practiced material.

This isn't about memorizing scripts. It's about having thought deeply about what you built and why — then practicing saying it out loud until it flows naturally.

## What you'll build across this playbook

By the end of these sessions, you'll have:

- A signature story about your RAG project
- Strong opinions on agents, frameworks, and patterns
- System design answers for common scenarios
- Video recordings of your practice sessions
- Written artifacts you can review before any interview

## The four sessions

### 1. [Your Signature Story](/learn/interview-02) — most important

Craft a clear, compelling story about your RAG project using the **Problem -> Agitate -> Solve -> Reflect** framework.

**Deliverables:** a written story, then a 1–5 minute video recording (no notes), submitted for feedback.

Nail this, and you'll stand out in every interview.

### 2. [Strong Opinions on Tradeoffs](/learn/interview-03)

Develop defensible positions on agents vs workflows, vector search vs SQL, RAG patterns (chunking + re-ranking), model selection, and observability.

**Deliverables:** written opinions on all five topics, plus a video explaining your strongest one.

Most candidates describe. Strong candidates take positions and defend them.

### 3. [RAG System Design Interviews](/learn/interview-04)

Design RAG systems for different scenarios — legal documents, customer support, code documentation — with clear reasoning at every step.

**Deliverables:** three complete written designs, plus a video walkthrough of one.

"Design a RAG system for X" is the most common technical interview question you'll face.

### 4. [Live Practice](/learn/interview-05) — optional

Extra reps: three recorded answers (project, opinion, design questions) with self-assessment, plus the option to schedule a mock interview.

Optional because you'll already have submitted videos in the earlier sessions — but extra practice builds confidence and exposes patterns you might miss.

## How to use this

### 1. Write first, then record

Writing forces clarity. Do the written exercises before the video recordings.

### 2. Record yourself

Speaking out loud is different from writing. Video exposes filler words, unclear explanations, and poor pacing.

### 3. Watch your videos

This is uncomfortable but critical. Notice where you stumbled and what sounded unclear.

### 4. Iterate

Re-record until you can explain clearly without reading notes.

## What interviewers actually look for

They are NOT looking for:

- Perfect answers
- Memorized scripts
- Buzzword bingo

They ARE looking for:

- Clear thinking
- Tradeoff awareness
- Strong opinions (with reasoning)
- Communication skills
- System design ability

**The best candidates don't just explain what they built — they explain why they built it that way.**

## Video guidelines (all sessions)

- **Length:** 1–5 minutes per video
- **Format:** Loom, Zoom, or phone camera recording
- **Setup:** face the camera, quiet space, good lighting
- **Delivery:** don't read from notes — speak naturally
- **Feedback:** you'll receive personalized feedback on each submission

Common mistakes to avoid: reading from notes on camera, going way over time, answers with no structure, no tradeoff discussion, generic vague responses, and saying "I don't know" without attempting an answer.

## A note on coding interviews

The coding portion of AI engineering interviews typically follows traditional software engineering patterns — algorithms, system design, debugging. This playbook focuses on the conversation and communication aspects unique to AI roles.

If you want help preparing for traditional coding interviews, ask in the course Slack.

## Key takeaways

- The conversation portion — explaining what you built and why — is where AI interviews diverge from standard SWE interviews, and where most candidates stumble
- Preparation means internalizing frameworks and practicing out loud, not memorizing scripts
- Interviewers reward clear thinking, tradeoff awareness, and defensible opinions — not perfect answers
- The workflow for every session: write first, record on video, watch it back, iterate
- Work through the sessions in order: signature story -> opinions -> system design -> (optional) live practice

## Work with AI

```ai-prompt
title: Audit my interview readiness before I start
---
I'm starting an AI engineering interview prep playbook that covers four skills: (1) a signature story about a RAG project I built, (2) defensible opinions on agents vs workflows, vector search vs SQL, chunking, re-ranking, model selection, and observability, (3) RAG system design for arbitrary scenarios, and (4) speaking fluidly under follow-up pressure.

Interview me for 10 minutes to find my weakest of the four. Ask me one quick question from each category — "give me the 30-second version of a project you built", "agents or workflows and why", "sketch a RAG system for legal docs in one minute", then one surprise follow-up on whatever I said. After my four answers, rank the four skills from strongest to weakest with one sentence of evidence each, and tell me which prep session deserves double time.
```

```ai-prompt
title: Turn my resume bullets into interview material
---
I'm preparing for AI engineering interviews. Here are the projects I could talk about: [paste your resume bullets or a short list of projects, including your RAG capstone].

For each project, tell me: (1) which interview question type it best answers — project story, opinion evidence, or design experience; (2) the single most impressive technical decision hiding in it that I should lead with; (3) one hard follow-up question an interviewer would ask about it. Then recommend which ONE project should become my signature story and why — the best stories show a real problem, a considered decision between alternatives, and a measurable outcome.
```
