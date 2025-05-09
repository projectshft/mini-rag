'use client';
import { useState } from 'react';
import { fetchApiRoute } from '@/app/libs/api/client';
import { Loader2 } from 'lucide-react';

export default function NewsUploaderPage() {
	const [text, setText] = useState('');
	const [url, setUrl] = useState('');
	const [topic, setTopic] = useState('');
	const [message, setMessage] = useState('');
	const [bias, setBias] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const clearForm = () => {
		setText('');
		setUrl('');
		setTopic('');
		setBias('');
	};

	const handleSubmit = async () => {
		if (!text.trim()) {
			setMessage('Text is required.');
			return;
		}

		setIsLoading(true);
		try {
			const result = await fetchApiRoute('UPLOAD-NEWS', {
				text,
				url,
				topic,
				bias,
			});
			setMessage(result.message);
			clearForm();
		} catch (error) {
			console.error(error);
			setMessage('An error occurred while uploading the news.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-3xl font-semibold mb-4 text-gray-300'>
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
					disabled={isLoading}
				/>
				<input
					className='w-full border p-2 mb-2'
					placeholder='Source URL (optional)'
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					disabled={isLoading}
				/>
				<input
					className='w-full border p-2 mb-4'
					placeholder='Topic label (optional)'
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					disabled={isLoading}
				/>
				<select
					className='w-full border p-2 mb-4'
					value={bias}
					onChange={(e) => setBias(e.target.value)}
					disabled={isLoading}
				>
					<option value=''>Select bias (optional)</option>
					<option value='liberal'>Liberal</option>
					<option value='conservative'>Conservative</option>
				</select>
				<button
					className='bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50'
					onClick={handleSubmit}
					disabled={isLoading}
				>
					{isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
					{isLoading ? 'Uploading...' : 'Upload & Vectorize'}
				</button>
				{message && <p className='mt-4 text-green-700'>{message}</p>}
			</div>
		</div>
	);
}
