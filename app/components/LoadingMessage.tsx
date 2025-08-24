'use client';

export function LoadingMessage() {
	return (
		<div className='mb-4 border-b border-black pb-2'>
			<div className='font-bold italic'>AI Assistant:</div>
			<div className='pl-4'>
				<div className='flex items-center gap-2'>
					<span className='animate-pulse'>[...]</span>
					<span className='italic'>Generating response...</span>
				</div>
			</div>
		</div>
	);
}
