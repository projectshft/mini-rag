import { NextResponse } from 'next/server';
import { ContentScraper } from '@/app/services/contentScraper';
import { vectorizeContent } from '@/app/services/vectorize/vectorize-articles';

export async function GET() {
	console.log('Starting content scraping and vectorization process...');
	console.log(`Started at: ${new Date().toISOString()}`);

	let totalItems = 0;
	let successfulItems = 0;
	let failedItems = 0;

	try {
		// Initialize the content scraper
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

		const items = await scraper.scrapeMultipleUrls(urls);

		totalItems = items.length;
		console.log(`Successfully scraped ${items.length} content items`);

		if (items.length === 0) {
			console.log('No content found to process');
			return NextResponse.json({
				success: true,
				message: 'No content found to process',
				totalItems: 0,
				successfulItems: 0,
				failedItems: 0,
				successRate: '0',
			});
		}

		// Process each content item
		console.log('Starting vectorization process...');

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			try {
				// Check if item has metadata and url
				const url =
					item.metadata?.url || item.metadata?.source || 'unknown';

				console.log(`Processing item ${i + 1}/${items.length}: ${url}`);

				// Vectorize and store the content
				await vectorizeContent(item);

				successfulItems++;
				console.log(`Successfully vectorized content from ${url}`);

				// Small delay to avoid rate limits
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				failedItems++;
				const url =
					item.metadata?.url || item.metadata?.source || 'unknown';
				console.error(
					`Failed to vectorize content from ${url}:`,
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

		return NextResponse.json({
			success: true,
			message: `Successfully processed ${successfulItems} out of ${totalItems} content items`,
			totalItems,
			successfulItems,
			failedItems,
			successRate: `${successRate}%`,
		});
	} catch (error) {
		console.error('Critical error during scraping:', error);

		return NextResponse.json(
			{
				success: false,
				message: `Scraping failed: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`,
				totalItems,
				successfulItems,
				failedItems,
				successRate:
					totalItems > 0
						? `${((successfulItems / totalItems) * 100).toFixed(
								1
						  )}%`
						: '0%',
			},
			{ status: 500 }
		);
	}
}
