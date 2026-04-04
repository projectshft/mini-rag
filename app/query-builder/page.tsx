'use client';

import { useState } from 'react';

interface Product {
	id: number;
	name: string;
	category: string;
	price: number;
	stockCount: number;
	description: string;
	avgRating: number;
	reviewCount: number;
	reviews: { rating: number; reviewText: string; createdAt: string }[];
}

interface QueryResult {
	success: boolean;
	count: number;
	filters: Record<string, unknown>;
	prismaWhere: Record<string, unknown>;
	products: Product[];
}

export default function QueryBuilderPage() {
	const [category, setCategory] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [minRating, setMinRating] = useState('');
	const [inStock, setInStock] = useState(false);
	const [orderBy, setOrderBy] = useState('');
	const [limit, setLimit] = useState('10');

	const [result, setResult] = useState<QueryResult | null>(null);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setResult(null);
		setIsLoading(true);

		try {
			const filters: Record<string, unknown> = {};
			if (category) filters.category = category;
			if (minPrice) filters.minPrice = parseFloat(minPrice);
			if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
			if (minRating) filters.minRating = parseFloat(minRating);
			if (inStock) filters.inStock = true;

			const body: Record<string, unknown> = { filters };
			if (orderBy) body.orderBy = orderBy;
			if (limit) body.limit = parseInt(limit, 10);

			const response = await fetch('/api/agent/prisma-query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			const data = await response.json();
			if (!response.ok) {
				setError(data.error || 'Query failed');
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
		<div className='min-h-screen p-8 max-w-5xl mx-auto'>
			<h1 className='text-3xl font-bold mb-2'>Structured Query Builder</h1>
			<p className='text-gray-500 mb-6'>
				Build type-safe Prisma queries — no raw SQL, no string interpolation.
			</p>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{/* ── Filters ─────────────────────────────────── */}
				<form onSubmit={handleSubmit} className='space-y-4 md:col-span-1'>
					<div>
						<label className='block font-medium mb-1'>Category</label>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className='w-full p-2 border rounded'
						>
							<option value=''>All</option>
							<option value='electronics'>Electronics</option>
							<option value='books'>Books</option>
							<option value='home-office'>Home Office</option>
							<option value='fitness'>Fitness</option>
						</select>
					</div>

					<div className='grid grid-cols-2 gap-2'>
						<div>
							<label className='block font-medium mb-1'>Min Price</label>
							<input
								type='number'
								value={minPrice}
								onChange={(e) => setMinPrice(e.target.value)}
								placeholder='0'
								className='w-full p-2 border rounded'
							/>
						</div>
						<div>
							<label className='block font-medium mb-1'>Max Price</label>
							<input
								type='number'
								value={maxPrice}
								onChange={(e) => setMaxPrice(e.target.value)}
								placeholder='999'
								className='w-full p-2 border rounded'
							/>
						</div>
					</div>

					<div>
						<label className='block font-medium mb-1'>Min Avg Rating</label>
						<select
							value={minRating}
							onChange={(e) => setMinRating(e.target.value)}
							className='w-full p-2 border rounded'
						>
							<option value=''>Any</option>
							<option value='2'>2+</option>
							<option value='3'>3+</option>
							<option value='4'>4+</option>
						</select>
					</div>

					<div className='flex items-center gap-2'>
						<input
							type='checkbox'
							id='inStock'
							checked={inStock}
							onChange={(e) => setInStock(e.target.checked)}
						/>
						<label htmlFor='inStock' className='font-medium'>
							In stock only
						</label>
					</div>

					<div>
						<label className='block font-medium mb-1'>Order By</label>
						<select
							value={orderBy}
							onChange={(e) => setOrderBy(e.target.value)}
							className='w-full p-2 border rounded'
						>
							<option value=''>Default</option>
							<option value='price_asc'>Price (low to high)</option>
							<option value='price_desc'>Price (high to low)</option>
							<option value='rating_desc'>Rating (high to low)</option>
						</select>
					</div>

					<div>
						<label className='block font-medium mb-1'>Limit</label>
						<input
							type='number'
							value={limit}
							onChange={(e) => setLimit(e.target.value)}
							min={1}
							max={50}
							className='w-full p-2 border rounded'
						/>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400'
					>
						{isLoading ? 'Querying...' : 'Run Query'}
					</button>
				</form>

				{/* ── Results ─────────────────────────────────── */}
				<div className='md:col-span-2'>
					{error && (
						<p className='text-red-600 mb-4'>{error}</p>
					)}

					{result && (
						<>
							{/* Generated Prisma where clause */}
							<div className='mb-4 p-3 bg-gray-100 rounded font-mono text-xs'>
								<p className='font-bold mb-1 text-gray-600'>
									Prisma where clause:
								</p>
								<pre className='whitespace-pre-wrap'>
									{JSON.stringify(result.prismaWhere, null, 2)}
								</pre>
							</div>

							<p className='mb-4 text-sm text-gray-500'>
								{result.count} product{result.count !== 1 ? 's' : ''} found
							</p>

							<div className='space-y-4'>
								{result.products.map((product) => (
									<div
										key={product.id}
										className='p-4 border rounded'
									>
										<div className='flex justify-between items-start mb-2'>
											<div>
												<h3 className='font-bold text-lg'>
													{product.name}
												</h3>
												<span className='text-sm text-gray-500'>
													{product.category}
												</span>
											</div>
											<span className='text-xl font-semibold'>
												${product.price.toFixed(2)}
											</span>
										</div>
										<p className='text-sm text-gray-600 mb-2'>
											{product.description}
										</p>
										<div className='flex gap-4 text-sm'>
											<span>
												{product.avgRating.toFixed(1)} avg rating
												({product.reviewCount} reviews)
											</span>
											<span
												className={
													product.stockCount > 0
														? 'text-green-600'
														: 'text-red-600'
												}
											>
												{product.stockCount > 0
													? `${product.stockCount} in stock`
													: 'Out of stock'}
											</span>
										</div>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
