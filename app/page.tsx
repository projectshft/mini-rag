'use client';

import { useState, useRef } from 'react';
import { Message } from 'ai/react';

export default function Chat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [inputText, setInputText] = useState('');
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

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
		const formData = new FormData();
		formData.append('audio', audioBlob);

		try {
			const response = await fetch('/api/audio-chat', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Failed to send audio message');
			}

			const data = await response.json();

			// Set the transcribed text in the input
			setInputText(data.transcription || '🎤 Audio message sent');

			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					role: 'user',
					content: data.transcription || '🎤 Audio message sent',
				},
				{
					id: (Date.now() + 1).toString(),
					role: 'assistant',
					content: data.response,
				},
			]);
		} catch (error) {
			console.error('Error sending audio:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const sendTextMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim()) return;

		setIsLoading(true);
		try {
			const response = await fetch('/api/audio-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text: inputText }),
			});

			if (!response.ok) {
				throw new Error('Failed to send text message');
			}

			const data = await response.json();

			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					role: 'user',
					content: inputText,
				},
				{
					id: (Date.now() + 1).toString(),
					role: 'assistant',
					content: data.response,
				},
			]);

			setInputText('');
		} catch (error) {
			console.error('Error sending text:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex flex-col w-full max-w-xl py-24 mx-auto stretch gap-4 px-4'>
			<h1 className='text-3xl text-center font-bold text-gray-400'>
				Brian Clone
			</h1>

			<div className='flex-1 overflow-y-auto space-y-4'>
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
									: 'bg-gray-200 text-gray-600'
							}`}
						>
							{m.role === 'assistant' ? '🤖' : '👤'}
						</div>

						<div
							className={`flex flex-col gap-1 max-w-[80%] text-gray-800 ${
								m.role === 'assistant'
									? 'bg-blue-100 rounded-tr-xl rounded-br-xl rounded-bl-xl'
									: 'bg-gray-100 rounded-tl-xl rounded-bl-xl rounded-br-xl'
							} p-4`}
						>
							<p className='whitespace-pre-wrap'>{m.content}</p>
							{m.toolInvocations?.map((toolInvocation) => (
								<div
									key={toolInvocation.toolCallId}
									className='bg-white/50 rounded-lg p-4 mt-2 text-gray-800'
								>
									{toolInvocation.toolName === 'createPost' &&
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
					</div>
				))}
			</div>

			<div className='fixed bottom-0 left-0 right-0 flex justify-center items-center gap-4 p-4 bg-white/80 backdrop-blur-sm'>
				<form
					onSubmit={sendTextMessage}
					className='flex-1 max-w-xl mx-4'
				>
					<input
						type='text'
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder='Type your message...'
						className='w-full p-4 border border-gray-300 rounded-full shadow-xl text-black'
						disabled={isRecording || isLoading}
					/>
				</form>

				<button
					onClick={isRecording ? stopRecording : startRecording}
					disabled={isLoading}
					className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
						isRecording
							? 'bg-red-500 animate-pulse'
							: isLoading
							? 'bg-gray-400'
							: 'bg-blue-500 hover:bg-blue-600'
					} text-white disabled:opacity-50`}
				>
					{isLoading ? (
						<div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
					) : isRecording ? (
						<span className='text-2xl'>⏹️</span>
					) : (
						<span className='text-2xl'>🎤</span>
					)}
				</button>
			</div>
		</div>
	);
}
