/**
 * VECTOR WORD ARITHMETIC EXERCISE
 *
 * This exercise demonstrates how vector addition and subtraction can reveal
 * semantic relationships between words. Think of it as "word math"!
 *
 * Famous example: king - man + woman ≈ queen
 *
 * Run this script with: yarn exercise:word-math
 */

import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
const rootDir = path.resolve(__dirname, '../../..');
const envPath = path.join(rootDir, '.env');
const envLocalPath = path.join(rootDir, '.env.local');

if (fs.existsSync(envLocalPath)) {
	dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	dotenv.config();
}

import { openaiClient } from '../../libs/openai/openai';

// Load embeddings cache
let embeddingsCache: Record<string, number[]> = {};
try {
	const cachePath = path.join(__dirname, '../../../embeddings-cache.json');
	if (fs.existsSync(cachePath)) {
		embeddingsCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
		console.log('✅ Loaded embeddings cache from file');
	}
} catch (error: unknown) {
	console.log('⚠️  Error loading embeddings cache:', error);
	console.log('⚠️  No embeddings cache found, will use OpenAI API');
}

// Vector operations
function addVectors(a: number[], b: number[]): number[] {
	// TODO: Implement vector addition
	// Return a new array where each element is the sum of corresponding elements from a and b

	throw new Error('addVectors not implemented yet!');
}

function subtractVectors(a: number[], b: number[]): number[] {
	// TODO: Implement vector subtraction
	// Return a new array where each element is the difference of corresponding elements (a[i] - b[i])

	throw new Error('subtractVectors not implemented yet!');
}

function cosineSimilarity(a: number[], b: number[]): number {
	// TODO: Implement cosine similarity
	//
	// Steps:
	// 1. Calculate dot product: sum of a[i] * b[i]
	// 2. Calculate magnitude of a: sqrt(sum of a[i]^2)
	// 3. Calculate magnitude of b: sqrt(sum of b[i]^2)
	// 4. Return dotProduct / (magA * magB)

	throw new Error('cosineSimilarity not implemented yet!');
}

// Get embedding for a word/phrase
async function getEmbedding(text: string): Promise<number[]> {
	// TODO: Implement embedding retrieval
	//
	// Steps:
	// 1. Check embeddingsCache[text] first - return cached value if exists
	// 2. If not cached, call openaiClient.embeddings.create()
	//    - Model: 'text-embedding-3-small', Dimensions: 512
	// 3. Return the embedding array from response.data[0].embedding

	throw new Error('getEmbedding not implemented yet!');
}

// Find the closest word from a list given a target vector
async function findClosestWord(
	targetVector: number[],
	candidates: string[]
): Promise<{ word: string; similarity: number }[]> {
	// TODO: Implement closest word finder
	//
	// Steps:
	// 1. For each candidate word, get its embedding
	// 2. Calculate cosine similarity between targetVector and the embedding
	// 3. Collect results as { word, similarity } objects
	// 4. Sort by similarity (highest first)
	// 5. Return sorted results

	throw new Error('findClosestWord not implemented yet!');
}

async function demonstrateWordArithmetic() {
	// TODO: Implement word arithmetic demonstrations
	//
	// Create examples like:
	//   king - man + woman ≈ queen
	//
	// Steps:
	// 1. Get embeddings for each word using getEmbedding()
	// 2. Perform vector arithmetic using addVectors() and subtractVectors()
	// 3. Use findClosestWord() to find what the resulting vector is closest to
	// 4. Display results
	//
	// Try creating your own examples to build intuition on how vector math works!

	throw new Error('demonstrateWordArithmetic not implemented yet!');
}

// Run the demonstration
demonstrateWordArithmetic().catch(console.error);
