/**
 * SCIENTIFIC PAPERS UPLOAD SCRIPT
 *
 * Uploads scientific papers from data/white-papers to Weaviate.
 * Each paper contains a title and abstract in JSON format.
 *
 * Usage:
 *   npx ts-node scripts/uploadPapers.ts
 *   yarn upload-papers
 */

import * as fs from 'fs';
import * as path from 'path';
import weaviate, { WeaviateClient } from 'weaviate-client';
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
const requiredEnvVars = ['OPENAI_API_KEY', 'WEAVIATE_URL', 'WEAVIATE_API_KEY'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('Missing required environment variables:', missingVars);
	process.exit(1);
}

const PAPERS_DIR = path.join(process.cwd(), 'data', 'white-papers');
const BATCH_SIZE = 100;
const COLLECTION_NAME = 'ScientificPapers';
const EMBEDDING_DIMENSIONS = 1536;

type Paper = {
	title: string;
	abstract: string;
};

async function uploadPapers(): Promise<void> {
	console.log('Starting scientific papers upload to Weaviate...\n');

	// TODO: Initialize OpenAI client
	// Use new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

	// TODO: Initialize Weaviate client
	// Use weaviate.connectToWeaviateCloud() with WEAVIATE_URL and WEAVIATE_API_KEY

	// TODO: Get the collection
	// Use client.collections.get(COLLECTION_NAME)

	// Read all JSON files
	if (!fs.existsSync(PAPERS_DIR)) {
		console.error(`Papers directory not found: ${PAPERS_DIR}`);
		process.exit(1);
	}

	const files = fs.readdirSync(PAPERS_DIR).filter((f) => f.endsWith('.json'));

	if (files.length === 0) {
		console.log('No JSON files found in', PAPERS_DIR);
		return;
	}

	console.log(`Found ${files.length} paper(s) to process\n`);

	// Process each file
	const allPapers: Array<{
		id: string;
		content: string;
		metadata: {
			title: string;
			abstract: string;
		};
	}> = [];

	for (const file of files) {
		const filepath = path.join(PAPERS_DIR, file);
		const content = fs.readFileSync(filepath, 'utf-8');
		const paper: Paper = JSON.parse(content);
		const paperId = file.replace('.json', '');

		// Combine title and abstract for embedding
		const combinedText = `${paper.title}\n\n${paper.abstract}`;

		allPapers.push({
			id: `paper:${paperId}`,
			content: combinedText,
			metadata: {
				title: paper.title,
				abstract: paper.abstract,
			},
		});
	}

	console.log(`Total papers to upload: ${allPapers.length}\n`);

	// TODO: Upload in batches
	// For each batch:
	// 1. Generate embeddings using openai.embeddings.create()
	//    - Model: 'text-embedding-3-small'
	//    - Dimensions: EMBEDDING_DIMENSIONS (1536)
	//    - Input: batch.map((p) => p.content)
	// 2. Prepare objects with properties and vectors
	//    - Properties: title, abstract, sourceType, paperId
	//    - Vector: embeddingResponse.data[idx].embedding
	// 3. Insert using collection.data.insertMany(objects)
	// 4. Track progress and log success count
}

uploadPapers().catch((error) => {
	console.error('Error uploading papers:', error);
	process.exit(1);
});
