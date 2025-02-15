import { openaiClient } from '@/app/libs/openai';
import { pineconeClient } from '@/app/libs/pinecone';
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const getVectorStore = async (query: string) => {
	try {
		const embeddings = await openaiClient.embeddings.create({
			input: query,
			model: 'text-embedding-3-small',
		});

		return pineconeClient.Index('linkedin-posts').query({
			vector: embeddings.data[0].embedding,
			topK: 3,
			includeMetadata: true,
		});
	} catch (error) {
		console.error({ error });
		throw error;
	}
};

// const postTool = tool({
// 	description:
// 		'Generates a LinkedIn post based on vector search results and user request',
// 	parameters: z.object({
// 		message: z.string(),
// 	}),
// 	execute: async ({ message }: { message: string }) => {
// 		const vectorStore = await getVectorStore(message);
// 		const results = vectorStore.matches;

// 		// Format the results in a more structured way
// 		const formattedResults = results
// 			.filter((r) => r.metadata?.content)
// 			.map(
// 				(r) =>
// 					`Reference post (similarity: ${(r.score || 0 * 100).toFixed(
// 						1
// 					)}%):\n${r.metadata?.content}`
// 			)
// 			.join('\n\n');

// 		return formattedResults || 'No relevant posts found.';
// 	},
// });

// const searchTool = tool({
// 	description: `add a resource to your knowledge base based on the user query by searching the vector database and then creating a post based on the results`,
// 	parameters: z.object({
// 		post: z.string(),
// 	}),
// 	execute: async ({ post }: { post: string }) => {
// 		const vectorStore = await getVectorStore(post);

// 		const results = vectorStore.matches.map(
// 			(match) => match.metadata?.content
// 		);

// 		console.log('results', results);

// 		return results;
// 	},
// });

export async function POST(req: Request) {
	const { messages } = await req.json();

	try {
		const result = streamText({
			model: openai('gpt-4'),
			messages,
			tools: {
				addResource: tool({
					description: `addResource tool will add a resource to your knowledge base. You will be given a request for a post. You will then need to create a post based on the results of a vector database search using the same style and tone as the reference posts.`,
					parameters: z.object({
						content: z
							.string()
							.describe(
								'the content or resource to add to the knowledge base'
							),
					}),
					execute: async ({ content }) => {
						console.log('content', content);
						const vectorStore = await getVectorStore(content);
						console.log('vectorStore', vectorStore);
						const results = vectorStore.matches.map(
							(match) => match.metadata?.content
						);
						console.log('results', results);
						return results;
					},
				}),
			},
			temperature: 0.7,
			system: `You are a helpful AI assistant that helps users generate LinkedIn posts. You will be given a query and you will need to search the vector database for relevant posts using the addResource tool. You will then need to create a post based on the results.`,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error({ error });
		return new Response('Error', { status: 500 });
	}
}
