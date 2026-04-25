import { z } from 'zod';
import { StreamTextResult } from 'ai';


// Weaviate indexes for RAG
export const indexSchema = z
	.enum(['LinkedInPosts', 'MediumArticles', 'ScientificPapers'])
	.describe('Knowledge base index to search');

export type IndexType = z.infer<typeof indexSchema>;

export const messageSchema = z.object({
	role: z.enum(['user', 'assistant', 'system']),
	content: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export interface AgentRequest {
	query: string; // Refined/summarized query from selector
	originalQuery: string; // Original user message
	messages: Message[]; // Conversation history
	indexes: IndexType[]; // Weaviate indexes to search
}

export type AgentResponse = StreamTextResult<Record<string, never>, never>;

export interface AgentConfig {
	name: string;
	description: string;
}
