import { NextRequest, NextResponse } from 'next/server';
import { DataProcessor } from '@/app/libs/dataProcessor';
import { openaiClient } from '@/app/libs/openai/openai';
import { pineconeClient } from '@/app/libs/pinecone';
import { z } from 'zod';

const uploadDocumentSchema = z.object({
	urls: z.array(z.string().url()).min(1),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// TODO: Step 1 - Parse and validate the request body
		// Use uploadDocumentSchema.parse() to validate the incoming request
		// Extract the 'urls' array from the parsed body

		// TODO: Step 2 - Scrape and chunk the content
		// Create a new DataProcessor instance
		// Use processor.processUrls() to scrape and chunk the URLs
		// This returns an array of text chunks with metadata

		// TODO: Step 3 - Check if we got any content
		// If chunks.length === 0, return an error response
		// Status should be 400 with appropriate error message

		// TODO: Step 4 - Get Pinecone index
		// Use pineconeClient.Index() to get your index
		// The index name comes from process.env.PINECONE_INDEX

		// TODO: Step 5 - Process chunks in batches
		// Pinecone recommends batching uploads (100 at a time)
		// Loop through chunks in batches

		// TODO: Step 6 - Generate embeddings for each batch
		// Use openaiClient.embeddings.create()
		// Model: 'text-embedding-3-small'
		// Dimensions: 512
		// Input: array of chunk.content strings from the batch

		// TODO: Step 7 - Prepare vectors for Pinecone
		// Map each chunk to a vector object with:
		// - id: chunk.id
		// - values: the embedding array from embeddingResponse.data[idx].embedding
		// - metadata: { text: chunk.content, ...chunk.metadata }
		// IMPORTANT: Include text: chunk.content so the actual text is searchable!

		// TODO: Step 8 - Upload to Pinecone
		// Use index.upsert() to upload the vectors array
		// Increment successCount by batch.length

		// TODO: Step 9 - Return success response
		// Return NextResponse.json() with:
		// - success: true
		// - chunksProcessed: chunks.length
		// - vectorsUploaded: successCount
		// - status: 200

		throw new Error('Upload document not fully implemented yet!');
	} catch (error) {
		console.error('Error uploading documents:', error);
		return NextResponse.json(
			{ error: 'Failed to upload documents' },
			{ status: 500 }
		);
	}
}
