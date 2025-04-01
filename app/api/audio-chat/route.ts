import { NextRequest } from 'next/server';
import { openaiClient } from '@/app/libs/openai';
import { pineconeClient } from '@/app/libs/pinecone';

const searchDocuments = async (query: string) => {
	try {
		const embeddings = await openaiClient.embeddings.create({
			input: query,
			model: 'text-embedding-ada-002', // TODO update to text-embedding-3-small
		});

		const embedding = embeddings.data[0].embedding;

		const docs = await pineconeClient.Index('linkedin').query({
			vector: embedding,
			topK: 3,
			includeMetadata: true,
		});

		return docs.matches.map((doc) => doc.metadata?.post).join('\n');
	} catch (error) {
		console.error({ error });
		throw error;
	}
};

export async function POST(request: NextRequest) {
	try {
		let userInput: string;
		let transcription: string | undefined;
		const contentType = request.headers.get('content-type') || '';

		if (contentType.includes('multipart/form-data')) {
			// Handle audio input
			const formData = await request.formData();
			const audioFile = formData.get('audio') as Blob;

			if (!audioFile) {
				return new Response('No audio file received', { status: 400 });
			}

			// Transcribe audio to text
			const result = await openaiClient.audio.transcriptions.create({
				file: new File([audioFile], 'audio.webm', {
					type: 'audio/webm',
				}),
				model: 'whisper-1',
			});

			userInput = result.text;
			transcription = result.text;
		} else {
			// Handle text input
			const { text } = await request.json();
			if (!text) {
				return new Response('No text received', { status: 400 });
			}
			userInput = text;
		}

		console.log(userInput, 'USER INPUT');

		const documents = await searchDocuments(userInput);

		console.log(documents, 'DOCUMENTS');

		const completion = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are a LinkedIn post generation expert. Your task is to create engaging LinkedIn posts that match the style and tone of successful examples.

					Instructions:
					1. Analyze the example posts provided below for:
					- Writing style (formal/informal)
					- Tone of voice
					- Structure and formatting
					- Length and paragraph breaks

					2. Create a new post that:
					- Maintains the same writing style and tone
					- Uses similar structural elements
					- Matches the level of professionalism
					- Incorporates similar engagement techniques
					- Addresses the user's specific request
					- Do NOT use emojis, hashtags, or special characters`,
				},
				{
					role: 'user',
					content: `User's input: ${userInput}

					Example posts to match style and tone: ${documents}`,
				},
			],
			temperature: 0.7,
		});

		return new Response(
			JSON.stringify({
				response: completion.choices[0].message.content,
				transcription,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error processing request:', error);
		return new Response(
			JSON.stringify({ error: 'Error processing request' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
