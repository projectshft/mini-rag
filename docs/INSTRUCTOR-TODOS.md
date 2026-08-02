# Instructor TODOs

Running list of things only you can do. Kept short on purpose.

## Videos to record

The course already has ~23 walkthroughs, and it's deliberately **text-first** —
so this list is short by design. Record these only; everything else stays
text + interactive.

### High value — worth recording

- [ ] **Day 32 — MCP** (`curriculum/day-32.md`). No video, and it's the hottest,
  most-confusing topic in the course. **Highest-leverage video you could add.**
  Three beats, ~6–8 min total — the value is in showing the *loop*, not the
  finished server:
  1. **Build the local server.** `mcp/rag-server.ts` — one tool, `search_docs`,
     wrapping the retrieval they already have. Say out loud why it's stdio and
     why `console.log` would corrupt the protocol.
  2. **Inspect it before any client touches it.** Launch the MCP Inspector,
     show the tool appearing in the list, call it with a query you know is in
     the index, show real matches coming back. This is the beat students will
     rewatch — it's the difference between "MCP is magic config" and "MCP is a
     server I can poke at." Show a failure too if you can: call it with a bad
     arg and let them see the error surface in the Inspector rather than
     silently inside a chat client.
  3. **Expose it to Claude Code.** Register it, restart, verify it's connected,
     then ask a question that makes the model call the tool — and show the tool
     call happening, not just the answer.

  The arc to narrate: *build it → prove it works in isolation → then let a
  client use it.* Most people skip the middle step and then can't debug.
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

- [ ] **Retitle the two submission forms + add an assignment question.** Every
  assignment now points at the same two forms, reused across all seven:
  - **Video** → `NdVcsThQ`
  - **Code** → `A0pGKPqU`

  Both were the old "Document Upload" pair, so their titles still say that.
  Two things to do in Typeform: rename them to something generic
  ("Assignment — Video" / "Assignment — Code"), and **add a required
  "Which assignment?" dropdown** — Word Math, Document Upload, Agent Router,
  RAG Agent, Security, Capstone Proposal, Capstone. Without that field you
  can't tell submissions apart.

  The other ten forms are now unused. Don't delete them — past cohort
  responses live there. Also check whether any Zapier automation was wired to
  the retired ones.

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
