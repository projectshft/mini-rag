import { AgentRequest, AgentResponse } from "./types";
import { pineconeClient } from "@/app/libs/pinecone";
import { openaiClient } from "@/app/libs/openai/openai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { traceable } from "langsmith/traceable";

const embed = traceable(
  async (query: string) => {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      dimensions: 512,
      input: query,
    });
    return response.data[0].embedding;
  },
  { name: "embed", run_type: "embedding" },
);

const retrieve = traceable(
  async (embedding: number[]) => {
    const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
    return index.query({ vector: embedding, topK: 10, includeMetadata: true });
  },
  { name: "retrieve", run_type: "retriever" },
);

const rerank = traceable(
  async (query: string, text: string[]) => {
    return pineconeClient.inference.rerank("bge-reranker-v2-m3", query, text, {
      topN: 5,
      returnDocuments: true,
    });
  },
  { name: "rerank", run_type: "retriever" },
);

export const ragAgent = traceable(
  async (request: AgentRequest): Promise<AgentResponse> => {
    const embedding = await embed(request.query);

    const result = await retrieve(embedding);

    const text = result.matches
      .map((res) => res.metadata?.text)
      .filter((text) => typeof text === "string");

    const reranked = await rerank(request.query, text);

    const retrievedContext = reranked.data
      .map((result) => result.document?.text)
      .filter(Boolean)
      .join("\n\n");

    const sources = reranked.data.map((r) => {
      const match = result.matches[r.index];
      return {
        title: match?.metadata?.title,
        url: match?.metadata?.url,
        score: r.score,
      };
    });
    const systemPrompt = `You are a helpful assistant answering questions based on the provided context in the user's query.

use the context in the query to answer the user's question.

original query: ${request.originalQuery}
refined query: ${request.query}
retrieved context: ${retrievedContext}

if the context doesnt contain enough information, say so clearly or do your best to answer the question`;

    return {
      stream: streamText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: `Context: ${retrievedContext}\n\nQuery: ${request.query}`,
      }),
      sources,
    };
  },
  { name: "rag-agent", run_type: "chain" },
);
