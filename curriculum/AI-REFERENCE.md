# AI Assistant Guide for RAG & Agent Development

This file helps AI assistants (Claude, ChatGPT, Cursor, Copilot) write modern, production-quality RAG systems and agents using TypeScript.

**Why this exists:** Much of this material is new enough that AI tools haven't caught up. They often suggest outdated syntax, deprecated libraries, or patterns that don't match current best practices. This guide ensures you get correct, modern code.

**How to use:** Add this file to your project as `CLAUDE.md` or include it in your AI tool's context. Share with your team to boost productivity.

---

## Stack & Libraries

When building RAG systems and agents, use these libraries:

| Purpose | Library | Import |
|---------|---------|--------|
| LLM calls + streaming | `ai` (Vercel AI SDK) | `import { streamText, generateObject, tool } from 'ai'` |
| OpenAI provider | `@ai-sdk/openai` | `import { openai } from '@ai-sdk/openai'` |
| Schema validation | `zod` | `import { z } from 'zod'` |
| Vector database | `@pinecone-database/pinecone` | `import { Pinecone } from '@pinecone-database/pinecone'` |
| Embeddings | `openai` | `import OpenAI from 'openai'` |

**Do NOT use:**
- LangChain for simple RAG (overcomplicated)
- `openai` SDK for chat completions (use AI SDK instead)
- Manual JSON parsing for structured outputs (use Zod schemas)

---

## Structured Outputs (Critical)

Always use Zod schemas with `generateObject` for structured LLM outputs. Never parse JSON manually.

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const schema = z.object({
  agent: z.enum(['rag', 'linkedin', 'general']),
  query: z.string(),
  confidence: z.number().min(0).max(1),
});

const result = await generateObject({
  model: openai('gpt-4o-mini'),
  schema,
  prompt: `Route this query: "${userQuery}"`,
});

// result.object is fully typed
```

**Key points:**
- Use `generateObject` not `chat.completions.create`
- Schema is enforced by the model, not post-hoc parsing
- Always use `.describe()` on fields to guide the model

---

## Streaming Responses

Use AI SDK's `streamText` for all streaming responses:

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = streamText({
  model: openai('gpt-4o'),
  system: 'You are a helpful assistant.',
  messages,
});

return result.toDataStreamResponse();
```

**For React clients:**
```typescript
import { useChat } from '@ai-sdk/react';

const { messages, input, handleSubmit } = useChat({ api: '/api/chat' });
```

---

## RAG Pipeline Pattern

The correct RAG flow:

1. **Embed query** using OpenAI embeddings
2. **Over-fetch** from vector DB (get more than you need)
3. **Filter nulls** from results
4. **Rerank** using Pinecone or Cohere
5. **Build context** from top results
6. **Stream response** with context

```typescript
// 1. Embed
const embedding = await openaiClient.embeddings.create({
  model: 'text-embedding-3-small',
  input: query,
  dimensions: 512,
});

// 2. Over-fetch (get 20, keep 5)
const results = await index.query({
  vector: embedding.data[0].embedding,
  topK: 20,
  includeMetadata: true,
});

// 3. Filter nulls (CRITICAL - always do this)
const docs = results.matches
  .map(m => m.metadata?.text)
  .filter(Boolean) as string[];

// 4. Rerank
const reranked = await pinecone.inference.rerank(
  'bge-reranker-v2-m3',
  query,
  docs,
  { topN: 5, returnDocuments: true }
);

// 5. Build context
const context = reranked.data
  .map(r => r.document?.text)
  .filter(Boolean)
  .join('\n\n');

// 6. Stream
return streamText({
  model: openai('gpt-4o'),
  system: `Answer based on this context:\n\n${context}`,
  messages,
});
```

---

## Tool Calling

Use AI SDK's `tool` helper for tool definitions:

```typescript
import { streamText, tool } from 'ai';
import { z } from 'zod';

const result = await streamText({
  model: openai('gpt-4o'),
  toolChoice: 'auto',
  maxSteps: 5, // CRITICAL: prevents infinite loops
  tools: {
    searchDocs: tool({
      description: 'Search documentation for technical questions',
      parameters: z.object({
        query: z.string().describe('The search query'),
      }),
      execute: async ({ query }) => {
        // RAG pipeline here
        return context;
      },
    }),
  },
  messages,
});
```

**Key points:**
- Always set `maxSteps` to prevent infinite tool loops
- Use descriptive `description` fields
- Use `.describe()` on parameters

---

## Agent Router Pattern

Route queries to specialized agents using structured outputs:

```typescript
const routingSchema = z.object({
  agent: z.enum(['rag', 'linkedin', 'general']),
  refinedQuery: z.string().describe('Query optimized for the selected agent'),
});

const routing = await generateObject({
  model: openai('gpt-4o-mini'), // Fast model for routing
  schema: routingSchema,
  prompt: `Route this query to the best agent:

Query: "${query}"

Agents:
- rag: Technical documentation questions
- linkedin: Professional content creation
- general: General conversation`,
});

// Execute the selected agent
const agent = agentRegistry[routing.object.agent];
return agent(routing.object.refinedQuery);
```

---

## Common Mistakes to Avoid

### 1. Not filtering nulls from vector search
```typescript
// WRONG
const docs = results.matches.map(m => m.metadata?.text);

// CORRECT
const docs = results.matches
  .map(m => m.metadata?.text)
  .filter(Boolean) as string[];
```

### 2. Not setting maxSteps for tools
```typescript
// WRONG - can loop forever
streamText({ tools, messages });

// CORRECT
streamText({ tools, maxSteps: 5, messages });
```

### 3. Using wrong embedding dimensions
```typescript
// CORRECT - match your index dimensions
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: query,
  dimensions: 512, // Must match Pinecone index
});
```

### 4. Not handling empty results
```typescript
if (docs.length === 0) {
  return "I couldn't find relevant information. Could you rephrase?";
}
```

---

## Documentation References

For deeper understanding, refer to:

| Topic | Documentation |
|-------|--------------|
| AI SDK | https://sdk.vercel.ai/docs |
| Structured outputs | https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data |
| Tool calling | https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling |
| Streaming | https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#streaming-text |
| Pinecone | https://docs.pinecone.io |
| Reranking | https://docs.pinecone.io/guides/inference/rerank |
| OpenAI embeddings | https://platform.openai.com/docs/guides/embeddings |

---

## Quick Patterns

### Chunking text
```typescript
const CHUNK_SIZE = 500;
const OVERLAP = 50;
// Split by sentences, group to chunk size, overlap for context
```

### Human-in-the-loop
```typescript
// Store pending action with expiry
// Return AWAITING_APPROVAL response
// Handle approval/rejection in separate endpoint
```

### Multi-agent routing
```typescript
// Use structured output to select agent
// Registry pattern: Record<AgentType, AgentHandler>
// Each agent returns StreamTextResult
```

---

## Model Selection

| Task | Model | Why |
|------|-------|-----|
| Routing/classification | `gpt-4o-mini` | Fast, cheap, good at classification |
| RAG synthesis | `gpt-4o` | Better reasoning for complex queries |
| Embeddings | `text-embedding-3-small` | Good quality, cost effective |
| Reranking | `bge-reranker-v2-m3` | Best open reranker |

---

## Environment Variables

```bash
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=your-index-name
```

Always validate env vars exist at startup, not at request time.
