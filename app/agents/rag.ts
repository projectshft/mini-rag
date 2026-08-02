import { AgentRequest, AgentResponse } from './types';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient, openaiProvider } from '@/app/libs/openai/openai';
import { streamText } from 'ai';

export async function ragAgent(request: AgentRequest): Promise<AgentResponse> {
	// You'll come back to this file several times. Do the phases in order —
	// each builds on the last, and Phase 1 has to work before the rest make
	// any sense. Each lesson tells you which phase you're on.
	//
	// What you get in `request` (see ./types.ts):
	//   request.query          -> refined/summarized query from the selector
	//   request.originalQuery  -> what the user actually typed
	//   request.messages       -> conversation history
	//
	// ============================================================================
	// PHASE 1: Basic RAG pipeline
	// ============================================================================
	//
	// TODO: Implement the 5-step RAG pipeline:
	//
	// Step 1: Generate an embedding for the query
	//   - openaiClient.embeddings.create() with model 'text-embedding-3-small'
	//   - Pass request.query as the input
	//   - The vector is at response.data[0].embedding
	//
	// Step 2: Query Pinecone for similar documents
	//   - const index = pineconeClient.Index(process.env.PINECONE_INDEX as string)
	//   - index.query() with the embedding as `vector`
	//   - topK: 5 to start
	//   - includeMetadata: true — without this you get IDs and scores but no text
	//
	// Step 3: Extract text from the results
	//   - Map over queryResponse.matches
	//   - Pull match.metadata?.text (older docs may use .content)
	//   - Join them into one context string
	//
	// Step 4: Build a system prompt containing that context
	//   - Include both request.originalQuery and request.query so the model
	//     can see what was asked and what was searched for
	//   - Instruct it to answer ONLY from the provided context
	//   - Say what to do when the context is empty (don't let it improvise)
	//
	// Step 5: Stream the response
	//   - streamText() from the 'ai' SDK, with openaiProvider('gpt-4o')
	//   - Pass your system prompt and request.messages
	//   - Return the result directly — no await
	//
	// ============================================================================
	// PHASE 2: Add reranking
	// ============================================================================
	//
	// TODO: Once Phase 1 works, improve retrieval quality with a reranker.
	//
	// Step 1: Over-fetch
	//   - Raise topK (10 is a good start — try higher and see what changes).
	//     A reranker can reorder candidates but can't invent them, so the
	//     good chunk has to be in the pool for it to get promoted.
	//
	// Step 2: Rerank with Pinecone's inference API
	//     const reranked = await pineconeClient.inference.rerank(
	//       'bge-reranker-v2-m3',
	//       request.query,
	//       documents,                            // array of strings
	//       { topN: 5, returnDocuments: true },   // returnDocuments -> get text back
	//     );
	//
	// Step 3: Build your context from reranked.data instead of
	//   queryResponse.matches — result.document?.text. Everything downstream
	//   (system prompt, streamText) stays the same.
	//
	// Why it works: embedding similarity compares query and document
	// separately (fast, approximate). A cross-encoder reads both together
	// (slow, accurate). Retrieve many -> rerank few = both.
	//
	// ============================================================================
	// PHASE 3: Query preprocessing
	// ============================================================================
	//
	// TODO: Clean the query before you embed it.
	//
	//   - Write a pure preprocessQuery(raw: string): string
	//   - Expand abbreviations (js -> JavaScript, ts -> TypeScript, db -> database)
	//   - Strip filler words (um, uh, like, basically, actually)
	//   - Then: const query = preprocessQuery(request.query) — and embed `query`
	//
	// Keeping it pure means you can unit-test it without touching the network.
	//
	// ============================================================================
	// PHASE 4: Score threshold + graceful "I don't know"
	// ============================================================================
	//
	// TODO: Stop the agent from answering out of junk context.
	//
	//   - After reranking, drop results scoring below a minimum you pick
	//   - If NOTHING clears the threshold, return a response that says so
	//     instead of generating from weak context
	//   - Log the scores while you tune — you need real numbers to defend
	//     your threshold in the assignment video
	//
	// A confident wrong answer is worse than "I don't have enough information."
	//
	// ============================================================================

	throw new Error('RAG agent not implemented yet!');
}
