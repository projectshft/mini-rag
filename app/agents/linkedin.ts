import { AgentRequest, AgentResponse } from './types';
import { openaiProvider } from '@/app/libs/openai/openai';
import { streamText } from 'ai';
import { EXAMPLE_POSTS } from './example-posts';

export async function linkedInAgent(
	request: AgentRequest
): Promise<AgentResponse> {
	// Step 1: Build the examples block.
	//
	// These go in the SYSTEM prompt, not in `messages`. In the system prompt
	// they read as style reference material; in the message history the model
	// would treat them as conversation turns it needs to reply to.
	const examples = EXAMPLE_POSTS.map(
		(post, i) => `--- Example Post ${i + 1} ---\n${post}`
	).join('\n\n');

	// Step 2: Build the system prompt.
	//
	// "Match the style, NOT the content" is doing real work here. Few-shot
	// examples pull the model toward everything in them, subject matter
	// included — without this line it recycles the examples' topics instead of
	// writing about what the user asked for.
	const systemPrompt = `You are a professional LinkedIn copywriter who creates high-engagement posts.

Study the example posts below and match their voice, tone, structure, and formatting (short punchy lines, line breaks between thoughts, occasional lists and emphasis). Do NOT copy their content — only their style.

${examples}

Original user request: "${request.originalQuery}"
Refined query: "${request.query}"

Use the refined query to understand the user's intent and write a new LinkedIn post on that topic in the style of the examples.`;

	// Step 3: Stream the response.
	//
	// A standard model replaces the fine-tuned one this agent used to call:
	// the examples above do the job the training data used to do. OpenAI
	// closed fine-tuning access in May 2026.
	//
	// Note `openaiProvider`, not `openai` from `@ai-sdk/openai` — the bare
	// import is pinned to api.openai.com and silently bypasses the class
	// LiteLLM proxy, which 401s on a student key.
	return streamText({
		model: openaiProvider('gpt-4o'),
		system: systemPrompt,
		messages: request.messages,
	});
}
