import { AgentRequest, AgentResponse } from './types';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function linkedInAgent(
	request: AgentRequest
): Promise<AgentResponse> {
	// Step 1: Get the fine-tuned model ID
	const fineTunedModel = process.env.OPENAI_FINETUNED_MODEL;

	if (!fineTunedModel) {
		throw new Error(
			'OPENAI_FINETUNED_MODEL environment variable is not set. Please configure your fine-tuned model ID.'
		);
	}

	// Step 2: Build the system prompt
	const systemPrompt = `You are a professional LinkedIn copywriter who creates high-engagement posts.

Original user request: "${request.originalQuery}"
Refined query: "${request.query}"

Use the refined query to understand the user's intent and create an engaging LinkedIn post.`;

	// Step 3: Stream the response using the fine-tuned model
	return streamText({
		model: openai(fineTunedModel),
		system: systemPrompt,
		messages: request.messages,
	});
}
