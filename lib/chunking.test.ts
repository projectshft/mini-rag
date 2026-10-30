import { chunkDocuments, chunkText } from "./chunking";

describe("chunkText", () => {
  it("returns a short text as a single chunk", () => {
    expect(chunkText("Refunds take five business days.", { maxChars: 100, overlap: 10 })).toEqual([
      "Refunds take five business days.",
    ]);
  });

  it("splits long text into chunks no longer than maxChars", () => {
    const text = "word ".repeat(100);
    const chunks = chunkText(text, { maxChars: 50, overlap: 10 });
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(50);
    }
  });

  it("covers the start and end of the text", () => {
    const text = "abcdefghijklmnopqrstuvwxyz".repeat(4);
    const chunks = chunkText(text, { maxChars: 30, overlap: 5 });
    expect(chunks[0].startsWith("abcde")).toBe(true);
    expect(chunks[chunks.length - 1].endsWith("vwxyz")).toBe(true);
  });

  it("uses default options when none are given", () => {
    const chunks = chunkText("a".repeat(2000));
    expect(chunks.length).toBeGreaterThan(1);
  });
});

describe("chunkDocuments", () => {
  it("tags each chunk with its document and position", () => {
    const chunks = chunkDocuments(
      [
        { id: "a.md", title: "A", text: "x".repeat(120) },
        { id: "b.md", title: "B", text: "short" },
      ],
      { maxChars: 50, overlap: 0 },
    );
    expect(chunks.map((c) => c.id)).toEqual(["a.md#0", "a.md#1", "a.md#2", "b.md#0"]);
    expect(chunks[3]).toMatchObject({ docId: "b.md", title: "B", text: "short", index: 0 });
  });
});
