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

**Week 1 — Foundations (Days 1–7)**

- Day 0 — [Start Here — How to Win This Program](day-00.md)
- Day 1 — [How to Learn + What is RAG](day-01.md)
- Day 2 — [Vectors and Embeddings](day-02.md)
- Day 3 — [Implementing Similarity](day-03.md)
- Day 4 — [Word Math: The Magic of Embeddings](day-04.md) 🎥
- Day 5 — [Setting Up Pinecone](day-05.md)
- Day 6 — [Introduction to Scraping](day-06.md)
- Day 7 — 🌴 Rest day

**Week 2 — Data Pipeline (Days 8–14)**

- Day 8 — [Understanding Chunking](day-08.md)
- Day 9 — [Uploading Documents with a Script](day-09.md)
- Day 10 — [Building the Upload API Route](day-10.md)
- Day 11 — [Querying Documents](day-11.md)
- Day 12 — [Fine-Tuning Overview](day-12.md)
- Day 13 — [Running Fine-Tuning + Assignment 1](day-13.md) 🎥
- Day 14 — 🌴 Rest day

**Week 3 — Agent Architecture (Days 15–21)**

- Day 15 — [Understanding Agent Systems](day-15.md)
- Day 16 — [Prompting for Agents](day-16.md)
- Day 17 — [Implementing the Selector (Text-Based)](day-17.md)
- Day 18 — [Upgrading to Structured Outputs](day-18.md)
- Day 19 — [Graceful Degradation](day-19.md)
- Day 20 — [Implementing the LinkedIn Agent](day-20.md)
- Day 21 — 🌴 Rest day

**Week 4 — RAG Agent (Days 22–28)**

- Day 22 — [Implementing the RAG Agent](day-22.md)
- Day 23 — [Implementing Reranking](day-23.md)
- Day 24 — [Sparse + Dense Vectors (Hybrid Search)](day-24.md)
- Day 25 — [Understanding the Chat Interface](day-25.md)
- Day 26 — [Observability with LangSmith](day-26.md)
- Day 27 — [Assignment 2: RAG Agent](day-27.md) 🎥
- Day 28 — 🌴 Rest day

**Week 5 — Testing & Tools (Days 29–35)**

- Day 29 — [Testing the Selector Agent](day-29.md)
- Day 30 — [LLM as Judge](day-30.md)
- Day 31 — [Tool Calling Concepts](day-31.md)
- Day 32 — [The Reveal + MCP](day-32.md)
- Day 33 — [RAG Without Vectors: The SQL Agent](day-33.md)
- Day 34 — [LLM & RAG Security + Assignment 3](day-34.md) 🎥
- Day 35 — 🌴 Rest day

**Week 6 — Capstone (Days 36–42)**

- Day 36 — [Capstone Kickoff: Your Final Project](day-36.md) 🎥
- Day 37 — [Capstone Development I](day-37.md)
- Day 38 — [Capstone Development II + Assignment 4](day-38.md) 🎥
- Day 39 — [Capstone Development III](day-39.md)
- Day 40 — [Capstone Polish & Documentation](day-40.md)
- Day 41 — [Capstone Demo Recording](day-41.md)
- Day 42 — [Capstone Submission](day-42.md) 🎥

## Assignments

| # | Name | Due | Day |
|---|------|-----|-----|
| 1 | Document Upload | End of Week 2 | Day 13 |
| 2 | RAG Agent | End of Week 4 | Day 27 |
| 3 | Reranking | Mid Week 5 | Day 34 |
| 4 | SQL Agent | Week 6 | Day 38 |
| 5 | Capstone | End of course | Day 42 |

Submission stays on Typeform (links live inline in the day files).
Post your work in Slack for feedback.

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
