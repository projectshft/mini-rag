# Day 24 — Sparse + Dense Vectors (Hybrid Search)

**Time:** ~60 min · Hands-on

> **Today:** dense embeddings think `SKU-7292` and `SKU-7293` are practically the same thing. Your users disagree. You'll see where semantic search breaks on exact identifiers — and fix it by combining dense vectors with sparse keyword vectors in one hybrid query.

## Video walkthrough

<iframe src="https://share.descript.com/embed/xBNE7qZquyD" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## The problem

Dense search and sparse search solve different retrieval problems.

**Dense vectors** are what you've been using — embeddings with many dimensions (512, 1536, 3072, …) that capture semantic meaning. Because there are so many dimensions, they capture nuance well: "king" matches "monarch", "car" matches "automobile".

The problem? Technical terms get fuzzy. Search for `useState` and you might get results about `useContext` or general state management — semantically similar, but not what you wanted.

**Sparse vectors** are mostly zeros. They represent exact keywords — Pinecone's encoder looks at your text, identifies important words, and assigns weights to just those terms. Everything else is zero. This means `useState` maps to documents that actually *contain* `useState`.

## Hybrid search

In hybrid search, dense retrieval and sparse retrieval run in parallel:

- **Dense retrieval** finds semantically relevant documents
- **Sparse retrieval** finds lexically relevant documents

The system combines the scores to produce better overall results — "the best of both worlds":

- Dense handles meaning and paraphrasing
- Sparse handles exact matches and terminology

That's why modern RAG systems often use hybrid retrieval, especially in domains like e-commerce, medical search, legal search, enterprise docs, and codebases.

```visual
hybrid-search | Dense meets sparse: hybrid retrieval
```

## Why this matters: an example

The demo you're about to run uses documents that are **semantically almost identical** but have different identifiers. This is exactly where hybrid search shines.

**Search query:** "What is SKU-7292?"

| Method     | Result                       | Why                                        |
| ---------- | ---------------------------- | ------------------------------------------ |
| **Dense**  | Returns wrong SKU or nothing | All Nike shoes look the same semantically  |
| **Hybrid** | Returns SKU-7292 as #1       | Sparse boosts the exact SKU match          |

**More examples from the demo:**

| Query                          | Dense problem                              | Hybrid solution     |
| ------------------------------ | ------------------------------------------ | ------------------- |
| "PostgreSQL 16.1 security fix" | Returns 15.2 or 14.9 (all similar patches) | Exact version match |
| "Error E-4002"                 | Returns E-4001 (all connection errors)     | Exact error code    |
| "Order ORD-2024-78433"         | Returns wrong order                        | Exact order number  |

The key insight: **documents must be semantically similar but have different identifiers** for hybrid to show its value. If your documents are already semantically distinct, dense search works fine.

```quiz
[
  {
    "q": "Why does dense search struggle with 'What is SKU-7292?' over a catalog of Nike running shoes?",
    "options": ["The embedding model was never trained on shoes", "All the product descriptions are semantically near-identical, so the exact SKU token barely moves the vector", "SKUs are too long to embed"],
    "answer": 1,
    "explain": "To an embedding model, every 'Nike Air Zoom running shoe, product code SKU-XXXX' lands in almost the same spot in vector space. The one token that distinguishes them carries almost no semantic weight."
  },
  {
    "q": "What is a sparse vector, structurally?",
    "options": ["A short dense embedding (fewer dimensions)", "A vector that is mostly zeros, with non-zero weights only at indices corresponding to important terms in the text", "A compressed version of the dense vector"],
    "answer": 1,
    "explain": "Sparse vectors live in a huge vocabulary-sized space but store only the handful of (index, weight) pairs for terms that actually appear — which is why exact terms match exactly."
  },
  {
    "q": "Why does the hybrid demo index use the dotproduct metric instead of cosine?",
    "options": ["dotproduct is faster to compute", "Hybrid scoring adds dense and sparse contributions, and cosine's normalization breaks that additive sparse scoring", "Pinecone doesn't support cosine on serverless indexes"],
    "answer": 1,
    "explain": "Hybrid search combines dense + sparse scores additively. Cosine normalizes vectors, which destroys the sparse term weights — so hybrid indexes require dotproduct."
  },
  {
    "q": "When is dense-only retrieval the right call?",
    "options": ["Never — hybrid always wins", "When content is conversational and there are no critical exact-match identifiers", "When your corpus contains SKUs and error codes"],
    "answer": 1,
    "explain": "Hybrid adds moving parts. If nothing in your domain hinges on exact identifiers, dense-only is simpler and works fine — start there."
  }
]
```

## Hands-on demo

Run the complete demo — it creates a real Pinecone index, uploads the documents above with *both* vector types, and runs dense-vs-hybrid comparisons side by side:

```bash
yarn exercise:hybrid all
```

Or run the steps individually:

```bash
yarn exercise:hybrid create   # Create index
yarn exercise:hybrid upsert   # Upload docs
yarn exercise:hybrid search   # Compare searches
yarn exercise:hybrid cleanup  # Delete demo data
```

The demo ([`app/scripts/exercises/hybrid-search-demo.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/scripts/exercises/hybrid-search-demo.ts)) uses real production tools:

- **Dense vectors:** OpenAI `text-embedding-3-small` (512 dimensions here)
- **Sparse vectors:** Pinecone's `pinecone-sparse-english-v0` encoder

Before you run it, predict: for the query "How do I fix error E-4002?", which documents will dense-only rank in its top 3?

<details>
<summary>💡 Hint 1 — if the demo errors immediately</summary>

You need `OPENAI_API_KEY` and `PINECONE_API_KEY` in your `.env` — the same keys you've used since [Day 5](/learn/day-05). The demo creates its own serverless index called `hybrid-demo` (dimension 512, metric `dotproduct`), so it won't touch your main course index.

</details>

<details>
<summary>💡 Hint 2 — what to actually look at in the output</summary>

For each of the four example queries, the demo prints a **DENSE ONLY** top-3 and a **HYBRID** top-3, with scores. Lines containing the exact term (e.g. `SKU-7292`) are marked with `✓`. Watch two things: (1) where the `✓` line ranks in each list, and (2) how close together the dense scores are — that crowding *is* the problem from yesterday's lesson, in live data.

</details>

<details>
<summary>🔍 Expected output — what a run looks like</summary>

Your scores will differ slightly, but the shape should match. During `upsert` you'll see both vector types for the first document:

```
[1/15] "Nike Air Zoom Pegasus 40 running shoe, mens, black..."

  DENSE (first 5 values): 0.0421, -0.0187, 0.0334, ...
  SPARSE indices: 1029384, 2837465, ...
  SPARSE values: 2.341, 1.876, ...
```

Then in the `search` step, comparisons like:

```
QUERY: "What is SKU-7292?"
Looking for exact term: "SKU-7292"

  DENSE ONLY (semantic meaning):
    [0.412]   Nike Air Zoom Pegasus 40 running shoe, mens, blue/grey. Product...
    [0.409] ✓ Nike Air Zoom Pegasus 40 running shoe, mens, black/white. Produ...
    [0.401]   Nike Pegasus Trail 4 running shoe, mens, olive green. Product c...

  HYBRID (semantic + keywords):
    [4.876] ✓ Nike Air Zoom Pegasus 40 running shoe, mens, black/white. Produ...
    [0.912]   Nike Air Zoom Pegasus 40 running shoe, mens, blue/grey. Product...
    [0.887]   Nike Pegasus Trail 4 running shoe, mens, olive green. Product c...
```

Two things to notice: dense-only ranks a *wrong* SKU first (or ranks the right one barely ahead, on scores separated by thousandths), while hybrid puts the exact match at #1 with a score gap you could drive a truck through. It ends with a WHEN TO USE WHAT summary. Run `yarn exercise:hybrid cleanup` when you're done.

</details>

## Pinecone implementation

Pinecone supports hybrid search natively. The key insight: **you don't create these vectors yourself** — models generate them for you.

```javascript
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pinecone = new Pinecone();
const openai = new OpenAI();

// 1. Generate dense embedding from OpenAI
const embeddingResponse = await openai.embeddings.create({
	model: 'text-embedding-3-small',
	input: 'Your document text here',
});
const denseVector = embeddingResponse.data[0].embedding; // [0.12, 0.45, 0.23, ...]

// 2. Generate sparse vector from Pinecone's encoder
const index = pinecone.index('your-index');
const sparseResponse = await pinecone.inference.embed(
	'pinecone-sparse-english-v0',
	['Your document text here'],
	{ inputType: 'passage' },
);
const sparseVector = sparseResponse.data[0].sparseValues; // { indices: [...], values: [...] }

// 3. Upsert with BOTH vectors - models generated these, not you
await index.upsert([
	{
		id: 'doc-1',
		values: denseVector, // From OpenAI
		sparseValues: sparseVector, // From Pinecone encoder
		metadata: { text: '...' },
	},
]);

// 4. Query with hybrid search
const results = await index.query({
	vector: queryDenseVector,
	sparseVector: querySparseVector,
	topK: 10,
	alpha: 0.5, // 0 = pure sparse, 1 = pure dense, 0.5 = balanced
});
```

Note the `inputType` option on the sparse encoder: use `'passage'` when embedding documents and `'query'` when embedding search queries — the encoder weights terms differently for each.

## When to use hybrid search

**Use hybrid search when:**

- Your domain has specific terminology (SKUs, medication names, legal citations)
- Users search with both natural questions and exact terms
- Missing exact matches causes poor user experience

**Stick with dense-only when:**

- You're just getting started (keep it simple)
- Your content is conversational without critical exact-match terms

## Alternative: metadata filtering

Hybrid search isn't the only way to improve exact-match retrieval. **Metadata filtering** can also help — store important identifiers (SKUs, order numbers, versions) as metadata, then filter on them at query time.

Trade-offs:

- Metadata filtering requires knowing what to filter on ahead of time
- You need to extract keywords from user queries to match against metadata
- It's more restrictive but more precise

You can even combine both: hybrid search + metadata filtering for maximum precision.

Different query, different retrieval mode — prove you can pick the winner:

```match
{
  "title": "Match the query to the retrieval mode that wins",
  "note": "Tap a query, then tap the approach you'd bet on. Correct matches lock in.",
  "pairs": [
    { "left": "\"Error E-4002\" — the user pasted the exact code from their logs", "right": "Sparse — only a verbatim keyword match separates E-4002 from E-4001" },
    { "left": "\"my connection keeps dropping\" — a paraphrase sharing no keywords with the docs", "right": "Dense — the meaning matches even when the words don't" },
    { "left": "\"What changed in the PostgreSQL 16.1 security fix?\" — an exact version inside a conceptual question", "right": "Hybrid — sparse pins the version number, dense handles 'what changed'" },
    { "left": "\"Only show results from the official React docs\" — a hard requirement on the source", "right": "Metadata filter — a constraint on the record, not a similarity problem" }
  ]
}
```

## Further reading

- [Pinecone: Understanding Hybrid Search](https://docs.pinecone.io/guides/data/understanding-hybrid-search)
- [Pinecone: Hybrid Search Quickstart](https://docs.pinecone.io/guides/search/hybrid-search)
- [BM25 Algorithm](https://en.wikipedia.org/wiki/Okapi_BM25)

## ✅ Key takeaways

- **Dense** vectors capture meaning ("fast" ≈ "quick" ≈ "performant"); **sparse** vectors capture exact terms (`SKU-7292` ≠ `SKU-7293`) — hybrid runs both and combines the scores
- Hybrid's value shows up when documents are **semantically similar but differ by identifier** — SKUs, versions, error codes, order numbers
- You never hand-craft either vector: OpenAI generates the dense one, Pinecone's `pinecone-sparse-english-v0` generates the sparse one
- Hybrid indexes need the **dotproduct** metric — cosine's normalization breaks additive sparse scoring
- Metadata filtering is a complementary tool for exact matches; production systems often use both

## 🤖 Work with AI

```ai-prompt
title: Explain my hybrid demo results back to you
---
I just ran `yarn exercise:hybrid all` (app/scripts/exercises/hybrid-search-demo.ts), which compares dense-only vs hybrid retrieval over 15 documents that are semantically near-identical but differ by identifier (Nike SKUs, PostgreSQL versions, error codes E-4001/2/3, order numbers).

I'll paste my actual output for the four comparison queries. For each one, I'll explain WHY dense ranked things the way it did and why hybrid differed — then you fact-check my reasoning. Push me on: why the dense scores cluster so tightly, what the sparse encoder did with tokens like "E-4002", and why the index uses dotproduct instead of cosine. Flag any explanation where I'm pattern-matching instead of understanding.
```

```ai-prompt
title: Design a hybrid-vs-metadata decision for my domain
---
I've learned two ways to fix exact-identifier retrieval in RAG: hybrid search (dense + sparse vectors, alpha-weighted, in Pinecone) and metadata filtering (store identifiers as metadata, filter at query time). 

I'll describe a real domain I might build a RAG system for (my capstone idea for this course). Interview me about it: what identifiers exist, how users phrase queries, how often exact matches matter. Then recommend hybrid, metadata filtering, both, or dense-only — and justify it with the trade-offs (complexity, needing to extract keywords ahead of time, query-time flexibility). Finish by sketching what my upsert record would look like.
```
