/**
 * SELECTOR AGENT TESTS
 *
 * These tests verify that queries are routed to the correct agent.
 * Since LLMs are non-deterministic, we test routing decisions and
 * response structure, not exact text output.
 *
 * These tests call the API route handler directly - no server needed!
 */

import { POST } from "@/app/api/select-agent/route";
import { NextRequest } from "next/server";

describe("Selector Agent Routing", () => {
  // Increase timeout for LLM API calls
  jest.setTimeout(15000);

  // Helper to create a mock NextRequest
  const createRequest = (query: string): NextRequest => {
    return {
      json: async () => ({
        messages: [{ role: "user", content: query }],
      }),
    } as NextRequest;
  };

  // Helper to call the selector and get response
  const selectAgent = async (query: string) => {
    const request = createRequest(query);
    const response = await POST(request);
    return response.json();
  };

  describe("LinkedIn Agent Routing", () => {
    it("should route LinkedIn post creation to linkedin agent", async () => {
      const result = await selectAgent(
        "Write a LinkedIn post about learning TypeScript",
      );

      expect(result.agent).toBe("linkedin");
    });

    it("should route career advice to linkedin agent", async () => {
      const result = await selectAgent(
        "What career advice do you have for junior developers?",
      );

      expect(result.agent).toBe("linkedin");
    });

    it("should route professional networking questions to linkedin agent", async () => {
      const result = await selectAgent("How do I improve my LinkedIn profile?");

      expect(result.agent).toBe("linkedin");
    });

    it("should route job search questions to linkedin agent", async () => {
      const result = await selectAgent(
        "What software development jobs are currently available in new york city",
      );

      expect(result.agent).toBe("linkedin");
      expect(result.query).toBeTruthy();
    });
  });

  describe("RAG Agent Routing", () => {
    it("should route technical documentation questions to rag agent", async () => {
      const result = await selectAgent("How do React hooks work?");

      expect(result.agent).toBe("rag");
      expect(result.query).toBeTruthy();
    });

    it("should route coding questions to rag agent", async () => {
      const result = await selectAgent("Explain async/await in JavaScript");

      expect(result.agent).toBe("rag");
    });

    it("should route framework questions to rag agent", async () => {
      const result = await selectAgent(
        "What is the difference between useEffect and useLayoutEffect?",
      );

      expect(result.agent).toBe("rag");
    });
    it("should route code examples to rag agent", async () => {
      const result = await selectAgent("const number = 10 console.log(number)");

      expect(result.agent).toBe("rag");
    });
  });

  describe("Response Structure", () => {
    it("should return valid response structure", async () => {
      const result = await selectAgent("Any question here");

      // Verify required fields exist
      expect(result).toHaveProperty("agent");
      expect(result).toHaveProperty("query");

      // Verify agent is valid
      expect(["linkedin", "rag"]).toContain(result.agent);
    });

    it("should refine queries", async () => {
      const result = await selectAgent("Tell me about hooks");

      // Refined query should be non-empty
      expect(result.query).toBeTruthy();
      expect(result.query.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very short queries", async () => {
      const result = await selectAgent("Help");

      // Should still route to a valid agent
      expect(["linkedin", "rag"]).toContain(result.agent);
    });

    it("should handle out-of-domain queries", async () => {
      const result = await selectAgent("What is the weather today?");

      // Should pick an agent (probably rag as fallback)
      expect(["linkedin", "rag"]).toContain(result.agent);
    });

    it("should handle ambiguous queries", async () => {
      const result = await selectAgent("Tell me about JavaScript");

      // Could go to either agent - both are valid
      expect(["linkedin", "rag"]).toContain(result.agent);
    });

    it("should handle long queries", async () => {
      const result = await selectAgent(
        "Can you give me a comprehensive breakdown of JavaScript's event loop, how the call stack interacts with the microtask and macrotask queues, and how this affects async/await behavior compared to raw promises? I'd also like to understand how this relates to performance optimization in React applications, specifically around rendering cycles and state updates.",
      );

      // Could go to either agent - both are valid
      expect(["linkedin", "rag"]).toContain(result.agent);
    });
  });
});
