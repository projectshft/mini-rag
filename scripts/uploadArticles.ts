/**
 * ARTICLE UPLOAD SCRIPT
 *
 * Uploads local markdown articles from data/articles to Weaviate.
 * Articles are chunked into smaller pieces for better retrieval.
 *
 * Usage:
 *   npx ts-node scripts/uploadArticles.ts
 *   yarn upload-articles
 */

import * as fs from 'fs';
import * as path from 'path';
import weaviate, { WeaviateClient } from 'weaviate-client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { chunkText, Chunk } from '../app/libs/chunking';

// Load environment variables
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

dotenv.config({ path: envPath });

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'WEAVIATE_URL', 'WEAVIATE_API_KEY'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('Missing required environment variables:', missingVars);
	process.exit(1);
}

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const BATCH_SIZE = 100;
const COLLECTION_NAME = 'MediumArticles';
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, filename: string): string {
	const match = content.match(/^#\s+(.+)$/m);
	if (match) {
		return match[1].trim();
	}
	// Fallback to filename
	return filename.replace(/\.md$/, '').replace(/_/g, ' ');
}

async function uploadArticles(): Promise<void> {
	console.log('Starting Medium articles upload to Weaviate...\n');

	// Initialize clients
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const client: WeaviateClient = await weaviate.connectToWeaviateCloud(
		process.env.WEAVIATE_URL as string,
		{
			authCredentials: new weaviate.ApiKey(
				process.env.WEAVIATE_API_KEY as string,
			),
		},
	);

	const collection = client.collections.get(COLLECTION_NAME);

	// Read all markdown files
	if (!fs.existsSync(ARTICLES_DIR)) {
		console.error(`Articles directory not found: ${ARTICLES_DIR}`);
		await client.close();
		process.exit(1);
	}

	const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));

	if (files.length === 0) {
		console.log('No markdown files found in', ARTICLES_DIR);
		await client.close();
		return;
	}

	console.log(`Found ${files.length} article(s) to process:\n`);

	// Process each file
	const allChunks: Chunk[] = [];

	for (const file of files) {
		const filepath = path.join(ARTICLES_DIR, file);
		const content = fs.readFileSync(filepath, 'utf-8');
		const title = extractTitle(content, file);
		const source = `article:${file}`;

		console.log(`  - ${file} (${title})`);

		// TODO: Use chunkText from @app/libs/chunking.ts
		// Call chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP, source)
		// Add title to each chunk's metadata
		const chunks = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP, source);

		// Add title to metadata
		chunks.forEach((chunk) => {
			chunk.metadata.title = title;
			chunk.metadata.sourceType = 'article';
		});

		allChunks.push(...chunks);
	}

	console.log(`\nTotal chunks to upload: ${allChunks.length}\n`);

	// Upload in batches
	let successCount = 0;

	for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
		const batch = allChunks.slice(i, i + BATCH_SIZE);

		console.log(
			`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allChunks.length / BATCH_SIZE)}...`,
		);

		// Generate embeddings
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			dimensions: EMBEDDING_DIMENSIONS,
			input: batch.map((c) => c.content),
		});

		// Prepare objects for Weaviate
		const objects = batch.map((chunk, idx) => ({
			properties: {
				text: chunk.content,
				source: chunk.metadata.source,
				title: chunk.metadata.title,
				chunkIndex: chunk.metadata.chunkIndex,
				totalChunks: chunk.metadata.totalChunks,
				sourceType: chunk.metadata.sourceType,
			},
			vectors: {
				default: embeddingResponse.data[idx].embedding,
			},
		}));

		// Upload to Weaviate
		await collection.data.insertMany(objects);
		successCount += batch.length;

		console.log(`  Uploaded ${successCount}/${allChunks.length} chunks`);
	}

	console.log(
		`\nDone! Successfully uploaded ${successCount} chunks to Weaviate.`,
	);
	await client.close();
}

uploadArticles().catch((error) => {
	console.error('Error uploading articles:', error);
	process.exit(1);
});
