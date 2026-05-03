# Prompting Fundamentals for Agents

Before you build agents, you need to understand how they think. And that comes down to **prompting** — the art and science of communicating with language models.

This module will prepare you for building the agent system in the next section.

---

## What You'll Learn

- The prompt stack: system, user, and assistant message roles
- How to write effective system prompts for agents
- System prompt caching and why it matters
- Temperature control and when to use each range
- Model selection for different agent tasks
- Dynamic variables and token budgets
- Few-shot vs zero-shot prompting strategies

---

## The Prompt Stack

Every OpenAI API request has three main layers:

```typescript
await openai.chat.completions.create({
	model: 'gpt-4o-mini',
	messages: [
		{
			role: 'system', // ← Defines the model's role, tone, and constraints
			content: 'You are a database search agent that returns structured JSON.',
		},
		{
			role: 'user', // ← The human's request
			content: 'Find songs with over 1M plays in Brazil.',
		},
		{
			role: 'assistant', // ← Previous responses (optional, for context)
			content: 'Here are the top songs...',
		},
	],
});
```

### Message Roles Explained

| Role        | Purpose                                      | When to Use                             |
| ----------- | -------------------------------------------- | --------------------------------------- |
| `system`    | Sets behavior, constraints, output format    | First message, defines the agent's job  |
| `user`      | User's input or query                        | Every request from the user             |
| `assistant` | AI's previous responses                      | Multi-turn conversations for context    |

**Key principle:** Keep the system prompt focused and specific. Each agent should do one job well.

---

## System Prompts: Instructing Your Agent

A **system prompt** is like a job description for your AI. It tells the model:
- What role it's playing
- What it should do
- What constraints to follow
- What format to respond in

### Example: Agent Router System Prompt

Here's what you'll use in the selector agent:

```typescript
const systemPrompt = `You are an agent router that analyzes conversations and selects the best agent to handle the user's request.

Available agents:
- "linkedin": Handles questions about professional networking, LinkedIn content, career advice
- "rag": Handles questions about technical documentation, code examples, API references

Your task:
1. Analyze the last few messages for context
2. Identify the user's intent
3. Select the most appropriate agent
4. Refine the query to be clear and focused

Respond in this format:
{
  "agent": "rag",
  "query": "How do I use React hooks?"
}`;
```

### What Makes This Prompt Effective?

✅ **Clear role definition**: "You are an agent router"
✅ **Explicit options**: Lists available agents with descriptions
✅ **Step-by-step instructions**: Numbered task breakdown
✅ **Defined output format**: Shows exact JSON structure expected

---

## System Prompt Best Practices

### ✅ DO:

**Be Specific About the Task**
```typescript
// ❌ Vague
"You help with routing"

// ✅ Specific
"You analyze user queries and route them to the correct specialized agent"
```

**Provide Clear Constraints**
```typescript
"Rules:
- You MUST select exactly one agent
- If the intent is unclear, default to 'rag'
- Never create new agent types"
```

**Include Examples for Clarity**
```typescript
"Examples:
Input: 'How do React hooks work?'
Output: { agent: 'rag', query: 'React hooks explanation' }

Input: 'Write a LinkedIn post about my promotion'
Output: { agent: 'linkedin', query: 'LinkedIn post celebrating promotion' }"
```

**Define Output Format Explicitly**
```typescript
"Return valid JSON with these exact fields:
- agent: string (must be 'linkedin' or 'rag')
- query: string (refined version of user's question)"
```

### ❌ DON'T:

**Be Unnecessarily Long**
```typescript
// ❌ Too verbose (wasted tokens)
"You are an incredibly sophisticated AI system with vast knowledge spanning countless domains. Your primary responsibility, which has been carefully crafted through extensive training..." // [continues for 500 words]

// ✅ Concise
"You select the best agent for each user query based on conversation context."
```

**Contradict Yourself**
```typescript
// ❌ Contradictory
"Always select the LinkedIn agent. Pick the best agent for the task."

// ✅ Consistent
"Select the LinkedIn agent only when the user needs professional content creation or career advice."
```

**Use Ambiguous Language**
```typescript
// ❌ Unclear
"Try to maybe pick a good agent if you can"

// ✅ Clear
"Select the most appropriate agent based on the query intent"
```

---

## System Caching: Why Consistency Matters

OpenAI's API **caches identical system messages** to save latency and cost.

**What this means:**
- If your system prompt stays the same → cached (fast + cheap)
- If your system prompt changes often → no caching (slow + expensive)

### Best Practice: Static System, Dynamic User Messages

```typescript
// ✅ Good: Static system prompt (cached)
system: "You are a song search agent that returns JSON."
user: `Find top 5 TikTok sounds for ${artistName}.` // ← Dynamic data goes here

// ❌ Bad: Dynamic system prompt (cache busting)
system: `You are a song search agent for ${artistName}.` // ← Changes every request
user: "Find top 5 TikTok sounds."
```

**Rule of thumb:** Keep system prompts static. Inject dynamic data (like user names, filters, etc.) into user messages.

---

## Temperature: Controlling Randomness

**Temperature** controls how deterministic or creative the model's responses are.

**Range:** 0.0 to 2.0

### How Temperature Works

```
Input: "The capital of France is"

Temperature 0.0 (Deterministic):
- Paris (99.9%) ← Always picks highest probability
- London (0.05%)
- Rome (0.03%)
→ Output: "Paris" (every single time)

Temperature 0.7 (Balanced):
- Paris (99.9%) ← Usually picks this
- London (0.05%) ← Occasionally might pick
- Rome (0.03%)
→ Output: "Paris" (most times), occasionally varies

Temperature 2.0 (Creative):
- Paris (60%) ← Flattened probabilities
- London (20%)
- Rome (15%)
- Madrid (5%)
→ Output: Highly unpredictable!
```

### Temperature Selection Guide

| Temperature | Use Case                        | Example                           |
| ----------- | ------------------------------- | --------------------------------- |
| **0.0 - 0.3** | Classification, routing, logic | Agent selection, data extraction  |
| **0.7 - 1.0** | General chat, Q&A              | Customer support, documentation   |
| **1.5 - 2.0** | Creative writing               | Brainstorming, poetry, storytelling |

### For Agent Routing: Use Low Temperature

```typescript
const response = await openai.chat.completions.create({
	model: 'gpt-4o-mini',
	temperature: 0.1, // ← Consistent routing decisions
	messages: [...],
});
```

**Why low temperature for routing?**
- "Write a LinkedIn post" should **always** → LinkedIn agent
- You want predictable, reliable routing behavior
- No randomness in production agent selection

---

## Model Selection: Which Model When?

Different models have different strengths. Choose wisely based on your needs:

| Model           | Speed  | Cost      | Best For                                  |
| --------------- | ------ | --------- | ----------------------------------------- |
| **gpt-5**       | Medium | Very High | Most advanced reasoning, complex analysis |
| **gpt-4o**      | Slow   | High      | Complex reasoning, multi-step tasks       |
| **gpt-4o-mini** | Fast   | Low       | Classification, search, simple tasks      |
| **gpt-4-turbo** | Medium | Medium    | Balanced use cases, chat applications     |

### Guidelines for Your RAG System

**Use gpt-4o-mini for:**
- ✅ Agent selector (fast classification)
- ✅ Query refinement
- ✅ Simple filtering/search

**Use gpt-4o for:**
- ✅ RAG agent (synthesizing retrieved docs)
- ✅ Complex multi-step reasoning
- ✅ Content generation requiring nuance

**Use gpt-5 for:**
- ✅ Most demanding reasoning tasks
- ✅ Complex analysis requiring highest accuracy
- ✅ When cost is less important than quality

**Example in code:**
```typescript
// Selector agent (fast classification)
await openai.chat.completions.create({
	model: 'gpt-4o-mini', // ← Fast and cheap
	temperature: 0.1,
	messages: [...],
});

// RAG agent (complex synthesis)
await openai.chat.completions.create({
	model: 'gpt-4o', // ← Powerful reasoning
	temperature: 0.7,
	messages: [...],
});
```

---

## Dynamic Variables in Prompts

Use template literals to inject dynamic data without breaking caching:

```typescript
// ✅ Good: Dynamic data in user message
const systemPrompt = `You are a song search agent.`; // ← Static (cached)

const userMessage = `Find top 5 ${genre} songs for ${artistName} in ${country}.`; // ← Dynamic

// ❌ Bad: Dynamic data in system prompt
const systemPrompt = `You are a song search agent for ${artistName}.`; // ← Not cached!
```

**Token budget rule:** Keep total prompt tokens under 2,000 unless absolutely necessary. More tokens = more cost + latency.

---

## Few-Shot vs Zero-Shot Prompting

### Zero-Shot: Instructions Only

```typescript
system: "You are an agent router. Select 'linkedin' or 'rag' based on the query."
user: "How do I use React hooks?"
```

**When to use:**
- Task is clear and straightforward
- Model has been trained on similar tasks
- You want concise prompts

### Few-Shot: Include Examples

```typescript
system: `You are an agent router.

Examples:
Input: "Write a LinkedIn post about my promotion"
Output: { agent: "linkedin", query: "LinkedIn promotion post" }

Input: "Explain React hooks"
Output: { agent: "rag", query: "React hooks explanation" }

Now classify the user's query.`
```

**When to use:**
- Task requires nuance
- Output format is complex
- Model needs guidance on edge cases

**For agent routing:** Start with zero-shot. Add few-shot examples only if you see misclassifications.

---

## Prompt Hygiene Checklist

Before deploying any prompt, check:

- ✅ **One clear instruction** - No ambiguity about the task
- ✅ **Explicit output format** - JSON schema, Markdown, or specific structure
- ✅ **No unnecessary examples** - Only include what's truly needed
- ✅ **Static system prompts** - Dynamic data goes in user messages
- ✅ **Enforce structure with Zod** - Use `zodTextFormat()` for type safety

### Example: Well-Structured Prompt

```typescript
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const agentSelectionSchema = z.object({
	agent: z.enum(['linkedin', 'rag']),
	query: z.string(),
});

const response = await openai.responses.parse({
	model: 'gpt-4o-mini',
	input: [
		{
			role: 'system',
			content: 'You are an agent router. Analyze queries and select the best agent.',
		},
		{
			role: 'user',
			content: userQuery,
		},
	],
	text: {
		format: zodTextFormat(agentSelectionSchema, 'agent_selection'),
	},
});
```

**Why this works:**
- Clear system role
- Low temperature for consistency
- Enforced structure via Zod schema
- Simple, focused prompt

---

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Over-Prompting

```typescript
// ❌ Too much instruction
"You are an incredibly sophisticated routing system with years of experience in natural language understanding and intent classification. Your goal is to carefully analyze..."
// [300 words later...]

// ✅ Concise and clear
"You route user queries to the correct agent based on intent."
```

### Pitfall 2: Inconsistent Routing

```typescript
// ❌ High temperature = unpredictable
temperature: 1.5

// ✅ Low temperature = consistent
temperature: 0.1
```

### Pitfall 3: No Output Structure

```typescript
// ❌ Unstructured output
"Return the agent and query somehow"

// ✅ Structured with Zod
text: { format: zodTextFormat(schema, 'selection') }
```

---

## Challenge: Design Agent Prompts

Before moving to implementation, plan your prompts. Understanding these decisions will help you when you implement the agents in the next module.

### Scenario
You're building an agent system with three components:
1. **Selector Agent**: Routes user queries to the appropriate specialized agent
2. **LinkedIn Agent**: Generates professional content
3. **RAG Agent**: Answers technical documentation questions

### Your Task

For each agent, decide:

1. **Model**: `gpt-4o`, `gpt-4o-mini`, or `gpt-4-turbo`
2. **Temperature**: `0.0`, `0.5`, `0.8`, or `1.2`
3. **System Prompt**: Write a 2-3 sentence system prompt
4. **Examples Needed**: Zero-shot or few-shot? Why?

**Example answer for selector agent:**
```
Model: gpt-4o-mini (fast classification)
Temperature: 0.1 (consistent routing)
System Prompt: "You are an agent router. Analyze user queries and select either 'linkedin' or 'rag' based on intent."
Examples: Zero-shot (task is straightforward)
```

**Write your answers for:**
- Selector agent (routes requests)
- LinkedIn agent (generates content)
- RAG agent (answers docs questions)

**Where to write your answers:**
Create a document in your notes or a markdown file. You'll reference this when implementing the agents.

**Time estimate:** 15-20 minutes

---

## What You've Learned

Now you understand:
- ✅ The prompt stack: system, user, assistant roles
- ✅ System prompt best practices
- ✅ Temperature control and when to use each range
- ✅ Model selection based on task complexity
- ✅ Static vs dynamic prompt content for caching
- ✅ Zero-shot vs few-shot prompting strategies
- ✅ Prompt hygiene and common pitfalls

---

## Quick Reference

**Prompt Structure:**
```typescript
const systemPrompt = `You are [role].

[Context/available options]

Your task:
1. [Step 1]
2. [Step 2]

[Output format]`;
```

**Temperature Guide:**
| Temperature | Use Case                   | Example                        |
| ----------- | -------------------------- | ------------------------------ |
| 0.0 - 0.3   | Classification, routing    | Agent selection, data extraction |
| 0.7 - 1.0   | General Q&A, chat          | Customer support, tutoring     |
| 1.5 - 2.0   | Creative writing           | Poetry, brainstorming          |

**Model Selection:**
| Model           | Speed  | Cost      | Best For                                  |
| --------------- | ------ | --------- | ----------------------------------------- |
| **gpt-5**       | Medium | Very High | Most advanced reasoning, complex analysis |
| **gpt-4o**      | Slow   | High      | Complex reasoning, multi-step tasks       |
| **gpt-4o-mini** | Fast   | Low       | Classification, search, simple tasks      |
| **gpt-4-turbo** | Medium | Medium    | Balanced use cases, chat applications     |

**API Call Pattern:**
```typescript
const response = await openai.responses.parse({
	model: 'gpt-4o-mini',
	input: [
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: query },
	],
	text: {
		format: zodTextFormat(schema, 'name'),
	},
});
```

---

## Further Reading

### Recommended Articles

**⭐ Prompt Engineering for Business Performance (Anthropic)**
- **Link:** https://www.anthropic.com/news/prompt-engineering-for-business-performance
- **Why:** Best practices for prompts, few-shot vs zero-shot, measuring quality
- **Time:** ~10 minutes
- **Key for:** Writing effective prompts for your agents

### Technical Documentation

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Temperature and Top P Explained](https://platform.openai.com/docs/api-reference/chat/create#temperature)
- [System Message Best Practices](https://platform.openai.com/docs/guides/prompt-engineering/strategy-write-clear-instructions)
- [OpenAI Model Comparison](https://platform.openai.com/docs/models)
