# Week 1: Foundations (Days 1-7)

**Theme:** Learning techniques, RAG concepts, and vector fundamentals

**Assignment:** Document Upload (Due Day 13)

---

## Day 1: How to Learn + What is RAG

**Time:** 45 min | **Type:** Read/Watch

### Learning Objectives
- Understand the Feynman Technique for learning
- Know what RAG is and when to use it vs fine-tuning
- Set expectations for video assignments

### Content
1. [How to Learn](../0-how-to-learn/1-how-to-learn.md)
2. [What is RAG](../1-intro-to-rag/1-what-is-rag.md)

### Key Takeaways
- Explain concepts in your own words to solidify understanding
- RAG = Retrieval Augmented Generation - fetching relevant docs to inform LLM responses
- Fine-tuning changes model behavior; RAG provides context

---

## Day 2: Vectors and Embeddings

**Time:** 60 min | **Type:** Read/Watch + Quiz

### Learning Objectives
- Understand what embeddings are and how they capture meaning
- Know how similarity search works with vectors
- Complete the vector quiz

### Content
1. [Understanding Vectors](../2-vector-math-basics/1-understanding-vectors.md)
2. [Embeddings Explained](../2-vector-math-basics/2-embeddings-explained.md)
3. Complete the quiz in the lesson

### Key Takeaways
- Embeddings convert text to numerical vectors
- Similar meanings = similar vectors = high cosine similarity
- OpenAI's embedding models create 1536-dimensional vectors

---

## Day 3: Implementing Similarity + Word Math

**Time:** 60 min | **Type:** Hands-on

### Learning Objectives
- Implement cosine similarity from scratch
- Understand word arithmetic with vectors
- Run the exercises to verify understanding

### Content
1. [Finding Similar Documents](../2-vector-math-basics/3-finding-similar-documents.md)
2. [Word Arithmetic](../2-vector-math-basics/4-word-arithmetic.md)

### Exercises
```bash
npx ts-node app/scripts/exercises/vector-similarity.ts
npx ts-node app/scripts/exercises/vector-word-arithmetic.ts
```

### Key Takeaways
- Cosine similarity measures angle between vectors (not magnitude)
- `king - man + woman ≈ queen` demonstrates semantic relationships
- This is the foundation of all retrieval systems

---

## Day 4: Setting Up Pinecone

**Time:** 45 min | **Type:** Setup

### Learning Objectives
- Set up Pinecone account and index
- Configure environment variables
- Verify connection works

### Content
1. [Setting Up Pinecone](../3-pinecone-integration/1-setting-up-pinecone.md)
2. [Understanding Indexes](../3-pinecone-integration/2-understanding-indexes.md)

### Setup Steps
1. Create Pinecone account at pinecone.io
2. Create an index (dimensions: 1536, metric: cosine)
3. Add `PINECONE_API_KEY` and `PINECONE_INDEX` to `.env`

### Key Takeaways
- Pinecone = managed vector database
- Index = collection of vectors with metadata
- Connection is required for all RAG operations

---

## Day 5: Introduction to Scraping

**Time:** 45 min | **Type:** Read

### Learning Objectives
- Understand data quality importance for RAG
- Know common scraping approaches
- Recognize what makes good training data

### Content
1. [Introduction to Scraping](../4-chunking-fundamentals/1-introduction-to-scraping.md)

### Key Takeaways
- Garbage in, garbage out - data quality is critical
- Structure your scraping around your use case
- Clean data early; don't rely on LLM to fix bad input

---

## Day 6: Understanding Chunking

**Time:** 60 min | **Type:** Hands-on

### Learning Objectives
- Understand why chunking matters for retrieval
- Know different chunking strategies
- Implement chunking functions

### Content
1. [Understanding Chunking](../4-chunking-fundamentals/2-understanding-chunking.md)
2. Complete the `getLastWords()` exercise

### Exercises
```bash
yarn test:chunking
```

### Assignment Assigned
**Document Upload** is now assigned. See [ASSIGNMENTS.md](../ASSIGNMENTS.md) for details.

### Key Takeaways
- Too big = irrelevant context; too small = lost meaning
- Overlap prevents losing information at boundaries
- Different content types need different strategies

---

## Day 7: REST

Take a break. Let concepts settle.

Review your notes from the week if you want.

---

## Week 1 Checklist

- [ ] Watched all videos
- [ ] Completed vector exercises
- [ ] Set up Pinecone account and index
- [ ] Environment variables configured
- [ ] Understand chunking tradeoffs
- [ ] Assignment 1 started (Due Day 13)
