/**
 * Vector Upload Script
 *
 * Uploads pre-generated vectors from a JSON file to Pinecone.
 * This is useful when you have vectors generated externally and want to bulk upload them.
 */

import { pineconeClient } from '@/app/libs/pinecone';
import fs from 'fs';
import path from 'path';

async function createIndexIfNeeded(
	indexName: string,
	dimension: number
): Promise<boolean> {
	try {
		const indexList = await pineconeClient.listIndexes();
		const existingIndex = indexList.indexes?.find(
			(idx) => idx.name === indexName
		);

		if (existingIndex) {
			console.log(`Index '${indexName}' already exists`);
			if (existingIndex.dimension !== dimension) {
				console.warn(
					`⚠️  Index dimension mismatch: expected ${dimension}, got ${existingIndex.dimension}`
				);
				console.log(
					`You may need to delete the existing index or use a different name`
				);
				return false;
			}
			return true;
		}

		console.log(
			`Creating index '${indexName}' with dimension ${dimension}...`
		);
		await pineconeClient.createIndex({
			name: indexName,
			dimension: dimension,
			metric: 'cosine',
			spec: {
				serverless: {
					cloud: 'aws',
					region: 'us-east-1',
				},
			},
		});

		console.log(`✅ Index '${indexName}' created successfully`);

		// Wait a bit for index to be ready
		console.log('Waiting for index to be ready...');
		await new Promise((resolve) => setTimeout(resolve, 5000));

		return true;
	} catch (error) {
		console.error('Error managing index:', error);
		return false;
	}
}

async function upsertVectors(
	indexName: string,
	vectors: {
		id: string;
		values: number[];
		metadata: Record<string, string | number | boolean | string[]>;
	}[]
): Promise<void> {
	const index = pineconeClient.Index(indexName);
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

		const indexReady = await createIndexIfNeeded(indexName, dimension);

		if (!indexReady) {
			throw new Error('Index is not ready for upload');
		}

		console.log(`Uploading to Pinecone index: ${indexName}`);

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
