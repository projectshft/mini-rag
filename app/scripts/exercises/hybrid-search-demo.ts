/**
 * HYBRID SEARCH DEMO
 *
 * A complete demo showing sparse + dense vectors in Pinecone.
 *
 * Usage:
 *   npx ts-node app/scripts/exercises/hybrid-search-demo.ts create   # Create the index
 *   npx ts-node app/scripts/exercises/hybrid-search-demo.ts upsert   # Upload documents
 *   npx ts-node app/scripts/exercises/hybrid-search-demo.ts search   # Run search comparisons
 *   npx ts-node app/scripts/exercises/hybrid-search-demo.ts cleanup  # Delete demo data
 *   npx ts-node app/scripts/exercises/hybrid-search-demo.ts all      # Run everything
 *
 * Prerequisites:
 *   - OPENAI_API_KEY in .env
 *   - PINECONE_API_KEY in .env
 */

import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

dotenv.config();

const DEMO_INDEX_NAME = 'hybrid-demo';
const DEMO_DIMENSIONS = 512;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Sample documents about React
const documents = [
  {
    id: 'hybrid-demo-1',
    text: 'React.memo is a higher-order component that prevents re-renders when props are unchanged.',
  },
  {
    id: 'hybrid-demo-2',
    text: 'The useState hook lets you add state to functional components in React.',
  },
  {
    id: 'hybrid-demo-3',
    text: 'Performance optimization in React involves memoization and careful state management.',
  },
  {
    id: 'hybrid-demo-4',
    text: 'useMemo caches expensive calculations between re-renders to improve performance.',
  },
  {
    id: 'hybrid-demo-5',
    text: 'Redux is a state management library often used with React applications.',
  },
];

interface SparseVector {
  indices: number[];
  values: number[];
}

// ============================================================
// EMBEDDING FUNCTIONS
// ============================================================

async function createDenseEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    dimensions: DEMO_DIMENSIONS,
    input: text,
  });
  return response.data[0].embedding;
}

async function createSparseEmbeddings(
  texts: string[],
  inputType: 'passage' | 'query'
): Promise<SparseVector[]> {
  const response = await pinecone.inference.embed('pinecone-sparse-english-v0', texts, {
    inputType,
    truncate: 'END',
  });

  return response.data.map((item) => {
    const sparseItem = item as {
      vectorType?: string;
      sparseIndices?: number[];
      sparseValues?: number[];
    };

    if (sparseItem.vectorType === 'sparse' && sparseItem.sparseIndices && sparseItem.sparseValues) {
      return {
        indices: sparseItem.sparseIndices,
        values: sparseItem.sparseValues,
      };
    }
    return { indices: [], values: [] };
  });
}

// ============================================================
// COMMANDS
// ============================================================

async function createIndex() {
  console.log('='.repeat(60));
  console.log('STEP 1: CREATE INDEX');
  console.log('='.repeat(60));

  // Check if index already exists
  const existingIndexes = await pinecone.listIndexes();
  const exists = existingIndexes.indexes?.some((idx) => idx.name === DEMO_INDEX_NAME);

  if (exists) {
    console.log(`\nIndex "${DEMO_INDEX_NAME}" already exists.`);
    console.log('To recreate, delete it first in the Pinecone console.');
    return;
  }

  console.log(`\nCreating index "${DEMO_INDEX_NAME}"...`);
  console.log(`  - Dimensions: ${DEMO_DIMENSIONS}`);
  console.log(`  - Metric: dotproduct (required for hybrid search)`);

  await pinecone.createIndex({
    name: DEMO_INDEX_NAME,
    dimension: DEMO_DIMENSIONS,
    metric: 'dotproduct',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1',
      },
    },
    waitUntilReady: true,
  });

  console.log('\nIndex created successfully!');
  console.log('\nWhy dotproduct?');
  console.log('  Hybrid search combines dense and sparse scores.');
  console.log('  dotproduct allows additive scoring (dense + sparse).');
  console.log('  cosine normalizes vectors, which breaks sparse scoring.');
}

async function upsertDocuments() {
  console.log('='.repeat(60));
  console.log('STEP 2: UPSERT DOCUMENTS');
  console.log('='.repeat(60));

  const index = pinecone.Index(DEMO_INDEX_NAME);

  console.log('\nCreating embeddings for', documents.length, 'documents...\n');

  // Get sparse embeddings for all docs
  const allTexts = documents.map((d) => d.text);
  const sparseEmbeddings = await createSparseEmbeddings(allTexts, 'passage');

  const vectors = [];
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    console.log(`[${i + 1}/${documents.length}] "${doc.text.substring(0, 50)}..."`);

    const dense = await createDenseEmbedding(doc.text);
    const sparse = sparseEmbeddings[i];

    // Show first document's vectors
    if (i === 0) {
      console.log('\n  DENSE (first 5 values):', dense.slice(0, 5).map((v) => v.toFixed(4)).join(', '));
      console.log('  SPARSE indices:', sparse.indices.slice(0, 5).join(', '), '...');
      console.log('  SPARSE values:', sparse.values.slice(0, 5).map((v) => v.toFixed(3)).join(', '), '...');
      console.log('');
    }

    vectors.push({
      id: doc.id,
      values: dense,
      sparseValues: sparse,
      metadata: { text: doc.text },
    });
  }

  console.log('\nUpserting to Pinecone...');
  await index.upsert(vectors);
  console.log('Done! Upserted', vectors.length, 'documents with both dense and sparse vectors.');
}

async function runSearch() {
  console.log('='.repeat(60));
  console.log('STEP 3: SEARCH COMPARISON');
  console.log('='.repeat(60));

  const index = pinecone.Index(DEMO_INDEX_NAME);

  // Search 1: Semantic query
  const query1 = 'How to prevent re-renders in React?';
  console.log('\n--- Query 1 (semantic):', query1, '---\n');

  const q1Dense = await createDenseEmbedding(query1);
  const [q1Sparse] = await createSparseEmbeddings([query1], 'query');

  console.log('DENSE ONLY:');
  const denseResults1 = await index.query({ vector: q1Dense, topK: 3, includeMetadata: true });
  for (const match of denseResults1.matches) {
    console.log(`  [${match.score?.toFixed(3)}] ${match.metadata?.text}`);
  }

  console.log('\nHYBRID (dense + sparse):');
  const hybridResults1 = await index.query({
    vector: q1Dense,
    sparseVector: q1Sparse,
    topK: 3,
    includeMetadata: true,
  });
  for (const match of hybridResults1.matches) {
    console.log(`  [${match.score?.toFixed(3)}] ${match.metadata?.text}`);
  }

  // Search 2: Exact term query
  const query2 = 'React.memo';
  console.log('\n--- Query 2 (exact term):', query2, '---\n');

  const q2Dense = await createDenseEmbedding(query2);
  const [q2Sparse] = await createSparseEmbeddings([query2], 'query');

  console.log('DENSE ONLY:');
  const denseResults2 = await index.query({ vector: q2Dense, topK: 3, includeMetadata: true });
  for (const match of denseResults2.matches) {
    const hasExact = (match.metadata?.text as string)?.includes('React.memo');
    console.log(`  [${match.score?.toFixed(3)}] ${hasExact ? '* ' : '  '}${match.metadata?.text}`);
  }

  console.log('\nHYBRID (dense + sparse):');
  const hybridResults2 = await index.query({
    vector: q2Dense,
    sparseVector: q2Sparse,
    topK: 3,
    includeMetadata: true,
  });
  for (const match of hybridResults2.matches) {
    const hasExact = (match.metadata?.text as string)?.includes('React.memo');
    console.log(`  [${match.score?.toFixed(3)}] ${hasExact ? '* ' : '  '}${match.metadata?.text}`);
  }

  console.log('\n* = contains exact term "React.memo"');
  console.log('\nNotice: Hybrid search gives higher scores to exact term matches!');
}

async function cleanup() {
  console.log('='.repeat(60));
  console.log('CLEANUP: DELETE DEMO DATA');
  console.log('='.repeat(60));

  const index = pinecone.Index(DEMO_INDEX_NAME);

  console.log('\nDeleting demo vectors...');
  await index.deleteMany(documents.map((d) => d.id));
  console.log('Done!');

  console.log('\nNote: The index itself still exists.');
  console.log('To delete the index, use the Pinecone console or:');
  console.log(`  await pinecone.deleteIndex('${DEMO_INDEX_NAME}')`);
}

async function runAll() {
  await createIndex();
  console.log('\nWaiting for index to be ready...\n');
  await new Promise((r) => setTimeout(r, 3000));

  await upsertDocuments();
  console.log('\nWaiting for vectors to be indexed...\n');
  await new Promise((r) => setTimeout(r, 2000));

  await runSearch();

  console.log('\n' + '='.repeat(60));
  console.log('DEMO COMPLETE');
  console.log('='.repeat(60));
  console.log('\nKey takeaways:');
  console.log('  1. Dense vectors capture semantic meaning');
  console.log('  2. Sparse vectors preserve exact keywords');
  console.log('  3. Hybrid search combines both for better results');
  console.log('  4. Use dotproduct metric for hybrid indexes');
  console.log('\nRun "cleanup" command to remove demo data.');
}

// ============================================================
// MAIN
// ============================================================

const command = process.argv[2] || 'all';

const commands: Record<string, () => Promise<void>> = {
  create: createIndex,
  upsert: upsertDocuments,
  search: runSearch,
  cleanup: cleanup,
  all: runAll,
};

if (!commands[command]) {
  console.log('Usage: npx ts-node app/scripts/exercises/hybrid-search-demo.ts <command>');
  console.log('');
  console.log('Commands:');
  console.log('  create   - Create the hybrid-demo index');
  console.log('  upsert   - Upload documents with dense + sparse vectors');
  console.log('  search   - Run search comparisons');
  console.log('  cleanup  - Delete demo vectors');
  console.log('  all      - Run everything (default)');
  process.exit(1);
}

commands[command]().catch(console.error);
