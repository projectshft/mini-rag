# Embeddings & Vector Search

---

## Embeddings

Convert text to vectors for semantic search.

### OpenAI Embeddings

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

// Single text
const response = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'How do I use React hooks?',
  dimensions: 512,
});

const embedding = response.data[0].embedding;
```

### Batch Embeddings

```typescript
const texts = ['doc 1', 'doc 2', 'doc 3'];

const response = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: texts,
  dimensions: 512,
});

const embeddings = response.data.map(d => d.embedding);
```

---

## Vector Search (Pinecone)

### Setup

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX!);
```

### Upsert

```typescript
await index.upsert([
  {
    id: 'doc-1',
    values: embedding,
    metadata: {
      text: 'Document content here...',
      source: 'react-docs',
    },
  },
]);
```

### Query

```typescript
const results = await index.query({
  vector: queryEmbedding,
  topK: 10,
  includeMetadata: true,
});

const documents = results.matches
  .map(match => match.metadata?.text)
  .filter(Boolean) as string[];
```

### With Namespace

```typescript
// Upsert to namespace
await index.namespace('linkedin-posts').upsert(vectors);

// Query namespace
const results = await index.namespace('linkedin-posts').query({
  vector: embedding,
  topK: 5,
});
```

---

## Reranking

Re-order search results by relevance.

### Pinecone Reranking

```typescript
const reranked = await pinecone.inference.rerank({
  model: 'bge-reranker-v2-m3',
  query: userQuery,
  documents: documents,
  topK: 5,
  returnDocuments: true,
});

const topDocs = reranked.data
  .map(result => result.document?.text)
  .filter(Boolean);
```

### Cohere Reranking

```typescript
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

const reranked = await cohere.rerank({
  model: 'rerank-english-v3.0',
  query: userQuery,
  documents: documents,
  topN: 5,
  returnDocuments: true,
});

const topDocs = reranked.results.map(r => r.document?.text);
```

---

## Full RAG Pipeline

```typescript
// 1. Embed query
const embeddingResponse = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: query,
  dimensions: 512,
});
const embedding = embeddingResponse.data[0].embedding;

// 2. Search (over-fetch for reranking)
const results = await index.query({
  vector: embedding,
  topK: 20,
  includeMetadata: true,
});

// 3. Extract documents
const docs = results.matches
  .map(m => m.metadata?.text)
  .filter(Boolean) as string[];

// 4. Rerank
const reranked = await pinecone.inference.rerank({
  model: 'bge-reranker-v2-m3',
  query,
  documents: docs,
  topK: 5,
  returnDocuments: true,
});

// 5. Build context
const context = reranked.data
  .map(r => r.document?.text)
  .join('\n\n');
```
