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

// Import services AFTER environment variables are loaded
import { ContentScraper } from '../services/contentScraper';
import { vectorizeContent } from '../services/vectorize/vectorize-articles';

async function main() {
	console.log('Starting content scraping and vectorization process...');
	console.log(`Started at: ${new Date().toISOString()}`);

	let totalItems = 0;
	let successfulItems = 0;
	let failedItems = 0;

	try {
		// Initialize the content scraper
		const scraper = new ContentScraper();

		// Define URLs to scrape
		const urls = [
			'https://example.com/resource1',
			'https://example.com/resource2',
		];

		console.log('Scraping content sources...');
		const items = await scraper.scrapeMultipleUrls(urls);

		totalItems = items.length;
		console.log(`Successfully scraped ${items.length} content items`);

		if (items.length === 0) {
			console.log('No content found to process');
			return;
		}

		// Process each content item
		console.log('Starting vectorization process...');

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			try {
				console.log(
					`Processing item ${i + 1}/${items.length}: ${
						item.metadata.url
					}`
				);

				// Vectorize and store the content
				await vectorizeContent(item);

				successfulItems++;
				console.log(
					`Successfully vectorized content from ${item.metadata.url}`
				);

				// Small delay to avoid rate limits
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				failedItems++;
				console.error(
					`Failed to vectorize content from ${item.metadata.url}:`,
					error
				);
			}
		}

		// Calculate success rate
		const successRate =
			totalItems > 0
				? ((successfulItems / totalItems) * 100).toFixed(1)
				: '0';

		// Print summary
		console.log('\nSCRAPING SUMMARY');
		console.log('==================');
		console.log(`Total items: ${totalItems}`);
		console.log(`Successfully processed: ${successfulItems}`);
		console.log(`Failed: ${failedItems}`);
		console.log(`Completed at: ${new Date().toISOString()}`);
		console.log(`Success rate: ${successRate}%`);
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
