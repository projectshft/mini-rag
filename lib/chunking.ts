export interface Doc {
  id: string;
  title: string;
  text: string;
}

export interface Chunk {
  id: string;
  docId: string;
  title: string;
  text: string;
  index: number;
}

export interface ChunkOptions {
  maxChars?: number;
  overlap?: number;
}

export const DEFAULT_MAX_CHARS = 600;
export const DEFAULT_OVERLAP = 100;

// TODO: not implemented yet. For now this returns the whole document as a single chunk.
export function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const overlap = options.overlap ?? DEFAULT_OVERLAP;

  if (maxChars <= 0) {
    throw new Error("maxChars must be greater than 0");
  }
  if (overlap < 0 || overlap >= maxChars) {
    throw new Error("overlap must be at least 0 and smaller than maxChars");
  }

  const clean = text.replace(/\r\n/g, "\n").trim();
  if (clean.length === 0) {
    return [];
  }
  if (clean.length <= maxChars) {
    return [clean];
  }

  const step = maxChars - overlap;
  const chunks: string[] = [];
  for (let start = 0; start < clean.length; start += step) {
    const end = Math.min(start + maxChars, clean.length);
    chunks.push(clean.slice(start, end));
    if (end === clean.length) {
      break;
    }
  }
  return chunks;
}

export function chunkDocuments(docs: Doc[], options: ChunkOptions = {}): Chunk[] {
  const chunks: Chunk[] = [];
  for (const doc of docs) {
    chunkText(doc.text, options).forEach((text, index) => {
      chunks.push({
        id: `${doc.id}#${index}`,
        docId: doc.id,
        title: doc.title,
        text,
        index,
      });
    });
  }
  return chunks;
}
