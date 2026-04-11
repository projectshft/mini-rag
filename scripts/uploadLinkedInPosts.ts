/**
 * LINKEDIN POSTS UPLOAD SCRIPT
 *
 * Uploads LinkedIn posts from data/brian_posts.csv to Pinecone.
 *
 * Usage:
 *   yarn upload-linkedin
 */

import * as fs from 'fs';
import * as path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';
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
const requiredEnvVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('Missing required environment variables:', missingVars);
	process.exit(1);
}

const CSV_PATH = path.join(process.cwd(), 'data', 'brian_posts.csv');
const BATCH_SIZE = 100;
const MIN_POST_LENGTH = 100; // Skip very short posts

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
	console.log('Starting LinkedIn posts upload...\n');

	// Initialize clients
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
	const index = pinecone.Index(process.env.PINECONE_INDEX as string);

	// Read CSV
	if (!fs.existsSync(CSV_PATH)) {
		console.error(`CSV file not found: ${CSV_PATH}`);
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

	// Prepare vectors
	const vectors: Array<{
		id: string;
		content: string;
		metadata: Record<string, string | number>;
	}> = [];

	for (const post of validPosts) {
		vectors.push({
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

	console.log(`Uploading ${vectors.length} posts...\n`);

	// Upload in batches
	let successCount = 0;

	for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
		const batch = vectors.slice(i, i + BATCH_SIZE);

		console.log(
			`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(vectors.length / BATCH_SIZE)}...`
		);

		// Generate embeddings
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-3-small',
			dimensions: 512,
			input: batch.map((v) => v.content),
		});

		// Prepare Pinecone vectors
		const pineconeVectors = batch.map((v, idx) => ({
			id: v.id,
			values: embeddingResponse.data[idx].embedding,
			metadata: v.metadata,
		}));

		// Upload to Pinecone
		await index.upsert(pineconeVectors);
		successCount += batch.length;

		console.log(`  Uploaded ${successCount}/${vectors.length} posts`);
	}

	console.log(`\nDone! Successfully uploaded ${successCount} LinkedIn posts to Pinecone.`);
}

uploadLinkedInPosts().catch((error) => {
	console.error('Error uploading LinkedIn posts:', error);
	process.exit(1);
});
