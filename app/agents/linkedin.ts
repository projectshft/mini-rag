import { AgentRequest, AgentResponse } from './types';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function linkedInAgent(
	request: AgentRequest
): Promise<AgentResponse> {
	// TODO: Implement the LinkedIn agent
	//
	// Follow Module 8 in the curriculum:
	//   1. Get the fine-tuned model ID from environment (process.env.OPENAI_FINETUNED_MODEL)
	//   2. Build a system prompt for LinkedIn content
	//   3. Use streamText() with:
	//      - model: openai(modelId)
	//      - system: your system prompt
	//      - prompt: include request.originalQuery and request.query
	//
	// Note: Use `prompt` parameter (not `messages`) for single-turn agent responses

	throw new Error('LinkedIn agent not implemented yet!');
}
