import { NextRequest, NextResponse } from 'next/server';
import { chunkText } from '@/app/libs/chunking';
import { openaiClient } from '@/app/libs/openai/openai';
import { pineconeClient } from '@/app/libs/pinecone';

export async function POST(request: NextRequest) {
	// TODO: Implement the text upload endpoint
	//
	// Steps:
	// 1. Parse request body and extract 'text' field
	// 2. Validate that text exists and is a string (return 400 if not)
	// 3. Chunk the text using chunkText() with size 500, overlap 50, source 'user-text'
	// 4. Return 400 if no chunks created
	// 5. Generate embeddings using openaiClient.embeddings.create()
	//    - Model: 'text-embedding-3-small', Dimensions: 512
	// 6. Prepare vectors for Pinecone: { id, values, metadata: { text, source, ... } }
	// 7. Upload vectors to Pinecone using index.upsert()
	// 8. Return success JSON with vectorsUploaded, chunksCreated, textLength
	// 9. Wrap in try/catch - return 500 on error

	throw new Error('Upload text endpoint not implemented yet!');
}
