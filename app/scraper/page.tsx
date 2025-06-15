'use client';

import { useState } from 'react';
import { fetchApiRoute } from '@/app/api/client';
import { Loader2 } from 'lucide-react';

// Define a type that matches the API response structure
interface ScrapedChunk {
	id: string;
	content: string;
	metadata: {
		source: string;
		chunkIndex: number;
		totalChunks: number;
		[key: string]: string | number | boolean;
	};
}

export default function ScraperPage() {
	const [url, setUrl] = useState('');
	const [useHeadless, setUseHeadless] = useState(false);
	const [message, setMessage] = useState('');
	const [chunks, setChunks] = useState<ScrapedChunk[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!url.trim()) {
			setMessage('URL is required.');
			return;
		}

		setIsLoading(true);
		setChunks([]);
		setMessage('');

		try {
			const result = await fetchApiRoute('SCRAPE-URL', {
				url,
				useHeadless,
			});

			setMessage(result.message);
			setChunks(result.chunks as ScrapedChunk[]);
		} catch (error) {
			console.error(error);
			setMessage('An error occurred while scraping the URL.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-black text-white p-8'>
			<h1 className='text-3xl font-bold mb-6'>Web Scraper</h1>

			<div className='mb-8 max-w-2xl'>
				<div className='mb-4'>
					<label htmlFor='url' className='block text-gray-300 mb-2'>
						URL to Scrape
					</label>
					<input
						id='url'
						type='text'
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder='https://example.com'
						className='w-full p-3 bg-gray-800 rounded-lg text-white'
					/>
				</div>

				<div className='mb-4 flex items-center'>
					<input
						id='useHeadless'
						type='checkbox'
						checked={useHeadless}
						onChange={(e) => setUseHeadless(e.target.checked)}
						className='mr-2'
					/>
					<label htmlFor='useHeadless' className='text-gray-300'>
						Use headless browser (for JavaScript-heavy sites)
					</label>
				</div>

				<button
					onClick={handleSubmit}
					disabled={isLoading}
					className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center'
				>
					{isLoading && (
						<Loader2 className='h-4 w-4 animate-spin mr-2' />
					)}
					{isLoading ? 'Scraping...' : 'Scrape URL'}
				</button>
			</div>

			{message && (
				<div className='mb-4 p-4 bg-gray-800 rounded-lg'>
					<p className='text-gray-300'>{message}</p>
				</div>
			)}

			{chunks.length > 0 && (
				<div>
					<h2 className='text-xl font-semibold mb-2'>
						Scraped Content Chunks ({chunks.length})
					</h2>
					<div className='space-y-4'>
						{chunks.map((chunk, index) => (
							<div
								key={index}
								className='p-4 bg-gray-800 rounded-lg'
							>
								<h3 className='font-medium mb-1'>
									Chunk {index + 1}
								</h3>
								<p className='text-gray-300 whitespace-pre-wrap'>
									{chunk.content}
								</p>
								<div className='mt-2 text-sm text-gray-400'>
									<p>Source: {chunk.metadata.source}</p>
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
