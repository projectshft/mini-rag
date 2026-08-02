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
 * 3. LANGSMITH INTEGRATION:
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
 * Learn more about LangSmith: https://docs.langchain.com/langsmith
 */

import OpenAI from 'openai';
import { createOpenAI } from '@ai-sdk/openai';
import { wrapOpenAI } from 'langsmith/wrappers';

// If we minted you a class API key, OPENAI_BASE_URL points at the class proxy
// and OPENAI_API_KEY is that key. Using your own OpenAI account instead? Leave
// OPENAI_BASE_URL unset and both clients talk to OpenAI directly.
//
// Both SDKs get configured here on purpose. The `openai` SDK below would pick
// up OPENAI_BASE_URL from the environment by itself, but `@ai-sdk/openai` will
// NOT — its default `openai` export is hardcoded to api.openai.com. If you
// import `{ openai }` from '@ai-sdk/openai' directly in an agent, your class
// key gets sent to OpenAI and you'll get a 401. Import `openaiProvider` here.

const baseClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
	baseURL: process.env.OPENAI_BASE_URL,
});

export const openaiClient = wrapOpenAI(baseClient);

/** Use this for streamText()/generateObject() — NOT `openai` from '@ai-sdk/openai'. */
export const openaiProvider = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
	baseURL: process.env.OPENAI_BASE_URL,
});
