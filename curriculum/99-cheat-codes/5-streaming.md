# Streaming

Stream LLM responses to the client in real-time.

---

## Server: Create Stream

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
```

---

## Client: Consume Stream (React)

```typescript
import { useChat } from '@ai-sdk/react';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
    });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

---

## Stream with Tools

```typescript
const result = streamText({
  model: openai('gpt-4o'),
  tools: {
    searchDocs: tool({
      description: 'Search documentation',
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => await search(query),
    }),
  },
  toolChoice: 'auto',
  maxSteps: 5,
  messages,
});

return result.toDataStreamResponse();
```

---

## Manual Stream Consumption

```typescript
const result = await streamText({
  model: openai('gpt-4o'),
  prompt: 'Write a story',
});

// Iterate over text chunks
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

---

## Stream Object Generation

```typescript
import { streamObject } from 'ai';

const result = await streamObject({
  model: openai('gpt-4o'),
  schema: z.object({
    title: z.string(),
    sections: z.array(z.object({
      heading: z.string(),
      content: z.string(),
    })),
  }),
  prompt: 'Generate an article about...',
});

for await (const partialObject of result.partialObjectStream) {
  console.log(partialObject);
}
```
