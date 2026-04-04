/**
 * Two-Stage Retrieval + LLM Reranking Pipeline
 *
 * Stage 1: Fetch top 20 results from the default Pinecone index using
 *          vector similarity (fast, approximate).
 * Stage 2: Pass the query + all 20 chunks to an LLM that scores each
 *          chunk 0-10 for relevance with a reason, then return the top 5.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TRADEOFF — Quality vs. Cost & Latency
 * ─────────────────────────────────────────────────────────────────────────
 * Reranking improves result quality because the LLM can read the full
 * text of each chunk and reason about its relevance — something a vector
 * dot-product cannot do. But it adds a second network call, token costs,
 * and 1-3 seconds of latency.
 *
 * In production you would use a dedicated reranker model (Cohere Rerank,
 * Pinecone Inference rerank, BGE Reranker, etc.) which are cheaper and
 * faster than a general-purpose LLM. The LLM approach here is for
 * learning — it makes the scoring logic transparent and inspectable.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';
import { openaiClient } from '@/app/libs/openai/openai';
import { pineconeClient } from '@/app/libs/pinecone';

// ── Types (provided — do not modify) ─────────────────────────────────────

interface RerankScore {
	chunk_index: number;
	score: number;
	reason: string;
}

interface ChunkResult {
	id: string;
	score: number;
	content: string;
	source: string;
}

// ── Route Handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { query } = body;

		if (!query || typeof query !== 'string') {
			return NextResponse.json(
				{ error: 'query is required and must be a string' },
				{ status: 400 }
			);
		}

		// ── STAGE 1: Vector Retrieval ────────────────────────────────

		// TODO: Step 1 — Generate an embedding for the query
		// Use openaiClient.embeddings.create() with:
		//   model: 'text-embedding-3-small'
		//   dimensions: 512
		//   input: query

		// TODO: Step 2 — Query Pinecone for the top 20 results
		// Use pineconeClient.Index(process.env.PINECONE_INDEX!)
		// Call index.query() with:
		//   vector: the embedding from step 1
		//   topK: 20
		//   includeMetadata: true

		// TODO: Step 3 — Map the Pinecone matches to ChunkResult objects
		// Each should have: id, score, content (from metadata.text or
		// metadata.content), source (from metadata.source)

		// TODO: Step 4 — Build pre_rerank_top5
		// Take the first 5 results (already sorted by Pinecone similarity)
		// For each, include: rank (1-5), id, similarity_score, content
		// (truncated to 300 chars), source

		// ── STAGE 2: LLM Reranking ──────────────────────────────────

		// TODO: Step 5 — Format all 20 chunks for the LLM
		// Create a string with each chunk labeled [Chunk 0], [Chunk 1], etc.
		// Truncate each chunk's content to 500 chars
		// Separate chunks with "---"

		// TODO: Step 6 — Call the LLM to score each chunk
		// Use openaiClient.chat.completions.create() with:
		//   model: 'gpt-4o-mini'
		//   temperature: 0
		//   response_format: { type: 'json_object' }
		//   System prompt: Tell the model it's a relevance scoring engine.
		//     It should return JSON with a "scores" array where each item
		//     has: chunk_index (0-based), score (0-10), reason (one sentence)
		//   User message: Include the query and all the formatted chunks

		// TODO: Step 7 — Parse the LLM response and sort by score descending
		// Parse the JSON from the response
		// Extract the scores array and sort by score descending

		// TODO: Step 8 — Build post_rerank_top5
		// Take the top 5 from the sorted rerank scores
		// For each, look up the original chunk and include:
		//   rank (1-5), id, rerank_score, reason,
		//   original_similarity, content (300 chars), source

		// TODO: Step 9 — Return the response
		// Include: query, pre_rerank_top5, post_rerank_top5, rerank_scores

		throw new Error('POST handler not implemented yet!');
	} catch (error) {
		console.error('Error in rerank pipeline:', error);
		return NextResponse.json(
			{
				error: 'Reranking failed',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
