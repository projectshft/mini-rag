/**
 * LINKEDIN AGENT - FINE-TUNED MODEL DEMONSTRATION
 *
 * This agent showcases how fine-tuned models work differently from base models.
 * It's been trained on specific LinkedIn post data to generate professional content.
 *
 * FINE-TUNING CONCEPTS:
 * - Base models: Trained on general internet data (good at everything, master of nothing)
 * - Fine-tuned models: Further trained on your specific data (specialized expertise)
 * - This model was trained on LinkedIn posts to understand professional tone and style
 *
 * WHEN TO USE FINE-TUNING:
 * ✅ You have lots of high-quality examples (100+ samples)
 * ✅ You need consistent style/format/tone
 * ✅ Domain-specific knowledge or terminology
 * ✅ Better performance on specific tasks
 *
 * ❌ Don't fine-tune if you just need general knowledge
 * ❌ Don't fine-tune with poor quality training data
 * ❌ Consider prompt engineering first (cheaper and faster)
 *
 * EXPERIMENT IDEAS:
 * - Compare responses with base model (change to 'gpt-4o-mini')
 * - Add temperature for more creative posts
 * - Modify system prompt for different professional styles
 * - Add max_tokens to control post length
 * - Try different fine-tuned models for other domains
 *
 * Learn more: https://platform.openai.com/docs/guides/fine-tuning
 */

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

/**
 * LINKEDIN CONTENT GENERATION
 *
 * Uses a fine-tuned model specifically trained on LinkedIn posts
 * to generate professional, platform-appropriate content.
 */
export async function processLinkedInQuery(query: string, model: string) {
	const result = await streamText({
		model: openai(model), // Usually the fine-tuned model: 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt'
		// TRY ADDING: temperature: 0.8, // Higher = more creative posts (0.0-1.0)
		// TRY ADDING: maxTokens: 300, // Limit post length for LinkedIn's format
		// TRY ADDING: topP: 0.9, // Alternative to temperature for controlling randomness
		messages: [
			{
				role: 'system',
				content: `You are a LinkedIn expert assistant, specialized in helping with LinkedIn-related queries. 
                You have been fine-tuned on LinkedIn-specific data to provide accurate and relevant responses.
                Focus on providing practical, actionable advice for LinkedIn-related questions.
				You never use emojis.
				
				TRY CHANGING THIS PROMPT:
				- Add specific industry focus (tech, marketing, finance, etc.)
				- Request different post formats (tips, stories, questions, etc.)
				- Ask for specific tone (inspirational, educational, conversational)
				- Include hashtag suggestions or engagement strategies
				- Add character limits or formatting requirements`,
			},
			{ role: 'user', content: query },
		],
	});

	return result.toDataStreamResponse();
}
