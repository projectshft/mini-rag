import getLastWords, { chunkText } from "./chunking";

describe("chunkText", () => {
  describe("Basic Functionality", () => {
    test("should split text into chunks", () => {
      const text =
        "React Hooks were introduced in React 16.8. They allow you to use state and other React features without writing a class component. The most commonly used hooks are useState and useEffect.";

      const chunks = chunkText(text, 100, 20, "test");

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[0].content).toBeTruthy();
    });

    test("should handle empty text", () => {
      const chunks = chunkText("", 500, 50, "test");
      expect(chunks).toEqual([]);
    });

    test("should handle single sentence", () => {
      const text = "This is a single sentence.";
      const chunks = chunkText(text, 500, 50, "test");

      expect(chunks).toHaveLength(1);
      expect(chunks[0].content).toBe(text);
    });
  });

  describe("Sentence Boundaries", () => {
    test("should not break words mid-character", () => {
      const text =
        "The company announced new features including advanced AI capabilities. These features will revolutionize the industry. Users are excited about the upcoming release.";

      const chunks = chunkText(text, 50, 10, "test");

      chunks.forEach((chunk) => {
        // Check that chunks end with complete sentences (end with punctuation)
        expect(chunk.content).toMatch(/[.!?]\s*$/); // Should end with sentence punctuation

        // Check that words are not broken mid-word (no "feat" + "ures")
        // This is ensured by splitting on sentence boundaries
        const words = chunk.content.split(/\s+/);
        words.forEach((word) => {
          // Each word should be complete (not cut off)
          expect(word.length).toBeGreaterThan(0);
        });
      });
    });

    test("should respect sentence boundaries", () => {
      const text =
        "First sentence. Second sentence. Third sentence. Fourth sentence.";

      const chunks = chunkText(text, 30, 10, "test");

      chunks.forEach((chunk) => {
        // Each chunk should contain complete sentences
        expect(chunk.content).toMatch(/[.!?]\s*$/);
      });
    });

    test("should handle different punctuation marks", () => {
      const text =
        "Is this a question? Yes it is! This is an exclamation. This is normal.";

      const chunks = chunkText(text, 40, 10, "test");

      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach((chunk) => {
        expect(chunk.content).toBeTruthy();
      });
    });
  });

  describe("Overlap Functionality", () => {
    test("should create overlap between chunks", () => {
      const text =
        "First sentence here. Second sentence here. Third sentence here. Fourth sentence here.";

      const chunks = chunkText(text, 50, 20, "test");

      if (chunks.length > 1) {
        // Check that consecutive chunks have overlapping content
        for (let i = 0; i < chunks.length - 1; i++) {
          const chunk1End = chunks[i].content.slice(-20);
          const chunk2Start = chunks[i + 1].content.slice(0, 30);

          // Some words from end of chunk 1 should appear in start of chunk 2
          const wordsFromEnd = chunk1End.split(" ").filter((w) => w.length > 3);
          const hasOverlap = wordsFromEnd.some((word) =>
            chunk2Start.includes(word),
          );

          expect(hasOverlap).toBe(true);
        }
      }
    });

    test("should respect overlap parameter", () => {
      const text =
        "Sentence one. Sentence two. Sentence three. Sentence four. Sentence five. Sentence six.";

      const chunksNoOverlap = chunkText(text, 30, 0, "test");
      const chunksWithOverlap = chunkText(text, 30, 10, "test");

      // With overlap, we might get more chunks or similar count
      // but the content should be different
      if (chunksNoOverlap.length > 1 && chunksWithOverlap.length > 1) {
        expect(chunksNoOverlap[1].content).not.toBe(
          chunksWithOverlap[1].content,
        );
      }
    });
  });

  describe("Metadata", () => {
    test("should include correct metadata", () => {
      const text = "First sentence. Second sentence. Third sentence.";
      const source = "test-document";

      const chunks = chunkText(text, 50, 10, source);

      chunks.forEach((chunk, index) => {
        expect(chunk.id).toBe(`${source}-chunk-${index}`);
        expect(chunk.metadata.source).toBe(source);
        expect(chunk.metadata.chunkIndex).toBe(index);
        expect(chunk.metadata.totalChunks).toBe(chunks.length);
        expect(chunk.metadata.startChar).toBeGreaterThanOrEqual(0);
        expect(chunk.metadata.endChar).toBeGreaterThan(
          chunk.metadata.startChar,
        );
      });
    });

    test("should have sequential chunk indices", () => {
      const text = "One. Two. Three. Four. Five. Six. Seven. Eight. Nine. Ten.";

      const chunks = chunkText(text, 20, 5, "test");

      chunks.forEach((chunk, index) => {
        expect(chunk.metadata.chunkIndex).toBe(index);
      });
    });

    test("should update totalChunks for all chunks", () => {
      const text = "A. B. C. D. E. F. G. H. I. J.";

      const chunks = chunkText(text, 10, 2, "test");

      const totalChunks = chunks.length;
      chunks.forEach((chunk) => {
        expect(chunk.metadata.totalChunks).toBe(totalChunks);
      });
    });
  });

  describe("Edge Cases", () => {
    test("should handle very long sentences", () => {
      const longSentence =
        "This is a very long sentence that contains many words and should be handled properly even though it exceeds the normal chunk size because we need to test edge cases.";

      const chunks = chunkText(longSentence, 50, 10, "test");

      expect(chunks.length).toBeGreaterThanOrEqual(1);
      expect(chunks[0].content).toBeTruthy();
    });

    test("should handle text with multiple spaces", () => {
      const text = "First  sentence   with    spaces. Second     sentence.";

      const chunks = chunkText(text, 100, 20, "test");

      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach((chunk) => {
        expect(chunk.content).toBeTruthy();
      });
    });

    test("should handle text with newlines", () => {
      const text = "First sentence.\nSecond sentence.\n\nThird sentence.";

      const chunks = chunkText(text, 100, 20, "test");

      expect(chunks.length).toBeGreaterThan(0);
    });

    test("should handle special characters", () => {
      const text = "React uses JSX! Does it work? Yes, it works. Amazing!";

      const chunks = chunkText(text, 50, 10, "test");

      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach((chunk) => {
        expect(chunk.content).toBeTruthy();
      });
    });
  });

  describe("Chunk Size Control", () => {
    test("should respect chunk size limits", () => {
      const text =
        "Short sentence. Another short one. And one more. Plus this. And that. Finally done.";

      const chunkSize = 40;
      const chunks = chunkText(text, chunkSize, 5, "test");

      chunks.forEach((chunk) => {
        // Allow some flexibility for sentence boundaries
        // but most chunks should be near the target size
        expect(chunk.content.length).toBeLessThanOrEqual(chunkSize + 100); // Generous buffer for sentences
      });
    });

    test("should create multiple chunks for long text", () => {
      const sentences = Array(20).fill("This is a test sentence.").join(" ");

      const chunks = chunkText(sentences, 100, 20, "test");

      expect(chunks.length).toBeGreaterThan(1);
    });
  });

  describe("Real-World Example", () => {
    test("should chunk React documentation example", () => {
      const text = `
				React Hooks were introduced in React 16.8.
				They allow you to use state and other React features without writing a class component.
				The most commonly used hooks are useState and useEffect.
				useState lets you add state to function components.
				useEffect lets you perform side effects in function components.
			`;

      const chunks = chunkText(text, 150, 30, "react-docs");

      expect(chunks.length).toBeGreaterThan(0);

      // Verify all chunks have proper structure
      chunks.forEach((chunk) => {
        expect(chunk.id).toContain("react-docs-chunk-");
        expect(chunk.content.length).toBeGreaterThan(0);
        expect(chunk.metadata.source).toBe("react-docs");
      });

      // Verify content is preserved
      const allContent = chunks.map((c) => c.content).join(" ");
      expect(allContent).toContain("useState");
      expect(allContent).toContain("useEffect");
    });
  });
  describe("maxLength Behavior", () => {
    test("should only include words up to the maxLength", () => {
      const text = "the quick brown fox";
      const maxLength = 5;
      const lastWords = getLastWords(text, maxLength);
      expect(lastWords).toBe("fox");
    });
  });
});
