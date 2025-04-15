import { openaiClient } from '../openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY!,
});

type NewsMetadata = {
	content: string;
	bias: string;
};

async function searchVectors(query: string) {
	console.log(
		'Starting search with API key:',
		process.env.PINECONE_API_KEY?.slice(0, 5) + '...'
	);
	const index = pinecone.Index('articles');

	console.log('Getting embeddings for query:', query);
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		input: query,
	});

	console.log(
		'Querying Pinecone with embedding of length:',
		queryEmbedding.data[0].embedding.length
	);
	const searchResults = await index.query({
		vector: queryEmbedding.data[0].embedding,
		topK: 5,
		includeMetadata: true,
	});

	console.log('Search results:', JSON.stringify(searchResults, null, 2));
	return (
		searchResults.matches
			?.map((match) => (match.metadata as NewsMetadata)?.content)
			.filter(Boolean) || []
	);
}

export async function processNewsQuery(query: string, model: string) {
	const relevantNews = await searchVectors(query);

	console.log('relevantNews', { relevantNews });

	const response = await openaiClient.chat.completions.create({
		model: model,
		messages: [
			{
				role: 'system',
				content: `You are a news expert assistant. Use the provided news articles to answer the user's query.
				If the provided articles don't contain relevant information, say so and provide a general response.
				Always cite your sources when possible.`,
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
