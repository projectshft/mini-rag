import { AgentRequest, AgentResponse } from "./types";
import { pineconeClient } from "@/app/libs/pinecone";
import { openaiClient } from "@/app/libs/openai/openai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function ragAgent(request: AgentRequest): Promise<AgentResponse> {
  // TODO: Step 1 - Generate embedding for the refined query
  // Use openaiClient.embeddings.create()
  // Model: 'text-embedding-3-small'
  // Dimensions: 512
  // Input: request.query
  // Extract the embedding from response.data[0].embedding
  const response = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 512,
    input: request.query,
  });
  const embedding = response.data[0].embedding;
  // TODO: Step 2 - Query Pinecone for similar documents
  // Get the index: pineconeClient.Index(process.env.PINECONE_INDEX!)
  // Query parameters:
  //   - vector: the embedding from step 1
  //   - topK: 10 (to over-fetch for reranking)
  //   - includeMetadata: true
  const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
  const result = await index.query({
    vector: embedding,
    topK: 10,
    includeMetadata: true,
  });

  // TODO: Step 3 - Extract text from results
  // Map over queryResponse.matches
  // Get metadata?.text (or metadata?.content as fallback)
  // Filter out any null/undefined values
  const text = result.matches
    .map((res) => res.metadata?.text)
    .filter((text) => typeof text === "string");

  // TODO: Step 4 - Rerank with Pinecone inference API
  // Use pineconeClient.inference.rerank()
  // Model: 'bge-reranker-v2-m3'
  // Pass the query and documents array
  // This gives you better quality results
  const reranked = await pineconeClient.inference.rerank(
    "bge-reranker-v2-m3",
    request.query,
    text,
    { topN: 5, returnDocuments: true },
  );

  // TODO: Step 5 - Build context from reranked results
  // Map over reranked.data
  // Extract result.document?.text from each
  // Join with '\n\n' separator
  const retrievedContext = reranked.data
    .map((result) => result.document?.text)
    .filter(Boolean)
    .join("\n\n");

  // TODO: Step 6 - Create system prompt
  // Include:
  //   - Instructions to answer based on context
  //   - Original query (request.originalQuery)
  //   - Refined query (request.query)
  //   - The retrieved context
  //   - Instruction to say if context is insufficient
  const systemPrompt = `You are a helpful assistant answering questions based on the provided context in the user's query.

use the context in the query to answer the user's question.

original query: ${request.originalQuery}
refined query: ${request.query}
retrieved context: ${retrievedContext}

if the context doesnt contain enough information, say so clearly or do your best to answer the question`;

  // TODO: Step 7 - Stream the response
  // Use streamText()
  // Model: openai('gpt-4o')
  // System: your system prompt
  // Messages: request.messages
  // Return the stream
  console.log(
    "Pinecone scores:",
    result.matches.map((m) => ({ score: m.score, text: m.metadata?.text })),
  );
  console.log(
    "Re-ranked scores:",
    reranked.data.map((r) => ({ score: r.score, text: r.document })),
  );
  console.log("Context length:", retrievedContext.length);

  return streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: `Context: ${retrievedContext}\n\nQuery: ${request.query}`,
  });
}
