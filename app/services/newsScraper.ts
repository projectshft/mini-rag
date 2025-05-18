import { z } from 'zod';
import { newsSources } from '../config/newsSources';
import { scrapeMultiplePages } from '../libs/firecrawl';

export const pageSchema = z.object({
	content: z.string(),
	bias: z.enum(['liberal', 'conservative']),
	source: z.string(),
});

export type Article = z.infer<typeof pageSchema>;

export class NewsScraper {
	async scrapeNewsSources(): Promise<Article[]> {
		const result = await scrapeMultiplePages(
			newsSources.map((source) => source.url),
			'Extract the bias (either liberal or conservative) the relevant content and source (example: https://www.nytimes.com).'
		);

		return result;
	}
}
