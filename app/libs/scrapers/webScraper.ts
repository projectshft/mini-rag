import axios from 'axios';
import * as cheerio from 'cheerio';

export type ScrapedContent = {
	title: string;
	content: string;
	url: string;
	metadata: {
		scrapedAt: string;
		method: string;
		contentLength: number;
		[key: string]: string | number | boolean;
	};
};

/**
 * Scrapes content from a URL using Cheerio (fast, for static sites)
 */
export async function scrapeWithCheerio(
	url: string
): Promise<ScrapedContent | null> {
	try {
		console.log(`Scraping ${url} with Cheerio...`);

		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; RAG-Bot/1.0)',
			},
		});

		const $ = cheerio.load(response.data);

		// Remove unwanted elements
		$('script, style, nav, footer, .advertisement').remove();

		// Extract title
		const title =
			$('title').text().trim() ||
			$('h1').first().text().trim() ||
			'Untitled';

		// Extract main content
		const contentElements = $('main, article, .content, .post-content, p');
		const content = contentElements
			.map((_, el) => $(el).text())
			.get()
			.join('\n\n');

		// Clean up content
		const cleanContent = content
			.replace(/\s+/g, ' ') // Normalize whitespace
			.replace(/\n+/g, '\n') // Normalize line breaks
			.trim();

		if (!cleanContent || cleanContent.length < 100) {
			console.warn(`Insufficient content from ${url}`);
			return null;
		}

		return {
			title,
			content: cleanContent,
			url,
			metadata: {
				scrapedAt: new Date().toISOString(),
				method: 'cheerio',
				contentLength: cleanContent.length,
			},
		};
	} catch (error) {
		console.error(`Error scraping ${url}:`, error);
		return null;
	}
}

