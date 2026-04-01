import { z } from "zod";
import { StreamTextResult, ToolSet } from "ai";
import { RecordMetadataValue } from "@pinecone-database/pinecone";

export const agentTypeSchema = z
  .enum(["linkedin", "rag"])
  .describe(
    "The agent to use: linkedin for help writing posts, rag for help with technical questions",
  );

export type AgentType = z.infer<typeof agentTypeSchema>;

export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export interface AgentRequest {
  type: AgentType;
  query: string; // Refined/summarized query from selector
  originalQuery: string; // Original user message
  messages: Message[]; // Conversation history
}

export type AgentResponse = {
  stream: StreamTextResult<ToolSet, never>;
  sources?: {
    title: RecordMetadataValue | undefined;
    url: RecordMetadataValue | undefined;
    score: RecordMetadataValue | undefined;
  }[];
};

export interface AgentConfig {
  name: string;
  description: string;
}
