import { AgentRequest, AgentResponse } from './types';
import { openaiProvider } from '@/app/libs/openai/openai';
import { streamText } from 'ai';

export async function linkedInAgent(
	request: AgentRequest
): Promise<AgentResponse> {
	// TODO: Implement the LinkedIn agent with few-shot prompting
	//
	//   1. Build an examples block from your example posts
	//   2. Build a system prompt that imitates their style
	//   3. streamText() with openaiProvider('gpt-4o')

	throw new Error('LinkedIn agent not implemented yet!');
}
