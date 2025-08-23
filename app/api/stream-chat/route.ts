import { processLinkedInQuery } from '@/app/libs/openai/agents/linkedin-agent';
import { processContentQuery } from '@/app/libs/openai/agents/rag-agent';
import { processGeneralQuery } from '@/app/libs/openai/agents/general-agent';
import { AgentType } from '@/app/libs/openai/agents/types';
import { NextRequest, NextResponse } from 'next/server';
import { apiSchemas } from '../config';

const agents: Record<
	AgentType,
	(query: string, model: string) => Promise<Response | string | null>
> = {
	linkedin: processLinkedInQuery,
	knowledgeBase: processContentQuery,
	general: processGeneralQuery,
};

export const POST = async (req: NextRequest) => {
	const body = await req.json();

	// Handle useChat format
	if (body.messages) {
		const lastMessage = body.messages[body.messages.length - 1];
		const { selectedAgent, agentQuery, model } = lastMessage.metadata || {};

		if (!selectedAgent || !agentQuery || !model) {
			return NextResponse.json(
				{ error: 'Missing required data' },
				{ status: 400 }
			);
		}

		if (!(selectedAgent in agents)) {
			return NextResponse.json(
				{ error: 'Invalid agent selected' },
				{ status: 400 }
			);
		}

		return await agents[selectedAgent as AgentType](agentQuery, model);
	}

	const inputSchema = apiSchemas['STREAM-CHAT'].input;
	const result = inputSchema.safeParse(body);

	console.log('result', result);

	if (!result.success) {
		return NextResponse.json(result.error.errors, { status: 400 });
	}

	const { agentQuery, selectedAgent, model } = result.data;

	if (!(selectedAgent in agents)) {
		return NextResponse.json(
			{ error: 'Invalid agent selected' },
			{ status: 400 }
		);
	}

	const response = await agents[selectedAgent](agentQuery, model);

	// If it's a streaming response, return it directly
	if (response && typeof response === 'object' && 'body' in response) {
		return response;
	}

	console.log('response', response);
	return NextResponse.json(response || 'Oops, something went wrong');
};
