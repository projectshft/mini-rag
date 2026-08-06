# Optional Lab: Chunk the Bible and Store It in Pinecone

> **This lab:** download one enormous, beautifully structured document — the King James Bible — design your own chunking strategy for it, and store the result in your own Pinecone index with metadata worth citing. Nothing religious about the exercise: the KJV is just a big, public-domain, heavily-quoted text with explicit structure (books -> chapters -> verses), which makes it a perfect chunking corpus.

## Why this corpus

On [Day 8](/learn/day-08) you chunked scraped pages with `chunkText` — sentence-aware splitting with overlap, and it works. But the pages you've been chunking are _unstructured_ blobs, so a generic strategy is the right call.

The Bible is the opposite shape: **4+ MB of text with real joints** — 66 books, ~1,189 chapters, ~31,000 verses. Run a generic chunker over it and you get retrieval-sized pieces that have thrown away the thing that makes this corpus valuable: **the citation**. A chunk that can't say "Genesis 1:1–5" can match a query, but it can't be cited, filtered, or traced.

The transferable lesson — the whole reason this lab exists: **decide your chunking from the corpus in front of you, not from habit.** This is exactly the "Confluence pages vs. scanned PDFs" decision from Day 8, practiced on a corpus that punishes laziness.

## Get the text

```bash
mkdir -p data/bible
curl -o data/bible/kjv.txt https://www.gutenberg.org/cache/epub/10/pg10.txt
echo "data/bible/" >> .gitignore   # downloaded, not committed
```

~4.4 MB of plain text. Open it — you'll see book titles as headings and verses marked like `1:1 In the beginning…`.

## The assignment

Write **one script** (e.g. `app/scripts/exercises/chunk-bible.ts`) that **chunks the text and stores it in your own Pinecone index — with metadata**.

- **Chunking strategy is your call**: by verse, by chapter, packed passages, with or without overlap. Have a reason.
- **Every chunk carries metadata** — at minimum a human-readable reference like `"Genesis 1:1-5"`.
- **Store it in a separate index** so you don't write into your course index: create a `bible-kjv` index in the Pinecone console (**1536 dimensions, cosine**), and run your script with `PINECONE_INDEX=bible-kjv`. That's 1536, **not** the course's 512 — a deliberate choice, explained in "Why 1536 here" below.
- **Verify** in the Pinecone console: the vector count and your metadata look right.
- Cost check: the whole book is ~1M embedding tokens ≈ **$0.02** on `text-embedding-3-small` — embedding price is per _token_, so 1536 dims costs the same as 512. The 31k vectors fit the Pinecone free tier either way (1536 just uses ~3x the storage per vector).

So nobody is grading your regex — here's a parser for the Gutenberg file. Paste it into your script and spend your effort on the strategy instead:

<details>
<summary>Provided: <code>loadVerses()</code> — every verse as <code>{ book, chapter, verse, text }</code></summary>

```typescript
import fs from 'fs';

export type Verse = {
	book: string;
	chapter: number;
	verse: number;
	text: string;
};

export function loadVerses(path = 'data/bible/kjv.txt'): Verse[] {
	const raw = fs.readFileSync(path, 'utf-8');
	// Trim Project Gutenberg's header/footer
	const start = raw.indexOf('The First Book of Moses');
	const end = raw.indexOf('*** END OF THE PROJECT GUTENBERG EBOOK');
	const body = raw.slice(start, end === -1 ? undefined : end);

	const verses: Verse[] = [];
	let book = '';
	// Verses look like "1:1 In the beginning..." and wrap across lines;
	// anything that isn't a verse line and isn't blank is a book title.
	const lines = body.split('\n');
	let current: Verse | null = null;

	for (const line of lines) {
		const m = /^(\d+):(\d+)\s+(.*)$/.exec(line.trim());
		if (m) {
			if (current) verses.push(current);
			current = {
				book,
				chapter: parseInt(m[1], 10),
				verse: parseInt(m[2], 10),
				text: m[3].trim(),
			};
		} else if (line.trim() === '') {
			if (current) {
				verses.push(current);
				current = null;
			}
		} else if (!current) {
			book = line.trim(); // a book title line
		} else {
			current.text += ' ' + line.trim(); // continuation of a wrapped verse
		}
	}
	if (current) verses.push(current);
	return verses;
}
```

Sanity-check it: `loadVerses().length` should be ~31,000, and the first verse should be Genesis 1:1.

</details>

## First, watch the lazy way fail

Before designing anything, feel the failure. Slice the raw text at fixed positions and read what comes out:

```typescript
const raw = fs.readFileSync('data/bible/kjv.txt', 'utf-8');
for (let i = 200_000; i < 202_000; i += 500) {
	console.log('---\n' + raw.slice(i, i + 500));
}
```

Odds are every chunk starts mid-word, ends mid-sentence, and — worse — carries no idea which book or chapter it came from. Even running our sentence-aware `chunkText` over the whole file has the same _fatal_ flaw: the sentences are clean, but `metadata.source` just says `"kjv"` — no book, no chapter, no verse. **The failure isn't ugly boundaries; it's chunks that can't tell you where they came from.** The corpus hands you real joints; a strategy that ignores them is throwing away free metadata.

```visual
chunking | Play with chunk size and overlap — watch precision trade against context before you pick a strategy
```

## Picking a strategy: who queries this index?

Every option below is **structure-aware** — it cuts on the text's real joints (verses, chapters, books) instead of blind character offsets. That's the whole game: the fixed-size slice you just watched fail is the only _structure-blind_ option, and it's off the table. What's left is choosing _which_ structure to chunk on — verse, chapter, or packed passages — and there's no "correct" answer. Every option trades something:

| Strategy                                      | What it buys                                                       | What it costs                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| One chunk per verse                           | Precise matches, perfectly citable                                 | Tiny fragments — `"And he said unto them"` matches confidently and tells you nothing |
| One chunk per chapter                         | Full narrative context                                             | Matches everything a little and nothing well; way past retrieval size                |
| Packed passages (whole verses up to ~N chars) | Retrieval-sized pieces with clean boundaries                       | Size variance — the longest verse is ~500+ chars by itself                           |
| ± Overlap (carry a verse across seams)        | A thought that straddles a boundary survives in at least one chunk | More vectors, more cost, near-duplicate results                                      |

The tiebreaker is a question most tutorials skip: **who queries this index, and what do they ask?** A quote-hunter ("where does it say _love thy neighbour_?") is served by verse-sized precision. Someone asking "what happens in the flood story?" needs passage-sized context. Your chunk size is a bet on the questions — make the bet, and be able to say why. You don't have to be right; you have to decide _with a reason_.

## Why 1536 here (the course used 512)

Everywhere else in this course you embed at **512 dimensions**. `text-embedding-3-small` can output up to **1536** — we've been asking it to _truncate_ to 512 with the `dimensions` param. That's cheaper to store, faster to search, and plenty for scraped docs. So why spend the full 1536 on the Bible?

More dimensions = more room to encode nuance. On a big, dense, endlessly-quoted literary corpus, the extra fidelity earns its keep: near-synonyms and subtly different passages that blur together at 512 stay separable at 1536. The costs are real but small here — ~3x the vector storage and slightly slower queries — and 31k vectors fit the free tier either way.

The transferable point: **dimension count is a knob, not a constant.** 512 for cheap-and-good-enough, 1536 when fidelity pays, a large model's 3072 when it really matters. One hard rule, though: your **index and your query must use the same number**. Mismatch them and retrieval doesn't degrade — it _throws_. You'll hit exactly that in the retrieval step, on purpose.

## Storing it: the practical bits

Follow the exact pattern you already know from the upload route — embed in batches, upsert with metadata:

<details>
<summary>The embed + upsert skeleton (adapted from <code>app/api/upload-text/route.ts</code>)</summary>

```typescript
import { openaiClient } from '../libs/openai/openai';
import { pineconeClient } from '../libs/pinecone';

// yourChunks: { id: string; content: string; reference: string }[]
const index = pineconeClient.Index(process.env.PINECONE_INDEX!); // bible-kjv

const BATCH = 100;
for (let i = 0; i < yourChunks.length; i += BATCH) {
	const batch = yourChunks.slice(i, i + BATCH);
	const embeddings = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 1536, // full fidelity — must match your 1536 index
		input: batch.map((c) => c.content),
	});
	await index.upsert(
		batch.map((c, j) => ({
			id: c.id,
			values: embeddings.data[j].embedding,
			metadata: {
				text: c.content,
				source: 'kjv',
				reference: c.reference, // "Genesis 1:1-5" — the whole point
			},
		})),
	);
	console.log(
		`upserted ${Math.min(i + BATCH, yourChunks.length)}/${yourChunks.length}`,
	);
}
```

Run it as: `PINECONE_INDEX=bible-kjv npx ts-node app/scripts/exercises/chunk-bible.ts`

</details>

Optional but smart: write your chunks to a `.jsonl` file first and skim a few dozen — _then_ spend the two cents on embeddings.

## Verify

Open the Pinecone console: your `bible-kjv` index exists, the record count matches what your script reported, and a spot-checked record has content plus a `reference` that reads like a citation. If a chunk can't tell you where it came from, it isn't done.

## Retrieve from your index

Storing vectors you can't query is a museum. Now search it — and here's the catch that trips people up: **you can't reuse the course's `searchDocuments`.** It embeds queries at 512 dimensions (`app/libs/pinecone.ts`), but your Bible index is 1536. A 512-dim query against a 1536-dim index doesn't return _bad_ results — it **throws**. Query dims must equal index dims, every time.

So write a tiny retrieval function that embeds the query at 1536:

<details>
<summary>Retrieve: embed at 1536 -> query -> print citations</summary>

```typescript
import { openaiClient } from '../libs/openai/openai';
import { pineconeClient } from '../libs/pinecone';

export async function search(query: string, topK = 5) {
	const embed = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 1536, // MUST match the index
		input: query,
	});
	const index = pineconeClient.Index(process.env.PINECONE_INDEX!); // bible-kjv
	const { matches } = await index.query({
		vector: embed.data[0].embedding,
		topK,
		includeMetadata: true,
	});
	for (const m of matches) {
		console.log(`[${m.score?.toFixed(3)}] ${m.metadata?.reference}`);
		console.log(`  ${String(m.metadata?.text).slice(0, 120)}…\n`);
	}
	return matches;
}

search('how should I treat my neighbor?');
```

</details>

Run it with `PINECONE_INDEX=bible-kjv`. If Psalm 23 comes back **with its reference**, your chunking and metadata are doing their job. Now try a few and watch your strategy show its hand: a quote-hunt (`"love thy neighbour"`), a theme (`"the flood"`), a vague one (`"what happens after we die"`). The precise-vs-context bet you made when you picked a chunk size is now visible in what comes back.

### Optional: turn retrieval into an answer

Retrieval hands back verses; a RAG _answer_ composes them. If you want the full loop, feed your top matches to a model and force it to cite:

<details>
<summary>Optional: retrieved verses -> a cited answer</summary>

```typescript
// using `matches` returned by search() above:
const context = matches
	.map((m) => `${m.metadata?.reference}: ${m.metadata?.text}`)
	.join('\n');

const res = await openaiClient.chat.completions.create({
	model: 'gpt-4o-mini',
	messages: [
		{
			role: 'system',
			content:
				'Answer ONLY from the provided verses. Cite every claim with its reference (e.g. "Psalm 23:1"). If the verses don’t answer the question, say so.',
		},
		{
			role: 'user',
			content: `Verses:\n${context}\n\nQuestion: how should I treat my neighbor?`,
		},
	],
});
console.log(res.choices[0].message.content);
```

</details>

That's the whole RAG pattern — retrieve, then ground the model in what you retrieved — on a corpus you chunked yourself. And notice: the answer is only ever as good as your chunks. If your references are wrong or your passages lost their context, the citations fall apart. The chunking decision you made pages ago shows up right here, in the answer.

```quiz
[
  {
    "q": "Fixed-size slicing at 500 chars fails the citability test, and bumping it to 800 barely helps. Why?",
    "options": [
      "800 is still too small — chapter-sized chunks would fix it",
      "The flaw isn't the size — character positions don't align with meaning, so any byte-offset cut starts mid-thought and carries no idea where it came from",
      "Fixed-size chunking is fine here; the problem is the embedding model"
    ],
    "answer": 1,
    "explain": "No size fixes cutting at positions instead of joints. The text hands you real boundaries — verses, chapters, books — and cutting along them gives you the citation metadata for free."
  },
  {
    "q": "Per-verse chunks are perfectly citable and precisely matched. What do they cost you?",
    "options": [
      "Verses are too long for the embedding model's input window",
      "Tiny fragments — 'And he said unto them' matches a query confidently and tells you nothing",
      "Per-verse chunks can't carry a reference in their metadata"
    ],
    "answer": 1,
    "explain": "Small chunks buy precision and pay in context: a fragment can score high on similarity while being useless to the reader. Every strategy in the menu is negotiating this same trade from one side or the other."
  },
  {
    "q": "Verse, chapter, packed passages, overlap — what's the tiebreaker for choosing between them?",
    "options": [
      "Whichever produces the fewest vectors, since embedding cost dominates",
      "Who queries this index and what they ask — your chunk size is a bet on the questions",
      "Always the smallest unit the text offers; precision beats context in retrieval"
    ],
    "answer": 1,
    "explain": "A quote-hunter is served by verse-sized precision; 'what happens in the flood story?' needs passage-sized context. You make the bet on the expected questions, with a reason you can defend. The reasoning is the assignment."
  }
]
```

## The video (2–3 min, phone is fine)

The code is the easy half — **the reasoning is the assignment.** Record yourself covering:

1. **What chunking is**, in your own words
2. **How you approached it here** — your strategy and why
3. **What overlap is and when you'd use it**
4. **What retrieval showed** — did your chunk-size bet hold up when you queried it?

Post the video (and your repo) in Slack for feedback.

## Further reading (optional)

**Chunking:**

- [Pinecone — Chunking Strategies for LLM Applications](https://www.pinecone.io/learn/chunking-strategies/)
- [Cohere — Effective Chunking Strategies](https://docs.cohere.com/page/chunking-strategies)
- [LangChain — Text splitters](https://python.langchain.com/docs/concepts/text_splitters/)
- [Greg Kamradt — 5 Levels of Text Splitting](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb)
- [LlamaIndex — Evaluating the Ideal Chunk Size](https://www.llamaindex.ai/blog/evaluating-the-ideal-chunk-size-for-a-rag-system-using-llamaindex-6207e5d3fec5)

**Embeddings & dimensions:**

- [OpenAI — Embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- [Simon Willison — Embeddings: what they are and why they matter](https://simonwillison.net/2023/Oct/23/embeddings/)
- [Jay Alammar — The Illustrated Word2vec](https://jalammar.github.io/illustrated-word2vec/)

## Work with AI

```ai-prompt
title: Defend my chunking strategy
---
I just chunked the King James Bible (66 books / ~31k verses, from Project Gutenberg) for semantic search in Pinecone. My strategy was: [DESCRIBE: e.g. "packed passages — whole verses accumulated up to ~800 chars, no overlap, metadata reference like 'Genesis 1:1-5'"].

Play a staff engineer reviewing my design. Attack it from three angles, one at a time, waiting for my defense after each: (1) a query type my chunk size serves badly, (2) a boundary case that breaks my packing rule (long verses, chapter seams, book seams), (3) what my metadata can't answer that someone will eventually ask for. If a defense is weak, say so and make me improve it. End with a verdict: ship it, or change one specific thing first.
```
