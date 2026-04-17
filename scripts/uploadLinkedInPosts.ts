/**
 * LINKEDIN POSTS UPLOAD SCRIPT
 *
 * Uploads LinkedIn posts from data/brian_posts.csv to Weaviate.
 *
 * Usage:
 *   yarn upload-linkedin
 */

import * as fs from 'fs';
import * as path from 'path';
import weaviate, { WeaviateClient } from 'weaviate-client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';

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

const CSV_PATH = path.join(process.cwd(), 'data', 'brian_posts.csv');
const BATCH_SIZE = 100;
const MIN_POST_LENGTH = 100; // Skip very short posts
const COLLECTION_NAME = 'LinkedInPosts';
const EMBEDDING_DIMENSIONS = 1536;

type LinkedInPost = {
	urn: string;
	text: string;
	type: string;
	numImpressions: string;
	numReactions: string;
	numComments: string;
	hashtags: string;
	createdAt: string;
	link: string;
};

async function uploadLinkedInPosts(): Promise<void> {
	console.log('Starting LinkedIn posts upload to Weaviate...\n');

	// Initialize clients
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const client: WeaviateClient = await weaviate.connectToWeaviateCloud(
		process.env.WEAVIATE_URL as string,
		{
			authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY as string),
		}
	);

	const collection = client.collections.get(COLLECTION_NAME);

	// Read CSV
	if (!fs.existsSync(CSV_PATH)) {
		console.error(`CSV file not found: ${CSV_PATH}`);
		await client.close();
		process.exit(1);
	}

	const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
	const records: LinkedInPost[] = parse(csvContent, {
		columns: true,
		skip_empty_lines: true,
	});

	console.log(`Found ${records.length} total posts`);

	// Filter posts with meaningful content
	const validPosts = records.filter(
		(post) => post.text && post.text.length >= MIN_POST_LENGTH
	);

	console.log(`${validPosts.length} posts with ${MIN_POST_LENGTH}+ characters\n`);

	// Prepare data
	const postsData: Array<{
		id: string;
		content: string;
		metadata: {
			text: string;
			source: string;
			sourceType: string;
			urn: string;
			impressions: number;
			reactions: number;
			comments: number;
			hashtags: string;
			createdAt: string;
			link: string;
		};
	}> = [];

	for (const post of validPosts) {
		postsData.push({
			id: `linkedin:${post.urn}`,
			content: post.text,
			metadata: {
				text: post.text,
				source: 'linkedin',
				sourceType: 'linkedin-post',
				urn: post.urn,
				impressions: parseInt(post.numImpressions) || 0,
				reactions: parseInt(post.numReactions) || 0,
				comments: parseInt(post.numComments) || 0,
				hashtags: post.hashtags || '',
				createdAt: post.createdAt || '',
				link: post.link || '',
			},
		});
	}

	console.log(`Uploading ${postsData.length} posts...\n`);

	// Upload in batches
	let successCount = 0;

	for (let i = 0; i < postsData.length; i += BATCH_SIZE) {
		const batch = postsData.slice(i, i + BATCH_SIZE);

		console.log(
			`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(postsData.length / BATCH_SIZE)}...`
		);

		// Generate embeddings
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			dimensions: EMBEDDING_DIMENSIONS,
			input: batch.map((p) => p.content),
		});

		// Prepare objects for Weaviate
		const objects = batch.map((post, idx) => ({
			properties: {
				text: post.metadata.text,
				source: post.metadata.source,
				sourceType: post.metadata.sourceType,
				urn: post.metadata.urn,
				impressions: post.metadata.impressions,
				reactions: post.metadata.reactions,
				comments: post.metadata.comments,
				hashtags: post.metadata.hashtags,
				createdAt: post.metadata.createdAt,
				link: post.metadata.link,
			},
			vectors: {
				default: embeddingResponse.data[idx].embedding,
			},
		}));

		// Upload to Weaviate
		await collection.data.insertMany(objects);
		successCount += batch.length;

		console.log(`  Uploaded ${successCount}/${postsData.length} posts`);
	}

	console.log(`\nDone! Successfully uploaded ${successCount} LinkedIn posts to Weaviate.`);
	await client.close();
}

uploadLinkedInPosts().catch((error) => {
	console.error('Error uploading LinkedIn posts:', error);
	process.exit(1);
});
