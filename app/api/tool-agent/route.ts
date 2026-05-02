/**
 * Tool-Calling RAG Agent
 */

import { NextRequest } from 'next/server';
import { streamText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { searchDocuments } from '@/app/libs/weaviate';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
	token: process.env.COHERE_RERANKER_API_KEY,
});

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
				searchKnowledgeBase: {
					description:
						'Search the knowledge base for relevant documents about AI, coding, careers, or technical topics. Use this when users ask questions that need context from the knowledge base.',
					inputSchema: z.object({
						query: z
							.string()
							.describe('The search query to find relevant documents'),
						index: z
							.enum(['LinkedInPosts', 'MediumArticles', 'ScientificPapers'])
							.describe('Which knowledge base index to search'),
					}),
					execute: async ({ query, index }) => {
						console.log('\n🔧 Tool called: searchKnowledgeBase');
						console.log('📝 Query:', query);
						console.log('📂 Index:', index);
						const startTime = Date.now();

						try {
							const results = await searchDocuments(index, query, 10);

							if (results.length === 0) {
								console.log('⚠️  No documents found');
								return 'No relevant documents found.';
							}

							const documents = results
								.map((r) => r.properties.text || r.properties.abstract || '')
								.filter((t) => t.length > 0);

							if (documents.length === 0) {
								return 'No valid documents found.';
							}

							const reranked = await cohere.v2.rerank({
								documents,
								query,
								topN: 3,
								model: 'rerank-v4.0-pro',
							});

							const context = reranked.results
								.map(
									(result, i) =>
										`[Doc ${i + 1}]\n${documents[result.index]}`,
								)
								.join('\n\n---\n\n');

							console.log(
								'✅ Retrieved',
								reranked.results.length,
								'docs in',
								Date.now() - startTime,
								'ms\n',
							);

							return context;
						} catch (error) {
							console.error('❌ Tool error:', error);
							return 'Error searching knowledge base.';
						}
					},
				},
				getCurrentDate: {
					description: 'Get the current date and time',
					inputSchema: z.object({}),
					execute: async () => {
						return new Date().toISOString();
					},
				},
			},
			toolChoice: 'auto',
			stopWhen: stepCountIs(5),
			system: `You are a helpful AI assistant with access to a knowledge base containing:
- LinkedInPosts: Professional posts about tech careers, AI, and software development
- MediumArticles: Technical articles and tutorials
- ScientificPapers: Academic research papers

Use the searchKnowledgeBase tool when users ask questions that need context from the knowledge base.
For greetings and casual conversation, respond directly without using tools.

If asked to write content (like a LinkedIn post), search for examples first, then write in a similar style.
Always cite which source you're drawing information from.`,
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
