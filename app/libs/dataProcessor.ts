import { scrapeWithCheerio } from './scrapers/webScraper';
import { chunkText, Chunk } from './chunking';

export class DataProcessor {
	/**
	 * Processes a list of URLs and extracts content
	 * @param urls List of URLs to process
	 * @returns Array of text chunks
	 */
	async processUrls(urls: string[]): Promise<Chunk[]> {
		const allChunks: Chunk[] = [];

		for (const url of urls) {
			try {
				const content = await scrapeWithCheerio(url);

				if (content) {
					const chunks = chunkText(content.content, 500, 50, url);

					chunks.forEach((chunk) => {
						chunk.metadata = {
							...chunk.metadata,
							...content.metadata,
							title: content.title,
							url: content.url,
							source: url,
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
		try {
			console.log(`Processing text content: "${metadata.title}"`);

			const chunks = chunkText(
				content,
				500,
				50,
				`text:${metadata.title}`
			);

			// Add metadata to each chunk
			chunks.forEach((chunk, index) => {
				chunk.metadata = {
					...chunk.metadata,
					title: metadata.title,
					description: metadata.description || '',
					tags: metadata.tags,
					sourceType: metadata.sourceType,
					source: `text:${metadata.title}`,
					chunkIndex: index,
					totalChunks: chunks.length,
				};
			});

			console.log(
				`✅ Processed text content "${metadata.title}": ${chunks.length} chunks`
			);
			return chunks;
		} catch (error) {
			console.error(
				`❌ Failed to process text content "${metadata.title}":`,
				error
			);
			return [];
		}
	}
}
