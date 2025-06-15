import { DataProcessor } from '@/app/libs/dataProcessor';
import { typedRoute } from '../typedRoute';

export const POST = typedRoute(
	'SCRAPE-URL',
	async ({ url, useHeadless = false }) => {
		try {
			const processor = new DataProcessor();
			const chunks = await processor.processSingleUrl(url, useHeadless);

			if (!chunks) {
				throw new Error(`Failed to process URL: ${url}`);
			}

			return {
				success: true,
				message: `Successfully processed ${url}`,
				chunks,
				totalChunks: chunks.length,
			};
		} catch (error) {
			console.error('Error in scrape-url API:', error);
			throw new Error(
				`Failed to scrape URL: ${(error as Error).message}`
			);
		}
	}
);
