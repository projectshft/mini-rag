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

/**
 * TODO: Build the Query Builder UI
 *
 * This page should have:
 *
 * LEFT COLUMN — Filter form with:
 *   - Category (select): All, electronics, books, home-office, fitness
 *   - Min Price / Max Price (number inputs, side by side)
 *   - Min Avg Rating (select): Any, 2+, 3+, 4+
 *   - In Stock Only (checkbox)
 *   - Order By (select): Default, price asc, price desc, rating desc
 *   - Limit (number input, 1-50)
 *   - "Run Query" button
 *
 * RIGHT COLUMN — Results:
 *   1. Show the generated Prisma `where` clause as formatted JSON
 *      (the API returns it in `prismaWhere`). This helps students see
 *      how their filter selections map to a Prisma query.
 *   2. Show the count of matching products
 *   3. Show each product as a card with: name, category, price,
 *      description, average rating, review count, stock status
 *
 * API call:
 *   POST /api/agent/prisma-query with body:
 *   {
 *     filters: { category?, minPrice?, maxPrice?, minRating?, inStock? },
 *     orderBy?: "price_asc" | "price_desc" | "rating_desc",
 *     limit?: number
 *   }
 *
 * Response shape: QueryResult (defined above)
 *
 * Hints:
 *   - Store filter values as strings in state, parse to numbers before sending
 *   - Use a 3-column grid: 1 for filters, 2 for results
 *   - JSON.stringify(result.prismaWhere, null, 2) for pretty-printing
 */
export default function QueryBuilderPage() {
	// TODO: Add state for each filter field
	// TODO: Add state for result (QueryResult | null), error, isLoading

	// TODO: Implement handleSubmit

	return (
		<div className='min-h-screen p-8 max-w-5xl mx-auto'>
			<h1 className='text-3xl font-bold mb-2'>Structured Query Builder</h1>
			<p className='text-gray-500 mb-6'>
				Build type-safe Prisma queries — no raw SQL, no string interpolation.
			</p>

			{/* TODO: Build the filter form and results display here */}
			<p className='text-gray-400'>Query builder not implemented yet.</p>
		</div>
	);
}
