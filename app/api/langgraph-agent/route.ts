/**
 * TODO: LangGraph Research Assistant Agent
 *
 * Your challenge: Build a stateful agent with graph-based workflows
 *
 * This demonstrates:
 * - Query analysis and routing
 * - Conditional search execution
 * - Result evaluation and iteration
 * - State management across steps
 *
 * See curriculum/10-ai-frameworks/2-building-langgraph-agent.md for guidance (DRAFT MODULE)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Annotation, StateGraph } from '@langchain/langgraph';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';

// ============================================================================
// TODO 1: Define State Schema
// ============================================================================

/**
 * TODO: Define the agent's state using Annotation.Root
 *
 * Required fields:
 * - messages: BaseMessage[] with concat reducer
 * - query: string
 * - needsResearch: boolean
 * - queryType: 'simple' | 'technical' | 'complex'
 * - searchResults: string[]
 * - searchIterations: number
 * - confidence: number
 * - answer: string
 *
 * Hint: Use Annotation<Type>({ reducer: ... }) for arrays
 */

const AgentState = Annotation.Root({
	// TODO: Implement state fields here
	// Example:
	// messages: Annotation<BaseMessage[]>({
	//   reducer: (left, right) => left.concat(right),
	// }),
});

type StateType = typeof AgentState.State;

// ============================================================================
// TODO 2: Implement Node Functions
// ============================================================================

/**
 * TODO: Implement analyzeQueryNode
 *
 * This node should:
 * 1. Use generateObject with gpt-4o to analyze the query
 * 2. Determine if research is needed
 * 3. Classify query type (simple/technical/complex)
 * 4. Return confidence score
 *
 * Schema should include: needsResearch, queryType, confidence, reasoning
 */
async function analyzeQueryNode(state: StateType) {
	console.log('📊 Analyzing query:', state.query);

	// TODO: Implement query analysis using generateObject
	throw new Error('TODO: Implement analyzeQueryNode');
}

/**
 * TODO: Implement searchDocumentsNode
 *
 * This node should:
 * 1. Generate embedding for the query
 * 2. Search Pinecone (topK: 10)
 * 3. Extract documents
 * 4. Rerank using Pinecone inference (topK: 5)
 * 5. Return search results and increment searchIterations
 *
 * Hint: This is similar to your RAG agent workflow
 */
async function searchDocumentsNode(state: StateType) {
	console.log('🔍 Searching documents (iteration', state.searchIterations + 1, ')');

	// TODO: Implement document search with reranking
	throw new Error('TODO: Implement searchDocumentsNode');
}

/**
 * TODO: Implement evaluateResultsNode
 *
 * This node should:
 * 1. Check if searchResults is empty (return confidence: 0)
 * 2. Use generateObject to evaluate result quality
 * 3. Determine if results are sufficient
 * 4. Return confidence score
 *
 * Schema: sufficient (boolean), confidence (number), reasoning (string)
 */
async function evaluateResultsNode(state: StateType) {
	console.log('🎯 Evaluating search results');

	// TODO: Implement result evaluation
	throw new Error('TODO: Implement evaluateResultsNode');
}

/**
 * TODO: Implement generateAnswerNode
 *
 * This node should:
 * 1. Build context from searchResults (or use default if empty)
 * 2. Create system prompt with context
 * 3. Use ChatOpenAI to generate response
 * 4. Return messages and answer
 *
 * Hint: Use ChatOpenAI model with temperature: 0.7
 */
async function generateAnswerNode(state: StateType) {
	console.log('💬 Generating answer');

	// TODO: Implement answer generation
	throw new Error('TODO: Implement generateAnswerNode');
}

// ============================================================================
// TODO 3: Implement Router Functions
// ============================================================================

/**
 * TODO: Implement routeAfterAnalysis
 *
 * Should return:
 * - "search" if needsResearch is true
 * - "answer" if needsResearch is false
 */
function routeAfterAnalysis(state: StateType): string {
	// TODO: Implement routing logic
	throw new Error('TODO: Implement routeAfterAnalysis');
}

/**
 * TODO: Implement routeAfterSearch
 *
 * Should return:
 * - "answer" if searchIterations >= 2 (MAX_ITERATIONS)
 * - "evaluate" otherwise
 */
function routeAfterSearch(state: StateType): string {
	// TODO: Implement routing logic
	throw new Error('TODO: Implement routeAfterSearch');
}

/**
 * TODO: Implement routeAfterEvaluation
 *
 * Should return:
 * - "answer" if confidence >= 0.7 (CONFIDENCE_THRESHOLD)
 * - "search" otherwise (to search again)
 */
function routeAfterEvaluation(state: StateType): string {
	// TODO: Implement routing logic
	throw new Error('TODO: Implement routeAfterEvaluation');
}

// ============================================================================
// TODO 4: Build the Graph
// ============================================================================

/**
 * TODO: Create the LangGraph workflow
 *
 * Steps:
 * 1. Create StateGraph with AgentState
 * 2. Add nodes: analyze, search, evaluate, answer
 * 3. Add edge from __start__ to analyze
 * 4. Add conditional edges from analyze (using routeAfterAnalysis)
 * 5. Add conditional edges from search (using routeAfterSearch)
 * 6. Add conditional edges from evaluate (using routeAfterEvaluation)
 * 7. Add edge from answer to __end__
 * 8. Return the workflow
 */
function createResearchAgent() {
	// TODO: Build the graph
	throw new Error('TODO: Implement createResearchAgent');
}

// ============================================================================
// TODO 5: Implement API Route Handler
// ============================================================================

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { query, threadId } = body;

		// TODO: Validate query input

		console.log('\n🚀 Starting LangGraph agent');
		console.log('Query:', query);

		// TODO: Create workflow using createResearchAgent()

		// TODO: Compile the workflow
		// const app = workflow.compile();

		// TODO: Execute the graph with invoke()
		// Pass: { query, messages: [], searchIterations: 0 }

		// TODO: Return JSON response with:
		// - success: true
		// - answer: result.answer
		// - metadata: { queryType, confidence, searchIterations, needsResearch }

		throw new Error('TODO: Implement POST handler');
	} catch (error) {
		console.error('❌ Error in LangGraph agent:', error);

		return NextResponse.json(
			{
				error: 'Failed to process query',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

/**
 * Testing Guide:
 *
 * Simple question (should NOT search):
 * curl -X POST http://localhost:3000/api/langgraph-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"query": "Hello, how are you?"}'
 *
 * Expected flow: analyze → answer (no search)
 *
 * Technical question (should search):
 * curl -X POST http://localhost:3000/api/langgraph-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"query": "How do I use React hooks?"}'
 *
 * Expected flow: analyze → search → evaluate → answer
 *
 * Complex question (may iterate):
 * curl -X POST http://localhost:3000/api/langgraph-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"query": "What are the best practices for state management?"}'
 *
 * Expected flow: analyze → search → evaluate → search → answer
 */
