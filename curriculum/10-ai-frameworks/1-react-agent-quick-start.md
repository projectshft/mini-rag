# LangGraph ReAct Agent: Quick Start

Get a production-ready agent with tool calling in under 50 lines of code.

---

## Video Walkthrough

<!-- Descript embed placeholder -->

---

## What You'll Learn

- How to create a ReAct agent using LangGraph's prebuilt patterns
- Defining tools with `@langchain/core/tools`
- Streaming responses with `streamEvents()`
- When this approach is enough vs when you need custom graphs

---

## The Fastest Path to Tool-Calling Agents

LangGraph has two ways to build agents:

1. **`createReactAgent`** - Prebuilt, batteries-included (this lesson)
2. **Custom `StateGraph`** - Build from scratch when you need control (next lesson)

Most production agents use `createReactAgent`. It handles:
- Tool execution loops
- Message state management
- Streaming
- Error handling

You only need custom graphs for complex workflows like human-in-the-loop or multi-agent systems.

---

## Architecture

```
User Message
      ↓
┌─────────────────────────────────────────┐
│           createReactAgent              │
│  ┌─────────────────────────────────┐   │
│  │  LLM decides: answer or tool?   │   │
│  └─────────────────────────────────┘   │
│         ↓              ↓                │
│      Answer      Call Tool(s)           │
│         ↓              ↓                │
│       Done       Execute & Loop Back    │
└─────────────────────────────────────────┘
```

The ReAct pattern (Reason + Act) lets the LLM decide when to use tools and when to respond directly.

---

## Step 1: Install Dependencies

```bash
yarn add @langchain/langgraph @langchain/openai @langchain/core
```

---

## Step 2: Define Your Tools

Tools are functions the agent can call. Use `tool()` from `@langchain/core/tools`:

```typescript
// libs/tools/search-docs.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { queryPinecone } from "@/app/lib/rag";

export const searchDocsTool = tool(
  async ({ query, topK }) => {
    const results = await queryPinecone(query, topK);

    if (results.length === 0) {
      return "No relevant documents found.";
    }

    return results
      .map((r, i) => `[${i + 1}] ${r.text}`)
      .join("\n\n");
  },
  {
    name: "searchDocs",
    description: "Search the knowledge base for relevant information",
    schema: z.object({
      query: z.string().describe("The search query"),
      topK: z.number().optional().default(5).describe("Number of results"),
    }),
  }
);
```

**Key Points:**
- First argument: the async function that executes
- `name`: what the LLM sees and calls
- `description`: helps the LLM know when to use it
- `schema`: Zod schema for input validation

---

## Step 3: Create More Tools

Add tools for different capabilities:

```typescript
// libs/tools/get-context.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const getBusinessContextTool = tool(
  async ({ contextType }) => {
    // Fetch relevant business context
    const contexts: Record<string, string> = {
      pricing: "Basic: $29/mo, Pro: $99/mo, Enterprise: custom",
      features: "RAG, Agents, Fine-tuning, Observability",
      support: "Email support for all plans, Slack for Pro+",
    };

    return contexts[contextType] || "Context not found";
  },
  {
    name: "getBusinessContext",
    description: "Get business information like pricing, features, or support details",
    schema: z.object({
      contextType: z.enum(["pricing", "features", "support"]),
    }),
  }
);
```

```typescript
// libs/tools/index.ts
export { searchDocsTool } from "./search-docs";
export { getBusinessContextTool } from "./get-context";
```

---

## Step 4: Create the Agent

This is the core - combine LLM + tools into a ReAct agent:

```typescript
// app/actions/chat-agent.ts
"use server";

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { searchDocsTool } from "@/libs/tools/search-docs";
import { getBusinessContextTool } from "@/libs/tools/get-context";

const SYSTEM_PROMPT = `
You are a helpful assistant with access to tools.

## Tool Usage Guidelines
- Use searchDocs when the user asks questions that might be in the knowledge base
- Use getBusinessContext for pricing, features, or support questions
- If a tool fails, explain the issue and provide what help you can

## Response Style
- Be concise and direct
- Cite sources when using search results
- Admit when you don't know something
`.trim();

const llm = new ChatOpenAI({
  model: "gpt-4o",
  streaming: true,
});

export const chatAgent = createReactAgent({
  llm,
  tools: [searchDocsTool, getBusinessContextTool],
  // System prompt is passed with each invocation
});

export { SYSTEM_PROMPT };
```

That's it. **Under 30 lines** for a working agent.

---

## Step 5: Create the API Route

Stream responses to your frontend:

```typescript
// app/api/chat/route.ts
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { chatAgent, SYSTEM_PROMPT } from "@/app/actions/chat-agent";

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  try {
    const { messages } = await req.json();

    // Convert to LangChain message format
    const lcMessages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...messages.map((m: { role: string; content: string }) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ),
    ];

    const stream = new ReadableStream({
      async start(controller) {
        const enqueue = (obj: object) =>
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

        try {
          const eventStream = chatAgent.streamEvents(
            { messages: lcMessages },
            { version: "v2" }
          );

          for await (const event of eventStream) {
            // Stream LLM tokens
            if (event.event === "on_chat_model_stream") {
              const content = event.data?.chunk?.content;
              if (typeof content === "string" && content) {
                enqueue({ type: "text", content });
              }
            }

            // Show tool usage
            if (event.event === "on_tool_start") {
              enqueue({ type: "tool", name: event.name });
            }
          }
        } catch (error) {
          enqueue({
            type: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to process" }), {
      status: 500,
    });
  }
}
```

---

## Step 6: Test It

### Test with curl

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is RAG?"}]}'
```

**Expected output (newline-delimited JSON):**
```json
{"type":"tool","name":"searchDocs"}
{"type":"text","content":"RAG"}
{"type":"text","content":" (Retrieval"}
{"type":"text","content":"-Augmented"}
{"type":"text","content":" Generation)"}
{"type":"text","content":" is..."}
```

### Test tool routing

```bash
# Should use searchDocs
curl ... -d '{"messages": [{"role": "user", "content": "How do embeddings work?"}]}'

# Should use getBusinessContext
curl ... -d '{"messages": [{"role": "user", "content": "What is the pricing?"}]}'

# Should answer directly (no tools)
curl ... -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

---

## Understanding streamEvents

The `streamEvents()` method emits different event types:

| Event | When | Use For |
|-------|------|---------|
| `on_chat_model_start` | LLM begins generating | Show "thinking" indicator |
| `on_chat_model_stream` | Each token generated | Stream text to UI |
| `on_chat_model_end` | LLM finished | Clean up |
| `on_tool_start` | Tool called | Show "Searching..." |
| `on_tool_end` | Tool finished | Log results |

```typescript
for await (const event of agent.streamEvents(input, { version: "v2" })) {
  switch (event.event) {
    case "on_chat_model_stream":
      // Stream token to client
      break;
    case "on_tool_start":
      // Show tool indicator
      break;
  }
}
```

---

## Adding LangSmith Observability

Track all agent runs with LangSmith:

```typescript
// Set environment variables
// LANGSMITH_TRACING=true
// LANGSMITH_API_KEY=lsv2_pt_...
// LANGSMITH_PROJECT=my-project

// Then pass run metadata
const eventStream = chatAgent.streamEvents(
  { messages: lcMessages },
  {
    version: "v2",
    runName: "chat-agent",
    metadata: { userId: "user_123" },
  }
);
```

Every tool call, LLM invocation, and decision is logged automatically.

---

## When createReactAgent Is Enough

Use `createReactAgent` for:

- **Standard tool-calling agents** - Most common use case
- **Chat interfaces with capabilities** - Search, lookup, calculations
- **RAG with multiple data sources** - Different tools for different sources
- **Streaming responses** - Built-in support
- **Production deployments** - Battle-tested pattern

---

## When You Need Custom Graphs

Move to custom `StateGraph` (next lesson) when you need:

- **Human-in-the-loop** - Pause for approval before actions
- **Complex branching** - Different paths based on analysis
- **Multi-agent coordination** - Agents calling other agents
- **Custom state management** - Beyond messages
- **Iterative refinement** - Search → evaluate → search again

Most teams start with `createReactAgent` and only move to custom graphs when they hit a limitation.

---

## Common Patterns

### Pattern 1: Multiple Search Tools

```typescript
const agent = createReactAgent({
  llm,
  tools: [
    searchDocsTool,      // Internal docs
    searchWebTool,       // Web search
    searchDatabaseTool,  // SQL queries
  ],
});
```

The LLM decides which source to query based on the question.

### Pattern 2: Tool Error Handling

```typescript
export const searchDocsTool = tool(
  async ({ query }) => {
    try {
      const results = await queryPinecone(query);
      return formatResults(results);
    } catch (error) {
      // Return error message instead of throwing
      return `Search failed: ${error.message}. Please try a different query.`;
    }
  },
  { name: "searchDocs", ... }
);
```

### Pattern 3: Context from Previous Tools

The agent maintains message history, so tool results are available for subsequent reasoning:

```
User: "What's our pricing and how does it compare to competitors?"

Agent thinks: I need pricing info
→ Calls getBusinessContext("pricing")
→ Gets: "Basic: $29/mo, Pro: $99/mo..."

Agent thinks: Now I need competitor info
→ Calls searchDocs("competitor pricing comparison")
→ Gets: search results

Agent: Combines both tool results into final answer
```

---

## What You Learned

- **`createReactAgent`** is the fastest path to tool-calling agents
- **Tools** are defined with `tool()` from `@langchain/core/tools`
- **`streamEvents()`** provides fine-grained control over streaming
- **Most production agents** use this prebuilt pattern
- **Custom graphs** are for advanced workflows (next lesson)

---

## Challenge: Add a Third Tool

Create a tool that the agent can use alongside the existing ones:

Ideas:
- `calculateTool` - Math operations
- `getCurrentTimeTool` - Date/time queries
- `summarizeTool` - Summarize long text

Test that the agent correctly chooses between all three tools.

---

## What's Next

In the next lesson, you'll learn when and how to build **custom StateGraphs** for:
- Human-in-the-loop workflows
- Complex branching logic
- Multi-step refinement loops
- Custom state management
