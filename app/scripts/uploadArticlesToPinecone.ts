/**
 * PINECONE VECTOR DATABASE UPLOAD SCRIPT
 *
 * This script demonstrates how to populate a vector database with text content.
 * It's a crucial part of building a RAG (Retrieval Augmented Generation) system.
 *
 * WHAT THIS SCRIPT DOES:
 * 1. Reads text files from local directories (conservative & liberal news articles)
 * 2. Converts each article into a vector embedding using OpenAI's embedding model
 * 3. Uploads these embeddings to Pinecone with metadata (content, bias, source)
 * 4. Creates searchable semantic index for the RAG system
 *
 * WHY EMBEDDINGS?
 * Raw text can't be searched semantically. By converting text to embeddings:
 * - "Climate change" and "global warming" become mathematically similar
 * - Search finds meaning, not just exact word matches
 * - AI can retrieve relevant context for better responses
 *
 * VECTOR DATABASE CONCEPTS:
 * - Index: A collection of vectors (like a database table)
 * - Embedding: Numerical representation of text meaning (~1500 numbers)
 * - Metadata: Additional info stored with each vector (original text, source, etc.)
 * - Dimension: Size of embedding vectors (1536 for OpenAI's text-embedding-3-small)
 *
 * EXPERIMENT IDEAS:
 * - Try different embedding models (text-embedding-3-large vs small)
 * - Change the retry logic or batch sizes
 * - Add more metadata fields (date, author, topic, etc.)
 * - Process different types of content (PDFs, web pages, etc.)
 *
 * Learn more about embeddings: https://platform.openai.com/docs/guides/embeddings
 * Learn more about Pinecone: https://docs.pinecone.io/docs/overview
 */

import * as fs from 'fs';
import { Pinecone } from '@pinecone-database/pinecone';
import * as path from 'path';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pineconeClient = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY || '',
});

/**
 * Retry function with exponential backoff for handling API rate limits
 * Vector databases and AI APIs often have rate limits - this handles temporary failures
 */
async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	retries = 5, // TRY CHANGING: Increase for more resilience, decrease for faster failure
	delay = 1000 // TRY CHANGING: Starting delay in milliseconds
): Promise<T> {
	for (let i = 0; i < retries; i++) {
		try {
			return await fn();
		} catch (err) {
			if (i === retries - 1) throw err;
			console.log(`Retrying in ${delay}ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			delay *= 2; // Exponential backoff - each retry waits twice as long
		}
	}
	throw new Error('Failed after retries');
}

async function main() {
	const indexName = 'articles'; // TRY CHANGING: Use different index names for different content types
	const index = await ensureIndex(pineconeClient, indexName, 1536); // 1536 = dimension for text-embedding-3-small

	// Process articles from both political perspectives
	const dataDir = path.resolve(__dirname, 'data');
	const conservativeDir = path.join(dataDir, 'conservative');
	const liberalDir = path.join(dataDir, 'liberal');

	// Process both directories in parallel for efficiency
	await Promise.all([
		processArticles(conservativeDir, 'conservative', index),
		processArticles(liberalDir, 'liberal', index),
	]);

	console.log('Finished uploading all articles to Pinecone.');
}

/**
 * Process all articles in a directory and upload them to Pinecone
 */
async function processArticles(
	dir: string,
	bias: 'conservative' | 'liberal',
	index: ReturnType<typeof pineconeClient.Index>
) {
	const files = fs.readdirSync(dir);
	console.log(`Processing ${files.length} ${bias} articles...`);

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const filePath = path.join(dir, file);

		try {
			const content = fs.readFileSync(filePath, 'utf8');

			// Convert text content to vector embedding
			const embedding = await getEmbedding(openaiClient, content);

			// Upload to Pinecone with retry logic
			await retryWithBackoff(() =>
				index.upsert([
					{
						id: `${bias}-${i + 1}`, // Unique identifier for this vector
						values: embedding, // The actual vector (array of ~1500 numbers)
						metadata: {
							// Additional searchable data stored with the vector
							content, // Original text content
							bias, // Political leaning
							source: file, // Source filename
							// TRY ADDING: date, author, topic, url, etc.
						},
					},
				])
			);

			console.log(
				`Uploaded ${bias} article ${i + 1} of ${
					files.length
				} to Pinecone.`
			);
		} catch (error) {
			console.error(`Error processing ${bias} article ${file}:`, error);
		}
	}
}

/**
 * Ensure the Pinecone index exists, create it if it doesn't
 */
async function ensureIndex(
	client: Pinecone,
	indexName: string,
	dimension: number // Must match the embedding model's output dimension
) {
	console.log(`Checking index: ${indexName}`);
	const indexes = await client.listIndexes();
	const idx = indexes.indexes?.find((index) => index.name === indexName);

	if (idx) {
		console.log(`Index ${indexName} already exists.`);
		return client.Index(indexName);
	}

	console.log(`Creating index: ${indexName}`);
	await client.createIndex({
		name: indexName,
		dimension, // IMPORTANT: Must match your embedding model (1536 for text-embedding-3-small)
		spec: {
			serverless: {
				// TRY CHANGING: Use 'pod' for dedicated resources (costs more)
				cloud: 'aws', // TRY CHANGING: 'gcp' or 'azure' based on your preference
				region: 'us-east-1', // TRY CHANGING: Choose region closest to your users
			},
		},
	});

	return client.Index(indexName);
}

/**
 * Convert text to vector embedding using OpenAI's embedding model
 */
async function getEmbedding(api: OpenAI, text: string): Promise<number[]> {
	const response = await api.embeddings.create({
		model: 'text-embedding-3-small', // TRY CHANGING: 'text-embedding-3-large' for better quality (costs more)
		input: text,
	});
	return response.data[0].embedding;
}

// Execute main function with error handling
main().catch((error) => {
	console.error('Script failed:', error);
	process.exit(1);
});
