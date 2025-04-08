import { GitHubScraper } from './scraping/github';
import { processReposToPinecone } from './vectorize/github';
import fs from 'fs/promises';

async function loadExistingRepos(filepath: string) {
	try {
		const data = await fs.readFile(filepath, 'utf-8');
		return JSON.parse(data);
	} catch {
		return []; // Return empty array if file doesn't exist
	}
}

async function main() {
	const OUTPUT_FILE = 'github-repos.json';
	const scraper = new GitHubScraper();
	const username = 'brianjenney'; // Replace with your GitHub username
	const daysThreshold = 30; // Number of days to look back

	try {
		console.log('Initializing GitHub scraper...');
		await scraper.initialize();

		// Load existing repos first
		const existingRepos = await loadExistingRepos(OUTPUT_FILE);
		console.log(`Found ${existingRepos.length} existing repos`);

		// Scrape new repos
		console.log('Scraping GitHub repositories...');
		const allRepos = await scraper.scrapeRepos(
			username,
			daysThreshold,
			existingRepos
		);
		const newReposCount = allRepos.length - existingRepos.length;

		await scraper.saveToFile(allRepos, OUTPUT_FILE);
		console.log(`Successfully scraped ${newReposCount} new repos`);
		console.log(`Total repos: ${allRepos.length}`);

		// Close the scraper
		await scraper.close();

		// Process repos to Pinecone
		console.log('Processing repositories to Pinecone...');
		await processReposToPinecone(OUTPUT_FILE, daysThreshold);
		console.log('All repositories processed and added to Pinecone');
	} catch (error) {
		console.error('Error:', error);
	}
}

if (require.main === module) {
	main()
		.then(() => console.log('Done'))
		.catch((error) => console.error('Error:', error));
}
