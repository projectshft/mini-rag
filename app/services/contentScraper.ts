import { z } from 'zod';
import { DataProcessor } from '../libs/dataProcessor';

export const contentSchema = z.object({
	content: z.string(),
	source: z.string(),
});

export type ContentItem = z.infer<typeof contentSchema>;

export class ContentScraper {
	private dataProcessor: DataProcessor;

	constructor() {
		this.dataProcessor = new DataProcessor();
	}

	async scrapeContent(url: string, useHeadless: boolean = false) {
		return this.dataProcessor.processSingleUrl(url, useHeadless);
	}

	async scrapeMultipleUrls(urls: string[], useHeadless: boolean = false) {
		return this.dataProcessor.processUrls(urls, useHeadless);
	}
}
