import { z } from 'zod';
import { typedRoute } from '../typedRoute';

const handler = typedRoute(
	{
		input: z.any(),
		output: z.any(),
	},
	async () => {
		const response = await fetch(
			`https://api.scraping.com/scrape?apikey=${process.env.SCRAPING_API_KEY}&url=${company}`
		);
		const data = await response.json();
		return data;
	}
);

export const POST = handler;
