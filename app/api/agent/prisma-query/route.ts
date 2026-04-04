/**
 * Structured Query Builder with Prisma
 *
 * Prisma is an ORM — it generates safe, parameterized queries from
 * TypeScript objects. You never concatenate user input into query strings.
 *
 * This route takes a structured filter object and maps it to a Prisma
 * `findMany` query. No natural language parsing, no string interpolation —
 * just a direct, type-safe mapping from filters → database query.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ── Request types ────────────────────────────────────────────────────────

interface QueryFilters {
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	minRating?: number;
	inStock?: boolean;
}

interface QueryRequest {
	filters: QueryFilters;
	orderBy?: 'price_asc' | 'price_desc' | 'rating_desc';
	limit?: number;
}

// ── Route Handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
	try {
		const body: QueryRequest = await request.json();
		const { filters = {}, orderBy, limit } = body;

		// Clamp limit between 1 and 50
		const take = Math.min(Math.max(limit ?? 10, 1), 50);

		// ── Build the Prisma `where` clause ──────────────────────────
		const where: Prisma.ProductWhereInput = {};

		if (filters.category) {
			where.category = filters.category;
		}

		if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
			where.price = {};
			if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
			if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
		}

		if (filters.inStock === true) {
			where.stockCount = { gt: 0 };
		}

		// For minRating we need a post-query filter since it's an aggregate
		// on the related reviews. Prisma doesn't support HAVING in findMany,
		// so we fetch with a generous limit and filter in JS.
		const needsRatingFilter =
			filters.minRating !== undefined && filters.minRating > 0;

		// ── Build orderBy ────────────────────────────────────────────
		let prismaOrderBy: Prisma.ProductOrderByWithRelationInput | undefined;
		if (orderBy === 'price_asc') prismaOrderBy = { price: 'asc' };
		else if (orderBy === 'price_desc') prismaOrderBy = { price: 'desc' };
		// rating_desc is handled in post-processing

		// ── Execute query ────────────────────────────────────────────
		const rawProducts = await prisma.product.findMany({
			where,
			orderBy: prismaOrderBy,
			take: needsRatingFilter ? 200 : take, // over-fetch when filtering by rating
			include: { reviews: true },
		});

		// ── Compute average rating and apply rating filter ───────────
		let products = rawProducts.map((product) => {
			const avgRating =
				product.reviews.length > 0
					? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
						product.reviews.length
					: 0;

			return {
				id: product.id,
				name: product.name,
				category: product.category,
				price: product.price,
				stockCount: product.stockCount,
				description: product.description,
				avgRating: Math.round(avgRating * 100) / 100,
				reviewCount: product.reviews.length,
				reviews: product.reviews.map((r) => ({
					rating: r.rating,
					reviewText: r.reviewText,
					createdAt: r.createdAt,
				})),
			};
		});

		if (needsRatingFilter) {
			products = products.filter(
				(p) => p.avgRating >= (filters.minRating ?? 0)
			);
		}

		if (orderBy === 'rating_desc') {
			products.sort((a, b) => b.avgRating - a.avgRating);
		}

		products = products.slice(0, take);

		return NextResponse.json({
			success: true,
			count: products.length,
			filters,
			prismaWhere: where, // Expose the generated clause for learning
			products,
		});
	} catch (error) {
		console.error('Error in prisma-query:', error);
		return NextResponse.json(
			{
				error: 'Query failed',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}

// ─────────────────────────────────────────────────────────────────────────
// DANGEROUS NAIVE VERSION — DO NOT USE
// ─────────────────────────────────────────────────────────────────────────
//
// This function exists ONLY to show the contrast between Prisma's safe
// parameterized queries and the dangerous alternative of string interpolation.
//
// **NEVER** do this in production code. It is here as a teaching example.
//
// ── What is SQL Injection? ──
// SQL injection happens when user-supplied input is concatenated directly
// into a SQL query string. The database can't tell the difference between
// your query logic and the attacker's injected commands.
//
// ── Concrete attack example ──
// If a user passes category = "'; DROP TABLE products; --"
//
// The resulting query becomes:
//   SELECT * FROM products WHERE category = ''; DROP TABLE products; --'
//
// That's THREE statements:
//   1. SELECT * FROM products WHERE category = ''   ← returns nothing
//   2. DROP TABLE products                          ← deletes the table
//   3. --'                                          ← comment, ignored
//
// The entire products table is gone. Game over.
//
// Prisma prevents this by using parameterized queries — the database
// receives the query structure and the values SEPARATELY, so user input
// can never escape the value boundary and become executable SQL.
//
// function dangerousRawQuery(category: string) {
//   // 🚨 NEVER DO THIS — user input goes directly into the SQL string
//   const query = `SELECT * FROM products WHERE category = '${category}'`;
//   return prisma.$queryRawUnsafe(query);
// }
