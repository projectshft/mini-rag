'use client';

import { useState } from 'react';

interface FieldError {
	field: string;
	message: string;
}

export default function IngestPage() {
	const [text, setText] = useState('');
	const [source, setSource] = useState('');
	const [author, setAuthor] = useState('');
	const [date, setDate] = useState('');
	const [category, setCategory] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
	const [successMessage, setSuccessMessage] = useState('');

	const getFieldError = (field: string) =>
		fieldErrors.find((e) => e.field === field)?.message;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFieldErrors([]);
		setSuccessMessage('');
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/ingest/custom', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, source, author, date, category }),
			});

			const data = await response.json();

			if (!response.ok) {
				if (data.errors) {
					setFieldErrors(data.errors);
				} else {
					setFieldErrors([{ field: 'text', message: data.error || 'Unknown error' }]);
				}
				return;
			}

			setSuccessMessage(
				`Ingested ${data.chunksCreated} chunks (${data.vectorsUploaded} vectors) into "${data.index}".`
			);
			setText('');
			setSource('');
			setAuthor('');
			setDate('');
			setCategory('');
		} catch {
			setFieldErrors([{ field: 'text', message: 'Network error — could not reach server.' }]);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen p-8 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold mb-2'>Custom Document Ingest</h1>
			<p className='text-gray-500 mb-8'>
				Paste raw text with metadata. Content is validated for security,
				split into sentence-based chunks, and stored in a separate Pinecone index.
			</p>

			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* Source */}
				<div>
					<label className='block font-medium mb-1'>Source</label>
					<input
						type='text'
						value={source}
						onChange={(e) => setSource(e.target.value)}
						placeholder='e.g. nytimes.com, internal-wiki'
						className='w-full p-2 border rounded'
					/>
					{getFieldError('source') && (
						<p className='text-red-600 text-sm mt-1'>{getFieldError('source')}</p>
					)}
				</div>

				{/* Author */}
				<div>
					<label className='block font-medium mb-1'>Author</label>
					<input
						type='text'
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder='e.g. Jane Doe'
						className='w-full p-2 border rounded'
					/>
					{getFieldError('author') && (
						<p className='text-red-600 text-sm mt-1'>{getFieldError('author')}</p>
					)}
				</div>

				{/* Date */}
				<div>
					<label className='block font-medium mb-1'>Date</label>
					<input
						type='text'
						value={date}
						onChange={(e) => setDate(e.target.value)}
						placeholder='e.g. 2026-04-01'
						className='w-full p-2 border rounded'
					/>
					{getFieldError('date') && (
						<p className='text-red-600 text-sm mt-1'>{getFieldError('date')}</p>
					)}
				</div>

				{/* Category */}
				<div>
					<label className='block font-medium mb-1'>Category</label>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className='w-full p-2 border rounded'
					>
						<option value=''>Select a category</option>
						<option value='tech'>Tech</option>
						<option value='finance'>Finance</option>
						<option value='health'>Health</option>
						<option value='science'>Science</option>
						<option value='other'>Other</option>
					</select>
					{getFieldError('category') && (
						<p className='text-red-600 text-sm mt-1'>{getFieldError('category')}</p>
					)}
				</div>

				{/* Text */}
				<div>
					<label className='block font-medium mb-1'>
						Document Text
						<span className='text-gray-400 text-sm ml-2'>
							({text.length.toLocaleString()} / 50,000 chars)
						</span>
					</label>
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder='Paste your article, blog post, or document text here...'
						className='w-full p-2 border rounded h-48 font-mono text-sm'
					/>
					{getFieldError('text') && (
						<p className='text-red-600 text-sm mt-1'>{getFieldError('text')}</p>
					)}
				</div>

				<button
					type='submit'
					disabled={isSubmitting}
					className='px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400'
				>
					{isSubmitting ? 'Ingesting...' : 'Ingest Document'}
				</button>
			</form>

			{successMessage && (
				<div className='mt-6 p-4 bg-green-50 border border-green-200 rounded'>
					<p className='text-green-800'>{successMessage}</p>
				</div>
			)}
		</div>
	);
}
