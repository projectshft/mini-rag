'use client';

import { useState } from 'react';

interface PreRerankResult {
	rank: number;
	id: string;
	similarity_score: number;
	content: string;
	source: string;
}

interface PostRerankResult {
	rank: number;
	id: string;
	rerank_score: number;
	reason: string;
	original_similarity: number;
	content: string;
	source: string;
}

interface RerankResponse {
	query: string;
	pre_rerank_top5: PreRerankResult[];
	post_rerank_top5: PostRerankResult[];
	rerank_scores: { chunk_index: number; score: number; reason: string }[];
}

/**
 * TODO: Build the Reranking Comparison UI
 *
 * This page should have:
 *
 * TOP — Search form:
 *   - A text input for the query
 *   - A "Search" button (shows "Searching & Reranking..." while loading)
 *
 * MIDDLE — Side-by-side comparison (2-column grid):
 *   LEFT: "Before Reranking" (vector similarity only)
 *     - Show pre_rerank_top5 as cards with: rank, similarity score,
 *       content (truncated), source
 *     - Use a neutral background (e.g. bg-gray-50)
 *
 *   RIGHT: "After Reranking" (LLM-scored relevance)
 *     - Show post_rerank_top5 as cards with: rank, rerank score (/10),
 *       the LLM's reason (in italics), original similarity score,
 *       content, source
 *     - Use a highlighted background (e.g. bg-blue-50)
 *
 * BOTTOM — Full scores table:
 *   - Show ALL rerank_scores in a table with columns:
 *     Chunk #, Score, Reason
 *   - This lets students see how the LLM scored every chunk, not
 *     just the top 5
 *
 * API call:
 *   POST /api/search/rerank with body: { query }
 *   Response shape: RerankResponse (defined above)
 *
 * The whole point of this UI is to make reranking VISIBLE — students
 * should be able to see results that moved up or down and read WHY.
 */
export default function RerankPage() {
	// TODO: Add state for query, result (RerankResponse | null), error, isLoading

	// TODO: Implement handleSubmit

	return (
		<div className='min-h-screen p-8 max-w-6xl mx-auto'>
			<h1 className='text-3xl font-bold mb-2'>Reranking Pipeline</h1>
			<p className='text-gray-500 mb-6'>
				See how LLM reranking reshuffles vector search results. Compare
				pre-rerank (similarity only) vs. post-rerank (LLM-scored relevance)
				side by side.
			</p>

			{/* TODO: Build the search form and comparison UI here */}
			<p className='text-gray-400'>Reranking UI not implemented yet.</p>
		</div>
	);
}
