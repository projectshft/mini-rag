import { openaiClient } from '../openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY!,
});

type ContentMetadata = {
	content: string;
	url: string;
	title: string;
	source: string;
};

/**
 * VECTOR SEARCH FUNCTION
 *
 * This is the "Retrieval" part of RAG - finding relevant documents
 * based on semantic similarity rather than keyword matching.
 */
async function searchVectors(query: string) {
	console.log(
		'Starting search with API key:',
		process.env.PINECONE_API_KEY?.slice(0, 5) + '...'
	);

	// Connect to the knowledge base index in Pinecone
	const index = pinecone.Index('knowledge-base');

	console.log('Getting embeddings for query:', query);

	// Convert the user's question into a vector embedding
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		input: query,
	});

	// Search for the most similar content in the vector database
	const searchResults = await index.query({
		vector: queryEmbedding.data[0].embedding,
		topK: 5,
		includeMetadata: true,
	});

	// Extract just the content from the search results
	return (
		searchResults.matches
			?.map((match) => {
				const metadata = match.metadata as ContentMetadata;
				return {
					content: metadata?.content,
					source: metadata?.source || metadata?.url,
					title: metadata?.title,
				};
			})
			.filter((item) => item.content) || []
	);
}

/**
 * MAIN RAG AGENT FUNCTION
 *
 * This is the "Generation" part of RAG - using retrieved content
 * to generate a comprehensive, grounded response.
 */
export async function processContentQuery(query: string, model: string) {
	// Step 1: Retrieve relevant content using vector search
	const relevantContent = await searchVectors(query);

	// Format the content for the prompt
	const formattedContent = relevantContent
		.map(
			(item) => `SOURCE: ${item.title || item.source}\n\n${item.content}`
		)
		.join('\n\n---\n\n');

	// Step 2: Generate response using retrieved content as context
	const response = await openaiClient.chat.completions.create({
		model: model,
		messages: [
			{
				role: 'system',
				content: `You are a knowledgeable assistant that provides accurate information based on the content in your knowledge base.
				Use the provided content to answer the user's query.
				If the provided content doesn't contain relevant information, say so and provide a general response.
				Always cite your sources when possible.
				Present information in a clear, organized manner.
				If there are multiple perspectives on a topic, present them fairly.`,
			},
			{
				role: 'user',
				content: `Query: ${query}\n\nRelevant content from knowledge base:\n${formattedContent}`,
			},
		],
	});

	return response.choices[0].message.content;
}

// Export the old function name for backward compatibility
export const processNewsQuery = processContentQuery;
