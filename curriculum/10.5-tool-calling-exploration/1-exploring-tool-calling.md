# Exploring Tool-Calling Patterns

You've built agents with fixed workflows (RAG agent) and stateful graphs (LangGraph). Now let's explore **tool-calling** - where the AI decides when and how to use tools.

**Important:** This module is exploratory. You'll implement tool-calling in a separate file to experiment without modifying your existing agents. We'll switch back to the workflow approach afterward, but understanding tool-calling is valuable for your toolkit.

---

## What You'll Learn

This module covers:
- How tool-calling differs from workflows
- When to use each approach
- Implementing tools with the AI SDK
- Building an agent that decides when to retrieve context
- Trade-offs between patterns

---

## Three Approaches to RAG

Let's compare three ways to build RAG agents:

### Approach 1: Fixed Workflow (Your Current RAG Agent)

```typescript
export async function ragAgent(request: AgentRequest) {
  // Always executes these steps for every query
  const embedding = await generateEmbedding(request.query);
  const results = await searchVectorDB(embedding);
  const reranked = await rerank(results);
  return streamText({ context: reranked });
}
```

**Flow:**
```
Query → Embed → Search → Rerank → Generate → Done
(Always runs, every time)
```

**Characteristics:**
- ✅ Simple and predictable
- ✅ Fast (no decision overhead)
- ✅ Lower cost per request
- ❌ Wastes resources on simple queries ("Thanks!" still searches)
- ❌ Can't skip or branch logic

---

### Approach 2: Tool-Calling (This Module)

```typescript
export async function ragAgent(request: AgentRequest) {
  return streamText({
    model: openai('gpt-4o'),
    tools: {
      search_documentation: tool({
        execute: async ({ query }) => {
          // RAG workflow only runs when AI calls this tool
          const embedding = await generateEmbedding(query);
          const results = await searchVectorDB(embedding);
          return rerank(results);
        }
      })
    }
  });
}
```

**Flow:**
```
Query → AI Decides
         ↓
    Need Context? ──Yes──→ Call Tool → Generate
         ↓
        No → Generate Directly
(AI decides whether to search)
```

**Characteristics:**
- ✅ AI decides when to retrieve context
- ✅ Can skip search for simple queries
- ✅ More intelligent routing
- ⚠️ Extra LLM call for decision (higher cost)
- ⚠️ Less predictable

---

### Approach 3: LangGraph (Previous Module)

```typescript
const graph = new StateGraph(State)
  .addNode("analyze", analyzeNode)
  .addConditionalEdges("analyze", decideNext)
  .addNode("search", searchNode)
  .compile();
```

**Flow:**
```
Query → Analyze → Route
         ↓          ↓
    Complex ──→ Search → Evaluate → Loop?
         ↓
    Simple ──→ Answer Directly
(Explicit graph-based routing)
```

**Characteristics:**
- ✅ Full control over workflow
- ✅ Can loop and refine
- ✅ Stateful across sessions
- ⚠️ More complex to build
- ⚠️ Steeper learning curve

---

## When to Use Each Approach

### Use Fixed Workflow When:

✅ **Every query needs the same process**
- Customer support (always search knowledge base)
- Documentation Q&A (always retrieve docs)
- FAQ chatbot (always match against FAQs)

✅ **Cost-sensitive applications**
- Avoid extra LLM calls to decide
- Predictable pricing

✅ **Deterministic behavior required**
- Regulatory compliance
- Audit requirements

**Example:** Medical Q&A where every answer must be grounded in documentation.

---

### Use Tool-Calling When:

✅ **Query-dependent logic**
- Some queries need context, others don't
- Multi-capability agents

✅ **Interactive conversations**
- Mix of casual chat and technical questions
- AI needs to decide when to look things up

✅ **Cost optimization**
- Skip expensive searches for simple queries
- Intelligent resource allocation

**Example:** Conversational assistant that chats casually but can search docs when needed.

---

### Use LangGraph When:

✅ **Complex orchestration needs**
- Branching, looping, multi-step workflows
- Need to refine and iterate

✅ **Production-grade reliability**
- Fault tolerance and recovery
- Human-in-the-loop workflows

✅ **Stateful, long-running processes**
- Conversations spanning multiple sessions
- Background workflows

**Example:** Research assistant that iterates over multiple searches and synthesizes findings.

---

## Cost Comparison

Let's compare costs for 100 queries:
- 50 queries need context ("How do I use hooks?")
- 50 queries don't need context ("Thanks!", "Hello")

### Fixed Workflow

```
100 queries × (embedding + search + rerank + generation)
= 100 × $0.025
= $2.50

Waste: 50 unnecessary retrievals = $1.25 wasted
```

### Tool-Calling

```
100 queries × decision = 100 × $0.002 = $0.20
50 queries × (embedding + search + rerank + generation) = 50 × $0.025 = $1.25
Total = $1.45

Savings: $1.05 (42% cheaper)
```

### LangGraph

```
100 queries × analysis = 100 × $0.003 = $0.30
50 queries × (search + evaluation) = 50 × $0.027 = $1.35
Total = $1.65

More expensive than tool-calling, but adds:
- Iteration loops
- State persistence
- Fault tolerance
```

---

## Real-World Scenarios

### Scenario 1: "How do I use useState?"

**Fixed Workflow:**
```
✅ Embeds query
✅ Searches docs (NEEDED)
✅ Reranks results
✅ Generates with context
Cost: $0.025
Quality: Excellent
```

**Tool-Calling:**
```
✅ AI decides to call search tool
✅ Embeds query
✅ Searches docs (NEEDED)
✅ Reranks results
✅ Generates with context
Cost: $0.027 (+$0.002 for decision)
Quality: Excellent
```

**Winner:** Fixed workflow (slightly cheaper, same quality)

---

### Scenario 2: "Thanks for the help!"

**Fixed Workflow:**
```
❌ Embeds query (WASTED)
❌ Searches docs for "thanks help" (WASTED)
❌ Reranks irrelevant results (WASTED)
⚠️ Generates with confusing context
Cost: $0.025 (all wasted)
Quality: Poor (context pollutes response)
```

**Tool-Calling:**
```
✅ AI decides NOT to call tool
✅ Generates friendly response directly
Cost: $0.005 (just generation)
Quality: Excellent
```

**Winner:** Tool-calling (80% cheaper, better quality)

---

## Implementation: Tool-Calling RAG

You'll create a separate route: `app/api/tool-calling-agent/route.ts`

This keeps your existing RAG agent intact while letting you explore tool-calling patterns.

---

## Step 1: Understanding the Tool Definition

The AI SDK provides a `tool` function to define callable tools:

```typescript
import { tool } from 'ai';
import { z } from 'zod';

const myTool = tool({
  // Description helps AI decide when to use this tool
  description: 'Search React documentation for relevant information',

  // Schema validates inputs using Zod
  parameters: z.object({
    query: z.string().describe('The search query'),
  }),

  // Execute function runs when AI calls the tool
  execute: async ({ query }) => {
    const results = await searchDocs(query);
    return results;
  }
});
```

**Key Components:**
- `description`: Tell the AI when to use this tool
- `parameters`: Define and validate inputs with Zod
- `execute`: The function that runs when called

---

## Step 2: Implementing search_documentation Tool

Your RAG workflow becomes a tool:

```typescript
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';

const searchDocsTool = tool({
  description: 'Search React documentation for technical information about hooks, components, and APIs. Use when users ask programming questions.',

  parameters: z.object({
    query: z.string().describe('The technical query to search for'),
  }),

  execute: async ({ query }) => {
    console.log('🔧 Tool called for:', query);

    // Step 1: Generate embedding
    const embeddingResponse = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Step 2: Search Pinecone
    const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
    const queryResponse = await index.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });

    // Step 3: Extract documents
    const documents = queryResponse.matches
      .map((match) => match.metadata?.text)
      .filter(Boolean) as string[];

    // Step 4: Rerank
    const reranked = await pineconeClient.inference.rerank({
      model: 'bge-reranker-v2-m3',
      query: query,
      documents: documents,
      topK: 5,
      returnDocuments: true,
    });

    // Step 5: Return context
    const context = reranked.data
      .map((result) => result.document?.text)
      .filter(Boolean)
      .join('\n\n');

    console.log('📊 Retrieved', reranked.data.length, 'documents');

    return context;
  },
});
```

---

## Step 3: Building the Agent with Tools

```typescript
export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    tools: {
      search_documentation: searchDocsTool,
    },
    toolChoice: 'auto', // Let AI decide
    maxSteps: 5, // Prevent infinite loops
    system: `You are a helpful assistant that answers questions about React.

When users ask technical questions about React (hooks, components, APIs), use the search_documentation tool to find relevant information.

For general conversation (greetings, thanks, clarifications), respond directly without using tools.`,
    messages,
  });

  return result.toDataStreamResponse();
}
```

**Key Parameters:**
- `toolChoice: 'auto'`: AI decides when to use tools
- `maxSteps: 5`: Prevents infinite tool-calling loops
- System prompt: Guides when to use tools

---

## Step 4: Understanding Tool Choice Options

```typescript
toolChoice: 'auto'    // AI decides (recommended)
toolChoice: 'required' // Must use a tool
toolChoice: 'none'     // Cannot use tools
toolChoice: { type: 'tool', toolName: 'search_documentation' } // Force specific tool
```

**When to use each:**
- `'auto'`: Most common - let AI decide
- `'required'`: Ensure tool is always called (similar to fixed workflow)
- `'none'`: Disable tools for specific requests
- Specific tool: Force a particular tool (rarely needed)

---

## Step 5: Testing Your Implementation

### Test 1: Simple Query (Should NOT Call Tool)

```bash
curl -X POST http://localhost:3000/api/tool-calling-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Thanks for your help!"}
    ]
  }'
```

**Expected Console Output:**
```
(No tool logs - AI responds directly)
```

---

### Test 2: Technical Query (Should Call Tool)

```bash
curl -X POST http://localhost:3000/api/tool-calling-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I use the useEffect hook?"}
    ]
  }'
```

**Expected Console Output:**
```
🔧 Tool called for: How do I use the useEffect hook?
📊 Retrieved 5 documents
```

---

## Step 6: Observing Tool Execution

Add detailed logging to understand tool behavior:

```typescript
execute: async ({ query }) => {
  console.log('\n=== TOOL EXECUTION START ===');
  console.log('Query:', query);

  const startTime = Date.now();

  // Your RAG workflow...
  const context = await performRAG(query);

  const duration = Date.now() - startTime;

  console.log('Duration:', duration, 'ms');
  console.log('Context length:', context.length, 'chars');
  console.log('=== TOOL EXECUTION END ===\n');

  return context;
}
```

This helps you understand:
- When tools are called
- What queries trigger them
- How long they take
- How much context they return

---

## Advanced: Multiple Tools

Give your agent multiple capabilities:

```typescript
const result = streamText({
  model: openai('gpt-4o'),
  tools: {
    search_documentation: tool({
      description: 'Search technical documentation',
      execute: async ({ query }) => {
        return await searchDocs(query);
      }
    }),
    search_examples: tool({
      description: 'Search code examples and tutorials',
      execute: async ({ query }) => {
        return await searchExamples(query);
      }
    }),
    get_package_info: tool({
      description: 'Get information about npm packages',
      execute: async ({ packageName }) => {
        return await fetchPackageInfo(packageName);
      }
    })
  }
});
```

**The AI will:**
- Choose the most appropriate tool
- Call multiple tools if needed
- Combine results intelligently

---

## Comparing Implementations

### Your Original RAG Agent

```typescript
// app/agents/rag.ts
export async function ragAgent(request: AgentRequest) {
  // Workflow always executes
  const embedding = await generateEmbedding(request.query);
  const results = await searchPinecone(embedding);
  const reranked = await rerank(results);

  return streamText({
    model: openai('gpt-4o'),
    system: `Context: ${reranked}`,
    messages: request.messages,
  });
}
```

**Characteristics:** Always searches, predictable, simple

---

### Tool-Calling Agent

```typescript
// app/api/tool-calling-agent/route.ts
export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  return streamText({
    model: openai('gpt-4o'),
    tools: {
      search_documentation: tool({
        execute: async ({ query }) => {
          // Workflow only runs when AI calls it
          const embedding = await generateEmbedding(query);
          const results = await searchPinecone(embedding);
          return rerank(results);
        }
      })
    },
    messages,
  }).toDataStreamResponse();
}
```

**Characteristics:** AI decides when to search, intelligent, flexible

---

## Why We're Not Using This Going Forward

Tool-calling is powerful, but for this curriculum we're sticking with workflows because:

1. **Simpler to understand:** Fixed workflows are more predictable
2. **Easier to debug:** You know exactly what runs when
3. **Cost-effective for learning:** Not spending on decision overhead
4. **Curriculum focus:** Teaching RAG fundamentals, not tool orchestration

**However, in production:**
- Tool-calling is often better for conversational agents
- LangGraph is better for complex multi-step workflows
- Fixed workflows are better for single-purpose agents

---

## Your Challenge

Create `app/api/tool-calling-agent/route.ts` implementing:

1. A `search_documentation` tool with your RAG workflow
2. A `toolChoice: 'auto'` configuration
3. A system prompt instructing when to use tools
4. Proper error handling

Test with:
- Simple queries (shouldn't call tool)
- Technical queries (should call tool)
- Mixed conversations

Compare behavior and costs to your original RAG agent.

---

## What You Learned

✅ Three approaches to RAG: workflows, tool-calling, LangGraph
✅ When to use each approach
✅ How to implement tools with the AI SDK
✅ Tool choice strategies and their trade-offs
✅ Cost implications of different patterns
✅ Debugging and observing tool execution

---

## What's Next

After exploring tool-calling:
- **Return to your original RAG agent** (we won't use tool-calling in the main app)
- **Chat Interface:** Connect your agents to the UI
- **Observability:** Track agent performance
- **Testing:** Write tests for your agents

Understanding these patterns prepares you for:
- Building production agents
- Choosing the right architecture
- Optimizing costs and performance

---

## Additional Resources

- [AI SDK Tools Documentation](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- [Tool-calling vs Workflows (Anthropic)](https://www.anthropic.com/engineering/building-effective-agents)
- [Production Tool-calling Patterns](https://sdk.vercel.ai/docs/guides/multi-step-tools)
