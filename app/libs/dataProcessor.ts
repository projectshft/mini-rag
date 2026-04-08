import { scrapeWithCheerio } from './scrapers/webScraper';
import { chunkText, Chunk } from './chunking';

export class DataProcessor {
	/**
	 * Processes a list of URLs and extracts content
	 * @param urls List of URLs to process
	 * @returns Array of text chunks
	 */
	async processUrls(urls: string[]): Promise<Chunk[]> {
		// TODO: Implement URL processing
		//
		// Steps:
		// 1. Loop through each URL
		// 2. Scrape content using scrapeWithCheerio()
		// 3. Chunk content using chunkText() with size 500, overlap 50
		// 4. Enrich chunk metadata with scraped content metadata (title, url, source)
		// 5. Add delay between requests (1000ms) to be respectful
		// 6. Handle errors gracefully - log and continue
		// 7. Return all chunks

		throw new Error('processUrls not implemented yet!');
	}

	/**
	 * Processes text content directly
	 * @param content Text content to process
	 * @param metadata Additional metadata for the content
	 * @returns Array of text chunks
	 */
	async processText(
		content: string,
		metadata: {
			title: string;
			description?: string;
			tags: string[];
			sourceType: string;
		}
	): Promise<Chunk[]> {
		// TODO: Implement text processing
		//
		// Steps:
		// 1. Chunk the content using chunkText() with size 500, overlap 50
		//    Use `text:${metadata.title}` as the source
		// 2. Enrich each chunk's metadata with title, description, tags, sourceType
		// 3. Return the chunks array
		// 4. Handle errors gracefully - return empty array on failure

		throw new Error('processText not implemented yet!');
	}
}
