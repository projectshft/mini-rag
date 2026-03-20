/**
 * Tool-Calling RAG Agent (Exploration)
 *
 * This demonstrates tool-calling where the AI decides when to retrieve context.
 */

import { NextRequest } from 'next/server';
import { streamText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { messages } = body;

		if (!messages || !Array.isArray(messages)) {
			return new Response(
				JSON.stringify({ error: 'Messages array is required' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		console.log('\n🤖 Tool-calling agent started');
		console.log('💬 Message count:', messages.length);
		console.log(
			'📝 Latest message:',
			messages[messages.length - 1]?.content,
		);

		const result = await streamText({
			model: openai('gpt-4o'),
			tools: {
				search_documentation: {
					description:
						'Search documentation for technical information about React hooks, components, and APIs. Use when users ask programming questions.',
					inputSchema: z.object({
						query: z
							.string()
							.describe('The technical query to search for'),
					}),
					execute: async ({ query }) => {
						console.log('\n🔧 Tool called: search_documentation');
						console.log('📝 Query:', query);
						const startTime = Date.now();

						try {
							// Generate embedding
							const embeddingResponse =
								await openaiClient.embeddings.create({
									model: 'text-embedding-3-small',
									input: query,
									dimensions: 512,
								});
							const embedding =
								embeddingResponse.data[0].embedding;

							// Search Pinecone
							const index = pineconeClient.Index(
								process.env.PINECONE_INDEX!,
							);
							const queryResponse = await index.query({
								vector: embedding,
								topK: 10,
								includeMetadata: true,
							});

							// Extract documents
							const documents = queryResponse.matches
								.map(
									(match) =>
										match.metadata?.content as string,
								)
								.filter(Boolean);

							if (documents.length === 0) {
								console.log('⚠️  No documents found');
								return 'No relevant documentation found.';
							}

							// Rerank
							const reranked =
								await pineconeClient.inference.rerank(
									'bge-reranker-v2-m3',
									query,
									documents,
									{ topN: 5, returnDocuments: true },
								);

							console.log(
								'\n📊 Reranked',
								JSON.stringify(reranked.data, null, 2),
							);

							const context = reranked.data
								.map(
									(result, i) =>
										`[Doc ${i + 1}]\n${result.document?.text || ''}`,
								)
								.filter(Boolean)
								.join('\n\n---\n\n');

							console.log(
								'✅ Retrieved',
								reranked.data.length,
								'docs in',
								Date.now() - startTime,
								'ms\n',
							);
							return context;
						} catch (error) {
							console.error('❌ Tool error:', error);
							return 'Error searching documentation.';
						}
					},
				},
			},
			toolChoice: 'auto',
			stopWhen: stepCountIs(5),
			system: `You are a helpful React programming assistant.

Use the search_documentation tool when users ask technical questions about React.
For greetings and casual conversation, respond directly without using tools.`,
			messages,
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error('❌ Error:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return new Response(
			JSON.stringify({ error: 'Failed to process request', details: message }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		);
	}
}
