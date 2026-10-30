import type { Chunk } from "./chunking";

export interface ScoredChunk extends Chunk {
  score: number;
}

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "does", "for",
  "from", "how", "i", "in", "is", "it", "my", "of", "on", "or", "the", "to",
  "what", "when", "where", "which", "who", "why", "with", "you", "your",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

export function scoreChunk(questionTokens: string[], chunkText: string): number {
  const chunkTokens = new Set(tokenize(chunkText));
  const uniqueQuestionTokens = new Set(questionTokens);
  let score = 0;
  for (const token of uniqueQuestionTokens) {
    if (chunkTokens.has(token)) {
      score += 1;
    }
  }
  return score;
}

// Returns null when no chunk matches the question.
export function retrieve(question: string, chunks: Chunk[], topK = 3): ScoredChunk[] {
  const questionTokens = tokenize(question);
  if (questionTokens.length === 0) {
    return [];
  }

  return chunks
    .map((chunk) => ({ ...chunk, score: scoreChunk(questionTokens, chunk.text) }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
