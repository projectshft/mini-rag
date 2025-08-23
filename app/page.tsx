'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';
import { Mic, MicOff, Sparkles } from 'lucide-react';
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
		<div className='min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12'>
			<h1 className='text-3xl font-bold text-center text-gray-300 mb-6'>
				Knowledge Base AI
			</h1>

			{!messages?.length && (
				<div className='w-full max-w-4xl mb-8'>
					<h2 className='text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2'>
						<Sparkles className='w-5 h-5 text-blue-400' />
						Example Prompts
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{examplePosts.map((post, index) => (
							<button
								key={index}
								onClick={() => handleExamplePostClick(post)}
								className='p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-left'
							>
								<p className='text-gray-200'>{post}</p>
							</button>
						))}
					</div>
				</div>
			)}

			<div className='flex-1 w-full max-w-xl overflow-y-auto space-y-4 mb-20'>
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

			<div className='fixed bottom-0 left-0 right-0 flex justify-center items-center gap-4 p-4 bg-black/80 backdrop-blur-md border-t border-white/10'>
				<form
					onSubmit={handleTextSubmit}
					className='flex-1 max-w-xl mx-4'
				>
					<input
						type='text'
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder='Type your message...'
						className='w-full p-4 rounded-xl shadow-lg bg-gray-800 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-700 transition-colors'
						disabled={isRecording || isSubmitting}
					/>
				</form>

				<button
					onClick={isRecording ? stopRecording : startRecording}
					className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
						isRecording
							? 'bg-red-500/90 hover:bg-red-500 text-white'
							: 'bg-gray-800 hover:bg-gray-700 text-gray-200'
					} shadow-lg disabled:opacity-50 backdrop-blur-sm`}
					disabled={isSubmitting}
				>
					{isRecording ? (
						<MicOff className='w-5 h-5' />
					) : (
						<Mic className='w-5 h-5' />
					)}
				</button>
			</div>
		</div>
	);
}
