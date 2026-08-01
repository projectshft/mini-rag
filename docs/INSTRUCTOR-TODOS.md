# Instructor TODOs

Running list of things only you can do. Kept short on purpose.

## Videos to record

The course already has ~23 walkthroughs, and it's deliberately **text-first** —
so this list is short by design. Record these only; everything else stays
text + interactive.

### High value — worth recording

- [ ] **Day 32 — MCP** (`curriculum/day-32.md`). No video today, and it's the
  hottest, most-confusing topic in the course. A 4–5 min screen-share building
  the single-tool `search_docs` server and calling it from Claude/Cursor would
  carry the whole MCP arc. **Highest-leverage video you could add.**
- [ ] **Day 36 — Capstone Kickoff** (`curriculum/day-36.md`). No video. This is
  the moment students shift from "follow along" to "build your own." A short
  (2–3 min) "how to pick and scope your project" pep-talk is worth more here
  than in any technical lesson — it drives completion.
- [ ] **RAG System Design** (`curriculum/interview-04.md`). No video, and it may
  be the highest-leverage of all: designing a RAG system live is what senior
  interviews actually probe, and interview prep maps straight to placement.
  Walk the reference architecture out loud + the tradeoffs to name (chunking,
  hybrid retrieval, reranking, evals, cost) — how you'd defend each in a room.

### Optional — nice, not necessary

- [ ] **Day 43 — MCP in Production** (`curriculum/day-43.md`, Going Further). New
  advanced lesson, no video. If you record the Day 32 MCP video, a short
  follow-up on the auth / threat-model piece would pair well. Skip otherwise —
  the written spec stands on its own.

### Already covered (no action)

- Human in the Loop → uses the killer_agents walkthrough (`bLyg4DvdgXW`).
- 5-step AI Advisor challenge → all 5 steps have videos (from the ai-advisor course).
- Days 1–26 → have walkthroughs.
- Everything else (LLM-as-Judge, SQL agent, security, capstone dev days, Bible
  lab, lead quiz) → text + interactive by design. **No video needed.**

## Other open items

- [ ] **Create the single assignment Typeform.** Every assignment day now links to
  `https://form.typeform.com/to/ASSIGNMENT-FORM` (a placeholder). Build one form
  with four fields — **name/email**, **which assignment** (dropdown: Word Math,
  Document Upload, Agent Router, RAG Agent, Security, Capstone Proposal,
  Capstone), **video link**, **repo link** — then find-and-replace
  `ASSIGNMENT-FORM` with the real id across `curriculum/`. Replaces the old 12
  forms; don't delete those, past cohort responses live in them. Check whether
  any Zapier automation was wired to the old forms before retiring the links.

- [ ] **Test the invite flow end-to-end.** The ticket-drop bug is fixed and
  deployed — send yourself (a second email) a real invite from `/admin`, click
  the email link, confirm you land signed-in. Just to see it work once.
- [ ] **Kill the old keyless Clerk dev instance.** A dev-only secret (`sk_test…`)
  briefly landed on the `curriculum` branch and was force-pushed off. Low
  severity (it's the throwaway keyless instance, not production), but claim or
  delete that instance so the exposed key is dead.
- [ ] **Decide placement of the two Going-Further lessons** (MCP in Production,
  Human in the Loop). They're in "Week 7 — Going Further" now. HITL builds on
  the Day 33 SQL agent, so it *could* go inline in Week 5 — but that shifts the
  later day numbers and the Assignments table. Fine as-is; move only if you want.
- [ ] **Curriculum-error Typeform (if still wanted).** Early on you wanted the
  nav "Ask a question" split into "Submit a question" + "Curriculum error" —
  two forms. It was never done (needed the second form's URL). Send the URL and
  it's a 5-minute change, or drop it.
