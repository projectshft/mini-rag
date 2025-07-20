import { fetchApiRoute } from '../api/client';
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

		// Let useChat handle the streaming
		await append({
			content: agentQuery,
			role: 'user',
			data: {
				selectedAgent,
				model,
				agentQuery
			}
		});
	} catch (error) {
		console.error('Error in agent selection:', error);
		throw error;
	}
}
