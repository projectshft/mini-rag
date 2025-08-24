'use client';

import { useState } from 'react';
import { fetchApiRoute } from '@/app/api/client';

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
		<div className='min-h-screen'>
			<h1 className='text-2xl font-bold mb-4 border-b border-black pb-2'>
				Add Document
			</h1>

			<div className='mb-8 w-full'>
				{/* Content Input */}
				<div className='mb-4'>
					<label
						htmlFor='text-content'
						className='block font-bold mb-1'
					>
						Text Content:
					</label>
					<textarea
						id='text-content'
						value={textContent}
						onChange={(e) => setTextContent(e.target.value)}
						placeholder='Paste your text content here...'
						rows={8}
						className='w-full p-2 border border-black resize-vertical'
					/>
				</div>

				{/* Metadata Fields */}
				<div className='mb-6'>
					<table className='w-full border border-black mb-4'>
						<tbody>
							<tr>
								<td className='border border-black p-2 font-bold'>
									Title *
								</td>
								<td className='border border-black p-2'>
									<input
										id='title'
										type='text'
										value={title}
										onChange={(e) =>
											setTitle(e.target.value)
										}
										placeholder='Enter a title for this content'
										className='w-full p-1 border border-black'
									/>
								</td>
							</tr>
							<tr>
								<td className='border border-black p-2 font-bold'>
									Description
								</td>
								<td className='border border-black p-2'>
									<textarea
										id='description'
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
										placeholder='Optional description or summary'
										rows={3}
										className='w-full p-1 border border-black resize-vertical'
									/>
								</td>
							</tr>
							<tr>
								<td className='border border-black p-2 font-bold'>
									Tags
								</td>
								<td className='border border-black p-2'>
									<input
										id='tags'
										type='text'
										value={tags}
										onChange={(e) =>
											setTags(e.target.value)
										}
										placeholder='Enter tags separated by commas (e.g., javascript, tutorial, web-dev)'
										className='w-full p-1 border border-black'
									/>
								</td>
							</tr>
						</tbody>
					</table>

					{/* Action Buttons */}
					<div className='flex gap-4'>
						<button
							onClick={handleSubmit}
							disabled={isLoading}
							className='border border-black bg-white px-4 py-1 disabled:opacity-50'
						>
							{isLoading ? (
								<span className='animate-pulse'>
									[Processing...]
								</span>
							) : (
								'Add Document'
							)}
						</button>

						<button
							onClick={resetForm}
							disabled={isLoading}
							className='border border-black bg-white px-4 py-1 disabled:opacity-50'
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			{/* Status Message */}
			{message && (
				<div className='mb-4 p-2 border border-black'>
					<p className='italic'>{message}</p>
				</div>
			)}

			{/* Results */}
			{chunks.length > 0 && (
				<div>
					<h2 className='text-xl font-bold mb-2 border-b border-black pb-1'>
						Processed Content Chunks ({chunks.length})
					</h2>
					<div>
						{chunks.map((chunk, index) => (
							<div
								key={index}
								className='mb-4 border border-black p-2'
							>
								<h3 className='font-bold mb-2 border-b border-black pb-1'>
									{chunk.metadata.title} - Chunk {index + 1}
								</h3>
								<p className='whitespace-pre-wrap mb-2 pl-2'>
									{chunk.content}
								</p>
								<table className='w-full border border-black'>
									<tbody>
										<tr>
											<td className='border border-black p-1 font-bold'>
												Source Type:
											</td>
											<td className='border border-black p-1'>
												{chunk.metadata.sourceType}
											</td>
										</tr>
										{chunk.metadata.filename && (
											<tr>
												<td className='border border-black p-1 font-bold'>
													Filename:
												</td>
												<td className='border border-black p-1'>
													{chunk.metadata.filename}
												</td>
											</tr>
										)}
										{chunk.metadata.description && (
											<tr>
												<td className='border border-black p-1 font-bold'>
													Description:
												</td>
												<td className='border border-black p-1'>
													{chunk.metadata.description}
												</td>
											</tr>
										)}
										{chunk.metadata.tags.length > 0 && (
											<tr>
												<td className='border border-black p-1 font-bold'>
													Tags:
												</td>
												<td className='border border-black p-1'>
													{chunk.metadata.tags.join(
														', '
													)}
												</td>
											</tr>
										)}
										<tr>
											<td className='border border-black p-1 font-bold'>
												Chunk Info:
											</td>
											<td className='border border-black p-1'>
												Chunk{' '}
												{chunk.metadata.chunkIndex + 1}{' '}
												of {chunk.metadata.totalChunks}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
