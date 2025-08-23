'use client';

import { Bot } from 'lucide-react';
import { MarkdownWithIcons } from './MarkdownWithIcons';
import { UIMessage } from '@ai-sdk/react';
import { useEffect, useState } from 'react';

interface MessageMetadata {
	totalUsage?: {
		totalTokens?: number;
	};
	[key: string]: unknown;
}

export function AgentMessage({ message }: { message: UIMessage }) {
	const [content, setContent] = useState<string[]>([]);

	useEffect(() => {
		// Extract text content from parts
		const textContent = message.parts
			.filter((part) => part.type === 'text')
			.map((part) => part.text);

		setContent(textContent);
	}, [message]);

	// Safely cast metadata to our interface
	const metadata = message.metadata as MessageMetadata | undefined;

	return (
		<div className='flex flex-row items-start gap-2 w-full'>
			<div className='w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white'>
				<Bot className='w-6 h-6' />
			</div>

			<div className='flex flex-col gap-1 max-w-[80%] bg-[#63a4ff] text-white rounded-2xl shadow-lg p-4'>
				<div className='whitespace-pre-wrap text-lg'>
					{content.map((text, idx) => (
						<MarkdownWithIcons key={idx} content={text} />
					))}
					{metadata?.totalUsage?.totalTokens && (
						<div className='text-xs mt-2 opacity-70'>
							Total usage: {metadata.totalUsage.totalTokens}{' '}
							tokens
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
