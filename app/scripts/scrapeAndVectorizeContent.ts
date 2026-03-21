/**
 * CONTENT SCRAPING AND VECTORIZATION SCRIPT
 *
 * This script automates the process of scraping fresh content and adding it
 * to the knowledge base for RAG (Retrieval-Augmented Generation).
 *
 * Process:
 * 1. Uses the ContentScraper service to scrape configured content sources
 * 2. Processes and cleans the content
 * 3. Vectorizes each piece of content using OpenAI embeddings
 * 4. Stores the vectors in Pinecone for retrieval
 *
 * Usage:
 * - Run manually: `yarn scrape-content`
 * - Schedule with cron for automatic updates
 */

import * as path from "path";
import * as fs from "fs";
import dotenv from "dotenv";

// Load environment variables from the project root FIRST
const rootDir = path.resolve(__dirname, "../..");
const envPath = path.join(rootDir, ".env");
const envLocalPath = path.join(rootDir, ".env.local");

// Try loading .env files in order of priority
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Validate required environment variables
const requiredEnvVars = ["OPENAI_API_KEY", "PINECONE_API_KEY"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars);
  console.error(
    "Please check your .env or .env.local file in the project root",
  );
  process.exit(1);
}

import { DataProcessor } from "../libs/dataProcessor";
import { openaiClient } from "../libs/openai/openai";
import { pineconeClient } from "../libs/pinecone";

/**
 * Simple function to scrape URLs and vectorize content to Pinecone
 */
async function scrapeAndVectorize(urls: string[]) {
  console.log("Starting content scraping and vectorization...");
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Step 1: Scrape and chunk the content
    console.log(`\n📥 Scraping ${urls.length} URLs...`);
    const processor = new DataProcessor();
    const chunks = await processor.processUrls(urls);

    if (chunks.length === 0) {
      console.log("No content found to process");
      return;
    }

    console.log(`\n✅ Created ${chunks.length} chunks from content`);

    // Step 2: Generate embeddings and upload to Pinecone
    console.log("\n🔄 Generating embeddings and uploading to Pinecone...");
    const indexName = process.env.PINECONE_INDEX;
    if (!indexName) {
      throw new Error("PINECONE_INDEX environment variable not set");
    }

    const index = pineconeClient.Index(indexName);
    const batchSize = 100;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          chunks.length / batchSize,
        )}...`,
      );

      try {
        // Generate embeddings for the batch
        const embeddingResponse = await openaiClient.embeddings.create({
          model: "text-embedding-3-small",
          dimensions: 512,
          input: batch.map((chunk) => chunk.content),
        });

        // Prepare vectors for Pinecone
        const vectors = batch.map((chunk, idx) => ({
          id: `${chunk.metadata.url}-${chunk.metadata.chunkIndex}`,
          values: embeddingResponse.data[idx].embedding,
          metadata: {
            text: chunk.content,
            url: chunk.metadata.url || "",
            title: chunk.metadata.title || "",
            chunkIndex: chunk.metadata.chunkIndex || 0,
            totalChunks: chunk.metadata.totalChunks || 0,
          },
        }));

        // Upload to Pinecone
        await index.upsert(vectors);
        successCount += batch.length;
        console.log(`✅ Uploaded ${batch.length} vectors`);
      } catch (error) {
        failCount += batch.length;
        console.error(`❌ Failed to process batch:`, error);
      }
    }

    // Print summary
    console.log("\n📊 SUMMARY");
    console.log("==================");
    console.log(`Total chunks: ${chunks.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Completed at: ${new Date().toISOString()}`);
  } catch (error) {
    console.error("❌ Critical error:", error);
    throw error;
  }
}

async function main() {
  // Validated URLs that work with the scraper
  const urls = [
    // React (Top tier - rich content)
    "https://react.dev/learn",
    "https://react.dev/reference/react/useState",
    "https://react.dev/reference/react/useEffect",

    // Next.js (Top tier)
    "https://nextjs.org/docs/getting-started",
    "https://nextjs.org/docs/app/building-your-application/routing",
    "https://nextjs.org/docs/app/building-your-application/data-fetching",

    // TypeScript (Top tier)
    "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",

    // Vercel AI SDK (for agents)
    "https://sdk.vercel.ai/docs/ai-sdk-core/generating-text",
    "https://github.com/vercel/ai",

    // Pinecone (GitHub README - works great!)
    "https://github.com/pinecone-io/pinecone-ts-client",

    "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd",
    "https://www.nimh.nih.gov/health/topics/depression",
    "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
  ];

  await scrapeAndVectorize(urls);
}

// Execute main function with error handling
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
