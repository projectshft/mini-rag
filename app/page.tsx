'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';
import { handleAgentSelection } from './utils/chat';
import { DefaultChatTransport } from 'ai';
import { UserMessage } from './components/UserMessage';
import { AgentMessage } from './components/AgentMessage';
import { LoadingMessage } from './components/LoadingMessage';

const examplePosts = [
	'Write a LinkedIn post about learning JavaScript',
	'Create a post about nailing technical interviews',
	'What are the best practices for building a web application?',
	'Why are enums in TypeScript useful?',
];

export default function Chat() {
	const [isRecording, setIsRecording] = useState(false);
	const [inputText, setInputText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { messages, sendMessage } = useChat({
		transport: new DefaultChatTransport({
			api: 'api/stream-chat',
		}),
	});

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleExamplePostClick = async (content: string) => {
		setInputText(content);
		setIsLoading(true);
		try {
			await handleAgentSelection(content, sendMessage, () => {
				setInputText('');
			});
		} finally {
			setIsLoading(false);
		}
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: 'audio/webm',
				});
				await sendAudioMessage(audioBlob);
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
			setIsRecording(false);
		}
	};

	const sendAudioMessage = async (audioBlob: Blob) => {
		setIsLoading(true);
		try {
			await handleAgentSelection(audioBlob, sendMessage, () => {
				setInputText('');
			});
		} catch (error) {
			console.error('Error sending audio:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleTextSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim()) return;

		setIsLoading(true);
		try {
			await handleAgentSelection(inputText, sendMessage, () => {
				setInputText('');
			});
		} catch (error) {
			console.error('Error sending text:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const isSubmitting = isLoading;

	console.log('messages', JSON.stringify(messages, null, 2));

	return (
		<div className='min-h-screen'>
			{!messages?.length && (
				<div className='mb-8'>
					<h2 className='text-xl font-bold mb-2 border-b border-black'>
						Example Prompts:
					</h2>
					<table className='w-full border border-black'>
						<tbody>
							{examplePosts.map((post, index) => (
								<tr key={index}>
									<td className='p-2 border-b border-black'>
										<a
											href='#'
											onClick={(e) => {
												e.preventDefault();
												handleExamplePostClick(post);
											}}
											className='underline text-blue-800'
										>
											{post}
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<div className='w-full mb-20'>
				{messages?.length > 0 && (
					<h2 className='text-xl font-bold mb-2 border-b border-black'>
						Conversation:
					</h2>
				)}
				{messages?.map((message: UIMessage) =>
					message.role === 'assistant' ? (
						<AgentMessage key={message.id} message={message} />
					) : (
						<UserMessage key={message.id} message={message} />
					)
				)}
				{isSubmitting && <LoadingMessage />}
				<div ref={messagesEndRef} />
			</div>

			<div className='fixed bottom-0 left-0 right-0 bg-white border-t border-black p-4'>
				<div className='max-w-3xl mx-auto'>
					<form onSubmit={handleTextSubmit} className='flex gap-2'>
						<input
							type='text'
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder='Type your message...'
							className='flex-1 border border-black p-2'
							disabled={isRecording || isSubmitting}
						/>
						<button
							type='submit'
							className='border border-black bg-white px-4 py-2'
							disabled={
								isRecording || isSubmitting || !inputText.trim()
							}
						>
							Send
						</button>
						<button
							type='button'
							onClick={
								isRecording ? stopRecording : startRecording
							}
							className={`border border-black bg-white px-4 py-2 ${
								isRecording ? 'font-bold' : ''
							}`}
							disabled={isSubmitting}
						>
							{isRecording ? 'Stop' : 'Record'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
