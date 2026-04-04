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

// ── Types ────────────────────────────────────────────────────────────────

interface RerankScore {
	chunk_index: number;
	score: number;
	reason: string;
}

interface ChunkResult {
	id: string;
	score: number; // Pinecone similarity score
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

		console.log(`\n🔍 Rerank pipeline for: "${query}"`);

		// ── Stage 1: Vector Retrieval ────────────────────────────────
		const index = pineconeClient.Index(process.env.PINECONE_INDEX!);

		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			dimensions: 512,
			input: query,
		});
		const embedding = embeddingResponse.data[0].embedding;

		const queryResponse = await index.query({
			vector: embedding,
			topK: 20,
			includeMetadata: true,
		});

		const retrievedChunks: ChunkResult[] = queryResponse.matches.map(
			(match) => ({
				id: match.id,
				score: match.score ?? 0,
				content: (match.metadata?.text ?? match.metadata?.content ?? '') as string,
				source: (match.metadata?.source ?? 'unknown') as string,
			})
		);

		// Pre-rerank top 5 (by Pinecone similarity score)
		const preRerankTop5 = retrievedChunks.slice(0, 5).map((chunk, i) => ({
			rank: i + 1,
			id: chunk.id,
			similarity_score: chunk.score,
			content: chunk.content.slice(0, 300),
			source: chunk.source,
		}));

		console.log(`📦 Retrieved ${retrievedChunks.length} chunks from Pinecone`);

		// ── Stage 2: LLM Reranking ───────────────────────────────────
		const chunksForLLM = retrievedChunks
			.map(
				(chunk, i) =>
					`[Chunk ${i}]\n${chunk.content.slice(0, 500)}`
			)
			.join('\n\n---\n\n');

		const rerankResponse = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			temperature: 0,
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content: `You are a relevance scoring engine. Given a user query and a list of text chunks, score each chunk's relevance to the query on a scale of 0-10.

Return a JSON object with a single key "scores" containing an array of objects, each with:
- "chunk_index": the chunk number (0-based)
- "score": relevance score from 0 (irrelevant) to 10 (perfect match)
- "reason": one sentence explaining the score

Be strict — only high scores for chunks that directly answer or closely relate to the query.`,
				},
				{
					role: 'user',
					content: `Query: "${query}"\n\nChunks:\n\n${chunksForLLM}`,
				},
			],
		});

		const parsed = JSON.parse(
			rerankResponse.choices[0].message.content || '{"scores":[]}'
		);
		const rerankScores: RerankScore[] = (parsed.scores || [])
			.sort((a: RerankScore, b: RerankScore) => b.score - a.score);

		// Post-rerank top 5
		const postRerankTop5 = rerankScores.slice(0, 5).map((scored, i) => {
			const chunk = retrievedChunks[scored.chunk_index];
			return {
				rank: i + 1,
				id: chunk?.id ?? `chunk-${scored.chunk_index}`,
				rerank_score: scored.score,
				reason: scored.reason,
				original_similarity: chunk?.score ?? 0,
				content: chunk?.content.slice(0, 300) ?? '',
				source: chunk?.source ?? 'unknown',
			};
		});

		console.log('✅ Reranking complete');

		return NextResponse.json({
			query,
			pre_rerank_top5: preRerankTop5,
			post_rerank_top5: postRerankTop5,
			rerank_scores: rerankScores,
		});
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
