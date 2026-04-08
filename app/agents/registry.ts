import { AgentType, AgentRequest, AgentResponse } from './types';
import { linkedInAgent } from './linkedin';
import { ragAgent } from './rag';

type AgentExecutor = (request: AgentRequest) => Promise<AgentResponse>;

export const agentRegistry: Record<AgentType, AgentExecutor> = {
	linkedin: linkedInAgent,
	rag: ragAgent,
};

export function getAgent(agentType: AgentType): AgentExecutor {
	// TODO: Implement agent lookup
	//
	// Steps:
	// 1. Look up the agent executor from agentRegistry using agentType
	// 2. If not found, throw an Error with a descriptive message
	// 3. Return the agent executor

	throw new Error('getAgent not implemented yet!');
}
