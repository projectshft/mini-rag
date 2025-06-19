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
const requiredEnvVars = [
	'OPENAI_API_KEY',
	'PINECONE_API_KEY',
	'FIRECRAWL_API_KEY',
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('Missing required environment variables:', missingVars);
	console.error(
		'Please check your .env or .env.local file in the project root'
	);
	process.exit(1);
}

import { ContentScraper } from '../services/contentScraper';
import { vectorizeContent } from '../services/vectorize/vectorize-articles';
import { DataProcessor } from '../libs/dataProcessor';

async function main() {
	console.log('Starting content scraping and vectorization process...');
	console.log(`Started at: ${new Date().toISOString()}`);

	try {
		const scraper = new ContentScraper();

		const urls = [
			'https://nextjs.org/docs/getting-started',
			'https://react.dev/learn',
			'https://www.typescriptlang.org/docs/',
			'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html',
			'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html',
			'https://docs.pinecone.io/docs/overview',
			'https://docs.pinecone.io/guides/index-data/create-an-index',
			'https://nextjs.org/docs/app/getting-started/fetching-data',
		];

		console.log('Scraping content sources...');
		const items = await scraper.scrapeMultipleUrls(urls);

		console.log(`Successfully scraped ${items.length} content items`);

		if (items.length === 0) {
			console.log('No content found to process');
			return;
		}

		// Process each content item
		console.log('Starting vectorization process...');

		const chunks = await new DataProcessor().processUrls(urls);

		let successfulChunks = 0;
		let failedChunks = 0;

		for (const chunk of chunks) {
			console.log(`Vectorizing chunk ${chunk.metadata.url}`);
			try {
				await vectorizeContent(chunk);
				console.log(
					`Successfully vectorized chunk ${chunk.metadata.url}`
				);
				successfulChunks++;
			} catch (error) {
				failedChunks++;
				console.error(
					`Failed to vectorize chunk ${chunk.metadata.url}:`,
					error
				);
			}
		}

		// Print summary
		console.log('\nSCRAPING SUMMARY');
		console.log('==================');
		console.log(`Total items: ${chunks.length}`);
		console.log(`Successful chunks: ${successfulChunks}`);
		console.log(`Failed chunks: ${failedChunks}`);
		console.log(`Completed at: ${new Date().toISOString()}`);
	} catch (error) {
		console.error('Critical error during scraping:', error);
	}

	console.log('Finished scraping and vectorizing content.');
}

// Execute main function with error handling
main().catch((error) => {
	console.error('Unhandled error:', error);
	process.exit(1);
});
