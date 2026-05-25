#!/usr/bin/env node
/**
 * RAG MCP Server
 *
 * Exposes the RAG knowledge base as MCP tools that can be used by:
 * - Claude Desktop
 * - Claude Code
 * - Cursor
 * - Any MCP-compatible client
 *
 * Usage:
 *   npx ts-node mcp/rag-server.ts
 *
 * Or build and run:
 *   npx tsc mcp/rag-server.ts --outDir dist/mcp --esModuleInterop
 *   node dist/mcp/rag-server.js
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Create MCP server
const server = new Server(
  {
    name: 'rag-knowledge-base',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// =============================================================================
// RAG FUNCTIONS
// =============================================================================

async function searchKnowledgeBase(query: string, limit: number = 5) {
  // 1. Embed the query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  // 2. Search Pinecone
  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  const results = await index.query({
    vector: embeddingResponse.data[0].embedding,
    topK: limit,
    includeMetadata: true,
  });

  // 3. Format results
  return results.matches.map((match) => ({
    score: match.score?.toFixed(3),
    text: match.metadata?.text || match.metadata?.content,
    source: match.metadata?.source || match.metadata?.url,
    id: match.id,
  }));
}

// =============================================================================
// MCP HANDLERS
// =============================================================================

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_knowledge_base',
      description:
        'Search the RAG knowledge base for relevant documents. Use this to find information about topics in the indexed documents.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          query: {
            type: 'string',
            description: 'The search query - what are you looking for?',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return (default: 5, max: 10)',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'list_sources',
      description: 'List the available data sources in the knowledge base.',
      inputSchema: {
        type: 'object' as const,
        properties: {},
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'search_knowledge_base') {
      const { query, limit = 5 } = args as { query: string; limit?: number };
      const clampedLimit = Math.min(Math.max(1, limit), 10);

      const results = await searchKnowledgeBase(query, clampedLimit);

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'No relevant documents found for your query.',
            },
          ],
        };
      }

      const formatted = results
        .map(
          (r, i) =>
            `[${i + 1}] Score: ${r.score}\nSource: ${r.source || 'Unknown'}\nText: ${r.text}\n`
        )
        .join('\n---\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${results.length} relevant documents:\n\n${formatted}`,
          },
        ],
      };
    }

    if (name === 'list_sources') {
      // Query Pinecone for unique sources (sample approach)
      const index = pinecone.Index(process.env.PINECONE_INDEX!);
      const stats = await index.describeIndexStats();

      return {
        content: [
          {
            type: 'text' as const,
            text: `Knowledge Base Stats:\n- Total vectors: ${stats.totalRecordCount}\n- Index: ${process.env.PINECONE_INDEX}\n\nUse search_knowledge_base to query specific topics.`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// =============================================================================
// START SERVER
// =============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('RAG MCP Server running on stdio');
  console.error(`Index: ${process.env.PINECONE_INDEX}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
