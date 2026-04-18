import { searchDocuments } from '@/app/libs/weaviate';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	// TODO: Implement the RAG test endpoint
	//
	// Steps:
	// 1. Parse request body and extract query and topK
	// 2. Call searchDocuments() with query and topK
	// 3. Format results: map each doc to { id, score, content, source, chunkIndex, totalChunks }
	// 4. Return JSON with query, resultsCount, and formatted results

	throw new Error('RAG test endpoint not implemented yet!');
}
