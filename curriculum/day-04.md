# Day 4 — Word Math: The Magic of Embeddings

**Time:** ~60 min · Hands-on

> **Today:** proof that words really are just vectors — you'll compute `king − man + woman` and watch it land on `queen`, then invent your own word equations. It's the most fun you'll have with linear algebra, and it's exactly why RAG retrieval works.

## Video walkthrough

<iframe src="https://share.descript.com/embed/gz3NfK2kCMl" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## The magic of word arithmetic

Remember: embeddings place similar words close together in vector space. This means we can do **math with words**.

### The classic example

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

Try it yourself before running any code:

```visual
word-math | king − man + woman ≈ queen — try it
```

```quiz
[
  {
    "q": "In vector terms, what does subtracting the 'man' embedding from the 'king' embedding do?",
    "options": ["Deletes the word 'man' from the model's vocabulary", "Removes the direction/concept 'man' contributes, leaving something like 'royalty without maleness'", "Makes the vector shorter (fewer dimensions)"],
    "answer": 1,
    "explain": "Concepts live as directions in the space. Subtracting a vector removes its directional contribution — the dimensionality never changes, only the position."
  },
  {
    "q": "After computing king − man + woman, how do we find the 'answer' word?",
    "options": ["The result vector IS a word — we decode it directly", "We compare the result vector to candidate word embeddings with cosine similarity and take the closest", "We ask GPT-4o-mini which word it thinks matches"],
    "answer": 1,
    "explain": "The arithmetic produces a new point in space that isn't exactly any word. findClosestWord measures cosine similarity against candidates and returns the nearest one — queen."
  },
  {
    "q": "Why does word math matter for RAG?",
    "options": ["RAG systems subtract stopwords from queries before searching", "It proves semantic relationships are preserved as geometry — the same 'similar meaning = nearby vectors' property that makes retrieval work", "It doesn't — it's just a party trick"],
    "answer": 1,
    "explain": "If relationships like gender, capital-of, and verb tense survive as consistent vector offsets, then 'find documents near my query vector' genuinely finds documents about the same thing. Same math, same reason it works."
  },
  {
    "q": "Why does the exercise ask you to use words from the cached list?",
    "options": ["Uncached words produce wrong answers", "Cached embeddings skip the OpenAI API call, so experiments cost nothing", "The cache contains higher-quality embeddings"],
    "answer": 1,
    "explain": "Any word works — uncached words just hit the OpenAI embeddings API, which costs (a little) money. The cache exists purely to keep experimentation free."
  }
]
```

## Exercise: try word math

### Important: use cached words

To save API costs, we've pre-cached embeddings for specific words. **Use these words in your experiments** — they won't require OpenAI API calls:

```
king, man, woman, queen, princess, empress, lady, ruler, monarch,
boyfriend, commitment, freedom, fuckboy, player, bachelor, single, flirt, hookup,
engineer, humility, ego, founder, CEO, entrepreneur, startup, techbro, disruptor,
Twitter, sanity, chaos, X, 4chan, Reddit, TikTok, hellscape, dumpsterfire,
intern, enthusiasm, cynicism, manager, executive, burnout, veteran, survivor, director,
dating, authenticity, filters, catfish, Instagram, facade, performance, theater, illusion,
pizza, accountant, banana, library, sunshine, broccoli
```

If you use words outside this list, they'll still work but will call the OpenAI API (costs money).

### Setup

The exercise is already set up for you at [`app/scripts/exercises/vector-word-arithmetic.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/scripts/exercises/vector-word-arithmetic.ts). Here are the tools it gives you:

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

Notice `findClosestWord` is yesterday's `findTopSimilarDocuments` with `topK = 1` — same cosine similarity ([Day 3](/learn/day-03)), different packaging.

### The three example equations

The script walks through three equations. Here's the first in full — the pattern is always *embed the words, do the arithmetic, find the closest candidate*:

```typescript
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
```

Examples 2 and 3 in the script follow the same shape:

- `Paris - France + Italy` with candidates `Rome, Milan, Venice, Florence, Naples`
- `walking - walk + swim` with candidates `swimming, swam, swimmer, swims, diving`

Before you run it — **predict all three answers and roughly how confident (similarity score) each will be.**

### Run the exercise

```bash
yarn exercise:word-math
```

This runs the complete script at `app/scripts/exercises/vector-word-arithmetic.ts`.

<details>
<summary>🔍 Expected output</summary>

```
🔮 Example 1: king - man + woman
Answer: queen (0.892)

🔮 Example 2: Paris - France + Italy
Answer: Rome (0.847)

🔮 Example 3: walking - walk + swim
Answer: swimming (0.923)
```

Your exact scores may differ slightly, but the winning words should match. Notice none of the scores is 1.0 — the arithmetic lands *near* the answer word, never exactly on it.

</details>

## Create your own equations

Try these patterns:

**Country → Capital**

```typescript
// Tokyo - Japan + Germany ≈ ?
// Berlin!
```

**Adjective → Noun**

```typescript
// biggest - big + small ≈ ?
// smallest!
```

**Verb tenses**

```typescript
// running - run + eat ≈ ?
// eating!
```

**Company → Product**

```typescript
// iPhone - Apple + Microsoft ≈ ?
// Windows? Surface?
```

## What this proves

**Words are truly just vectors.**

- Semantics encoded as numbers
- Relationships preserved in space
- Math operations make sense
- Similar meanings = similar vectors

This is why RAG works:

1. User query → vector
2. Documents → vectors
3. Find closest vectors
4. Return matching documents

The math handles the "understanding".

### Why this matters for RAG

**When a user asks:** "How do I use React hooks?"

**The system:**

1. Converts the query to a vector
2. That vector is "near" vectors for:
   - "React useState tutorial"
   - "Understanding React hooks"
   - "Hooks in React"
3. But "far" from:
   - "Python data science"
   - "CSS styling tips"

**Result:** relevant documents retrieved.

## Challenge: build your own

Create 3 word equations of your own and test them:

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

- Plurals: dog - dogs + cat ≈ ?
- Opposites: hot - cold + loud ≈ ?
- Professions: doctor - hospital + school ≈ ?

<details>
<summary>💡 Hint 1 — designing an equation that works</summary>

Pick a *consistent relationship* and cancel it out. The pattern is always `A - B + C` where A and B differ by exactly one concept, and C should pick that concept up. If A and B differ in several ways at once (e.g. `pizza - library`), the result vector points somewhere meaningless.

</details>

<details>
<summary>💡 Hint 2 — choosing good candidate words</summary>

Your candidates make or break the demo. Include the answer you expect, 2–3 plausible near-misses (words in the same category), and one obviously wrong word (like `broccoli`). If the wrong word ever wins, your equation's relationship isn't as clean as you thought — that's a genuinely interesting result, dig into why.

</details>

<details>
<summary>💡 Hint 3 — worked example of the challenge pattern</summary>

Opposites, worked through: `hot - cold` isolates a "temperature-flip" direction. Adding `loud` should flip it the same way:

```typescript
const result = addVectors(subtractVectors(hot, cold), loud);
const answer = await findClosestWord(result, [
	'quiet', 'silent', 'noisy', 'soft', 'banana',
]);
// Expect: quiet (or silent) — the "opposite" direction applied to loud
```

Don't be surprised if `noisy` wins instead — antonym directions are messier than analogy directions like country→capital. That's worth mentioning in your video.

</details>

## 🎥 Assignment

Now apply what you've learned by creating your own word math example and explaining the underlying concepts.

**Why video assignments?** Recording yourself explaining concepts does three things: it forces you to truly internalize the material (you can't explain what you don't understand), it prepares you to teach your team (a skill that matters more than coding), and it prevents magical thinking — if you can't articulate *why* something works, you're just copying code.

### Video (3–4 minutes)

Create a video that demonstrates your understanding of vector embeddings:

1. **Your word equation** — present a creative word math equation you invented (not one from the examples)
   - Show the equation: `A - B + C ≈ ?`
   - Run it and show the result
   - Explain why it works (or doesn't!)

2. **Explain the math** — using your example, explain:
   - What does "subtracting" a word actually do to the vector?
   - What does "adding" a word do?
   - Why does cosine similarity find the "answer"?

3. **Connect to RAG** — explain how this same math powers document retrieval:
   - How is a user query like one side of a word equation?
   - Why does "similar vectors = similar meaning" enable search?

Be specific with your explanations — show you understand the geometry, not just the code. Feynman-style: explain it so a smart non-engineer would follow.

### Code

**Extend** [`app/scripts/exercises/vector-word-arithmetic.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/scripts/exercises/vector-word-arithmetic.ts) with your own creative examples.

**Requirements:**

- Add at least 2 original word equations that demonstrate different relationship types (profession→workplace, product→company, emotion→expression, hobby→equipment...)
- For each equation, provide candidate words that make it interesting (include some "wrong" answers)
- Add comments explaining why you expect each equation to work

**What "done" looks like:**

- Your equations run and produce results
- You can explain why the results make sense (or why they surprised you)
- Your video demonstrates understanding, not just code execution

### Submit your work

- [Video Submission](https://form.typeform.com/to/xIimMBMs)
- [Code Submission](https://form.typeform.com/to/oftSQs08)

Post your favorite equation (especially the surprising failures) in Slack — they make great discussion.

## ✅ Key takeaways

- Embeddings preserve *relationships* as geometry: `king − man + woman` lands near `queen` because concepts are directions in the space
- Vector subtraction removes a concept's contribution; addition injects one — the arithmetic is meaningful because the space is
- The "answer" is found by cosine similarity against candidates — the same operation as Day 3's document retrieval, with `topK = 1`
- This is the deep reason RAG works: a query vector sits near the document vectors that *mean* the same thing, even with zero shared keywords
- Clean single-concept relationships (country→capital, verb tense) work best; fuzzy ones (antonyms) get messy — good instincts for debugging retrieval later

## 🤖 Work with AI

```ai-prompt
title: Help me invent word equations for my assignment
---
I'm doing the word-math exercise from app/scripts/exercises/vector-word-arithmetic.ts (run with `yarn exercise:word-math`). I need to invent 2+ ORIGINAL equations of the form A - B + C ≈ ? for my video assignment — not king/man/woman, not Paris/France/Italy.

Don't just hand me equations. Instead: (1) ask me which relationship types I find interesting (profession→workplace, product→company, emotion→expression, etc.), (2) help me refine MY proposals — for each one, make me articulate what single concept A - B isolates and predict the answer before running it, (3) help me pick 5 candidate words per equation including plausible near-misses, (4) after I run them, help me explain any surprising results in terms of vector geometry. I need to explain the WHY on camera, so keep pushing my explanations until they're airtight.
```

```ai-prompt
title: Poke holes in my geometry explanation
---
For my Day 4 video I have to explain why word math works: what subtracting a word vector does, what adding one does, and why cosine similarity finds the answer — then connect it to RAG retrieval.

I'll explain it to you now as if you're a smart 12-year-old. Afterwards: ask me the naive-but-sharp follow-ups ("if you subtract 'man' from 'king', where does the man GO?", "why isn't the answer exactly queen with similarity 1.0?", "so when I search your RAG app, which side of the equation is my question?"). Flag any jargon I used without explaining. Rate me 1-10 on simplicity and accuracy, and name the one gap to fix before I record.
```
