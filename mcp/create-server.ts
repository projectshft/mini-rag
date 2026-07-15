import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * The only thing the server needs from your retrieval layer: given a query,
 * return an array of matches with a score and metadata (text/source).
 * This matches the shape of `searchDocuments` in app/libs/pinecone.ts, but
 * keeping it as an injected function means we can test the server with a fake
 * search (no live Pinecone/OpenAI keys required).
 */
export type SearchFn = (
	query: string,
	topK?: number
) => Promise<Array<{ score?: number; metadata?: Record<string, unknown> | null }>>;

export function createRagServer(search: SearchFn): McpServer {
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
			const matches = await search(query, topK);
			const results = matches.map((m) => ({
				score: m.score,
				text: (m.metadata?.text ?? m.metadata?.content) as string | undefined,
				source: m.metadata?.source as string | undefined,
			}));
			return {
				content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
			};
		}
	);

	return server;
}
