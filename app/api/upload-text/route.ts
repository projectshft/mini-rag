import { DataProcessor } from '@/app/libs/dataProcessor';
import { typedRoute } from '../typedRoute';
import { vectorizeContent } from '@/app/services/vectorize/vectorize-articles';

export const POST = typedRoute(
	'UPLOAD-TEXT',
	async ({ content, metadata }) => {
		const processor = new DataProcessor();
		const chunks = await processor.processText(content, metadata);

		for (const chunk of chunks) {
			await vectorizeContent(chunk);
		}

		return {
			success: true,
			message: `Successfully processed text content "${metadata.title}" into ${chunks.length} chunks`,
			chunks,
			totalChunks: chunks.length,
		};
	}
);