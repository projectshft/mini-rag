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
import { createOpenAI } from '@ai-sdk/openai';

// OPENAI_BASE_URL points at the class LiteLLM proxy when a student is using
// the key we mint for them; unset, both clients fall back to OpenAI directly.
//
// Both SDKs have to be configured here. The `openai` SDK would read
// OPENAI_BASE_URL from the environment on its own, but `@ai-sdk/openai` does
// NOT — its default provider is hardcoded to api.openai.com. Importing
// `{ openai }` from '@ai-sdk/openai' anywhere in the app silently bypasses
// the proxy and 401s on a class key. Import `openaiProvider` instead.
export const openaiClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
	baseURL: process.env.OPENAI_BASE_URL,
});

export const openaiProvider = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
	baseURL: process.env.OPENAI_BASE_URL,
});
