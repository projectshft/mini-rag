import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';

const pineconeIndex = pineconeClient.Index('news');

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

export async function vectorizeArticle(
	article: { content: string; url: string; title?: string },
	topic: string = 'general'
): Promise<void> {
	if (!article.content || article.content.length < 20) {
		throw new Error('Article content is too short.');
	}

	const chunks = createSemanticChunks(article.content);
	console.log(`Created ${chunks.length} chunks for article`);

	for (const [index, chunk] of chunks.entries()) {
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			input: chunk,
		});

		const vector = embeddingResponse.data[0].embedding;

		await pineconeIndex.upsert([
			{
				id: `${article.url}-chunk-${index}`,
				values: vector,
				metadata: {
					title: article.title || 'Untitled',
					url: article.url,
					topic,
					chunkIndex: index,
					totalChunks: chunks.length,
				},
			},
		]);
	}
}
