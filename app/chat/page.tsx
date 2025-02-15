'use client';

import { Message, useChat } from 'ai/react';

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '../api/stream-chat',
		maxSteps: 5,
	});

	return (
		<div className='flex flex-col w-full max-w-md py-24 mx-auto stretch gap-4'>
			{messages?.map((m: Message) => (
				<div
					key={m.id}
					className='whitespace-pre-wrap flex flex-col gap-1'
				>
					<strong>{`${m.role}: `}</strong>
					{m.content}
					{m.toolInvocations?.map((toolInvocation) => (
						<div
							key={toolInvocation.toolCallId}
							className='bg-gray-100 rounded-lg p-4 mt-2'
						>
							{toolInvocation.toolName ===
								'generateLinkedInPost' &&
								('result' in toolInvocation ? (
									<div className='flex flex-col gap-2'>
										<h3 className='font-semibold'>
											Generated LinkedIn Post:
										</h3>
										<div className='whitespace-pre-wrap'>
											{toolInvocation.result}
										</div>
									</div>
								) : (
									<div className='text-gray-500'>
										Generating your LinkedIn post...
									</div>
								))}
						</div>
					))}
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<input
					className='fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black'
					value={input}
					placeholder='What would you like to post about?'
					onChange={handleInputChange}
				/>
			</form>
		</div>
	);
}
