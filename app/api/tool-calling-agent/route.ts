/**
 * Tool-Calling RAG Agent (Exploration)
 *
 * This demonstrates tool-calling where the AI decides when to retrieve context.
 * Compare this to:
 * - app/agents/rag.ts (fixed workflow - always searches)
 * - app/api/langgraph-agent (stateful graph with complex routing)
 *
 * This is for exploration purposes. In production, choose the approach that
 * best fits your use case (see curriculum for guidance).
 */

import { NextRequest } from 'next/server';
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * Tool: search_documentation
 *
 * This tool encapsulates your entire RAG workflow:
 * 1. Generate embedding
 * 2. Search Pinecone
 * 3. Extract and rerank documents
 * 4. Return context
 *
 * The AI will call this tool ONLY when it determines that
 * the query requires searching documentation.
 */
const searchDocumentationTool = tool({
	description:
		'Search React documentation for technical information about hooks, components, APIs, and React concepts. Use this tool when users ask programming or technical questions about React.',

	parameters: z.object({
		query: z
			.string()
			.describe(
				'The technical query to search for in the documentation',
			),
	}),

	execute: async ({ query }) => {
		console.log('🔧 Tool called: search_documentation');
		console.log('📝 Query:', query);

		const startTime = Date.now();

		try {
			// Step 1: Generate embedding for semantic search
			const embeddingResponse = await openaiClient.embeddings.create({
				model: 'text-embedding-3-small',
				input: query,
			});
			const embedding = embeddingResponse.data[0].embedding;

			// Step 2: Query Pinecone vector database
			const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
			const queryResponse = await index.query({
				vector: embedding,
				topK: 10, // Fetch more for reranking
				includeMetadata: true,
			});

			// Step 3: Extract document text from results
			const documents = queryResponse.matches
				.map((match) => match.metadata?.text)
				.filter(Boolean) as string[];

			if (documents.length === 0) {
				console.log('⚠️  No documents found');
				return 'No relevant documentation found for this query.';
			}

			// Step 4: Rerank using Pinecone inference for better quality
			const reranked = await pineconeClient.inference.rerank({
				model: 'bge-reranker-v2-m3',
				query: query,
				documents: documents,
				topK: 5, // Keep top 5 after reranking
				returnDocuments: true,
			});

			// Step 5: Format and return context
			const context = reranked.data
				.map((result, index) => {
					const text = result.document?.text || '';
					return `[Document ${index + 1}]\n${text}`;
				})
				.filter(Boolean)
				.join('\n\n---\n\n');

			const duration = Date.now() - startTime;

			console.log('✅ Tool execution complete');
			console.log('📊 Retrieved documents:', reranked.data.length);
			console.log('⏱️  Duration:', duration, 'ms');
			console.log('📏 Context length:', context.length, 'characters\n');

			return context;
		} catch (error) {
			console.error('❌ Error in search_documentation tool:', error);
			return 'An error occurred while searching the documentation.';
		}
	},
});

// ============================================================================
// Additional Tool Example: Code Examples Search
// ============================================================================

/**
 * Optional: Second tool for searching code examples
 * Demonstrates multi-tool agents where AI chooses the right tool
 */
const searchExamplesTool = tool({
	description:
		'Search for code examples and practical implementations. Use this when users want to see example code or implementations.',

	parameters: z.object({
		query: z
			.string()
			.describe('The type of code example to search for'),
	}),

	execute: async ({ query }) => {
		console.log('🔧 Tool called: search_examples');
		console.log('📝 Query:', query);

		// This is a placeholder - in production, you might search a different
		// collection or index specifically for code examples
		try {
			const embeddingResponse = await openaiClient.embeddings.create({
				model: 'text-embedding-3-small',
				input: `code example: ${query}`,
			});
			const embedding = embeddingResponse.data[0].embedding;

			const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
			const queryResponse = await index.query({
				vector: embedding,
				topK: 3,
				includeMetadata: true,
			});

			const examples = queryResponse.matches
				.map((match) => match.metadata?.text)
				.filter(Boolean) as string[];

			console.log('✅ Found', examples.length, 'examples\n');

			return examples.join('\n\n---\n\n');
		} catch (error) {
			console.error('❌ Error in search_examples tool:', error);
			return 'An error occurred while searching for examples.';
		}
	},
});

// ============================================================================
// API Route Handler
// ============================================================================

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { messages } = body;

		// Validate input
		if (!messages || !Array.isArray(messages)) {
			return new Response(
				JSON.stringify({ error: 'Messages array is required' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		console.log('\n🤖 Tool-calling agent started');
		console.log('💬 Message count:', messages.length);
		console.log(
			'📝 Latest message:',
			messages[messages.length - 1]?.content,
		);

		// Create the AI agent with tools
		const result = streamText({
			model: openai('gpt-4o'),

			// Define available tools
			tools: {
				search_documentation: searchDocumentationTool,
				// Uncomment to enable multi-tool agent:
				// search_examples: searchExamplesTool,
			},

			// Tool choice strategy:
			// - 'auto': AI decides when to use tools (recommended)
			// - 'required': AI must use a tool (similar to fixed workflow)
			// - 'none': AI cannot use tools
			toolChoice: 'auto',

			// Prevent infinite loops (max tool-calling steps)
			maxSteps: 5,

			// System prompt guides the AI on when to use tools
			system: `You are a helpful React programming assistant.

## Tool Usage Guidelines

**When to use search_documentation tool:**
- User asks about React hooks (useState, useEffect, etc.)
- Questions about React components, APIs, or concepts
- Technical questions requiring accurate information
- Questions about best practices or patterns

**When NOT to use tools (respond directly):**
- Greetings and casual conversation ("Hi", "Thanks", "Hello")
- Follow-up questions about previous responses
- Simple clarifications
- General conversation

## Response Guidelines

- Use retrieved documentation to provide accurate, grounded answers
- If you use a tool, acknowledge the information came from documentation
- If documentation doesn't cover the question, say so clearly
- Be conversational and helpful
- Keep explanations clear and concise`,

			// Conversation messages
			messages,

			// Optional: Set temperature for response creativity
			temperature: 0.7,
		});

		// Return streaming response
		return result.toDataStreamResponse();
	} catch (error) {
		console.error('❌ Error in tool-calling agent:', error);

		return new Response(
			JSON.stringify({
				error: 'Failed to process request',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}
}

/**
 * Example Requests:
 *
 * Simple conversation (should NOT call tool):
 * curl -X POST http://localhost:3000/api/tool-calling-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "messages": [
 *       {"role": "user", "content": "Thanks for your help!"}
 *     ]
 *   }'
 *
 * Technical question (SHOULD call tool):
 * curl -X POST http://localhost:3000/api/tool-calling-agent \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "messages": [
 *       {"role": "user", "content": "How do I use the useEffect hook?"}
 *     ]
 *   }'
 *
 * Multi-turn conversation:
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
 * Expected Console Output (for technical question):
 * 🤖 Tool-calling agent started
 * 💬 Message count: 1
 * 📝 Latest message: How do I use the useEffect hook?
 * 🔧 Tool called: search_documentation
 * 📝 Query: How do I use the useEffect hook?
 * ✅ Tool execution complete
 * 📊 Retrieved documents: 5
 * ⏱️  Duration: 1234 ms
 * 📏 Context length: 3456 characters
 *
 * Expected Console Output (for greeting):
 * 🤖 Tool-calling agent started
 * 💬 Message count: 1
 * 📝 Latest message: Thanks for your help!
 * (No tool logs - AI responds directly without calling tools)
 */

/**
 * Comparison with Other Approaches:
 *
 * 1. Fixed Workflow (app/agents/rag.ts):
 *    - Always searches for every query
 *    - Predictable and simple
 *    - Can waste resources on simple queries
 *
 * 2. This Tool-Calling Approach:
 *    - AI decides when to search
 *    - More intelligent and flexible
 *    - Extra cost for decision-making
 *    - Better for mixed conversations
 *
 * 3. LangGraph (app/api/langgraph-agent):
 *    - Explicit graph-based routing
 *    - Full control over workflow
 *    - Can loop and iterate
 *    - Best for complex, stateful workflows
 *
 * Choose based on your use case:
 * - Simple, single-purpose → Fixed workflow
 * - Conversational with mixed queries → Tool-calling
 * - Complex multi-step workflows → LangGraph
 */
