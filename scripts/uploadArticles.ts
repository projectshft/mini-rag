/**
 * ARTICLE UPLOAD SCRIPT
 *
 * Uploads local markdown articles from data/articles to Pinecone.
 *
 * Usage:
 *   npx ts-node scripts/uploadArticles.ts
 *   yarn tsx scripts/uploadArticles.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
const rootDir = path.resolve(__dirname, '..');
const envLocalPath = path.join(rootDir, '.env.local');
const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envLocalPath)) {
	dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	dotenv.config();
}

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('Missing required environment variables:', missingVars);
	process.exit(1);
}

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const BATCH_SIZE = 100;

type Chunk = {
	id: string;
	content: string;
	metadata: {
		source: string;
		title: string;
		chunkIndex: number;
		totalChunks: number;
		sourceType: string;
	};
};

/**
 * Simple text chunking that splits on sentence boundaries
 */
function chunkText(
	text: string,
	source: string,
	title: string
): Chunk[] {
	const chunks: Chunk[] = [];
	const sentences = text.split(/(?<=[.!?])\s+/);

	let currentChunk = '';
	let chunkIndex = 0;

	for (const sentence of sentences) {
		if (currentChunk.length + sentence.length > CHUNK_SIZE && currentChunk.length > 0) {
			// Save current chunk
			chunks.push({
				id: `${source}-chunk-${chunkIndex}`,
				content: currentChunk.trim(),
				metadata: {
					source,
					title,
					chunkIndex,
					totalChunks: 0, // Will be updated later
					sourceType: 'article',
				},
			});

			// Start new chunk with overlap
			const words = currentChunk.split(' ');
			const overlapWords = words.slice(-Math.ceil(CHUNK_OVERLAP / 5));
			currentChunk = overlapWords.join(' ') + ' ' + sentence;
			chunkIndex++;
		} else {
			currentChunk += (currentChunk ? ' ' : '') + sentence;
		}
	}

	// Don't forget the last chunk
	if (currentChunk.trim()) {
		chunks.push({
			id: `${source}-chunk-${chunkIndex}`,
			content: currentChunk.trim(),
			metadata: {
				source,
				title,
				chunkIndex,
				totalChunks: 0,
				sourceType: 'article',
			},
		});
	}

	// Update totalChunks
	for (const chunk of chunks) {
		chunk.metadata.totalChunks = chunks.length;
	}

	return chunks;
}

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
	console.log('Starting article upload...\n');

	// Initialize clients
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
	const index = pinecone.Index(process.env.PINECONE_INDEX as string);

	// Read all markdown files
	if (!fs.existsSync(ARTICLES_DIR)) {
		console.error(`Articles directory not found: ${ARTICLES_DIR}`);
		process.exit(1);
	}

	const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));

	if (files.length === 0) {
		console.log('No markdown files found in', ARTICLES_DIR);
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

		const chunks = chunkText(content, source, title);
		allChunks.push(...chunks);
	}

	console.log(`\nTotal chunks to upload: ${allChunks.length}\n`);

	// Upload in batches
	let successCount = 0;

	for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
		const batch = allChunks.slice(i, i + BATCH_SIZE);

		console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allChunks.length / BATCH_SIZE)}...`);

		// Generate embeddings
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			dimensions: 512,
			input: batch.map((c) => c.content),
		});

		// Prepare vectors
		const vectors = batch.map((chunk, idx) => ({
			id: chunk.id,
			values: embeddingResponse.data[idx].embedding,
			metadata: {
				text: chunk.content,
				...chunk.metadata,
			},
		}));

		// Upload to Pinecone
		await index.upsert(vectors);
		successCount += batch.length;

		console.log(`  Uploaded ${successCount}/${allChunks.length} chunks`);
	}

	console.log(`\nDone! Successfully uploaded ${successCount} chunks to Pinecone.`);
}

uploadArticles().catch((error) => {
	console.error('Error uploading articles:', error);
	process.exit(1);
});
