/**
 * OPENAI CLIENT AND AGENT CONFIGURATION
 *
 * This file sets up the OpenAI client and defines different AI agents for various tasks.
 * It demonstrates key concepts in building multi-agent AI systems.
 *
 * KEY CONCEPTS:
 *
 * 1. FINE-TUNED vs BASE MODELS:
 *    - Base models (gpt-4o-mini): General purpose, trained on broad internet data
 *    - Fine-tuned models (ft:gpt-4o-mini...): Specialized on your specific data
 *    - Fine-tuning makes models better at specific tasks but costs more
 *
 * 2. AGENT SPECIALIZATION:
 *    - Different agents handle different types of queries
 *    - LinkedIn agent: Uses fine-tuned model for professional content
 *    - News agent: Uses RAG (vector search) for current events
 *    - General agent: Fallback for everything else
 *
 * 3. HELICONE INTEGRATION:
 *    - Observability platform for monitoring AI usage
 *    - Tracks costs, performance, and usage patterns
 *    - Essential for production AI applications
 *
 * EXPERIMENT IDEAS:
 * - Try different base models (gpt-4o, gpt-3.5-turbo)
 * - Add temperature/top_p parameters for creativity control
 * - Create new specialized agents for different domains
 * - Add system prompts to agent configurations
 *
 * Learn more about fine-tuning: https://platform.openai.com/docs/guides/fine-tuning
 * Learn more about Helicone: https://docs.helicone.ai/
 */

import OpenAI from 'openai';
import { z } from 'zod';

// OpenAI client with Helicone monitoring integration
export const openaiClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	baseURL: 'https://oai.helicone.ai/v1', // Routes through Helicone for monitoring
	defaultHeaders: {
		'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`, // For usage tracking & analytics
	},
});

export type AgentType = 'knowledgeBase' | 'linkedin' | 'general';

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
	selectedAgent: z.enum(['knowledgeBase', 'linkedin', 'general']),
	agentQuery: z.string(),
});
