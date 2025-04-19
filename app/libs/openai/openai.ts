import OpenAI from 'openai';
import { z } from 'zod';

export const openaiClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	baseURL: 'https://oai.helicone.ai/v1',
	defaultHeaders: {
		'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
	},
});

export type AgentType = 'linkedin' | 'articles' | 'general';

export type AgentConfig = {
	model: 'gpt-4o-mini' | 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt';
	name: AgentType;
	description: string;
};

export const AGENT_CONFIG: Record<AgentType, AgentConfig> = {
	linkedin: {
		model: 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt',
		name: 'linkedin',
		description:
			'Specialized in LinkedIn-related posts about tech using a fine-tuned model',
	},
	articles: {
		model: 'gpt-4o-mini',
		name: 'articles',
		description:
			'Handles news-related queries for conservative and liberal news viewpoints using vector search',
	},
	general: {
		model: 'gpt-4o-mini',
		name: 'general',
		description: 'Handles general queries using the base model',
	},
};

export const agentResponseSchema = z.object({
	selectedAgent: z.enum(['articles', 'linkedin', 'general']),
	agentQuery: z.string(),
});
