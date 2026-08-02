# RAG & AI Agents — 42-Day Curriculum

This folder is the single source of truth for the course site at `/learn`.
One file per study day (`day-NN.md`), rendered by `lib/lms/curriculum.ts`.
Edit a day file, push to `main`, and the site updates on the next deploy.

**The "Week index" section below is the canonical order.** The parser reads
it: week headers are bold lines, each study day is a `- Day N — [title](day-NN.md)`
link, 🎥 marks assignment-due days, and rest days are plain (link-less) lines.
See [AUTHORING.md](./AUTHORING.md) for the day-file format and the interactive
blocks (`quiz`, `visual`, `ai-prompt`, `<details>` reveals).

## Week index

<!-- Day numbers are computed from position — do NOT hand-number these lines.
     To add/move/remove a lesson: edit this list only (a bullet WITH a link is
     a lesson page; a bullet WITHOUT a link is a no-page day like a rest day).
     Filenames are stable ids tied to student progress — never rename them; new
     lessons can use any unused slug. Week day-ranges are computed too. -->

**Week 1 — Foundations**

- [Start Here — How to Win This Program](day-00.md)
- [How to Learn + What is RAG](day-01.md)
- [Vectors and Embeddings](day-02.md)
- [Implementing Similarity](day-03.md)
- [Word Math: The Magic of Embeddings](day-04.md) 🎥
- [Setting Up Pinecone](day-05.md)
- [Introduction to Scraping](day-06.md)
- Rest day

**Week 2 — Data Pipeline**

- [Understanding Chunking](day-08.md)
- [Uploading Documents with a Script](day-09.md)
- [Building the Upload API Route](day-10.md)
- [Querying Documents](day-11.md)
- [Fine-Tuning Overview](day-12.md)
- [Fine-Tuning as History + Assignment](day-13.md) 🎥
- Rest day

**Week 3 — Agent Architecture**

- [Understanding Agent Systems](day-15.md)
- [Prompting for Agents](day-16.md)
- [Implementing the Selector (Text-Based)](day-17.md)
- [Upgrading to Structured Outputs](day-18.md)
- [Graceful Degradation](day-19.md)
- [Implementing the LinkedIn Agent + Assignment](day-20.md) 🎥
- Rest day

**Week 4 — RAG Agent**

- [Implementing the RAG Agent](day-22.md)
- [Implementing Reranking](day-23.md)
- [Sparse + Dense Vectors (Hybrid Search)](day-24.md)
- [Understanding the Chat Interface](day-25.md)
- [Observability with LangSmith](day-26.md)
- [Assignment: RAG Agent](day-27.md) 🎥
- Rest day

**Week 5 — Testing & Tools**

- [Testing the Selector Agent](day-29.md)
- [LLM as Judge](day-30.md)
- [Tool Calling Concepts](day-31.md)
- [The Reveal + MCP](day-32.md)
- [RAG Without Vectors: The SQL Agent](day-33.md)
- [LLM & RAG Security + Assignment](day-34.md) 🎥
- Rest day

**Week 6 — Capstone**

- [Capstone Kickoff: Your Final Project](day-36.md) 🎥
- [Capstone Development I](day-37.md)
- [Capstone Development II](day-38.md)
- [Capstone Development III](day-39.md)
- [Capstone Polish & Documentation](day-40.md)
- [Capstone Demo Recording](day-41.md)
- [Capstone Submission](day-42.md) 🎥

**Week 7 — Going Further (optional)**

- [MCP in Production: Auth, Tools & Resources](day-43.md)
- [Human in the Loop: Gating an Agent's Destructive Actions](human-in-the-loop.md)

## Assignments

Assignments are **not numbered** — a number in the lesson text goes stale the
moment a day moves. Each one is named for what you build, and lives on the day
it's due. Link to the day, never to "Assignment 3".

Every assignment is due in the same week its material is taught, on the
lightest day of that week. One per week, plus the capstone bookends.

| Assignment | Due | Covers |
|------------|-----|--------|
| [Word Math](day-04.md) | Week 1 | embeddings, vector arithmetic |
| [Document Upload](day-13.md) | Week 2 | chunking, ingestion, sanitization |
| [Agent Router](day-20.md) | Week 3 | selector, structured outputs, few-shot |
| [RAG Agent](day-27.md) | Week 4 | retrieval, preprocessing, reranking, threshold |
| [Security](day-34.md) | Week 5 | prompt injection, document poisoning, layered defense |
| [Capstone proposal](day-36.md) | Week 6 | scope and plan |
| [Capstone](day-42.md) | End of course | the whole thing |

Two forms, reused for every assignment — one for your video, one for your code —
linked inline on each assignment day. Tell the form which assignment you're
submitting. Post your work in Slack too.

Optional and ungraded: the [SQL agent lab](day-33.md), the
[LLM-as-judge exercise](day-30.md), and the [Bible chunking lab](bonus-bible-chunking.md).

## Bonus lessons

Optional labs — always available, never required. Same file format as day
files (slug prefix `bonus-`).

- [Optional Lab: Chunk the Bible and Store It in Pinecone](bonus-bible-chunking.md)

## Interview prep

Bonus section, **gated per student** — locked by default, unlocked from
`/admin` (the 🎤 toggle) near the end of the program. Same file format as
day files, but no "Day N —" title prefix.

- [The AI Engineering Interview Playbook](interview-01.md)
- [Your Signature Story](interview-02.md)
- [Strong Opinions on Tradeoffs](interview-03.md)
- [RAG System Design Interviews](interview-04.md)
- [Live Practice](interview-05.md)

## Code

Students work in this repo's **`student-todo-exercises`** branch — starter
code with TODOs. Day files link into it directly. This `curriculum/` folder
must never be synced to that branch.
