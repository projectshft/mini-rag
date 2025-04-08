import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';

type GitHubRepo = {
	name: string;
	description: string;
	url: string;
	lastUpdated: string;
	language: string;
	stars: number;
	forks: number;
	content: string;
};

type GitHubCredentials = {
	username: string;
	token?: string;
};

async function loadExistingRepos(filepath: string): Promise<GitHubRepo[]> {
	try {
		const data = await fs.readFile(filepath, 'utf-8');
		return JSON.parse(data) as GitHubRepo[];
	} catch {
		return [];
	}
}

class GitHubScraper {
	private browser: Browser | null = null;
	private page: Page | null = null;

	async initialize() {
		this.browser = await puppeteer.launch({
			headless: true,
		});
		this.page = await this.browser.newPage();
	}

	async scrapeRepos(
		username: string,
		daysThreshold: number = 30,
		existingRepos: GitHubRepo[] = []
	): Promise<GitHubRepo[]> {
		if (!this.page) throw new Error('Browser not initialized');

		// Navigate to user's public repositories page
		await this.page.goto(`https://github.com/${username}?tab=repositories`);
		await this.page.waitForSelector(
			'div[data-testid="user-repositories-list"]'
		);

		const repos = await this.page.evaluate(() => {
			const repoElements = document.querySelectorAll(
				'div[data-testid="user-repositories-list"] > div'
			);
			return Array.from(repoElements).map((repo) => {
				const nameElement = repo.querySelector(
					'a[data-testid="repository-name"]'
				);
				const descriptionElement = repo.querySelector(
					'p[itemprop="description"]'
				);
				const languageElement = repo.querySelector(
					'span[itemprop="programmingLanguage"]'
				);
				const starsElement = repo.querySelector(
					'a[href*="/stargazers"]'
				);
				const forksElement = repo.querySelector('a[href*="/forks"]');
				const updatedElement = repo.querySelector('relative-time');

				return {
					name: nameElement?.textContent?.trim() || '',
					description: descriptionElement?.textContent?.trim() || '',
					url: nameElement?.getAttribute('href') || '',
					language: languageElement?.textContent?.trim() || '',
					stars: parseInt(
						starsElement?.textContent?.trim() || '0',
						10
					),
					forks: parseInt(
						forksElement?.textContent?.trim() || '0',
						10
					),
					lastUpdated: updatedElement?.getAttribute('datetime') || '',
					content: '',
				};
			});
		});

		// Filter repos by update date
		const thresholdDate = new Date();
		thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

		const recentRepos = repos.filter((repo) => {
			const updateDate = new Date(repo.lastUpdated);
			return updateDate >= thresholdDate;
		});

		// Filter out repos we already have
		const newRepos = recentRepos.filter(
			(repo) =>
				!existingRepos.some((existing) => existing.url === repo.url)
		);

		// Fetch content for new repos
		for (const repo of newRepos) {
			if (repo.url) {
				await this.page.goto(`https://github.com${repo.url}`);
				await this.page.waitForSelector('article');

				repo.content = await this.page.evaluate(() => {
					const readmeElement = document.querySelector('article');
					return readmeElement?.textContent?.trim() || '';
				});
			}
		}

		return [...existingRepos, ...newRepos];
	}

	async saveToFile(repos: GitHubRepo[], filepath: string) {
		await fs.writeFile(filepath, JSON.stringify(repos, null, 2), 'utf-8');
	}

	async close() {
		if (this.browser) {
			await this.browser.close();
		}
	}
}

async function main() {
	const OUTPUT_FILE = 'github-repos.json';
	const scraper = new GitHubScraper();
	const username = 'brianjenney'; // Replace with your GitHub username
	const daysThreshold = 30; // Number of days to look back

	try {
		await scraper.initialize();

		// Load existing repos first
		const existingRepos = await loadExistingRepos(OUTPUT_FILE);
		console.log(`Found ${existingRepos.length} existing repos`);

		// Scrape new repos
		const allRepos = await scraper.scrapeRepos(
			username,
			daysThreshold,
			existingRepos
		);
		const newReposCount = allRepos.length - existingRepos.length;

		await scraper.saveToFile(allRepos, OUTPUT_FILE);
		console.log(`Successfully scraped ${newReposCount} new repos`);
		console.log(`Total repos: ${allRepos.length}`);
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await scraper.close();
	}
}

if (require.main === module) {
	main();
}

export { GitHubScraper, type GitHubRepo, type GitHubCredentials };
