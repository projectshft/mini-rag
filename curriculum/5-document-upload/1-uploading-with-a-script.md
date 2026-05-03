# Uploading Documents with a Script

Let's get content into your RAG system! We'll start with a simple script approach before building the API route.

---

## Video Walkthrough

Watch how to upload vectors to Pinecone:

<iframe src="https://share.descript.com/embed/Ypt5j0zCq3x" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

-   How to scrape URLs and create chunks
-   How to generate embeddings for chunks
-   How to upload vectors to Pinecone in batches
-   How to run the upload script

---

## The Upload Script

Located at: `app/scripts/scrapeAndVectorizeContent.ts`

This script handles the entire pipeline:

```
URLs → Scrape → Chunk → Embed → Upload to Pinecone
```

---

## Understanding the Script

### Main Function

```typescript
async function scrapeAndVectorize(urls: string[]) {
	// Step 1: Scrape and chunk
	const processor = new DataProcessor();
	const chunks = await processor.processUrls(urls);

	// Step 2: Generate embeddings and upload
	const index = pineconeClient.Index(process.env.PINECONE_INDEX);

	for (let i = 0; i < chunks.length; i += batchSize) {
		const batch = chunks.slice(i, i + batchSize);

		// Generate embeddings
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			input: batch.map((chunk) => chunk.content),
		});

		// Format vectors
		const vectors = batch.map((chunk, idx) => ({
			id: `${chunk.metadata.url}-${chunk.metadata.chunkIndex}`,
			values: embeddingResponse.data[idx].embedding,
			metadata: {
				text: chunk.content,
				url: chunk.metadata.url,
				title: chunk.metadata.title,
				chunkIndex: chunk.metadata.chunkIndex,
				totalChunks: chunk.metadata.totalChunks,
			},
		}));

		// Upload
		await index.upsert(vectors);
	}
}
```

**The flow:**

**Step 1: Scrape and Chunk**

```typescript
const processor = new DataProcessor();
const chunks = await processor.processUrls(urls);
```

DataProcessor:

-   Scrapes each URL
-   Extracts text content
-   Chunks with your `chunkText()` function
-   Returns array of chunks with metadata

**Step 2: Batch Processing**

```typescript
for (let i = 0; i < chunks.length; i += batchSize) {
	const batch = chunks.slice(i, i + batchSize);
	// ...
}
```

Why batches of 100?

-   OpenAI embedding API has limits
-   Pinecone performs better with batched upserts
-   Easier to track progress

**Step 3: Generate Embeddings**

```typescript
const embeddingResponse = await openaiClient.embeddings.create({
	model: 'text-embedding-3-small',
	input: batch.map((chunk) => chunk.content),
});
```

Sends 100 text chunks, gets back 100 embeddings (512-dimensional vectors).

**Step 4: Format Vectors**

```typescript
const vectors = batch.map((chunk, idx) => ({
	id: `${chunk.metadata.url}-${chunk.metadata.chunkIndex}`,
	values: embeddingResponse.data[idx].embedding,
	metadata: {
		text: chunk.content,
		url: chunk.metadata.url,
		// ...
	},
}));
```

Pinecone vector format:

-   `id`: Unique identifier
-   `values`: The embedding (512 numbers)
-   `metadata`: Stored alongside for retrieval

**Step 5: Upload**

```typescript
await index.upsert(vectors);
```

Upserts to Pinecone (insert or update if exists).

---

## Running the Script

### 1. Check Environment Variables

Ensure `.env.local` has:

```bash
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=your-index-name
```

### 2. Customize URLs

Edit the script:

```typescript
async function main() {
	const urls = [
		'https://react.dev/learn',
		'https://nextjs.org/docs',
		// Add your URLs here!
	];

	await scrapeAndVectorize(urls);
}
```

### 3. Run the Script

```bash
yarn scrape-content
```

Or directly:

```bash
npx ts-node app/scripts/scrapeAndVectorizeContent.ts
```

### 4. Watch the Output

```bash
📥 Scraping 8 URLs...
✅ Processed https://react.dev/learn: 47 chunks
✅ Processed https://nextjs.org/docs: 62 chunks
...

✅ Created 245 chunks from content

🔄 Generating embeddings and uploading to Pinecone...
Processing batch 1/3...
✅ Uploaded 100 vectors
Processing batch 2/3...
✅ Uploaded 100 vectors
Processing batch 3/3...
✅ Uploaded 45 vectors

📊 SUMMARY
==================
Total chunks: 245
Successful: 245
Failed: 0
Completed at: 2025-01-15T10:30:45.123Z
```

---

## Verifying the Upload

### Check Pinecone Dashboard

1. Go to https://app.pinecone.io
2. Select your index
3. Check vector count matches output
4. Try a test query

## Common Issues

### "No content found to process"

**Possible causes:**

-   URLs unreachable
-   Scraper blocked by website
-   Content parsing failed

**Debug:**

```typescript
const chunks = await processor.processUrls(urls);
console.log('Chunks:', chunks.length);
chunks.forEach((c) => console.log(c.content.substring(0, 100)));
```

### "Failed to process batch"

**Possible causes:**

-   OpenAI API key invalid
-   Rate limits hit
-   Network issues

**Debug:**
Check the error message:

```typescript
} catch (error) {
  console.error('Batch error:', error);
  // Look at the specific error
}
```

### "PINECONE_INDEX not set"

**Fix:**

```bash
# In .env.local
PINECONE_INDEX=your-index-name
```

### Script hangs

**Possible causes:**

-   Very large documents
-   Network timeout
-   Pinecone connection issue

**Fix:**
Add timeout or reduce batch size:

```typescript
const batchSize = 50; // Instead of 100
```

---

## Challenge: Automate Data Collection

Now that you can upload documents with a script, think about:

**How would you automate this to collect way more data?**

Ideas to consider:

1. **Sitemap Crawling**

    - Parse sitemap.xml files
    - Extract all URLs automatically
    - Process hundreds of pages

2. **Recursive Scraping**

    - Start with one page
    - Extract all links
    - Follow links to scrape entire site

3. **Scheduled Updates**

    - Run script daily with cron
    - Keep content fresh
    - Handle changed content

4. **Multiple Sources**

    - GitHub repos
    - Blog RSS feeds
    - Documentation sites
    - YouTube transcripts

5. **Deduplication**
    - Check if URL already exists
    - Only update if content changed
    - Avoid duplicate vectors

**Think about:**

-   How would you track what's been processed?
-   How would you handle rate limits?
-   How would you update existing content?
-   How would you scale to thousands of URLs?

We'll explore automating this in the next section when we build the API route!

---

## What You Learned

✅ How to use DataProcessor for scraping + chunking
✅ How to generate embeddings in batches
✅ How to format vectors for Pinecone
✅ How to upload with the script
✅ How to verify uploads worked

