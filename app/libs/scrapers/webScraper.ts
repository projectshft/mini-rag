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
	// TODO: Implement web scraping with Cheerio
	//
	// Steps:
	// 1. Fetch the URL using axios with a User-Agent header
	// 2. Load HTML into cheerio
	// 3. Remove unwanted elements (script, style, nav, footer, .advertisement)
	// 4. Extract title from <title>, <h1>, or default to 'Untitled'
	// 5. Extract main content from (main, article, .content, .post-content, p)
	// 6. Clean up content (normalize whitespace and line breaks)
	// 7. Return null if content is < 100 chars
	// 8. Return ScrapedContent object with title, content, url, metadata

	throw new Error('scrapeWithCheerio not implemented yet!');
}

