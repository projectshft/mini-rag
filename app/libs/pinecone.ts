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
 * HOW IT WORKS:
 * 1. Text content gets converted to embeddings (arrays of ~1500 numbers) using AI models
 * 2. These embeddings capture the semantic meaning of the text
 * 3. When searching, your query also gets converted to an embedding
 * 4. The database finds the most similar embeddings using mathematical distance
 * 5. This returns content that's semantically similar to your query
 *
 * EXAMPLE: Searching for "climate change" might return articles about:
 * - "global warming" (similar meaning, different words)
 * - "carbon emissions" (related concept)
 * - "environmental policy" (contextually related)
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
import { openaiClient } from '@/app/libs/openai/openai';

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
	topK: number = 3 // TRY CHANGING: Increase to 5-10 for more results, decrease to 1-2 for fewer
): Promise<ScoredPineconeRecord<RecordMetadata>[]> => {
	// Connect to the 'linkedin' index (collection of vectors)
	// NOTE: This should probably be renamed to 'articles' to match the content!
	const index = pineconeClient.Index('linkedin');

	// Convert the search query into a vector embedding using OpenAI
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small', // TRY CHANGING: 'text-embedding-3-large' for better quality (costs more)
		input: query,
	});

	// Extract the actual embedding array from the API response
	const embedding = queryEmbedding.data[0].embedding;

	// Search the vector database for similar embeddings
	const docs = await index.query({
		vector: embedding,
		topK, // How many results to return
		includeMetadata: true, // Include the original text content with results
	});

	return docs.matches;
};
