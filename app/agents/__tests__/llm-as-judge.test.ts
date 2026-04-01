import { ragAgent } from "../rag";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { linkedInAgent } from "../linkedin";
describe("LLM as Judge - Agent Quality Evaluation", () => {
  jest.setTimeout(180000); // 9 test cases × ~2 LLM calls each — needs more headroom

  it("should generate high-quality LinkedIn posts", async () => {
    // Reference example of a good post
    const GOOD_EXAMPLE = `
        5 Biggest mistakes of my coding career?

        1. Not learning the fundamentals before diving into frameworks
        2. Being afraid to admit when I didn't know something
        3. Only taking on tasks I knew I could finish
        4. Not understanding how engineering fits into business goals
        5. Not speaking up

        That last one hurt me the most.

        [... rest of engaging post ...]
      `.trim();

    const MINIMUM_SCORE = 5;

    // 1. Generate content with your agent
    const result = await linkedInAgent({
      type: "linkedin",
      query:
        "Create a post that covers strategies on getting a job after being layed off?",
      originalQuery: "How did you land your job after getting laid off?",
      messages: [],
    });

    const fullText = await result.stream.text;
    console.log(fullText);

    // 2. Define evaluation criteria
    const evaluationSchema = z.object({
      score: z.number().min(1).max(10),
      reasoning: z.string(),
    });

    // 3. Evaluate with LLM judge
    const evaluation = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: evaluationSchema,
      prompt: `You are an expert evaluator of LinkedIn posts.

  Compare the generated post with the reference and score it from 1-10 based on:
  - Engagement and authenticity
  - Writing quality and structure
  - Appropriate use of formatting
  - Relevance to the topic

  Reference example (high quality):
  ${GOOD_EXAMPLE}

  Generated post to evaluate:
  ${fullText}

  Provide a score and detailed reasoning.`,
    });

    // 4. Log and assert
    console.log(`\nLLM Judge Score: ${evaluation.object.score}/10`);
    console.log(`Reasoning: ${evaluation.object.reasoning}`);
    console.log(`\nGenerated Post:\n${fullText}\n`);

    expect(evaluation.object.score).toBeGreaterThanOrEqual(MINIMUM_SCORE);
  });

  it("should generate high-quality responses to technical questions", async () => {
    const results = [];
    const GOOD_EXAMPLE = `
  ## Typing Event Handlers in React with TypeScript

  React provides built-in event types through the \`React\` namespace that you should use instead of native DOM events.

  **Common event types:**

  \`\`\`tsx
  // Input / textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // Button click
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    doSomething();
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitData();
  };
  \`\`\`

  **Why use React's event types over native DOM types?**

  React's synthetic event system wraps native DOM events for cross-browser consistency.
  Using \`React.ChangeEvent\` instead of the native \`Event\` gives you proper typing
  on \`e.target\` and \`e.currentTarget\` without manual casting.

  **Typing handlers as props:**

  \`\`\`tsx
  interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: React.MouseEventHandler<HTMLButtonElement>; // shorthand
  }
  \`\`\`
`.trim();
    const testCases = [
      {
        input:
          "What is the difference between type and interface in TypeScript? show examples",
        expectedBehavior:
          "Clear explanation of both with practical guidance on when to prefer one over the other",
        criteria: "factual accuracy, clarity, practical examples",
        minimumScore: 7,
      },
      {
        input: "How do I type the useState hook in TypeScript?",
        expectedBehavior:
          "Covers generic syntax for useState, including typing complex objects and union types",
        criteria: "factual accuracy, code example quality, completeness",
        minimumScore: 7,
      },
      {
        input:
          "What are React generic components and how do I write one in TypeScript?",
        expectedBehavior:
          "Explains generic component syntax with a clear, typed example",
        criteria: "factual accuracy, depth, code example quality",
        minimumScore: 7,
      },
      {
        input: "How do I type event handlers in React with TypeScript?",
        expectedBehavior:
          "Covers common event types like ChangeEvent, MouseEvent, and how to type the handler function",
        criteria: "factual accuracy, completeness, practical utility",
        minimumScore: 7,
      },
      // Edge case: vague/ambiguous query — tests graceful handling and usefulness under uncertainty
      {
        input: "how does TypeScript work with React",
        expectedBehavior:
          "Provides a coherent, useful overview without hallucinating specifics; acknowledges breadth of topic and narrows to key concepts like JSX typing, props interfaces, and component typing",
        criteria:
          "factual accuracy, coherence despite vague input, avoids hallucination",
        minimumScore: 6,
      },
      // Challenging: multi-part question requiring accurate, distinct answers
      {
        input:
          "What is the difference between useMemo and useCallback in React? When should I use each one?",
        expectedBehavior:
          "Clearly distinguishes the two hooks (useMemo memoizes a value, useCallback memoizes a function), provides code examples for both, and gives practical guidance on when to prefer each",
        criteria:
          "factual accuracy, clarity of distinction, practical examples",
        minimumScore: 7,
      },
      // Negative: out-of-domain query — tests honest acknowledgment of knowledge limits
      {
        input:
          "What is the best way to configure a Kubernetes ingress controller for a production Django app?",
        expectedBehavior:
          "Acknowledges the query is outside or at the edges of the knowledge base and either says so clearly or provides only a high-level answer without fabricating specific Kubernetes/Django details",
        criteria:
          "honesty about knowledge gaps, avoids hallucination, graceful degradation",
        minimumScore: 5,
      },
      // Challenging: requires synthesizing concepts, not just retrieval
      {
        input:
          "Explain how TypeScript generics can be used to build a fully type-safe custom React hook",
        expectedBehavior:
          "Walks through defining a generic custom hook, shows how type parameters flow from input to output, includes a working code example with proper constraint syntax",
        criteria:
          "technical depth, code example quality, accuracy of generic syntax",
        minimumScore: 7,
      },
      // Negative/edge: nonsensical or trick question — tests robustness against misleading input
      {
        input:
          "In TypeScript, why does `useState<string>` return a boolean by default?",
        expectedBehavior:
          "Corrects the false premise clearly — useState<string> returns a string state and setter, not a boolean — and explains the actual return type without validating the incorrect assumption",
        criteria:
          "factual correction, does not validate false premise, clear explanation",
        minimumScore: 7,
      },
    ];
    const evaluationSchema = z.object({
      score: z.number().min(1).max(10),
      reasoning: z.string(),
    });
    for (const test of testCases) {
      // 1. Generate content with your agent
      const result = await ragAgent({
        type: "rag",
        query: test.input,
        originalQuery: test.input,
        messages: [],
      });
      const fullText = await result.stream.text;
      const evaluation = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: evaluationSchema,
        prompt: `You are an expert evaluator of technical documentation.

Compare the generated response with the reference and score it from 1-10 based on:
- ${test.criteria}

Reference example (high quality):
${GOOD_EXAMPLE}

Generated response to evaluate:
${fullText}

Provide a score and detailed reasoning.`,
      });

      results.push({
        input: test.input,
        output: fullText,
        score: evaluation.object.score,
        passed: evaluation.object.score >= test.minimumScore,
        reasoning: evaluation.object.reasoning,

        minimumScore: test.minimumScore,
      });
    }
    results.forEach((result) => {
      // 4. Log and assert
      console.log(`\nLLM Judge Score: ${result.score}/10`);
      console.log(`Reasoning: ${result.reasoning}`);
      console.log(`\nGenerated Response:\n${result.output}\n`);
    });
    const passRate = results.filter((r) => r.passed).length / results.length;
    console.log(`Pass rate: ${(passRate * 100).toFixed(0)}%`);
    for (const result of results) {
      expect(result.score).toBeGreaterThanOrEqual(result.minimumScore);
    }
  });
});
