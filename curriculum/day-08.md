# Day 8 — Understanding Chunking

**Time:** ~60 min · Hands-on

> **Today:** before you can vectorize documents, you have to break them into pieces. How you break them — chunking — quietly decides how good your entire RAG system will be. You'll learn the strategies, then implement the one function that makes overlap work.

## Video walkthrough

<iframe src="https://share.descript.com/embed/5rgvAlDwp7V" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## Why chunking matters

### The problem

Documents are too long:

- Embedding models have token limits (8,191 tokens for `text-embedding-3-small`)
- Embedding an entire document dilutes meaning — you get the "average" of everything in it
- A user asks about hooks → retrieval hands back an entire 50,000-word doc
- Huge docs don't fit in the LLM's context window anyway

### The solution

```
50,000-word Document
        ↓
Break into 100 chunks of ~500 chars each
        ↓
Each chunk = focused topic
        ↓
Retrieve only the relevant chunks
```

**Benefits:**

- Focused, specific meaning per chunk
- Better embeddings (each vector captures one concept, not fifty)
- Precise retrieval — you get exactly what you need
- Results fit comfortably in context windows

```visual
chunking | Fixed-size vs structure-aware chunking
```

## Bad chunking examples

### ❌ Character splitting

```typescript
function badCharacterChunking(text: string): string[] {
	return text.match(/.{1,500}/g) || [];
}

// Results in:
// "The company announced new feat"
// "ures including advanced AI c"
```

**Problem:** breaks words mid-character!

### ❌ Word splitting

```typescript
function badWordChunking(text: string): string[] {
	const words = text.split(' ');
	const chunks = [];
	for (let i = 0; i < words.length; i += 100) {
		chunks.push(words.slice(i, i + 100).join(' '));
	}
	return chunks;
}
```

**Problem:** ignores sentence boundaries!

### Real example

```typescript
// Original: "React Hooks were introduced in React 16.8. They allow you to use state..."

// ❌ Bad chunking produces:
[
	'React Hooks were introduced in React 16.8. They allow you to use state without wri',
	'ting a class component...',
];

// "wri" and "ting" are split — meaningless!
```

## Good chunking: sentence-aware + overlap

Every chunk in our system carries its content plus metadata about where it came from:

```typescript
export type Chunk = {
	id: string;
	content: string;
	metadata: {
		source: string;
		chunkIndex: number;
		totalChunks: number;
		startChar: number;
		endChar: number;
		[key: string]: string | number | boolean | string[];
	};
};
```

**Key principles:**

1. Split by sentences (`.`, `!`, `?`)
2. Combine sentences until the size limit
3. Add overlap between chunks
4. Track metadata

## Why overlap matters

**Without overlap:**

```
Chunk 1: "...useState is a hook."
Chunk 2: "It returns a pair of values..."
```

User asks: "what does useState return?"

- Chunk 1 has "useState" but not "return" ❌
- Chunk 2 has "return" but not "useState" ❌

**With overlap (50 chars):**

```
Chunk 1: "...useState is a hook."
Chunk 2: "useState is a hook. It returns a pair of values..."
```

Now chunk 2 has BOTH "useState" AND "return" ✅

### How much overlap?

- **Too little** (10 chars): not enough context carried across the boundary
- **Too much** (90%): wasteful — you're embedding the same text repeatedly
- **Just right** (10–20% of chunk size): for 500-char chunks, that's 50–100 chars of overlap

```quiz
[
  {
    "q": "Why does embedding a whole 50,000-word document produce worse retrieval than embedding chunks?",
    "options": ["The single vector becomes an 'average' of every topic in the doc, so no specific query matches it well", "Pinecone rejects vectors from long documents", "Long documents always exceed the LLM's output limit"],
    "answer": 0,
    "explain": "One vector per document dilutes meaning. Chunk-level vectors each capture one focused concept, so a specific query lands on the specific chunk that answers it."
  },
  {
    "q": "A user asks 'what does useState return?' but the sentence answering it is split across two chunks with no overlap. What happens?",
    "options": ["Pinecone merges the chunks automatically", "Neither chunk scores well — one has 'useState', the other has 'return', neither has both", "The query fails with an error"],
    "answer": 1,
    "explain": "Overlap exists exactly for this: repeating the tail of one chunk at the head of the next keeps boundary-straddling facts intact in at least one chunk."
  },
  {
    "q": "For 500-character chunks, a sensible overlap is:",
    "options": ["5 characters", "50–100 characters (10–20%)", "450 characters (90%)"],
    "answer": 1,
    "explain": "10–20% preserves boundary context without embedding the same text over and over. 90% overlap means paying to embed nearly everything twice."
  }
]
```

## Your challenge: implement `getLastWords`

The chunking logic in [`app/libs/chunking.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/chunking.ts) is provided — **but you need to implement the critical `getLastWords()` helper**. It's the function that creates the overlap between chunks.

### Why this function matters

```typescript
// Without getLastWords (no overlap):
Chunk 1: "React Hooks allow you to use state."
Chunk 2: "The most common hooks are useState."
// Query: "What do React Hooks do?" → Might miss Chunk 2!

// With getLastWords (proper overlap):
Chunk 1: "React Hooks allow you to use state."
Chunk 2: "allow you to use state. The most common hooks are useState."
// Query: "What do React Hooks do?" → Finds both chunks! ✅
```

### Test-driven development

**Step 1 — run the tests and watch them fail:**

```bash
yarn test:chunking
```

Some tests fail because `getLastWords()` isn't implemented yet. That's your spec.

**Step 2 — understand the contract:**

```typescript
getLastWords('React Hooks are awesome', 10);
// Should return: "are awesome" (fits in 10 chars, complete words)
// NOT: "re awesome" (broken word!)

getLastWords('Short', 100);
// Should return: "Short" (entire text if shorter than max)
```

**Step 3 — find the function.** Open [`app/libs/chunking.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/chunking.ts) and scroll to the bottom:

```typescript
function getLastWords(text: string, maxLength: number): string {
	// YOUR IMPLEMENTATION HERE
}
```

**Step 4 — implement it yourself before opening any hints.** Then re-run `yarn test:chunking` until all 18 tests pass.

<details>
<summary>💡 Hint 1 — the shape of the algorithm</summary>

Handle the easy case first: if the whole text already fits in `maxLength`, return it as-is. Otherwise split into words and build a result string by walking **backwards** from the last word, stopping before you'd exceed `maxLength`.

</details>

<details>
<summary>💡 Hint 2 — the two classic off-by-one traps</summary>

1. When you prepend a word onto a non-empty result, the joining **space counts** toward the length (`word.length + 1`).
2. You're building the string back-to-front, so each accepted word goes on the **front** of the result — `word + ' ' + result`, not `result + ' ' + word`.

</details>

<details>
<summary>✅ Solution — don't open until yarn test:chunking is green (or you're truly stuck)</summary>

```typescript
function getLastWords(text: string, maxLength: number): string {
	// Step 1: if the text is short enough, return it all
	if (text.length <= maxLength) {
		return text;
	}

	// Step 2: split into words
	const words = text.split(' ');

	// Step 3: build the result, walking backwards from the last word
	let result = '';

	for (let i = words.length - 1; i >= 0; i--) {
		const word = words[i];
		// account for the space we'd add between words
		const candidateLength =
			result.length === 0 ? word.length : word.length + 1 + result.length;

		if (candidateLength > maxLength) {
			break; // adding this word would exceed maxLength
		}

		// prepend the word (we're building backwards)
		result = result.length === 0 ? word : `${word} ${result}`;
	}

	return result;
}
```

Common mistakes this avoids:

- Forgetting the short-text early return
- Looping forwards instead of backwards
- Not counting the space between words (`+ 1`)
- Appending instead of prepending

</details>

## How the rest of `chunkText` works

While your tests run, read the rest of the implementation in [`app/libs/chunking.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/chunking.ts):

**1. Split into sentences**

```typescript
const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
```

**2. Build chunks with overlap** — accumulate sentences until the chunk size is reached; when the limit hits, save the current chunk and start the next one with overlap from the previous chunk (that's your `getLastWords()` at work), tracking indices and positions along the way.

**3. Update total chunks count** — after all chunks are created, each chunk's `totalChunks` metadata is filled in.

### Study these key tests

- `should not break words mid-character` — how sentence-aware splitting prevents broken words
- `should create overlap between chunks` — how overlap preserves context
- `should include correct metadata` — what we track and why it matters
- `should chunk React documentation example` — real documentation text, end to end

## Video solution walkthrough

Watch the solution walkthrough once you've made your own attempt:

<iframe src="https://share.descript.com/embed/WskC20VXMBd" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## Experiment: try different parameters

```typescript
// In a test file or Node REPL
import { chunkText } from './app/libs/chunking';

const text = 'Your long document here...';

// Try different chunk sizes
const smallChunks = chunkText(text, 200, 40, 'test');
const largeChunks = chunkText(text, 1000, 100, 'test');

console.log(`Small chunks: ${smallChunks.length}`);
console.log(`Large chunks: ${largeChunks.length}`);

// Try different overlap amounts
const noOverlap = chunkText(text, 500, 0, 'test');
const highOverlap = chunkText(text, 500, 150, 'test');
```

**Questions to explore:**

- What chunk size works best for your content?
- How much overlap do you actually need?
- What happens with very short documents? Very long ones?

## Beyond plain text: PDFs and other modalities

Let's be upfront about something: this course chunks and embeds **plain text**, because text is how the overwhelming majority of production RAG systems work — and every skill you're building transfers directly. But the data you'll meet at work isn't always a clean string. It's PDFs with tables and figures. Screenshots. Diagrams. Recorded meetings. You don't need to master those today — you need to know they exist and **what to reach for** when one lands on your desk.

The good news: the pipeline never changes. It's always **extract → represent → embed → upsert**. What changes is how each kind of content becomes a vector.

### PDFs: extraction is the whole game

A PDF is a *layout*, not a string. Text, tables, figures, and scanned pages all need different treatment, and ingestion quality is decided at extraction time — before any chunking or embedding happens:

- **Paragraphs** — digital PDFs carry a text layer; pull the string out and everything from today applies unchanged.
- **Tables** — the danger zone. Naive extraction reads cells in visual order and produces word soup. Serialize rows with their headers intact (markdown, or `Region: us-east | Spend: $41k` per row) so each chunk still means something.
- **Figures and charts** — grab the caption (cheap), have a vision LLM describe the image and embed the description (better), or embed the image itself with a multimodal model (below).
- **Scans** — there is *no text layer*, just pixels. Without OCR (Tesseract, AWS Textract), extraction silently returns nothing and your "successfully ingested" PDF contributes zero vectors. Count chunks per page.

Layout-aware parsers like Unstructured or Docling emit *typed elements* (Title, NarrativeText, Table, Image) instead of one flat string — which is exactly what lets you give each element the treatment it needs.

### Multimodal embeddings: one space, many modalities

Remember word math — "same direction = same meaning"? Multimodal models like CLIP (and newer ones like voyage-multimodal-3 and Cohere Embed v3) extend that property across modalities: they embed text **and** images into the *same* vector space, trained so an image and the text describing it land near each other. That means a text query can retrieve a screenshot, a chart, or a diagram — no caption matching involved.

And here's the part that should feel familiar: **Pinecone doesn't care what a vector came from.** An index stores vectors of one fixed dimension — text, image, audio, it's all the same to the index. Multimodal RAG in Pinecone is just: pick a multimodal embedding model, tag `metadata.modality` on every record, and embed queries with the same model. Some vector databases (like Weaviate) bundle the multimodal model into the database itself; with Pinecone you bring your own — which is exactly what you're already doing with text.

Play with both ideas here:

```visual
multimodal-rag | Click the PDF elements, then switch to the shared meaning-space
```

```quiz
[
  {
    "q": "Your pipeline reports a 60-page PDF as 'successfully ingested', but questions about pages 30–45 return nothing. Most likely cause?",
    "options": ["Those pages are scans with no text layer, so extraction silently produced zero chunks", "The embedding model rejected those pages", "Pinecone indexes have a 30-page limit"],
    "answer": 0,
    "explain": "Scanned pages are pixels, not text. Without OCR they extract as empty strings — the silent failure mode of PDF ingestion. Counting chunks per page catches it."
  },
  {
    "q": "How does a text query retrieve an image in a multimodal RAG system?",
    "options": ["The system matches the query against image filenames and captions", "A multimodal model embeds text and images into one shared space, so the query vector lands near relevant image vectors", "Pinecone runs OCR on stored images at query time"],
    "answer": 1,
    "explain": "CLIP-style models are trained so an image and text describing it land near each other — same geometry you saw with word math, extended across modalities. The index just compares vectors."
  }
]
```

### Go deeper (external)

**PDFs & chunking:**

- [Chunking Strategies for LLM Applications](https://www.pinecone.io/learn/chunking-strategies/) — Pinecone's guide; goes beyond today's sentence-aware approach into semantic and content-aware chunking
- [Best PDF Parsers for AI and RAG Workflows](https://www.firecrawl.dev/blog/best-pdf-parsers) — practical comparison of Unstructured, Docling, Marker, and friends
- [Unstructured docs](https://docs.unstructured.io/) — the typed-elements parser most RAG pipelines reach for first

**Multimodal:**

- [Embedding Methods for Image Search](https://www.pinecone.io/learn/series/image-search/) — Pinecone's series, including [Multi-modal ML with OpenAI's CLIP](https://www.pinecone.io/learn/series/image-search/clip/)
- [CLIP text↔image search notebook](https://github.com/pinecone-io/examples/blob/master/learn/search/multi-modal/clip-search/clip-text-image-search.ipynb) — runnable end-to-end example against a Pinecone index
- [Voyage multimodal embeddings](https://docs.voyageai.com/docs/multimodal-embeddings) — embeds interleaved text + images (great for document screenshots); see also [voyage-multimodal-3](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/)
- [Cohere: multimodal Embed 3](https://cohere.com/blog/multimodal-embed-3) — another production multimodal model
- [Weaviate multi2vec-clip](https://weaviate.io/developers/weaviate/modules/retriever-vectorizer-modules/multi2vec-clip) — the "model bundled into the database" alternative, for contrast with Pinecone's bring-your-own-vectors approach

## ✅ Key takeaways

- Chunking is critical to RAG quality: retrieval returns chunks, so chunk boundaries decide what the LLM ever sees
- Naive strategies (fixed character or word counts) break words and sentences — meaning dies at the boundary
- Sentence-aware splitting + overlap is the workhorse strategy: split on `.!?`, accumulate to a size limit, carry the tail forward
- 10–20% overlap (50–100 chars for 500-char chunks) preserves boundary context without wasteful duplication
- Chunk metadata (`source`, `chunkIndex`, `totalChunks`) is what makes retrieval results traceable and reconstructable
- The pipeline (extract → represent → embed → upsert) never changes across modalities — PDFs need layout-aware extraction (+ OCR for scans), and multimodal models put text and images in one shared space; Pinecone just stores the vectors either way

## 🤖 Work with AI

```ai-prompt
title: Quiz me on chunking strategy
---
You are my strict-but-friendly tutor. I just implemented sentence-aware chunking with overlap in app/libs/chunking.ts, including the getLastWords(text, maxLength) helper that builds overlap from the last complete words of the previous chunk.

Quiz me with 5 questions, ONE AT A TIME, waiting for my answer. Start easy ("why not just split every 500 characters?") and get harder ("a fact is stated once, exactly at a chunk boundary, and overlap is 0 — walk me through why retrieval fails"). Include one question about the space-counting off-by-one bug in getLastWords. If I'm wrong, give a hint and let me retry once. At the end, list my weak spots with a two-sentence explanation each.
```

```ai-prompt
title: Generate edge-case tests for getLastWords
---
I implemented getLastWords(text: string, maxLength: number) in app/libs/chunking.ts for a RAG chunking library. It returns the last complete words of text that fit within maxLength characters (spaces count), or the whole text if it's already short enough.

Generate 8 edge-case test inputs I should check — think: a single word longer than maxLength, maxLength of 0, text with double spaces, text ending in punctuation, exact-boundary lengths where the space pushes it over. For each, tell me the expected output and WHY, then ask me to predict what my implementation returns before you reveal anything.
```

```ai-prompt
title: Plan the ingestion for a messy real-world PDF
---
I'm learning RAG ingestion. I know sentence-aware text chunking with overlap, and I've just been introduced to (but haven't implemented) PDF extraction and multimodal embeddings.

Describe a realistic messy PDF for me (pick one: an annual report with financial tables and charts, a scanned vendor contract, or a product spec with architecture diagrams). Then interview me, ONE QUESTION AT A TIME, as I design its ingestion pipeline for a Pinecone index: what I'd extract with, how I'd handle each element type (paragraphs, tables, figures, scans), what metadata I'd attach, and how I'd verify nothing was silently dropped. Push back on hand-waving ("HOW exactly does that table become a chunk?"). At the end, summarize my pipeline and flag the two riskiest points in it.
```
