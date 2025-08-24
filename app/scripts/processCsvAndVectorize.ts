/**
 * CSV DATA PROCESSING AND VECTORIZATION SCRIPT
 *
 * This script processes Brian's LinkedIn posts from CSV data and uploads them
 * to the vector database as whole entries without chunking.
 *
 * Process:
 * 1. Reads brian_posts.csv data
 * 2. Filters out posts without text content
 * 3. Vectorizes each post as a whole and stores in Pinecone
 *
 * Usage: yarn process-csv
 */

import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
import { openaiClient } from '../libs/openai/openai';
import { pineconeClient } from '../libs/pinecone';
import { Chunk } from '../libs/chunking';
import csv from 'csv-parser';

interface LinkedinPost {
	urn: string;
	text: string;
	type: string;
	firstName: string;
	lastName: string;
	numImpressions: string;
	numViews: string;
	numReactions: string;
	numComments: string;
	numShares: string;
	numVotes: string;
	numEngagementRate: string;
	hashtags: string;
	'createdAt (TZ=America/Los_Angeles)': string;
	link: string;
	engagement: {
		impressions: number;
		views: number;
		reactions: number;
		comments: number;
		shares: number;
		engagementRate: number;
	};
}

// Function to generate embeddings for a chunk of text
async function generateEmbedding(
	chunk: Chunk
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ id: string; values: number[]; metadata: any }> {
	if (!chunk.content || chunk.content.length < 20) {
		throw new Error('Content is too short.');
	}

	const embeddingResponse = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 512,
		input: chunk.content,
	});

	const vector = embeddingResponse.data[0].embedding;

	return {
		id: chunk.id,
		values: vector,
		metadata: {
			content: chunk.content,
			...chunk.metadata,
		},
	};
}

// Function to save vectors to a JSON file
function saveVectorsToFile(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	vectors: { id: string; values: number[]; metadata: any }[],
	filename: string
): void {
	// Save to app/data folder so students can access pre-generated embeddings
	const dataDir = path.join(__dirname, './data');

	// Create data directory if it doesn't exist (it should already exist)
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}

	const outputPath = path.join(dataDir, filename);
	fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2));
	console.log(`Saved ${vectors.length} vectors to ${outputPath}`);
	console.log('These vectors are saved in the app/data folder to use');
}

// Function to upload vectors to Pinecone
async function uploadToPinecone(vector: {
	id: string;
	values: number[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata: any;
}): Promise<void> {
	const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);
	await pineconeIndex.upsert([vector]);
}

/**
 * Process a CSV file and extract structured data
 * @param filePath - Path to the CSV file
 * @returns Promise resolving to an array of processed rows
 */
async function processCsv(filePath: string): Promise<LinkedinPost[]> {
	return new Promise((resolve, reject) => {
		const results: LinkedinPost[] = [];

		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (data) => {
				if (data.text && data.text.trim() !== '') {
					const cleanedText = data.text.replace(/\n/g, ' ').trim();

					results.push({
						urn: data.urn || `post-${results.length}`,
						text: cleanedText,
						type: data.type,
						firstName: data.firstName,
						lastName: data.lastName,
						numImpressions: data.numImpressions || '0',
						numViews: data.numViews || '0',
						numReactions: data.numReactions || '0',
						numComments: data.numComments || '0',
						numShares: data.numShares || '0',
						numVotes: data.numVotes || '0',
						numEngagementRate: data.numEngagementRate || '0',
						hashtags: data.hashtags || '',
						'createdAt (TZ=America/Los_Angeles)':
							data['createdAt (TZ=America/Los_Angeles)'],
						link: data.link,
						engagement: {
							impressions: parseInt(data.numImpressions) || 0,
							views: parseInt(data.numViews) || 0,
							reactions: parseInt(data.numReactions) || 0,
							comments: parseInt(data.numComments) || 0,
							shares: parseInt(data.numShares) || 0,
							engagementRate:
								parseFloat(data.numEngagementRate) || 0,
						},
					});
				}
			})
			.on('end', () => {
				console.log(
					`Processed ${results.length} non-empty entries from CSV`
				);
				resolve(results);
			})
			.on('error', (error) => {
				reject(error);
			});
	});
}

async function readCsvData(): Promise<LinkedinPost[]> {
	const csvPath = path.join(__dirname, './data/brian_posts.csv');
	try {
		const posts = await processCsv(csvPath);
		console.log(`Loaded ${posts.length} posts from CSV`);
		return posts;
	} catch (error) {
		throw new Error(`Failed to read CSV file: ${error}`);
	}
}

async function main() {
	console.log('Starting CSV data processing and vectorization...');
	console.log(`Started at: ${new Date().toISOString()}`);

	try {
		// Read CSV data
		const posts = await readCsvData();

		// Filter out posts without text content
		const postsWithText = posts.filter((post) => {
			return post.text && post.text.trim().length > 0;
		});

		console.log(
			`Found ${postsWithText.length} posts with text content (filtered from ${posts.length} total)`
		);

		if (postsWithText.length === 0) {
			console.log('No posts with text content found');
			return;
		}

		let successfulChunks = 0;
		let failedChunks = 0;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const allVectors: { id: string; values: number[]; metadata: any }[] =
			[];

		// Batch size for saving vectors periodically
		const SAVE_BATCH_SIZE = 10;
		const VECTORS_FILENAME = 'vectors.json';

		// Process each post as a whole (no chunking)
		for (const [index, post] of postsWithText.entries()) {
			console.log(
				`Processing post ${index + 1}/${postsWithText.length}: ${
					post.urn
				}`
			);

			try {
				// Create a chunk with the whole post content
				const chunk: Chunk = {
					id: `${post.urn}`,
					content: post.text,
					metadata: {
						source: 'brian_linkedin_posts',
						chunkIndex: 0,
						totalChunks: 1, // Each post is one chunk
						startChar: 0,
						endChar: post.text.length,
						url: post.link,
						title: `LinkedIn Post - ${post.type}`,
						author: `${post.firstName} ${post.lastName}`,
						createdAt: post['createdAt (TZ=America/Los_Angeles)'],
						type: post.type,
						impressions: parseInt(post.numImpressions) || 0,
						views: parseInt(post.numViews) || 0,
						reactions: parseInt(post.numReactions) || 0,
						comments: parseInt(post.numComments) || 0,
						shares: parseInt(post.numShares) || 0,
						engagementRate: parseFloat(post.numEngagementRate) || 0,
						hashtags: post.hashtags || '',
						originalUrn: post.urn,
					},
				};

				try {
					// Generate embedding for the chunk
					const vector = await generateEmbedding(chunk);

					// Add to our collection of vectors
					allVectors.push(vector);

					// Only upload to Pinecone if PINECONE_API_KEY is set
					if (process.env.PINECONE_API_KEY) {
						await uploadToPinecone(vector);
					}

					console.log(`Successfully vectorized post ${chunk.id}`);
					successfulChunks++;

					// Save vectors periodically to avoid losing progress
					if (successfulChunks % SAVE_BATCH_SIZE === 0) {
						saveVectorsToFile(allVectors, VECTORS_FILENAME);
						console.log(
							`Saved progress: ${successfulChunks}/${postsWithText.length} posts processed`
						);
					}
				} catch (error) {
					console.error(
						`Failed to vectorize post ${chunk.id}:`,
						error
					);
					failedChunks++;
				}
			} catch (error) {
				console.error(`Failed to process post ${post.urn}:`, error);
				failedChunks++;
			}
		}

		// Save all vectors to a JSON file
		if (allVectors.length > 0) {
			saveVectorsToFile(allVectors, VECTORS_FILENAME);
			console.log(`\nSaved ${allVectors.length} vectors to JSON file`);
			console.log(
				'Students can now use these pre-generated vectors without having to spend money on embeddings'
			);
			if (process.env.PINECONE_API_KEY) {
				console.log('Vectors have also been uploaded to Pinecone');
			} else {
				console.log(
					'To upload these vectors to Pinecone, set PINECONE_API_KEY and run upload-vectors.ts'
				);
			}
		}

		// Print summary
		console.log('\nCSV PROCESSING SUMMARY');
		console.log('=======================');
		console.log(`Total posts processed: ${postsWithText.length}`);
		console.log(`Successful posts: ${successfulChunks}`);
		console.log(`Failed posts: ${failedChunks}`);
		console.log(`Completed at: ${new Date().toISOString()}`);
	} catch (error) {
		console.error('Critical error during CSV processing:', error);
	}

	console.log('Finished processing CSV data and vectorizing content.');
}

// Execute main function with error handling
main().catch((error) => {
	console.error('Unhandled error:', error);
	process.exit(1);
});
