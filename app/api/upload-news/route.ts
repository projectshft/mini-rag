import { typedRoute } from '../typedRoute';
import { vectorizeArticle } from '@/app/services/vectorize/vectorize-articles';

const handler = typedRoute('/api/upload-news', async ({ text, url, topic }) => {
	try {
		const article = {
			title: topic ?? 'Untitled',
			url: url ?? 'user-submitted',
			content: text,
		};

		await vectorizeArticle(article, topic ?? 'unknown');

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

export { handler as POST };
