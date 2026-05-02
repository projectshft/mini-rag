'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
}

export default function ToolAgentPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: uuidv4(),
			role: 'user',
			content: input,
		};

		const newMessages = [...messages, userMessage];
		setMessages(newMessages);
		setInput('');
		setIsLoading(true);

		try {
			const response = await fetch('/api/tool-agent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: newMessages.map((m) => ({
						role: m.role,
						content: m.content,
					})),
				}),
			});

			if (!response.ok) throw new Error('Failed to fetch');

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();

			const assistantMessage: Message = {
				id: uuidv4(),
				role: 'assistant',
				content: '',
			};

			setMessages((prev) => [...prev, assistantMessage]);

			if (reader) {
				let fullContent = '';
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					fullContent += chunk;
					console.log('Chunk received:', chunk);

					const currentContent = fullContent;
					setMessages((prev) =>
						prev.map((m) =>
							m.id === assistantMessage.id
								? { ...m, content: currentContent }
								: m,
						),
					);
				}
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen p-8" style={{ backgroundColor: '#111827', color: 'white' }}>
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2">Tool-Calling Agent</h1>
				<p className="mb-2" style={{ color: '#9ca3af' }}>
					AI uses tools to search the knowledge base (check terminal for tool calls)
				</p>
				<p className="mb-8 text-sm" style={{ color: '#6b7280' }}>
					Try: &quot;Write me a LinkedIn post about AI&quot; or &quot;What does research say about transformers?&quot;
				</p>

				<div
					className="rounded-lg p-4 mb-4 overflow-y-auto"
					style={{ backgroundColor: '#1f2937', height: '500px' }}
				>
					{messages.length === 0 && (
						<div className="text-center py-12" style={{ color: '#6b7280' }}>
							<p className="text-lg mb-2">Ask me anything about AI, coding, or careers</p>
							<p className="text-sm">I&apos;ll search the knowledge base using tools</p>
						</div>
					)}

					{messages.map((message) => (
						<div key={message.id} className="mb-6">
							<div
								className="text-sm font-semibold mb-2"
								style={{ color: message.role === 'user' ? '#60a5fa' : '#34d399' }}
							>
								{message.role === 'user' ? '👤 You' : '🤖 Assistant'}
							</div>
							<div className="whitespace-pre-wrap" style={{ color: '#f3f4f6' }}>
								{message.content}
							</div>
						</div>
					))}

					{isLoading && !messages[messages.length - 1]?.content && (
						<div className="flex items-center gap-2" style={{ color: '#9ca3af' }}>
							<div
								className="animate-spin h-4 w-4 rounded-full"
								style={{ border: '2px solid #9ca3af', borderTopColor: 'transparent' }}
							/>
							<span>Searching knowledge base...</span>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				<form onSubmit={handleSubmit} className="flex gap-2">
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask about AI, coding careers, or request a LinkedIn post..."
						className="flex-1 rounded-lg px-4 py-3 focus:outline-none"
						style={{
							backgroundColor: '#1f2937',
							color: 'white',
							border: '1px solid #374151',
						}}
						disabled={isLoading}
					/>
					<button
						type="submit"
						disabled={isLoading || !input.trim()}
						className="px-6 py-3 rounded-lg font-semibold"
						style={{
							backgroundColor: isLoading || !input.trim() ? '#4b5563' : '#2563eb',
						}}
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}
