import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';

type MediumArticle = {
	title: string;
	subtitle?: string;
	link: string;
	publishDate: string;
	isPublished: boolean;
	content: string;
};

type MediumCredentials = {
	email: string;
	password: string;
};

async function loadExistingArticles(
	filepath: string
): Promise<MediumArticle[]> {
	try {
		const data = await fs.readFile(filepath, 'utf-8');
		return JSON.parse(data) as MediumArticle[];
	} catch {
		return []; // Return empty array if file doesn't exist
	}
}

class MediumScraper {
	private browser: Browser | null = null;
	private page: Page | null = null;

	async initialize() {
		this.browser = await puppeteer.launch({
			headless: true,
		});
		this.page = await this.browser.newPage();
	}

	async login(credentials: MediumCredentials) {
		if (!this.page) throw new Error('Browser not initialized');

		// Navigate to Medium sign-in page
		await this.page.goto('https://medium.com/me/signin');

		// Click the sign in with email button
		await this.page.waitForSelector('[data-testid="sign-in-with-email"]');
		await this.page.click('[data-testid="sign-in-with-email"]');

		// Enter email
		await this.page.waitForSelector('input[type="email"]');
		await this.page.type('input[type="email"]', credentials.email);
		await this.page.keyboard.press('Enter');

		// Enter password
		await this.page.waitForSelector('input[type="password"]');
		await this.page.type('input[type="password"]', credentials.password);
		await this.page.keyboard.press('Enter');

		// Wait for login to complete
		await this.page.waitForNavigation();
	}

	async scrapeArticles(
		existingArticles: MediumArticle[] = []
	): Promise<MediumArticle[]> {
		if (!this.page) throw new Error('Browser not initialized');

		// Navigate to your stories page
		await this.page.goto('https://medium.com/me/stories/public');
		await this.page.waitForSelector('article');

		const articles = await this.page.evaluate(() => {
			const articleElements = document.querySelectorAll('article');
			return Array.from(articleElements).map((article) => {
				const titleElement = article.querySelector('h2');
				const linkElement = article.querySelector('a[href*="/p/"]');
				const dateElement = article.querySelector('time');
				const subtitleElement = article.querySelector('h3, h4');

				return {
					title: titleElement?.textContent?.trim() || '',
					subtitle: subtitleElement?.textContent?.trim(),
					link: linkElement?.getAttribute('href') || '',
					publishDate: dateElement?.getAttribute('datetime') || '',
					isPublished: true,
					content: '',
				};
			});
		});

		// Filter out articles we already have
		const newArticles = articles.filter(
			(article) =>
				!existingArticles.some(
					(existing) => existing.link === article.link
				)
		);

		// Fetch content only for new articles
		for (const article of newArticles) {
			if (article.link) {
				await this.page.goto(`https://medium.com${article.link}`);
				await this.page.waitForSelector('article');

				article.content = await this.page.evaluate(() => {
					const contentElement = document.querySelector('article');
					return contentElement?.textContent?.trim() || '';
				});
			}
		}

		// Combine existing and new articles
		return [...existingArticles, ...newArticles];
	}

	async saveToFile(articles: MediumArticle[], filepath: string) {
		await fs.writeFile(
			filepath,
			JSON.stringify(articles, null, 2),
			'utf-8'
		);
	}

	async close() {
		if (this.browser) {
			await this.browser.close();
		}
	}
}

async function main() {
	const OUTPUT_FILE = 'medium-articles.json';
	const scraper = new MediumScraper();

	try {
		await scraper.initialize();

		await scraper.login({
			email: 'brianjenney83@gmail.com',
			password: 'Kingston1228!',
		});

		// Load existing articles first
		const existingArticles = await loadExistingArticles(OUTPUT_FILE);
		console.log(`Found ${existingArticles.length} existing articles`);

		// Scrape new articles
		const allArticles = await scraper.scrapeArticles(existingArticles);
		const newArticlesCount = allArticles.length - existingArticles.length;

		await scraper.saveToFile(allArticles, OUTPUT_FILE);
		console.log(`Successfully scraped ${newArticlesCount} new articles`);
		console.log(`Total articles: ${allArticles.length}`);
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await scraper.close();
	}
}

if (require.main === module) {
	main();
}

export { MediumScraper, type MediumArticle, type MediumCredentials };
