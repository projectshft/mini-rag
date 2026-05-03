# Understanding Agent Systems

You've built the foundation - now let's make your RAG system intelligent. Agents are specialized AI systems that handle different types of tasks. Think of them like departments in a company.

---

## Video Walkthrough

Watch this introduction to agent architecture:

<iframe src="https://share.descript.com/embed/NU3Y2poBr00" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Build

By the end of this module, you'll understand:

-   What agents are and why we need them
-   How to route requests to the right agent
-   The agent architecture pattern
-   How to build an agent selector

---

## The Problem: One Model Can't Do Everything Well

Imagine you have a chatbot that needs to:

-   Answer questions about your LinkedIn content (needs your writing style)
-   Answer questions about React documentation (needs up-to-date info)
-   Handle casual conversation (needs general knowledge)

**One approach: Use one model for everything**

```typescript
// ❌ The naive approach
const response = await openai.chat.completions.create({
	model: 'gpt-4o',
	messages: [
		{ role: 'system', content: 'Answer any question' },
		{ role: 'user', content: userMessage },
	],
});
```

**Problems:**

-   Can't fine-tune for specific tasks
-   No specialized knowledge retrieval
-   Same prompt for all scenarios
-   Expensive (always uses big model)

---

## The Solution: Agent Architecture

Instead, use specialized agents:

```
User Question
    ↓
┌─────────────┐
│   Selector  │ ← Analyzes question and conversation
│   Agent     │   Decides which agent to use
└─────────────┘
    ↓
    ├→ LinkedIn Agent (fine-tuned model)
    ├→ RAG Agent (retrieval + GPT-4o)
    └→ ... more agents
    ↓
Specialized Response
```

**Benefits:**

-   Right tool for the job
-   Better quality answers
-   More cost effective
-   Easy to add new capabilities

---

## Real-World Analogy

Think of a hospital:

**Bad approach: One doctor**

-   One generalist doctor sees every patient
-   Slower, less specialized care
-   Can't be expert in everything

**Good approach: Specialists**

-   Triage nurse routes patients
-   Cardiologist handles heart issues
-   Orthopedist handles broken bones
-   Each is an expert in their domain

Your AI system works the same way!

---

## Understanding the Components

### 1. Agent Types (`app/agents/types.ts`)

```typescript
export type AgentType = 'linkedin' | 'rag';

export interface AgentRequest {
	type: AgentType; // Which agent is handling this
	query: string; // Refined/summarized query
	originalQuery: string; // What user actually said
	messages: Message[]; // Full conversation history
}

export type AgentResponse = StreamTextResult; // Streamed response
```

**Key insight: The AgentRequest interface**

This is your contract. Every agent receives the same structure but handles it differently:

-   `type`: So the agent knows what it's supposed to do
-   `query`: Refined query (selector removed fluff)
-   `originalQuery`: Maintains user's exact words
-   `messages`: For context-aware responses

### 2. Agent Config (`app/agents/config.ts`)

```typescript
export const agentConfigs: Record<AgentType, AgentConfig> = {
	linkedin: {
		name: 'LinkedIn Agent',
		description: 'For questions about LinkedIn, professional networking...',
	},
	rag: {
		name: 'RAG Agent',
		description: 'For questions about documentation, technical content...',
	},
};
```

**Why separate config?**

-   Single source of truth
-   Selector uses descriptions to route
-   Easy to add new agents (just add to config)
-   Documentation stays in sync with code

### 3. Agent Registry (`app/agents/registry.ts`)

```typescript
type AgentExecutor = (request: AgentRequest) => Promise<AgentResponse>;

export const agentRegistry: Record<AgentType, AgentExecutor> = {
	linkedin: linkedInAgent,
	rag: ragAgent,
};
```

**The Registry Pattern**

This is a common software pattern:

1. Map string keys to functions
2. Type-safe lookup
3. Runtime routing
4. Easy to extend

Think of it like a phone directory - given an agent name, quickly find the function to call.

---

## The Agent Selector: The Brain

Located at: `app/api/select-agent/route.ts`

This is the "triage nurse" of your system.

### What It Does

**Input:** Conversation history (last 5 messages)

**Process:**

1. Analyzes the conversation context
2. Determines user intent
3. Refines the query (removes conversational fluff)
4. Chooses the best agent

**Output:** `{ agent: 'rag', query: 'How do I use React hooks?' }`

### Why Last 5 Messages?

```typescript
const recentMessages = messages.slice(-5);
```

**Reasoning:**

-   Maintains conversation context
-   Understands follow-up questions
-   Not too much context (cost + latency)
-   Captures recent intent shift

Example:

```
User: "Tell me about yourself"
Bot: "I'm a RAG assistant..."
User: "What about hooks?" ← Without context, unclear!
```

With context, selector knows "hooks" refers to React (from earlier messages).

### The Selector Prompt

```typescript
const systemPrompt = `You are an agent router.
Based on the conversation history, determine which agent should handle
the request and create a focused query.

Available agents:
- "linkedin": For professional networking questions
- "rag": For technical documentation questions

Respond with: { "agent": "rag", "query": "clear focused query" }`;
```

**Why this works:**

-   Clear instructions
-   Explicit agent descriptions
-   Structured output (JSON)
-   Query refinement built-in

---

## Query Refinement: Why It Matters

**User says:** "yo can you tell me like what's the deal with that state management thing you mentioned earlier?"

**Selector refines to:** "What is React state management?"

**Benefits:**

-   Better embedding matching (if using RAG)
-   Clearer intent for the agent
-   Removes noise ("yo", "like", "you mentioned")
-   More precise retrieval

---

## The Chat Route: Tying It Together

Located at: `app/api/chat/route.ts`

This route receives:

```typescript
{
  messages: [...conversation],
  agent: 'rag',
  query: 'refined query'
}
```

Then:

1. Gets the agent executor from registry
2. Builds the AgentRequest
3. Executes the agent
4. Returns the stream

**Beautiful simplicity:** The route doesn't care HOW agents work, just that they follow the contract. Each agent is a black box that takes a request and returns a stream.

---

## Why This Architecture?

### Separation of Concerns

```
┌─────────────────┐
│ Select Agent    │ ← Routing logic
├─────────────────┤
│ Execute Agent   │ ← Execution logic
├─────────────────┤
│ LinkedIn Agent  │ ← Domain logic (professional)
├─────────────────┤
│ RAG Agent       │ ← Domain logic (documentation)
└─────────────────┘
```

Each layer has ONE job. Easy to:

-   Test individually
-   Modify without breaking others
-   Add new agents
-   Debug issues

### Type Safety

```typescript
// TypeScript prevents:
getAgent('invalid-agent') // ❌ Type error!
getAgent('rag')           // ✅ Works!

// And ensures:
every agent returns AgentResponse
every agent receives AgentRequest
```

### Extensibility

Want to add a "coding" agent? Four simple steps:

1. Add to types: `'linkedin' | 'rag' | 'coding'`
2. Add to config (name + description)
3. Add to registry (map to function)
4. Implement the agent function

Done! The selector automatically knows about it because it reads from the config.

---

## Common Patterns & Best Practices

### 1. Always Include Both Queries

Agents should receive BOTH the original and refined queries:

-   **Original**: Captures user's tone/style/exact words
-   **Refined**: Captures the core intent
-   **Together**: Gives complete context

### 2. Error Handling

**Fail fast:** If configuration is missing (like API keys), throw errors immediately during initialization, not later when handling requests.

### 3. Streaming Responses

All agents return streams, not complete responses:

-   Better UX (user sees response immediately)
-   Lower perceived latency
-   Can cancel long responses
-   Industry standard for chat apps

---

## Additional Reading

### Building Effective Agents (Anthropic)
**Link:** https://www.anthropic.com/engineering/building-effective-agents

**Why Read This:**
- Deep dive into agentic workflows vs simple prompts
- Routing patterns (exactly what we're building!)
- Tool-calling patterns
- Real-world examples from Anthropic's production systems

**Key Takeaways:**
- When to use agents vs workflows
- Agent orchestration patterns
- Common pitfalls and how to avoid them

This article reinforces the concepts in this lesson with production examples from Anthropic.
