# Setting Up OpenAI and Pinecone Integration

Now that you understand what vector databases are and why we need them, let's set up both OpenAI and Pinecone. These two services work together to power our RAG system.

---

## What You'll Build

By the end of this module, you'll have:

-   An OpenAI API key and configured client for generating embeddings
-   A configured Pinecone client that connects to your vector database
-   Helper functions to search for similar documents
-   Understanding of how embeddings flow from OpenAI to Pinecone

---

## The Big Picture: How It All Connects

Let's understand the complete flow before we write any code:

```
User Query
    ↓
1. Convert text to embedding (OpenAI)
    ↓
2. Search for similar embeddings (Pinecone)
    ↓
3. Retrieve matching documents
    ↓
4. Send to LLM with context (OpenAI)
    ↓
Response to User
```

This module sets up steps 1 and 2 - the OpenAI and Pinecone integrations.

---

## Part 1: Setting Up OpenAI

### Getting Your OpenAI API Key

**Step 1: Create an OpenAI Account**

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in to your account
3. Navigate to the "API Keys" section in your dashboard
4. Click "Create new secret key"
5. **Important**: Copy the key immediately - you won't see it again!

**Step 2: Add Credits**

The OpenAI API is pay-per-use. You'll need to add a payment method:

1. Go to "Billing" in your OpenAI dashboard
2. Add a payment method
3. Add $5-10 in credits (this will last you a long time for learning)

**Cost Breakdown:**
- Embeddings (`text-embedding-3-small`): ~$0.0001 per 1K tokens (very cheap!)
- GPT-4o-mini: ~$0.15 per 1M input tokens
- For this tutorial, $5 will be more than enough

**Learn more:**
- [OpenAI Platform Documentation](https://platform.openai.com/docs/introduction)
- [OpenAI Node.js SDK](https://github.com/openai/openai-node) (version `5.15.0` used in this project)
- [Embeddings Guide](https://developers.openai.com/api/docs/guides/embeddings)

### Understanding OpenAI Models

**Embedding Models** (convert text to vectors):
- **text-embedding-3-small**: 512-1536 dimensions, fast and cheap ✅ (we'll use this)
- **text-embedding-3-large**: up to 3072 dimensions, more accurate but pricier

**Chat Models** (generate responses):
- **gpt-4o**: Most capable, best reasoning
- **gpt-4o-mini**: Great balance of speed/cost/quality ✅ (we'll use this)

---

## Part 2: Setting Up Pinecone

### Creating a Pinecone Account and Index

**Step 1: Create a free Pinecone account:**

1. Go to [https://www.pinecone.io/](https://www.pinecone.io/)
2. Click "Sign Up" and create a free account
3. Once logged in, create a new index:
    - **Name**: `rag-tutorial`
    - **Dimensions**: `512` (matches our OpenAI embedding dimensions)
    - **Metric**: `cosine`
4. Copy your API key from the console (API Keys section)

**⚠️ CRITICAL**: Your Pinecone index dimensions MUST match your OpenAI embedding dimensions. We're using `512` dimensions for `text-embedding-3-small`.

**Learn more:**
- [Pinecone Documentation](https://docs.pinecone.io/guides/get-started/overview)
- [Pinecone Node.js SDK](https://www.npmjs.com/package/@pinecone-database/pinecone) (version `6.1.0` used in this project)

---

## Part 3: Environment Configuration

**Add both API keys to your `.env` or `.env.local` file:**

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Pinecone Configuration
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_INDEX=rag-tutorial
```

**Where to get these:**
- **OPENAI_API_KEY**: OpenAI Platform → API Keys
- **PINECONE_API_KEY**: Pinecone console → API Keys
- **PINECONE_INDEX**: The name you chose when creating your index (`rag-tutorial`)

---

## Understanding the Code Structure

### OpenAI Client (`app/libs/openai/openai.ts`)

This file is already configured and exports the OpenAI client:

```typescript
import OpenAI from 'openai';

export const openaiClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
});
```

### Pinecone Client (`app/libs/pinecone.ts`)

Let's understand the implementation. Open `app/libs/pinecone.ts` to see the complete code:

**1. Client Initialization:**

```typescript
import { Pinecone } from '@pinecone-database/pinecone';
import { openaiClient } from '../libs/openai/openai';

export const pineconeClient = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY as string,
});
```

This creates ONE connection that your entire app shares. It's more efficient than creating new connections each time.

**2. The searchDocuments Function:**

```typescript
export const searchDocuments = async (
	query: string,
	topK: number = 3
): Promise<ScoredPineconeRecord<RecordMetadata>[]> => {
	// Get reference to your index
	const index = pineconeClient.Index(process.env.PINECONE_INDEX!);

	// Convert query to embedding using OpenAI
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		dimensions: 512,
		input: query,
	});

	const embedding = queryEmbedding.data[0].embedding;

	// Search Pinecone for similar vectors
	const docs = await index.query({
		vector: embedding,
		topK,
		includeMetadata: true,
	});

	return docs.matches;
};
```

---

## Key Concepts Explained

### Client vs. Index

-   **Client**: The connection to Pinecone (authenticate once, reuse everywhere)
-   **Index**: A specific vector database (like a table in a traditional database)

Think of it like:
-   Client = Database connection pool
-   Index = Specific table you want to query

### The Search Flow

```typescript
1. Get embedding from OpenAI (convert text → vector)
2. Pass embedding to Pinecone (search for similar vectors)
3. Pinecone finds similar vectors using cosine similarity
4. Returns documents with similarity scores (0-1, higher = more similar)
```

### Understanding the Query Parameters

When you query Pinecone:

1. **vector**: The embedding to search with (512 dimensions in our case)
2. **topK**: How many results to return (default 3, try 5-10 for more results)
3. **includeMetadata**: Whether to return the document text/metadata (we need this!)

The response contains:
-   **id**: Unique document identifier
-   **score**: Similarity score (0-1, where 1 = identical)
-   **metadata**: The actual text content and any other data we stored

---

## Testing Your Setup

Let's verify everything works. First, make sure your `.env` file has both keys:

```bash
OPENAI_API_KEY=sk-proj-...
PINECONE_API_KEY=...
PINECONE_INDEX=rag-tutorial
```

Then try importing the client in Node.js:

```typescript
import { pineconeClient, searchDocuments } from './app/libs/pinecone';

// This should not throw an error
console.log('Pinecone client initialized:', !!pineconeClient);
```

**Common Issues:**

- ❌ `OPENAI_API_KEY is missing` → Check your .env file
- ❌ `PINECONE_API_KEY is missing` → Check your .env file
- ❌ `Dimensions mismatch` → Pinecone index must be 512 dimensions
- ❌ `Index not found` → Verify your index name in Pinecone console

---

## Understanding Embedding Dimensions

Notice we use `dimensions: 512` in our code:

```typescript
const queryEmbedding = await openaiClient.embeddings.create({
	model: 'text-embedding-3-small',
	dimensions: 512,  // Must match Pinecone index!
	input: query,
});
```

**Why 512 dimensions?**
- Smaller than default 1536 = faster and cheaper
- Still highly accurate for most use cases
- Reduces storage costs in Pinecone
- Faster similarity search

**CRITICAL**: Your Pinecone index dimensions must match this value. If you created your index with different dimensions, update the code to match.

---

## Challenge: Understanding Embedding Dimensions

Before moving on, it's critical to understand how embedding dimensions affect your RAG system. This decision impacts cost, performance, and accuracy.

### Your Challenge

Create a document (markdown, Google Doc, or notes) that answers these questions:

**1. Content Type Analysis**

For each content type below, what embedding dimensions would you choose and why?

- **LinkedIn Posts** (short, casual, 1-3 paragraphs)
  - Recommended dimensions: ?
  - Reasoning: ?

- **Legal Documents** (long, technical, precise language)
  - Recommended dimensions: ?
  - Reasoning: ?

- **Product Reviews** (mixed sentiment, varied length)
  - Recommended dimensions: ?
  - Reasoning: ?

- **Code Documentation** (technical, structured)
  - Recommended dimensions: ?
  - Reasoning: ?

**2. Image Embeddings**

Research how image embeddings differ from text embeddings:
- What models generate image embeddings? (Hint: CLIP, ResNet)
- What dimension ranges are typical for images?
- How do image embedding dimensions compare to text?

**3. The Dimension Trade-off Matrix**

Create a table comparing dimensions across these factors:

| Dimensions | Accuracy | Speed | Storage Cost | Use Case |
|------------|----------|-------|--------------|----------|
| 256        | ?        | ?     | ?            | ?        |
| 512        | ?        | ?     | ?            | ?        |
| 1536       | ?        | ?     | ?            | ?        |
| 3072       | ?        | ?     | ?            | ?        |

**4. Real-World Scenario**

You're building a RAG system for a legal tech company that handles:
- Short case summaries (200-500 words)
- Full legal opinions (5,000-20,000 words)
- Case law citations (very short, highly precise)

What dimensions would you choose for each? Would you use different Pinecone indexes? Why or why not?

**5. Cost Analysis**

Calculate the storage difference between dimensions:
- You have 100,000 documents
- Each dimension is a 32-bit float (4 bytes)
- Compare storage for 512 vs 1536 vs 3072 dimensions

**Helpful Resources:**
- [OpenAI Embeddings Guide](https://developers.openai.com/api/docs/guides/embeddings)
- [Pinecone Performance Guide](https://docs.pinecone.io/guides/operations/performance-tuning)
- [CLIP Model for Images](https://openai.com/index/clip/)

### Submission

Save your analysis document and keep it as a reference. Understanding these trade-offs will help you make informed decisions in production systems.

**Estimated time:** 30-45 minutes

---

## What's Next?

Excellent! You now have:
- ✅ OpenAI API configured for embeddings and chat
- ✅ Pinecone vector database configured
- ✅ A `searchDocuments()` function ready to use
- ✅ Understanding of embedding dimension trade-offs

---

## Quick Reference

**OpenAI SDK Documentation:**
- [OpenAI Node.js SDK GitHub](https://github.com/openai/openai-node)
- [Embeddings API Reference](https://platform.openai.com/docs/api-reference/embeddings)
- [Chat Completions API Reference](https://platform.openai.com/docs/api-reference/chat)

**Pinecone SDK Documentation:**
- [Pinecone Node.js SDK](https://docs.pinecone.io/reference/sdks/node/overview)
- [Query API Reference](https://docs.pinecone.io/reference/api/data-plane/query)
- [Best Practices](https://docs.pinecone.io/troubleshooting/best-practices)

---

## Video Walkthrough

Watch the complete setup of OpenAI and Pinecone step-by-step:

<iframe src="https://share.descript.com/embed/eDhPxpnPLKa" width="640" height="360" frameborder="0" allowfullscreen></iframe>
