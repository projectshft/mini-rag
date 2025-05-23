import { typedRoute } from '../typedRoute';
import { vectorizeArticle } from '@/app/services/vectorize/vectorize-articles';

export const POST = typedRoute('UPLOAD-NEWS', async ({ text, bias, url }) => {
	try {
		const article = {
			bias,
			source: url || 'Unknown',
			content: text,
		};

		await vectorizeArticle(article);

		return {
			success: true,
			message: 'Article submitted and vectorized.',
			vectorized: true,
		};
	} catch (error) {
		console.error('Error vectorizing article:', error);
		return {
			success: false,
			message: `Failed to vectorize article: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`,
			vectorized: false,
		};
	}
});
