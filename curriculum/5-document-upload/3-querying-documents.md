# Querying Documents from Pinecone

Now that you understand how to upload documents to Pinecone, it's time to learn how to retrieve them! This is the "read" side of your RAG system.

---

## Video Walkthrough

Watch this explanation of querying documents:

<iframe src="https://share.descript.com/embed/bcBSmqqgDJ8" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

-   How vector similarity search works
-   Querying Pinecone with embeddings
-   Understanding similarity scores
-   Building a test API route to query documents
-   Hands-on challenge: Implement your own query route

---

## The Retrieval Flow

```
User Query: "How do React hooks work?"
        ↓
1. Convert query to embedding (OpenAI)
        ↓
2. Search Pinecone for similar vectors
        ↓
3. Pinecone returns top K matches with scores
        ↓
4. Extract metadata (actual text content)
        ↓
Return relevant document chunks
```

**Key insight:** We never search by text directly. We search by _semantic similarity_ using vector math!

---

## Understanding Vector Similarity Search

### How It Works

When you query Pinecone:

1. **Your query becomes a vector**

    ```
    "How do React hooks work?"
    → [0.23, -0.15, 0.89, ..., 0.42]  // 512 numbers
    ```

2. **Pinecone compares to all stored vectors**

    ```
    Stored doc 1: [0.25, -0.14, 0.87, ..., 0.40]  // Similar!
    Stored doc 2: [0.10, 0.92, -0.31, ..., -0.15]  // Not similar
    Stored doc 3: [0.24, -0.16, 0.91, ..., 0.43]  // Very similar!
    ```

3. **Returns top K most similar**
    ```
    1. Doc 3 (score: 0.95) - "React hooks introduction..."
    2. Doc 1 (score: 0.92) - "Understanding useState..."
    3. Doc 7 (score: 0.87) - "useEffect guide..."
    ```

### Similarity Scores

**Score range:** 0.0 to 1.0

-   **1.0** = Identical vectors (perfect match)
-   **0.8-0.95** = Highly similar (great results)
-   **0.6-0.8** = Moderately similar (decent results)
-   **< 0.6** = Low similarity (may not be relevant)

---

## Using the searchDocuments Function

We've already created a helper function in `app/libs/pinecone.ts`:

```typescript
export const searchDocuments = async (
	query: string,
	topK: number = 3
): Promise<ScoredPineconeRecord<RecordMetadata>[]> => {
	// 1. Get reference to your index
	const index = pineconeClient.Index(process.env.PINECONE_INDEX!);

	// 2. Convert query to embedding using OpenAI
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 512,
		input: query,
	});

	const embedding = queryEmbedding.data[0].embedding;

	// 3. Query Pinecone with the embedding
	const docs = await index.query({
		vector: embedding,
		topK,
		includeMetadata: true, // IMPORTANT: Get the actual text!
	});

	return docs.matches;
};
```

### Breaking It Down

**Step 1: Get the index**

```typescript
const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
```

-   Connect to your specific Pinecone index
-   Same index you uploaded to

**Step 2: Create query embedding**

```typescript
const queryEmbedding = await openaiClient.embeddings.create({
	model: 'text-embedding-3-small', // MUST match upload model
	dimensions: 512, // MUST match index dimensions
	input: query,
});
```

⚠️ **Critical:** Model and dimensions MUST match what you used during upload!

**Step 3: Query Pinecone**

```typescript
const docs = await index.query({
	vector: embedding, // Your query vector
	topK, // How many results (default 3)
	includeMetadata: true, // Include text content
});
```

**Step 4: Return matches**

```typescript
return docs.matches;
```

Each match contains:

-   `id` - Unique document ID
-   `score` - Similarity score (0-1)
-   `metadata` - Your stored data (text, URL, etc.)

---

## Understanding the Response

When you call `searchDocuments()`, you get:

```typescript
[
	{
		id: 'react-docs-chunk-42',
		score: 0.94,
		metadata: {
			source: 'https://react.dev/learn/hooks',
			content:
				'React Hooks let you use state and other React features...',
			chunkIndex: 42,
			totalChunks: 150,
		},
	},
	{
		id: 'react-docs-chunk-15',
		score: 0.89,
		metadata: {
			source: 'https://react.dev/reference/react/useState',
			content: 'useState is a React Hook that lets you add state...',
			chunkIndex: 15,
			totalChunks: 150,
		},
	},
	{
		id: 'typescript-docs-chunk-8',
		score: 0.76,
		metadata: {
			source: 'https://typescriptlang.org/docs',
			content: 'TypeScript provides static typing...',
			chunkIndex: 8,
			totalChunks: 200,
		},
	},
];
```

**Notice:**

-   Sorted by score (highest first)
-   Metadata contains the actual text
-   Each result is from a different chunk

---

## Your Challenge: Build a Test Route

Let's create a simple API route to test document retrieval!

### Task: Implement the `/api/rag-test/route.ts`

We've created a skeleton file at `app/api/rag-test/route.ts` for you to implement.

**Requirements:**

1. Accept POST requests with a query
2. Use `searchDocuments()` to find relevant docs
3. Return results with scores and content
4. Handle errors gracefully

### Current Implementation

Open `app/api/rag-test/route.ts` and you'll see a basic implementation:

```typescript
import { searchDocuments } from '@/app/libs/pinecone';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { query, topK } = body;

	const results = await searchDocuments(query, topK);

	const formattedResults = results.map((doc) => ({
		id: doc.id,
		score: doc.score,
		content: doc.metadata?.text || '',
		source: doc.metadata?.source || 'unknown',
		chunkIndex: doc.metadata?.chunkIndex,
		totalChunks: doc.metadata?.totalChunks,
	}));

	return NextResponse.json({
		query,
		resultsCount: formattedResults.length,
		results: formattedResults,
	});
}
```

### Your Tasks

**Add the following improvements:**

1. **Add try/catch error handling**
   - Wrap the function body in a try/catch block
   - Log errors with `console.error`
   - Return a 500 status code with error details

2. **Add input validation**
   - Check if `query` exists and is a string
   - Return a 400 status code if invalid
   - Set a default value for `topK` (e.g., 5)

3. **Add better error messages**
   - Clear validation error messages
   - Helpful error responses for debugging

### Step 3: Test Your Route

Once implemented, test it with curl:

```bash
curl -X POST http://localhost:3000/api/rag-test \
  -H "Content-Type: application/json" \
  -d '{"query": "How do React hooks work?", "topK": 3}'
```

**Expected response:**

```json
{
	"results": [
		{
			"id": "react-docs-chunk-42",
			"score": 0.94,
			"content": "React Hooks let you use state...",
			"source": "https://react.dev/learn/hooks"
		},
		{
			"id": "react-docs-chunk-15",
			"score": 0.89,
			"content": "useState is a React Hook...",
			"source": "https://react.dev/reference/react/useState"
		}
	]
}
```

---

## Video Solution Walkthrough

Watch the solution explanation:

<iframe src="https://share.descript.com/embed/cOqfPDaYyTy" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## Complete Solution

<details>
<summary>Click to reveal complete solution</summary>

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { searchDocuments } from '@/app/libs/pinecone';

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const body = await request.json();
		const { query, topK = 5 } = body;

		// Validate query
		if (!query || typeof query !== 'string') {
			return NextResponse.json(
				{ error: 'Query is required and must be a string' },
				{ status: 400 }
			);
		}

		// Search for similar documents
		const results = await searchDocuments(query, topK);

		// Format results for response
		const formattedResults = results.map((doc) => ({
			id: doc.id,
			score: doc.score,
			content: doc.metadata?.text || '',
			source: doc.metadata?.source || 'unknown',
			chunkIndex: doc.metadata?.chunkIndex,
			totalChunks: doc.metadata?.totalChunks,
		}));

		return NextResponse.json({
			query,
			resultsCount: formattedResults.length,
			results: formattedResults,
		});
	} catch (error) {
		console.error('Search error:', error);
		return NextResponse.json(
			{
				error: 'Failed to search documents',
				details: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}
```

</details>

---

## Testing Different Queries

Try these queries to see how semantic search works:

### Technical Queries

```bash
# Query about React hooks
curl -X POST http://localhost:3000/api/rag-test \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I use useState in React?"}'

# Query about TypeScript
curl -X POST http://localhost:3000/api/rag-test \
  -H "Content-Type: application/json" \
  -d '{"query": "What are TypeScript generics?"}'
```

### Semantic Similarity

```bash
# These should return similar results:
curl -X POST http://localhost:3000/api/rag-test \
  -d '{"query": "React state management"}'

curl -X POST http://localhost:3000/api/rag-test \
  -d '{"query": "How to manage state in React"}'

curl -X POST http://localhost:3000/api/rag-test \
  -d '{"query": "useState hook tutorial"}'
```

**Why similar results?**

-   Embeddings capture _meaning_, not just keywords
-   "state management" and "manage state" are semantically similar
-   Vector similarity finds conceptually related content

---

## Understanding topK Parameter

The `topK` parameter controls how many results to return:

```typescript
// Get top 3 results (most relevant)
await searchDocuments(query, 3);

// Get top 10 results (broader context)
await searchDocuments(query, 10);

// Default is 3
await searchDocuments(query);
```

**Guidelines:**

-   **topK = 3-5:** Focused, high-quality results
-   **topK = 5-10:** More context, some noise
-   **topK > 10:** Lots of context, potentially less relevant

**For RAG systems:**

-   Start with 3-5 chunks
-   Experiment to find optimal number
-   More isn't always better (token limits!)

---

## Common Issues and Solutions

### Issue: Empty Results

```json
{ "results": [] }
```

**Causes:**

-   No documents uploaded yet
-   Query embedding model mismatch
-   Index is wrong

**Solutions:**

1. Check documents are uploaded: Open Pinecone console
2. Verify embedding model matches upload
3. Check `PINECONE_INDEX` environment variable

### Issue: Low Similarity Scores

```json
{ "score": 0.42, "content": "..." }
```

**Causes:**

-   Query doesn't match uploaded content
-   Different domain/topic
-   Poor quality embeddings

**Solutions:**

1. Upload relevant documents
2. Rephrase query to be more specific
3. Check document quality

### Issue: Wrong Content Returned

**Causes:**

-   Chunking strategy issues
-   Documents from wrong domain
-   Need more specific query

**Solutions:**

1. Improve chunking (better overlap)
2. Filter by metadata (add source filter)
3. Increase topK to see more results

---

## Advanced: Filtering by Metadata

Pinecone supports metadata filtering:

```typescript
const docs = await index.query({
	vector: embedding,
	topK: 5,
	includeMetadata: true,
	filter: {
		source: { $eq: 'https://react.dev' }, // Only React docs
	},
});
```

**Use cases:**

-   Filter by source URL
-   Filter by date uploaded
-   Filter by content type
-   Filter by tags

---

## Experiment: Compare Search Strategies

### Experiment 1: Different topK Values

```typescript
// Test with different topK values
const results3 = await searchDocuments(query, 3);
const results5 = await searchDocuments(query, 5);
const results10 = await searchDocuments(query, 10);

// Compare:
// - Lowest score in each set
// - Relevance of bottom results
// - Total tokens if passed to LLM
```

### Experiment 2: Query Variations

```typescript
const queries = [
	'React hooks',
	'How to use React hooks',
	'React hooks tutorial for beginners',
	'useState and useEffect in React',
];

// Do they return the same documents?
// Which query gives best results?
```

### Experiment 3: Score Thresholds

```typescript
// Only return results above threshold
const results = await searchDocuments(query, 10);
const highQuality = results.filter((doc) => doc.score > 0.8);

// How many results pass the threshold?
// What's the optimal threshold?
```

---

## What You've Learned

✅ How vector similarity search works
✅ Using the `searchDocuments()` function
✅ Understanding similarity scores
✅ Building an API route for testing
✅ Debugging common issues
✅ The importance of topK parameter

---

## What's Next?

Now that you can:

1. ✅ Upload documents
2. ✅ Query documents

You're ready for:

-   **Agent Architecture** - Build intelligent routing
-   **RAG Agent** - Combine retrieval + generation
-   **Chat Interface** - Create user-facing app

The foundation of your RAG system is complete!

---

## Assignment 1: Chunking + Sanitization

Now it's time to apply what you've learned to a new problem.

### Video Assignment (3-4 minutes)

Explain chunking strategy tradeoffs. How would you chunk these different document types:

1. **Medical records** - HIPAA considerations, structured fields mixed with clinical notes, sensitive data
2. **Confluence documentation** - Headers, code blocks, tables, cross-references
3. **Twitter/X posts** - Short content, hashtags, threads, mentions

For each type, explain:
- What chunk size would you use and why?
- Where would you split (sentences, paragraphs, sections)?
- What metadata would you preserve?
- What special handling is needed?

### Code Assignment

**Complete the TODOs** in the ingestion route to make the system work, then **extend it** with text sanitization:

**Files:**
- `app/api/upload-document/route.ts`
- `app/libs/chunking.ts`

**Extension - Add sanitization:**
- Strip HTML tags from content
- Normalize whitespace (collapse multiple spaces/newlines)
- Handle special characters (smart quotes, em dashes, etc.)
- Remove boilerplate text (navigation, footers, "Click here to...", etc.)

**What "done" looks like:**
- Documents upload and chunk correctly
- Sanitization cleans messy web content before chunking
- You can demonstrate the before/after of sanitization

### Submit Your Work

- [Video Submission - Assignment 1](https://form.typeform.com/to/NdVcsThQ)
- [Code Submission - Assignment 1](https://form.typeform.com/to/A0pGKPqU)

**Due:** Before starting Assignment 2
