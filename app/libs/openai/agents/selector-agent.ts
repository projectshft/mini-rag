import { openaiClient } from '../openai';
import { AGENT_CONFIG, AgentType } from '../openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const SYSTEM_PROMPT = `You are a helpful assistant that selects the best agent to answer the user query. You should select the agent that is most likely to answer the user query correctly.

Agents:

${Object.values(AGENT_CONFIG)
	.map((agent) => `- ${agent.name}: ${agent.description}`)
	.join('\n')}

Your task is to:
1. Analyze the user's query
2. Select the most appropriate agent
3. Refine the query if needed to better suit the selected agent
4. Return both the selected agent and the refined query

Output format:
{
  selectedAgent: 'articles' | 'linkedin' | 'general',
  agentQuery: string
}`;

export const agentResponseSchema = z.object({
	selectedAgent: z.enum(['articles', 'linkedin', 'general']),
	agentQuery: z.string(),
});

type ModelType = 'gpt-4o-mini' | 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt';

export async function selectAgent(query: string): Promise<{
	selectedAgent: AgentType;
	agentQuery: string;
	model: ModelType;
}> {
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
			{ role: 'user', content: query },
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
		model: AGENT_CONFIG[selectedAgent].model as ModelType,
	};
}
