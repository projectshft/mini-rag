import { scrapeWithCheerio, scrapeWithPuppeteer } from './scrapers/webScraper';
import { chunkText, Chunk } from './chunking';

export class DataProcessor {
	/**
	 * Processes a list of URLs and extracts content
	 * @param urls List of URLs to process
	 * @param useHeadless Whether to use Puppeteer for JavaScript-heavy sites
	 * @returns Array of text chunks
	 */
	async processUrls(urls: string[], useHeadless = false): Promise<Chunk[]> {
		console.log(`Processing ${urls.length} URLs...`);

		const allChunks: Chunk[] = [];

		for (const url of urls) {
			try {
				// Choose scraper based on site requirements
				const content = useHeadless
					? await scrapeWithPuppeteer(url)
					: await scrapeWithCheerio(url);

				if (content) {
					const chunks = chunkText(content.content, 500, 50, url);

					// Add original metadata to each chunk
					chunks.forEach((chunk) => {
						chunk.metadata = {
							...chunk.metadata,
							...content.metadata,
							title: content.title,
						};
					});

					allChunks.push(...chunks);

					console.log(`✅ Processed ${url}: ${chunks.length} chunks`);
				}

				// Be respectful - add delay between requests
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (error) {
				console.error(`❌ Failed to process ${url}:`, error);
			}
		}

		return allChunks;
	}

	/**
	 * Processes a single URL and extracts content
	 * @param url URL to process
	 * @param useHeadless Whether to use Puppeteer for JavaScript-heavy sites
	 * @returns Array of text chunks or null if processing failed
	 */
	async processSingleUrl(
		url: string,
		useHeadless = false
	): Promise<Chunk[] | null> {
		try {
			console.log(`Processing URL: ${url}`);

			// Choose scraper based on site requirements
			const content = useHeadless
				? await scrapeWithPuppeteer(url)
				: await scrapeWithCheerio(url);

			if (!content) {
				console.warn(`No content extracted from ${url}`);
				return null;
			}

			const chunks = chunkText(content.content, 500, 50, url);

			// Add original metadata to each chunk
			chunks.forEach((chunk) => {
				chunk.metadata = {
					...chunk.metadata,
					...content.metadata,
					title: content.title,
				};
			});

			console.log(`✅ Processed ${url}: ${chunks.length} chunks`);
			return chunks;
		} catch (error) {
			console.error(`❌ Failed to process ${url}:`, error);
			return null;
		}
	}
}
