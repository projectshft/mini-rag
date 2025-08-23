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

// Vector operations
function addVectors(a: number[], b: number[]): number[] {
	return a.map((val, i) => val + b[i]);
}

function subtractVectors(a: number[], b: number[]): number[] {
	return a.map((val, i) => val - b[i]);
}

function cosineSimilarity(a: number[], b: number[]): number {
	const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
	const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
	const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
	return dotProduct / (magA * magB);
}

// Get embedding for a word/phrase
async function getEmbedding(text: string): Promise<number[]> {
	const response = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 512,
		input: text,
	});
	return response.data[0].embedding;
}

// Find the closest word from a list given a target vector
async function findClosestWord(
	targetVector: number[],
	candidates: string[]
): Promise<{ word: string; similarity: number }[]> {
	const results: { word: string; similarity: number }[] = [];

	for (const candidate of candidates) {
		const embedding = await getEmbedding(candidate);
		const similarity = cosineSimilarity(targetVector, embedding);
		results.push({ word: candidate, similarity });
	}

	return results.sort((a, b) => b.similarity - a.similarity);
}

async function demonstrateWordArithmetic() {
	console.log('🧮 VECTOR WORD ARITHMETIC DEMONSTRATIONS');
	console.log('=========================================\n');

	// Example 1: Classic King-Queen relationship
	console.log('📚 CLASSIC EXAMPLE: Gender Relations');
	console.log('Formula: king - man + woman ≈ ?');

	const [kingVec, manVec, womanVec] = await Promise.all([
		getEmbedding('king'),
		getEmbedding('man'),
		getEmbedding('woman'),
	]);

	const result1 = addVectors(subtractVectors(kingVec, manVec), womanVec);
	const candidates1 = [
		'queen',
		'princess',
		'empress',
		'lady',
		'ruler',
		'monarch',
	];
	const matches1 = await findClosestWord(result1, candidates1);

	console.log('Top matches:');
	matches1.slice(0, 3).forEach((match, i) => {
		console.log(
			`${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
				3
			)})`
		);
	});
	console.log('');

	// Example 2: Spicy relationship dynamics
	console.log('🔥 SPICY EXAMPLE: Relationship Dynamics');
	console.log('Formula: boyfriend - commitment + freedom ≈ ?');

	const [boyfriendVec, commitmentVec, freedomVec] = await Promise.all([
		getEmbedding('boyfriend'),
		getEmbedding('commitment'),
		getEmbedding('freedom'),
	]);

	const result2 = addVectors(
		subtractVectors(boyfriendVec, commitmentVec),
		freedomVec
	);
	const candidates2 = [
		'fuckboy',
		'player',
		'bachelor',
		'single',
		'flirt',
		'hookup',
	];
	const matches2 = await findClosestWord(result2, candidates2);

	console.log('Top matches:');
	matches2.slice(0, 3).forEach((match, i) => {
		console.log(
			`${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
				3
			)})`
		);
	});
	console.log('');

	// Example 3: Tech bro transformation
	console.log('💻 TECH BRO EXAMPLE: Silicon Valley Transformation');
	console.log('Formula: engineer - humility + ego ≈ ?');

	const [engineerVec, humilityVec, egoVec] = await Promise.all([
		getEmbedding('engineer'),
		getEmbedding('humility'),
		getEmbedding('ego'),
	]);

	const result3 = addVectors(
		subtractVectors(engineerVec, humilityVec),
		egoVec
	);
	const candidates3 = [
		'founder',
		'CEO',
		'entrepreneur',
		'startup',
		'techbro',
		'disruptor',
	];
	const matches3 = await findClosestWord(result3, candidates3);

	console.log('Top matches:');
	matches3.slice(0, 3).forEach((match, i) => {
		console.log(
			`${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
				3
			)})`
		);
	});
	console.log('');

	// Example 4: Social media evolution
	console.log('📱 SOCIAL MEDIA EXAMPLE: Platform Evolution');
	console.log('Formula: Twitter - sanity + chaos ≈ ?');

	const [twitterVec, sanityVec, chaosVec] = await Promise.all([
		getEmbedding('Twitter'),
		getEmbedding('sanity'),
		getEmbedding('chaos'),
	]);

	const result4 = addVectors(
		subtractVectors(twitterVec, sanityVec),
		chaosVec
	);
	const candidates4 = [
		'X',
		'4chan',
		'Reddit',
		'TikTok',
		'hellscape',
		'dumpsterfire',
	];
	const matches4 = await findClosestWord(result4, candidates4);

	console.log('Top matches:');
	matches4.slice(0, 3).forEach((match, i) => {
		console.log(
			`${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
				3
			)})`
		);
	});
	console.log('');

	// Example 5: Career progression
	console.log('💼 CAREER EXAMPLE: Professional Evolution');
	console.log('Formula: intern - enthusiasm + cynicism ≈ ?');

	const [internVec, enthusiasmVec, cynicismVec] = await Promise.all([
		getEmbedding('intern'),
		getEmbedding('enthusiasm'),
		getEmbedding('cynicism'),
	]);

	const result5 = addVectors(
		subtractVectors(internVec, enthusiasmVec),
		cynicismVec
	);
	const candidates5 = [
		'manager',
		'executive',
		'burnout',
		'veteran',
		'survivor',
		'director',
	];
	const matches5 = await findClosestWord(result5, candidates5);

	console.log('Top matches:');
	matches5.slice(0, 3).forEach((match, i) => {
		console.log(
			`${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
				3
			)})`
		);
	});
	console.log('');

	// Example 6: Dating app reality
	console.log('💕 DATING EXAMPLE: App Reality');
	console.log('Formula: dating - authenticity + filters ≈ ?');

	const [datingVec, authenticityVec, filtersVec] = await Promise.all([
		getEmbedding('dating'),
		getEmbedding('authenticity'),
		getEmbedding('filters'),
	]);

	const result6 = addVectors(
		subtractVectors(datingVec, authenticityVec),
		filtersVec
	);
	const candidates6 = [
		'catfish',
		'Instagram',
		'facade',
		'performance',
		'theater',
		'illusion',
	];
	const matches6 = await findClosestWord(result6, candidates6);

	console.log('Top matches:');
	matches6.slice(0, 3).forEach((match, i) => {
		console.log(
			`${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
				3
			)})`
		);
	});
	console.log('');

	// Interactive section
	console.log('🎯 WHY THIS WORKS:');
	console.log('==================');
	console.log(
		'Vector embeddings capture semantic relationships in high-dimensional space.'
	);
	console.log(
		"When we do math on these vectors, we're manipulating meaning itself!"
	);
	console.log('');
	console.log('Think of it like this:');
	console.log('• Vectors encode the "essence" of concepts');
	console.log('• Addition combines concepts');
	console.log('• Subtraction removes aspects');
	console.log('• The result points to related concepts in semantic space');
	console.log('');
	console.log('🔬 EXERCISE FOR YOU:');
	console.log('Try creating your own word equations! Some ideas:');
	console.log('• coffee - sleep + anxiety ≈ ?');
	console.log('• Netflix - content + ads ≈ ?');
	console.log('• startup - funding + desperation ≈ ?');
	console.log('• influencer - talent + followers ≈ ?');

	//TODO: create your own examples and run them to gain some intuition on how vector math works
}

// Run the demonstration
demonstrateWordArithmetic().catch(console.error);
