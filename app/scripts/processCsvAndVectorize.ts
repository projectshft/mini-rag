/**
 * CSV DATA PROCESSING AND VECTORIZATION SCRIPT
 *
 * This script processes Brian's LinkedIn posts from CSV data and uploads them
 * to the vector database with semantic chunking.
 *
 * Process:
 * 1. Reads brian_posts.csv data
 * 2. Filters out posts without text content
 * 3. Creates semantic chunks for each post
 * 4. Vectorizes and stores in Pinecone
 *
 * Usage: yarn process-csv
 */

import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from the project root FIRST
const rootDir = path.resolve(__dirname, '../..');
const envPath = path.join(rootDir, '.env');
const envLocalPath = path.join(rootDir, '.env.local');

// Try loading .env files in order of priority
if (fs.existsSync(envLocalPath)) {
	dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	dotenv.config();
}

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('Missing required environment variables:', missingVars);
	console.error(
		'Please check your .env or .env.local file in the project root'
	);
	process.exit(1);
}

import { vectorizeContent } from '../services/vectorize/vectorize-articles';
import { Chunk } from '../libs/chunking';

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

function createSemanticChunks(text: string, maxTokens: number = 512): string[] {
	// Simple semantic chunking - split by paragraphs and keep under token limit
	const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
	const chunks: string[] = [];
	let currentChunk = '';

	for (const paragraph of paragraphs) {
		// Rough token estimation (1 token ≈ 4 characters)
		const estimatedTokens = (currentChunk + paragraph).length / 4;

		if (estimatedTokens > maxTokens && currentChunk) {
			chunks.push(currentChunk.trim());
			currentChunk = paragraph;
		} else {
			currentChunk += (currentChunk ? '\n' : '') + paragraph;
		}
	}

	if (currentChunk.trim()) {
		chunks.push(currentChunk.trim());
	}

	return chunks.length > 0 ? chunks : [text]; // Fallback to original text if no chunks
}

function parseCsvLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === ',' && !inQuotes) {
			result.push(current);
			current = '';
		} else {
			current += char;
		}
	}

	result.push(current);
	return result;
}

async function readCsvData(): Promise<LinkedinPost[]> {
	const csvPath = path.join(__dirname, '../data/brian_posts.csv');

	try {
		const fileContent = fs.readFileSync(csvPath, 'utf-8');
		const lines = fileContent.split('\n').filter((line) => line.trim());

		if (lines.length === 0) {
			throw new Error('CSV file is empty');
		}

		// Parse header
		const headers = parseCsvLine(lines[0]);
		const posts: LinkedinPost[] = [];

		// Parse data rows
		for (let i = 1; i < lines.length; i++) {
			const values = parseCsvLine(lines[i]);
			if (values.length === headers.length) {
				const post: Record<string, string> = {};
				headers.forEach((header, index) => {
					post[header] = values[index] || '';
				});
				posts.push(post as unknown as LinkedinPost);
			}
		}

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
		let totalChunks = 0;

		// Process each post
		for (const [index, post] of postsWithText.entries()) {
			console.log(
				`Processing post ${index + 1}/${postsWithText.length}: ${
					post.urn
				}`
			);

			try {
				// Create semantic chunks for the post
				const chunks = createSemanticChunks(post.text);
				totalChunks += chunks.length;

				console.log(
					`Created ${chunks.length} chunks for post ${post.urn}`
				);

				// Vectorize each chunk
				for (const [chunkIndex, chunkContent] of chunks.entries()) {
					const chunk: Chunk = {
						id: `${post.urn}-chunk-${chunkIndex}`,
						content: chunkContent,
						metadata: {
							source: 'brian_linkedin_posts',
							chunkIndex,
							totalChunks: chunks.length,
							startChar: 0,
							endChar: chunkContent.length,
							url: post.link,
							title: `LinkedIn Post - ${post.type}`,
							author: `${post.firstName} ${post.lastName}`,
							createdAt:
								post['createdAt (TZ=America/Los_Angeles)'],
							type: post.type,
							impressions: parseInt(post.numImpressions) || 0,
							views: parseInt(post.numViews) || 0,
							reactions: parseInt(post.numReactions) || 0,
							comments: parseInt(post.numComments) || 0,
							shares: parseInt(post.numShares) || 0,
							engagementRate:
								parseFloat(post.numEngagementRate) || 0,
							hashtags: post.hashtags || '',
							originalUrn: post.urn,
						},
					};

					try {
						await vectorizeContent(chunk);
						console.log(
							`Successfully vectorized chunk ${chunk.id}`
						);
						successfulChunks++;
					} catch (error) {
						console.error(
							`Failed to vectorize chunk ${chunk.id}:`,
							error
						);
						failedChunks++;
					}
				}
			} catch (error) {
				console.error(`Failed to process post ${post.urn}:`, error);
				failedChunks++;
			}
		}

		// Print summary
		console.log('\nCSV PROCESSING SUMMARY');
		console.log('=======================');
		console.log(`Total posts processed: ${postsWithText.length}`);
		console.log(`Total chunks created: ${totalChunks}`);
		console.log(`Successful chunks: ${successfulChunks}`);
		console.log(`Failed chunks: ${failedChunks}`);
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
