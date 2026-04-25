import { AgentRequest, AgentResponse } from './types';
import { ragAgent } from './rag';

type AgentExecutor = (request: AgentRequest) => Promise<AgentResponse>;

export const executeAgent: AgentExecutor = ragAgent;
