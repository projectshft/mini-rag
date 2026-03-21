import { NextRequest, NextResponse } from "next/server";
import { DataProcessor } from "@/app/libs/dataProcessor";
import { openaiClient } from "@/app/libs/openai/openai";
import { pineconeClient } from "@/app/libs/pinecone";
import { z } from "zod";

const uploadDocumentSchema = z.object({
  urls: z.array(z.string().url()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    // TODO: Step 1 - Parse and validate the request body
    // Use uploadDocumentSchema.parse() to validate the incoming request
    // Extract the 'urls' array from the parsed body
    const body = await req.json();

    const parsed = uploadDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }
    const { urls } = parsed.data;
    console.log(`Received request to upload ${urls.length} URLs`);
    console.log(parsed.data.urls);
    // TODO: Step 2 - Scrape and chunk the content
    // Create a new DataProcessor instance
    // Use processor.processUrls() to scrape and chunk the URLs
    // This returns an array of text chunks with metadata

    const processor = new DataProcessor();

    const chunks = await processor.processUrls(urls);

    // TODO: Step 3 - Check if we got any content
    // If chunks.length === 0, return an error response
    // Status should be 400 with appropriate error message
    if (chunks.length === 0) {
      return NextResponse.json({ error: "Chunks not found" }, { status: 400 });
    }

    // TODO: Step 4 - Get Pinecone index
    // Use pineconeClient.Index() to get your index
    // The index name comes from process.env.PINECONE_INDEX

    const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
    // TODO: Step 5 - Process chunks in batches
    // Pinecone recommends batching uploads (100 at a time)
    // Loop through chunks in batches

    const BATCH_SIZE = 100;
    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      try {
        // TODO: Step 6 - Generate embeddings for each batch
        // Use openaiClient.embeddings.create()
        // Model: 'text-embedding-3-small'
        // Dimensions: 512
        // Input: array of chunk.content strings from the batch
        const embeddingResponse = await openaiClient.embeddings.create({
          model: "text-embedding-3-small",
          input: batch.map((chunk) => chunk.content),
          dimensions: 512,
        });
        // TODO: Step 7 - Prepare vectors for Pinecone
        // Map each chunk to a vector object with:
        // - id: chunk.id
        // - values: the embedding array from embeddingResponse.data[idx].embedding
        // - metadata: { text: chunk.content, ...chunk.metadata }
        // IMPORTANT: Include text: chunk.content so the actual text is searchable!
        const vectors = batch.map((chunk, index) => ({
          id: `${chunk.metadata.source}-${chunk.metadata.chunkIndex}`,
          values: embeddingResponse.data[index].embedding,
          metadata: {
            text: chunk.content,
            url: chunk.metadata.url,
            title: chunk.metadata.title,
            chunkIndex: chunk.metadata.chunkIndex,
            totalChunks: chunk.metadata.totalChunks,
          },
        }));
        // TODO: Step 8 - Upload to Pinecone
        // Use index.upsert() to upload the vectors array
        // Increment successCount by batch.length
        await index.upsert(vectors);
        successCount += batch.length;
        console.log(
          `Uploaded batch ${i / BATCH_SIZE + 1}: ${vectors.length} vectors`,
        );
      } catch (error) {
        console.error(`Error processing batch ${i / BATCH_SIZE + 1}:`, error);
        failCount += batch.length;
      }
    }

    // Print summary
    console.log("\n📊 SUMMARY");
    console.log("==================");
    console.log(`Total chunks: ${chunks.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Completed at: ${new Date().toISOString()}`);

    // TODO: Step 9 - Return success response
    // Return NextResponse.json() with:
    // - success: true
    // - chunksProcessed: chunks.length
    // - vectorsUploaded: successCount
    // - status: 200
    return NextResponse.json(
      {
        success: true,
        chunksProcessed: chunks.length,
        vectorsUploaded: successCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading documents:", error);
    return NextResponse.json(
      { error: "Failed to upload documents" },
      { status: 500 },
    );
  }
}
