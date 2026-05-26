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

// Sample documents - designed to show when sparse vs dense matters
const documents = [
  // Exact term matching scenarios
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
  // Version number scenarios - sparse catches exact versions
  {
    id: 'hybrid-demo-6',
    text: 'React 18 introduced automatic batching for all state updates, not just event handlers.',
  },
  {
    id: 'hybrid-demo-7',
    text: 'React 17 added no new features but prepared the foundation for gradual upgrades.',
  },
  {
    id: 'hybrid-demo-8',
    text: 'The latest version of the library includes concurrent rendering features.',
  },
  // Acronym scenarios - sparse catches exact acronyms
  {
    id: 'hybrid-demo-9',
    text: 'SSR (Server-Side Rendering) improves SEO and initial page load performance.',
  },
  {
    id: 'hybrid-demo-10',
    text: 'Rendering on the server before sending HTML to the browser helps search engines.',
  },
  {
    id: 'hybrid-demo-11',
    text: 'CSR (Client-Side Rendering) runs JavaScript in the browser to build the page.',
  },
  // Code pattern scenarios - sparse catches exact syntax
  {
    id: 'hybrid-demo-12',
    text: 'Use useCallback to memoize functions passed as props to child components.',
  },
  {
    id: 'hybrid-demo-13',
    text: 'The useEffect hook runs side effects after render, like fetching data or subscriptions.',
  },
  {
    id: 'hybrid-demo-14',
    text: 'Side effects in functional components should be handled properly to avoid memory leaks.',
  },
  // Error message scenarios - sparse catches exact error text
  {
    id: 'hybrid-demo-15',
    text: 'Error: "Cannot read property of undefined" usually means accessing a null object.',
  },
  {
    id: 'hybrid-demo-16',
    text: 'Null reference errors happen when you try to use something that does not exist.',
  },
  {
    id: 'hybrid-demo-17',
    text: 'Error: "ENOENT: no such file or directory" means the file path is wrong.',
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
  // EXAMPLE 1: Version Numbers
  // Dense: "React 18" and "React 17" are semantically similar
  // Sparse: Boosts exact "18" match
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 1: VERSION NUMBERS');
  console.log('Why it matters: Dense treats "React 18" and "React 17" as similar.');
  console.log('Sparse boosts the exact version number.');
  console.log('='.repeat(60));

  await compareSearch('What changed in React 18?', 'react 18');

  // ============================================================
  // EXAMPLE 2: Acronyms
  // Dense: "SSR" might match "rendering on server" semantically
  // Sparse: Boosts exact "SSR" acronym
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 2: ACRONYMS');
  console.log('Why it matters: Dense understands "SSR" means server rendering.');
  console.log('But if you search "SSR", you probably want docs that use that term.');
  console.log('='.repeat(60));

  await compareSearch('What is SSR?', 'ssr');

  // ============================================================
  // EXAMPLE 3: Exact Hook Names
  // Dense: All hooks are semantically similar
  // Sparse: Boosts exact "useEffect" match
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 3: EXACT CODE TERMS');
  console.log('Why it matters: "useEffect" and "useMemo" are semantically similar hooks.');
  console.log('Sparse ensures you get the exact hook you searched for.');
  console.log('='.repeat(60));

  await compareSearch('How does useEffect work?', 'useeffect');

  // ============================================================
  // EXAMPLE 4: Error Messages
  // Dense: All errors are semantically similar
  // Sparse: Boosts exact error text match
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 4: ERROR MESSAGES');
  console.log('Why it matters: Users paste exact error text.');
  console.log('Dense sees "all errors are similar". Sparse finds the exact match.');
  console.log('='.repeat(60));

  await compareSearch('Cannot read property of undefined', 'cannot read property');

  // ============================================================
  // EXAMPLE 5: Semantic Query (where dense shines)
  // Dense: Understands "stop re-rendering" = "prevent re-renders" = "memoization"
  // Sparse: Doesn't help much here
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('EXAMPLE 5: SEMANTIC QUERY (where dense shines)');
  console.log('Why it matters: User asks about "stopping re-renders".');
  console.log('Dense understands this means memoization, React.memo, etc.');
  console.log('='.repeat(60));

  await compareSearch('How do I stop my component from re-rendering?');

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
    • User searches for exact terms (React.memo, useEffect)
    • Version numbers matter (React 18 vs React 17)
    • Acronyms matter (SSR, CSR, API)
    • Error messages (exact match needed)

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
  console.log('  2. Sparse vectors: exact keywords (React 18 ≠ React 17)');
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
