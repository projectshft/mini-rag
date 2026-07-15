# Build It: "Ask My Docs" MCP Server

You've seen what MCP is and how a server is wired up. Now build a small, real one — a single-tool server that lets **any** MCP client (Claude Code, Cursor, the Inspector) search the knowledge base you already loaded into Pinecone, straight from your editor.

Timebox: ~1 hour. One file, one tool.

---

## The Project

**Goal:** Expose your Pinecone index as one MCP tool, `search_docs`, and query it from a real client.

```
You (in Claude Code): "search my docs for chunking strategies"
        │
        ▼
  search_docs tool  ──►  embed query  ──►  Pinecone  ──►  top matches back to the chat
```

That's the whole project. No UI, no API route, no auth. One tool that does retrieval.

---

## Step 1 — Install

```bash
yarn add @modelcontextprotocol/sdk zod
```

## Step 2 — Write the server

Create `mcp/rag-server.ts`. It's self-contained on purpose — it talks to Pinecone and OpenAI directly so you don't have to refactor your app to export anything.

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { z } from 'zod';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const index = pinecone.index(process.env.PINECONE_INDEX!);

const server = new McpServer({ name: 'rag-server', version: '1.0.0' });

server.tool(
	'search_docs',
	'Search the knowledge base for relevant document chunks',
	{
		query: z.string().min(1).max(1000).describe('What to search for'),
		topK: z
			.number()
			.int()
			.min(1)
			.max(20)
			.default(5)
			.describe('Number of results'),
	},
	async ({ query, topK }) => {
		const embed = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: query,
		});

		const { matches } = await index.query({
			vector: embed.data[0].embedding,
			topK,
			includeMetadata: true,
		});

		const results = matches.map((m) => ({
			score: m.score,
			text: m.metadata?.text,
			source: m.metadata?.source,
		}));

		return {
			content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
		};
	},
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('rag-server running on stdio');
```

> Note: `console.log` would corrupt the protocol — MCP uses stdout for JSON-RPC. Log to `stderr` (`console.error`) only.

## Step 3 — Test it before touching any client

The Inspector is the fastest feedback loop:

```bash
npx @modelcontextprotocol/inspector npx tsx mcp/rag-server.ts
```

Open the web UI it prints, pick `search_docs`, and run a query you know is in your index. You should get matches back with scores. If you don't, fix it here — not inside Claude.

## Step 4 — Connect a real client

**Claude Code** — add to `~/.claude.json` (or run `claude mcp add`):

```json
{
	"mcpServers": {
		"rag": {
			"command": "npx",
			"args": ["tsx", "/absolute/path/to/mcp/rag-server.ts"],
			"env": {
				"OPENAI_API_KEY": "sk-...",
				"PINECONE_API_KEY": "...",
				"PINECONE_INDEX": "rag-tutorial"
			}
		}
	}
}
```

Restart, then ask: _"Use search_docs to find what my notes say about reranking."_

Cursor and Claude Desktop take the same block — see `1-exposing-rag-over-mcp.md` for their config paths.

---

## Done when

- [ ] The Inspector lists `search_docs` and returns real matches from your index.
- [ ] One MCP client (Claude Code / Cursor / Desktop) calls the tool and answers from your docs.
