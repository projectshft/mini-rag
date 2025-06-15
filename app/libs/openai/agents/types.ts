import { z } from 'zod';

export const agentSchema = z.enum(['knowledgeBase', 'linkedin', 'general']);
export type AgentType = z.infer<typeof agentSchema>;

export type AgentConfig = {
	model: 'gpt-4o-mini' | 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt';
	name: AgentType;
	description: string;
};

/**
 * AGENT CONFIGURATION REGISTRY
 *
 * Each agent is specialized for different types of queries:
 * - Different models (base vs fine-tuned)
 * - Different capabilities (RAG vs direct generation)
 * - Different domains (professional vs news vs general)
 */
export const AGENT_CONFIG: Record<AgentType, AgentConfig> = {
	linkedin: {
		// Fine-tuned model: Specialized on LinkedIn post data for better professional content
		// TRY CHANGING: Use 'gpt-4o-mini' to compare base vs fine-tuned performance
		model: 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt',
		name: 'linkedin',
		description:
			'Specialized in LinkedIn-related posts about tech using a fine-tuned model',
	},
	knowledgeBase: {
		// Base model: Good general performance, works with RAG system
		// TRY CHANGING: 'gpt-4o' for higher quality (costs more), 'gpt-3.5-turbo' for cheaper
		model: 'gpt-4o-mini',
		name: 'knowledgeBase',
		description:
			'Queries the knowledge base for information about coding, software development, and technology.',
	},
	general: {
		// Base model: Handles everything else
		// TRY CHANGING: Different models based on your needs and budget
		model: 'gpt-4o-mini',
		name: 'general',
		description: 'Handles general queries using the base model',
	},
};

// Schema for validating agent selection responses
export const agentResponseSchema = z.object({
	selectedAgent: agentSchema,
	agentQuery: z.string(),
});
