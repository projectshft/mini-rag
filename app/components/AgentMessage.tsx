'use client';

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
		<div className='mb-4 border-b border-black pb-2'>
			<div className='font-bold italic'>AI Assistant:</div>
			<div className='pl-4'>
				{content.map((text, idx) => (
					<MarkdownWithIcons key={idx} content={text} />
				))}
				{metadata?.totalUsage?.totalTokens && (
					<div className='text-xs mt-2 border-t border-black pt-1'>
						<i>
							Total usage: {metadata.totalUsage.totalTokens}{' '}
							tokens
						</i>
					</div>
				)}
			</div>
		</div>
	);
}
