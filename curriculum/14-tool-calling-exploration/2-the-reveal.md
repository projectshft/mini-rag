# The Reveal: Our Tool-Calling Implementation

Let's see how we implemented tool-calling RAG, then discuss those scenarios from the previous lesson.

---

## Our Implementation

Here's a complete tool-calling RAG agent:

```typescript
// app/api/tool-calling-agent/route.ts
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { pineconeClient } from '@/app/libs/pinecone';
import { openaiClient } from '@/app/libs/openai/openai';

const searchDocsTool = tool({
	description: `Search the documentation for technical information about React,
hooks, components, and web development. Use this when users ask programming
questions that require looking up documentation.`,

	parameters: z.object({
		query: z.string().describe('The technical query to search for'),
	}),

	execute: async ({ query }) => {
		console.log('🔧 Tool called:', query);

		// Step 1: Generate embedding
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			input: query,
			dimensions: 512,
		});
		const embedding = embeddingResponse.data[0].embedding;

		// Step 2: Search Pinecone
		const index = pineconeClient.Index(process.env.PINECONE_INDEX!);
		const results = await index.query({
			vector: embedding,
			topK: 10,
			includeMetadata: true,
		});

		// Step 3: Extract documents
		const documents = results.matches
			.map((match) => match.metadata?.text)
			.filter(Boolean) as string[];

		// Step 4: Rerank
		const reranked = await pineconeClient.inference.rerank({
			model: 'bge-reranker-v2-m3',
			query,
			documents,
			topK: 5,
			returnDocuments: true,
		});

		// Step 5: Return context
		const context = reranked.data
			.map((r) => r.document?.text)
			.filter(Boolean)
			.join('\n\n');

		console.log('📊 Retrieved', reranked.data.length, 'docs');
		return context;
	},
});

export async function POST(request: NextRequest) {
	const { messages } = await request.json();

	const result = streamText({
		model: openai('gpt-4o'),
		tools: {
			search_documentation: searchDocsTool,
		},
		toolChoice: 'auto',
		maxSteps: 3,
		system: `You are a helpful assistant that answers questions about React and web development.

For technical questions about React, hooks, components, or programming concepts, use the search_documentation tool to find accurate information.

For general conversation, greetings, or simple clarifications, respond directly without using tools.`,
		messages,
	});

	return result.toDataStreamResponse();
}
```

---

## Key Design Decisions

### 1. Tool Description Matters

```typescript
description: `Search the documentation for technical information about React,
hooks, components, and web development. Use this when users ask programming
questions that require looking up documentation.`;
```

The description tells the AI **when** to use this tool. Be specific. Vague descriptions lead to unpredictable behavior.

### 2. maxSteps Prevents Infinite Loops

```typescript
maxSteps: 3,
```

Without this, the AI could theoretically keep calling tools forever. Set a reasonable limit.

### 3. System Prompt Guides Behavior

```typescript
system: `...For general conversation, greetings, or simple clarifications,
respond directly without using tools.`;
```

Explicitly tell the AI when NOT to use tools. Otherwise, it might search for "thanks for your help."

---

## Scenario Answers: Workflow vs. Tool-Calling

Let's revisit those scenarios.

### 1. Customer Support Bot (Knowledge Base)

**Answer: Workflow**

Every customer question needs the same thing: search the knowledge base, find relevant articles, generate a response. There's no decision to make—always search.

```
Query → Embed → Search KB → Rerank → Generate
```

Tool-calling would just add overhead for the AI to "decide" to do what it always needs to do.

---

### 2. Code Review Assistant

**Answer: Workflow**

A code review has a known checklist:

1. Check for security issues
2. Run linter
3. Check test coverage
4. Suggest improvements

You want **every PR** to go through all these steps. Letting the AI skip steps would be dangerous.

```
PR → Security Check → Lint → Coverage → Suggestions → Report
```

---

### 3. Travel Planning Agent

**Answer: Tool-Calling**

This is genuinely open-ended. The AI needs to:

- Search flights (maybe multiple airlines)
- Find hotels (based on flight times)
- Look up activities (based on interests)
- Check weather
- Combine into itinerary

The sequence depends on user preferences, budget constraints, and what's available. The AI needs autonomy to explore options.

---

### 4. Documentation Q&A Bot

**Answer: Workflow**

Same as customer support. Every question needs docs. Just search.

---

### 5. Research Assistant

**Answer: Tool-Calling**

Research is exploratory. The AI might:

- Start with one source, find a lead
- Follow that lead to another source
- Cross-reference findings
- Realize it needs to search for something else

This is exactly where tool-calling shines—the AI needs to dynamically decide what to investigate next.

---

### 6. Form-Filling Assistant

**Answer: Workflow**

Extract data from document → validate → populate database. Known steps, every time.

---

## The Pattern

Notice something?

**Use workflows when:**

- The task has a known pattern
- Every input needs the same processing
- Reliability > flexibility
- Single-purpose tool

**Use tool-calling when:**

- The task is genuinely open-ended
- Different inputs need different approaches
- Exploration and reasoning required
- General-purpose assistant

---

## The Honest Truth

**Most production AI features are workflows, not agents.**

Why? Because most business problems have known solutions:

- Answer customer questions → search and respond
- Summarize documents → extract and condense
- Classify emails → analyze and categorize

You don't need the AI to "figure out" what to do. You already know.

Tool-calling is powerful, but it's often overkill. It adds:

- Latency (AI has to think about what to do)
- Cost (extra tokens for reasoning)
- Unpredictability (different paths for similar inputs)
- Debugging complexity (which path did it take?)

**When in doubt, start with a workflow.** You can always add tool-calling later if you need more flexibility.

---

## Our RAG App: Workflow Wins

For our RAG application, we're sticking with the workflow approach:

```typescript
// Our actual implementation
export async function ragAgent(request: AgentRequest) {
	// Always: embed → search → rerank → generate
	const embedding = await generateEmbedding(request.query);
	const results = await searchPinecone(embedding);
	const reranked = await rerank(results);

	return streamText({
		model: openai('gpt-4o'),
		system: `Context: ${reranked}`,
		messages: request.messages,
	});
}
```

Every documentation question needs context. There's no decision to make. Workflow it is.

---

## But Wait—What About "Thanks!"?

You might ask: "Won't the workflow waste resources when someone says 'Thanks!'?"

Yes. But consider:

1. How often does that happen? Maybe 5% of queries?
2. What's the cost? A few cents per unnecessary search?
3. What's the alternative? Extra LLM call on every query to decide?

The math usually favors the simpler approach.

If "thanks" queries become a real cost problem, add a simple classifier **before** the workflow—not inside it with tools.

---

## Key Takeaways

1. **Tool-calling = AI decides the workflow.** Great for autonomous exploration.

2. **Fixed workflows = You decide the workflow.** Great for known patterns.

3. **Most production AI is workflows.** Tool-calling is the exception, not the rule.

4. **Start simple.** Build a workflow first. Add tool-calling only if you genuinely need dynamic behavior.

5. **Tool descriptions matter.** They're how the AI knows when to act.

6. **Workflows are testable, debuggable, and cheap.** That matters in production.

