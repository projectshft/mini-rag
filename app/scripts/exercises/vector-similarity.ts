/**
 * VECTOR SIMILARITY EXERCISE
 *
 * This exercise helps you understand how vector similarity works in RAG systems.
 * Complete the empty function below to find the most similar documents to a query.
 *
 * Run this script with: yarn exercise:vectors
 */

// Document type for our examples
export type Document = {
  id: string;
  title: string;
  embedding: number[];
};

/**
 * Calculate the dot product between two vectors
 */
export function dotProduct(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same dimension");
  }

  return vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
}

/**
 * Calculate the magnitude (length) of a vector
 */
export function magnitude(vector: number[]): number {
  const sumOfSquares = vector.reduce((sum, val) => sum + val * val, 0);
  return Math.sqrt(sumOfSquares);
}

/**
 * Calculate the cosine similarity between two vectors
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  const dotProd = dotProduct(vectorA, vectorB);
  const magnitudeA = magnitude(vectorA);
  const magnitudeB = magnitude(vectorB);

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProd / (magnitudeA * magnitudeB);
}

/**
 * EXERCISE: Implement this function to find the top K most similar documents to a query,
 * filtering out any documents with similarity below the threshold.
 *
 * @param queryVector The query vector
 * @param documents Array of documents with embeddings
 * @param minSimilarity Minimum similarity threshold (default: 0.7)
 * @param topK Number of top results to return (default: 3)
 * @returns Array of documents with their similarity scores
 */
export function findTopSimilarDocuments(
  queryVector: number[],
  documents: Document[],
  minSimilarity: number = 0.7,
  topK: number = 3,
): Array<{ document: Document; similarity: number }> {
  // TODO: Implement this function!
  //
  // Steps:
  // 1. Calculate cosine similarity between query and each document
  //    - Use the cosineSimilarity() function provided above
  //    - Map over documents array to create { document, similarity } objects
  const similarities = documents.map((doc) => ({
    document: doc,
    similarity: cosineSimilarity(queryVector, doc.embedding),
  }));
  //
  // 2. Filter documents that have similarity >= minSimilarity
  //    - Use .filter() to keep only results meeting the threshold
  const mostSimilar = similarities.filter(
    (doc) => doc.similarity >= minSimilarity,
  );
  //
  // 3. Sort by similarity (highest first)
  //    - Use .sort() with a comparison function
  //    - Remember: higher similarity should come first
  const sorted = mostSimilar.sort((a, b) => b.similarity - a.similarity);
  // 4. Return top K results
  //    - Use .slice() to get the first topK items
  const topResults = sorted.slice(0, topK);
  //
  // Your implementation here:
  return topResults;

  throw new Error("Function not implemented yet! Complete the exercise.");
}

// Example test data for reference
export const exampleDocuments: Document[] = [
  {
    id: "doc1",
    title: "Introduction to Vector Databases",
    embedding: [0.8, 0.2, 0.7, 0.1],
  },
  {
    id: "doc2",
    title: "Machine Learning Fundamentals",
    embedding: [0.2, 0.8, 0.1, 0.7],
  },
  {
    id: "doc3",
    title: "Natural Language Processing",
    embedding: [0.9, 0.1, 0.6, 0.2],
  },
  {
    id: "doc4",
    title: "Vector Math for Beginners",
    embedding: [0.7, 0.3, 0.8, 0.1],
  },
  {
    id: "doc5",
    title: "Database Design Patterns",
    embedding: [0.1, 0.9, 0.2, 0.6],
  },
];

// Example query vector - similar to documents about vectors
export const exampleQueryVector = [0.75, 0.25, 0.8, 0.1];

// Example usage and expected output
console.log("=== VECTOR SIMILARITY EXERCISE ===");
console.log(
  "\nYour task is to implement the findTopSimilarDocuments function.",
);
console.log("This function should:");
console.log(
  "1. Calculate cosine similarity between the query vector and each document",
);
console.log("2. Filter out documents with similarity below the threshold");
console.log("3. Sort the remaining documents by similarity (highest first)");
console.log("4. Return the top K results");
console.log("\nTo test your implementation, run:");
console.log("yarn test vector-similarity.test.ts");

// Simple test function to verify the implementation
export function runTests(): boolean {
  try {
    // Test with a simple case
    const testQuery = [1, 0, 0];
    const testDocs = [
      { id: "1", title: "Perfect match", embedding: [1, 0, 0] },
      { id: "2", title: "Partial match", embedding: [0.7, 0.3, 0] },
      { id: "3", title: "No match", embedding: [0, 1, 0] },
    ];

    const results = findTopSimilarDocuments(testQuery, testDocs, 0.7, 2);

    // Check if results are correct
    if (results.length !== 2) return false;
    if (results[0].document.id !== "1") return false;
    if (results[1].document.id !== "2") return false;
    if (results[0].similarity !== 1) return false;

    return true;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
}
