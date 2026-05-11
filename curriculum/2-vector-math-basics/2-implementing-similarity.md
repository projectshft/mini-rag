# Implementing Document Similarity

Time to build the core of RAG! Let's implement a function that finds similar documents.

---

## Video Walkthrough

Watch this explanation of vector math and similarity:

<iframe src="https://share.descript.com/embed/UAMZxQf6dNc" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/projectshft/mini-rag.git
cd mini_rag
git checkout student-todo-exercises
```

### Install Dependencies

This project uses Yarn (as shown in the videos), but npm will work too:

```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### Set Up Environment Variables

Before running any exercises, you need to configure your API keys:

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

**Important:** Never commit `.env` to git! It's already in `.gitignore` for your protection.

---

## What You'll Build

A `findTopSimilarDocuments` function that:

- Calculates similarity between query and documents
- Filters by minimum threshold
- Returns top K matches sorted by relevance

---

## Understanding the Helper Functions

Before you implement the main function, let's understand the building blocks (already provided).

### Dot Product

Measures how aligned two vectors are:

```typescript
function dotProduct(vectorA: number[], vectorB: number[]): number {
	return vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
}

// Example
dotProduct([1, 2, 3], [4, 5, 6]); // (1×4) + (2×5) + (3×6) = 32
```

**Why it matters:**

- Foundation of similarity measurement
- Higher value = more aligned
- Used in cosine similarity calculation

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

**Why it matters:**

- Needed to normalize dot product
- Think of it as "how far from origin"
- Pythagoras in N dimensions!

### Cosine Similarity

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

- **Direction matters, not length**: `[1, 2]` and `[2, 4]` point the same direction → similarity 1.0
- **Normalized**: Always returns -1 to 1
- **Standard in NLP**: Used by all major RAG systems

**Visualize it:**

```
     Vector A
        /
       /
      /_____ Vector B

Small angle = high similarity
Large angle = low similarity
```

Cosine measures the angle!

---

## Your Challenge: Find Top Similar Documents

Located at: `app/scripts/exercises/vector-similarity.ts`

### The Function Signature

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

- `queryVector`: The user's question as numbers
- `documents`: All available documents with embeddings
- `minSimilarity`: Don't return results below this (default 0.7)
- `topK`: Maximum number of results (default 3)

**Returns:**
Array of documents with their similarity scores, sorted highest first.

### Example Usage

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

---

## Implementation Steps

### Step 1: Calculate Similarities

For each document, calculate how similar it is to the query:

```typescript
const results = documents.map((doc) => ({
	document: doc,
	similarity: cosineSimilarity(queryVector, doc.embedding),
}));
```

**What's happening:**

- Loop through each document
- Compare query to document's embedding
- Get a score from -1 to 1
- Store both document and score

### Step 2: Filter by Threshold

Remove documents below minimum similarity:

```typescript
const filtered = results.filter((result) => result.similarity >= minSimilarity);
```

**Why filter?**

- Low similarity = not relevant
- Saves computation/bandwidth
- Better user experience (quality over quantity)

**Example thresholds:**

- `0.9+`: Almost identical
- `0.7-0.9`: Highly relevant ← Good default
- `0.5-0.7`: Somewhat relevant
- `< 0.5`: Probably noise

### Step 3: Sort by Similarity

Put best matches first:

```typescript
filtered.sort((a, b) => b.similarity - a.similarity);
```

**Why sort?**

- User expects best results first
- LLM gets most relevant context first
- Standard UX pattern

**The sorting:**

- `b.similarity - a.similarity`: Descending order
- If `b > a`: Positive number → b comes first
- If `a > b`: Negative number → a comes first

### Step 4: Take Top K

Limit results:

```typescript
return filtered.slice(0, topK);
```

**Why limit?**

- LLM context window has limits
- More isn't always better (quality > quantity)
- Faster response times
- Standard: 3-5 results for RAG

---

## Running the Exercise

### 1. Run the tests

Check your solution by running:

```bash
yarn test app/scripts/exercises/vector-similarity.test.ts
```

All tests should pass when implemented correctly.

### 2. Try the example

```bash
yarn exercise:vectors
```

Should show similar documents to the query.

---

## Understanding the Tests

The tests verify:

**Basic functionality:**

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

---

## Why This Function is Critical

This is THE core of RAG:

```
User Question
      ↓
Convert to embedding
      ↓
findTopSimilarDocuments() ← YOUR FUNCTION!
      ↓
Get relevant chunks
      ↓
Feed to LLM as context
      ↓
LLM generates answer
```

**Without this:** Random chunks → confused LLM → bad answers

**With this:** Relevant chunks → focused LLM → great answers

---

## Real-World RAG Flow

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

---

## Common Mistakes

### ❌ Not filtering

```typescript
// Returns ALL documents, even 0.1 similarity
return documents.map(...).sort(...).slice(0, topK);
```

### ❌ Wrong sort direction

```typescript
// Lowest similarity first (backwards!)
filtered.sort((a, b) => a.similarity - b.similarity);
```

### ❌ Filtering after slicing

```typescript
// Filters AFTER taking top K (wrong order!)
const topK = results.slice(0, k);
return topK.filter((r) => r.similarity >= threshold);
```

---

## What You Learned

✅ How dot product measures vector alignment
✅ Why magnitude matters for normalization
✅ How cosine similarity gives angle-based scores
✅ How to find top K similar documents
✅ Why filtering by threshold matters
✅ This is the core of RAG retrieval

---

## Video Solution Walkthrough

Watch the solution explanation:

<iframe src="https://share.descript.com/embed/5ze8rVvlJGu" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## Solution

<details>
<summary>Click to reveal implementation</summary>

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
