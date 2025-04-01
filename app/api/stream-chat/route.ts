import { openaiClient } from '@/app/libs/openai';
import { pineconeClient } from '@/app/libs/pinecone';
import { streamText } from 'ai';
import { z } from 'zod';
import { typedRoute } from '../typedRoute';
import { openai } from '@ai-sdk/openai';

const searchDocuments = async (query: string): Promise<string> => {
	try {
		const embeddings = await openaiClient.embeddings.create({
			input: query,
			model: 'text-embedding-3-small',
		});

		const embedding = embeddings.data[0].embedding;

		const docs = await pineconeClient.Index('linkedin').query({
			vector: embedding,
			topK: 3,
			includeMetadata: true,
		});

		console.log(docs.matches);

		const rerankedDocs = await pineconeClient.inference.rerank(
			'bge-reranker-v2-m3',
			query,
			docs.matches.map((match) => match.metadata?.post as string)
		);

		return rerankedDocs.data.map((result) => result.document).join('\n');
	} catch (error) {
		console.error({ error });
		throw error;
	}
};

const chatRequestSchema = z.object({
	messages: z.array(
		z.object({
			role: z.enum(['user', 'assistant', 'system']),
			content: z.string(),
		})
	),
});

const handler = typedRoute(
	{
		input: chatRequestSchema,
		output: z.any(),
	},
	async ({ messages }) => {
		try {
			const documents = await searchDocuments(messages[0].content);

			const result = streamText({
				model: openai('gpt-4o-mini'),
				maxSteps: 2,
				toolChoice: 'required',
				temperature: 0.7,
				messages: [
					{
						role: 'system',
						content: `You are a LinkedIn post generation expert. Your task is to create engaging LinkedIn posts that match the style and tone of successful examples.
						Instructions:
						1. Analyze the example posts provided below for:
						- Writing style (formal/informal)
						- Tone of voice
						- Structure and formatting
						- Use of emojis, hashtags, or special characters
						- Length and paragraph breaks

						2. Create a new post that:
						- Maintains the same writing style and tone
						- Uses similar structural elements
						- Matches the level of professionalism
						- Incorporates similar engagement techniques
						- Addresses the user's specific request

						User's request:
						${messages[0].content}

						Example posts to match style and tone:
						${documents}

						Create a new post that follows these patterns while addressing the user's request.`,
					},
				],
			});

			return result.toDataStreamResponse({
				getErrorMessage(error) {
					console.error({ error });
					console.log(JSON.stringify(error, null, 2));
					return 'An error occurred';
				},
			});
		} catch (error) {
			console.error({ error });
			return new Response('Error', { status: 500 });
		}
	}
);

export { handler as POST };
