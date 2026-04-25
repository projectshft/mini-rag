import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { indexSchema, IndexType } from '@/app/agents/types';
import { searchDocuments, WeaviateSearchResult } from '@/app/libs/weaviate';
import { CohereClient } from 'cohere-ai';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const cohere = new CohereClient({
	token: process.env.COHERE_RERANKER_API_KEY,
});

const chatSchema = z.object({
	indexes: z.array(indexSchema).min(1).max(3),
	query: z.string(),
});

interface TaggedResult extends WeaviateSearchResult {
	sourceIndex: IndexType;
	rerankScore?: number;
}

/**
 * Reranks results within a single index
 * Returns top N results from that index
 */
async function rerankIndexResults(
	results: TaggedResult[],
	query: string,
	topN: number,
): Promise<TaggedResult[]> {
	if (results.length === 0) return [];

	const documents = results.map((result) => result.properties.text || '');

	const rerank = await cohere.v2.rerank({
		documents,
		query,
		topN: Math.min(topN, results.length),
		model: 'rerank-v4.0-pro',
	});

	return rerank.results.map((result) => ({
		...results[result.index],
		rerankScore: result.relevanceScore,
	}));
}

/**
 * Builds a context string from results, grouped by source
 */
function buildContextString(
	resultsByIndex: Map<IndexType, TaggedResult[]>,
): string {
	const sections: string[] = [];

	for (const [indexName, results] of resultsByIndex) {
		if (results.length === 0) continue;

		const texts = results.map((r) => r.properties.text || '').join('\n\n');
		sections.push(`--- ${indexName} ---\n${texts}`);
	}

	return sections.join('\n\n');
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { indexes, query } = chatSchema.parse(body);

		const topKPerIndex = 5;
		const topNAfterRerank = 2; // Top 2 from each index

		// Query all indexes in PARALLEL
		const searchPromises = indexes.map(async (indexName) => {
			const results = await searchDocuments(
				indexName,
				query,
				topKPerIndex,
			);
			return {
				indexName,
				results: results.map((result) => ({
					...result,
					sourceIndex: indexName,
				})) as TaggedResult[],
			};
		});

		const searchResults = await Promise.all(searchPromises);

		// Rerank each index in PARALLEL, take top 2 from each
		const rerankPromises = searchResults.map(
			async ({ indexName, results }) => {
				const reranked = await rerankIndexResults(
					results,
					query,
					topNAfterRerank,
				);
				return { indexName, results: reranked };
			},
		);

		const rerankedResults = await Promise.all(rerankPromises);

		// Build map of index -> top 2 reranked results
		const resultsByIndex = new Map<IndexType, TaggedResult[]>();
		for (const { indexName, results } of rerankedResults) {
			resultsByIndex.set(indexName, results);
		}

		// Create context string from all results
		const context = buildContextString(resultsByIndex);

		console.log({ context });

		return streamText({
			model: openai('ft:gpt-4o-mini-2024-07-18:personal::DLGMt8ek'),
			temperature: 1,
			system: `
			Write a linkedin post about the topic the user
			requests and use the available sources to mimic
			the tone and style of the author'
			
			Scientific paper resources can be used as citations or
			as additional information for more authority`,
			prompt: `
			Give response to user query: ${query}
			Here is the data:
			${context}

			Use the examples from above to mimic the style and tone of the author. NO EMOJIS!!!!
			`,
		}).toTextStreamResponse();
	} catch (error) {
		console.error('Error in chat endpoint:', error);
		return NextResponse.json(
			{ error: 'Failed to process query' },
			{ status: 500 },
		);
	}
}
