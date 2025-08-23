'use client';

import { Bot } from 'lucide-react';

export function LoadingMessage() {
	return (
		<div className='flex flex-row items-start gap-2 w-full'>
			<div className='w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white'>
				<Bot className='w-6 h-6' />
			</div>
			<div className='flex flex-col gap-1 max-w-[80%] bg-[#63a4ff] text-white rounded-2xl shadow-lg p-4'>
				<div className='flex items-center gap-3'>
					<div className='relative w-5 h-5'>
						<div className='absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin'></div>
					</div>
					<span className='text-white'>Generating response...</span>
				</div>
			</div>
		</div>
	);
}
