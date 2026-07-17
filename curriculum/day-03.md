# Day 3 — Implementing Similarity


> **Today:** you set up the project and write the single most important function in RAG — `findTopSimilarDocuments`, which takes a query vector and returns the best-matching documents. Everything we build for the next six weeks sits on top of this.

## Video walkthrough

<iframe src="https://share.descript.com/embed/UAMZxQf6dNc" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## Getting started

### Clone the repository

```bash
git clone https://github.com/projectshft/mini-rag.git
cd mini_rag
git checkout student-todo-exercises
```

### Install dependencies

This project uses Yarn (as shown in the videos), but npm will work too:

```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### Set up environment variables

Before running any exercises, configure your API keys:

```bash
# Copy the example environment file
cp .env.example .env

# Open .env and add your OpenAI API key
# Get one at: https://platform.openai.com/api-keys
```

Your `.env` file should have at minimum:

```bash
OPENAI_API_KEY=sk-your-key-here
```

**Important:** never commit `.env` to git! It's already in `.gitignore` for your protection.

## What you'll build

A `findTopSimilarDocuments` function that:

- Calculates similarity between a query and every document
- Filters by a minimum threshold
- Returns the top K matches sorted by relevance

## The building blocks (already provided)

Before implementing the main function, understand the three helpers you get for free.

### Dot product

Measures how aligned two vectors are:

```typescript
function dotProduct(vectorA: number[], vectorB: number[]): number {
	return vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
}

// Example
dotProduct([1, 2, 3], [4, 5, 6]); // (1×4) + (2×5) + (3×6) = 32
```

**Why it matters:** it's the foundation of similarity measurement — higher value = more aligned — and it's used inside cosine similarity.

### Magnitude

Calculates the "length" of a vector:

```typescript
function magnitude(vector: number[]): number {
	const sumOfSquares = vector.reduce((sum, val) => sum + val * val, 0);
	return Math.sqrt(sumOfSquares);
}

// Example
magnitude([3, 4]); // √(3² + 4²) = √25 = 5
```

**Why it matters:** you need it to normalize the dot product. Think of it as "how far from origin" — Pythagoras in N dimensions.

### Cosine similarity

The actual similarity score (-1 to 1):

```typescript
function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
	const dotProd = dotProduct(vectorA, vectorB);
	const magnitudeA = magnitude(vectorA);
	const magnitudeB = magnitude(vectorB);

	if (magnitudeA === 0 || magnitudeB === 0) return 0;

	return dotProd / (magnitudeA * magnitudeB);
}

// Example
cosineSimilarity([1, 2, 3], [1, 2, 3]); // 1.0 (identical)
cosineSimilarity([1, 0], [0, 1]); // 0.0 (perpendicular)
cosineSimilarity([1, 0], [-1, 0]); // -1.0 (opposite)
```

**Why cosine?**

- **Direction matters, not length**: `[1, 2]` and `[2, 4]` point the same direction -> similarity 1.0
- **Normalized**: always returns -1 to 1
- **Standard in NLP**: used by all major RAG systems

Cosine measures the angle — watch it move as vectors rotate:

```visual
vector-search | Cosine similarity, live
```

## Your challenge: find top similar documents

Located at [`app/scripts/exercises/vector-similarity.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/scripts/exercises/vector-similarity.ts).

### The function signature

```typescript
export function findTopSimilarDocuments(
	queryVector: number[],
	documents: Document[],
	minSimilarity: number = 0.7,
	topK: number = 3,
): Array<{ document: Document; similarity: number }> {
	// TODO: Implement!
}
```

**Parameters:**

- `queryVector`: the user's question as numbers
- `documents`: all available documents with embeddings
- `minSimilarity`: don't return results below this (default 0.7)
- `topK`: maximum number of results (default 3)

**Returns:** array of documents with their similarity scores, sorted highest first.

### Example usage

```typescript
const documents = [
	{
		id: 'doc1',
		title: 'Introduction to Vector Databases',
		embedding: [0.8, 0.2, 0.7, 0.1],
	},
	{
		id: 'doc2',
		title: 'Machine Learning Fundamentals',
		embedding: [0.2, 0.8, 0.1, 0.7],
	},
	{
		id: 'doc3',
		title: 'Natural Language Processing',
		embedding: [0.9, 0.1, 0.6, 0.2],
	},
];

const queryVector = [0.75, 0.25, 0.8, 0.1]; // Similar to doc1 and doc3

const results = findTopSimilarDocuments(queryVector, documents, 0.7, 2);

// Results:
// [
//   { document: doc1, similarity: 0.95 },
//   { document: doc3, similarity: 0.89 }
// ]
```

### The plan (in words, not code)

The implementation is four small steps. Try writing it yourself before opening any hints:

1. **Score** — for each document, compute the cosine similarity between the query vector and the document's embedding, keeping the document and its score together
2. **Filter** — drop anything below `minSimilarity` (low similarity = not relevant; quality over quantity)
3. **Sort** — best matches first, so the LLM gets the most relevant context at the top
4. **Limit** — return at most `topK` results (LLM context windows are finite; 3–5 results is standard for RAG)

**Threshold intuition:**

- `0.9+`: almost identical
- `0.7–0.9`: highly relevant <- good default
- `0.5–0.7`: somewhat relevant
- `< 0.5`: probably noise

<details>
<summary>Hint 1 — which array methods?</summary>

Each step maps to one array method: `map` (score), `filter` (threshold), `sort` (order), `slice` (limit). Chain them in that order — the order matters (see "Common mistakes" below).

</details>

<details>
<summary>Hint 2 — scoring each document</summary>

Build an array of `{ document, similarity }` objects:

```typescript
const results = documents.map((doc) => ({
	document: doc,
	similarity: cosineSimilarity(queryVector, doc.embedding),
}));
```

</details>

<details>
<summary>Hint 3 — sorting in the right direction</summary>

To sort **descending** (highest similarity first), the comparator is `b - a`:

```typescript
filtered.sort((a, b) => b.similarity - a.similarity);
```

If `b > a` the result is positive, so `b` comes first. `a.similarity - b.similarity` would put your *worst* matches first — a classic bug the tests will catch.

</details>

<details>
<summary>Solution — don't open until you've tried</summary>

```typescript
export function findTopSimilarDocuments(
	queryVector: number[],
	documents: Document[],
	minSimilarity: number = 0.7,
	topK: number = 3,
): Array<{ document: Document; similarity: number }> {
	// 1. Calculate similarity for each document
	const results = documents.map((doc) => ({
		document: doc,
		similarity: cosineSimilarity(queryVector, doc.embedding),
	}));

	// 2. Filter by minimum threshold
	const filtered = results.filter(
		(result) => result.similarity >= minSimilarity,
	);

	// 3. Sort by similarity (highest first)
	filtered.sort((a, b) => b.similarity - a.similarity);

	// 4. Return top K
	return filtered.slice(0, topK);
}
```

</details>

## Running the exercise

### 1. Run the tests

```bash
yarn test app/scripts/exercises/vector-similarity.test.ts
```

All tests should pass when implemented correctly.

### 2. Try the example

```bash
yarn exercise:vectors
```

<details>
<summary>Expected output</summary>

The script runs a sample query against a small document set and prints the matches, sorted by score — something like:

```
Query: "..."
1. Introduction to Vector Databases  (similarity: 0.95)
2. Natural Language Processing       (similarity: 0.89)
```

Every result should be at or above the threshold, in descending score order, and never more than `topK` entries. If you see low-score results, backwards ordering, or too many results, revisit steps 2–4.

</details>

## Understanding the tests

The tests verify the three behaviors that matter:

**Threshold filtering:**

```typescript
it('should return documents with similarity above threshold', () => {
	const results = findTopSimilarDocuments(queryVector, documents, 0.7, 5);

	// All results >= 0.7
	results.forEach((result) => {
		expect(result.similarity).toBeGreaterThanOrEqual(0.7);
	});
});
```

**Sorting:**

```typescript
it('should sort results by similarity (highest first)', () => {
	const results = findTopSimilarDocuments(queryVector, documents, 0.5, 5);

	// Each result >= next result
	for (let i = 1; i < results.length; i++) {
		expect(results[i - 1].similarity).toBeGreaterThanOrEqual(
			results[i].similarity,
		);
	}
});
```

**Top K limit:**

```typescript
it('should limit results to topK parameter', () => {
	const results = findTopSimilarDocuments(queryVector, documents, 0.5, 2);
	expect(results.length).toBe(2); // Even if more match
});
```

## Why this function is critical

This is THE core of RAG:

```
User Question
      |
Convert to embedding
      |
findTopSimilarDocuments() <- YOUR FUNCTION!
      |
Get relevant chunks
      |
Feed to LLM as context
      |
LLM generates answer
```

**Without this:** random chunks -> confused LLM -> bad answers.
**With this:** relevant chunks -> focused LLM -> great answers.

```quiz
[
  {
    "q": "In findTopSimilarDocuments, why must you filter by threshold BEFORE slicing to topK?",
    "options": ["It's faster to filter first", "Slicing first could keep low-similarity docs and discard high-similarity ones, then the filter can't fix it", "The tests require that exact order but either works in production"],
    "answer": 1,
    "explain": "If you slice(0, topK) on unfiltered (or unsorted) results, you may lock in irrelevant documents and throw away relevant ones. Score -> filter -> sort -> slice."
  },
  {
    "q": "What does sort((a, b) => a.similarity - b.similarity) do to your results?",
    "options": ["Sorts best matches first", "Sorts WORST matches first — the LLM would get the least relevant context", "Throws a TypeError on ties"],
    "answer": 1,
    "explain": "a - b sorts ascending. For 'best first' you need descending: (a, b) => b.similarity - a.similarity."
  },
  {
    "q": "Why cap results at topK instead of returning every document above the threshold?",
    "options": ["Pinecone charges per returned document", "LLM context windows are limited, and more context isn't better — 3-5 focused chunks beat 20 loosely relevant ones", "JavaScript arrays have a maximum length"],
    "answer": 1,
    "explain": "Retrieval quality is about focus. The LLM answers best from a small set of highly relevant chunks, and responses come back faster too."
  },
  {
    "q": "A document scores 0.55 against the query with the default minSimilarity of 0.7. What happens?",
    "options": ["It's returned last in the results", "It's excluded — 0.5-0.7 is only 'somewhat relevant' and below our bar", "It's returned only if fewer than topK documents matched"],
    "answer": 1,
    "explain": "The threshold is a hard floor: anything below it is dropped, even if that means returning fewer than topK results. Better to return less than to return noise."
  }
]
```

## Real-world RAG flow

Here's how your function will be used:

```typescript
// 1. User asks
const userQuestion = 'How do I use React hooks?';

// 2. Convert to embedding
const queryEmbedding = await openai.embeddings.create({
	model: 'text-embedding-3-small',
	input: userQuestion,
});

// 3. YOUR FUNCTION finds relevant docs
const relevantDocs = findTopSimilarDocuments(
	queryEmbedding.data[0].embedding,
	allDocuments,
	0.7, // Only good matches
	5, // Top 5 results
);

// 4. Build context
const context = relevantDocs.map((r) => r.document.title).join('\n\n');

// 5. Generate answer
const answer = await llm.chat({
	messages: [
		{ role: 'system', content: `Use this context:\n${context}` },
		{ role: 'user', content: userQuestion },
	],
});
```

## Common mistakes

### Not filtering

```typescript
// Returns ALL documents, even 0.1 similarity
return documents.map(...).sort(...).slice(0, topK);
```

### Wrong sort direction

```typescript
// Lowest similarity first (backwards!)
filtered.sort((a, b) => a.similarity - b.similarity);
```

### Filtering after slicing

```typescript
// Filters AFTER taking top K (wrong order!)
const topK = results.slice(0, k);
return topK.filter((r) => r.similarity >= threshold);
```

## Video solution walkthrough

Once you've got the tests passing (or you're truly stuck), watch the solution explanation:

<iframe src="https://share.descript.com/embed/5ze8rVvlJGu" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## Key takeaways

- The dot product measures alignment; magnitude normalizes it; cosine similarity = angle-based score from -1 to 1
- Retrieval is four steps: **score -> filter -> sort -> slice** — and the order matters
- The similarity threshold is a quality floor (~0.7 is a good default); topK is a focus cap (3–5 for RAG)
- `findTopSimilarDocuments` IS the "R" in RAG — every answer the system gives flows through this function
- Returning fewer, better results beats returning more, noisier ones

## Work with AI

```ai-prompt
title: Generate harder test cases for my implementation
---
I just implemented findTopSimilarDocuments(queryVector, documents, minSimilarity = 0.7, topK = 3) in app/scripts/exercises/vector-similarity.ts. It scores each document with cosine similarity, filters below minSimilarity, sorts descending, and slices to topK.

Generate 5 tricky test cases as small vector fixtures (4 dimensions max, so I can verify by hand): (1) all documents below threshold, (2) exact ties in similarity, (3) topK larger than the number of matches, (4) a zero vector as a document embedding, (5) one adversarial case of your choosing. For each: give the inputs, ask me to PREDICT the output first, then show the expected output and explain any edge-case behavior my implementation might get wrong.
```

```ai-prompt
title: Explain my solution back and poke holes
---
Here is my implementation of findTopSimilarDocuments from app/scripts/exercises/vector-similarity.ts (I'll paste it below). I'm going to explain, line by line, WHY each step exists — the scoring map, the threshold filter, the descending sort, and the topK slice — as if teaching a junior dev.

Your job: poke holes. Ask me why filter must come before slice, what happens with sort((a, b) => a.similarity - b.similarity), why cosine similarity beats raw dot product here, and what my function does when documents have different embedding lengths than the query. Rate my understanding 1-10 and tell me what to review before Day 4.

[paste your implementation here]
```
