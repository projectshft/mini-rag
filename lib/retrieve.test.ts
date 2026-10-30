import type { Chunk } from "./chunking";
import { retrieve, scoreChunk, tokenize } from "./retrieve";

function chunk(id: string, text: string): Chunk {
  return { id, docId: id, title: id, text, index: 0 };
}

describe("tokenize", () => {
  it("lowercases and strips punctuation", () => {
    expect(tokenize("Refund POLICY, explained!")).toEqual(["refund", "policy", "explained"]);
  });

  it("drops stopwords", () => {
    expect(tokenize("What is the refund window")).toEqual(["refund", "window"]);
  });
});

describe("scoreChunk", () => {
  it("counts question terms that appear in the chunk", () => {
    expect(scoreChunk(["refund", "window", "shipping"], "The refund window is 30 days.")).toBe(2);
  });
});

describe("retrieve", () => {
  const chunks = [
    chunk("shipping", "Orders ship within two business days."),
    chunk("refunds", "The refund window is 30 days from delivery. Refund requests go to support."),
    chunk("api", "The API allows 100 requests per minute."),
  ];

  it("puts the most relevant chunk first", () => {
    const results = retrieve("How long is the refund window?", chunks);
    expect(results[0].id).toBe("refunds");
  });

  it("returns at most topK results", () => {
    const results = retrieve("refund window days api requests orders", chunks, 2);
    expect(results).toHaveLength(2);
  });
});
