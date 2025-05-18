import FirecrawlApp from '@mendable/firecrawl-js';

export const app = new FirecrawlApp({
	apiKey: process.env.FIRECRAWL_API_KEY,
});

import { pageSchema } from '../services/newsScraper';

export const scrapeMultiplePages = async (urls: string[], prompt: string) => {
	const batchScrapeResult = await app.batchScrapeUrls(urls, {
		formats: ['extract'],
		extract: {
			prompt,
			schema: pageSchema,
		},
	});

	if (!batchScrapeResult.success) {
		throw new Error(`Failed to scrape: ${batchScrapeResult.error}`);
	}

	return batchScrapeResult.data
		.filter((item) => {
			const parsed = pageSchema.safeParse(item);
			return parsed.success;
		})
		.map((article) => pageSchema.parse(article));
};
