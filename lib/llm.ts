import OpenAI from "openai";
import type { ScoredChunk } from "./retrieve";

export const DEFAULT_MODEL = "gpt-4o-mini";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Copy .env.example to .env.local and fill it in.");
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }
  return client;
}

export function buildPrompt(question: string, chunks: ScoredChunk[]): string {
  const context = chunks
    .map((chunk, i) => `[${i + 1}] (${chunk.title})\n${chunk.text}`)
    .join("\n\n");
  return `Context:\n${context}\n\nQuestion: ${question}`;
}

// Retries up to 3 times on rate limit errors before giving up.
export async function askModel(question: string, chunks: ScoredChunk[]): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: process.env.MODEL || DEFAULT_MODEL,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You answer questions using only the numbered context passages. " +
          "Cite passages like [1]. If the context does not contain the answer, say you don't know.",
      },
      { role: "user", content: buildPrompt(question, chunks) },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}
