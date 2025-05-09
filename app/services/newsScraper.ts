import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';
import { newsSources } from '../config/newsSources';

// Schema for article content
const articleSchema = z.object({
	title: z.string(),
	content: z.string(),
	author: z.string().optional(),
	publishDate: z.string().optional(),
	url: z.string(),
	bias: z.enum(['liberal', 'conservative']),
});

export type Article = z.infer<typeof articleSchema>;

export class NewsScraper {
	private app: FirecrawlApp;

	constructor(apiKey: string) {
		this.app = new FirecrawlApp({
			apiKey,
		});
	}

	async scrapeNewsSources(): Promise<Article[]> {
		const allArticles: Article[] = [];

		for (const source of newsSources) {
			try {
				const scrapeResult = await this.app.extract([source.url], {
					prompt: 'Extract the main article content, including title, content, author (if available), and publish date (if available) from the page.',
					schema: articleSchema.extend({
						bias: z.literal(source.bias),
					}),
				});

				if (scrapeResult.success) {
					allArticles.push({
						...scrapeResult.data,
						url: source.url,
						bias: source.bias,
					});
				} else {
					console.error(
						`Failed to scrape ${source.name}: ${scrapeResult.error}`
					);
				}
			} catch (error) {
				console.error(`Error scraping ${source.name}:`, error);
			}
		}

		return allArticles;
	}

	async scrapeByBias(bias: 'liberal' | 'conservative'): Promise<Article[]> {
		const sources = newsSources.filter((source) => source.bias === bias);
		const articles: Article[] = [];

		for (const source of sources) {
			try {
				const scrapeResult = await this.app.extract([source.url], {
					prompt: 'Extract the main article content, including title, content, author (if available), and publish date (if available) from the page.',
					schema: articleSchema.extend({
						bias: z.literal(source.bias),
					}),
				});

				if (scrapeResult.success) {
					articles.push({
						...scrapeResult.data,
						url: source.url,
						bias: source.bias,
					});
				} else {
					console.error(
						`Failed to scrape ${source.name}: ${scrapeResult.error}`
					);
				}
			} catch (error) {
				console.error(`Error scraping ${source.name}:`, error);
			}
		}

		return articles;
	}
}
