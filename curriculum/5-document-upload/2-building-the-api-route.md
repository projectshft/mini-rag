# Building the Document Upload Pipeline

Now that you have Pinecone configured, it's time to fill your vector database with actual content! This is where your RAG system gets its knowledge.

---

## Video Walkthrough

Watch this introduction to the upload interface:

<iframe src="https://share.descript.com/embed/vXKQ7RBncMc" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Build

By the end of this module, you'll have:
- An API route that accepts URLs (`/api/upload-document`)
- A pipeline that scrapes, chunks, and vectorizes content
- Documents uploaded to Pinecone and ready for retrieval

**Note**: The UI also supports a `/api/upload-text` route for uploading raw text (already implemented as a reference). This module focuses on the URL route, which is more complex because it requires web scraping.

---

## The Big Picture: The Upload Pipeline

Let's understand the complete flow for the **URL upload route**:

```
URLs from User
    ↓
1. Scrape web content (HTML → text)
    ↓
2. Chunk text into smaller pieces
    ↓
3. Generate embeddings (text → vectors)
    ↓
4. Upload to Pinecone
    ↓
Content Ready for RAG!
```

**For the text upload route** (already implemented at `/api/upload-text`):
```
Raw Text from User
    ↓
1. Chunk text into smaller pieces
    ↓
2. Generate embeddings (text → vectors)
    ↓
3. Upload to Pinecone
    ↓
Content Ready for RAG!
```

This is the "write" side of your RAG system. The "read" side (retrieval) comes later.

---

## Why This Pipeline Exists

**Why not just save the whole webpage?**
- Too much context for the LLM (token limits!)
- Harder to find relevant sections
- Less precise retrieval

**Why chunk the content?**
- Smaller chunks = more focused context
- Better retrieval (find exact relevant sections)
- Fits within LLM context windows

**Why batch upload?**
- API rate limits
- More efficient
- Better error handling

---

## Understanding the Pieces

### 1. The DataProcessor

Located at: `app/libs/dataProcessor.ts`

This class handles:
- **Scraping**: Fetching HTML and extracting clean text
- **Chunking**: Breaking text into ~500 character pieces with overlap

```typescript
// How it works (simplified)
const processor = new DataProcessor();
const chunks = await processor.processUrls(['https://example.com']);

// Returns array of chunks:
[
  {
    id: "url-chunk-0",
    content: "First 500 chars of text...",
    metadata: {
      url: "https://example.com",
      title: "Page Title",
      chunkIndex: 0,
      totalChunks: 5
    }
  },
  // ... more chunks
]
```

**Key concept: Overlap**
Chunks overlap by ~50 characters to maintain context at boundaries. This ensures important information isn't split awkwardly.

### 2. OpenAI Embeddings

Embeddings convert text to vectors (arrays of numbers that capture meaning).

```typescript
// What happens under the hood
const response = await openaiClient.embeddings.create({
  model: 'text-embedding-3-small',
  input: ['Hello world', 'Machine learning basics']
});

// Returns:
[
  { embedding: [0.1, -0.3, 0.8, ...] }, // 1536 numbers for "Hello world"
  { embedding: [0.2, 0.1, -0.5, ...] }  // 1536 numbers for "Machine learning"
]
```

**Why 'text-embedding-3-small'?**
- Fast and efficient (512 dimensions instead of 1536)
- Good quality for most use cases
- Lower cost than larger models

### 3. Batching Strategy

Pinecone recommends uploading in batches of 100:

```typescript
// Why batch?
const allChunks = 500; // chunks to upload
const batchSize = 100;

// Without batching: 500 API calls
// With batching: 5 API calls (much faster!)

for (let i = 0; i < chunks.length; i += batchSize) {
  const batch = chunks.slice(i, i + batchSize);
  // Process batch...
}
```

---

## The API Route Structure

Your route lives at: `app/api/upload-document/route.ts`

**What it needs to do:**
1. Validate incoming URLs (Zod schema)
2. Scrape and chunk content
3. Generate embeddings for all chunks
4. Format vectors for Pinecone
5. Upload in batches
6. Return success/failure

**Why an API route?**
- Can be called from the frontend UI
- Can be triggered by scripts
- Keeps business logic separate from UI
- Easy to test independently

---

## Understanding Vector Metadata

When you upload to Pinecone, each vector includes metadata:

```typescript
{
  id: "unique-identifier",
  values: [0.1, -0.3, ...], // The embedding
  metadata: {
    text: "The actual chunk content",
    url: "https://source-url.com",
    title: "Document Title",
    chunkIndex: 0,
    totalChunks: 10
  }
}
```

**Why metadata matters:**
- `text`: What you show to the LLM as context
- `url`: For attribution/sourcing
- `title`: For display to users
- `chunkIndex`: To reconstruct full documents if needed

Pinecone indexes the vector but returns the metadata when querying!

---

## Your Challenge

Open `app/api/upload-document/route.ts` and you'll see 9 TODO steps.

### Implementation Steps

**Step 1: Validate the Request**
```typescript
// Parse the request body
const body = await req.json();

// Validate with Zod
const parsed = uploadDocumentSchema.parse(body);
const { urls } = parsed;
```

**Step 2: Scrape and Chunk**
```typescript
const processor = new DataProcessor();
const chunks = await processor.processUrls(urls);
```

**Step 3-5: Set Up for Upload**
- Check if chunks exist
- Get Pinecone index
- Set up batch processing

**Step 6-7: Generate Embeddings and Format**
For each batch:
- Generate embeddings for all chunk contents
- Map chunks + embeddings to Pinecone vector format

**Step 8-9: Upload and Respond**
- Upload each batch to Pinecone
- Track success count
- Return results

### Hints

**For embeddings:**
```typescript
const embeddingResponse = await openaiClient.embeddings.create({
  model: 'text-embedding-3-small',
  input: batch.map(chunk => chunk.content) // Array of strings
});

// Access embeddings:
embeddingResponse.data[0].embedding // First embedding
embeddingResponse.data[1].embedding // Second embedding
```

**For Pinecone upload:**
```typescript
await index.upsert(vectors);
```

**For creating unique IDs:**
```typescript
// Combine URL and chunk index for uniqueness
const id = `${chunk.metadata.url}-${chunk.metadata.chunkIndex}`;
```

---

## Testing Your Implementation

### Using the Frontend
The UI (at `http://localhost:3000` after running `yarn dev`) has two upload modes:

**URL Mode:**
1. Select "URLs" tab
2. Enter URLs (one per line)
3. Click "Upload"
4. Check the response for success message

**Text Mode:**
1. Select "Raw Text" tab
2. Paste any text content
3. Click "Upload"
4. Check the response for success message

### Using curl

**Test URL upload:**
```bash
curl -X POST http://localhost:3000/api/upload-document \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://react.dev/learn",
      "https://nextjs.org/docs"
    ]
  }'
```

**Test text upload:**
```bash
curl -X POST http://localhost:3000/api/upload-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is sample text about React hooks. useState and useEffect are commonly used hooks."
  }'
```

### Verifying in Pinecone Console
1. Go to your Pinecone index
2. Check "Vectors" tab - should see new entries
3. Try the "Query" feature - search for test content

---

## Common Issues & Solutions

### "Dimension mismatch"
```
❌ Vector dimension (1536) doesn't match index (512)
```
**Fix**: Ensure you're using `text-embedding-3-small` with `dimensions: 512`

### "Rate limit exceeded"
```
❌ OpenAI rate limit error
```
**Fix**: Add delay between batches or reduce batch size

### "No content scraped"
```
❌ chunks.length === 0
```
**Fix**:
- Check URL is accessible
- Look at `dataProcessor.ts` - may need to adjust selectors
- Some sites block scraping

### "Metadata too large"
```
❌ Pinecone metadata size limit exceeded
```
**Fix**: Chunk text is too long. Reduce chunk size or trim metadata text field

---

## Understanding What You Built

Let's break down the flow:

**Request → Validation**
```typescript
uploadDocumentSchema.parse(body) // Zod validates structure
```
This ensures you only process valid URLs (proper format, array structure).

**Scraping → Chunking**
```typescript
processor.processUrls(urls) // Returns structured chunks
```
The processor fetches HTML, extracts text, and breaks it into manageable pieces with metadata.

**Text → Vectors**
```typescript
openaiClient.embeddings.create() // Converts meaning to numbers
```
OpenAI's model captures semantic meaning in a 512-dimensional space.

**Vectors → Database**
```typescript
index.upsert(vectors) // Stores in Pinecone
```
Your knowledge is now searchable by semantic similarity!

---

## Think Beyond the Exercise

Now that you understand the upload pipeline, consider these real-world challenges:

**1. Scale:** What if you need to upload 100,000 documents?
- How would you handle rate limits?
- Would you process synchronously or use a job queue?
- How do you track progress and handle partial failures?

**2. Updates:** What happens when a document changes?
- Do you re-upload the entire document?
- How do you delete old chunks when content is removed?
- How do you handle version history?

**3. Quality:** Not all content is worth indexing.
- How would you filter out low-quality pages (404s, login walls, ads)?
- What if a scrape returns gibberish or duplicates?
- Should you validate content before spending money on embeddings?

**4. Cost:** Embeddings aren't free.
- At $0.02 per 1M tokens, what's the cost of your knowledge base?
- When does it make sense to use a smaller/cheaper model?
- How do you avoid re-embedding unchanged content?

**There's no assignment here.** Just questions to think about as you build real systems.

---

## Bonus: Understanding the Text Upload Route

Want to see a simpler version of the upload pipeline? Check out `/api/upload-text/route.ts` - it's already implemented and shows the same flow without the web scraping complexity:

1. **Direct chunking** - Uses `chunkText()` from `app/libs/chunking.ts`
2. **Same embedding process** - Calls OpenAI with `text-embedding-3-small`
3. **Same Pinecone upload** - Uses `index.upsert()`

The main difference: it skips the DataProcessor scraping step since it receives text directly from the user. This is useful when you want to upload documentation, articles, or any text content without needing a URL.

---

## Solution Walkthrough

Watch this walkthrough of the document upload API route implementation:

<iframe src="https://share.descript.com/embed/tb6EgaRGjay" width="640" height="360" frameborder="0" allowfullscreen></iframe>

