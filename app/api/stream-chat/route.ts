import { processLinkedInQuery } from '@/app/libs/openai/agents/linkedin-agent';
import { processContentQuery } from '@/app/libs/openai/agents/rag-agent';
import { processGeneralQuery } from '@/app/libs/openai/agents/general-agent';
import { typedRoute } from '../typedRoute';
import { AgentType } from '@/app/libs/openai/agents/types';

const agents: Record<
	AgentType,
	(query: string, model: string) => Promise<Response | string | null>
> = {
	linkedin: processLinkedInQuery,
	knowledgeBase: processContentQuery,
	general: processGeneralQuery,
};

export const POST = typedRoute(
	'STREAM-CHAT',
	async ({ agentQuery, selectedAgent, model }) => {
		if (!(selectedAgent in agents)) {
			throw new Error('Invalid agent selected');
		}

		const response = await agents[selectedAgent](agentQuery, model);

		// If it's a streaming response, return it directly
		if (response && typeof response.pipe === 'function') {
			return response;
		}

		return response || 'Oops, something went wrong';
	}
);
