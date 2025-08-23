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

	async scrapeMultipleUrls(urls: string[]) {
		return this.dataProcessor.processUrls(urls);
	}
}
