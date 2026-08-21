/**
 * MCP SERVER — exposes the RAG retrieval pipeline as a tool.
 *
 * Runs over stdio: the client (Claude Desktop, MCP Inspector, Claude Code)
 * spawns this file and speaks JSON-RPC on stdin/stdout. stdout IS the
 * protocol — never console.log here, or you corrupt the stream. Use
 * console.error; the client shows stderr in its notifications pane.
 *
 * Env comes from `import 'dotenv/config'` in app/libs/openai/openai.ts.
 * Calling dotenv's config() at the top of THIS file would be too late:
 * TypeScript compiles imports to require() calls that hoist above it, so
 * the OpenAI client is constructed before the .env file is ever read.
 *
 * Try it:  npx @modelcontextprotocol/inspector npx ts-node app/mcp/server.ts
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { searchDocuments } from '../libs/pinecone';
import z from 'zod';

const server = new McpServer({
	name: 'ai-research-assistant',
	version: '1.0.0',
	description: 'AI Research Assistant',
});

server.registerTool(
	'search-vector-database',
	{
		// The model reads this description to decide whether to call the tool.
		// It's a prompt, not a label — vague here means the tool never fires.
		description:
			'Search a vector database for relevant information about open source AI libraries and tools like Pinecone, Langchain, Vercel AI SDK, etc.',
		inputSchema: {
			query: z
				.string()
				.describe(
					'The query to search the vector database for (example: how does vector search work in Pinecone)',
				),
		},
		outputSchema: {
			results: z.array(
				z.object({
					title: z.string().describe('The title of the result'),
					content: z.string().describe('The content of the result'),
				}),
			),
		},
	},
	async ({ query }) => {
		const results = await searchDocuments(query, 5);

		const structuredContent = {
			results: results.map((result) => ({
				title: String(result.metadata?.title ?? ''),
				content: String(result.metadata?.content ?? ''),
			})),
		};

		// Both shapes on purpose: structuredContent is the typed payload that
		// matches outputSchema, and the text block is the fallback for clients
		// that predate it (spec revision 2025-06-18).
		return {
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify(structuredContent, null, 2),
				},
			],
			structuredContent,
		};
	},
);

server.connect(new StdioServerTransport());
