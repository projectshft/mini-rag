/**
 * WEAVIATE VECTOR DATABASE INTEGRATION
 *
 * This file handles interactions with Weaviate, an open-source vector database.
 *
 * WHAT IS WEAVIATE?
 * Weaviate is a cloud-native, modular, real-time vector database built to scale
 * your machine learning models. Like Pinecone, it stores high-dimensional embeddings
 * and enables semantic search, but it's open-source and can be self-hosted or used
 * via Weaviate Cloud Services (WCS).
 *
 * KEY FEATURES:
 * - Open-source and self-hostable
 * - Built-in vectorization modules (or bring your own embeddings)
 * - Hybrid search (vector + keyword)
 * - GraphQL and REST APIs
 * - Multi-tenancy support
 *
 * Learn more: https://weaviate.io/developers/weaviate
 *
 * EXPERIMENT: Try using hybrid search or different vector similarity metrics!
 */

import weaviate, { WeaviateClient } from 'weaviate-client';
import { openaiClient } from '../libs/openai/openai';

let clientInstance: WeaviateClient | null = null;

/**
 * Get or create Weaviate client instance
 */
async function getWeaviateClient(): Promise<WeaviateClient> {
	if (!clientInstance) {
		clientInstance = await weaviate.connectToWeaviateCloud(
			process.env.WEAVIATE_URL as string,
			{
				authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY as string),
			}
		);
	}
	return clientInstance;
}

/**
 * Interface for search results from Weaviate
 */
export interface WeaviateSearchResult {
	id: string;
	properties: Record<string, any>;
	metadata: {
		score?: number;
		distance?: number;
		certainty?: number;
	};
}

/**
 * Searches for semantically similar documents in Weaviate
 *
 * @param collectionName - The name of the Weaviate collection/class to search
 * @param query - The search query (will be converted to embeddings)
 * @param topK - Number of most similar results to return (default: 3)
 * @returns Array of matching documents with similarity scores
 */
export const searchDocuments = async (
	collectionName: string,
	query: string,
	topK: number = 3
): Promise<WeaviateSearchResult[]> => {
	const client = await getWeaviateClient();

	// Get the collection
	const collection = client.collections.get(collectionName);

	// Convert query to embedding
	const embeddingResponse = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 1536,
		input: query,
	});

	const queryVector = embeddingResponse.data[0].embedding;

	// Query the collection with nearVector search
	const result = await collection.query.nearVector(queryVector, {
		limit: topK,
		returnMetadata: ['distance'],
	});

	// Format and return results
	return result.objects.map((obj) => ({
		id: obj.uuid.toString(),
		properties: obj.properties,
		metadata: {
			distance: obj.metadata?.distance,
			certainty: obj.metadata?.certainty,
		},
	}));
};

/**
 * Inserts documents into Weaviate collection
 *
 * @param collectionName - The name of the collection to insert into
 * @param documents - Array of documents with text content and metadata
 * @returns Array of inserted object UUIDs
 */
export const insertDocuments = async (
	collectionName: string,
	documents: Array<{ text: string; metadata: Record<string, any> }>
): Promise<string[]> => {
	const client = await getWeaviateClient();

	// Get the collection
	const collection = client.collections.get(collectionName);

	// Generate embeddings for all documents
	const embeddingResponse = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 1536,
		input: documents.map((doc) => doc.text),
	});

	// Prepare objects with vectors
	const objects = documents.map((doc, idx) => ({
		properties: {
			text: doc.text,
			...doc.metadata,
		},
		vectors: {
			default: embeddingResponse.data[idx].embedding,
		},
	}));

	// Insert into Weaviate
	const result = await collection.data.insertMany(objects);

	// Return UUIDs of inserted objects
	const uuids = result.uuids;
	if (Array.isArray(uuids)) {
		return uuids.map((uuid: any) => uuid.toString());
	}
	return Object.values(uuids).map((uuid: any) => uuid.toString());
};
