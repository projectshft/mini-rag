/**
 * Vector Upload Script
 *
 * Uploads pre-generated vectors from a JSON file to Pinecone.
 * This is useful when you have vectors generated externally and want to bulk upload them.
 */

import dotenv from 'dotenv';
dotenv.config();
import { pineconeClient } from '../libs/pinecone';
import fs from 'fs';
import path from 'path';

async function upsertVectors(
	indexName: string = 'brian-clone',
	vectors: {
		id: string;
		values: number[];
		metadata: Record<string, string | number | boolean | string[]>;
	}[]
): Promise<void> {
	const index = pineconeClient.Index(indexName); // CHANGE THIS TO THE INDEX YOU WANT TO UPLOAD TO
	const batchSize = 100; // Pinecone recommends batches of 100

	for (let i = 0; i < vectors.length; i += batchSize) {
		const batch = vectors.slice(i, i + batchSize);
		console.log(
			`Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
				vectors.length / batchSize
			)}...`
		);

		await index.upsert(batch);
	}
}

async function uploadVectorsToPinecone(): Promise<void> {
	try {
		// Try multiple possible paths for the vectors file
		const possiblePaths = [
			path.join(process.cwd(), 'app', 'data', 'vectors.json'),
			path.join(process.cwd(), 'output', 'brian_posts_vectors.json'),
			path.join(process.cwd(), 'data', 'vectors.json'),
			path.join(process.cwd(), 'vectors.json'),
		];

		let vectorsPath: string | null = null;
		for (const filePath of possiblePaths) {
			if (fs.existsSync(filePath)) {
				vectorsPath = filePath;
				break;
			}
		}

		if (!vectorsPath) {
			throw new Error(
				`Vectors file not found. Tried paths: ${possiblePaths.join(
					', '
				)}`
			);
		}

		console.log(`Loading vectors from: ${vectorsPath}`);
		const vectorsData = fs.readFileSync(vectorsPath, 'utf8');
		const vectors = JSON.parse(vectorsData);

		if (!Array.isArray(vectors) || vectors.length === 0) {
			throw new Error('No vectors found in file or invalid format');
		}

		const dimension = vectors[0].values?.length;
		if (!dimension) {
			throw new Error('Invalid vector format - missing values array');
		}

		console.log(
			`Found ${vectors.length} vectors with dimension ${dimension}`
		);

		const indexName = process.env.PINECONE_INDEX;
		if (!indexName) {
			throw new Error('PINECONE_INDEX environment variable not set');
		}

		await upsertVectors(indexName, vectors);

		console.log('✅ Successfully uploaded all vectors to Pinecone!');
		console.log(
			`📊 Uploaded ${vectors.length} vectors to index '${indexName}'`
		);
	} catch (error) {
		console.error('❌ Error uploading vectors:', error);
		process.exit(1);
	}
}

// Run the script
uploadVectorsToPinecone();
