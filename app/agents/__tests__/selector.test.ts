/**
 * INDEX SELECTOR TESTS
 *
 * These tests verify that queries are routed to the correct indexes.
 * Since LLMs are non-deterministic, we test routing decisions and
 * response structure, not exact text output.
 *
 * These tests call the API route handler directly - no server needed!
 */

import { POST } from '@/app/api/select-agent/route';
import { NextRequest } from 'next/server';

const VALID_INDEXES = ['LinkedInPosts', 'MediumArticles', 'ScientificPapers'];

describe('Index Selector Routing', () => {
	// Increase timeout for LLM API calls
	jest.setTimeout(15000);

	// Helper to create a mock NextRequest
	const createRequest = (query: string): NextRequest => {
		return {
			json: async () => ({
				messages: [{ role: 'user', content: query }],
			}),
		} as NextRequest;
	};

	// Helper to call the selector and get response
	const selectIndexes = async (query: string) => {
		const request = createRequest(query);
		const response = await POST(request);
		return response?.json();
	};

	describe('LinkedInPosts Routing', () => {
		it('should route LinkedIn content questions to LinkedInPosts', async () => {
			const result = await selectIndexes(
				'What are some good LinkedIn post ideas for developers?'
			);

			expect(result.indexes).toContain('LinkedInPosts');
		});

		it('should route career advice to LinkedInPosts', async () => {
			const result = await selectIndexes(
				'How do I build my personal brand on LinkedIn?'
			);

			expect(result.indexes).toContain('LinkedInPosts');
		});
	});

	describe('MediumArticles Routing', () => {
		it('should route technical tutorial questions to MediumArticles', async () => {
			const result = await selectIndexes(
				'Find programming tutorials about React hooks'
			);

			expect(result.indexes).toContain('MediumArticles');
		});

		it('should route software development articles to MediumArticles', async () => {
			const result = await selectIndexes(
				'What are best practices for writing clean code?'
			);

			expect(result.indexes).toContain('MediumArticles');
		});
	});

	describe('ScientificPapers Routing', () => {
		it('should route research questions to ScientificPapers', async () => {
			const result = await selectIndexes(
				'What does the latest research say about transformer architectures?'
			);

			expect(result.indexes).toContain('ScientificPapers');
		});

		it('should route academic topics to ScientificPapers', async () => {
			const result = await selectIndexes(
				'Find papers about attention mechanisms in neural networks'
			);

			expect(result.indexes).toContain('ScientificPapers');
		});
	});

	describe('Multi-Index Routing', () => {
		it('should select multiple indexes for broad queries', async () => {
			const result = await selectIndexes(
				'Find articles and research about machine learning'
			);

			expect(result.indexes.length).toBeGreaterThanOrEqual(1);
			expect(result.indexes.length).toBeLessThanOrEqual(3);
		});
	});

	describe('Response Structure', () => {
		it('should return valid response structure', async () => {
			const result = await selectIndexes('Any question here');

			// Verify required fields exist
			expect(result).toHaveProperty('indexes');
			expect(result).toHaveProperty('query');

			// Verify indexes are valid
			expect(Array.isArray(result.indexes)).toBe(true);
			result.indexes.forEach((index: string) => {
				expect(VALID_INDEXES).toContain(index);
			});
		});

		it('should refine queries', async () => {
			const result = await selectIndexes('Tell me about deep learning');

			// Refined query should be non-empty
			expect(result.query).toBeTruthy();
			expect(result.query.length).toBeGreaterThan(0);
		});
	});

	describe('Edge Cases', () => {
		it('should handle very short queries', async () => {
			const result = await selectIndexes('Help');

			// Should still return valid indexes
			expect(Array.isArray(result.indexes)).toBe(true);
			expect(result.indexes.length).toBeGreaterThanOrEqual(1);
		});

		it('should handle ambiguous queries', async () => {
			const result = await selectIndexes('Tell me about AI');

			// Should return at least one valid index
			expect(result.indexes.length).toBeGreaterThanOrEqual(1);
			result.indexes.forEach((index: string) => {
				expect(VALID_INDEXES).toContain(index);
			});
		});
	});
});
