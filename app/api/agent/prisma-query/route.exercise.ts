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

// ── Request types (provided — do not modify) ─────────────────────────────

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

		// TODO: Step 1 — Clamp the limit
		// Default to 10 if not provided. Minimum 1, maximum 50.
		// Hint: Math.min(Math.max(limit ?? 10, 1), 50)

		// TODO: Step 2 — Build the Prisma `where` clause
		// Create a Prisma.ProductWhereInput object and conditionally add:
		//   - filters.category → where.category = filters.category
		//   - filters.minPrice / maxPrice → where.price = { gte, lte }
		//   - filters.inStock === true → where.stockCount = { gt: 0 }
		//
		// NOTE: minRating requires a post-query filter because it's an
		// aggregate on reviews. Prisma doesn't support HAVING in findMany.

		// TODO: Step 3 — Build the orderBy clause
		// Map the string values to Prisma orderBy objects:
		//   'price_asc'   → { price: 'asc' }
		//   'price_desc'  → { price: 'desc' }
		//   'rating_desc' → handled in post-processing (Step 5)

		// TODO: Step 4 — Execute the Prisma query
		// Use prisma.product.findMany() with:
		//   where, orderBy, take (use a larger take if filtering by rating),
		//   include: { reviews: true }

		// TODO: Step 5 — Compute average rating per product
		// Map over the results and calculate:
		//   avgRating = sum of review ratings / number of reviews
		// Round to 2 decimal places.
		// Include: id, name, category, price, stockCount, description,
		//   avgRating, reviewCount, reviews (mapped to { rating, reviewText, createdAt })

		// TODO: Step 6 — Apply post-query filters
		// If minRating was specified, filter out products below that avg rating
		// If orderBy is 'rating_desc', sort by avgRating descending
		// Slice to the `take` limit

		// TODO: Step 7 — Return the response
		// Include: success, count, filters, prismaWhere (the where clause
		// object so students can see the mapping), and products array

		throw new Error('POST handler not implemented yet!');
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
