# Tool-Calling: Giving AI the Ability to Act

Tool-calling lets an AI model decide **when** and **how** to use external capabilities. Instead of you writing code that says "search the database, then generate a response," the AI itself decides whether to search at all.

Let's understand this with a simple example that has nothing to do with RAG.

---

## A Simple Example: Research Assistant

Imagine building an assistant that can answer questions like:

> "What's the population of Tokyo, and what's that divided by the population of New York?"

The AI can't do this alone. It needs:
1. **Web search** - to find current population data
2. **Calculator** - to do the math

Here's how tool-calling works:

```typescript
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = await streamText({
  model: openai('gpt-4o'),
  tools: {
    webSearch: tool({
      description: 'Search the web for current information',
      parameters: z.object({
        query: z.string().describe('The search query'),
      }),
      execute: async ({ query }) => {
        // Call a search API
        const results = await searchWeb(query);
        return results;
      },
    }),
    calculator: tool({
      description: 'Perform mathematical calculations',
      parameters: z.object({
        expression: z.string().describe('Math expression like "14000000 / 8300000"'),
      }),
      execute: async ({ expression }) => {
        // Safely evaluate the expression
        return eval(expression); // (use a safe math parser in production)
      },
    }),
  },
  messages: [
    { role: 'user', content: 'What is the population of Tokyo divided by the population of NYC?' }
  ],
});
```

---

## What Happens Under the Hood

1. **User asks the question**
2. **AI reads the available tools** and their descriptions
3. **AI decides**: "I need to search for Tokyo's population"
4. **Tool executes**: `webSearch({ query: "Tokyo population 2024" })`
5. **AI receives result**: "Tokyo metropolitan area: ~14 million"
6. **AI decides**: "Now I need NYC's population"
7. **Tool executes**: `webSearch({ query: "New York City population 2024" })`
8. **AI receives result**: "NYC: ~8.3 million"
9. **AI decides**: "Now I need to divide"
10. **Tool executes**: `calculator({ expression: "14000000 / 8300000" })`
11. **AI receives result**: `1.687`
12. **AI responds**: "Tokyo's population is about 1.69 times that of NYC"

The AI orchestrated the entire flow. You just defined the tools.

---

## The Key Insight

With tool-calling, you define **what** tools exist. The AI decides **when** to use them.

```
Traditional Code:    You → decide order → call functions → return result
Tool-Calling:        You → define tools → AI decides → AI calls → AI responds
```

This is powerful for **autonomous agents** that need to figure things out on their own.

---

## Autonomy vs. Predictability

Here's the trade-off:

### Tool-Calling (Autonomous)
- AI decides the workflow
- Flexible, can handle unexpected queries
- Less predictable
- More expensive (AI reasoning about what to do)
- Can make mistakes in orchestration

### Fixed Workflow (Deterministic)
- You decide the workflow
- Predictable, same steps every time
- Easier to debug and test
- Cheaper (no decision overhead)
- Can waste resources on simple queries

---

## When Workflows Beat Tool-Calling

**Here's the thing: most of the time, a fixed workflow is better.**

Why?

1. **You usually know what needs to happen.** If you're building a RAG app, you know every query needs: embed → search → rerank → generate. Why make the AI figure that out?

2. **Workflows are testable.** You can unit test each step. With tool-calling, the AI might take different paths for similar inputs.

3. **Workflows are cheaper.** No extra LLM calls to decide what to do.

4. **Workflows are debuggable.** When something breaks, you know exactly where.

**Tool-calling shines when:**
- You genuinely don't know what sequence of actions is needed
- The agent needs to explore and react dynamically
- You're building a general-purpose assistant

**Workflows win when:**
- The task has a known pattern
- Reliability matters more than flexibility
- You're building a single-purpose tool

---

## Your Challenge: Implement Tool-Calling RAG

Now it's your turn. Take your existing RAG workflow and refactor it to use tool-calling.

**Create:** `app/api/tool-calling-agent/route.ts`

**Resources:**
- [Vercel AI SDK - Tools and Tool Calling](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- [Vercel AI SDK - Multi-step Tool Calls](https://sdk.vercel.ai/docs/ai-sdk-core/agents)

**Hints:**
- Wrap your RAG logic (embed → search → rerank) inside a tool's `execute` function
- Use `toolChoice: 'auto'` so the AI decides when to search
- Add a good `description` so the AI knows when to use it

**Test it with:**
1. `"Thanks for your help!"` - Should NOT call the tool
2. `"How do I use useEffect?"` - Should call the tool
3. `"Hello, what can you do?"` - Should NOT call the tool
4. `"Explain React hooks"` - Should call the tool

---

## Think About It

Before moving to the next lesson, consider these scenarios. For each one, would you use tool-calling or a fixed workflow?

1. **A customer support bot** that answers questions about your product using a knowledge base.

2. **A code review assistant** that analyzes PRs, checks for security issues, runs linters, and suggests improvements.

3. **A travel planning agent** that needs to search flights, hotels, and activities, then combine them into an itinerary.

4. **A documentation Q&A bot** for your company's internal docs.

5. **A research assistant** that needs to search multiple sources, cross-reference information, and synthesize findings.

6. **A form-filling assistant** that extracts data from documents and populates a database.

Write down your answers. We'll discuss in the next lesson.

---

## Next Up

In the next lesson, we'll reveal our implementation and discuss when workflows beat tool-calling (spoiler: most of the time).

---
