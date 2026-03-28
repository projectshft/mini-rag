import { AgentRequest, AgentResponse } from './types';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function ragAgent(request: AgentRequest): Promise<AgentResponse> {
	// Step 1: Generate embedding for the refined query
	const embeddingResponse = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 512,
		input: request.query,
	});

	const embedding = embeddingResponse.data[0].embedding;

	// Step 2: Query Pinecone for similar documents
	const index = pineconeClient.Index(process.env.PINECONE_INDEX!);

	const queryResponse = await index.query({
		vector: embedding,
		topK: 10,
		includeMetadata: true,
	});

	// Step 3: Extract text from results
	const documents = queryResponse.matches
		.map((match) => (match.metadata?.text ?? match.metadata?.content) as string)
		.filter(Boolean);

	// Step 4: Rerank with Pinecone inference API
	const reranked = await pineconeClient.inference.rerank(
		'bge-reranker-v2-m3',
		request.query,
		documents
	);

	// Step 5: Build context from reranked results
	const retrievedContext = reranked.data
		.map((result) => result.document?.text)
		.filter(Boolean)
		.join('\n\n');

	// Step 6: Create system prompt
	const systemPrompt = `You are a helpful assistant that answers questions based on the provided context.

Original user request: "${request.originalQuery}"
Refined query: "${request.query}"

Context from documentation:
${retrievedContext}

Use the context above to answer the user's question. If the context doesn't contain enough information, say so clearly.`;

	// Step 7: Stream the response
	return streamText({
		model: openai('gpt-4o'),
		system: systemPrompt,
		messages: request.messages,
	});
}
