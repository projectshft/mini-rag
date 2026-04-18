import { searchDocuments } from '@/app/libs/weaviate';
import { NextRequest, NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
	token: process.env.COHERE_RERANKER_API_KEY,
});

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const body = await request.json();
		const { query, topK = 5 } = body;

		// Search both collections
		const linkedinResults = await searchDocuments(
			'LinkedInPosts',
			query,
			topK,
		);

		const articleResults = await searchDocuments(
			'MediumArticles',
			query,
			topK,
		);

		// Combine results
		const combinedResults = [...linkedinResults, ...articleResults];

		// Extract text for reranking
		const documents = combinedResults.map(
			(result) => result.properties.text || '',
		);

		// Rerank with Cohere
		const rerank = await cohere.v2.rerank({
			documents,
			query,
			topN: 3,
			model: 'rerank-v4.0-pro',
		});

		// Map reranked results back to original objects with scores
		const rerankedResults = rerank.results.map((result) => ({
			...combinedResults[result.index],
			rerankScore: result.relevanceScore,
		}));

		return NextResponse.json({
			query,
			resultsCount: rerankedResults.length,
			results: rerankedResults,
			originalResults: combinedResults,
		});
	} catch (error) {
		console.error('Error in RAG test endpoint:', error);
		return NextResponse.json(
			{ error: 'Failed to process query' },
			{ status: 500 },
		);
	}
}
