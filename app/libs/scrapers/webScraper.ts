import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

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

/**
 * Scrapes content from a URL using Puppeteer (for JavaScript-heavy sites)
 */
export async function scrapeWithPuppeteer(
	url: string
): Promise<ScrapedContent | null> {
	let browser;

	try {
		console.log(`Scraping ${url} with Puppeteer...`);

		browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const page = await browser.newPage();

		// Set user agent and viewport
		await page.setUserAgent('Mozilla/5.0 (compatible; RAG-Bot/1.0)');
		await page.setViewport({ width: 1280, height: 720 });

		// Navigate and wait for content
		await page.goto(url, {
			waitUntil: 'networkidle2',
			timeout: 30000,
		});

		// Extract content using page.evaluate
		const result = await page.evaluate(() => {
			// Remove unwanted elements
			const unwantedSelectors = [
				'script',
				'style',
				'nav',
				'footer',
				'.advertisement',
				'.ads',
				'.sidebar',
			];

			unwantedSelectors.forEach((selector) => {
				document
					.querySelectorAll(selector)
					.forEach((el) => el.remove());
			});

			// Get title
			const title =
				document.title ||
				document.querySelector('h1')?.textContent ||
				'Untitled';

			// Get main content
			const contentSelectors = [
				'main',
				'article',
				'.content',
				'.post-content',
				'.entry-content',
				'[role="main"]',
			];

			let content = '';

			for (const selector of contentSelectors) {
				const element = document.querySelector(selector);
				if (element && element.textContent) {
					content = element.textContent;
					break;
				}
			}

			// Fallback to body if no main content found
			if (!content) {
				content = document.body?.textContent || '';
			}

			return {
				title: title.trim(),
				content: content.trim().replace(/\s+/g, ' '),
			};
		});

		if (!result.content || result.content.length < 100) {
			console.warn(`Insufficient content from ${url}`);
			return null;
		}

		return {
			title: result.title,
			content: result.content,
			url,
			metadata: {
				scrapedAt: new Date().toISOString(),
				method: 'puppeteer',
				contentLength: result.content.length,
			},
		};
	} catch (error) {
		console.error(`Error scraping ${url}:`, error);
		return null;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
