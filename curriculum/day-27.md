# Day 27 — Assignment 2: RAG Agent

**Time:** ~90 min · Assignment

> **Today:** ship it. Assignment 2 is due — a working RAG agent extended with query preprocessing, plus a video where you explain how you evaluate retrieval quality. This is the Feynman moment for everything you built this week.

## What your RAG agent must do

Quick recap of the week. Your `ragAgent` in [`app/agents/rag.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/agents/rag.ts) should run the full pipeline from [Day 22](/learn/day-22):

1. **Embed** the refined query with `text-embedding-3-small` — the same model your documents were embedded with
2. **Search** Pinecone with `topK` and `includeMetadata: true`
3. **Extract** the chunk text from `match.metadata`, filtering empties, joined into one context string
4. **Prompt** the LLM with the original query, refined query, retrieved context, and an explicit "say so if the context is insufficient" instruction
5. **Stream** the response with `streamText`

On top of that working pipeline, the assignment adds **query preprocessing** — cleaning up messy, casual queries *before* they're embedded, because retrieval is only as good as the query vector:

- Expand common abbreviations ("JS" → "JavaScript", "DB" → "database")
- Normalize casing for technical terms
- Strip filler words that don't help retrieval ("um", "like", "basically")
- Handle common typos with fuzzy matching (optional stretch goal)

You should be able to demonstrate a **before/after**: a messy query that retrieves poorly raw, and well after preprocessing.

(If you also implemented reranking from [Day 23](/learn/day-23) — great, keep it. It isn't required here; it's the core of Assignment 3 on [Day 34](/learn/day-34).)

## 🎥 Assignment

### Video (3–4 minutes)

Record yourself explaining **how you evaluate retrieval quality**, Feynman-style — as if to a sharp colleague who's never built RAG. Address these four questions:

1. **Chunk sizing** — how do you know if your chunks are too big or too small? What symptoms would you see?
2. **Retrieval accuracy** — how do you know if you're retrieving the right content? What would "wrong" look like?
3. **Similarity thresholds** — how do you decide what score is "good enough"? What happens if the bar is too high or too low?
4. **Metrics** — what would you track in production to monitor retrieval quality? (Yesterday's [LangSmith setup](/learn/day-26) should give you ideas.)

Give **specific examples from your implementation** — real queries you ran, real scores you saw, real chunks that came back. Concrete beats abstract every time.

### Code

**Complete the TODOs** in the RAG agent so it retrieves and answers, then **extend it** with query preprocessing as described above.

**Files:**

- [`app/agents/rag.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/agents/rag.ts)

### Submit your work

- [Video Submission](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission](https://form.typeform.com/to/EWWcsorL)

And **post your work in Slack** — the before/after preprocessing demo makes a great post, and feedback from the group regularly catches things the rubric doesn't.

## What "done" looks like

- [ ] `ragAgent` completes all five pipeline steps and streams grounded answers through the chat UI
- [ ] Asking about content you uploaded returns answers that actually use the retrieved context (verify in your LangSmith traces)
- [ ] Asking about content you *didn't* upload gets an honest "the context doesn't cover this," not a hallucination
- [ ] Query preprocessing runs before embedding: abbreviations expanded, casing normalized, filler words stripped
- [ ] You can demonstrate before/after: one messy query where preprocessing measurably improves what's retrieved
- [ ] Video is 3–4 minutes, covers all four evaluation questions, and uses examples from *your* system
- [ ] Both Typeform submissions sent, work posted in Slack

## Common pitfalls

**Preprocessing the wrong string.** The selector already refines the raw user message into `request.query`. Your preprocessing should feed the *embedding* — make sure you embed the preprocessed text, not the original.

**Rewriting the query so hard it loses meaning.** Stripping words is safe; aggressive synonym-swapping can shift the embedding away from what the user meant. Test every rule with real queries.

**A video that recites definitions.** "Chunks can be too big or too small" earns no points. "My 1000-char chunks kept splitting code examples mid-function, so answers about `useState` came back half-baked — here's the trace" is what a 3–4 minute video should sound like.

<details>
<summary>💡 Detail — why messy queries tank retrieval (the thing your preprocessing fixes)</summary>

Embeddings encode *everything* in the input, including noise. "um so like how do i do the JS thing with, you know, state?" spends its vector budget on filler and vagueness, so its nearest neighbors are only loosely related chunks. Strip the filler and expand "JS" → "JavaScript", and the query vector moves measurably closer to your React state-management chunks. Log the top-5 scores for both versions of the query — the after-scores should be higher *and* more spread out. That logged comparison is exactly the before/after demo the assignment asks for, and a great clip for your video.

</details>

<details>
<summary>💡 Detail — a clean shape for the preprocessing code</summary>

Resist the urge to inline regexes into `ragAgent`. A small pure function is easier to test and easier to demo:

```typescript
const ABBREVIATIONS: Record<string, string> = {
	js: 'JavaScript',
	ts: 'TypeScript',
	db: 'database',
};

const FILLER = new Set(['um', 'uh', 'like', 'basically', 'actually']);

export function preprocessQuery(raw: string): string {
	return raw
		.split(/\s+/)
		.filter((w) => !FILLER.has(w.toLowerCase()))
		.map((w) => ABBREVIATIONS[w.toLowerCase()] ?? w)
		.join(' ')
		.trim();
}
```

Then in `ragAgent`: `const query = preprocessQuery(request.query);` and embed `query`. Being a pure function, you can demo it in isolation and unit-test it later (testing week is coming on [Day 29](/learn/day-29)).

</details>

```quiz
[
  {
    "q": "Where in the pipeline must query preprocessing happen to affect retrieval?",
    "options": ["After Pinecone returns matches, before building the prompt", "Before the query is embedded — retrieval is driven entirely by the query vector", "Inside the system prompt"],
    "answer": 1,
    "explain": "Once the query is embedded, retrieval is decided. Cleaning the text after embedding changes nothing about which chunks come back."
  },
  {
    "q": "Your chunks are too BIG. What symptom shows up in your RAG answers?",
    "options": ["Answers cite documents that don't exist", "Retrieval returns nothing at all", "Matches are topically 'in the area' but the answer drowns in loosely related text — precision drops because each chunk mixes several ideas"],
    "answer": 2,
    "explain": "Oversized chunks blur multiple topics into one vector, so the retrieved text contains the answer plus a lot of noise — and sometimes the model latches onto the noise."
  },
  {
    "q": "What happens if your similarity threshold is set too HIGH?",
    "options": ["The system rejects usable context and says 'I don't know' to questions it could have answered", "More hallucinations", "Latency increases"],
    "answer": 0,
    "explain": "Too strict a bar filters out genuinely helpful chunks (good matches often score lower than you'd expect). Too low a bar is the opposite failure: junk context sneaks in and invites hallucination."
  },
  {
    "q": "Which is the strongest production metric for monitoring retrieval quality over time?",
    "options": ["Average response length", "Top-match similarity score distributions per query (plus rate of 'insufficient context' answers), tracked across deploys", "Total Pinecone vector count"],
    "answer": 1,
    "explain": "Score distributions shift when chunking, preprocessing, or data changes — a drop is an early warning. Pair it with the 'I don't know' rate to catch both silent degradation and over-filtering."
  }
]
```

## ✅ Key takeaways

- Retrieval quality is decided **before** the LLM ever runs — the query vector and the chunk vectors do all the work
- Query preprocessing is high-leverage: cheap string cleanup measurably moves the query vector toward the right chunks
- Evaluate retrieval with evidence, not vibes: logged scores, before/after comparisons, and LangSmith traces
- Every threshold is a trade-off — too high rejects good context ("I don't know" to answerable questions), too low invites hallucination
- If you can't explain your evaluation approach out loud in 4 minutes with real examples, you've found the gap to study — that's the Feynman Technique doing its job

## 🤖 Work with AI

```ai-prompt
title: Review my RAG agent like a staff engineer
---
I'm submitting a RAG agent for a course assignment. It lives in app/agents/rag.ts and does: query preprocessing (abbreviation expansion, casing normalization, filler-word stripping) → embedding with text-embedding-3-small → Pinecone query (topK, includeMetadata) → context extraction from metadata → grounded system prompt (original + refined query + context + "say if insufficient") → streamText with gpt-4o.

I'll paste the full file. Review it like a staff engineer doing a pre-merge pass: (1) correctness bugs and unhandled edge cases (empty matches, missing metadata.text, preprocessing applied to the wrong string, empty context), (2) whether my preprocessing could ever CORRUPT a query rather than improve it — give a concrete input that breaks each rule if you find one, (3) prompt weaknesses that could invite hallucination. Rank findings by severity, and tell me the one change with the best effort-to-payoff before I submit.
```

```ai-prompt
title: Help me rehearse my video explanation
---
I'm about to record a 3–4 minute Feynman-style video on evaluating retrieval quality in my RAG system. I must cover: chunk sizing symptoms, retrieval accuracy (what "wrong" looks like), choosing similarity thresholds, and production metrics.

Run a rehearsal: I'll deliver my explanation as text. Time-check it (roughly 150 words per spoken minute), then grade each of the four topics on (a) did I use a SPECIFIC example from my own implementation, and (b) would a smart non-RAG engineer follow it. Ask me the two follow-up questions a skeptical reviewer would ask. If any section was generic textbook-talk, make me redo just that section with a concrete example before you sign off.
```
