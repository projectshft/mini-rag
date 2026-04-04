# Word Math: Vectors in Action

Let's have some fun and really drive home that words are just vectors!

---

## Video Walkthrough

Watch this fun exploration of word arithmetic:

<iframe src="https://share.descript.com/embed/gz3NfK2kCMl" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## The Magic of Word Arithmetic

Remember: embeddings place similar words close together in vector space. This means we can do **math with words**!

---

## The Classic Example

```
king - man + woman ≈ queen
```

**Why it works:**

```
"king" embedding contains:
  - Royalty concept
  - Male concept
  - Power concept

Subtract "man":
  - Removes male concept

Add "woman":
  - Adds female concept

Result:
  - Royalty + Female ≈ "queen"!
```

---

## Exercise: Try Word Math

### Important: Use Cached Words

To save API costs, we've pre-cached embeddings for specific words. **Use these words in your experiments** - they won't require OpenAI API calls:

```
king, man, woman, queen, princess, empress, lady, ruler, monarch,
boyfriend, commitment, freedom, fuckboy, player, bachelor, single, flirt, hookup,
engineer, humility, ego, founder, CEO, entrepreneur, startup, techbro, disruptor,
Twitter, sanity, chaos, X, 4chan, Reddit, TikTok, hellscape, dumpsterfire,
intern, enthusiasm, cynicism, manager, executive, burnout, veteran, survivor, director,
dating, authenticity, filters, catfish, Instagram, facade, performance, theater, illusion,
pizza, accountant, banana, library, sunshine, broccoli
```

If you use words outside this list, they'll work but will call the OpenAI API (costs money).

### Setup

The exercise is already set up for you at: `app/scripts/exercises/vector-word-arithmetic.ts`

```typescript
import { openaiClient } from '../libs/openai/openai';

async function getEmbedding(text: string): Promise<number[]> {
	const response = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
	});
	return response.data[0].embedding;
}

function addVectors(a: number[], b: number[]): number[] {
	return a.map((val, i) => val + b[i]);
}

function subtractVectors(a: number[], b: number[]): number[] {
	return a.map((val, i) => val - b[i]);
}

async function findClosestWord(
	targetVector: number[],
	candidateWords: string[]
): Promise<{ word: string; similarity: number }> {
	// Get embeddings for all candidates
	const candidateEmbeddings = await Promise.all(
		candidateWords.map(async (word) => ({
			word,
			embedding: await getEmbedding(word),
		}))
	);

	// Find most similar
	let best = { word: '', similarity: -1 };
	for (const candidate of candidateEmbeddings) {
		const sim = cosineSimilarity(targetVector, candidate.embedding);
		if (sim > best.similarity) {
			best = { word: candidate.word, similarity: sim };
		}
	}

	return best;
}
```

### Try These Equations

```typescript
async function wordMathExamples() {
	// Example 1: king - man + woman ≈ queen
	console.log('\n🔮 Example 1: king - man + woman');
	const king = await getEmbedding('king');
	const man = await getEmbedding('man');
	const woman = await getEmbedding('woman');

	const result1 = addVectors(subtractVectors(king, man), woman);

	const answer1 = await findClosestWord(result1, [
		'queen',
		'princess',
		'prince',
		'duke',
		'emperor',
	]);

	console.log(`Answer: ${answer1.word} (${answer1.similarity.toFixed(3)})`);
	// Expected: queen

	// Example 2: Paris - France + Italy ≈ Rome
	console.log('\n🔮 Example 2: Paris - France + Italy');
	const paris = await getEmbedding('Paris');
	const france = await getEmbedding('France');
	const italy = await getEmbedding('Italy');

	const result2 = addVectors(subtractVectors(paris, france), italy);

	const answer2 = await findClosestWord(result2, [
		'Rome',
		'Milan',
		'Venice',
		'Florence',
		'Naples',
	]);

	console.log(`Answer: ${answer2.word} (${answer2.similarity.toFixed(3)})`);
	// Expected: Rome

	// Example 3: walking - walk + swim ≈ swimming
	console.log('\n🔮 Example 3: walking - walk + swim');
	const walking = await getEmbedding('walking');
	const walk = await getEmbedding('walk');
	const swim = await getEmbedding('swim');

	const result3 = addVectors(subtractVectors(walking, walk), swim);

	const answer3 = await findClosestWord(result3, [
		'swimming',
		'swam',
		'swimmer',
		'swims',
		'diving',
	]);

	console.log(`Answer: ${answer3.word} (${answer3.similarity.toFixed(3)})`);
	// Expected: swimming
}

// Run it!
wordMathExamples();
```

### Run the Exercise

```bash
yarn exercise:word-math
```

This runs the complete script at `app/scripts/exercises/vector-word-arithmetic.ts`

**Expected output:**

```
🔮 Example 1: king - man + woman
Answer: queen (0.892)

🔮 Example 2: Paris - France + Italy
Answer: Rome (0.847)

🔮 Example 3: walking - walk + swim
Answer: swimming (0.923)
```

---

## Create Your Own Equations

Try these patterns:

### Country → Capital

```typescript
// Tokyo - Japan + Germany ≈ ?
// Berlin!
```

### Adjective → Noun

```typescript
// biggest - big + small ≈ ?
// smallest!
```

### Verb Tenses

```typescript
// running - run + eat ≈ ?
// eating!
```

### Company → Product

```typescript
// iPhone - Apple + Microsoft ≈ ?
// Windows? Surface?
```

---

## What This Proves

**Words are truly just vectors!**

-   Semantics encoded as numbers
-   Relationships preserved in space
-   Math operations make sense
-   Similar meanings = similar vectors

This is why RAG works:

1. User query → vector
2. Documents → vectors
3. Find closest vectors
4. Return matching documents

The math handles the "understanding"!

---

## Challenge: Build Your Own

Create 3 word equations and test them:

```typescript
async function myEquations() {
	// Your equation 1:
	// ...
	// Your equation 2:
	// ...
	// Your equation 3:
	// ...
}
```

**Ideas:**

-   Plurals: dog - dogs + cat ≈ ?
-   Opposites: hot - cold + loud ≈ ?
-   Professions: doctor - hospital + school ≈ ?

---

## Why This Matters for RAG

Understanding word math helps you understand RAG:

**When user asks:** "How do I use React hooks?"

**The system:**

1. Converts query to vector
2. That vector is "near" vectors for:
    - "React useState tutorial"
    - "Understanding React hooks"
    - "Hooks in React"
3. But "far" from:
    - "Python data science"
    - "CSS styling tips"

**Result:** Relevant documents retrieved!

---

## Homework Assignment 1

**Code Assignment:** Build a **secure custom document ingestion route** that validates input, chunks text using sentence boundaries, and stores vectors in a separate Pinecone index.

**What You're Building:**

A `POST /api/ingest/custom` route that:
1. Accepts raw text + metadata (source, author, date, category)
2. Validates the input against prompt injection, repetitive content, metadata poisoning, and oversized payloads
3. Chunks using sentence-boundary splitting (3-5 sentences per chunk, 1 sentence overlap)
4. Stores vectors in a separate Pinecone index (`custom-chunks-index`)

**Requirements:**

1. **Input security (the main learning goal):**
   - Scan for prompt injection patterns ("ignore previous instructions", "you are now", etc.)
   - Detect suspiciously repetitive content (any 5+ word phrase repeated > 8 times)
   - Sanitize metadata fields — reject script tags and SQL keywords (DROP, INSERT, DELETE, UPDATE, UNION)
   - Reject text over 50,000 characters with the actual character count in the error

2. **Sentence-based chunking:**
   - Split on sentence boundaries (`.!?`) — NOT the same as the character-based chunker in `app/libs/chunking.ts`
   - Target ~4 sentences per chunk with 1 sentence overlap
   - Each chunk's metadata must include: text, chunk_index, total_chunks, source, author, date, category, character_count

3. **Frontend form** at `/ingest`:
   - Fields for source, author, date, category (dropdown), and text (textarea with character count)
   - Display validation errors inline next to each field
   - On success, show how many chunks and vectors were created

**Exercise Files:**
- `app/api/ingest/custom/route.exercise.ts` — rename to `route.ts` and implement the TODOs
- `app/ingest/page.exercise.tsx` — rename to `page.tsx` and build the form

**Video Assignment:** Record a **3-4 minute video** explaining **document poisoning** — what it is, how an attacker could inject malicious instructions into a vector store, and what happens downstream when those chunks get retrieved into an LLM prompt. Show your validation code and demonstrate at least one rejection.

**Submit Your Work:**
- [Video Submission - Assignment 1](https://form.typeform.com/to/NdVcsThQ)
- [Code Submission - Assignment 1](https://form.typeform.com/to/A0pGKPqU) (include link to `app/api/ingest/custom/route.ts`)

**Due:** Before Module 4

**Why This Matters:** Your vector store is part of your LLM's attack surface. If bad content gets in, it gets retrieved and injected into prompts. Validating input BEFORE it enters the store is your first line of defense.

---

## What's Next

You now understand the math! Time to build the actual Pinecone integration.
