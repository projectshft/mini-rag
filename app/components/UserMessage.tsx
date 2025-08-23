'use client';

import { User } from 'lucide-react';
import { MarkdownWithIcons } from './MarkdownWithIcons';
import { UIMessage } from '@ai-sdk/react';

export function UserMessage({ message }: { message: UIMessage }) {
	return (
		<div className='flex flex-row-reverse items-start gap-2 w-full'>
			<div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white'>
				<User className='w-6 h-6' />
			</div>

			<div className='flex flex-col gap-1 max-w-[80%] bg-[#1f1f1f] text-gray-200 rounded-2xl p-4'>
				<div className='whitespace-pre-wrap text-lg'>
					{message.parts.map((part, idx) => {
						if (part.type === 'text') {
							return (
								<MarkdownWithIcons
									key={idx}
									content={part.text}
								/>
							);
						}
						return null;
					})}
				</div>
			</div>
		</div>
	);
}
