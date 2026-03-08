/**
 * LangGraph Research Assistant Agent
 *
 * This demonstrates a stateful agent with:
 * - Query analysis and routing
 * - Conditional search execution
 * - Result evaluation and iteration
 * - State management across steps
 *
 * Compare this to app/agents/rag.ts to see the difference between
 * LangGraph's graph-based approach vs AI SDK's linear workflow.
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
// State Definition
// ============================================================================

/**
 * Define the agent's state schema.
 * This data flows through all nodes in the graph.
 */
const AgentState = Annotation.Root({
	// Conversation history
	messages: Annotation<BaseMessage[]>({
		reducer: (left, right) => left.concat(right), // Append new messages
	}),

	// User's original query
	query: Annotation<string>(),

	// Analysis results
	needsResearch: Annotation<boolean>(),
	queryType: Annotation<'simple' | 'technical' | 'complex'>(),

	// Research results
	searchResults: Annotation<string[]>(),
	searchIterations: Annotation<number>(),

	// Quality tracking
	confidence: Annotation<number>(),

	// Final output
	answer: Annotation<string>(),
});

type StateType = typeof AgentState.State;

// ============================================================================
// Node Implementations
// ============================================================================

/**
 * Node 1: Analyze the user's query
 * Determines if research is needed and classifies query type
 */
async function analyzeQueryNode(state: StateType) {
	console.log('📊 Analyzing query:', state.query);

	try {
		// Use structured outputs to analyze intent
		const analysis = await generateObject({
			model: openai('gpt-4o'),
			schema: z.object({
				needsResearch: z
					.boolean()
					.describe(
						'Whether this query requires searching documentation',
					),
				queryType: z
					.enum(['simple', 'technical', 'complex'])
					.describe('Classification of the query complexity'),
				confidence: z
					.number()
					.min(0)
					.max(1)
					.describe('Confidence in the analysis'),
				reasoning: z
					.string()
					.describe('Brief explanation of the classification'),
			}),
			prompt: `Analyze this query and determine if it needs research:

Query: "${state.query}"

Consider:
- Simple questions (greetings, thanks, casual chat) don't need research
- Technical questions about React, JavaScript, or programming need documentation lookup
- Complex questions might need multiple searches or deeper analysis

Provide your analysis with confidence score.`,
		});

		console.log('✅ Analysis:', analysis.object);

		return {
			needsResearch: analysis.object.needsResearch,
			queryType: analysis.object.queryType,
			confidence: analysis.object.confidence,
			searchIterations: 0,
		};
	} catch (error) {
		console.error('❌ Error in analysis:', error);
		// Default to technical query requiring research
		return {
			needsResearch: true,
			queryType: 'technical' as const,
			confidence: 0.5,
			searchIterations: 0,
		};
	}
}

/**
 * Node 2: Search documentation
 * Retrieves context from Pinecone vector database
 */
async function searchDocumentsNode(state: StateType) {
	console.log(
		'🔍 Searching documents (iteration',
		state.searchIterations + 1,
		')',
	);

	try {
		// Generate embedding for semantic search
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			input: state.query,
		});
		const embedding = embeddingResponse.data[0].embedding;

		// Search Pinecone for relevant documents
		const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
		const queryResponse = await index.query({
			vector: embedding,
			topK: 10, // Fetch more for reranking
			includeMetadata: true,
		});

		// Extract document text from matches
		const documents = queryResponse.matches
			.map((match) => match.metadata?.text)
			.filter(Boolean) as string[];

		if (documents.length === 0) {
			console.log('⚠️  No documents found');
			return {
				searchResults: [],
				searchIterations: state.searchIterations + 1,
			};
		}

		// Rerank using Pinecone inference for better quality
		const reranked = await pineconeClient.inference.rerank({
			model: 'bge-reranker-v2-m3',
			query: state.query,
			documents: documents,
			topK: 5, // Keep top 5 after reranking
			returnDocuments: true,
		});

		const results = reranked.data
			.map((result) => result.document?.text)
			.filter(Boolean) as string[];

		console.log('📊 Found', results.length, 'relevant documents');

		return {
			searchResults: results,
			searchIterations: state.searchIterations + 1,
		};
	} catch (error) {
		console.error('❌ Error in search:', error);
		return {
			searchResults: [],
			searchIterations: state.searchIterations + 1,
		};
	}
}

/**
 * Node 3: Evaluate search results
 * Determines if results are sufficient to answer the query
 */
async function evaluateResultsNode(state: StateType) {
	console.log('🎯 Evaluating search results');

	if (state.searchResults.length === 0) {
		console.log('⚠️  No results to evaluate');
		return {
			confidence: 0,
			needsResearch: false, // Don't search again if no results
		};
	}

	try {
		// Analyze result quality
		const evaluation = await generateObject({
			model: openai('gpt-4o'),
			schema: z.object({
				sufficient: z
					.boolean()
					.describe('Whether results are sufficient to answer the query'),
				confidence: z
					.number()
					.min(0)
					.max(1)
					.describe('Confidence that we can answer well'),
				reasoning: z.string().describe('Brief explanation'),
			}),
			prompt: `Evaluate if these search results are sufficient to answer the query:

Query: "${state.query}"

Top Results:
${state.searchResults.slice(0, 3).join('\n\n---\n\n')}

Are these results relevant and sufficient to provide a good answer?`,
		});

		console.log('📈 Evaluation:', evaluation.object);

		return {
			confidence: evaluation.object.confidence,
		};
	} catch (error) {
		console.error('❌ Error in evaluation:', error);
		// Default to moderate confidence
		return {
			confidence: 0.6,
		};
	}
}

/**
 * Node 4: Generate final answer
 * Creates response using retrieved context or general knowledge
 */
async function generateAnswerNode(state: StateType) {
	console.log('💬 Generating answer');

	try {
		const hasContext =
			state.searchResults && state.searchResults.length > 0;
		const context = hasContext
			? state.searchResults.join('\n\n')
			: 'No specific context available';

		// Build system prompt with context
		const systemPrompt = hasContext
			? `You are a helpful assistant that answers questions about React and JavaScript.

Use the following documentation context to answer the user's question:

${context}

Provide a clear, accurate answer based on the context. If the context doesn't fully address the question, say so and provide general guidance.`
			: `You are a helpful assistant. The user asked a general question that doesn't require specific documentation.

Answer naturally and helpfully based on your general knowledge.`;

		// Prepare messages for the model
		const messages = [
			...state.messages,
			new HumanMessage(state.query),
		];

		// Generate response
		const model = new ChatOpenAI({
			model: 'gpt-4o',
			temperature: 0.7,
		});

		const response = await model.invoke([
			{ role: 'system', content: systemPrompt },
			...messages.map((m) => ({
				role: m._getType() === 'human' ? ('user' as const) : ('assistant' as const),
				content: m.content as string,
			})),
		]);

		console.log('✅ Answer generated');

		return {
			messages: [new AIMessage(response.content as string)],
			answer: response.content as string,
		};
	} catch (error) {
		console.error('❌ Error generating answer:', error);
		return {
			messages: [
				new AIMessage(
					'Sorry, I encountered an error generating the answer.',
				),
			],
			answer: 'Sorry, I encountered an error generating the answer.',
		};
	}
}

// ============================================================================
// Router Functions
// ============================================================================

/**
 * Route after analysis: decide if we need to search
 */
function routeAfterAnalysis(state: StateType): string {
	if (state.needsResearch) {
		console.log('→ Routing to search (research needed)');
		return 'search';
	}

	console.log('→ Routing to answer (no research needed)');
	return 'answer';
}

/**
 * Route after search: evaluate or answer
 */
function routeAfterSearch(state: StateType): string {
	const MAX_ITERATIONS = 2;

	if (state.searchIterations >= MAX_ITERATIONS) {
		console.log(
			'→ Max iterations reached (',
			MAX_ITERATIONS,
			'), generating answer',
		);
		return 'answer';
	}

	console.log('→ Routing to evaluation');
	return 'evaluate';
}

/**
 * Route after evaluation: search again or answer
 */
function routeAfterEvaluation(state: StateType): string {
	const CONFIDENCE_THRESHOLD = 0.7;

	if (state.confidence >= CONFIDENCE_THRESHOLD) {
		console.log(
			'→ Confidence good (',
			state.confidence.toFixed(2),
			'), generating answer',
		);
		return 'answer';
	}

	console.log(
		'→ Confidence low (',
		state.confidence.toFixed(2),
		'), searching again',
	);
	return 'search';
}

// ============================================================================
// Graph Creation
// ============================================================================

/**
 * Create the LangGraph workflow
 */
function createResearchAgent() {
	const workflow = new StateGraph(AgentState)
		// Add all nodes
		.addNode('analyze', analyzeQueryNode)
		.addNode('search', searchDocumentsNode)
		.addNode('evaluate', evaluateResultsNode)
		.addNode('answer', generateAnswerNode)

		// Define the flow
		.addEdge('__start__', 'analyze')

		// After analysis, route based on research need
		.addConditionalEdges(
			'analyze',
			routeAfterAnalysis,
			{
				search: 'search',
				answer: 'answer',
			},
		)

		// After search, decide if we need evaluation
		.addConditionalEdges(
			'search',
			routeAfterSearch,
			{
				evaluate: 'evaluate',
				answer: 'answer',
			},
		)

		// After evaluation, decide if we need more research
		.addConditionalEdges(
			'evaluate',
			routeAfterEvaluation,
			{
				search: 'search',
				answer: 'answer',
			},
		)

		// Answer is terminal
		.addEdge('answer', '__end__');

	return workflow;
}

// ============================================================================
// API Route Handler
// ============================================================================

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { query, threadId } = body;

		// Validate input
		if (!query || typeof query !== 'string') {
			return NextResponse.json(
				{ error: 'Query is required and must be a string' },
				{ status: 400 },
			);
		}

		console.log('\n🚀 Starting LangGraph agent');
		console.log('Query:', query);
		if (threadId) {
			console.log('Thread ID:', threadId);
		}

		// Create the workflow graph
		const workflow = createResearchAgent();

		// Compile the graph
		// Note: For production, add checkpointer for conversation persistence:
		// const checkpointer = await createCheckpointer();
		// const app = workflow.compile({ checkpointer });
		const app = workflow.compile();

		// Optional: Use thread ID for conversation persistence
		// Requires checkpointer to be configured
		const config = threadId
			? { configurable: { thread_id: threadId } }
			: undefined;

		// Execute the graph
		const startTime = Date.now();
		const result = await app.invoke(
			{
				query,
				messages: [],
				searchIterations: 0,
			},
			config,
		);
		const duration = Date.now() - startTime;

		console.log('✅ Agent completed in', duration, 'ms\n');

		// Return structured response
		return NextResponse.json({
			success: true,
			answer: result.answer,
			metadata: {
				queryType: result.queryType,
				confidence: result.confidence,
				searchIterations: result.searchIterations,
				needsResearch: result.needsResearch,
				processingTimeMs: duration,
			},
		});
	} catch (error) {
		console.error('❌ Error in LangGraph agent:', error);

		return NextResponse.json(
			{
				error: 'Failed to process query',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

/**
 * Example Usage:
 *
 * Simple question (no research):
 * curl -X POST http://localhost:3000/api/langgraph-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"query": "Hello, how are you?"}'
 *
 * Technical question (with research):
 * curl -X POST http://localhost:3000/api/langgraph-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"query": "How do I use React hooks?"}'
 *
 * With thread ID (for conversation persistence):
 * curl -X POST http://localhost:3000/api/langgraph-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"query": "Tell me about useState", "threadId": "user_123"}'
 */
