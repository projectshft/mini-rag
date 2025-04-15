import { openaiClient } from '../openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY!,
});

type NewsMetadata = {
	text: string;
};

async function searchVectors(query: string) {
	const index = pinecone.Index('news');
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		input: query,
	});

	const searchResults = await index.query({
		vector: queryEmbedding.data[0].embedding,
		topK: 5,
		includeMetadata: true,
	});

	return (
		searchResults.matches
			?.map((match) => (match.metadata as NewsMetadata)?.text)
			.filter(Boolean) || []
	);
}

export async function processNewsQuery(query: string, model: string) {
	const relevantNews = await searchVectors(query);

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
