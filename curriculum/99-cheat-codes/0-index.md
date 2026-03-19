# AI Agent Cheat Codes

Copy-paste snippets for common AI patterns. No fluff, just code.

---

## Quick Navigation

| Topic | File | What's Inside |
|-------|------|---------------|
| Embeddings & Search | [1-embeddings-and-search.md](./1-embeddings-and-search.md) | OpenAI embeddings, Pinecone setup, vector queries, reranking |
| Structured Outputs | [2-structured-outputs.md](./2-structured-outputs.md) | AI SDK, OpenAI SDK, Gemini, common schemas |
| Tool Calling | [3-tool-calling.md](./3-tool-calling.md) | Tool definitions, RAG as a tool, preventing loops |
| Chunking | [4-chunking.md](./4-chunking.md) | Sentence chunking, metadata, markdown-aware |
| Streaming | [5-streaming.md](./5-streaming.md) | Server streams, React client, streaming objects |
| Human-in-the-Loop | [6-human-in-the-loop.md](./6-human-in-the-loop.md) | Approval flows, pending actions, destructive ops |
| Router Agent | [7-router-agent.md](./7-router-agent.md) | Query routing, agent registry, multi-agent |
| LangGraph | [8-langgraph.md](./8-langgraph.md) | State, nodes, conditional edges, memory |
| Prompt Templates | [9-prompt-templates.md](./9-prompt-templates.md) | RAG, routing, classification, extraction |

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
