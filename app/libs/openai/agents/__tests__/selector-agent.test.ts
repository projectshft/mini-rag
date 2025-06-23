import { selectAgent } from '../selector-agent';
import { AGENT_CONFIG } from '../types';

describe('selectAgent', () => {
	const testCases = [
		{
			name: 'should select LinkedIn agent for LinkedIn-related queries',
			query: 'Write a LinkedIn post about learning JavaScript',
			expectedAgent: 'linkedin',
			expectedModel: AGENT_CONFIG.linkedin.model,
		},
		{
			name: 'should select Knowledge Base agent for coding queries',
			query: 'Why are enums in TypeScript useful?',
			expectedAgent: 'knowledgeBase',
			expectedModel: AGENT_CONFIG.knowledgeBase.model,
		},
		{
			name: 'should select general agent for generic queries',
			query: 'What is a recipe for a good lasagna?',
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
