import { openaiClient } from '../openai';

export async function processLinkedInQuery(query: string, model: string) {
	const response = await openaiClient.chat.completions.create({
		model: model,
		messages: [
			{
				role: 'system',
				content: `You are a LinkedIn expert assistant, specialized in helping with LinkedIn-related queries. 
                You have been fine-tuned on LinkedIn-specific data to provide accurate and relevant responses.
                Focus on providing practical, actionable advice for LinkedIn-related questions.`,
			},
			{ role: 'user', content: query },
		],
	});

	return response.choices[0].message.content;
}
