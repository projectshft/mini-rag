import { z } from 'zod';
import { indexSchema, messageSchema } from '@/app/agents/types';
import { executeAgent } from '@/app/agents/registry';

const chatSchema = z.object({
	messages: z.array(messageSchema),
	indexes: z.array(indexSchema).min(1).max(3),
	query: z.string(),
});

export async function POST(req: Request) {
	// TODO: Implement the chat endpoint
	//
	// Steps:
	// 1. Parse and validate the request body using chatSchema.parse()
	// 2. Extract messages, indexes, and query from parsed body
	// 3. Get the original user query from the last message
	// 4. Execute the agent with { query, originalQuery, messages, indexes }
	// 5. Return result.toTextStreamResponse()
	// 6. Wrap in try/catch - return 500 on error

	throw new Error('Chat endpoint not implemented yet!');
}
