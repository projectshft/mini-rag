/**
 * SELECTOR AGENT - MULTI-AGENT SYSTEM ORCHESTRATION
 *
 * This agent is the "traffic controller" of our multi-agent system.
 * It analyzes user queries and routes them to the most appropriate specialized agent.
 *
 * WHY USE A SELECTOR AGENT?
 * - Different agents are optimized for different tasks
 * - Improves response quality by using the right tool for the job
 * - Enables modular, scalable AI systems
 * - Allows for specialized models (fine-tuned vs RAG vs general)
 *
 * HOW IT WORKS:
 * 1. User submits a query (text or audio)
 * 2. Selector analyzes the query content and intent
 * 3. Chooses the best agent (LinkedIn, News, or General)
 * 4. Optionally refines the query for the selected agent
 * 5. Returns both the agent choice and refined query
 *
 * STRUCTURED OUTPUT:
 * Uses OpenAI's structured output feature to ensure consistent JSON responses
 * This prevents parsing errors and enables reliable agent routing
 *
 * EXPERIMENT IDEAS:
 * - Add more specialized agents (finance, health, coding, etc.)
 * - Implement confidence scoring for agent selection
 * - Add fallback logic when multiple agents could work
 * - Create agent chains (one agent's output feeds another)
 * - Add user preference learning (remember preferred agents)
 *
 * Learn more about structured outputs: https://platform.openai.com/docs/guides/structured-outputs
 */

import { openaiClient } from '../openai';
import { AGENT_CONFIG, AgentType, agentSchema } from './types';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

// Dynamic system prompt that includes all available agents
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
`;

// Zod schema for structured output validation
export const agentResponseSchema = z.object({
	selectedAgent: agentSchema,
	agentQuery: z.string().describe('The refined query for the selected agent'),
});

type ModelType = 'gpt-4o-mini' | 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt';

/**
 * MAIN SELECTOR FUNCTION
 *
 * Analyzes user input and routes to the appropriate specialized agent.
 * Handles both text and audio inputs (audio gets transcribed first).
 */
export async function selectAgent(query: string): Promise<{
	selectedAgent: AgentType;
	agentQuery: string;
	model: ModelType;
}> {
	const response = await openaiClient.responses.parse({
		text: {
			format: zodTextFormat(agentResponseSchema, 'agentResponse'),
		},
		model: 'gpt-4o-mini', // TRY CHANGING: 'gpt-4o' for better selection accuracy (costs more)
		// TRY ADDING: temperature: 0.1, // Low temperature for consistent routing decisions
		input: [
			{
				role: 'system',
				content: SYSTEM_PROMPT,
			},
			{ role: 'user', content: query },
		],
	});

	const parsedResponse = response.output_parsed;

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
