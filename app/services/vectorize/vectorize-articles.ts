import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';
import { Article } from '../newsScraper';

const pineconeIndex = pineconeClient.Index('articles');

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

export async function vectorizeArticle(article: Article): Promise<void> {
	if (!article.content || article.content.length < 20) {
		throw new Error('Article content is too short.');
	}

	const chunks = createSemanticChunks(article.content);
	console.log(
		`Created ${chunks.length} chunks for article: ${article.title}`
	);

	for (const [index, chunk] of chunks.entries()) {
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			input: chunk,
		});

		const vector = embeddingResponse.data[0].embedding;

		const metadata = {
			content: chunk,
			bias: article.bias,
			source: article.url,
			title: article.title,
			// Only include optional fields if they exist
			...(article.author && { author: article.author }),
			...(article.publishDate && { publishDate: article.publishDate }),
			chunkIndex: index,
			totalChunks: chunks.length,
		};

		await pineconeIndex.upsert([
			{
				id: `${article.title}-chunk-${index}`,
				values: vector,
				metadata,
			},
		]);
	}
}
