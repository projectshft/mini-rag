import { DataProcessor } from '@/app/libs/dataProcessor';
import { typedRoute } from '../typedRoute';
import { vectorizeContent } from '@/app/services/vectorize/vectorize-articles';

export const POST = typedRoute(
	'SCRAPE-URLS',
	async ({ urls, useHeadless = false }) => {
		const processor = new DataProcessor();
		const chunks = await processor.processUrls(urls, useHeadless);

		for (const chunk of chunks) {
			await vectorizeContent(chunk);
		}

		return {
			success: true,
			message: `Successfully processed ${urls.length} URLs`,
			chunks,
			totalChunks: chunks.length,
		};
	}
);
