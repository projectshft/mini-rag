# Instructor TODOs

Running list of things only you can do. Kept short on purpose.

## Videos to record

The course already has ~23 walkthroughs, and it's deliberately **text-first** —
so this list is short by design. Record these only; everything else stays
text + interactive.

### High value — worth recording

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

- Day 32 — MCP → recorded; the walkthrough is embedded in `curriculum/day-32.md`.
- Human in the Loop → uses the killer_agents walkthrough (`bLyg4DvdgXW`).
- 5-step AI Advisor challenge → all 5 steps have videos (from the ai-advisor course).
- Days 1–26 → have walkthroughs.
- Everything else (LLM-as-Judge, SQL agent, security, capstone dev days, Bible
  lab, lead quiz) → text + interactive by design. **No video needed.**

## Other open items

- [x] **Assignment submission** — moved off Typeform entirely. Every
  assignment is now posted in the Slack channel
  **#all-parsity-dev-accelerator** (video + code, say which assignment).
  The old Video/Code forms (`NdVcsThQ` / `A0pGKPqU`) and the other ten are
  unlinked but kept — past cohort responses live there. Before retiring any
  of those links, check whether a Zapier automation was wired to them.

- [ ] **Test the invite flow end-to-end.** The ticket-drop bug is fixed and
  deployed — send yourself (a second email) a real invite from `/admin`, click
  the email link, confirm you land signed-in. Just to see it work once.
- [ ] **Kill the old keyless Clerk dev instance.** *Not urgent — hygiene, do it
  when convenient.* A dev-only secret (`sk_test…`) briefly landed on the
  `curriculum` branch and was force-pushed off.

  **Audited October 2026 — reachable history is clean.** All 24 origin branches
  were searched for a real Clerk secret in both current trees and full diff
  history: no high-entropy `sk_test_`/`sk_live_` key anywhere. The only
  `sk_test_` match is the `sk_test_your_key` placeholder in `.env.example`,
  which is fine. The `curriculum` branch carries nothing.

  **The force-push is still not the fix, though.** It removes the ref, not
  necessarily the objects — GitHub keeps orphaned commits fetchable by SHA, and
  this repo is public, so the push was broadcast through the events firehose
  that secret-scanning bots read in real time. Treat the key as disclosed and
  revoke it; don't rely on the history being clean.

  **Why it's low severity anyway:** a Clerk *dev* secret reaches only that dev
  instance. It cannot read or modify production, so student accounts are not
  exposed. Worst case someone lists the handful of test users in it (likely just
  your own email), or — if the instance is still unclaimed keyless — claims it,
  which leaves a stray instance under someone else's control rather than hurting
  anything here. A session forged there gets nobody into `/learn`, which runs on
  production keys.

  **To close it:** dashboard.clerk.com → the throwaway application → delete the
  instance, or regenerate its secret key. Deleting is definitive. If it's
  unclaimed keyless, claim it first so you can delete it. Worth doing mostly
  because the security lesson in the curriculum tells students not to leave live
  credentials lying around.
- [ ] **Decide placement of the two Going-Further lessons** (MCP in Production,
  Human in the Loop). They're in "Week 7 — Going Further" now. HITL builds on
  the Day 33 SQL agent, so it *could* go inline in Week 5 — but that shifts the
  later day numbers and the Assignments table. Fine as-is; move only if you want.
- [ ] **Curriculum-error Typeform (if still wanted).** Early on you wanted the
  nav "Ask a question" split into "Submit a question" + "Curriculum error" —
  two forms. It was never done (needed the second form's URL). Send the URL and
  it's a 5-minute change, or drop it.
