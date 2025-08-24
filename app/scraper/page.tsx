'use client';

import { useState } from 'react';
import { fetchApiRoute } from '@/app/api/client';

type ScrapedChunk = {
	id: string;
	content: string;
	metadata: {
		source: string;
		chunkIndex: number;
		totalChunks: number;
		[key: string]: string | number | boolean;
	};
};

export default function ScraperPage() {
	const [url, setUrl] = useState('');
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
			const result = await fetchApiRoute('SCRAPE-URLS', {
				urls: [url],
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
		<div className='min-h-screen'>
			<h1 className='text-2xl font-bold mb-4 border-b border-black pb-2'>
				Web Scraper
			</h1>

			<div className='mb-8 w-full'>
				<table className='w-full border border-black mb-4'>
					<tbody>
						<tr>
							<td className='border border-black p-2 font-bold'>
								URL to Scrape
							</td>
							<td className='border border-black p-2'>
								<input
									id='url'
									type='text'
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									placeholder='https://example.com'
									className='w-full p-1 border border-black'
								/>
							</td>
						</tr>
					</tbody>
				</table>

				<button
					onClick={handleSubmit}
					disabled={isLoading}
					className='border border-black bg-white px-4 py-1 disabled:opacity-50'
				>
					{isLoading ? (
						<span className='animate-pulse'>[Scraping...]</span>
					) : (
						'Scrape URL'
					)}
				</button>
			</div>

			{message && (
				<div className='mb-4 p-2 border border-black'>
					<p className='italic'>{message}</p>
				</div>
			)}

			{chunks.length > 0 && (
				<div>
					<h2 className='text-xl font-bold mb-2 border-b border-black pb-1'>
						Scraped Content Chunks ({chunks.length})
					</h2>
					<div>
						{chunks.map((chunk, index) => (
							<div
								key={index}
								className='mb-4 border border-black p-2'
							>
								<h3 className='font-bold mb-2 border-b border-black pb-1'>
									Chunk {index + 1}
								</h3>
								<p className='whitespace-pre-wrap mb-2 pl-2'>
									{chunk.content}
								</p>
								<table className='w-full border border-black'>
									<tbody>
										<tr>
											<td className='border border-black p-1 font-bold'>
												Source:
											</td>
											<td className='border border-black p-1'>
												{chunk.metadata.source}
											</td>
										</tr>
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
