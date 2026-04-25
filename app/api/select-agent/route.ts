import { NextRequest, NextResponse } from 'next/server';
import { openaiClient } from '@/app/libs/openai/openai';
import { zodTextFormat } from 'openai/helpers/zod';
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

		// Use structured outputs with responses.parse
		const result = await openaiClient.responses.parse({
			model: 'gpt-4o-mini', // why mini?
			input: [
				{
					role: 'system',
					content: `You are an agent router. Based on the conversation history, determine which agent should handle the request and create a focused query.

Available agents:
${agentDescriptions}

The query should be a refined, clear version of what the user wants, removing conversational fluff.`,
				},
				...recentMessages.map((msg) => ({
					role: msg.role as 'user' | 'assistant',
					content: msg.content,
				})),
			],
			text: {
				format: zodTextFormat(agentSelectionSchema, 'agent_selection'),
			},
		});

		// Access parsed result directly - no JSON.parse needed
		const output = result.output_parsed;

		if (output) {
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
			{ status: 500 },
		);
	}
}
