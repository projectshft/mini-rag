# Putting This on Your Résumé


> **This session:** you just built things most résumés can't describe. This session turns the program into a résumé block and a capstone entry — and, more importantly, teaches you to write lines you can defend, because every line you put on paper is a question you're volunteering to answer.

## Why this gets its own session

"AI engineering" on a résumé is noise. Everyone writes it now. Recruiters have stopped reading it and hiring managers have started distrusting it.

Specific systems are signal. "Built a RAG pipeline with reranking over a Pinecone index" is a sentence a person can interrogate — which is exactly why it works. It tells the reader you've made real decisions, and it invites the follow-up you've spent this playbook preparing for.

The rule that governs everything below:

> **Never write a line you can't spend five minutes defending.**

A résumé line that collapses under one question does more damage than a blank space. If you skipped a lab, delete its bullet. Nobody is checking your completion percentage. Interviewers *are* checking whether you actually did what you claim.

## Where this section goes

Add a heading — **Advanced Technical Training** — and place it:

- **Below** your work experience, if you have relevant engineering experience. Your job history is still the headline.
- **Above** your work experience, if you're career-changing, returning, or your recent roles don't point at engineering. In that case this section plus your capstone *is* the pitch.
- **Never** buried under Education at the bottom. This is training you finished weeks ago, not a degree from a decade ago.

Your capstone gets its own entry under Projects, described below.

## The block

Copy this, then cut it down. Do not paste all seven bullets — pick the **four or five** that match the job you're applying to. A seven-bullet training section reads like padding; four sharp ones read like a portfolio.

```
Advanced Technical Training

Parsity — Applied AI Engineering Program
6-Week Intensive | U.S. Department of Labor grant-supported curriculum

• Completed an intensive applied AI engineering program focused on designing and
  building production-ready AI systems, including RAG, agent architectures,
  embeddings, evaluation, observability, and human-in-the-loop workflows.

• Built a full-stack retrieval-augmented generation application in TypeScript and
  Next.js using OpenAI embeddings and a Pinecone vector index, covering the full
  pipeline: scraping, chunking, metadata-tagged ingestion, retrieval, and reranking.

• Implemented a multi-agent router using structured outputs and graceful
  degradation, dispatching requests to specialized agents (vector retrieval,
  fine-tuned generation, general fallback) across a validated schema contract.

• Built a natural-language-to-SQL agent over a PostgreSQL database and gated its
  destructive operations behind a propose → human-approve → execute workflow,
  applying patterns for safely integrating AI agents with deterministic
  application logic.

• Exposed the retrieval system to external AI clients as a Model Context Protocol
  (MCP) server with typed tool schemas, consumable by Claude Desktop and other
  MCP hosts.

• Added LLM observability and tracing with LangSmith and developed automated
  evaluations — LLM-as-judge scoring and routing regression tests — to measure
  system behavior and catch regressions before deploy.

• Designed and built an independent AI engineering capstone, taking the system
  from architecture and implementation through evaluation and deployment.
```

## Only claim what you built

Each bullet maps to specific work. Keep the ones you actually finished, delete the rest:

| Bullet | You can keep it if you | 
|--------|------------------------|
| Program summary | Finished the program. Always keep this one. |
| RAG application | Built the upload pipeline, the RAG agent, and reranking |
| Multi-agent router | Built the selector with structured outputs and a fallback path |
| SQL agent + human-in-the-loop | Did the SQL agent lab **and** the approval-gate lab |
| MCP server | Built the MCP server and connected it to a client |
| Observability + evals | Wired LangSmith tracing and wrote the judge or the routing tests |
| Capstone | Shipped a capstone |

Did the SQL agent but not the approval gate? Cut the second half of that bullet. Half a true claim beats a whole false one.

## The capstone entry

The training block proves you were taught. The capstone proves you can build unsupervised — which is the thing employers are actually nervous about. Give it its own Projects entry:

```
Capstone: [Project Name]                                    [link to repo or demo]

• Built [what you built] using [key technologies] to [business/user problem it solves].
• Designed [RAG / agent / tool-calling / workflow] to [specific capability or
  architectural reason].
• Implemented [evaluation / observability / data pipeline] using [technology]
  to [measurable or practical outcome].
```

Filled in, it should read like this:

```
Capstone: Ticket Triage Assistant                          github.com/you/triage

• Built a support-ticket answering assistant over 4,000 archived tickets using
  Next.js, Pinecone, and gpt-4o-mini, cutting "has anyone solved this before?"
  from a manual search to a single question.
• Designed a reranking pass over the top 20 vector hits after raw top-5 cosine
  similarity kept surfacing near-duplicate short tickets instead of the one
  ticket with the actual resolution.
• Implemented an LLM-as-judge eval over 50 held-out tickets to catch answer-
  quality regressions before shipping prompt changes.
```

Notice what the second bullet does: it names a **problem the naive approach had** and the fix. That single move separates someone who built a system from someone who followed a tutorial, and it's the fastest way to signal it on paper.

Three bullets. Not six. The résumé's job is to earn the conversation, not have it.

## Every line is a question

Before you submit anything, read each line and write down the question it invites. If you don't have an answer, the line isn't ready.

| What you wrote | What they will ask |
|----------------|--------------------|
| "chunking and metadata-tagged ingestion" | What chunk size, and why? What broke when you got it wrong? |
| "reranking" | Reranking what, with what, and how did you know it helped? |
| "structured outputs" | What happens when the model returns something off-schema? |
| "human-in-the-loop" | Which actions did you gate, and how did you decide where the line was? |
| "observability with LangSmith" | What did a trace actually tell you that logs didn't? |
| "cut retrieval time" / any number | How did you measure it? Measured against what baseline? |

You've already done this work — this is your signature story and your tradeoff opinions, compressed to one line each. The résumé is just the index into them.

**Never put a number on your résumé you didn't measure.** A fabricated "improved accuracy 40%" is the single fastest way to lose an interview, because the follow-up is always "how did you measure that?" and there is no recovering from a blank stare. If you didn't measure it, describe the capability instead of quantifying it.

## Weak vs strong, same project

❌ "Utilized cutting-edge AI/ML technologies including LLMs, vector databases, and prompt engineering to build innovative solutions."

Nothing here is checkable. No system, no decision, no problem. A hiring manager reads this and learns only that you've seen the words.

✅ "Built a RAG assistant over 4,000 support tickets (Next.js, Pinecone, gpt-4o-mini); added a reranking pass after top-5 similarity kept returning near-duplicates instead of resolutions."

Same project. One is a claim about you; the other is a claim about a system, and the system can be discussed.

The pattern: **what you built → what it runs on → the decision you made and why.**

## Your LinkedIn headline

Same rules, less room. Skip "AI Enthusiast" and "Aspiring AI Engineer" — *aspiring* tells recruiters to filter you out, and enthusiasm isn't a qualification.

Write what you build:

- "Full-stack engineer building RAG and agent systems — TypeScript, Pinecone, OpenAI"
- "Software engineer | Retrieval-augmented generation, LLM evaluation, agent architectures"

Then put the capstone in your Featured section with the demo video you already recorded. That video is doing more work there than another paragraph of text ever will.

## Do this now

1. Draft the training block — four or five bullets, only what you built.
2. Draft the capstone entry using the three-bullet template.
3. For every line, write the question it invites and answer it out loud. Cut anything you stumble on.
4. Update your LinkedIn headline and Featured section.
5. Post the draft in the course Slack for feedback before you send it anywhere.

## Key takeaways

- Every résumé line is a question you're volunteering to answer — never write one you can't defend for five minutes
- Specific systems are signal; "AI engineering" as a phrase is noise, and interviewers have started discounting it
- Delete bullets for labs you skipped — half a true claim beats a whole false one
- The capstone bullet that names a problem the naive approach had is the one that proves you built rather than followed
- Never put a number on paper you didn't measure; describe the capability instead
- Four or five sharp bullets read like a portfolio; seven read like padding

## Work with AI

```ai-prompt
title: Interrogate my résumé bullets
---
Here is the "Advanced Technical Training" and capstone section of my résumé, describing an applied AI engineering program where I built a RAG application (TypeScript/Next.js, OpenAI embeddings, Pinecone), a multi-agent router with structured outputs, a natural-language-to-SQL agent with a human approval gate, an MCP server, and LangSmith tracing with automated evals:

[paste your draft]

Act as a skeptical hiring manager who reads 200 of these a week. Go line by line and for each one: (1) state the exact follow-up question you'd ask in a screen, (2) rate how well the line survives that question, 1-10, (3) flag any claim that is vague, unmeasurable, or sounds copy-pasted from a course description. Then tell me which two bullets I should cut entirely and why, and rewrite my weakest bullet using the pattern "what I built → what it runs on → the decision I made and why". Do not compliment anything — I want the version of this that gets me screened out, so I can fix it first.
```

```ai-prompt
title: Tailor my block to a specific job posting
---
Here is my AI engineering training and capstone résumé section:

[paste your draft]

Here is a job posting I'm applying to:

[paste the posting]

Pick the four bullets from my section that map most directly to this posting's actual requirements, and tell me which ones to drop for this application. For each bullet you keep, suggest a rewording that uses the posting's own vocabulary WITHOUT claiming anything my original bullet didn't already claim — flag it immediately if a rewording would overstate what I did. Then list the two or three things this posting wants that my current section doesn't evidence at all, and tell me whether each is something I could honestly add from work I've done, or a genuine gap I should be ready to address in the screen.
```
