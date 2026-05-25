# MCP: Tool Calling as a Protocol

Model Context Protocol (MCP) is an open standard that lets AI assistants call your tools directly.

Think of it as: **Tool calling, but standardized across all AI clients.**

---

## The Connection

You already know tool calling:

```typescript
// Tool definition (from previous lessons)
{
  name: "search_documents",
  description: "Search the knowledge base",
  parameters: {
    query: { type: "string" }
  }
}
```

MCP is the same concept, but instead of defining tools in your app, you expose them as a **server** that any AI client can connect to.

```
Your App + Tools ──(API call)──> Your App handles it

Your MCP Server ──(protocol)──> Claude Desktop calls it
                              > Claude Code calls it
                              > Cursor calls it
                              > Any MCP client calls it
```

---

## Why MCP?

Without MCP:
- Build a chat UI
- Handle tool calls yourself
- Rebuild for each AI provider

With MCP:
- Expose tools once
- Users access via Claude Desktop, Claude Code, Cursor, etc.
- No UI needed - AI handles everything

---

## Our RAG MCP Server

We've built a minimal MCP server at `mcp/rag-server.ts` that exposes:

- `search_knowledge_base` - Query your Pinecone vectors
- `list_sources` - Show index stats

```bash
# Install dependencies first
yarn install

# Run the server (for testing)
yarn mcp:rag
```

---

## Setup: Claude Code

Add `.mcp.json` to your project root:

```json
{
  "mcpServers": {
    "rag": {
      "command": "npx",
      "args": ["ts-node", "mcp/rag-server.ts"]
    }
  }
}
```

Then restart Claude Code (or start a new session). You'll be prompted to approve the MCP server. Once approved, the tools will appear when you ask questions about your knowledge base.

**Docs:** https://docs.anthropic.com/en/docs/claude-code/mcp

---

## Setup: Claude Desktop

1. Find your config file:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. Add your server:

```json
{
  "mcpServers": {
    "rag": {
      "command": "npx",
      "args": ["ts-node", "/full/path/to/mini_rag/mcp/rag-server.ts"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "PINECONE_API_KEY": "your-key",
        "PINECONE_INDEX": "your-index"
      }
    }
  }
}
```

3. Restart Claude Desktop

4. Your tools appear in the 🔧 tools menu

**Docs:** https://modelcontextprotocol.io/quickstart/user

---

## Setup: Cursor

1. Open Cursor Settings → MCP (or `Cmd+Shift+P` → "MCP: Edit Configuration")

2. Add your server:

```json
{
  "mcpServers": {
    "rag": {
      "command": "npx",
      "args": ["ts-node", "/full/path/to/mini_rag/mcp/rag-server.ts"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "PINECONE_API_KEY": "your-key",
        "PINECONE_INDEX": "your-index"
      }
    }
  }
}
```

3. Restart Cursor

**Docs:** https://docs.cursor.com/context/model-context-protocol

---

## Testing Without a Client

Use the MCP Inspector to test your server directly:

```bash
npx @modelcontextprotocol/inspector npx ts-node mcp/rag-server.ts
```

This opens a web UI where you can:
- See available tools
- Call tools with test inputs
- View responses

---

## The Server Code

Here's what the server does (`mcp/rag-server.ts`):

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  { name: 'rag-knowledge-base', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// List tools (same schema as OpenAI tool calling)
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_knowledge_base',
      description: 'Search for relevant documents',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { query } = request.params.arguments;
  const results = await searchPinecone(query);
  return { content: [{ type: 'text', text: JSON.stringify(results) }] };
});

// Start server on stdio
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## Tool Calling vs MCP

| Aspect | Tool Calling | MCP |
|--------|-------------|-----|
| Where tools live | In your app | Separate server |
| Who calls them | Your app via API | AI client directly |
| Build UI? | Yes | No |
| Reusable? | Per app | Any MCP client |

---

## When to Use MCP

**Use MCP when:**
- You want to expose RAG to Claude Desktop/Code/Cursor users
- Building internal tools for AI-assisted workflows
- You don't want to build a chat UI

**Stick with regular tool calling when:**
- Building a custom chat interface
- Need full control over the UX
- Integrating into an existing app

---

## Key Takeaway

MCP = Tool calling, but:
- Standardized protocol
- Works with any MCP client
- Your tools become reusable components

You already understand the hard part (tool schemas, handling calls). MCP just changes where those tools live.

---

## Resources

- **MCP Specification:** https://modelcontextprotocol.io
- **Claude Desktop Setup:** https://modelcontextprotocol.io/quickstart/user
- **Claude Code Setup:** https://docs.anthropic.com/en/docs/claude-code/mcp
- **Cursor Setup:** https://docs.cursor.com/context/model-context-protocol
- **MCP Inspector:** `npx @modelcontextprotocol/inspector`
