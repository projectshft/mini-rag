# Sparse and Dense Vectors in RAG

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

Dense search and sparse/BM25 search solve different retrieval problems.

**Dense search** uses embeddings to understand semantic meaning. It's good at finding conceptually similar content, even if the exact words differ. For example, a query for "light summer sandwich" may retrieve picnic sandwiches or turkey sandwiches because the meanings are related.

**Sparse search** (often BM25-based) focuses on exact words and important terms. It gives higher weight to rare or distinguishing words like SKUs, acronyms, medication names, or specific phrases. For example, searching "SKU 1234" will strongly favor documents containing the exact token "1234."

---

## How BM25 Works

BM25 works using three main ideas:

1. **Term frequency** - How often a term appears in a document
2. **Inverse document frequency** - How rare the term is across all documents
3. **Document length normalization** - Whether the document is unusually long

Rare and highly specific words receive much higher importance than common words.

---

## Hybrid Search

In hybrid search, dense retrieval and sparse/BM25 retrieval usually run in parallel:

- **Dense retrieval** finds semantically relevant documents
- **Sparse retrieval** finds lexically relevant documents

The system then combines the rankings or scores to produce better overall results.

This gives "the best of both worlds":

- Dense retrieval handles meaning and paraphrasing
- Sparse retrieval handles exact matches and terminology

That's why modern RAG systems often use hybrid retrieval, especially for domains like e-commerce, medical search, legal search, enterprise docs, and codebases.

---

## Example

Search query: "How to prevent re-renders in React?"

- **Dense vectors** find: Documents about React performance, memoization, optimization
- **Sparse vectors** find: Documents mentioning "re-render", "React.memo", "useMemo"
- **Hybrid** combines both for comprehensive results

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
  input: 'Your document text here'
});
const denseVector = embeddingResponse.data[0].embedding; // [0.12, 0.45, 0.23, ...]

// 2. Generate sparse vector from Pinecone's encoder
const index = pinecone.index('your-index');
const sparseResponse = await pinecone.inference.embed(
  'pinecone-sparse-english-v0',
  ['Your document text here'],
  { inputType: 'passage' }
);
const sparseVector = sparseResponse.data[0].sparseValues; // { indices: [...], values: [...] }

// 3. Upsert with BOTH vectors - models generated these, not you
await index.upsert([{
  id: 'doc-1',
  values: denseVector,              // From OpenAI
  sparseValues: sparseVector,       // From Pinecone encoder
  metadata: { text: '...' }
}]);

// 4. Query with hybrid search
const results = await index.query({
  vector: queryDenseVector,
  sparseVector: querySparseVector,
  topK: 10,
  alpha: 0.5 // 0 = pure sparse, 1 = pure dense, 0.5 = balanced
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

## Further Reading

- [Pinecone: Understanding Hybrid Search](https://docs.pinecone.io/guides/data/understanding-hybrid-search)
- [Pinecone: Hybrid Search Quickstart](https://docs.pinecone.io/guides/search/hybrid-search)
- [BM25 Algorithm](https://en.wikipedia.org/wiki/Okapi_BM25)
