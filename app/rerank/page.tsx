'use client';

import { useState } from 'react';

interface PreRerankResult {
	rank: number;
	id: string;
	similarity_score: number;
	content: string;
	source: string;
}

interface PostRerankResult {
	rank: number;
	id: string;
	rerank_score: number;
	reason: string;
	original_similarity: number;
	content: string;
	source: string;
}

interface RerankResponse {
	query: string;
	pre_rerank_top5: PreRerankResult[];
	post_rerank_top5: PostRerankResult[];
	rerank_scores: { chunk_index: number; score: number; reason: string }[];
}

export default function RerankPage() {
	const [query, setQuery] = useState('');
	const [result, setResult] = useState<RerankResponse | null>(null);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim()) return;

		setError('');
		setResult(null);
		setIsLoading(true);

		try {
			const response = await fetch('/api/search/rerank', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query }),
			});

			const data = await response.json();
			if (!response.ok) {
				setError(data.error || 'Reranking failed');
				return;
			}

			setResult(data);
		} catch {
			setError('Network error — could not reach server.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen p-8 max-w-6xl mx-auto'>
			<h1 className='text-3xl font-bold mb-2'>Reranking Pipeline</h1>
			<p className='text-gray-500 mb-6'>
				See how LLM reranking reshuffles vector search results. Compare
				pre-rerank (similarity only) vs. post-rerank (LLM-scored relevance)
				side by side.
			</p>

			<form onSubmit={handleSubmit} className='flex gap-2 mb-8'>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Enter a search query...'
					className='flex-1 p-2 border rounded'
					disabled={isLoading}
				/>
				<button
					type='submit'
					disabled={isLoading || !query.trim()}
					className='px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400'
				>
					{isLoading ? 'Searching & Reranking...' : 'Search'}
				</button>
			</form>

			{error && <p className='text-red-600 mb-4'>{error}</p>}

			{result && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* ── Pre-rerank ────────────────────────────── */}
					<div>
						<h2 className='text-xl font-semibold mb-3'>
							Before Reranking
							<span className='text-sm font-normal text-gray-500 ml-2'>
								(vector similarity only)
							</span>
						</h2>
						<div className='space-y-3'>
							{result.pre_rerank_top5.map((item) => (
								<div
									key={item.id}
									className='p-3 border rounded bg-gray-50'
								>
									<div className='flex justify-between mb-1'>
										<span className='font-medium'>
											#{item.rank}
										</span>
										<span className='text-sm text-gray-500'>
											sim: {item.similarity_score.toFixed(4)}
										</span>
									</div>
									<p className='text-sm text-gray-700 mb-1'>
										{item.content}
									</p>
									<p className='text-xs text-gray-400'>
										{item.source}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* ── Post-rerank ───────────────────────────── */}
					<div>
						<h2 className='text-xl font-semibold mb-3'>
							After Reranking
							<span className='text-sm font-normal text-gray-500 ml-2'>
								(LLM-scored relevance)
							</span>
						</h2>
						<div className='space-y-3'>
							{result.post_rerank_top5.map((item) => (
								<div
									key={item.id}
									className='p-3 border rounded bg-blue-50'
								>
									<div className='flex justify-between mb-1'>
										<span className='font-medium'>
											#{item.rank}
										</span>
										<span className='text-sm'>
											<span className='text-blue-600 font-medium'>
												rerank: {item.rerank_score}/10
											</span>
											<span className='text-gray-400 ml-2'>
												sim: {item.original_similarity.toFixed(4)}
											</span>
										</span>
									</div>
									<p className='text-sm text-gray-700 mb-1'>
										{item.content}
									</p>
									<p className='text-xs text-blue-600 italic mb-1'>
										{item.reason}
									</p>
									<p className='text-xs text-gray-400'>
										{item.source}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{result && result.rerank_scores.length > 0 && (
				<div className='mt-8'>
					<h2 className='text-xl font-semibold mb-3'>
						Full Rerank Scores (all {result.rerank_scores.length} chunks)
					</h2>
					<div className='overflow-x-auto'>
						<table className='w-full text-sm border-collapse'>
							<thead>
								<tr className='border-b'>
									<th className='text-left p-2'>Chunk</th>
									<th className='text-left p-2'>Score</th>
									<th className='text-left p-2'>Reason</th>
								</tr>
							</thead>
							<tbody>
								{result.rerank_scores.map((score) => (
									<tr
										key={score.chunk_index}
										className='border-b'
									>
										<td className='p-2'>
											#{score.chunk_index}
										</td>
										<td className='p-2 font-mono'>
											{score.score}/10
										</td>
										<td className='p-2 text-gray-600'>
											{score.reason}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
