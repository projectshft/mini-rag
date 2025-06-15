import { z } from 'zod';
import { agentSchema } from '../libs/openai/agents/types';

// Define schemas for each API endpoint
export const apiSchemas = {
	'SELECT-AGENT': {
		route: '/api/select-agent',
		input: z.object({
			userQuery: z.string().optional(),
			audio: z.instanceof(Blob).optional(),
		}),
		output: z.object({
			selectedAgent: agentSchema,
			model: z.enum([
				'gpt-4o-mini',
				'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt', // Make sure you are using the correct model based on the result from upload-training-data.ts
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
				'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt', // Make sure you are using the correct model based on the result from upload-training-data.ts
			]),
			selectedAgent: agentSchema,
		}),

		output: z.string(),
	},
	'SCRAPE-CONTENT': {
		route: '/api/scrape-content',
		input: z.object({}), // No input parameters for GET request
		output: z.object({
			success: z.boolean(),
			message: z.string(),
			totalItems: z.number(),
			successfulItems: z.number(),
			failedItems: z.number(),
			successRate: z.string(),
		}),
	},
	'SCRAPE-URL': {
		route: '/api/scrape-url',
		input: z.object({
			url: z.string(),
			useHeadless: z.boolean().optional(),
		}),
		output: z.object({
			success: z.boolean(),
			message: z.string(),
			chunks: z.array(
				z.object({
					id: z.string(),
					content: z.string(),
					metadata: z.record(
						z.union([z.string(), z.number(), z.boolean()])
					),
				})
			),
			totalChunks: z.number(),
		}),
	},
	'SCRAPE-URLS': {
		route: '/api/scrape-urls',
		input: z.object({
			urls: z.array(z.string()),
			useHeadless: z.boolean().optional(),
		}),
		output: z.object({
			success: z.boolean(),
			message: z.string(),
			chunks: z.array(
				z.object({
					id: z.string(),
					content: z.string(),
					metadata: z.record(
						z.union([z.string(), z.number(), z.boolean()])
					),
				})
			),
			totalChunks: z.number(),
		}),
	},
} as const;

export type ApiRoute = keyof typeof apiSchemas;
export type ApiInput<T extends ApiRoute> = z.infer<
	(typeof apiSchemas)[T]['input']
>;
export type ApiOutput<T extends ApiRoute> = z.infer<
	(typeof apiSchemas)[T]['output']
>;
