import { fetchApiRoute } from '../api/client';
import { type UIMessage } from '@ai-sdk/react';
import { generateId } from 'ai';

export async function handleAgentSelection(
	input: string | Blob,
	sendMessage: (message: UIMessage) => Promise<void>,
	callBack?: () => void
) {
	try {
		const { selectedAgent, agentQuery, model } = await fetchApiRoute(
			'SELECT-AGENT',
			typeof input === 'string' ? { userQuery: input } : { audio: input }
		);

		// Send a single message with query info and metadata for streaming
		await sendMessage({
			id: generateId(),
			role: 'user',
			parts: [
				{
					type: 'text',
					text: `**Query:** ${agentQuery}\n**Agent:** ${selectedAgent} agent`,
				},
			],
			metadata: {
				selectedAgent,
				model,
				agentQuery,
				isQueryInfo: true, // Flag to identify this as the query info message
			},
		});

		callBack?.();
	} catch (error) {
		console.error('Error in agent selection:', error);
		throw error;
	}
}
