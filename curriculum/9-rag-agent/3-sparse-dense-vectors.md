# Sparse and Dense Vectors in RAG

Watch the video walkthrough: [Hybrid Search Demo](https://share.descript.com/view/xBNE7qZquyD)

---

## Hands-On Demo

Run the complete demo to create an index, upload documents, and compare search modes:

```bash
npx ts-node app/scripts/exercises/hybrid-search-demo.ts all
```

Or run steps individually:

```bash
npx ts-node app/scripts/exercises/hybrid-search-demo.ts create   # Create index
npx ts-node app/scripts/exercises/hybrid-search-demo.ts upsert   # Upload docs
npx ts-node app/scripts/exercises/hybrid-search-demo.ts search   # Compare searches
npx ts-node app/scripts/exercises/hybrid-search-demo.ts cleanup  # Delete demo data
```

The demo uses real production tools:

- **Dense vectors**: OpenAI `text-embedding-3-small`
- **Sparse vectors**: Pinecone's `pinecone-sparse-english-v0` encoder

---

## The Problem

Dense search and sparse search solve different retrieval problems.

**Dense vectors** are what you've been using - embeddings with many dimensions (512, 1536, 3072, etc.) that capture semantic meaning. Because there are so many dimensions, they capture nuance well. "King" matches "monarch," "car" matches "automobile."

The problem? Technical terms get fuzzy. Search for `useState` and you might get results about `useContext` or general state management - semantically similar, but not what you wanted.

**Sparse vectors** are mostly zeros. They represent exact keywords - Pinecone's encoder looks at your text, identifies important words, and assigns weights to just those terms. Everything else is zero. This means `useState` maps to documents that actually contain `useState`.

---

## Hybrid Search

In hybrid search, dense retrieval and sparse retrieval run in parallel:

- **Dense retrieval** finds semantically relevant documents
- **Sparse retrieval** finds lexically relevant documents

The system then combines the rankings or scores to produce better overall results.

This gives "the best of both worlds":

- Dense retrieval handles meaning and paraphrasing
- Sparse retrieval handles exact matches and terminology

That's why modern RAG systems often use hybrid retrieval, especially for domains like e-commerce, medical search, legal search, enterprise docs, and codebases.

---

## Example: Why This Matters

The demo uses documents that are **semantically almost identical** but have different identifiers. This is where hybrid search shines.

**Search query:** "What is SKU-7292?"

| Method     | Result                       | Why                                       |
| ---------- | ---------------------------- | ----------------------------------------- |
| **Dense**  | Returns wrong SKU or nothing | All Nike shoes look the same semantically |
| **Hybrid** | Returns SKU-7292 as #1       | Sparse boosts the exact SKU match         |

**More examples from the demo:**

| Query                          | Dense Problem                              | Hybrid Solution     |
| ------------------------------ | ------------------------------------------ | ------------------- |
| "PostgreSQL 16.1 security fix" | Returns 15.2 or 14.9 (all similar patches) | Exact version match |
| "Error E-4002"                 | Returns E-4001 (all connection errors)     | Exact error code    |
| "Order ORD-2024-78433"         | Returns wrong order                        | Exact order number  |

The key insight: **documents must be semantically similar but have different identifiers** to see hybrid's value. If documents are already semantically distinct, dense search works fine.

---

## Pinecone Implementation

Pinecone supports hybrid search natively. The key insight: **you don't create these vectors yourself**. Models generate them for you.

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

---

## When to Use Hybrid Search

**Use hybrid search when:**

- Your domain has specific terminology (SKUs, medication names, legal citations)
- Users search with both natural questions and exact terms
- Missing exact matches causes poor user experience

**Stick with dense-only when:**

- You're just getting started (keep it simple)
- Your content is conversational without critical exact-match terms

---

## Alternative: Metadata Filtering

Hybrid search isn't the only way to improve exact-match retrieval. **Metadata filtering** can also help - store important identifiers (SKUs, order numbers, versions) as metadata, then filter on them at query time.

Trade-offs:

- Metadata filtering requires knowing what to filter on ahead of time
- You need to extract keywords from user queries to match against metadata
- It's more restrictive but more precise

You could even combine both approaches: hybrid search + metadata filtering for maximum precision.

---

## Further Reading

- [Pinecone: Understanding Hybrid Search](https://docs.pinecone.io/guides/data/understanding-hybrid-search)
- [Pinecone: Hybrid Search Quickstart](https://docs.pinecone.io/guides/search/hybrid-search)
- [BM25 Algorithm](https://en.wikipedia.org/wiki/Okapi_BM25)
