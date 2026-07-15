import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createRagServer } from '../create-server';

// Fake retrieval — the same shape Pinecone returns, so no live keys needed.
const fakeMatches = [
	{
		score: 0.91,
		metadata: {
			text: 'Chunking splits documents into smaller pieces before embedding.',
			source: 'docs/chunking.md',
		},
	},
	{
		score: 0.82,
		metadata: {
			text: 'Overlap between chunks preserves context across boundaries.',
			source: 'docs/chunking.md',
		},
	},
];

async function connectClient() {
	const server = createRagServer(async (_query, topK = 5) =>
		fakeMatches.slice(0, topK)
	);
	const [clientTransport, serverTransport] =
		InMemoryTransport.createLinkedPair();
	const client = new Client({ name: 'test-client', version: '1.0.0' });
	await Promise.all([
		server.connect(serverTransport),
		client.connect(clientTransport),
	]);
	return client;
}

describe('rag MCP server', () => {
	it('exposes the search_docs tool over MCP', async () => {
		const client = await connectClient();
		const { tools } = await client.listTools();
		expect(tools.map((t) => t.name)).toContain('search_docs');
		await client.close();
	});

	it('returns retrieval results when the tool is called', async () => {
		const client = await connectClient();
		const res = await client.callTool({
			name: 'search_docs',
			arguments: { query: 'chunking', topK: 2 },
		});
		const text = (res.content as Array<{ text: string }>)[0].text;
		expect(text).toContain('Chunking splits documents');
		expect(JSON.parse(text)).toHaveLength(2);
		await client.close();
	});

	it('rejects out-of-bounds input via the schema', async () => {
		const client = await connectClient();
		let errored = false;
		try {
			const res = await client.callTool({
				name: 'search_docs',
				arguments: { query: 'x', topK: 999 },
			});
			errored = res.isError === true;
		} catch {
			errored = true;
		}
		expect(errored).toBe(true);
		await client.close();
	});
});
