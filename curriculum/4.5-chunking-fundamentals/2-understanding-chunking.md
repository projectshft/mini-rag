# Understanding Text Chunking

Before you can vectorize documents, you need to break them into smaller pieces. This is called **chunking**, and it's critical to RAG system quality.

---

## Video Walkthrough

Watch this explanation of text chunking:

<iframe src="https://share.descript.com/embed/5rgvAlDwp7V" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

-   Why chunking is necessary for RAG
-   Bad vs. good chunking strategies
-   How overlap preserves context
-   How to implement sentence-aware chunking

---

## Why Chunking Matters

### The Problem

**Documents are too long:**

-   Embedding models have token limits (8,191 tokens)
-   Entire document = diluted meaning ("average" of everything)
-   User asks about hooks → retrieves entire 50,000-word doc
-   Can't fit huge docs in LLM context window

### The Solution

```
50,000-word Document
        ↓
Break into 100 chunks of 500 chars each
        ↓
Each chunk = focused topic
        ↓
Retrieve only relevant chunks
```

**Benefits:**

-   Focused, specific meaning per chunk
-   Better embeddings (captures specific concepts)
-   Precise retrieval (get exactly what you need)
-   Fits in context windows

---

## Bad Chunking Examples

### ❌ Character Splitting

```typescript
function badCharacterChunking(text: string): string[] {
	return text.match(/.{1,500}/g) || [];
}

// Results in:
// "The company announced new feat"
// "ures including advanced AI c"
```

**Problem:** Breaks words mid-character!

### ❌ Word Splitting

```typescript
function badWordChunking(text: string): string[] {
	const words = text.split(' ');
	const chunks = [];
	for (let i = 0; i < words.length; i += 100) {
		chunks.push(words.slice(i, i + 100).join(' '));
	}
	return chunks;
}
```

**Problem:** Ignores sentence boundaries!

### Real Example

```typescript
// Original: "React Hooks were introduced in React 16.8. They allow you to use state..."

// ❌ Bad chunking produces:
[
	'React Hooks were introduced in React 16.8. They allow you to use state without wri',
	'ting a class component...',
];

// "wri" and "ting" are split - meaningless!
```

---

## Good Chunking: Sentence-Aware + Overlap

### The Strategy

```typescript
export type Chunk = {
	id: string;
	content: string;
	metadata: {
		source: string;
		chunkIndex: number;
		totalChunks: number;
		startChar: number;
		endChar: number;
	};
};
```

**Key principles:**

1. Split by sentences (`.`, `!`, `?`)
2. Combine sentences until size limit
3. Add overlap between chunks
4. Track metadata

---

## Why Overlap Matters

**Without Overlap:**

```
Chunk 1: "...useState is a hook."
Chunk 2: "It returns a pair of values..."
```

User: "what does useState return?"

-   Chunk 1 has "useState" but not "return" ❌
-   Chunk 2 has "return" but not "useState" ❌

**With Overlap (50 chars):**

```
Chunk 1: "...useState is a hook."
Chunk 2: "useState is a hook. It returns a pair of values..."
```

User: "what does useState return?"

-   Chunk 2 has BOTH "useState" AND "return" ✅

### How Much Overlap?

-   **Too little** (10 chars): Not enough context
-   **Too much** (90%): Wasteful
-   **Just right** (10-20% of chunk size): Perfect

For 500-char chunks → 50-100 char overlap

---

## Your Challenge: Implement the `getLastWords` Function

The chunking logic is provided, **but you need to implement the critical `getLastWords()` helper function**. This function creates the overlap between chunks that preserves context.

### Why This Function Matters

Without proper overlap, chunks lose context:

```typescript
// Without getLastWords (no overlap):
Chunk 1: "React Hooks allow you to use state."
Chunk 2: "The most common hooks are useState."
// Query: "What do React Hooks do?" → Might miss Chunk 2!

// With getLastWords (proper overlap):
Chunk 1: "React Hooks allow you to use state."
Chunk 2: "allow you to use state. The most common hooks are useState."
// Query: "What do React Hooks do?" → Finds both chunks! ✅
```

### Test-Driven Development Approach

**Step 1: Run the tests to see failures**

```bash
yarn test:chunking
```

Some tests will fail because `getLastWords()` isn't implemented!

**Step 2: Understand what `getLastWords` should do**

```typescript
getLastWords('React Hooks are awesome', 10);
// Should return: "are awesome" (10 chars, complete words)
// NOT: "re awesome" (broken word!)

getLastWords('Short', 100);
// Should return: "Short" (entire text if shorter than max)
```

**Step 3: Find the function in the code**

Open `app/libs/chunking.ts` and scroll to the bottom. You'll see:

```typescript
function getLastWords(text: string, maxLength: number): string {
	// YOUR IMPLEMENTATION HERE
}
```

**Step 4: Implement the function**

Here's your implementation guide:

```typescript
function getLastWords(text: string, maxLength: number): string {
	// Step 1: If text is short enough, return it all

	// Step 2: Split text into words

	// Step 3: Build result string (start empty)

	// Step 4: Loop BACKWARDS through words (from end to start)
	// Step 5: Check if adding this word would exceed maxLength
	// Remember to account for space between words!

	// Step 6: Prepend word to result (building backwards)

	// Step 7: Return the result
	return result;
}
```

**Step 5: Test your implementation**

```bash
yarn test:chunking
```

All tests should pass! ✅

---

## Need Help?

**Stuck on the implementation?**

1. Check the detailed steps in the comments of `app/libs/chunking.ts`
2. Review the examples above showing what `getLastWords()` should return
3. See the complete solution in `app/libs/chunking.solution.ts`
4. Or ask your instructor for guidance!

**Common mistakes:**
- Forgetting to check if text is already short enough
- Not looping backwards (starting from the end)
- Forgetting to account for spaces between words (`+ 1`)
- Building the string in the wrong order

---

### The Type Definition

```typescript
export type Chunk = {
	id: string;
	content: string;
	metadata: {
		source: string;
		chunkIndex: number;
		totalChunks: number;
		startChar: number;
		endChar: number;
		[key: string]: string | number | boolean | string[];
	};
};
```

### Understanding the Implementation

The implementation in `app/libs/chunking.ts` follows these key steps:

**1. Split into sentences**

```typescript
const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
```

**2. Build chunks with overlap**

-   Accumulate sentences until chunk size is reached
-   When size limit hit, save current chunk
-   Start next chunk with overlap from previous chunk
-   Track metadata (indices, positions)

**3. Helper function `getLastWords()`**

-   Gets the last N characters worth of words
-   Used to create overlap between chunks
-   Ensures context preservation

**4. Update total chunks count**

-   After all chunks created, update each chunk's `totalChunks` metadata

---

## Run the Tests

See the implementation in action:

```bash
yarn test:chunking
```

All 18 tests should pass ✅

### Study These Key Tests

**Test 1: Sentence Boundaries**

```typescript
test('should not break words mid-character', () => { ... });
```

Learn: How sentence-aware splitting prevents broken words

**Test 2: Overlap Functionality**

```typescript
test('should create overlap between chunks', () => { ... });
```

Learn: How overlap preserves context between chunks

**Test 3: Metadata Tracking**

```typescript
test('should include correct metadata', () => { ... });
```

Learn: What metadata we track and why it matters

**Test 4: Real-World Example**

```typescript
test('should chunk React documentation example', () => { ... });
```

Learn: How it handles actual documentation text

---

## What You Learned

✅ Why chunking is critical (retrieval precision)
✅ Bad strategies break meaning
✅ Sentence-based + overlap = best
✅ 10-20% overlap maintains context

---

## What's Next

Module 5 uses your chunking implementation in the document upload pipeline!

---

## Video Solution Walkthrough

Watch the solution walkthrough for the chunking exercise:

<iframe src="https://share.descript.com/embed/WskC20VXMBd" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## Homework Assignment: Week 2

**Code Assignment:** Build a **structured query builder** using Prisma that maps filter objects to safe, parameterized database queries — and understand why this is fundamentally different from string-interpolated SQL.

**What You're Building:**

A `POST /api/agent/prisma-query` route that:
1. Accepts a structured filter object (category, price range, rating, stock status)
2. Maps those filters to a Prisma `findMany` query with proper `where` clauses
3. Returns matching products with average ratings computed from reviews
4. Exposes the generated Prisma `where` clause so you can see the mapping

**Setup:**

```bash
yarn prisma:setup
# Runs: prisma generate → prisma migrate dev → prisma db seed
# Creates 17 products across 4 categories with 30+ reviews
```

**Requirements:**

1. **Prisma query mapping:**
   - `category` → exact match filter
   - `minPrice` / `maxPrice` → range filter with `gte` / `lte`
   - `inStock` → `stockCount > 0`
   - `minRating` → post-query filter on computed average review rating
   - `orderBy` → support `price_asc`, `price_desc`, `rating_desc`
   - `limit` → clamped between 1 and 50 (default 10)

2. **Understand the SQL injection contrast:**
   - Read the commented-out `dangerousRawQuery` function in the solution
   - Understand why `"'; DROP TABLE products; --"` as a category value would destroy the database with raw SQL but is harmless with Prisma
   - Be ready to explain the difference in your video

3. **Frontend** at `/query-builder`:
   - Filter controls (dropdowns, inputs, checkbox)
   - Display the Prisma `where` clause as formatted JSON
   - Show products with name, price, avg rating, stock status

**Exercise Files:**
- `app/api/agent/prisma-query/route.exercise.ts` — rename to `route.ts` and implement the TODOs
- `app/query-builder/page.exercise.tsx` — rename to `page.tsx` and build the UI
- `prisma/schema.prisma` and `prisma/seed.ts` are provided (read them, don't modify)

**Video Assignment:** Record a **3-4 minute video** explaining **SQL injection** — what it is, how it works (walk through the `DROP TABLE` example), and how ORMs like Prisma prevent it with parameterized queries. Show your working query builder and demonstrate how filters map to the `where` clause.

**Submit Your Work:**
- [Video Submission - Week 2](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission - Week 2](https://form.typeform.com/to/EWWcsorL) (include link to `app/api/agent/prisma-query/route.ts`)

**Due:** Before Module 5

**Why This Matters:** RAG doesn't always mean vector search. Structured data with known fields is often better served by a traditional database with typed queries. And understanding SQL injection is table-stakes security knowledge for any engineer.

---

## Experiment: Try Different Parameters

Now that you understand the implementation, experiment with different chunking parameters:

```typescript
// In a test file or Node REPL
import { chunkText } from './app/libs/chunking';

const text = 'Your long document here...';

// Try different chunk sizes
const smallChunks = chunkText(text, 200, 40, 'test');
const largeChunks = chunkText(text, 1000, 100, 'test');

console.log(`Small chunks: ${smallChunks.length}`);
console.log(`Large chunks: ${largeChunks.length}`);

// Try different overlap amounts
const noOverlap = chunkText(text, 500, 0, 'test');
const highOverlap = chunkText(text, 500, 150, 'test');
```

**Questions to explore:**

-   What chunk size works best for your content?
-   How much overlap do you need?
-   What happens with very short documents?
-   What happens with very long documents?
