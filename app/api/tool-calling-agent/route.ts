/**
 * TODO: Tool-Calling RAG Agent (Exploration)
 *
 * Your challenge: Build a RAG agent where the AI decides when to retrieve context
 *
 * This demonstrates:
 * - Tool definition with the AI SDK
 * - AI-driven decision making (toolChoice: 'auto')
 * - When to use tool-calling vs fixed workflows
 *
 * Note: This is exploratory - we won't use this in production, but understanding
 * the pattern is valuable for future projects.
 */

import { NextRequest } from 'next/server';
import { streamText, tool } from 'ai';
import { openaiClient, openaiProvider } from '@/app/libs/openai/openai';
import { z } from 'zod';
import { pineconeClient } from '@/app/libs/pinecone';

// ============================================================================
// TODO 1: Define the search_documentation Tool
// ============================================================================

/**
 * TODO: Create a tool that encapsulates your RAG workflow
 *
 * Required components:
 * 1. description: When to use this tool (search React docs for technical questions)
 * 2. parameters: Define using z.object with a 'query' string field
 * 3. execute: Implement the RAG workflow
 *    - Generate embedding for query
 *    - Search Pinecone (topK: 10)
 *    - Extract documents
 *    - Rerank with Pinecone inference (topK: 5)
 *    - Return formatted context
 *
 * Hint: The execute function is your entire RAG pipeline from app/agents/rag.ts
 */

const searchDocumentationTool = tool({
	// TODO: Add description
	description: '',

	// TODO: Define parameters schema with Zod
	parameters: z.object({
		// TODO: Add query parameter
	}),

	// TODO: Implement execute function
	execute: async ({ query }) => {
		console.log('🔧 Tool called: search_documentation');
		console.log('📝 Query:', query);

		// TODO: Implement RAG workflow
		// Step 1: Generate embedding
		// Step 2: Search Pinecone
		// Step 3: Extract documents
		// Step 4: Rerank with Pinecone inference
		// Step 5: Return formatted context

		throw new Error('TODO: Implement search_documentation tool');
	},
});

// ============================================================================
// TODO 2: (Optional) Create Additional Tools
// ============================================================================

/**
 * OPTIONAL TODO: Create a search_examples tool
 *
 * This demonstrates multi-tool agents where the AI chooses the right tool
 *
 * Similar structure to searchDocumentationTool but:
 * - Different description (for code examples)
 * - Might search with different query prefix
 * - Returns fewer results (topK: 3)
 */

// Uncomment and implement if you want to explore multi-tool agents:
// const searchExamplesTool = tool({
//   description: '',
//   parameters: z.object({ query: z.string() }),
//   execute: async ({ query }) => {
//     // TODO: Implement code examples search
//   }
// });

// ============================================================================
// TODO 3: Implement the API Route Handler
// ============================================================================

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { messages } = body;

		// TODO: Validate that messages is an array

		console.log('\n🤖 Tool-calling agent started');
		console.log('💬 Message count:', messages.length);

		// TODO: Implement streamText with tools
		//
		// Required configuration:
		// - model: openaiProvider('gpt-4o')
		// - tools: { search_documentation: searchDocumentationTool }
		// - toolChoice: 'auto' (let AI decide)
		// - maxSteps: 5 (prevent infinite loops)
		// - system: Prompt that instructs when to use tools
		// - messages: conversation history
		// - temperature: 0.7
		//
		// System prompt should explain:
		// - When to use search_documentation (technical React questions)
		// - When NOT to use tools (greetings, casual chat, follow-ups)
		//
		// Return: result.toDataStreamResponse()

		throw new Error('TODO: Implement tool-calling agent');
	} catch (error) {
		console.error('❌ Error in tool-calling agent:', error);

		return new Response(
			JSON.stringify({
				error: 'Failed to process request',
				details: error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}
}

/**
 * Testing Guide:
 *
 * Test 1: Simple conversation (should NOT call tool)
 * curl -X POST http://localhost:3000/api/tool-calling-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"messages": [{"role": "user", "content": "Thanks for your help!"}]}'
 *
 * Expected: No tool logs, direct response
 *
 * Test 2: Technical question (SHOULD call tool)
 * curl -X POST http://localhost:3000/api/tool-calling-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{"messages": [{"role": "user", "content": "How do I use the useEffect hook?"}]}'
 *
 * Expected console output:
 * 🤖 Tool-calling agent started
 * 🔧 Tool called: search_documentation
 * 📝 Query: How do I use the useEffect hook?
 * ✅ Tool execution complete
 * 📊 Retrieved documents: 5
 *
 * Test 3: Multi-turn conversation
 * curl -X POST http://localhost:3000/api/tool-calling-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "messages": [
 *       {"role": "user", "content": "How do I use useState?"},
 *       {"role": "assistant", "content": "useState is a React Hook..."},
 *       {"role": "user", "content": "Can you show me an example?"}
 *     ]
 *   }'
 *
 * Comparison with Other Approaches:
 *
 * Fixed Workflow (app/agents/rag.ts):
 * - Always searches for every query
 * - Predictable and simple
 * - Wastes resources on simple queries like "Thanks!"
 *
 * Tool-Calling (this file):
 * - AI decides when to search
 * - More intelligent and flexible
 * - Extra cost for decision-making
 * - Better for mixed conversations (casual + technical)
 *
 * LangGraph (app/api/langgraph-agent):
 * - Explicit graph-based routing
 * - Full control over workflow
 * - Can loop and iterate
 * - Best for complex, stateful workflows
 *
 * When to Use Each:
 * - Simple, single-purpose → Fixed workflow
 * - Conversational with mixed queries → Tool-calling
 * - Complex multi-step workflows → LangGraph
 */
