# Optional Lab: Measure Your Retrieval (Hit Rate and MRR)

> **This lab:** stop judging retrieval by eye. You'll write a small set of questions with known answers, score your retriever against it with two standard numbers, and then change one thing (reranking, top-k, chunk size) and prove whether it helped. By the end you'll have a before/after table you can put in a README and defend in an interview.

## Why "it feels better" isn't an answer

You've tuned retrieval all course. You added reranking, tried hybrid search, played with chunk size, and each time you ran a few queries, read the results, and decided it looked better.

That's how everyone starts, and it doesn't hold up. Three queries you picked yourself can't tell you whether a change helped the other three hundred. Worse, you can't tell your teammates either. "I bumped the chunk size and it feels better" loses every argument to "I bumped it and hit@3 dropped from 0.80 to 0.64."

The LLM-as-judge tests you wrote score the **answer**. This lab scores the step before it: **did the right chunk come back at all, and how high?** If the answer is wrong, the first question is whether the model got bad context or ignored good context. These numbers tell you which.

```mermaid
flowchart LR
    G[Golden set<br/>question + answer phrase] --> R[Your retriever]
    R --> C[Top-k chunks]
    C --> S{Does a chunk<br/>contain the answer?<br/>At what rank?}
    S --> M[hit@k and MRR]
    M --> X[Change ONE thing]
    X --> R
```

## Two numbers: hit rate and MRR

For each question you know what the answer looks like. Run the retriever and find the **rank** of the first chunk that contains it: 1 if it's the top result, 3 if it's third, nothing if it never shows up.

**Hit rate@k** is the share of questions where the answer showed up anywhere in the top k. It answers "does the model even get a chance?"

**MRR** (mean reciprocal rank) averages `1 / rank` over all questions, and a miss counts as 0. Rank 1 scores 1.0, rank 2 scores 0.5, rank 4 scores 0.25. It answers "how high does it show up?", which matters because the model pays the most attention to what's at the top, and because you may only pass the top few chunks to the model anyway.

Work one by hand before you write code. Five questions, and the rank where each answer first appeared:

| Question | First relevant rank | Hit@1 | Hit@3 | 1 / rank |
| --- | --- | --- | --- | --- |
| How do I memoize a callback? | 1 | ✓ | ✓ | 1.00 |
| When does useEffect run? | 2 | | ✓ | 0.50 |
| Why do list items need keys? | 4 | | | 0.25 |
| What's a controlled input? | 1 | ✓ | ✓ | 1.00 |
| How do I cancel a fetch on unmount? | not found | | | 0 |
| **Score** | | **0.40** | **0.60** | **MRR 0.55** |

```quiz
[
  {
    "q": "Your retriever's hit@10 is 0.92 but its hit@1 is 0.40. What does that tell you?",
    "options": [
      "Vector search is missing most answers, so re-chunk before anything else",
      "The right chunk is usually retrieved but ranked too low, so a reranker is the obvious thing to try",
      "The golden set is too easy"
    ],
    "answer": 1,
    "explain": "Hit@10 says the answer is almost always somewhere in the net. Hit@1 says it's rarely on top. That's a ranking problem, which is exactly what a cross-encoder reranker fixes."
  },
  {
    "q": "hit@10 is 0.55. You add a reranker over the top 10. What happens to hit@10?",
    "options": [
      "It goes up, because the reranker is smarter than cosine similarity",
      "It stays at 0.55. A reranker only reorders what it's given, so it can't bring back a chunk that wasn't retrieved",
      "It goes down, because rerankers drop low-scoring chunks"
    ],
    "answer": 1,
    "explain": "A reranker can move a chunk from rank 8 to rank 1. It can't find a chunk that wasn't in the 10 it was handed. When hit@k is low at a large k, the fix is upstream: chunking, the data, the embedding, or hybrid search."
  },
  {
    "q": "Two retrievers both score hit@5 = 0.80. Retriever A has MRR 0.72, B has MRR 0.48. Which do you ship, all else equal?",
    "options": [
      "A. Same coverage, but its answers land nearer the top",
      "B. Lower MRR means more diverse results",
      "Either one. hit@5 is what matters"
    ],
    "answer": 0,
    "explain": "Same hit rate means they find the answer equally often. MRR breaks the tie: A puts it near the top, where the model pays the most attention and where it survives if you trim context later."
  }
]
```

## The golden set is the hard part

The code in this lab is short. The judgment is all in the question set, so spend your effort here.

Write **20–30 questions** against the index you already built. Each one gets one or more **answer phrases**: a short quote, copied from your source content, that a chunk must contain to count as the right one.

```json
[
	{
		"question": "how do I stop an effect from running on every render?",
		"mustContain": ["dependency array"]
	},
	{
		"question": "why is my list re-rendering every item when one changes?",
		"mustContain": ["keys help React identify", "stable identity"]
	}
]
```

Save it as `app/scripts/data/golden-set.json`.

### The trap: don't label chunk IDs

The obvious design is to label each question with the ID of the correct chunk, like `react-docs-chunk-14`. Don't. Open `chunkText` and look at how IDs are made: `${source}-chunk-${chunkIndex}`. Change the chunk size and chunk 14 holds completely different text. Your labels are now wrong, and the one experiment you most want to run, comparing chunk sizes, is the one your eval can't do.

Labeling the **answer text** instead survives re-chunking. Any chunk that contains "dependency array" is a hit, no matter how the document was cut.

### Rules that keep the set honest

- **Write the question before you look at the chunks.** Write it the way a user would ask it, then go find the answer in your source. Questions written while reading a chunk borrow its exact words, which makes vector search look better than it is.
- **Keep answer phrases short and distinctive.** Roughly 3 to 10 words. "React" matches everything. A full sentence breaks as soon as overlap splits it across two chunks.
- **Mix the question types.** Some that use your docs' exact vocabulary, some paraphrased, some vague ("why is my app slow?"), and a few that need a specific name or error code. That last group is where hybrid search earns its keep.
- **Check each answer really exists.** Search your source for every phrase. A typo turns a question into a permanent miss that you'll spend an hour blaming on the retriever.

Don't spend more than 30 minutes on the first version. You'll fix it after the first run shows you which questions are broken.

## Build the eval

Write `app/scripts/exercises/retrieval-eval.ts`. It loads the golden set, runs each question through a **retriever** (any function that takes a question and returns ranked chunk text), records the rank of the first chunk containing an answer phrase, and prints hit@1, hit@3, hit@5, MRR, and the questions that missed.

Treat the retriever as a plain function type, `(question, k) => Promise<string[]>`. Then "vector only" and "vector + rerank" are just two functions you pass to the same `evaluate`, and you're comparing like for like.

```blanks
{
  "title": "Complete the scoring functions",
  "note": "ranks holds one entry per question: the 1-indexed rank of the first relevant chunk, or null for a miss.",
  "code": "function hitRate(ranks, k) {\n  return ranks.filter((r) => r !== null && r ___1___ k).length / ranks.length;\n}\n\nfunction mrr(ranks) {\n  return ranks.reduce((sum, r) => sum + (r ? ___2___ : 0), 0) / ___3___;\n}",
  "blanks": [
    { "options": ["<=", "<", ">="], "answer": "<=", "explain": "hit@3 includes rank 3. With < you'd be computing hit@2 and wondering why the number looks low." },
    { "options": ["1 / r", "r", "1 / (r + 1)"], "answer": "1 / r", "explain": "Ranks are already 1-indexed, so the top result scores 1/1 = 1.0. Adding 1 would be right only if you'd stored 0-indexed positions." },
    { "options": ["ranks.length", "ranks.filter(Boolean).length", "k"], "answer": "ranks.length", "explain": "Divide by every question, misses included. Dividing by hits only would make a retriever that finds 1 answer at rank 1 score a perfect 1.0." }
  ]
}
```

<details>
<summary>Hint 1: matching an answer phrase against a chunk</summary>

Compare normalized text: lowercase, punctuation replaced by spaces, whitespace collapsed. `chunkText` splits on `.`, `!` and `?` and rejoins with a period, so raw text like `e.g. a list` shows up in a chunk as `e. g. a list.`. Exact string matching would call that a miss. After normalizing, both sides read `e g a list`.

</details>

<details>
<summary>Hint 2: the two retrievers</summary>

- **Vector only:** `searchDocuments(question, k)` from `app/libs/pinecone.ts`, then map each match to `metadata.text` (fall back to `metadata.content`, like the RAG agent does).
- **Vector + rerank:** over-fetch (say 20) with `searchDocuments`, pass the texts to `pineconeClient.inference.rerank('bge-reranker-v2-m3', question, texts)`, and return the top k reranked texts. That's the same call your RAG agent makes.

</details>

<details>
<summary>Solution: don't open until you've tried</summary>

```typescript
// app/scripts/exercises/retrieval-eval.ts
// Run with: npx ts-node app/scripts/exercises/retrieval-eval.ts
import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

const rootDir = path.resolve(__dirname, '../../..');
const envLocalPath = path.join(rootDir, '.env.local');
dotenv.config({
	path: fs.existsSync(envLocalPath) ? envLocalPath : path.join(rootDir, '.env'),
});

import { pineconeClient, searchDocuments } from '../../libs/pinecone';

type GoldenItem = { question: string; mustContain: string[] };
type Retriever = (question: string, k: number) => Promise<string[]>;

// Lowercase, punctuation -> space, collapse whitespace. Keeps chunker
// artifacts ("e. g.") and line wraps from turning a real hit into a miss.
const normalize = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s]/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();

// 1-indexed rank of the first chunk containing any answer phrase, or null.
function firstRelevantRank(chunks: string[], item: GoldenItem): number | null {
	const phrases = item.mustContain.map(normalize);
	const i = chunks.findIndex((c) =>
		phrases.some((p) => normalize(c).includes(p)),
	);
	return i === -1 ? null : i + 1;
}

function hitRate(ranks: (number | null)[], k: number): number {
	return ranks.filter((r) => r !== null && r <= k).length / ranks.length;
}

function mrr(ranks: (number | null)[]): number {
	return (
		ranks.reduce<number>((sum, r) => sum + (r ? 1 / r : 0), 0) / ranks.length
	);
}

const textOf = (m: { metadata?: Record<string, unknown> }) =>
	String(m.metadata?.text ?? m.metadata?.content ?? '');

const vectorOnly: Retriever = async (question, k) => {
	const matches = await searchDocuments(question, k);
	return matches.map(textOf);
};

const vectorPlusRerank: Retriever = async (question, k) => {
	const matches = await searchDocuments(question, 20); // over-fetch
	const texts = matches.map(textOf).filter(Boolean);
	const reranked = await pineconeClient.inference.rerank(
		'bge-reranker-v2-m3',
		question,
		texts,
	);
	return reranked.data
		.slice(0, k)
		.map((r) => String(r.document?.text ?? ''));
};

async function evaluate(
	name: string,
	retrieve: Retriever,
	golden: GoldenItem[],
	K = 10,
) {
	const ranks: (number | null)[] = [];
	for (const item of golden) {
		const chunks = await retrieve(item.question, K);
		ranks.push(firstRelevantRank(chunks, item));
	}
	console.log(
		`${name.padEnd(18)} hit@1 ${hitRate(ranks, 1).toFixed(2)}   hit@3 ${hitRate(ranks, 3).toFixed(2)}   hit@5 ${hitRate(ranks, 5).toFixed(2)}   MRR ${mrr(ranks).toFixed(2)}`,
	);
	golden.forEach((item, i) => {
		if (ranks[i] === null) console.log(`   miss: ${item.question}`);
	});
	return ranks;
}

async function main() {
	const golden: GoldenItem[] = JSON.parse(
		fs.readFileSync(
			path.join(rootDir, 'app/scripts/data/golden-set.json'),
			'utf-8',
		),
	);
	console.log(`${golden.length} questions\n`);
	await evaluate('vector top-k', vectorOnly, golden);
	await evaluate('vector + rerank', vectorPlusRerank, golden);
}

main();
```

</details>

## Run it

```bash
npx ts-node app/scripts/exercises/retrieval-eval.ts
```

<details>
<summary>Example output (made-up numbers, yours will differ)</summary>

```text
25 questions

vector top-k       hit@1 0.44   hit@3 0.64   hit@5 0.72   MRR 0.56
   miss: why is my app slow after adding context?
   miss: what does ERR_REQUIRE_ESM mean?
   miss: can I use hooks in a class component?
   miss: how do I share state between sibling components?
vector + rerank    hit@1 0.68   hit@3 0.80   hit@5 0.84   MRR 0.75
   miss: why is my app slow after adding context?
   miss: what does ERR_REQUIRE_ESM mean?
   miss: can I use hooks in a class component?
   miss: how do I share state between sibling components?
```

Read this before moving on. Reranking pushed hit@1 from 0.44 to 0.68. On most questions the answer was already being retrieved and was just ranked too low, and the reranker fixed that. But the **same four questions miss in both runs.** The reranker never saw those chunks, so it couldn't fix them. Those four are the next thing to investigate, and reranking won't be the fix.

</details>

## Read the results

The numbers only matter for what they tell you to do next. Look at **which** metric is low and which questions miss:

| What you see | What it means | What to try |
| --- | --- | --- |
| hit@10 high, hit@1 low | The right chunk is retrieved but ranked too low | Reranking |
| hit@10 low | The right chunk never comes back | Look at the chunks for those questions: chunking, missing data, or hybrid search |
| Misses are all exact names, error codes, or IDs | Dense vectors blur exact tokens | Hybrid (sparse + dense) search |
| Misses are all vague questions | The query is the problem, not the index | Query rewriting before search |
| One question misses in every configuration | Check the label before blaming the retriever | Search your source for the answer phrase |

```match
{
  "title": "Match the eval result to the next move",
  "note": "Tap a row, then tap its match.",
  "pairs": [
    { "left": "hit@10 = 0.95, hit@1 = 0.35", "right": "Add a reranker over the top 10" },
    { "left": "Every miss is a question with an error code in it", "right": "Try hybrid search with sparse vectors" },
    { "left": "hit@10 = 0.50 and the missed chunks cut off mid-explanation", "right": "Revisit chunk size and overlap" },
    { "left": "A question misses in all four configurations you tried", "right": "Check the answer phrase exists in the source" }
  ]
}
```

## Experiment: change one thing

Now use it. Pick **one** change, rerun, and put both rows in a table. Changing two things at once means you can't say which one moved the number.

- **Reranking over-fetch.** Rerank the top 10 vs the top 30. Is the extra latency buying you hits?
- **Chunk size.** Re-ingest a sample of your documents at a different chunk size into its own Pinecone **namespace** (`index.namespace('chunks-300')`), and point a third retriever at it. Because the golden set labels answer text, not chunk IDs, it works unchanged. (If your index only has a sample, write the golden set against that sample.)
- **Hybrid search.** If you built the sparse + dense version, add it as a retriever and look at whether it fixes the exact-name misses specifically.

Stop when you have a result you can explain. The table is what you'll show people, not the script.

```scenario
{
  "who": "Your tech lead",
  "setting": "Standup. You've spent two days on retrieval.",
  "ask": "So is the new chunking better or not? I need to know if we ship it this sprint.",
  "note": "More than one answer is defensible. Pick the one you'd actually say.",
  "options": [
    { "text": "On our 30-question eval set, hit@3 went from 0.63 to 0.77 and MRR from 0.52 to 0.66. Four questions still miss in both versions, and they're all error-code lookups, so that's a separate fix. I'd ship the chunking change.", "verdict": "best", "feedback": "Numbers, the size of the test, what's still broken and why, and a recommendation. Your lead can repeat this to their manager word for word. Naming the remaining misses is what makes the good number believable." },
    { "text": "Yeah, it's noticeably better. I ran a bunch of queries and the results are way more relevant.", "verdict": "weak", "feedback": "The next question is 'how much better, and on what?' and you don't have an answer. 'A bunch of queries' you picked yourself is exactly what an eval replaces." },
    { "text": "MRR went up 27%.", "verdict": "ok", "feedback": "True and measured, which is most of it. But a lone percentage with no baseline, no test size, and no mention of what still fails invites three follow-up questions. Give the before and after, and say what's still broken." },
    { "text": "It's hard to say. Retrieval quality is subjective, and it depends on the query.", "verdict": "weak", "feedback": "It depends on the query, which is why you measure it across 30 of them. Calling it subjective tells your lead nobody on the team can answer the question." }
  ],
  "debrief": "An eval turns 'I think it's better' into a number anyone can check. The strongest answers give the before, the after, the size of the test, and what the change didn't fix."
}
```

## Traps

- **A tiny set swings wildly.** With 25 questions, one question flipping moves hit rate by 0.04. Don't celebrate a 0.04 gain. Look for moves that are several questions wide, and look at which questions flipped.
- **Tuning to the test.** Tweak prompts and settings until your 25 questions all pass, and you've memorized the test, not improved retrieval. Every time you add a real user question that failed, the set gets harder to fool.
- **Retrieval scores aren't answer scores.** A perfect hit@3 means the model had the right context. It says nothing about whether the model used it well. That's what the LLM-as-judge tests are for. You want both.

## Show your work

This lab isn't graded. But a before/after table like the one above is one of the most useful things you can put in your capstone README, and one of the best answers to "how do you know your RAG system works?" in an interview. Post yours in Slack with one sentence on what you'd change next.

## Key takeaways

- **Hit rate@k** asks whether the right chunk came back at all. **MRR** asks how high it ranked. Low hit rate is a retrieval problem. Good hit rate with low MRR is a ranking problem.
- Label the **answer text**, not chunk IDs. Chunk IDs change every time you re-chunk, which breaks the comparison you most want to make.
- A reranker can reorder what was retrieved but can't recover what wasn't. When the same questions miss before and after reranking, the fix is upstream.
- Change one thing per run and report before and after numbers with the test size. That's what makes a retrieval claim believable.
- Retrieval evals and answer evals measure different failures. You need both.

## Work with AI

```ai-prompt
title: Pressure-test my golden set
---
I'm building a retrieval eval for my RAG app. My index holds [DESCRIBE YOUR CORPUS: e.g. "scraped React docs, ~400 chunks of ~500 chars"]. Here is my golden set: each entry is a question plus "mustContain" answer phrases that a relevant chunk must include.

[PASTE YOUR golden-set.json]

Act as a staff engineer reviewing it before we trust any number it produces. Check: (1) questions that copy the docs' wording too closely and will flatter vector search, (2) answer phrases that are too generic (will match wrong chunks) or too long (will break across chunk boundaries), (3) missing question types: vague questions, exact names or error codes, multi-part questions, (4) anything answerable from more than one place with only one phrase listed. Go one issue at a time, and suggest a rewritten entry for each problem. Don't rewrite the whole set for me.
```

```ai-prompt
title: Explain my eval results back to me
---
I ran a retrieval eval on my RAG app. Here's the output, including which questions missed in each configuration:

[PASTE THE SCRIPT OUTPUT]

Don't tell me what to do yet. First ask me questions, one at a time, that make me diagnose it myself: is this a retrieval or a ranking problem, what do the repeat misses have in common, is the difference between configurations bigger than one or two questions flipping. After I've answered, tell me what you'd try next and what result would prove it worked.
```
