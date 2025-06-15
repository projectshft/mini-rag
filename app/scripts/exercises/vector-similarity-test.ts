/**
 * Test script for the vector similarity exercise
 *
 * Run this script with: yarn exercise:vectors:test
 */

import { runTests } from './vector-similarity';

console.log('=== TESTING YOUR IMPLEMENTATION ===');

const result = runTests();

if (result) {
	console.log('✅ All tests passed! Your implementation works correctly.');
} else {
	console.log('❌ Tests failed. Check your implementation and try again.');
	console.log('\nHints:');
	console.log(
		"1. Make sure you're using cosineSimilarity to calculate similarity"
	);
	console.log('2. Filter out documents with similarity < minSimilarity');
	console.log('3. Sort by similarity in descending order (highest first)');
	console.log('4. Return only the top K results');
}
