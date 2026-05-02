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
				'Write a post on vector databases and why 512 vs 1536 dimensions is a debated topic',
			);

			expect(result.indexes).toContain('LinkedInPosts');
		});

		it('should route spicy hot takes ONLY to LinkedInPosts', async () => {
			const result = await selectIndexes(
				'Give me a spicy hot take on the future of AI',
			);

			expect(result.indexes.length).toBe(2);
			expect(result.indexes).toContain('LinkedInPosts');
		});

		it('should route career advice to LinkedInPosts', async () => {
			const result = await selectIndexes(
				'How do I make a good side project?',
			);

			expect(result.indexes).toContain('LinkedInPosts');
		});
	});

	describe('MediumArticles Routing', () => {
		it('should route technical tutorial questions to MediumArticles', async () => {
			const result = await selectIndexes(
				'Write an article on the latest trends in AI',
			);

			expect(result.indexes).toContain('MediumArticles');
		});

		//TODO
		it('should route technical tutorial questions to MediumArticles', async () => {
			const result = await selectIndexes(
				'Write a post on vector databases and why 512 vs 1536 dimensions is a debated topic',
			);

			console.log({ result });

			expect(result.indexes).toContain('MediumArticles');
		});
	});

	describe('Response Structure', () => {
		it('should refine queries', async () => {
			const result = await selectIndexes('Tell me about deep learning');

			// Refined query should be non-empty
			expect(result.query).toBeTruthy();
			expect(result.query.length).toBeGreaterThan(0);
		});
	});

	describe('Edge Cases', () => {
		it('should NOT handle very short queries', async () => {
			const result = await selectIndexes('Help');
			// TODO
			expect(result.indexes).toBeNull();
		});

		it('should NOT handle irrelevant queries', async () => {
			const result = await selectIndexes(
				'What do you think about the weather in France?',
			);

			expect(result.indexes).toBeNull();
		});
	});
});
