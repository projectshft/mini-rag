# What is MCP?

Model Context Protocol (MCP) is an open standard that lets AI assistants connect to external tools and data sources.

---

## The Problem MCP Solves

Without MCP, every AI integration is custom:

```
Your App ──(custom API)──> Claude
Your App ──(different API)──> GPT
Your App ──(another API)──> Gemini
```

With MCP, you build once:

```
Your App ──(MCP)──> Any AI Assistant
```

---

## How It Works

MCP has three parts:

1. **Server** - Your code that exposes tools
2. **Client** - The AI assistant (Claude Desktop, Cursor, etc.)
3. **Protocol** - JSON-RPC messages between them

```
┌─────────────┐     JSON-RPC      ┌─────────────┐
│   Claude    │ ◄──────────────► │  MCP Server │
│   Desktop   │                   │  (your code)│
└─────────────┘                   └─────────────┘
```

---

## What You Can Expose

MCP servers can expose:

- **Tools** - Functions the AI can call (search, create, update)
- **Resources** - Data the AI can read (files, database records)
- **Prompts** - Pre-built prompt templates

For RAG, you typically expose **tools** like:

- `search_documents` - Query your vector database
- `get_document` - Fetch a specific document
- `list_sources` - Show available data sources

---

## Why This Matters for RAG

Instead of building a chat UI, you can:

1. Expose your RAG as an MCP server
2. Users query it directly from Claude Desktop or Cursor
3. The AI calls your tools automatically

```
User: "What's the refund policy?"
         │
         ▼
Claude Desktop calls your MCP tool
         │
         ▼
Your server queries Pinecone
         │
         ▼
Claude gets context and responds
```

---

## MCP vs API

| Aspect      | REST API      | MCP          |
| ----------- | ------------- | ------------ |
| Client      | Your app      | AI assistant |
| Integration | Custom per AI | Universal    |
| Discovery   | Docs/OpenAPI  | Built-in     |
| Context     | Manual        | AI manages   |

---

## Tools We'll Build

In the next lesson, you'll build a minimal MCP server that exposes your RAG system:

```typescript
// Tools your MCP server will expose
{
  name: "search_knowledge_base",
  description: "Search the knowledge base for relevant documents",
  parameters: {
    query: { type: "string", description: "Search query" },
    limit: { type: "number", description: "Max results" }
  }
}
```

Then you'll connect it to Claude Desktop and query your data directly from the chat interface.
