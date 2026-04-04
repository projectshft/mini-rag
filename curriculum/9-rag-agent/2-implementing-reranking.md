# Challenge: Improving Retrieval with Re-ranking

Your RAG agent works, but there's a powerful technique to improve retrieval quality: **re-ranking**.

---

## Video Walkthrough

Watch this explanation of reranking:

<iframe src="https://share.descript.com/embed/uxl9z4JgiQc" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## The Problem

Vector search (Pinecone) is fast and good at finding generally related content, but not always precise:

**Query:** "How to use React hooks with TypeScript"

**Pinecone returns (top 5 by cosine similarity):**

1. "React hooks introduction" - 0.89 ✅ Relevant
2. "TypeScript basics" - 0.87 ⚠️ Not specific enough
3. "Using hooks in React" - 0.86 ✅ Relevant
4. "TypeScript with React" - 0.85 ⚠️ Not about hooks specifically
5. "React hooks patterns" - 0.84 ✅ Relevant

**The issue:** Results 2 and 4 pollute the context with semi-relevant content.

---

## The Solution: Over-Fetch and Re-Rank

**Strategy:**

1. **Over-fetch**: Get more results than you need (e.g., 10 instead of 5)
2. **Re-rank**: Use a specialized model to score relevance more accurately
3. **Keep top N**: Take only the best after re-ranking (e.g., top 3)

```
Pinecone (Vector Search)     Re-ranking Model           Final Context
    10 results         →     Scores each result    →    Top 3 best
  (Fast, broad)              (Slower, accurate)         (High quality)
```

**Why this works:**

- **Pinecone**: Fast semantic search with good recall (casts a wide net)
- **Re-ranker**: Deep comparison using cross-attention for precision
- **Together**: Fast retrieval + accurate ranking = best results

---

## Documentation Resources

Before implementing, review these docs:

**Pinecone Inference API (Re-ranking):**

- [Re-ranking Guide](https://docs.pinecone.io/guides/inference/rerank) - Complete guide
- [API Reference](https://docs.pinecone.io/reference/api/2025-04/inference/rerank) - Re-rank endpoint

**Cohere Re-ranking:**

- [Cohere Rerank Documentation](https://docs.cohere.com/docs/reranking-with-cohere) - How re-rank models work
- [Rerank Best Practices](https://docs.cohere.com/docs/reranking-best-practices) - Optimization tips

---

## Your Challenge

Modify your RAG agent (`app/agents/rag.ts`) to use re-ranking.

### Step 1: Over-Fetch

Change your Pinecone query to get more results:

```typescript
const queryResponse = await index.query({
	vector: embedding,
	topK: 10, // Changed from 5 to 10
	includeMetadata: true,
});
```

### Step 2: Re-Rank

After the Pinecone query, add re-ranking:

```typescript
// Re-rank the results using Pinecone's inference API
const documents = queryResponse.matches
	.map((match) => match.metadata?.text ?? match.metadata?.content)
	.filter(Boolean);

// topN: Number of top results to return after reranking
// - Lower values (3-5) = more focused, highest relevance only
// - Higher values (10+) = more context, but may include less relevant docs
// returnDocuments: true means we get the actual text back, not just scores
const reranked = await pineconeClient.inference.rerank(
	'bge-reranker-v2-m3',
	request.query,
	documents,
	{ topN: 5, returnDocuments: true },
);
```

### Step 3: Use Re-Ranked Context

Update your context extraction to use re-ranked results:

```typescript
// Changed from queryResponse.matches to reranked.data
const retrievedContext = reranked.data
	.map((result) => result.document?.text)
	.filter(Boolean)
	.join('\n\n');

// Use this in your streamText call:
return streamText({
	model: openai('gpt-4o'),
	system: systemPrompt,
	prompt: `Context: ${retrievedContext}\n\nUser Query: ${request.query}`,
});
```

---

## Understanding the Results

### Without Re-ranking (Vector Search Only)

```
Query: "React hooks with TypeScript"

Top 5 from Pinecone:
1. React hooks intro - 0.89
2. TypeScript basics - 0.87       ← Not specific enough
3. Using hooks - 0.86
4. TypeScript with React - 0.85   ← Not about hooks
5. React hooks patterns - 0.84
```

### With Re-ranking (Over-fetch + Re-rank)

```
Query: "React hooks with TypeScript"

Step 1 - Pinecone: Get top 10 similar docs

Step 2 - Cohere Re-rank:
1. React hooks with TypeScript guide - 0.95  ✅ Perfect
2. TypeScript types for hooks - 0.89         ✅ Highly relevant
3. useState with TypeScript - 0.84           ✅ Specific example
```

**Result:** Higher quality, more focused context for the LLM.

---

## When to Use Re-ranking

### ✅ Use Re-ranking When:

- Queries are specific and nuanced
- Your corpus has many similar documents
- Precision matters more than speed
- Production applications where quality is critical

### ❌ Skip Re-ranking When:

- Queries are broad and simple
- Small corpus (< 100 documents)
- Latency is critical (re-ranking adds ~100-200ms)
- Budget is very limited

---

## Cost & Performance Trade-offs

**Performance:**
| Approach | Pinecone | Re-ranking | Total |
| --------------------- | -------- | ---------- | ------ |
| Basic (topK=5) | ~50ms | - | ~50ms |
| Re-ranked (topK=10→3) | ~60ms | ~150ms | ~210ms |

**Cost (per 1,000 queries):**
| Service | Basic | With Re-ranking | Delta |
| -------------- | ----- | --------------- | ------ |
| Pinecone | $0.01 | $0.02 | +$0.01 |
| Cohere Re-rank | $0 | $2.00 | +$2.00 |
| **Total** | $0.01 | $2.02 | +$2.01 |

---

## Testing Your Implementation

Add logging to compare results:

```typescript
console.log(
	'Pinecone scores:',
	queryResponse.matches.map((m) => m.score),
);
console.log(
	'Re-ranked scores:',
	reranked.data.map((r) => r.score),
);
console.log('Context length:', retrievedContext.length);
```

You should see bigger gaps between relevant/irrelevant content in re-ranked scores.

---

## Complete Solution

<details>
<summary>Click to reveal the re-ranking implementation</summary>

```typescript
export async function ragAgent(request: AgentRequest): Promise<AgentResponse> {
	// Step 1: Generate embedding for the refined query
	const embeddingResponse = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		input: request.query,
	});

	const embedding = embeddingResponse.data[0].embedding;

	// Step 2: Query Pinecone for similar documents (over-fetch)
	const index = pineconeClient.Index(process.env.PINECONE_INDEX as string);

	const queryResponse = await index.query({
		vector: embedding,
		topK: 10, // Over-fetch more results
		includeMetadata: true,
	});

	// Step 2.5: Re-rank with Pinecone inference API
	const documents = queryResponse.matches
		.map((match) => match.metadata?.text ?? match.metadata?.content)
		.filter(Boolean);

	// topN: Number of top results to return after reranking
	// - Lower values (3-5) = more focused, highest relevance only
	// - Higher values (10+) = more context, but may include less relevant docs
	// returnDocuments: true means we get the actual text back, not just scores
	const reranked = await pineconeClient.inference.rerank(
		'bge-reranker-v2-m3',
		request.query,
		documents,
		{ topN: 5, returnDocuments: true },
	);

	// Step 3: Extract the text content from re-ranked results
	const retrievedContext = reranked.data
		.map((result) => result.document?.text)
		.filter(Boolean)
		.join('\n\n');

	// Step 4: Build the system prompt with context
	const systemPrompt = `You are a helpful assistant that answers questions based on the provided context.

Original User Request: "${request.originalQuery}"

Refined Query: "${request.query}"

Context from documentation:
${retrievedContext}

Use the context above to answer the user's question. If the context doesn't contain enough information, say so clearly.`;

	// Step 5: Stream the response
	return streamText({
		model: openai('gpt-4o'),
		system: systemPrompt,
		prompt: `Context: ${retrievedContext}\n\nUser Query: ${request.query}`,
	});
}
```

</details>

---

## What You Learned

✅ Why re-ranking improves RAG quality
✅ The over-fetch and re-rank strategy
✅ How to use Cohere's re-ranking via Pinecone
✅ Trade-offs between speed and accuracy
✅ When to use re-ranking vs basic retrieval

---

## Homework Assignment 3

**Code Assignment:** Build a **two-stage reranking pipeline** that fetches results from Pinecone via vector similarity, then uses an LLM to re-score and re-order them — and build a UI that makes the comparison visible.

**What You're Building:**

A `POST /api/search/rerank` route that:
1. Takes a query string
2. **Stage 1:** Fetches top 20 results from Pinecone using vector similarity
3. **Stage 2:** Passes the query + all 20 chunks to an LLM that scores each 0-10 for relevance with a one-sentence reason
4. Returns pre-rerank top 5 and post-rerank top 5 side by side

**Requirements:**

1. **Stage 1 — Vector Retrieval:**
   - Generate an embedding for the query (text-embedding-3-small, 512 dimensions)
   - Query the default Pinecone index for top 20 results with metadata

2. **Stage 2 — LLM Reranking:**
   - Format all 20 chunks as numbered items for the LLM
   - Use `gpt-4o-mini` with `temperature: 0` and `response_format: { type: 'json_object' }`
   - System prompt: tell the model to score each chunk 0-10 and return JSON with `{ scores: [{ chunk_index, score, reason }] }`
   - Sort by score descending, take top 5

3. **Response shape:**
   ```json
   {
     "query": "...",
     "pre_rerank_top5": [{ "rank": 1, "id": "...", "similarity_score": 0.87, "content": "...", "source": "..." }],
     "post_rerank_top5": [{ "rank": 1, "id": "...", "rerank_score": 9, "reason": "...", "original_similarity": 0.82, "content": "...", "source": "..." }],
     "rerank_scores": [{ "chunk_index": 0, "score": 9, "reason": "..." }, ...]
   }
   ```

4. **Frontend** at `/rerank`:
   - Search input + button
   - Side-by-side columns: "Before Reranking" (gray) and "After Reranking" (highlighted)
   - Full scores table showing how every chunk was scored

**Exercise Files:**
- `app/api/search/rerank/route.exercise.ts` — rename to `route.ts` and implement the TODOs
- `app/rerank/page.exercise.tsx` — rename to `page.tsx` and build the UI

**Video Assignment:** Record a **3-5 minute video** explaining the **two-stage retrieval pattern** — why vector similarity alone isn't enough, how reranking improves quality, and the tradeoff (latency + cost). Show your side-by-side UI and walk through at least one query where the reranked order is meaningfully different from the original.

**Submit Your Work:**

- [Video Submission - Assignment 3](https://form.typeform.com/to/pwjkAruL)
- [Code Submission - Assignment 3](https://form.typeform.com/to/q3mEuSmX) (include link to `app/api/search/rerank/route.ts`)

**Due:** Before Module 11

**Why This Matters:** In production, the first results from a vector DB aren't always the best results. Reranking is the most impactful single improvement you can make to a RAG pipeline — but it comes with real cost and latency tradeoffs you need to understand.

---

## Additional Reading

### Re-Ranking Semantic Search (Qdrant) ⭐ HIGHLY RECOMMENDED

**Link:** https://qdrant.tech/documentation/search-precision/reranking-semantic-search/

**Why Read This:**

- Deep technical explanation of re-ranking algorithms
- Comparison of different re-ranking models
- When to use re-ranking vs embedding search alone
- Performance benchmarks and trade-offs

**Key Concepts:**

- Two-stage retrieval: Fast semantic search → Precise re-ranking
- Cross-encoder vs bi-encoder models
- Latency vs accuracy trade-offs
- Hybrid search strategies

**Time:** ~15 minutes

**Note:** This article uses Qdrant examples, but the concepts apply directly to Pinecone (which we use). The re-ranking principles are universal across vector databases.

