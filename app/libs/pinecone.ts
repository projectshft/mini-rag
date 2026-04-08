/**
 * PINECONE VECTOR DATABASE INTEGRATION
 *
 * This file handles interactions with Pinecone, a managed vector database service.
 *
 * WHAT IS A VECTOR DATABASE?
 * Vector databases store high-dimensional numerical representations (embeddings) of data.
 * Unlike traditional databases that store exact text/numbers, vector DBs store "meanings"
 * as mathematical vectors. This enables semantic search - finding content by meaning
 * rather than exact keyword matches.
 *
 *
 * Learn more: https://docs.pinecone.io/docs/overview
 *
 * EXPERIMENT: Try changing the embedding model or topK values below!
 */

import {
	Pinecone,
	RecordMetadata,
	ScoredPineconeRecord,
} from '@pinecone-database/pinecone';
import { openaiClient } from '../libs/openai/openai';

// Initialize Pinecone client with your API key
// Get your free API key at: https://app.pinecone.io/
export const pineconeClient = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY as string,
});

/**
 * Searches for semantically similar documents in the vector database
 *
 * @param query - The search query (will be converted to embeddings)
 * @param topK - Number of most similar results to return (try 3-10)
 * @returns Array of matching documents with similarity scores
 */
export const searchDocuments = async (
	query: string,
	topK: number = 3
): Promise<ScoredPineconeRecord<RecordMetadata>[]> => {
	// TODO: Implement semantic search in Pinecone
	//
	// Steps:
	// 1. Connect to the Pinecone index using pineconeClient.Index()
	// 2. Convert the search query to an embedding using openaiClient.embeddings.create()
	//    - Model: 'text-embedding-3-small', Dimensions: 512
	// 3. Query the Pinecone index with the embedding vector
	//    - Use topK to limit results, include metadata
	// 4. Return docs.matches

	throw new Error('searchDocuments not implemented yet!');
};
