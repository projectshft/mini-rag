import {
	Pinecone,
	RecordMetadata,
	ScoredPineconeRecord,
} from '@pinecone-database/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';

export const pineconeClient = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY as string,
});

export const searchDocuments = async (
	query: string,
	topK: number = 3
): Promise<ScoredPineconeRecord<RecordMetadata>[]> => {
	const index = pineconeClient.Index('linkedin');
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-ada-002',
		input: query,
	});

	const embedding = queryEmbedding.data[0].embedding;

	const docs = await index.query({
		vector: embedding,
		topK,
		includeMetadata: true,
	});

	return docs.matches;
};
