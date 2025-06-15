import { DataProcessor } from '@/app/libs/dataProcessor';
import { typedRoute } from '../typedRoute';

export const POST = typedRoute(
	'SCRAPE-URLS',
	async ({ urls, useHeadless = false }) => {
		try {
			const processor = new DataProcessor();
			const chunks = await processor.processUrls(urls, useHeadless);

			return {
				success: true,
				message: `Successfully processed ${urls.length} URLs`,
				chunks,
				totalChunks: chunks.length,
			};
		} catch (error) {
			console.error('Error in scrape-urls API:', error);
			throw new Error(
				`Failed to scrape URLs: ${(error as Error).message}`
			);
		}
	}
);
