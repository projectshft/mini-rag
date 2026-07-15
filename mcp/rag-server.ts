#!/usr/bin/env node
import 'dotenv/config';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { searchDocuments } from '../app/libs/pinecone';
import { createRagServer } from './create-server';

/**
 * RAG MCP Server — entry point.
 *
 * Wires the `search_docs` tool (see create-server.ts) to this repo's real,
 * Pinecone-backed `searchDocuments` (which embeds at 512 dimensions to match
 * the course index). This is the file Claude Code / Cursor / the Inspector run.
 *
 *   npx tsx mcp/rag-server.ts
 */
async function main() {
	const server = createRagServer(searchDocuments);
	await server.connect(new StdioServerTransport());
	// stdout is reserved for JSON-RPC — log to stderr only.
	console.error('rag-server running on stdio');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
