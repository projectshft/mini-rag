import { typedRoute } from '@/app/api/typedRoute';
import { selectAgent } from '@/app/libs/openai/agents/selector-agent';
import { z } from 'zod';
import { openaiClient } from '@/app/libs/openai/openai';

export const POST = typedRoute(
	'/api/select-agent',
	async ({ userQuery, audio }) => {
		if (audio) {
			const audioTranscription =
				await openaiClient.audio.transcriptions.create({
					file: new File([audio], 'audio.webm', {
						type: 'audio/webm',
					}),
					model: 'whisper-1',
					response_format: 'json',
					language: 'en',
				});

			if (!audioTranscription.text) {
				throw new Error('Failed to transcribe audio');
			}

			return selectAgent(audioTranscription.text);
		}

		if (!userQuery) {
			throw new Error('No user query provided');
		}

		return selectAgent(userQuery);
	}
);
