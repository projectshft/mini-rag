import { NextRequest, NextResponse } from 'next/server';
import { openaiClient } from '@/app/libs/openai/openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { messageSchema } from '@/app/agents/types';

const selectAgentSchema = z.object({
	messages: z.array(messageSchema).min(1),
});

// tell me the weather in france

const indexSelectionSchema = z.object({
	indexes: z
		.array(
			z
				.enum(['LinkedInPosts', 'MediumArticles', 'ScientificPapers'])
				.describe('Knowledge base index to search'),
		)
		.max(3)
		.nullable()
		.describe('Indexes to search in a vector database'),
	query: z
		.string()
		.describe(
			'Refined search query with corrected spelling and succinct intent',
		),
	reasoning: z
		.string()
		.describe('the reason you chose the vector indexes that you did'),
	confidenceScore: z
		.number()
		.min(1)
		.max(10)
		.describe(
			'on a scale of 1 - 10, how confident are you in the indexes you chose?',
		),
});

const fewShotExamples = `
Examples:

User: "What are some good LinkedIn post ideas for developers?"
Output: {"indexes": ["LinkedInPosts"], "query": "developer LinkedIn post ideas engagement"}

User: "Find articles about machine learning trends"
Output: {"indexes": ["MediumArticles", ""LinkedInPosts", "ScientificPapers"], "query": "machine learning trends recent developments"}

User: "What does the latest research say about transformer architectures?"
Output: {"indexes": ["ScientificPapers"], "query": "transformer architecture research advances"}

User: "How do I write engaging content for both LinkedIn and Medium?"
Output: {"indexes": ["LinkedInPosts", "MediumArticles"], "query": "engaging content writing tips social media"}

User: "What programming tutorials are available about React?"
Output: {"indexes": ["MediumArticles", "LinkedInPosts"], "query": "React programming tutorial guide"}

User: "Show me research papers and articles about neural networks"
Output: {"indexes": ["ScientificPapers", "MediumArticles", "LinkedInPosts"], "query": "neural networks deep learning"}
`;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = selectAgentSchema.parse(body);
		const { messages } = parsed;

		console.log({ messages });

		// Take last 5 messages for context
		const recentMessages = messages.slice(-5);

		// ehy gimme ai article

		// response....

		// no more on python

		// wre ost on typscrit and AI and why it sucks
		// decide which indexes and refine the query

		const response = await openaiClient.responses.parse({
			model: 'gpt-4o-mini',
			input: [
				{
					role: 'system',
					content: `
					You will 0 - 4 indices from a vector database to search for content
					If the user query is not related to AI, coding careers, or outside the scope of 
					software and/or AI content then DO NOT pick an index.

					Here are examples to help make that decisions
					${JSON.stringify(fewShotExamples)}
					`,
				},
				{
					role: 'user',
					content: `Here are the last 5 message: ${JSON.stringify(recentMessages)}`,
				},
			],
			temperature: 0.1,
			text: {
				format: zodTextFormat(indexSelectionSchema, 'indexSelection'),
			},
		});

		console.log(response.output_parsed, 'OUTPUT');

		return NextResponse.json({
			indexes: response.output_parsed?.indexes,
			query: response.output_parsed?.query,
		});
	} catch (error) {
		console.error('Error selecting indexes:', error);
		return NextResponse.json(
			{ error: 'Failed to select indexes' },
			{ status: 500 },
		);
	}
}
