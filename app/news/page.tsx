'use client';
import { useState } from 'react';
import { fetchApiRoute } from '@/app/libs/api/client';

export default function NewsUploaderPage() {
	const [text, setText] = useState('');
	const [url, setUrl] = useState('');
	const [topic, setTopic] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async () => {
		if (!text.trim()) {
			setMessage('Text is required.');
			return;
		}

		try {
			const result = await fetchApiRoute('/api/upload-news', {
				text,
				url,
				topic,
			});
			setMessage(result.message);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-2xl font-semibold mb-4 text-gray-400'>
				Upload News and Posts
			</h1>
			<div className='bg-white p-6 rounded shadow max-w-2xl mx-auto mt-20'>
				<h2 className='text-xl font-semibold mb-4'>
					Submit an Article
				</h2>
				<textarea
					className='w-full h-40 border p-2 mb-4'
					placeholder='Paste article HTML or plain text here...'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<input
					className='w-full border p-2 mb-2'
					placeholder='Source URL (optional)'
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				<input
					className='w-full border p-2 mb-4'
					placeholder='Topic label (optional)'
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
				/>
				<button
					className='bg-blue-600 text-white px-4 py-2 rounded'
					onClick={handleSubmit}
				>
					Upload & Vectorize
				</button>
				{message && <p className='mt-4 text-green-700'>{message}</p>}
			</div>
		</div>
	);
}
