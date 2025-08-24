'use server';

import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';
import { pineconeClient } from '../../libs/pinecone';
import { openaiClient } from '../../libs/openai/openai';
import { Chunk } from '../../libs/chunking';

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);

// OpenAI's recommended chunk size for embeddings
const MAX_TOKENS = 512;

const encodingForModel = new Tiktoken(o200k_base);

function countTokens(text: string): number {
	return encodingForModel.encode(text).length;
}

// Check if content exceeds OpenAI's token limits
function validateContentLength(text: string): void {
	const tokenCount = countTokens(text);
	const MAX_ALLOWED_TOKENS = 8192; // OpenAI's embedding model limit

	if (tokenCount > MAX_ALLOWED_TOKENS) {
		throw new Error(
			`Content exceeds maximum token limit (${tokenCount}/${MAX_ALLOWED_TOKENS} tokens)`
		);
	}
}

/**
 * Create semantic chunks of the text
 * @param text - The text to create semantic chunks from
 * @returns An array of semantic chunks
 */
function createSemanticChunks(text: string): string[] {
	// Preserve code blocks
	const codeBlockRegex = /```[\s\S]*?```/g;
	const codeBlocks: string[] = [];
	const textWithoutCode = text.replace(codeBlockRegex, (match) => {
		codeBlocks.push(match);
		return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
	});

	// Normalize text: replace newlines with spaces to treat the text as continuous
	const normalizedText = textWithoutCode.replace(/\n/g, ' ').trim();

	// Simple semantic chunking approach
	const chunks: string[] = [];
	let currentChunk = '';

	// Split by sentences for more natural breaks
	const sentences = normalizedText.split(/(?<=[.!?])\s+/);

	for (const sentence of sentences) {
		// If adding this sentence would exceed the token limit
		if (countTokens(currentChunk + sentence) > MAX_TOKENS && currentChunk) {
			// Restore code blocks in the current chunk
			const restoredChunk = currentChunk.replace(
				/__CODE_BLOCK_(\d+)__/g,
				(_, index) => codeBlocks[parseInt(index)]
			);

			chunks.push(restoredChunk.trim());
			currentChunk = sentence;
		} else {
			currentChunk += (currentChunk ? ' ' : '') + sentence;
		}
	}

	// Add the final chunk if there's anything left
	if (currentChunk.trim()) {
		// Restore code blocks in the final chunk
		const restoredChunk = currentChunk.replace(
			/__CODE_BLOCK_(\d+)__/g,
			(_, index) => codeBlocks[parseInt(index)]
		);

		chunks.push(restoredChunk.trim());
	}

	return chunks;
}

/**
 * Vectorize article content using semantic chunking
 * This function is specifically for articles, not LinkedIn posts
 * @param chunk - The content chunk to vectorize
 */
export async function vectorizeContent(chunk: Chunk): Promise<void> {
	if (!chunk.content || chunk.content.length < 20) {
		throw new Error('Content is too short.');
	}

	// Validate content length before vectorizing
	validateContentLength(chunk.content);

	// Create semantic chunks for article content
	const chunks = createSemanticChunks(chunk.content);

	for (const [index, chunkContent] of chunks.entries()) {
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			dimensions: 512,
			input: chunkContent,
		});

		const vector = embeddingResponse.data[0].embedding;
		const chunkId =
			chunks.length > 1 ? `${chunk.id}-chunk-${index}` : chunk.id;

		await pineconeIndex.upsert([
			{
				id: chunkId,
				values: vector,
				metadata: {
					content: chunkContent,
					...chunk.metadata,
					chunkIndex: index,
					totalChunks: chunks.length,
				},
			},
		]);
	}
}
