import { NextRequest, NextResponse } from 'next/server';
import { openaiClient } from '@/app/libs/openai/openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { agentTypeSchema, messageSchema } from '@/app/agents/types';
import { agentConfigs } from '@/app/agents/config';

const selectAgentSchema = z.object({
	messages: z.array(messageSchema).min(1),
});

const agentSelectionSchema = z.object({
	agent: agentTypeSchema,
	query: z.string(),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = selectAgentSchema.parse(body);
		const { messages } = parsed;

		// Take last 5 messages for context
		const recentMessages = messages.slice(-5);

		// Build agent descriptions from config
		const agentDescriptions = Object.entries(agentConfigs)
			.map(([key, config]) => `- "${key}": ${config.description}`)
			.join('\n');

		// Step 1: Call OpenAI with structured output
		const completion = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are an agent router that analyzes conversations and selects the appropriate agent.

Available agents:
${agentDescriptions}

Your task:
1. Analyze the conversation context
2. Identify the user's intent
3. Select the most appropriate agent
4. Refine the query to be clear and specific

Respond with the agent name and a refined query.`,
				},
				...recentMessages,
			],
			response_format: zodResponseFormat(agentSelectionSchema, 'agentSelection'),
		});

		// Step 2: Extract and parse the output
		const content = completion.choices[0]?.message?.content;
		if (!content) {
			throw new Error('No response from OpenAI');
		}

		const output = JSON.parse(content) as z.infer<typeof agentSelectionSchema>;

		// Step 3: Return the result
		if (output && output.agent && output.query) {
			return NextResponse.json({
				agent: output.agent,
				query: output.query,
			});
		}

		// Fallback if parsing fails
		return NextResponse.json({
			agent: 'rag',
			query: messages[messages.length - 1]?.content || '',
		});
	} catch (error) {
		console.error('Error selecting agent:', error);
		return NextResponse.json(
			{ error: 'Failed to select agent' },
			{ status: 500 }
		);
	}
}
