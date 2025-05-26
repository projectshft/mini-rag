/**
 * NEWS AGENT - RAG (Retrieval Augmented Generation) IMPLEMENTATION
 *
 * This agent demonstrates RAG, a powerful technique that combines:
 * 1. Information Retrieval (finding relevant documents)
 * 2. Text Generation (using retrieved context to answer questions)
 *
 * HOW RAG WORKS:
 * 1. User asks a question about news/current events
 * 2. Convert question to vector embedding
 * 3. Search vector database for semantically similar content
 * 4. Retrieve the most relevant articles
 * 5. Feed retrieved articles + question to LLM for final answer
 *
 * WHY RAG IS POWERFUL:
 * - Gives AI access to current, specific information
 * - Reduces hallucinations by grounding responses in real data
 * - Can cite sources and provide evidence
 * - Updates knowledge without retraining the model
 *
 * EXPERIMENT IDEAS:
 * - Change topK to retrieve more/fewer articles
 * - Modify the system prompt for different response styles
 * - Add temperature parameter for more creative responses
 * - Filter results by bias, date, or source
 * - Implement re-ranking of search results
 *
 * Learn more about RAG: https://platform.openai.com/docs/guides/prompt-engineering
 */

import { openaiClient } from '../openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY!,
});

type NewsMetadata = {
	content: string;
	bias: string;
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

	// Connect to the articles index in Pinecone
	const index = pinecone.Index('articles');

	console.log('Getting embeddings for query:', query);

	// Convert the user's question into a vector embedding
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small', // TRY CHANGING: 'text-embedding-3-large' for better quality
		input: query,
	});

	// Search for the most similar articles in the vector database
	const searchResults = await index.query({
		vector: queryEmbedding.data[0].embedding,
		topK: 5, // TRY CHANGING: 3-10 articles. More = more context but longer prompts
		includeMetadata: true, // Get the original article text, not just similarity scores
	});

	// Extract just the article content from the search results
	return (
		searchResults.matches
			?.map((match) => (match.metadata as NewsMetadata)?.content)
			.filter(Boolean) || []
	);
}

/**
 * MAIN NEWS AGENT FUNCTION
 *
 * This is the "Generation" part of RAG - using retrieved articles
 * to generate a comprehensive, grounded response.
 */
export async function processNewsQuery(query: string, model: string) {
	// Step 1: Retrieve relevant articles using vector search
	const relevantNews = await searchVectors(query);

	// Step 2: Generate response using retrieved articles as context
	const response = await openaiClient.chat.completions.create({
		model: model, // Usually 'gpt-4o-mini' - defined in agent config
		// TRY ADDING: temperature: 0.7, // Controls creativity (0.0 = deterministic, 1.0 = very creative)
		// TRY ADDING: max_tokens: 500, // Limit response length
		messages: [
			{
				role: 'system',
				content: `You are a news expert assistant. Use the provided news articles to answer the user's query.
				If the provided articles don't contain relevant information, say so and provide a general response.
				Always cite your sources when possible.
				
				TRY CHANGING THIS PROMPT:
				- Add instructions for balanced reporting
				- Request specific formatting (bullet points, summaries, etc.)
				- Ask for bias analysis or fact-checking
				- Request source credibility assessment`,
			},
			{
				role: 'user',
				content: `Query: ${query}\n\nRelevant news articles:\n${relevantNews.join(
					'\n\n'
				)}`,
			},
		],
	});

	return response.choices[0].message.content;
}
