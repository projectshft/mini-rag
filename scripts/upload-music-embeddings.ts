/**
 * Upload pre-computed music embeddings to Pinecone
 *
 * Usage:
 *   npx tsx scripts/upload-music-embeddings.ts
 *
 * Prerequisites:
 *   1. Run: python scripts/download-music-embeddings.py
 *   2. Create a Pinecone index named "music-search" with:
 *      - Dimensions: 512 (CLAP embeddings)
 *      - Metric: cosine
 *   3. Set PINECONE_API_KEY in .env
 */

import { Pinecone } from "@pinecone-database/pinecone";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const INDEX_NAME = "music-search";
const BATCH_SIZE = 100;

interface MusicVector {
  id: string;
  values: number[];
  metadata: {
    title: string;
    artist: string;
    spotify_url?: string;
    youtube_url?: string;
    spotify_id?: string;
    description?: string;
  };
}

interface EmbeddingsFile {
  dimensions: number;
  count: number;
  source: string;
  model: string;
  vectors: MusicVector[];
}

async function main() {
  // Load embeddings from JSON file
  const dataPath = path.join(__dirname, "..", "data", "music-embeddings.json");

  if (!fs.existsSync(dataPath)) {
    console.error("Error: music-embeddings.json not found!");
    console.error("Run this first: python scripts/download-music-embeddings.py");
    process.exit(1);
  }

  console.log("Loading embeddings from:", dataPath);
  const data: EmbeddingsFile = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  console.log(`\nLoaded ${data.count} vectors`);
  console.log(`Dimensions: ${data.dimensions}`);
  console.log(`Source: ${data.source}`);
  console.log(`Model: ${data.model}`);

  // Initialize Pinecone
  if (!process.env.PINECONE_API_KEY) {
    console.error("Error: PINECONE_API_KEY not set in .env");
    process.exit(1);
  }

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  // Check if index exists
  const indexes = await pc.listIndexes();
  const indexExists = indexes.indexes?.some((idx) => idx.name === INDEX_NAME);

  if (!indexExists) {
    console.log(`\nCreating index "${INDEX_NAME}"...`);
    await pc.createIndex({
      name: INDEX_NAME,
      dimension: data.dimensions,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    // Wait for index to be ready
    console.log("Waiting for index to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }

  const index = pc.Index(INDEX_NAME);

  // Upload in batches
  console.log(`\nUploading ${data.vectors.length} vectors in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < data.vectors.length; i += BATCH_SIZE) {
    const batch = data.vectors.slice(i, i + BATCH_SIZE);

    await index.upsert(
      batch.map((v) => ({
        id: v.id,
        values: v.values,
        metadata: v.metadata,
      }))
    );

    const progress = Math.min(i + BATCH_SIZE, data.vectors.length);
    console.log(`  Uploaded ${progress}/${data.vectors.length} vectors`);
  }

  console.log("\nUpload complete!");

  // Verify
  const stats = await index.describeIndexStats();
  console.log(`\nIndex stats:`);
  console.log(`  Total vectors: ${stats.totalRecordCount}`);
  console.log(`  Dimensions: ${stats.dimension}`);
}

main().catch(console.error);
