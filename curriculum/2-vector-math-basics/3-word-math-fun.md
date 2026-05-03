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

## Assignment: Word Math + Vector Concepts

Now apply what you've learned by creating your own word math example and explaining the underlying concepts.

**Why video assignments?** Recording yourself explaining concepts does three things: it forces you to truly internalize the material (you can't explain what you don't understand), it prepares you to teach your team (a skill that matters more than coding), and it prevents magical thinking—if you can't articulate *why* something works, you're just copying code.

### Video Assignment (3-4 minutes)

Create a video that demonstrates your understanding of vector embeddings:

1. **Your word equation** - Present a creative word math equation you invented (not one from the examples)
   - Show the equation: `A - B + C ≈ ?`
   - Run it and show the result
   - Explain why it works (or doesn't!)

2. **Explain the math** - Using your example, explain:
   - What does "subtracting" a word actually do to the vector?
   - What does "adding" a word do?
   - Why does cosine similarity find the "answer"?

3. **Connect to RAG** - Explain how this same math powers document retrieval:
   - How is a user query like one side of a word equation?
   - Why does "similar vectors = similar meaning" enable search?

Be specific with your explanations—show you understand the geometry, not just the code.

### Code Assignment

**Extend** `app/scripts/exercises/vector-word-arithmetic.ts` with your own creative examples:

**Requirements:**
- Add at least 2 original word equations that demonstrate different relationship types:
  - Example types: profession→workplace, product→company, emotion→expression, hobby→equipment
- For each equation, provide candidate words that make it interesting (include some "wrong" answers)
- Add comments explaining why you expect each equation to work

**What "done" looks like:**
- Your equations run and produce results
- You can explain why the results make sense (or why they surprised you)
- Your video demonstrates understanding, not just code execution

### Submit Your Work

- [Video Submission](https://form.typeform.com/to/xIimMBMs)
- [Code Submission](https://form.typeform.com/to/oftSQs08)

---

## What's Next

You now understand the math! Time to build the actual Pinecone integration.
