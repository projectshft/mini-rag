/**
 * VECTOR WORD ARITHMETIC EXERCISE
 *
 * This exercise demonstrates how vector addition and subtraction can reveal
 * semantic relationships between words. Think of it as "word math"!
 *
 * Famous example: king - man + woman ≈ queen
 *
 * Run this script with: yarn exercise:word-math
 */

import * as path from "path";
import * as fs from "fs";
import dotenv from "dotenv";

// Load environment variables
const rootDir = path.resolve(__dirname, "../../..");
const envPath = path.join(rootDir, ".env");
const envLocalPath = path.join(rootDir, ".env.local");

import { openaiClient } from "../../libs/openai/openai";
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Load embeddings cache
let embeddingsCache: Record<string, number[]> = {};
try {
  const cachePath = path.join(__dirname, "../../../embeddings-cache.json");
  if (fs.existsSync(cachePath)) {
    embeddingsCache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    console.log("✅ Loaded embeddings cache from file");
  }
} catch (error: unknown) {
  console.log("⚠️  Error loading embeddings cache:", error);
  console.log("⚠️  No embeddings cache found, will use OpenAI API");
}

// Vector operations
function addVectors(a: number[], b: number[]): number[] {
  return a.map((val, i) => val + b[i]);
}

function subtractVectors(a: number[], b: number[]): number[] {
  return a.map((val, i) => val - b[i]);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}

// Get embedding for a word/phrase
async function getEmbedding(text: string): Promise<number[]> {
  // Check cache first
  if (embeddingsCache[text]) {
    return embeddingsCache[text];
  }

  console.log(`⚠️  Word "${text}" not in cache, fetching from OpenAI API...`);
  const response = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 512,
    input: text,
  });
  return response.data[0].embedding;
}

// Find the closest word from a list given a target vector
async function findClosestWord(
  targetVector: number[],
  candidates: string[],
): Promise<{ word: string; similarity: number }[]> {
  const results: { word: string; similarity: number }[] = [];

  for (const candidate of candidates) {
    const embedding = await getEmbedding(candidate);
    const similarity = cosineSimilarity(targetVector, embedding);
    results.push({ word: candidate, similarity });
  }

  return results.sort((a, b) => b.similarity - a.similarity);
}

async function demonstrateWordArithmetic() {
  console.log("🧮 VECTOR WORD ARITHMETIC DEMONSTRATIONS");
  console.log("=========================================\n");

  // Example 1: Classic King-Queen relationship
  console.log("📚 CLASSIC EXAMPLE: Gender Relations");
  console.log("Formula: king - man + woman ≈ ?");

  const [kingVec, manVec, womanVec] = await Promise.all([
    getEmbedding("king"),
    getEmbedding("man"),
    getEmbedding("woman"),
  ]);

  const result1 = addVectors(subtractVectors(kingVec, manVec), womanVec);
  const candidates1 = [
    "queen",
    "princess",
    "empress",
    "lady",
    "ruler",
    "monarch",
    "pizza", // obviously wrong - should have low similarity
  ];
  const matches1 = await findClosestWord(result1, candidates1);

  console.log("Top matches:");
  matches1.forEach((match, i) => {
    const emoji = i === matches1.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 2: Spicy relationship dynamics
  console.log("🔥 SPICY EXAMPLE: Relationship Dynamics");
  console.log("Formula: boyfriend - commitment + freedom ≈ ?");

  const [boyfriendVec, commitmentVec, freedomVec] = await Promise.all([
    getEmbedding("boyfriend"),
    getEmbedding("commitment"),
    getEmbedding("freedom"),
  ]);

  const result2 = addVectors(
    subtractVectors(boyfriendVec, commitmentVec),
    freedomVec,
  );
  const candidates2 = [
    "fuckboy",
    "player",
    "bachelor",
    "single",
    "flirt",
    "hookup",
    "accountant", // obviously wrong - should have low similarity
  ];
  const matches2 = await findClosestWord(result2, candidates2);

  console.log("Top matches:");
  matches2.forEach((match, i) => {
    const emoji = i === matches2.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 3: Tech bro transformation
  console.log("💻 TECH BRO EXAMPLE: Silicon Valley Transformation");
  console.log("Formula: engineer - humility + ego ≈ ?");

  const [engineerVec, humilityVec, egoVec] = await Promise.all([
    getEmbedding("engineer"),
    getEmbedding("humility"),
    getEmbedding("ego"),
  ]);

  const result3 = addVectors(subtractVectors(engineerVec, humilityVec), egoVec);
  const candidates3 = [
    "founder",
    "CEO",
    "entrepreneur",
    "startup",
    "techbro",
    "disruptor",
    "banana", // obviously wrong - should have low similarity
  ];
  const matches3 = await findClosestWord(result3, candidates3);

  console.log("Top matches:");
  matches3.forEach((match, i) => {
    const emoji = i === matches3.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 4: Social media evolution
  console.log("📱 SOCIAL MEDIA EXAMPLE: Platform Evolution");
  console.log("Formula: Twitter - sanity + chaos ≈ ?");

  const [twitterVec, sanityVec, chaosVec] = await Promise.all([
    getEmbedding("Twitter"),
    getEmbedding("sanity"),
    getEmbedding("chaos"),
  ]);

  const result4 = addVectors(subtractVectors(twitterVec, sanityVec), chaosVec);
  const candidates4 = [
    "X",
    "4chan",
    "Reddit",
    "TikTok",
    "hellscape",
    "dumpsterfire",
    "library", // obviously wrong - should have low similarity
  ];
  const matches4 = await findClosestWord(result4, candidates4);

  console.log("Top matches:");
  matches4.forEach((match, i) => {
    const emoji = i === matches4.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 5: Career progression
  console.log("💼 CAREER EXAMPLE: Professional Evolution");
  console.log("Formula: intern - enthusiasm + cynicism ≈ ?");

  const [internVec, enthusiasmVec, cynicismVec] = await Promise.all([
    getEmbedding("intern"),
    getEmbedding("enthusiasm"),
    getEmbedding("cynicism"),
  ]);

  const result5 = addVectors(
    subtractVectors(internVec, enthusiasmVec),
    cynicismVec,
  );
  const candidates5 = [
    "manager",
    "executive",
    "burnout",
    "veteran",
    "survivor",
    "director",
    "sunshine", // obviously wrong - should have low similarity
  ];
  const matches5 = await findClosestWord(result5, candidates5);

  console.log("Top matches:");
  matches5.forEach((match, i) => {
    const emoji = i === matches5.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 6: Dating app reality
  //   console.log("💕 DATING EXAMPLE: App Reality");
  //   console.log("Formula: dating - authenticity + filters ≈ ?");

  //   const [datingVec, authenticityVec, filtersVec] = await Promise.all([
  //     getEmbedding("dating"),
  //     getEmbedding("authenticity"),
  //     getEmbedding("filters"),
  //   ]);

  //   const result6 = addVectors(
  //     subtractVectors(datingVec, authenticityVec),
  //     filtersVec,
  //   );
  //   const candidates6 = [
  //     "catfish",
  //     "Instagram",
  //     "facade",
  //     "performance",
  //     "theater",
  //     "illusion",
  //     "broccoli", // obviously wrong - should have low similarity
  //   ];
  //   const matches6 = await findClosestWord(result6, candidates6);

  //   console.log("Top matches:");
  //   matches6.forEach((match, i) => {
  //     const emoji = i === matches6.length - 1 ? "❌" : "✅";
  //     console.log(
  //       `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
  //         3,
  //       )})`,
  //     );
  //   });
  //   console.log("");

  // Interactive section
  console.log("🎯 WHY THIS WORKS:");
  console.log("==================");
  console.log(
    "Vector embeddings capture semantic relationships in high-dimensional space.",
  );
  console.log(
    "When we do math on these vectors, we're manipulating meaning itself!",
  );
  console.log("");
  console.log("Think of it like this:");
  console.log('• Vectors encode the "essence" of concepts');
  console.log("• Addition combines concepts");
  console.log("• Subtraction removes aspects");
  console.log("• The result points to related concepts in semantic space");
  console.log("");
  console.log("🔬 EXERCISE FOR YOU:");
  console.log("Try creating your own word equations! Some ideas:");
  console.log("• coffee - sleep + anxiety ≈ ?");
  console.log("• Netflix - content + ads ≈ ?");
  console.log("• startup - funding + desperation ≈ ?");
  console.log("• influencer - talent + followers ≈ ?");

  // Example 7: Royalty reversal
  console.log("👑 ROYALTY EXAMPLE: The Reverse Analog");
  console.log("Formula: empress - woman + man ≈ ?");

  const [empressVec, womanVec2, manVec2] = await Promise.all([
    getEmbedding("empress"),
    getEmbedding("woman"),
    getEmbedding("man"),
  ]);

  const result7 = addVectors(subtractVectors(empressVec, womanVec2), manVec2);
  const candidates7 = [
    "king",
    "monarch",
    "ruler",
    "bachelor",
    "founder",
    "CEO",
    "banana", // obviously wrong - should have low similarity
  ];
  const matches7 = await findClosestWord(result7, candidates7);

  console.log("Top matches:");
  matches7.forEach((match, i) => {
    const emoji = i === matches7.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 8: The Instagram effect
  console.log("📸 INSTAGRAM EXAMPLE: The Filter Effect");
  console.log("Formula: Instagram - authenticity + filters ≈ ?");

  const [instagramVec, authenticityVec2, filtersVec2] = await Promise.all([
    getEmbedding("Instagram"),
    getEmbedding("authenticity"),
    getEmbedding("filters"),
  ]);

  const result8 = addVectors(
    subtractVectors(instagramVec, authenticityVec2),
    filtersVec2,
  );
  const candidates8 = [
    "facade",
    "illusion",
    "performance",
    "catfish",
    "theater",
    "TikTok",
    "library", // obviously wrong - should have low similarity
  ];
  const matches8 = await findClosestWord(result8, candidates8);

  console.log("Top matches:");
  matches8.forEach((match, i) => {
    const emoji = i === matches8.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 9: Startup reality check
  console.log("🚀 STARTUP EXAMPLE: Reality Check");
  console.log("Formula: startup - enthusiasm + cynicism ≈ ?");

  const [startupVec, enthusiasmVec2, cynicismVec2] = await Promise.all([
    getEmbedding("startup"),
    getEmbedding("enthusiasm"),
    getEmbedding("cynicism"),
  ]);

  const result9 = addVectors(
    subtractVectors(startupVec, enthusiasmVec2),
    cynicismVec2,
  );
  const candidates9 = [
    "burnout",
    "survivor",
    "hellscape",
    "veteran",
    "chaos",
    "dumpsterfire",
    "sunshine", // obviously wrong - should have low similarity
  ];
  const matches9 = await findClosestWord(result9, candidates9);

  console.log("Top matches:");
  matches9.forEach((match, i) => {
    const emoji = i === matches9.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 10: Relationship reversal
  console.log("💍 RELATIONSHIP EXAMPLE: The Reverse");
  console.log("Formula: fuckboy - freedom + commitment ≈ ?");

  const [fuckboyVec, freedomVec2, commitmentVec2] = await Promise.all([
    getEmbedding("fuckboy"),
    getEmbedding("freedom"),
    getEmbedding("commitment"),
  ]);

  const result10 = addVectors(
    subtractVectors(fuckboyVec, freedomVec2),
    commitmentVec2,
  );
  const candidates10 = [
    "boyfriend",
    "dating",
    "single",
    "bachelor",
    "flirt",
    "hookup",
    "sunshine", // obviously wrong - should have low similarity
  ];
  const matches10 = await findClosestWord(result10, candidates10);

  console.log("Top matches:");
  matches10.forEach((match, i) => {
    const emoji = i === matches10.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");

  // Example 11: Food math
  console.log("🥦 FOOD EXAMPLE: Vegetable Math");
  console.log("Formula: broccoli - banana + pizza ≈ ?");

  const [broccoliVec, bananaVec, pizzaVec] = await Promise.all([
    getEmbedding("broccoli"),
    getEmbedding("banana"),
    getEmbedding("pizza"),
  ]);

  const result11 = addVectors(
    subtractVectors(broccoliVec, bananaVec),
    pizzaVec,
  );
  const candidates11 = [
    "hookup",
    "flirt",
    "player",
    "single",
    "bachelor",
    "sunshine", // obviously wrong - should have low similarity
  ];
  const matches11 = await findClosestWord(result11, candidates11);

  console.log("Top matches:");
  matches11.forEach((match, i) => {
    const emoji = i === matches11.length - 1 ? "❌" : "✅";
    console.log(
      `${emoji} ${i + 1}. ${match.word} (similarity: ${match.similarity.toFixed(
        3,
      )})`,
    );
  });
  console.log("");
}

// Run the demonstration
demonstrateWordArithmetic().catch(console.error);

// generateEmbeddingsCache().catch(console.error);
