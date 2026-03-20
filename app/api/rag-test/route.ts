import { searchDocuments } from '@/app/libs/pinecone';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { query, topK } = body;

	const results = await searchDocuments(query, topK);

	const formattedResults = results.map((doc) => ({
		id: doc.id,
		score: doc.score,
		// Check both 'text' (standard) and 'content' (legacy) field names
		content: doc.metadata?.text ?? doc.metadata?.content ?? '',
		source: doc.metadata?.source || 'unknown',
		chunkIndex: doc.metadata?.chunkIndex,
		totalChunks: doc.metadata?.totalChunks,
	}));

	return NextResponse.json({
		query,
		resultsCount: formattedResults.length,
		results: formattedResults,
	});
}
