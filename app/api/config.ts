import { z } from 'zod';

// Define schemas for each API endpoint
export const apiSchemas = {
	'UPLOAD-NEWS': {
		route: '/api/upload-news',
		input: z.object({
			text: z.string(),
			url: z.string().optional(),
			topic: z.string().optional(),
			bias: z.enum(['liberal', 'conservative']),
		}),
		output: z.object({
			message: z.string(),
			vectorized: z.boolean(),
			success: z.boolean(),
		}),
	},
	'SELECT-AGENT': {
		route: '/api/select-agent',
		input: z.object({
			userQuery: z.string().optional(),
			audio: z.instanceof(Blob).optional(),
		}),
		output: z.object({
			selectedAgent: z.enum(['articles', 'linkedin', 'general']),
			model: z.enum([
				'gpt-4o-mini',
				'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt',
			]),
			agentQuery: z.string(),
		}),
	},
	'STREAM-CHAT': {
		route: '/api/stream-chat',
		input: z.object({
			agentQuery: z.string(),
			model: z.enum([
				'gpt-4o-mini',
				'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt',
			]),
			selectedAgent: z.enum(['articles', 'linkedin', 'general']),
		}),

		output: z.string(),
	},
} as const;

export type ApiRoute = keyof typeof apiSchemas;
export type ApiInput<T extends ApiRoute> = z.infer<
	(typeof apiSchemas)[T]['input']
>;
export type ApiOutput<T extends ApiRoute> = z.infer<
	(typeof apiSchemas)[T]['output']
>;
