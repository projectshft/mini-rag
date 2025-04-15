import { typedRoute } from '@/app/api/typedRoute';
import {
	agentResponseSchema,
	openaiClient,
	AGENT_CONFIG,
} from '@/app/libs/openai/openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const SYSTEM_PROMPT = `You are a helpful assistant that selects the best agent to answer the user query. You should select the agent that is most likely to answer the user query correctly.

Agents:

${Object.values(AGENT_CONFIG)
	.map((agent) => `- ${agent.name}: ${agent.description}`)
	.join('\n')}
`;

export const POST = typedRoute(
	'/api/select-agent',
	async ({ userQuery, audio }) => {
		if (audio) {
			const audioTranscription =
				await openaiClient.audio.transcriptions.create({
					file: new File([audio], 'audio.webm', {
						type: 'audio/webm',
					}),
					model: 'whisper-1',
					response_format: 'json',
					language: 'en',
					prompt: `${SYSTEM_PROMPT}

					Output:
					{
						agentQuery: string,
						selectedAgent: 'news' | 'linkedin' | 'general',
					}
				`,
				});

			const parsedUserQuery = z
				.object({
					agentQuery: z.string(),
					selectedAgent: z.enum(['news', 'linkedin', 'general']),
				})
				.parse(audioTranscription);

			if (!parsedUserQuery) {
				throw new Error('Failed to parse user query');
			}

			if (parsedUserQuery.agentQuery) {
				return {
					selectedAgent: parsedUserQuery.selectedAgent,
					agentQuery: parsedUserQuery.agentQuery,
					model:
						parsedUserQuery.selectedAgent === 'linkedin'
							? AGENT_CONFIG.linkedin.model
							: AGENT_CONFIG.general.model,
				};
			}
		}

		if (!userQuery) {
			throw new Error('No user query provided');
		}

		const response = await openaiClient.beta.chat.completions.parse({
			response_format: zodResponseFormat(
				agentResponseSchema,
				'agentResponse'
			),
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: SYSTEM_PROMPT,
				},
				{ role: 'user', content: userQuery },
			],
		});

		const parsedResponse = response.choices[0].message.parsed;

		if (!parsedResponse) {
			throw new Error('Failed to parse response');
		}

		const selectedAgent = parsedResponse.selectedAgent;

		return {
			selectedAgent,
			agentQuery: parsedResponse.agentQuery,
			model: AGENT_CONFIG[selectedAgent].model,
		};
	}
);
