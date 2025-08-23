'use client';

import { useState } from 'react';
import { fetchApiRoute } from '@/app/api/client';
import { Loader2 } from 'lucide-react';

type UploadedChunk = {
	id: string;
	content: string;
	metadata: {
		title: string;
		description: string;
		tags: string[];
		sourceType: 'text';
		filename?: string;
		chunkIndex: number;
		totalChunks: number;
	};
};

export default function UploadPage() {
	const [textContent, setTextContent] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [tags, setTags] = useState('');
	const [message, setMessage] = useState('');
	const [chunks, setChunks] = useState<UploadedChunk[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!title.trim()) {
			setMessage('Title is required.');
			return;
		}

		if (!textContent.trim()) {
			setMessage('Please enter text content.');
			return;
		}

		setIsLoading(true);
		setChunks([]);
		setMessage('');

		try {
			const metadata = {
				title: title.trim(),
				description: description.trim(),
				tags: tags
					.split(',')
					.map((tag) => tag.trim())
					.filter(Boolean),
				sourceType: 'text' as const,
			};

			// Handle text upload
			const result = await fetchApiRoute('UPLOAD-TEXT', {
				content: textContent,
				metadata,
			});

			setMessage(result.message);
			setChunks(result.chunks as UploadedChunk[]);
		} catch (error) {
			console.error(error);
			setMessage('An error occurred while processing your upload.');
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setTextContent('');
		setTitle('');
		setDescription('');
		setTags('');
		setMessage('');
		setChunks([]);
	};

	return (
		<div className='min-h-screen bg-black text-white flex flex-col items-center justify-center p-8'>
			<h1 className='text-3xl font-bold mb-6'>Add Document</h1>

			<div className='mb-8 max-w-2xl w-full'>
				{/* Content Input */}
				<div className='mb-4'>
					<label
						htmlFor='text-content'
						className='block text-gray-300 mb-2'
					>
						Text Content
					</label>
					<textarea
						id='text-content'
						value={textContent}
						onChange={(e) => setTextContent(e.target.value)}
						placeholder='Paste your text content here...'
						rows={8}
						className='w-full p-3 bg-gray-800 rounded-lg text-white resize-vertical'
					/>
				</div>

				{/* Metadata Fields */}
				<div className='space-y-4 mb-6'>
					<div>
						<label
							htmlFor='title'
							className='block text-gray-300 mb-2'
						>
							Title *
						</label>
						<input
							id='title'
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Enter a title for this content'
							className='w-full p-3 bg-gray-800 rounded-lg text-white'
						/>
					</div>

					<div>
						<label
							htmlFor='description'
							className='block text-gray-300 mb-2'
						>
							Description
						</label>
						<textarea
							id='description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder='Optional description or summary'
							rows={3}
							className='w-full p-3 bg-gray-800 rounded-lg text-white resize-vertical'
						/>
					</div>

					<div>
						<label
							htmlFor='tags'
							className='block text-gray-300 mb-2'
						>
							Tags
						</label>
						<input
							id='tags'
							type='text'
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder='Enter tags separated by commas (e.g., javascript, tutorial, web-dev)'
							className='w-full p-3 bg-gray-800 rounded-lg text-white'
						/>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex gap-4'>
					<button
						onClick={handleSubmit}
						disabled={isLoading}
						className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50'
					>
						{isLoading && (
							<Loader2 className='h-4 w-4 animate-spin mr-2' />
						)}
						{isLoading ? 'Processing...' : 'Add Document'}
					</button>

					<button
						onClick={resetForm}
						disabled={isLoading}
						className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg disabled:opacity-50'
					>
						Reset
					</button>
				</div>
			</div>

			{/* Status Message */}
			{message && (
				<div
					className={`mb-4 p-4 rounded-lg ${
						message.includes('error') ||
						message.includes('required')
							? 'bg-red-900/50 border border-red-700'
							: 'bg-gray-800'
					}`}
				>
					<p className='text-gray-300'>{message}</p>
				</div>
			)}

			{/* Results */}
			{chunks.length > 0 && (
				<div>
					<h2 className='text-xl font-semibold mb-2'>
						Processed Content Chunks ({chunks.length})
					</h2>
					<div className='space-y-4'>
						{chunks.map((chunk, index) => (
							<div
								key={index}
								className='p-4 bg-gray-800 rounded-lg'
							>
								<h3 className='font-medium mb-2'>
									{chunk.metadata.title} - Chunk {index + 1}
								</h3>
								<p className='text-gray-300 whitespace-pre-wrap mb-2'>
									{chunk.content}
								</p>
								<div className='text-sm text-gray-400 space-y-1'>
									<p>
										Source Type: {chunk.metadata.sourceType}
									</p>
									{chunk.metadata.filename && (
										<p>
											Filename: {chunk.metadata.filename}
										</p>
									)}
									{chunk.metadata.description && (
										<p>
											Description:{' '}
											{chunk.metadata.description}
										</p>
									)}
									{chunk.metadata.tags.length > 0 && (
										<p>
											Tags:{' '}
											{chunk.metadata.tags.join(', ')}
										</p>
									)}
									<p>
										Chunk {chunk.metadata.chunkIndex + 1} of{' '}
										{chunk.metadata.totalChunks}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
