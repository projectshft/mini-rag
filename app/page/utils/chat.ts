import { fetchApiRoute } from '../../libs/api/client';
import { Message } from 'ai/react';

export async function handleAgentSelection(
	input: string | Blob,
	append: (
		message: Omit<Message, 'id'>
	) => Promise<string | null | undefined>,
	callBack?: () => void
) {
	try {
		const { selectedAgent, agentQuery, model } = await fetchApiRoute(
			'SELECT-AGENT',
			typeof input === 'string' ? { userQuery: input } : { audio: input }
		);

		await append({
			content: `**Query:** ${agentQuery}\n**Agent:** ${selectedAgent} agent`,
			role: 'user',
		});

		callBack?.();

		const agentResponse = await fetchApiRoute('STREAM-CHAT', {
			selectedAgent,
			agentQuery,
			model,
		});

		await append({
			content: agentResponse,
			role: 'assistant',
		});
	} catch (error) {
		console.error('Error in agent selection:', error);
		throw error;
	}
}
