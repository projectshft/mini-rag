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

// Sample documents - made-up data designed to show when sparse vs dense matters.
// Each group is semantically near-identical but has a distinct identifier, so
// dense search struggles to separate them and sparse (keyword) search wins.
const documents = [
  // Product SKUs - all Nike running shoes, so they look alike semantically.
  // Only sparse can pin the exact SKU the user typed.
  {
    id: 'sku-7292',
    text: 'Nike Air Zoom Pegasus 40 running shoe, mens, black/white. Product code SKU-7292.',
  },
  {
    id: 'sku-7293',
    text: 'Nike Air Zoom Pegasus 40 running shoe, mens, blue/grey. Product code SKU-7293.',
  },
  {
    id: 'sku-8146',
    text: 'Nike Pegasus Trail 4 running shoe, mens, olive green. Product code SKU-8146.',
  },
  {
    id: 'sku-6501',
    text: 'Nike Revolution 7 running shoe, womens, pink foam. Product code SKU-6501.',
  },
  // Software versions - patch notes read alike; sparse boosts the exact version.
  {
    id: 'pg-16-1',
    text: 'PostgreSQL 16.1 patched a security vulnerability in the query planner and fixed several minor bugs.',
  },
  {
    id: 'pg-15-2',
    text: 'PostgreSQL 15.2 fixed a bug in logical replication and improved error handling.',
  },
  {
    id: 'pg-14-9',
    text: 'PostgreSQL 14.9 addressed a memory leak in autovacuum and other stability issues.',
  },
  // Error codes - every connection error looks the same to dense search.
  {
    id: 'err-e4002',
    text: 'Error E-4002: connection pool exhausted. Increase the pool size or add retry logic.',
  },
  {
    id: 'err-e4001',
    text: 'Error E-4001: connection refused. Verify the database host and port are correct.',
  },
  {
    id: 'err-e4003',
    text: 'Error E-4003: connection timeout. The server did not respond within the timeout window.',
  },
  // API route versions - same resource, different version string.
  {
    id: 'api-v1-users',
    text: 'GET /api/v1/users returns a paginated list of users with basic fields.',
  },
  {
    id: 'api-v2-users',
    text: 'GET /api/v2/users adds filtering, sorting, and expanded user fields to the response.',
  },
  // Order numbers - nearly identical status lines; sparse pins the exact order.
  {
    id: 'ord-78433',
    text: 'Order ORD-2024-78433 shipped on March 3 and is expected to arrive within two days.',
  },
  {
    id: 'ord-78432',
    text: 'Order ORD-2024-78432 is being prepared for shipment from the warehouse.',
  },
  {
    id: 'ord-91055',
    text: 'Order ORD-2024-91055 was delivered and the customer left a five-star review.',
  },
];

interface SparseVector {
  indices: number[];
  values: number[];
}

// ============================================================
// EMBEDDING FUNCTIONS
// ============================================================

interface HybridEmbedding {
  dense: number[];
  sparse: SparseVector;
}

async function createHybridEmbeddings(
  texts: string[],
  inputType: 'passage' | 'query'
): Promise<HybridEmbedding[]> {
  // Get dense embeddings from OpenAI
  const denseResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    dimensions: DEMO_DIMENSIONS,
    input: texts,
  });

  // Get sparse embeddings from Pinecone
  const sparseResponse = await pinecone.inference.embed('pinecone-sparse-english-v0', texts, {
    inputType,
    truncate: 'END',
  });

  return texts.map((_, i) => {
    const sparseItem = sparseResponse.data[i] as {
      vectorType?: string;
      sparseIndices?: number[];
      sparseValues?: number[];
    };

    return {
      dense: denseResponse.data[i].embedding,
      sparse:
        sparseItem.vectorType === 'sparse' && sparseItem.sparseIndices && sparseItem.sparseValues
          ? { indices: sparseItem.sparseIndices, values: sparseItem.sparseValues }
          : { indices: [], values: [] },
    };
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

  const allTexts = documents.map((d) => d.text);
  const embeddings = await createHybridEmbeddings(allTexts, 'passage');

  const vectors = documents.map((doc, i) => {
    console.log(`[${i + 1}/${documents.length}] "${doc.text.substring(0, 50)}..."`);

    // Show first document's vectors
    if (i === 0) {
      console.log('\n  DENSE (first 5 values):', embeddings[i].dense.slice(0, 5).map((v) => v.toFixed(4)).join(', '));
      console.log('  SPARSE indices:', embeddings[i].sparse.indices.slice(0, 5).join(', '), '...');
      console.log('  SPARSE values:', embeddings[i].sparse.values.slice(0, 5).map((v) => v.toFixed(3)).join(', '), '...');
      console.log('');
    }

    return {
      id: doc.id,
      values: embeddings[i].dense,
      sparseValues: embeddings[i].sparse,
      metadata: { text: doc.text },
    };
  });

  console.log('\nUpserting to Pinecone...');
  await index.upsert(vectors);
  console.log('Done! Upserted', vectors.length, 'documents with both dense and sparse vectors.');
}

async function runSearch() {
  console.log('='.repeat(60));
  console.log('STEP 3: SEARCH COMPARISON');
  console.log('='.repeat(60));

  const index = pinecone.Index(DEMO_INDEX_NAME);

  // Helper to run and display a comparison
  async function compareSearch(query: string, exactTerm?: string) {
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`QUERY: "${query}"`);
    if (exactTerm) console.log(`Looking for exact term: "${exactTerm}"`);
    console.log('─'.repeat(50));

    const [embedding] = await createHybridEmbeddings([query], 'query');

    console.log('\n  DENSE ONLY (semantic meaning):');
    const denseResults = await index.query({ vector: embedding.dense, topK: 3, includeMetadata: true });
    for (const match of denseResults.matches) {
      const text = match.metadata?.text as string;
      const hasExact = exactTerm ? text?.toLowerCase().includes(exactTerm.toLowerCase()) : false;
      console.log(`    [${match.score?.toFixed(3)}] ${hasExact ? '✓ ' : '  '}${text?.substring(0, 70)}...`);
    }

    console.log('\n  HYBRID (semantic + keywords):');
    const hybridResults = await index.query({
      vector: embedding.dense,
      sparseVector: embedding.sparse,
      topK: 3,
      includeMetadata: true,
    });
    for (const match of hybridResults.matches) {
      const text = match.metadata?.text as string;
      const hasExact = exactTerm ? text?.toLowerCase().includes(exactTerm.toLowerCase()) : false;
      console.log(`    [${match.score?.toFixed(3)}] ${hasExact ? '✓ ' : '  '}${text?.substring(0, 70)}...`);
    }

    if (exactTerm) console.log(`\n  ✓ = contains "${exactTerm}"`);
  }

  // ============================================================
  // EXAMPLE 1: Product SKUs
  // Dense: every Nike running shoe looks alike semantically
  // Sparse: boosts the exact SKU the user typed
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 1: PRODUCT SKUs');
  console.log('Why it matters: all Nike running shoes look alike semantically.');
  console.log('Dense often returns the wrong SKU. Sparse boosts the exact one.');
  console.log('='.repeat(60));

  await compareSearch('What is SKU-7292?', 'SKU-7292');

  // ============================================================
  // EXAMPLE 2: Version Numbers
  // Dense: PostgreSQL patch notes are all semantically similar
  // Sparse: boosts the exact version (16.1 vs 15.2 vs 14.9)
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 2: VERSION NUMBERS');
  console.log('Why it matters: patch notes read alike, so dense may return 15.2 or 14.9.');
  console.log('Sparse boosts the exact version. Often the same results, higher confidence.');
  console.log('='.repeat(60));

  await compareSearch('What was fixed in PostgreSQL 16.1?', '16.1');

  // ============================================================
  // EXAMPLE 3: Error Codes
  // Dense: every connection error is semantically similar
  // Sparse: pins the exact code the user pasted
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 3: ERROR CODES');
  console.log('Why it matters: every connection error reads the same to dense search.');
  console.log('Sparse pins the exact code the user pasted.');
  console.log('='.repeat(60));

  await compareSearch('How do I fix error E-4002?', 'E-4002');

  // ============================================================
  // EXAMPLE 4: Order Numbers
  // Dense: status lines are near-identical
  // Sparse: you need THIS order, not a semantically similar one
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 4: ORDER NUMBERS');
  console.log('Why it matters: you need THIS order, not a semantically similar one.');
  console.log('Sparse boosts the exact order number to the top.');
  console.log('='.repeat(60));

  await compareSearch('Where is order ORD-2024-78433?', 'ORD-2024-78433');

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY: WHEN TO USE WHAT');
  console.log('='.repeat(60));
  console.log(`
  DENSE (semantic) is best when:
    • User describes a concept in their own words
    • Synonyms matter ("fast" = "performant" = "quick")
    • Intent matters more than exact words

  SPARSE (keyword) is best when:
    • User searches for exact identifiers (SKU-7292, ORD-2024-78433)
    • Version numbers matter (PostgreSQL 16.1 vs 15.2)
    • Error codes matter (E-4002 vs E-4001)
    • Exact terminology must be preserved

  HYBRID is best when:
    • You don't know what the user will search
    • You want the best of both worlds
    • Production RAG systems (almost always)
  `);
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
  console.log('  1. Dense vectors: semantic meaning ("fast" = "quick" = "performant")');
  console.log('  2. Sparse vectors: exact identifiers (SKU-7292 ≠ SKU-7293)');
  console.log('  3. Hybrid combines both - use for production RAG');
  console.log('  4. Use dotproduct metric (not cosine) for hybrid indexes');
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
  console.log('Usage: npx ts-node hybrid-search-demo.ts <command>');
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
