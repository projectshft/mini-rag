'use client';

import { MarkdownWithIcons } from './MarkdownWithIcons';
import { UIMessage } from '@ai-sdk/react';

export function UserMessage({ message }: { message: UIMessage }) {
	return (
		<div className='mb-4 border-b border-black pb-2'>
			<div className='font-bold'>You:</div>
			<div className='pl-4'>
				{message.parts.map((part, idx) => {
					if (part.type === 'text') {
						return (
							<MarkdownWithIcons key={idx} content={part.text} />
						);
					}
					return null;
				})}
			</div>
		</div>
	);
}
