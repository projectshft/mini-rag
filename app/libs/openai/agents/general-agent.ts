import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { AGENT_CONFIG } from './types';

export async function processGeneralQuery(
	query: string,
	model: string = AGENT_CONFIG.general.model
) {
	const result = await streamText({
		model: openai(model),
		messages: [
			{
				role: 'system',
				content: `You are a helpful AI assistant. Provide clear, concise, and accurate responses to the user's queries.
                If you're unsure about something, say so rather than making up information.`,
			},
			{ role: 'user', content: query },
		],
	});

	return result.toUIMessageStreamResponse();
}
