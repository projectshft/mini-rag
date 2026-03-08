# Building a LangGraph Agent

Now let's build a practical LangGraph agent. You'll create an API route that demonstrates stateful workflows, decision-making, and tool calling.

---

## What You'll Build

A **Research Assistant Agent** that:
- Analyzes queries to determine if research is needed
- Searches documentation when necessary
- Refines results through multiple iterations
- Maintains conversation state
- Can pause and resume workflows

**Key Difference from Your Current Agents:**
- Your RAG agent: Always searches, fixed workflow
- This LangGraph agent: Decides when to search, can loop and refine

---

## The Agent Architecture

```
User Query
    ↓
┌─────────────┐
│  Analyze    │ ← Determines intent
│  Query      │   and next action
└─────────────┘
    ↓
    ├──→ Simple question? → Generate Answer → End
    ├──→ Needs research? → Search Docs → Evaluate Results
    │                           ↓
    │                    Good enough? ──No──→ Refine & Search Again
    │                           ↓
    │                         Yes
    │                           ↓
    └─────────────────────→ Generate Answer → End
```

---

## Implementation Overview

We'll create: `app/api/langgraph-agent/route.ts`

**Why a separate route?**
- Demonstrates LangGraph patterns without modifying existing code
- Students can compare approaches side-by-side
- No UI needed - focus on agent logic

---

## Step 1: Install Dependencies

LangGraph is already in your project, but let's verify:

```bash
yarn add @langchain/langgraph @langchain/langgraph-checkpoint-sqlite
```

---

## Step 2: Define the State

Create the agent's state schema with all data it needs to track:

```typescript
import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

// Define what data flows through the graph
const AgentState = Annotation.Root({
  // Conversation history
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right), // Append new messages
  }),

  // User's original query
  query: Annotation<string>(),

  // Analysis results
  needsResearch: Annotation<boolean>(),
  queryType: Annotation<"simple" | "technical" | "complex">(),

  // Research results
  searchResults: Annotation<string[]>(),
  searchIterations: Annotation<number>(),

  // Quality tracking
  confidence: Annotation<number>(),

  // Final output
  answer: Annotation<string>(),
});

type StateType = typeof AgentState.State;
```

**Key Concepts:**
- `Annotation`: Defines state fields with types
- `reducer`: Defines how to merge updates (e.g., append vs replace)
- State flows through every node

---

## Step 3: Create the Analysis Node

This node analyzes the query and decides what to do:

```typescript
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

async function analyzeQueryNode(state: StateType) {
  console.log('📊 Analyzing query:', state.query);

  // Use structured outputs to analyze intent
  const analysis = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      needsResearch: z.boolean(),
      queryType: z.enum(["simple", "technical", "complex"]),
      confidence: z.number().min(0).max(1),
      reasoning: z.string()
    }),
    prompt: `Analyze this query and determine if it needs research:

Query: "${state.query}"

Consider:
- Simple questions (greetings, thanks) don't need research
- Technical questions need documentation lookup
- Complex questions might need multiple searches

Provide your analysis.`
  });

  console.log('✅ Analysis:', analysis.object);

  return {
    needsResearch: analysis.object.needsResearch,
    queryType: analysis.object.queryType,
    confidence: analysis.object.confidence,
    searchIterations: 0
  };
}
```

---

## Step 4: Create the Search Node

This node retrieves context from your vector database:

```typescript
import { pineconeClient } from "@/app/libs/pinecone";
import { openaiClient } from "@/app/libs/openai/openai";

async function searchDocumentsNode(state: StateType) {
  console.log('🔍 Searching documents (iteration', state.searchIterations + 1, ')');

  // Generate embedding
  const embeddingResponse = await openaiClient.embeddings.create({
    model: 'text-embedding-3-small',
    input: state.query,
  });
  const embedding = embeddingResponse.data[0].embedding;

  // Search Pinecone
  const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
  const queryResponse = await index.query({
    vector: embedding,
    topK: 10,
    includeMetadata: true,
  });

  // Extract documents
  const documents = queryResponse.matches
    .map((match) => match.metadata?.text)
    .filter(Boolean) as string[];

  // Optional: Rerank with Pinecone inference
  const reranked = await pineconeClient.inference.rerank({
    model: 'bge-reranker-v2-m3',
    query: state.query,
    documents: documents,
    topK: 5,
    returnDocuments: true,
  });

  const results = reranked.data
    .map((result) => result.document?.text)
    .filter(Boolean) as string[];

  console.log('📊 Found', results.length, 'documents');

  return {
    searchResults: results,
    searchIterations: state.searchIterations + 1
  };
}
```

---

## Step 5: Create the Evaluation Node

This node evaluates search quality and decides if more research is needed:

```typescript
async function evaluateResultsNode(state: StateType) {
  console.log('🎯 Evaluating search results');

  if (state.searchResults.length === 0) {
    return {
      confidence: 0,
      needsResearch: false // Give up after no results
    };
  }

  // Analyze if results are sufficient
  const evaluation = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      sufficient: z.boolean(),
      confidence: z.number().min(0).max(1),
      reasoning: z.string()
    }),
    prompt: `Evaluate if these search results are sufficient to answer the query:

Query: "${state.query}"

Results:
${state.searchResults.slice(0, 3).join('\n\n')}

Are these results sufficient and relevant?`
  });

  console.log('📈 Evaluation:', evaluation.object);

  return {
    confidence: evaluation.object.confidence
  };
}
```

---

## Step 6: Create the Answer Node

This node generates the final response:

```typescript
import { HumanMessage, AIMessage } from "@langchain/core/messages";

async function generateAnswerNode(state: StateType) {
  console.log('💬 Generating answer');

  const context = state.searchResults?.join('\n\n') || 'No context available';

  const systemPrompt = `You are a helpful assistant. Answer the user's question using the provided context.

Context:
${context}

If the context is insufficient, say so clearly.`;

  // Add message to history
  const messages = [
    ...state.messages,
    new HumanMessage(state.query)
  ];

  // Generate response using ChatOpenAI
  const { ChatOpenAI } = await import("@langchain/openai");
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7
  });

  const response = await model.invoke([
    { role: "system", content: systemPrompt },
    ...messages.map(m => ({
      role: m._getType() === "human" ? "user" : "assistant",
      content: m.content
    }))
  ]);

  return {
    messages: [new AIMessage(response.content)],
    answer: response.content as string
  };
}
```

---

## Step 7: Create Router Functions

These functions decide which node to execute next:

```typescript
// After analysis, route based on research need
function routeAfterAnalysis(state: StateType) {
  if (state.needsResearch) {
    console.log('→ Routing to search');
    return "search";
  }

  console.log('→ Routing to answer (no research needed)');
  return "answer";
}

// After search, decide if we need more iterations
function routeAfterSearch(state: StateType) {
  const MAX_ITERATIONS = 2;

  if (state.searchIterations >= MAX_ITERATIONS) {
    console.log('→ Max iterations reached, generating answer');
    return "answer";
  }

  return "evaluate";
}

// After evaluation, decide if results are good enough
function routeAfterEvaluation(state: StateType) {
  const CONFIDENCE_THRESHOLD = 0.7;

  if (state.confidence >= CONFIDENCE_THRESHOLD) {
    console.log('→ Confidence good, generating answer');
    return "answer";
  }

  console.log('→ Confidence low, searching again');
  return "search";
}
```

---

## Step 8: Build the Graph

Assemble all nodes and edges into a workflow:

```typescript
import { StateGraph } from "@langchain/langgraph";

function createResearchAgent() {
  const workflow = new StateGraph(AgentState)
    // Add all nodes
    .addNode("analyze", analyzeQueryNode)
    .addNode("search", searchDocumentsNode)
    .addNode("evaluate", evaluateResultsNode)
    .addNode("answer", generateAnswerNode)

    // Define the flow
    .addEdge("__start__", "analyze")

    // After analysis, route based on research need
    .addConditionalEdges("analyze", routeAfterAnalysis, {
      "search": "search",
      "answer": "answer"
    })

    // After search, evaluate results
    .addConditionalEdges("search", routeAfterSearch, {
      "evaluate": "evaluate",
      "answer": "answer"
    })

    // After evaluation, decide next step
    .addConditionalEdges("evaluate", routeAfterEvaluation, {
      "search": "search",
      "answer": "answer"
    })

    // Answer is terminal
    .addEdge("answer", "__end__");

  return workflow;
}
```

---

## Step 9: Add Persistence (Optional)

Enable checkpointing for stateful conversations:

```typescript
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function createCheckpointer() {
  const db = await open({
    filename: ":memory:", // Use ":memory:" for demo, or "./agent.db" for persistence
    driver: sqlite3.Database
  });

  return SqliteSaver.fromDb(db);
}

// Compile with checkpointer
const checkpointer = await createCheckpointer();
const app = workflow.compile({ checkpointer });
```

---

## Step 10: Create the API Route

Create the route handler that uses the graph:

```typescript
// app/api/langgraph-agent/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, threadId } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('\n🚀 Starting LangGraph agent for query:', query);

    // Create the graph
    const workflow = createResearchAgent();
    const app = workflow.compile();

    // Optional: Use thread ID for conversation persistence
    const config = threadId
      ? { configurable: { thread_id: threadId } }
      : undefined;

    // Execute the graph
    const result = await app.invoke(
      {
        query,
        messages: [],
        searchIterations: 0
      },
      config
    );

    console.log('✅ Agent completed\n');

    return NextResponse.json({
      success: true,
      answer: result.answer,
      queryType: result.queryType,
      confidence: result.confidence,
      searchIterations: result.searchIterations,
      needsResearch: result.needsResearch
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}
```

---

## Step 11: Test Your Implementation

### Test 1: Simple Question (No Research)

```bash
curl -X POST http://localhost:3000/api/langgraph-agent \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello, how are you?"}'
```

**Expected Flow:**
```
📊 Analyzing query
✅ Analysis: needsResearch=false, queryType=simple
→ Routing to answer (no research needed)
💬 Generating answer
```

---

### Test 2: Technical Question (With Research)

```bash
curl -X POST http://localhost:3000/api/langgraph-agent \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I use React hooks?"}'
```

**Expected Flow:**
```
📊 Analyzing query
✅ Analysis: needsResearch=true, queryType=technical
→ Routing to search
🔍 Searching documents (iteration 1)
📊 Found 5 documents
🎯 Evaluating search results
📈 Evaluation: sufficient=true, confidence=0.9
→ Confidence good, generating answer
💬 Generating answer
```

---

### Test 3: Complex Question (Multiple Iterations)

```bash
curl -X POST http://localhost:3000/api/langgraph-agent \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the performance implications of different state management patterns?"}'
```

**Expected Flow:**
```
📊 Analyzing query
→ Routing to search
🔍 Searching documents (iteration 1)
🎯 Evaluating search results
📈 Evaluation: confidence=0.5 (low)
→ Confidence low, searching again
🔍 Searching documents (iteration 2)
→ Max iterations reached, generating answer
💬 Generating answer
```

---

## Comparing to Your RAG Agent

### Your Current RAG Agent (`app/agents/rag.ts`)

```typescript
// Always executes these steps in order
export async function ragAgent(request: AgentRequest) {
  const embedding = await generateEmbedding(request.query);
  const results = await searchPinecone(embedding);
  const reranked = await rerank(results);
  return streamText({ context: reranked });
}
```

**Characteristics:**
- ✅ Simple and predictable
- ✅ Fast (no decision overhead)
- ❌ Always searches (even for "hello")
- ❌ Can't refine or iterate
- ❌ No conversation memory
- ❌ Can't pause/resume

---

### Your New LangGraph Agent

```typescript
// Decides what to do based on query
const graph = new StateGraph(AgentState)
  .addNode("analyze", analyzeQueryNode)
  .addConditionalEdges("analyze", routeAfterAnalysis)
  // ... more nodes and conditional logic
```

**Characteristics:**
- ✅ Intelligent routing (only searches when needed)
- ✅ Can iterate and refine
- ✅ Maintains state across steps
- ✅ Can pause/resume with checkpointing
- ⚠️ More complex
- ⚠️ Slightly slower (decision overhead)

---

## When to Use Each

### Use Your RAG Agent (AI SDK) For:

✅ Simple Q&A where context is always needed
✅ Predictable, single-purpose workflows
✅ Cost-sensitive applications (no decision overhead)
✅ MVP/prototype development

### Use LangGraph Agent For:

✅ Multi-step research and analysis
✅ Workflows with branching logic
✅ Long-running or resumable processes
✅ Production systems needing reliability
✅ Agents that need to "think" before acting

---

## Challenge: Add a Tool Node

Extend your graph with a tool-calling node:

```typescript
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ToolNode } from "@langchain/langgraph/prebuilt";

// Create tool node
const tools = [new TavilySearchResults({ maxResults: 3 })];
const toolNode = new ToolNode(tools);

// Add to graph
workflow
  .addNode("tools", toolNode)
  .addConditionalEdges("analyze", (state) => {
    if (state.queryType === "realtime") {
      return "tools"; // Use web search for real-time info
    }
    return "search"; // Use vector DB for docs
  })
  .addEdge("tools", "evaluate");
```

**This enables:**
- Web search for current events
- API calls for external data
- Multiple tool types in one agent

---

## Debugging Tips

### Visualize Your Graph

```typescript
// Add to your route for debugging
console.log(app.getGraph().drawMermaid());
```

### Add Detailed Logging

```typescript
async function searchDocumentsNode(state: StateType) {
  console.log('\n=== SEARCH NODE ===');
  console.log('Query:', state.query);
  console.log('Iteration:', state.searchIterations);

  // ... node logic

  console.log('Results count:', results.length);
  console.log('=== END SEARCH NODE ===\n');

  return { searchResults: results };
}
```

### Stream Events

```typescript
// Stream intermediate results
for await (const event of app.stream(input, config)) {
  console.log('Event:', event);
}
```

---

## What You Learned

✅ How to define stateful workflows with LangGraph
✅ Building graphs with nodes, edges, and conditional routing
✅ Implementing decision-making and iteration loops
✅ Comparing LangGraph vs AI SDK approaches
✅ When to use each framework
✅ Debugging and testing graph-based agents

---

## What's Next

Now that you understand LangGraph fundamentals, explore:
- **Tool Calling Module**: Alternative patterns for tool use (next module)
- **Chat Interface**: Connect your agents to the UI
- **Observability**: Track agent performance with Helicone
- **Testing**: Write tests for your LangGraph agents

---

## Additional Resources

- [LangGraph Tutorials](https://docs.langchain.com/oss/python/langgraph/tutorials)
- [Reflection Pattern Example](https://github.com/langchain-ai/langgraph-reflection)
- [Multi-Agent Patterns](https://github.com/langchain-ai/langgraph-swarm-py)
- [Production Best Practices](https://www.swarnendu.de/blog/langgraph-best-practices/)
