# Implementing the RAG Agent

Now let's implement the RAG agent that retrieves context from your documents and feeds it to the LLM for grounded answers.

---

## Video Walkthrough

Watch this guide to implementing the RAG agent:

<iframe src="https://share.descript.com/embed/9skzqf8Bpwv" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Build

A working RAG agent that:
- Generates embeddings for user queries
- Retrieves relevant context from Pinecone
- Builds context-aware prompts
- Streams responses with document-grounded answers

---

## The RAG Pipeline

Located at: `app/agents/rag.ts`

```typescript
export async function ragAgent(request: AgentRequest): Promise<AgentResponse> {
  // Step 1: Turn question into embedding
  // Step 2: Search Pinecone for similar content
  // Step 3: Extract text from results
  // Step 4: Build prompt with context
  // Step 5: Stream LLM response
}
```

---

## Your Challenge

Open `app/agents/rag.ts` and implement the five TODO steps.

### Step 1: Generate Embedding for the Query

Convert the user's query into a vector embedding using the same model used for documents:

```typescript
const embeddingResponse = await openaiClient.embeddings.create({
  model: 'text-embedding-3-small',
  input: request.query,
});

const embedding = embeddingResponse.data[0].embedding;
```

---

### Step 2: Query Pinecone for Similar Documents

Search Pinecone for the most relevant document chunks:

```typescript
const index = pineconeClient.Index(process.env.PINECONE_INDEX as string);

const queryResponse = await index.query({
  vector: embedding,
  topK: 5,
  includeMetadata: true,
});
```

---

### Step 3: Extract Text Content from Results

Extract the text from retrieved documents:

```typescript
const retrievedContext = queryResponse.matches
  .map((match) => match.metadata?.text)
  .filter(Boolean)
  .join('\n\n');
```

---

### Step 4: Build the System Prompt with Context

Create a system prompt that grounds the LLM in your retrieved context:

```typescript
const systemPrompt = `You are a helpful assistant that answers questions based on the provided context.

Original User Request: "${request.originalQuery}"

Refined Query: "${request.query}"

Context from documentation:
${retrievedContext}

Use the context above to answer the user's question. If the context doesn't contain enough information, say so clearly.`;
```

---

### Step 5: Stream the Response

Stream the LLM response with the context-aware prompt:

```typescript
return streamText({
  model: openai('gpt-4o'),
  system: systemPrompt,
  prompt: `Context: ${retrievedContext}\n\nUser Query: ${request.query}`,
});
```

---

## Testing Your RAG Agent

### Through the API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I use useState?"}
    ],
    "agent": "rag",
    "query": "How to use useState hook in React"
  }'
```

### Check Retrieved Context

Add a console.log to see what was retrieved:

```typescript
console.log('Retrieved context:', retrievedContext);
console.log('Number of matches:', queryResponse.matches.length);
```

---

## Reference Solution

<details>
<summary>⚠️ Only look at this after attempting the exercise! Click to reveal.</summary>

```typescript
// TODO: Students should implement app/agents/rag.ts themselves!
// This is provided only as a reference after attempting.

export async function ragAgent(request: AgentRequest): Promise<AgentResponse> {
  // Step 1: Generate embedding
  const embeddingResponse = await openaiClient.embeddings.create({
    model: 'text-embedding-3-small',
    input: request.query,
  });
  const embedding = embeddingResponse.data[0].embedding;

  // Step 2: Query Pinecone
  const index = pineconeClient.Index(process.env.PINECONE_INDEX as string);
  const queryResponse = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  // Step 3: Extract context
  const retrievedContext = queryResponse.matches
    .map((match) => match.metadata?.text)
    .filter(Boolean)
    .join('\n\n');

  // Step 4: Build prompt
  const systemPrompt = `You are a helpful assistant answering based on context.

Original: "${request.originalQuery}"
Refined: "${request.query}"

Context: ${retrievedContext}

Answer using the context. If insufficient, say so.`;

  // Step 5: Stream response
  return streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    prompt: `Context: ${retrievedContext}\n\nQuery: ${request.query}`,
  });
}
```

</details>

---

## What You Learned

✅ How to generate embeddings for queries
✅ How to perform semantic search with Pinecone
✅ How to build context-aware prompts
✅ How to stream responses with retrieved context

---

## What's Next?

Next, you'll learn about **re-ranking** - a technique to improve retrieval quality by intelligently filtering results.

---

## Assignment 2: Retrieval Quality + Query Preprocessing

Now apply what you've learned about RAG to improve retrieval quality.

### Video Assignment (3-4 minutes)

Explain how you evaluate retrieval quality. Address these questions:

1. **Chunk sizing** - How do you know if your chunks are too big or too small? What symptoms would you see?
2. **Retrieval accuracy** - How do you know if you're retrieving the right content? What would "wrong" look like?
3. **Similarity thresholds** - How do you decide what score is "good enough"? What happens if it's too high or too low?
4. **Metrics** - What would you track in production to monitor retrieval quality?

Give specific examples from your implementation.

### Code Assignment

**Complete the TODOs** in the RAG agent to make it work, then **extend it** with query preprocessing:

**Files:**
- `app/agents/rag.ts`

**Extension - Add query preprocessing:**
- Expand common abbreviations (e.g., "JS" → "JavaScript", "DB" → "database")
- Normalize casing for technical terms
- Handle common typos with fuzzy matching (optional)
- Strip filler words that don't help retrieval ("um", "like", "basically")

**What "done" looks like:**
- RAG agent retrieves relevant context and generates answers
- Query preprocessing improves retrieval for messy/casual queries
- You can demonstrate the before/after of preprocessing

### Submit Your Work

- [Video Submission](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission](https://form.typeform.com/to/EWWcsorL)
