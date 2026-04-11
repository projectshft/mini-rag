/**
 * VECTOR WORD ARITHMETIC EXERCISE
 *
 * This exercise demonstrates how vector addition and subtraction can reveal
 * semantic relationships between words. Think of it as "word math"!
 *
 * Famous example: king - man + woman ≈ queen
 *
 * Run this script with: yarn exercise:word-math
 *
 * AVAILABLE WORDS (cached embeddings):
 * - Royalty: king, queen, prince, princess, emperor, duchess, lady, monarch, ruler, empress
 * - Gender: man, woman
 * - Places: paris, france, italy, rome, milan, venice, florence, naples, berlin, madrid
 * - Medical: doctor, nurse, physician, surgeon, dentist, therapist
 * - Software Dev:
 *     Languages: javascript, python, typescript, java, rust, golang
 *     Roles: developer, programmer, coder, hacker, junior, senior, lead, architect
 *     Specialties: frontend, backend, fullstack
 *     Concepts: bug, feature, deploy, refactor, debug, code, software, application, program
 *     Infrastructure: database, api, server, client
 *     Frameworks: react, angular, vue, node
 * - Business: CEO, founder, entrepreneur, executive, director, manager, intern, startup
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
	if (embeddingsCache[text]) {
		return embeddingsCache[text];
	}

	const response = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
		dimensions: 512,
	});

	return response.data[0].embedding;
}

// Find the closest word from a list given a target vector
async function findClosestWord(
	targetVector: number[],
	candidates: string[],
): Promise<{ word: string; similarity: number }[]> {
	const results: { word: string; similarity: number }[] = [];

	for (const word of candidates) {
		const embedding = await getEmbedding(word);
		const similarity = cosineSimilarity(targetVector, embedding);
		results.push({ word, similarity });
	}

	return results.sort((a, b) => b.similarity - a.similarity);
}

async function demonstrateWordArithmetic() {
	console.log('\n🧮 VECTOR WORD ARITHMETIC DEMONSTRATION\n');
	console.log('='.repeat(50));

	// Example 1: king - man + woman ≈ queen
	console.log('\n📝 Example 1: king - man + woman = ?');
	console.log('-'.repeat(40));

	const kingVec = await getEmbedding('king');
	const manVec = await getEmbedding('man');
	const womanVec = await getEmbedding('woman');

	// king - man + woman
	const resultVec = addVectors(subtractVectors(kingVec, manVec), womanVec);

	const candidates1 = ['queen', 'princess', 'prince', 'emperor', 'duchess', 'lady', 'monarch'];
	const results1 = await findClosestWord(resultVec, candidates1);

	console.log('Results (sorted by similarity):');
	results1.forEach((r, i) => {
		console.log(`  ${i + 1}. ${r.word}: ${r.similarity.toFixed(4)}`);
	});

	// Example 2: paris - france + italy ≈ rome
	console.log('\n📝 Example 2: paris - france + italy = ?');
	console.log('-'.repeat(40));

	const parisVec = await getEmbedding('paris');
	const franceVec = await getEmbedding('france');
	const italyVec = await getEmbedding('italy');

	const resultVec2 = addVectors(subtractVectors(parisVec, franceVec), italyVec);

	const candidates2 = ['rome', 'milan', 'venice', 'florence', 'naples', 'berlin', 'madrid'];
	const results2 = await findClosestWord(resultVec2, candidates2);

	console.log('Results (sorted by similarity):');
	results2.forEach((r, i) => {
		console.log(`  ${i + 1}. ${r.word}: ${r.similarity.toFixed(4)}`);
	});

	// Example 3: doctor - man + woman ≈ nurse (or doctor!)
	console.log('\n📝 Example 3: doctor - man + woman = ?');
	console.log('-'.repeat(40));

	const doctorVec = await getEmbedding('doctor');

	const resultVec3 = addVectors(subtractVectors(doctorVec, manVec), womanVec);

	const candidates3 = ['nurse', 'physician', 'surgeon', 'dentist', 'therapist', 'doctor'];
	const results3 = await findClosestWord(resultVec3, candidates3);

	console.log('Results (sorted by similarity):');
	results3.forEach((r, i) => {
		console.log(`  ${i + 1}. ${r.word}: ${r.similarity.toFixed(4)}`);
	});

	// Software Dev Example 1: javascript - frontend + backend ≈ ?
	console.log('\n📝 Example 4 (Software Dev): javascript - frontend + backend = ?');
	console.log('-'.repeat(40));

	const javascriptVec = await getEmbedding('javascript');
	const frontendVec = await getEmbedding('frontend');
	const backendVec = await getEmbedding('backend');

	const resultVec4 = addVectors(subtractVectors(javascriptVec, frontendVec), backendVec);

	const candidates4 = ['python', 'java', 'golang', 'rust', 'typescript', 'node'];
	const results4 = await findClosestWord(resultVec4, candidates4);

	console.log('Results (sorted by similarity):');
	results4.forEach((r, i) => {
		console.log(`  ${i + 1}. ${r.word}: ${r.similarity.toFixed(4)}`);
	});

	// Software Dev Example 2: junior - intern + senior ≈ ?
	console.log('\n📝 Example 5 (Software Dev): junior - intern + senior = ?');
	console.log('-'.repeat(40));

	const juniorVec = await getEmbedding('junior');
	const internVec = await getEmbedding('intern');
	const seniorVec = await getEmbedding('senior');

	const resultVec5 = addVectors(subtractVectors(juniorVec, internVec), seniorVec);

	const candidates5 = ['lead', 'architect', 'manager', 'director', 'developer', 'executive'];
	const results5 = await findClosestWord(resultVec5, candidates5);

	console.log('Results (sorted by similarity):');
	results5.forEach((r, i) => {
		console.log(`  ${i + 1}. ${r.word}: ${r.similarity.toFixed(4)}`);
	});

	// Software Dev Example 3: bug - code + feature ≈ ?
	console.log('\n📝 Example 6 (Software Dev): bug - code + feature = ?');
	console.log('-'.repeat(40));

	const bugVec = await getEmbedding('bug');
	const codeVec = await getEmbedding('code');
	const featureVec = await getEmbedding('feature');

	const resultVec6 = addVectors(subtractVectors(bugVec, codeVec), featureVec);

	const candidates6 = ['deploy', 'refactor', 'debug', 'software', 'application', 'program'];
	const results6 = await findClosestWord(resultVec6, candidates6);

	console.log('Results (sorted by similarity):');
	results6.forEach((r, i) => {
		console.log(`  ${i + 1}. ${r.word}: ${r.similarity.toFixed(4)}`);
	});

	console.log('\n' + '='.repeat(50));
	console.log('✨ Try adding your own example below!');
	console.log('='.repeat(50));

	// TODO: Add your own word arithmetic example here!
	// Example template:
	// const wordAVec = await getEmbedding('wordA');
	// const wordBVec = await getEmbedding('wordB');
	// const wordCVec = await getEmbedding('wordC');
	// const myResultVec = addVectors(subtractVectors(wordAVec, wordBVec), wordCVec);
	// const myCandidates = ['option1', 'option2', 'option3'];
	// const myResults = await findClosestWord(myResultVec, myCandidates);
}

// Run the demonstration
demonstrateWordArithmetic().catch(console.error);
