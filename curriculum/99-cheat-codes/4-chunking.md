# Chunking

Split documents into smaller pieces for embedding.

---

## Basic Sentence Chunking

```typescript
function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > chunkSize && current) {
      chunks.push(current.trim());
      // Start new chunk with overlap
      const words = current.split(' ');
      current = words.slice(-10).join(' ') + ' ' + sentence + '.';
    } else {
      current += (current ? ' ' : '') + sentence + '.';
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}
```

---

## With Metadata

```typescript
type Chunk = {
  id: string;
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
  };
};

function chunkDocument(text: string, source: string): Chunk[] {
  const chunks = chunkText(text, 500, 50);

  return chunks.map((content, index) => ({
    id: `${source}-${index}`,
    content,
    metadata: {
      source,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
}
```

---

## Markdown-Aware Chunking

```typescript
function chunkMarkdown(markdown: string, source: string): Chunk[] {
  // Split by headers
  const sections = markdown.split(/(?=^#{1,3}\s)/m);

  const chunks: Chunk[] = [];

  sections.forEach((section, index) => {
    // If section is too large, chunk it further
    if (section.length > 1000) {
      const subChunks = chunkText(section, 500, 50);
      subChunks.forEach((content, subIndex) => {
        chunks.push({
          id: `${source}-${index}-${subIndex}`,
          content,
          metadata: {
            source,
            chunkIndex: chunks.length,
            totalChunks: 0, // Updated later
          },
        });
      });
    } else if (section.trim()) {
      chunks.push({
        id: `${source}-${index}`,
        content: section.trim(),
        metadata: {
          source,
          chunkIndex: chunks.length,
          totalChunks: 0,
        },
      });
    }
  });

  // Update total counts
  chunks.forEach(c => (c.metadata.totalChunks = chunks.length));

  return chunks;
}
```

---

## Chunk Size Guidelines

| Content Type | Chunk Size | Overlap |
|--------------|------------|---------|
| Documentation | 500-800 | 50-100 |
| Code files | 300-500 | 30-50 |
| Long articles | 800-1200 | 100-150 |
| FAQs | 200-400 | 20-40 |

**Rule of thumb:**
- Too small = lost context
- Too large = irrelevant noise
- Start with 500 chars, adjust based on results
