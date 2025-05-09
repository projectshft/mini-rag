import { processLinkedInQuery } from '@/app/libs/openai/agents/linkedin-agent';
import { processNewsQuery } from '@/app/libs/openai/agents/news-agent';
import { processGeneralQuery } from '@/app/libs/openai/agents/general-agent';
import { typedRoute } from '../typedRoute';

const agents = {
	linkedin: processLinkedInQuery,
	articles: processNewsQuery,
	general: processGeneralQuery,
} as const;

export const POST = typedRoute(
	'STREAM-CHAT',
	async ({ agentQuery, selectedAgent, model }) => {
		if (!(selectedAgent in agents)) {
			throw new Error('Invalid agent selected');
		}

		const response = await agents[selectedAgent](agentQuery, model);

		return response || 'Oops, something went wrong';
	}
);
