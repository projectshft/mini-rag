import { openaiClient } from '../openai';
import { AGENT_CONFIG } from '../openai';

export async function processGeneralQuery(
	query: string,
	model: string = AGENT_CONFIG.general.model
) {
	const response = await openaiClient.chat.completions.create({
		model: model,
		messages: [
			{
				role: 'system',
				content: `You are a helpful AI assistant. Provide clear, concise, and accurate responses to the user's queries.
                If you're unsure about something, say so rather than making up information.`,
			},
			{ role: 'user', content: query },
		],
	});

	return response.choices[0].message.content;
}
