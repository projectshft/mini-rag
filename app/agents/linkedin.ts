import { AgentRequest, AgentResponse } from './types';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { EXAMPLE_POSTS } from './example-posts';

export async function linkedInAgent(
	request: AgentRequest
): Promise<AgentResponse> {
	// Step 1: Build the few-shot examples block from real posts.
	// Each example shows the model the voice and formatting to imitate.
	const examples = EXAMPLE_POSTS.map(
		(post, i) => `--- Example Post ${i + 1} ---\n${post}`
	).join('\n\n');

	// Step 2: Build the system prompt with the examples embedded
	const systemPrompt = `You are a professional LinkedIn copywriter who creates high-engagement posts.

Study the example posts below and match their voice, tone, structure, and formatting (short punchy lines, line breaks between thoughts, occasional lists and emphasis). Do NOT copy their content — only their style.

${examples}

Original user request: "${request.originalQuery}"
Refined query: "${request.query}"

Use the refined query to understand the user's intent and write a new LinkedIn post on that topic in the style of the examples.`;

	// Step 3: Stream the response
	return streamText({
		model: openai('gpt-4o'),
		system: systemPrompt,
		messages: request.messages,
	});
}
