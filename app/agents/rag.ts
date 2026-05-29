import { AgentRequest, AgentResponse } from './types';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function ragAgent(request: AgentRequest): Promise<AgentResponse> {
	// ============================================================================
	// PHASE 1: Basic RAG Pipeline (Module 9.1, Assignment 2)
	// ============================================================================
	//
	// TODO: Implement the 5-step RAG pipeline:
	//
	// Step 1: Generate embedding for the query
	//   - Use openaiClient.embeddings.create() with model 'text-embedding-3-small'
	//   - Pass request.message as the input
	//   - Extract the embedding vector from response.data[0].embedding
	//
	// Step 2: Query Pinecone for similar documents
	//   - Get the index using pineconeClient.index('your-index-name')
	//   - Use index.query() with the embedding vector
	//   - Set topK to retrieve the top 5 most similar documents
	//   - Set includeMetadata to true to get the document text
	//
	// Step 3: Extract text from results
	//   - Map over the matches array from the Pinecone response
	//   - Extract the 'text' field from each match's metadata
	//   - Join the texts to create your context string
	//
	// Step 4: Build system prompt with context
	//   - Create a system prompt that includes the retrieved context
	//   - Instruct the model to answer based on the provided context
	//   - Handle the case where no relevant documents are found
	//
	// Step 5: Stream the response
	//   - Use streamText() from the 'ai' SDK
	//   - Pass the openai model, system prompt, and user message
	//   - Return the streaming response in the correct format
	//
	// ============================================================================
	// PHASE 2: Add Reranking (Module 9.2, Assignment 3)
	// ============================================================================
	//
	// TODO: After completing Phase 1, enhance retrieval with reranking:
	//
	// Step 1: Increase initial retrieval
	//   - Change topK from 5 to 20 to get more candidate documents
	//
	// Step 2: Implement reranking
	//   - Use a cross-encoder model to score query-document relevance
	//   - Consider using Cohere's rerank API or a local cross-encoder
	//   - Score each retrieved document against the original query
	//
	// Step 3: Select top results after reranking
	//   - Sort documents by reranking score (highest first)
	//   - Take the top 5 reranked documents as your final context
	//
	// Step 4: Use reranked context
	//   - Build your system prompt using only the top reranked documents
	//   - The rest of the pipeline remains the same
	//
	// Why reranking helps:
	//   - Embedding similarity is fast but approximate
	//   - Cross-encoders are slower but more accurate
	//   - Retrieve many (fast) -> Rerank few (accurate) = best of both worlds
	//
	// ============================================================================

	throw new Error('RAG agent not implemented yet!');
}
