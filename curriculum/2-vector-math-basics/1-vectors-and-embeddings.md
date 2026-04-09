# Vectors and Embeddings: Words to Numbers

Understanding vectors is crucial for RAG systems. Don't worry - we'll keep it practical and visual!

---

## Video Walkthrough

Watch these introductions to vectors and embeddings:

**Vectors and Embeddings Explained:**

<iframe src="https://share.descript.com/embed/zz3e0kMLiO6" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

-   What vectors are and why they matter
-   How text becomes numbers (embeddings)
-   Why cosine similarity works
-   Basic vector operations

---

## Why Vector Math for RAG?

RAG systems need to find similar content. To do that:

```
Text → Vectors → Measure Similarity → Find Matches
```

The math makes similarity measurable!

---

## What is a Vector?

A vector is just a list of numbers:

```typescript
// 2D vector (x, y coordinates)
const vector2D = [3, 4];

// 3D vector (x, y, z)
const vector3D = [1, 2, 3];

// Text embedding (512 dimensions!)
const embedding = [0.1, -0.3, 0.8, 0.2, ...];
```

**Think of it as:** A point in space, or a direction from the origin.

---

## From Text to Vectors

### How Embeddings Work

```
"artificial intelligence"
        ↓
Embedding Model
        ↓
[0.1, -0.3, 0.8, ..., 0.2]  (512 numbers)
```

**The magic:** Similar concepts → similar vectors

```typescript
"dog"   → [0.1, 0.5, -0.2, ...]
"puppy" → [0.2, 0.4, -0.1, ...]  // Close to "dog"!
"car"   → [-0.3, 0.1, 0.8, ...]  // Far from "dog"
```

### Using OpenAI's Embedding API

```typescript
const response = await openai.embeddings.create({
	model: 'text-embedding-3-small',
	input: 'artificial intelligence',
});

const embedding = response.data[0].embedding;
// [0.1, -0.3, 0.8, ..., 0.2] (512 numbers)
```

---

## Measuring Similarity

### The Dot Product

Multiply corresponding numbers, add them up:

```typescript
function dotProduct(a: number[], b: number[]): number {
	return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

const v1 = [1, 2, 3];
const v2 = [4, 5, 6];
dotProduct(v1, v2); // (1×4) + (2×5) + (3×6) = 32
```

**Interpretation:**

-   Higher value = more similar
-   Zero = unrelated
-   Negative = opposite

### Cosine Similarity (The Standard)

Normalize the dot product to get a score from -1 to 1:

```typescript
function magnitude(v: number[]): number {
	return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

function cosineSimilarity(a: number[], b: number[]): number {
	const dot = dotProduct(a, b);
	return dot / (magnitude(a) * magnitude(b));
}
```

**Scale:**

-   `1.0` = Identical direction
-   `0.0` = Unrelated (perpendicular)
-   `-1.0` = Opposite direction

---

## Visual Intuition

```
     Vector A
        /
       /
      /_____ Vector B

Small angle = High similarity
Large angle = Low similarity
```

Cosine similarity measures the angle between vectors:

-   Same direction → angle 0° → similarity = 1
-   Perpendicular → angle 90° → similarity = 0
-   Opposite → angle 180° → similarity = -1

---

## Why 512 Dimensions?

Embeddings have many dimensions (512, 1536, 3072):

-   **More dimensions = richer meaning**
-   **Each dimension captures a concept:**
    -   Dim 1: "How technical?"
    -   Dim 2: "How positive?"
    -   Dim 50: "Related to animals?"
    -   ...

It's a balance:

-   More = better quality
-   Fewer = faster computation

---

## Finding Similar Documents

```typescript
// Documents
const docs = [
	'Python is a programming language',
	'JavaScript is for web development',
	'Machine learning uses algorithms',
	'Dogs are loyal pets',
];

// Get embeddings for all
const docEmbeddings = await Promise.all(docs.map((doc) => getEmbedding(doc)));

// Query
const query = 'What programming languages exist?';
const queryEmbedding = await getEmbedding(query);

// Calculate similarities
const similarities = docEmbeddings.map((docEmbed) =>
	cosineSimilarity(queryEmbedding, docEmbed)
);

// Results: [0.8, 0.7, 0.3, 0.1]
// "Python is a programming language" wins!
```

---

## Essential Watching

For beautiful visual explanations:

**AI Accelerator Compendium (Interactive Guides):**

- [Vectors](https://projectshft.github.io/ai-accelerator-compendium/vectors.html) - Interactive visualization of vectors and their properties
- [Dot Products](https://projectshft.github.io/ai-accelerator-compendium/dot-products.html) - Visual explanation of dot products and similarity

**Bonus - Dive Deeper:**
- [LLMs](https://projectshft.github.io/ai-accelerator-compendium/mini-llm/index.html) - How large language models work
- [Transformers](https://projectshft.github.io/ai-accelerator-compendium/gpt/index.html) - The architecture behind modern AI
- [Attention](https://projectshft.github.io/ai-accelerator-compendium/attention/index.html) - Understanding attention mechanisms

**3Blue1Brown's Linear Algebra Series:**

1. [Vectors, what even are they?](https://www.youtube.com/watch?v=fNk_zzaMoSs)
2. [Dot products and duality](https://www.youtube.com/watch?v=LyGKycYT2v0)

These resources make the concepts crystal clear!

---

## Quick Quiz

Which pairs would have high cosine similarity?

1. "I love pizza" vs "Pizza is delicious"
2. "Machine learning algorithms" vs "AI and neural networks"
3. "The weather is sunny" vs "Database optimization"

<details>
<summary>Answers</summary>

1. ✅ **High** - Both about pizza, positive sentiment
2. ✅ **High** - Both about AI/ML concepts
3. ❌ **Low** - Completely different topics

</details>

---

## What You Learned

✅ Vectors are lists of numbers
✅ Embeddings convert text to vectors
✅ Similar text → similar vectors
✅ Cosine similarity measures angle between vectors
✅ This is how RAG finds relevant documents

---

## What's Next

Now let's implement similarity calculations and do some word math!
