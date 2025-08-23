'use server';

import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';
import { Chunk } from '@/app/libs/chunking';

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);

// OpenAI's recommended chunk size for embeddings
const MAX_TOKENS = 512;

const encodingForModel = new Tiktoken(o200k_base);

function countTokens(text: string): number {
	return encodingForModel.encode(text).length;
}

function splitIntoParagraphs(text: string): string[] {
	// Split by newlines and filter out empty paragraphs
	return text.split(/\n+/).filter((p) => p.trim().length > 0);
}

/**
 * Create semantic chunks of the text
 * @param text - The text to create semantic chunks from - try to keep paragraphs rather than random chunks
 * @returns An array of semantic chunks
 */
function createSemanticChunks(text: string): string[] {
	const paragraphs = splitIntoParagraphs(text);
	const chunks: string[] = [];
	let currentChunk = '';

	for (const paragraph of paragraphs) {
		if (
			countTokens(currentChunk + paragraph) > MAX_TOKENS &&
			currentChunk
		) {
			chunks.push(currentChunk.trim());
			currentChunk = paragraph;
		} else {
			currentChunk += (currentChunk ? '\n' : '') + paragraph;
		}
	}

	if (currentChunk.trim()) {
		chunks.push(currentChunk.trim());
	}

	return chunks;
}

export async function vectorizeContent(chunk: Chunk): Promise<void> {
	if (!chunk.content || chunk.content.length < 20) {
		throw new Error('Content is too short.');
	}

	const chunks = createSemanticChunks(chunk.content);

	for (const chunkContent of chunks) {
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			dimensions: 512,
			input: chunkContent,
		});

		const vector = embeddingResponse.data[0].embedding;

		await pineconeIndex.upsert([
			{
				id: chunk.id,
				values: vector,
				metadata: {
					content: chunk.content,
					...chunk.metadata,
				},
			},
		]);
	}
}
