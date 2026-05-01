# AI Agent Cheat Codes

Copy-paste snippets for common AI patterns. No fluff, just code.

---

## Quick Navigation

| Topic | What's Inside |
|-------|---------------|
| Embeddings & Search | OpenAI embeddings, Pinecone setup, vector queries, reranking |
| Structured Outputs | AI SDK, OpenAI SDK, Gemini, common schemas |
| Tool Calling | Tool definitions, RAG as a tool, preventing loops |
| Chunking | Sentence chunking, metadata, markdown-aware |
| Streaming | Server streams, React client, streaming objects |
| Human-in-the-Loop | Approval flows, pending actions, destructive ops |
| Router Agent | Query routing, agent registry, multi-agent |
| LangGraph | State, nodes, conditional edges, memory |
| Prompt Templates | RAG, routing, classification, extraction |

---

## Common Gotchas

### 1. Always filter null from vector search

```typescript
// Bad
const docs = results.matches.map(m => m.metadata?.text);

// Good
const docs = results.matches
  .map(m => m.metadata?.text)
  .filter(Boolean) as string[];
```

### 2. Handle empty search results

```typescript
if (documents.length === 0) {
  return "I couldn't find relevant information. Could you rephrase?";
}
```

### 3. Set tool call limits

```typescript
streamText({
  maxSteps: 5, // Prevent infinite tool loops
  // ...
});
```

### 4. Validate structured outputs

```typescript
try {
  const result = schema.parse(response);
} catch (error) {
  return fallbackBehavior();
}
```

### 5. Use appropriate chunk sizes

```typescript
// Too small = lost context
// Too large = irrelevant noise
const CHUNK_SIZE = 500; // Good starting point
const OVERLAP = 50; // Prevent cut-off sentences
```

---

## Full RAG Pipeline (Quick Copy)

```typescript
// 1. Embed query
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: query,
  dimensions: 512,
});

// 2. Search (over-fetch for reranking)
const results = await index.query({
  vector: embedding.data[0].embedding,
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

// 6. Generate response
const response = await streamText({
  model: openai('gpt-4o'),
  system: `Answer based on this context:\n\n${context}`,
  messages,
});
```
