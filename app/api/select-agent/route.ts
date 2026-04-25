import { NextRequest, NextResponse } from 'next/server';
import { openaiClient } from '@/app/libs/openai/openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { messageSchema, indexSchema } from '@/app/agents/types';

const selectAgentSchema = z.object({
	messages: z.array(messageSchema).min(1),
});

const indexSelectionSchema = z.object({
	indexes: z
		.array(indexSchema)
		.min(1)
		.max(3)
		.describe('Indexes to search, ordered by relevance'),
	query: z.string().describe('Refined search query optimized for retrieval'),
});

const fewShotExamples = `
Examples:

User: "What are some good LinkedIn post ideas for developers?"
Output: {"indexes": ["LinkedInPosts"], "query": "developer LinkedIn post ideas engagement"}

User: "Find articles about machine learning trends"
Output: {"indexes": ["MediumArticles", "ScientificPapers"], "query": "machine learning trends recent developments"}

User: "What does the latest research say about transformer architectures?"
Output: {"indexes": ["ScientificPapers"], "query": "transformer architecture research advances"}

User: "How do I write engaging content for both LinkedIn and Medium?"
Output: {"indexes": ["LinkedInPosts", "MediumArticles"], "query": "engaging content writing tips social media"}

User: "What programming tutorials are available about React?"
Output: {"indexes": ["MediumArticles"], "query": "React programming tutorial guide"}

User: "Show me research papers and articles about neural networks"
Output: {"indexes": ["ScientificPapers", "MediumArticles"], "query": "neural networks deep learning"}
`;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = selectAgentSchema.parse(body);
		const { messages } = parsed;

		// Take last 5 messages for context
		const recentMessages = messages.slice(-5);

		//TODO
	} catch (error) {
		console.error('Error selecting indexes:', error);
		return NextResponse.json(
			{ error: 'Failed to select indexes' },
			{ status: 500 },
		);
	}
}
