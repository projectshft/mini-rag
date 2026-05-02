import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { indexSchema, IndexType } from '@/app/agents/types';
import { searchDocuments, WeaviateSearchResult } from '@/app/libs/weaviate';
import { CohereClient } from 'cohere-ai';
import * as ai from 'ai';
import { openai } from '@ai-sdk/openai';
import { Client } from 'langsmith';
import { wrapAISDK } from 'langsmith/experimental/vercel';

const client = new Client();
const { streamText } = wrapAISDK(ai, { client });

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
/**
 * Gets the main text content from a result, handling different property names
 */
function getTextContent(result: TaggedResult): string {
	return (result.properties.text || result.properties.abstract || '').trim();
}

async function rerankIndexResults(
	results: TaggedResult[],
	query: string,
	topN: number,
): Promise<TaggedResult[]> {
	// Filter out results with empty or whitespace-only text
	const validResults = results.filter((r) => getTextContent(r).length > 0);

	if (validResults.length === 0) return [];

	const documents = validResults.map((result) => getTextContent(result));

	const rerank = await cohere.v2.rerank({
		documents,
		query,
		topN: Math.min(topN, validResults.length),
		model: 'rerank-v4.0-pro',
	});

	return rerank.results.map((result) => ({
		...validResults[result.index],
		rerankScore: result.relevanceScore,
	}));
}

/**
 * Deduplicates results based on text content
 */
function deduplicateResults(
	resultsByIndex: Map<IndexType, TaggedResult[]>,
): Map<IndexType, TaggedResult[]> {
	const seenTexts = new Set<string>();
	const dedupedMap = new Map<IndexType, TaggedResult[]>();

	for (const [indexName, results] of resultsByIndex) {
		const uniqueResults = results.filter((r) => {
			const text = getTextContent(r);
			if (seenTexts.has(text)) return false;
			seenTexts.add(text);
			return true;
		});
		dedupedMap.set(indexName, uniqueResults);
	}

	return dedupedMap;
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

		const texts = results
			.map(
				(r, i) =>
					`<EXAMPLE_${i + 1}>\n${getTextContent(r)}\n</EXAMPLE_${i + 1}>`,
			)
			.join('\n\n');
		sections.push(
			`--- <START_OF_INDEX> ${indexName} ---\n${texts}\n--- <END_OF_INDEX> ---`,
		);
	}

	return sections.join('\n\n');
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { indexes, query } = chatSchema.parse(body);

		const topKPerIndex = 15;
		const topNAfterRerank = 5;

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

		// Build map of index -> top reranked results
		const resultsByIndex = new Map<IndexType, TaggedResult[]>();
		for (const { indexName, results } of rerankedResults) {
			resultsByIndex.set(indexName, results);
		}

		// Deduplicate across all indexes
		const dedupedResults = deduplicateResults(resultsByIndex);

		// Create context string from deduplicated results
		const context = buildContextString(dedupedResults);

		console.log({ context });

		return streamText({
			model: openai('gpt-4'),
			temperature: 0.7,
			system: `You are a ghostwriter. You write LinkedIn posts AS the author whose examples are provided.

You must:
- Write in FIRST PERSON as if you ARE the author
- Borrow the author's real experiences, opinions, and stories from the examples
- Match their writing style
- Use their voice: conversational, direct, opinionated

STYLE RULES (extract from examples):
- Short, punchy sentences (one idea per line)
- Frequent line breaks
- Opening hooks (bold statements, provocative questions)
- Personal anecdotes that lead to insights
- No corporate speak
`,
			prompt: `User query: ${query}

THE AUTHOR'S PREVIOUS POSTS (use their experiences and voice):
${context}

Write a NEW LinkedIn post about the topic above AS THIS AUTHOR.
- Borrow their real experiences and opinions
- Match their tone and rhythm
- Write in first person as if you lived their career
- You can re-use exact language from the examples if it fits the topic and style of the author.
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
