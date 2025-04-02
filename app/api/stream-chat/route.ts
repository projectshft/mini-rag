import { searchDocuments } from '@/app/libs/pinecone';
import { streamText } from 'ai';
import { z } from 'zod';
import { typedRoute } from '../typedRoute';
import { openai } from '@ai-sdk/openai';

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
						${documents.map((doc) => doc.metadata?.post).join('\n')}

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
