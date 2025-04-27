import { selectAgent } from '../selector-agent';
import { AGENT_CONFIG } from '../../openai';

describe('selectAgent', () => {
	const testCases = [
		{
			name: 'should select LinkedIn agent for LinkedIn-related queries',
			query: 'Write a LinkedIn post about learning JavaScript',
			expectedAgent: 'linkedin',
			expectedModel: AGENT_CONFIG.linkedin.model,
		},
		{
			name: 'should select Articles agent for tariffs-related queries',
			query: 'What are the latest developments regarding tariffs?',
			expectedAgent: 'articles',
			expectedModel: AGENT_CONFIG.articles.model,
		},
		{
			name: 'should select general agent for generic news-related queries',
			query: 'What are the latest developments in the tech industry?',
			expectedAgent: 'general',
			expectedModel: AGENT_CONFIG.general.model,
		},
		{
			name: 'should select General agent for non-specialized queries',
			query: 'What is the capital of France?',
			expectedAgent: 'general',
			expectedModel: AGENT_CONFIG.general.model,
		},
	];

	testCases.forEach(({ name, query, expectedAgent, expectedModel }) => {
		it(name, async () => {
			const result = await selectAgent(query);
			expect(result.selectedAgent).toBe(expectedAgent);
			expect(result.model).toBe(expectedModel);
		});
	});
});
