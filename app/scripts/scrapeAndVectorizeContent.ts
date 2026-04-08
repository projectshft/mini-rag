/**
 * CONTENT SCRAPING AND VECTORIZATION SCRIPT
 *
 * This script automates the process of scraping fresh content and adding it
 * to the knowledge base for RAG (Retrieval-Augmented Generation).
 *
 * Process:
 * 1. Uses the ContentScraper service to scrape configured content sources
 * 2. Processes and cleans the content
 * 3. Vectorizes each piece of content using OpenAI embeddings
 * 4. Stores the vectors in Pinecone for retrieval
 *
 * Usage:
 * - Run manually: `yarn scrape-content`
 * - Schedule with cron for automatic updates
 */

import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from the project root FIRST
const rootDir = path.resolve(__dirname, '../..');
const envPath = path.join(rootDir, '.env');
const envLocalPath = path.join(rootDir, '.env.local');

// Try loading .env files in order of priority
if (fs.existsSync(envLocalPath)) {
	dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	dotenv.config();
}

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('Missing required environment variables:', missingVars);
	console.error(
		'Please check your .env or .env.local file in the project root'
	);
	process.exit(1);
}

import { DataProcessor } from '../libs/dataProcessor';
import { openaiClient } from '../libs/openai/openai';
import { pineconeClient } from '../libs/pinecone';

/**
 * Simple function to scrape URLs and vectorize content to Pinecone
 */
async function scrapeAndVectorize(urls: string[]) {
	// TODO: Implement content scraping and vectorization pipeline
	//
	// Steps:
	// 1. Create a DataProcessor and use processUrls() to scrape and chunk URLs
	// 2. Check if any chunks were created (return early if not)
	// 3. Connect to Pinecone index using pineconeClient.Index()
	// 4. Process chunks in batches of 100:
	//    a. Generate embeddings using openaiClient.embeddings.create()
	//       - Model: 'text-embedding-3-small', Dimensions: 512
	//    b. Prepare vectors: { id, values, metadata: { text, url, title, ... } }
	//    c. Upload to Pinecone using index.upsert()
	// 5. Track success/failure counts and print summary

	throw new Error('scrapeAndVectorize not implemented yet!');
}

async function main() {
	// Validated URLs that work with the scraper
	const urls = [
		// React (Top tier - rich content)
		'https://react.dev/learn',
		'https://react.dev/reference/react/useState',
		'https://react.dev/reference/react/useEffect',

		// Next.js (Top tier)
		'https://nextjs.org/docs/getting-started',
		'https://nextjs.org/docs/app/building-your-application/routing',
		'https://nextjs.org/docs/app/building-your-application/data-fetching',

		// TypeScript (Top tier)
		'https://www.typescriptlang.org/docs/handbook/2/basic-types.html',

		// Vercel AI SDK (for agents)
		'https://sdk.vercel.ai/docs/ai-sdk-core/generating-text',
		'https://github.com/vercel/ai',

		// Pinecone (GitHub README - works great!)
		'https://github.com/pinecone-io/pinecone-ts-client',
	];

	await scrapeAndVectorize(urls);
}

// Execute main function with error handling
main().catch((error) => {
	console.error('Unhandled error:', error);
	process.exit(1);
});
