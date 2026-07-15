# Building Your First MCP Server

Build a minimal MCP server that exposes your RAG system to Claude Desktop or Cursor.

---

## Setup

Install the MCP SDK:

```bash
yarn (or npm) install @modelcontextprotocol/sdk
```

---

## Minimal MCP Server

Create `mcp/rag-server.ts`:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Your existing RAG function
import { searchDocuments } from '../app/lib/rag';

const server = new Server(
	{ name: 'rag-server', version: '1.0.0' },
	{ capabilities: { tools: {} } },
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: [
		{
			name: 'search_knowledge_base',
			description: 'Search the knowledge base for relevant information',
			inputSchema: {
				type: 'object',
				properties: {
					query: {
						type: 'string',
						description: 'The search query',
					},
					limit: {
						type: 'number',
						description: 'Maximum number of results (default: 5)',
					},
				},
				required: ['query'],
			},
		},
	],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	if (request.params.name === 'search_knowledge_base') {
		const { query, limit = 5 } = request.params.arguments as {
			query: string;
			limit?: number;
		};

		try {
			const results = await searchDocuments(query, limit);

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(results, null, 2),
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: 'text',
						text: `Error searching: ${error}`,
					},
				],
				isError: true,
			};
		}
	}

	throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('RAG MCP Server running on stdio');
}

main().catch(console.error);
```

---

## The RAG Function

Your `searchDocuments` function (from previous modules):

```typescript
// app/lib/rag.ts
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pinecone = new Pinecone();
const openai = new OpenAI();

export async function searchDocuments(query: string, limit: number = 5) {
	// 1. Embed the query
	const embedding = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: query,
	});

	// 2. Search Pinecone
	const index = pinecone.Index(process.env.PINECONE_INDEX!);
	const results = await index.query({
		vector: embedding.data[0].embedding,
		topK: limit,
		includeMetadata: true,
	});

	// 3. Return formatted results
	return results.matches.map((match) => ({
		score: match.score,
		text: match.metadata?.text,
		source: match.metadata?.source,
	}));
}
```

---

## Connecting to Claude Desktop

1. Build your server:

```bash
npx tsc mcp/rag-server.ts --outDir dist/mcp --esModuleInterop
```

2. Find your Claude Desktop config:

```bash
# macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Windows
%APPDATA%\Claude\claude_desktop_config.json
```

3. Add your server:

```json
{
	"mcpServers": {
		"rag": {
			"command": "node",
			"args": ["/path/to/your/project/dist/mcp/rag-server.js"],
			"env": {
				"OPENAI_API_KEY": "your-key",
				"PINECONE_API_KEY": "your-key",
				"PINECONE_INDEX": "your-index"
			}
		}
	}
}
```

4. Restart Claude Desktop

5. You should see the RAG tools available in the tools menu

---

## Connecting to Cursor

1. Open Cursor Settings → MCP

2. Add server configuration:

```json
{
	"rag": {
		"command": "node",
		"args": ["/path/to/your/project/dist/mcp/rag-server.js"]
	}
}
```

3. Cursor will now have access to your RAG tools

---

## Testing Your Server

Use the MCP Inspector to test without Claude:

```bash
npx @modelcontextprotocol/inspector node dist/mcp/rag-server.js
```

This opens a web UI where you can:

- See available tools
- Call tools with test inputs
- View responses

---

## Example Conversation

Once connected, you can ask Claude:

```
User: Search my knowledge base for information about chunking strategies

Claude: I'll search your knowledge base for that.
[Calls search_knowledge_base with query: "chunking strategies"]

Based on your knowledge base, here's what I found about chunking strategies:

1. Fixed-size chunking splits documents into equal-sized pieces...
2. Semantic chunking preserves meaning by splitting at natural boundaries...
3. Overlap between chunks prevents losing context at boundaries...
```

---

## What's Next

You now have a working MCP server. Ideas to extend it:

- Add more tools (get_document, list_sources)
- Add authentication
- Expose resources (not just tools)
- Build custom prompts

---

## Key Takeaways

1. MCP lets AI assistants call your code directly
2. You define tools with schemas (like OpenAPI)
3. The AI decides when to call your tools
4. Works with Claude Desktop, Cursor, and other MCP clients
5. Your RAG becomes a reusable component
