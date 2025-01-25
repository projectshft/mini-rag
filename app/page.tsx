'use client';
import { useState } from 'react';

export default function Home() {
	const [search, setSearch] = useState<string>('');
	const [response, setResponse] = useState<{
		post: string;
		title: string;
		hashtags: string[];
	} | null>(null);

	const handleSearch = async () => {
		const response = await fetch('/api/search', {
			method: 'POST',
			body: JSON.stringify({ search }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json();

		setResponse(data.response);
	};

	return (
		<div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
			<main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
				{response?.post && (
					<div className='flex flex-col gap-4 items-center'>
						<h2 className='text-2xl font-bold'>{response.title}</h2>
						<p>{response.post}</p>
						<div className='flex gap-2'>
							{response.hashtags.map((hashtag: string) => (
								<span
									key={hashtag}
									className='rounded bg-blue-300 text-white p-1'
								>
									{hashtag}
								</span>
							))}
						</div>
					</div>
				)}
				<input
					className='rounded border bg-white text-black'
					onChange={(e) => setSearch(e.target.value)}
					type='text'
				/>
				<button onClick={handleSearch} className='rounded bg-blue-300'>
					Search
				</button>
			</main>
		</div>
	);
}
