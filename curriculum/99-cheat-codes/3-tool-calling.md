# Tool Calling

Let the LLM decide when to use tools.

---

## Basic Tool Definition

```typescript
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = await streamText({
  model: openai('gpt-4o'),
  toolChoice: 'auto',
  maxSteps: 5,
  tools: {
    searchDocs: tool({
      description: 'Search documentation for technical questions',
      parameters: z.object({
        query: z.string().describe('Search query'),
      }),
      execute: async ({ query }) => {
        const results = await searchPinecone(query);
        return results;
      },
    }),
  },
  messages,
});
```

---

## Multiple Tools

```typescript
tools: {
  searchDocs: tool({
    description: 'Search technical documentation',
    parameters: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => await searchDocs(query),
  }),

  searchExamples: tool({
    description: 'Search code examples and tutorials',
    parameters: z.object({
      query: z.string(),
      language: z.enum(['typescript', 'python', 'go']).optional(),
    }),
    execute: async ({ query, language }) => await searchExamples(query, language),
  }),

  getWeather: tool({
    description: 'Get current weather for a location',
    parameters: z.object({
      city: z.string(),
    }),
    execute: async ({ city }) => await fetchWeather(city),
  }),
}
```

---

## Tool Choice Options

```typescript
// Let AI decide (recommended)
toolChoice: 'auto'

// Must use a tool
toolChoice: 'required'

// Cannot use tools
toolChoice: 'none'

// Force specific tool
toolChoice: { type: 'tool', toolName: 'searchDocs' }
```

---

## RAG as a Tool

```typescript
tools: {
  search_documentation: tool({
    description: 'Search React docs for technical questions. Use when users ask about hooks, components, or APIs.',
    parameters: z.object({
      query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
      // 1. Embed
      const embedding = await getEmbedding(query);

      // 2. Search
      const results = await index.query({
        vector: embedding,
        topK: 10,
        includeMetadata: true,
      });

      // 3. Extract
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

      // 5. Return context
      return reranked.data
        .map(r => r.document?.text)
        .join('\n\n');
    },
  }),
}
```

---

## Prevent Infinite Loops

```typescript
streamText({
  maxSteps: 5, // Stop after 5 tool calls
  // ...
});
```

```typescript
import { stepCountIs } from 'ai';

streamText({
  stopWhen: stepCountIs(10),
  // ...
});
```
