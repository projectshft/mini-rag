'use client';

import { useState, useRef } from 'react';
import { Message } from 'ai/react';
import { useChat } from '@ai-sdk/react';
import { Mic, MicOff, Bot, User, Sparkles } from 'lucide-react';
import { MarkdownWithIcons } from './components/MarkdownWithIcons';
import { handleAgentSelection } from './utils/chat';

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

	const { append, messages, status } = useChat({
		api: '/api/stream-chat',
	});

	const handleExamplePostClick = async (content: string) => {
		setInputText(content);
		setIsLoading(true);
		try {
			await handleAgentSelection(content, append, () => {
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
			await handleAgentSelection(audioBlob, append, () => {
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
			await handleAgentSelection(inputText, append, () => {
				setInputText('');
			});
		} catch (error) {
			console.error('Error sending text:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const isSubmitting = status === 'submitted' || isLoading;

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
				{messages?.map((m: Message) => (
					<div
						key={m.id}
						className={`flex ${
							m.role === 'assistant'
								? 'flex-row'
								: 'flex-row-reverse'
						} items-start gap-2 w-full`}
					>
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${
								m.role === 'assistant'
									? 'bg-blue-500 text-white'
									: 'bg-gray-700 text-white'
							}`}
						>
							{m.role === 'assistant' ? (
								<Bot className='w-6 h-6' />
							) : (
								<User className='w-6 h-6' />
							)}
						</div>

						<div
							className={`flex flex-col gap-1 max-w-[80%] ${
								m.role === 'assistant'
									? 'bg-[#63a4ff] text-white rounded-2xl shadow-lg'
									: 'bg-[#1f1f1f] text-gray-200 rounded-2xl'
							} p-4`}
						>
							<div className='whitespace-pre-wrap text-lg'>
								<MarkdownWithIcons content={m.content} />
							</div>
						</div>
					</div>
				))}
				{isSubmitting && (
					<div className='flex flex-row items-start gap-2 w-full'>
						<div className='w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white'>
							<Bot className='w-6 h-6' />
						</div>
						<div className='flex flex-col gap-1 max-w-[80%] bg-[#63a4ff] text-white rounded-2xl shadow-lg p-4'>
							<div className='flex items-center gap-3'>
								<div className='relative w-5 h-5'>
									<div className='absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin'></div>
								</div>
								<span className='text-white'>
									Generating response...
								</span>
							</div>
						</div>
					</div>
				)}
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
