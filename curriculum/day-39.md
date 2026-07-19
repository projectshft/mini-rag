# Day 39 — Capstone Development III


> **Today:** agent behavior and edge cases. Your pipeline works on the happy path — now make it behave when the query is weird, the retrieval is empty, or the user asks something your data can't answer.

## The goal: a system that fails gracefully

Reviewers (and future users) don't judge your capstone by its best answer — they judge it by its worst one. Today you hunt for that worst answer and fix it.

- [ ] **Throw hostile queries at it**: empty strings, one-word queries, questions completely outside your data's domain, questions that are *almost* in domain but not answerable
- [ ] **Handle the "no good match" case** — if top-k similarity scores are all low, say "I don't know" instead of letting the LLM improvise (the score-thresholding pattern from [Day 23](/learn/day-23))
- [ ] **If you have agents/routing**: verify the selector sends ambiguous queries somewhere sensible, and add a fallback path when it can't decide ([Day 19](/learn/day-19)'s graceful degradation applies directly)
- [ ] **Finish your unique feature** — it should be demoable by end of day, because tomorrow is polish, not construction
- [ ] **Add 3 more saved test queries** covering the edge cases you just fixed

<details>
<summary>The five failure modes to check, in order of embarrassment</summary>

1. **Confident hallucination on out-of-domain questions** — worst one to show in a demo. Fix with score thresholds + an honest "that's not in my data" response.
2. **Crash on empty/malformed input** — cheapest to fix, validate before you retrieve.
3. **Retrieval returns the same chunk 5 times** — dedupe by document ID or raise diversity (fetch more candidates, dedupe, then take top-k).
4. **Answers that ignore the retrieved context** — usually a prompt problem: tell the model to answer *only* from context and to say when context is insufficient.
5. **Latency spikes** — log per-step timings once; you can't fix what you haven't measured.

</details>

<details>
<summary>Behind schedule? Here's the triage</summary>

Unique feature not done? **Shrink it, don't drop it** — the requirement is one feature not covered in the curriculum, not a big one. A "sources cited with every answer" feature or a similarity-score confidence badge counts and takes an hour. Edge-case handling beats feature breadth: cut extra polish, keep the "I don't know" path.

</details>

**Optional extension:** if your capstone involves multi-step agent workflows, the two bonus LangGraph lessons (LangGraph concepts, and building custom state graphs) are worth a look — they live in the course repo's curriculum source, not on this site.

## Key takeaways

- A capstone is judged by its worst answer: hunt for it deliberately with hostile queries
- "I don't know" backed by a score threshold is a feature, not a failure
- Every edge case you fix becomes a saved test query — your regression suite grows with your confidence

## Work with AI

```ai-prompt
title: Generate edge-case inputs for my retrieval
---
My capstone RAG system answers questions about: [your domain]. Its data covers: [brief description of the corpus].

Generate 15 edge-case queries in five categories (3 each): (1) completely out-of-domain, (2) in-domain but unanswerable from my described data, (3) ambiguous — could mean two different things, (4) malformed — empty, emoji-only, 500-word rambles, non-English, (5) adversarial — queries that try to make the system contradict its own data or leak its prompt. For each, state what a *well-behaved* system should do. I'll run them and paste the worst three responses back — then help me fix those.
```

```ai-prompt
title: Design my "I don't know" threshold
---
My RAG system retrieves top-k chunks with cosine similarity scores. Here are real scores from 6 of my queries — 3 that got good answers and 3 that hallucinated: [paste query -> top-3 scores for each].

Help me pick a thresholding strategy: absolute score cutoff vs. gap-based (top score vs. runner-up) vs. requiring N chunks above a floor. Reason from MY numbers, not generic advice. Then write the exact guard clause logic (pseudocode is fine) and the honest fallback message my system should return, and tell me how I'd know if the threshold is set too aggressively.
```
