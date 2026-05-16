# Exposing RAG Over MCP

You've built a RAG system. Now let's make it accessible to any AI tool through the Model Context Protocol.

---

## Video Walkthrough

<!-- Descript embed placeholder -->

---

## What You'll Learn

- What MCP is and why it matters
- How to create an MCP server that exposes your RAG pipeline
- Security considerations when exposing AI tools
- How to connect your MCP server to Claude Code, Cursor, or other tools

---

## What is MCP?

**Model Context Protocol (MCP)** is an open standard for connecting AI assistants to external tools and data sources. Think of it as a universal adapter—instead of building custom integrations for every AI tool, you build one MCP server and it works everywhere.

```
┌─────────────────┐     ┌─────────────┐     ┌──────────────┐
│  Claude Code    │     │             │     │              │
│  Cursor         │────▶│ MCP Server  │────▶│  Your RAG    │
│  Any MCP Client │     │             │     │  Pipeline    │
└─────────────────┘     └─────────────┘     └──────────────┘
```

### Why MCP for RAG?

Without MCP, if you want your RAG system in Claude Code AND Cursor AND your company's internal tool, you'd build three separate integrations. With MCP:

1. **Build once, use everywhere** - One server, many clients
2. **Standardized interface** - Tools describe themselves with schemas
3. **Local-first** - Runs on your machine, your data stays private
4. **Composable** - Combine multiple MCP servers (RAG + database + calendar)

---

## Architecture Overview

Here's what we're building:

```
┌────────────────────────────────────────────────────────┐
│                    MCP Server                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Tool: search_knowledge_base                     │ │
│  │  - Takes: query (string)                         │ │
│  │  - Returns: relevant context from your documents │ │
│  └──────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Tool: ask_rag                                   │ │
│  │  - Takes: question (string)                      │ │
│  │  - Returns: AI-generated answer with sources     │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐           ┌─────────────────┐
│    Pinecone     │           │     OpenAI      │
│  (Vector Store) │           │   (Embeddings   │
│                 │           │    + LLM)       │
└─────────────────┘           └─────────────────┘
```

---

## Setting Up Your MCP Server

### Step 1: Install Dependencies

```bash
yarn add @modelcontextprotocol/sdk zod
```

### Step 2: Create the Server

Create a new file `mcp/rag-server.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { queryPinecone, generateAnswer } from "../app/lib/rag";

// Create the MCP server
const server = new McpServer({
  name: "rag-server",
  version: "1.0.0",
});

// Tool 1: Search the knowledge base (retrieval only)
server.tool(
  "search_knowledge_base",
  "Search your document knowledge base for relevant information",
  {
    query: z.string().describe("The search query"),
    topK: z.number().optional().default(5).describe("Number of results"),
  },
  async ({ query, topK }) => {
    const results = await queryPinecone(query, topK);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// Tool 2: Ask the RAG system (retrieval + generation)
server.tool(
  "ask_rag",
  "Ask a question and get an AI-generated answer based on your documents",
  {
    question: z.string().describe("The question to answer"),
  },
  async ({ question }) => {
    const context = await queryPinecone(question, 5);
    const answer = await generateAnswer(question, context);

    return {
      content: [
        {
          type: "text",
          text: answer,
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RAG MCP Server running on stdio");
}

main().catch(console.error);
```

### Step 3: Add the RAG Helper Functions

If you don't already have these exported, create `app/lib/rag.ts`:

```typescript
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const index = pinecone.index(process.env.PINECONE_INDEX!);

export async function queryPinecone(query: string, topK: number = 5) {
  // Generate embedding for the query
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  // Search Pinecone
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return results.matches.map((match) => ({
    score: match.score,
    text: match.metadata?.text,
    source: match.metadata?.source,
  }));
}

export async function generateAnswer(
  question: string,
  context: Array<{ text?: string; source?: string; score?: number }>
) {
  const contextText = context
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant. Answer questions based on the provided context.
                  Cite sources using [1], [2], etc. If the context doesn't contain
                  relevant information, say so.`,
      },
      {
        role: "user",
        content: `Context:\n${contextText}\n\nQuestion: ${question}`,
      },
    ],
  });

  return response.choices[0].message.content;
}
```

### Step 4: Add a Build Script

Add to your `package.json`:

```json
{
  "scripts": {
    "mcp:build": "tsc mcp/rag-server.ts --outDir mcp/dist --esModuleInterop --moduleResolution node",
    "mcp:start": "node mcp/dist/rag-server.js"
  }
}
```

Or for quick testing without compilation:

```json
{
  "scripts": {
    "mcp:dev": "npx tsx mcp/rag-server.ts"
  }
}
```

---

## Security Considerations

Before exposing your RAG system over MCP, consider these security points:

### 1. Local Execution

MCP servers typically run locally on your machine. This means:

- ✅ Your data doesn't leave your machine (unless you call external APIs)
- ✅ No need for authentication—if someone has access to run the server, they already have access to your machine
- ⚠️ Environment variables (API keys) are accessible to the MCP process

### 2. What Gets Exposed

Think about what your tools return:

```typescript
// Be careful about exposing sensitive metadata
return {
  text: match.metadata?.text,
  source: match.metadata?.source,
  // Don't accidentally expose:
  // internalId: match.metadata?.internalId,
  // author: match.metadata?.author,
};
```

### 3. Input Validation

Always validate inputs, even from trusted clients:

```typescript
server.tool(
  "search_knowledge_base",
  "Search documents",
  {
    query: z.string().min(1).max(1000), // Limit query length
    topK: z.number().int().min(1).max(20), // Reasonable bounds
  },
  async ({ query, topK }) => {
    // Safe to use validated inputs
  }
);
```

### 4. Rate Limiting (For Shared Servers)

If deploying a shared MCP server, implement rate limiting:

```typescript
const requestCounts = new Map<string, number>();

function checkRateLimit(clientId: string, limit: number = 100): boolean {
  const count = requestCounts.get(clientId) || 0;
  if (count >= limit) return false;
  requestCounts.set(clientId, count + 1);
  return true;
}
```

---

## Connecting to AI Tools

Now the fun part—using your MCP server with real AI tools.

### Option 1: Claude Code

If you have Claude Code, add your server to the configuration:

**macOS/Linux:** `~/.claude/claude_code_config.json`
**Windows:** `%APPDATA%\claude-code\claude_code_config.json`

```json
{
  "mcpServers": {
    "rag": {
      "command": "npx",
      "args": ["tsx", "/path/to/your/mcp/rag-server.ts"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "PINECONE_API_KEY": "your-key",
        "PINECONE_INDEX": "your-index"
      }
    }
  }
}
```

Then in Claude Code, your RAG tools will be available:

```
You: Search my knowledge base for information about vector embeddings

Claude: I'll search your knowledge base for that.
[Uses search_knowledge_base tool]
Here's what I found in your documents...
```

### Option 2: Cursor

Cursor supports MCP servers through its settings:

1. Open Cursor Settings (`Cmd+,` or `Ctrl+,`)
2. Search for "MCP"
3. Add your server configuration:

```json
{
  "mcp.servers": {
    "rag": {
      "command": "npx",
      "args": ["tsx", "/path/to/your/mcp/rag-server.ts"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "PINECONE_API_KEY": "your-key",
        "PINECONE_INDEX": "your-index"
      }
    }
  }
}
```

### Option 3: MCP Inspector (Free)

The MCP Inspector is a free debugging tool that lets you test your server without any IDE:

```bash
# Install globally
npm install -g @modelcontextprotocol/inspector

# Run your server with the inspector
mcp-inspector npx tsx mcp/rag-server.ts
```

This opens a web UI where you can:
- See all available tools
- Test tool calls with custom inputs
- View responses and debug issues

### Option 4: Simple CLI Client

For the simplest possible testing, create a CLI client:

```typescript
// mcp/test-client.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

async function main() {
  // Start the server process
  const serverProcess = spawn("npx", ["tsx", "mcp/rag-server.ts"], {
    stdio: ["pipe", "pipe", "inherit"],
    env: process.env,
  });

  const transport = new StdioClientTransport({
    reader: serverProcess.stdout!,
    writer: serverProcess.stdin!,
  });

  const client = new Client({ name: "test-client", version: "1.0.0" }, {});
  await client.connect(transport);

  // List available tools
  const tools = await client.listTools();
  console.log("Available tools:", tools);

  // Test the search tool
  const result = await client.callTool({
    name: "search_knowledge_base",
    arguments: { query: "What is RAG?", topK: 3 },
  });

  console.log("Search result:", result);

  await client.close();
  serverProcess.kill();
}

main();
```

Run it:

```bash
npx tsx mcp/test-client.ts
```

---

## Testing Your Server

### Manual Testing

1. Start your server in one terminal:
   ```bash
   yarn mcp:dev
   ```

2. In another terminal, use the inspector:
   ```bash
   mcp-inspector --server "npx tsx mcp/rag-server.ts"
   ```

3. Test each tool:
   - `search_knowledge_base` with query "your test query"
   - `ask_rag` with question "What does my documentation say about X?"

### Automated Testing

Create `mcp/__tests__/rag-server.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn, ChildProcess } from "child_process";

describe("RAG MCP Server", () => {
  let client: Client;
  let serverProcess: ChildProcess;

  beforeAll(async () => {
    serverProcess = spawn("npx", ["tsx", "mcp/rag-server.ts"], {
      stdio: ["pipe", "pipe", "inherit"],
      env: process.env,
    });

    const transport = new StdioClientTransport({
      reader: serverProcess.stdout!,
      writer: serverProcess.stdin!,
    });

    client = new Client({ name: "test", version: "1.0.0" }, {});
    await client.connect(transport);
  });

  afterAll(async () => {
    await client.close();
    serverProcess.kill();
  });

  it("should list tools", async () => {
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(2);
    expect(tools.map((t) => t.name)).toContain("search_knowledge_base");
    expect(tools.map((t) => t.name)).toContain("ask_rag");
  });

  it("should search the knowledge base", async () => {
    const result = await client.callTool({
      name: "search_knowledge_base",
      arguments: { query: "test query", topK: 3 },
    });

    expect(result.content).toBeDefined();
    expect(result.content[0].type).toBe("text");
  });
});
```

---

## What You Learned

- ✅ MCP is a standard protocol for connecting AI tools to external systems
- ✅ An MCP server exposes "tools" that AI assistants can call
- ✅ Your RAG pipeline can be exposed as `search_knowledge_base` and `ask_rag` tools
- ✅ Security involves validating inputs and being careful about what data you expose
- ✅ Multiple AI tools (Claude Code, Cursor, Inspector) can connect to the same MCP server

---

## Bonus Challenge: MCP at Your Company

Think about your company's AI tools and workflows:

### Questions to Consider

1. **What AI tools does your company use?**
   - Internal chatbots?
   - Code assistants?
   - Documentation search?

2. **What data sources would be valuable to expose?**
   - Internal documentation
   - Customer support knowledge base
   - Code repositories
   - Database queries

3. **What workflow could MCP improve?**
   - "Search our internal docs" without leaving your IDE
   - "Query our analytics database" from a chat interface
   - "Find relevant Jira tickets" while coding

### Mini-Project: Design an MCP Server

Sketch out an MCP server for your company. Don't build it—just design it:

```typescript
// What tools would you expose?
server.tool("search_internal_docs", "...", schema, handler);
server.tool("query_analytics", "...", schema, handler);
server.tool("find_related_tickets", "...", schema, handler);

// What security considerations apply?
// - Who should have access?
// - What data can be exposed?
// - Do you need audit logging?
```

### Reflection Questions

1. What's the most repetitive information-gathering task in your workflow?
2. Could an MCP tool reduce context-switching between applications?
3. What would need to change at your company to deploy an MCP server?

---

## Resources

- **[MCP Specification](https://spec.modelcontextprotocol.io/)** - The official protocol documentation
- **[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - The SDK we used in this lesson
- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** - Free debugging tool
- **[Claude Code MCP Docs](https://docs.anthropic.com/en/docs/claude-code/mcp)** - Claude Code integration guide

---

## Assignment

**Video:** Record yourself explaining what MCP is and why you'd expose RAG over it. Explain it like you're talking to a colleague who hasn't heard of MCP.

**Code:** Get your MCP server running and demonstrate it with at least one client (Inspector, CLI client, or a full IDE integration).

**Submit:**
- [Video Submission](https://form.typeform.com/to/YOUR_FORM_ID)
- [Code Submission](https://form.typeform.com/to/YOUR_FORM_ID)
