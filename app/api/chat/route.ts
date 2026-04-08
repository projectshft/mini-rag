import { z } from 'zod';
import { agentTypeSchema, messageSchema } from '@/app/agents/types';
import { getAgent } from '@/app/agents/registry';

const chatSchema = z.object({
	messages: z.array(messageSchema),
	agent: agentTypeSchema,
	query: z.string(),
});

export async function POST(req: Request) {
	// TODO: Implement the chat endpoint
	//
	// Steps:
	// 1. Parse and validate the request body using chatSchema.parse()
	// 2. Extract messages, agent type, and query from parsed body
	// 3. Get the original user query from the last message
	// 4. Look up the agent executor using getAgent()
	// 5. Execute the agent with { type, query, originalQuery, messages }
	// 6. Return result.toTextStreamResponse()
	// 7. Wrap in try/catch - return 500 on error

	throw new Error('Chat endpoint not implemented yet!');
}
