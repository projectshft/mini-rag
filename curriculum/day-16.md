# Day 16 — Prompting for Agents

**Time:** ~60 min · Read + Exercise

> **Today:** before you build agents, you need to understand how they think — and that comes down to prompting. You'll learn the prompt stack, temperature, model selection, and caching, then design the prompts you'll implement tomorrow.

## The prompt stack

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

### Message roles explained

| Role        | Purpose                                   | When to use                            |
| ----------- | ----------------------------------------- | -------------------------------------- |
| `system`    | Sets behavior, constraints, output format | First message, defines the agent's job |
| `user`      | User's input or query                     | Every request from the user            |
| `assistant` | AI's previous responses                   | Multi-turn conversations for context   |

**Key principle:** keep the system prompt focused and specific. Each agent should do one job well.

## System prompts: instructing your agent

A **system prompt** is like a job description for your AI. It tells the model what role it's playing, what to do, what constraints to follow, and what format to respond in.

### Example: the agent router system prompt

Here's the shape of what you'll use in the selector agent:

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

**What makes this effective?**

- ✅ **Clear role definition**: "You are an agent router"
- ✅ **Explicit options**: lists available agents with descriptions
- ✅ **Step-by-step instructions**: numbered task breakdown
- ✅ **Defined output format**: shows the exact JSON structure expected

## System prompt best practices

### ✅ DO:

**Be specific about the task**

```typescript
// ❌ Vague
"You help with routing"

// ✅ Specific
"You analyze user queries and route them to the correct specialized agent"
```

**Provide clear constraints**

```typescript
"Rules:
- You MUST select exactly one agent
- If the intent is unclear, default to 'rag'
- Never create new agent types"
```

**Include examples for clarity**

```typescript
"Examples:
Input: 'How do React hooks work?'
Output: { agent: 'rag', query: 'React hooks explanation' }

Input: 'Write a LinkedIn post about my promotion'
Output: { agent: 'linkedin', query: 'LinkedIn post celebrating promotion' }"
```

**Define output format explicitly**

```typescript
"Return valid JSON with these exact fields:
- agent: string (must be 'linkedin' or 'rag')
- query: string (refined version of user's question)"
```

### ❌ DON'T:

**Be unnecessarily long**

```typescript
// ❌ Too verbose (wasted tokens)
"You are an incredibly sophisticated AI system with vast knowledge spanning countless domains. Your primary responsibility, which has been carefully crafted..." // [continues for 500 words]

// ✅ Concise
"You select the best agent for each user query based on conversation context."
```

**Contradict yourself**

```typescript
// ❌ Contradictory
"Always select the LinkedIn agent. Pick the best agent for the task."

// ✅ Consistent
"Select the LinkedIn agent only when the user needs professional content creation or career advice."
```

**Use ambiguous language**

```typescript
// ❌ Unclear
"Try to maybe pick a good agent if you can"

// ✅ Clear
"Select the most appropriate agent based on the query intent"
```

## System caching: why consistency matters

OpenAI's API **caches identical system messages** to save latency and cost.

- System prompt stays the same → cached (fast + cheap)
- System prompt changes often → no caching (slow + expensive)

### Best practice: static system, dynamic user messages

```typescript
// ✅ Good: Static system prompt (cached)
system: "You are a song search agent that returns JSON."
user: `Find top 5 TikTok sounds for ${artistName}.` // ← Dynamic data goes here

// ❌ Bad: Dynamic system prompt (cache busting)
system: `You are a song search agent for ${artistName}.` // ← Changes every request
user: "Find top 5 TikTok sounds."
```

**Rule of thumb:** keep system prompts static. Inject dynamic data (user names, filters, etc.) into user messages. And keep total prompt tokens under ~2,000 unless you truly need more — more tokens = more cost + latency.

## Temperature: controlling randomness

**Temperature** controls how deterministic or creative the model's responses are. Range: 0.0 to 2.0.

```
Input: "The capital of France is"

Temperature 0.0 (Deterministic):
- Paris (99.9%) ← Always picks highest probability
→ Output: "Paris" (every single time)

Temperature 0.7 (Balanced):
- Paris (99.9%) ← Usually picks this
- London (0.05%) ← Occasionally might pick
→ Output: "Paris" (most times), occasionally varies

Temperature 2.0 (Creative):
- Paris (60%) ← Flattened probabilities
- London (20%), Rome (15%), Madrid (5%)
→ Output: Highly unpredictable!
```

### Temperature selection guide

| Temperature   | Use case                       | Example                             |
| ------------- | ------------------------------ | ----------------------------------- |
| **0.0 – 0.3** | Classification, routing, logic | Agent selection, data extraction    |
| **0.7 – 1.0** | General chat, Q&A              | Customer support, documentation     |
| **1.5 – 2.0** | Creative writing               | Brainstorming, poetry, storytelling |

### For agent routing: use low temperature

```typescript
const response = await openai.chat.completions.create({
	model: 'gpt-4o-mini',
	temperature: 0.1, // ← Consistent routing decisions
	messages: [...],
});
```

"Write a LinkedIn post" should **always** route to the LinkedIn agent. You want predictable, reliable routing — no randomness in production agent selection.

## Model selection: which model when?

| Model           | Speed  | Cost      | Best for                                  |
| --------------- | ------ | --------- | ----------------------------------------- |
| **gpt-5**       | Medium | Very High | Most advanced reasoning, complex analysis |
| **gpt-4o**      | Slow   | High      | Complex reasoning, multi-step tasks       |
| **gpt-4o-mini** | Fast   | Low       | Classification, search, simple tasks      |
| **gpt-4-turbo** | Medium | Medium    | Balanced use cases, chat applications     |

### Guidelines for your RAG system

- **gpt-4o-mini:** agent selector (fast classification), query refinement, simple filtering/search
- **gpt-4o:** RAG agent (synthesizing retrieved docs), complex multi-step reasoning, nuanced content generation
- **gpt-5:** the most demanding reasoning tasks, when cost matters less than quality

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

```quiz
[
  {
    "q": "Your agent selector sometimes routes 'Write a LinkedIn post' to the RAG agent. Which knob do you reach for FIRST?",
    "options": ["Lower the temperature toward 0.0–0.3 so routing is deterministic", "Switch from gpt-4o-mini to gpt-5", "Move the agent descriptions into the user message"],
    "answer": 0,
    "explain": "Routing is classification — you want the model to always pick the highest-probability choice. High temperature injects randomness into a decision that should be consistent."
  },
  {
    "q": "Why put dynamic data (like the user's name) in the user message instead of the system prompt?",
    "options": ["OpenAI caches identical system prompts — a system prompt that changes every request busts the cache, costing latency and money", "System prompts have a lower token limit", "The model ignores variables in system prompts"],
    "answer": 0,
    "explain": "Static system prompt + dynamic user message = cache hits on every request. Interpolating variables into the system prompt makes each one unique."
  },
  {
    "q": "Which model is the right default for the selector agent, and why?",
    "options": ["gpt-4o-mini — routing is simple classification that runs on every message, so speed and cost dominate", "gpt-5 — routing accuracy is critical, so use the strongest model", "gpt-4o — you should always match the model used by the downstream agents"],
    "answer": 0,
    "explain": "The selector runs on every single message. Mini is excellent at classification, far cheaper, and faster — save the big models for synthesis tasks like the RAG agent."
  },
  {
    "q": "When should you add few-shot examples to the selector's prompt?",
    "options": ["Only after you observe misclassifications that clear instructions don't fix", "Always — more examples always improve accuracy", "Never — examples in system prompts break caching"],
    "answer": 0,
    "explain": "Start zero-shot: the task is straightforward and examples cost tokens on every request. Add targeted few-shot examples when you see real edge-case failures."
  }
]
```

## Few-shot vs zero-shot prompting

### Zero-shot: instructions only

```typescript
system: "You are an agent router. Select 'linkedin' or 'rag' based on the query."
user: "How do I use React hooks?"
```

**Use when:** the task is clear and straightforward, the model has seen similar tasks, and you want concise prompts.

### Few-shot: include examples

```typescript
system: `You are an agent router.

Examples:
Input: "Write a LinkedIn post about my promotion"
Output: { agent: "linkedin", query: "LinkedIn promotion post" }

Input: "Explain React hooks"
Output: { agent: "rag", query: "React hooks explanation" }

Now classify the user's query.`
```

**Use when:** the task requires nuance, the output format is complex, or the model needs guidance on edge cases.

**For agent routing:** start with zero-shot. Add few-shot examples only if you see misclassifications.

## Prompt hygiene checklist

Before deploying any prompt, check:

- ✅ **One clear instruction** — no ambiguity about the task
- ✅ **Explicit output format** — JSON schema, Markdown, or specific structure
- ✅ **No unnecessary examples** — only include what's truly needed
- ✅ **Static system prompts** — dynamic data goes in user messages
- ✅ **Enforce structure with Zod** — use `zodTextFormat()` for type safety (you'll do exactly this on [Day 18](/learn/day-18))

### Example: a well-structured prompt

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

Clear system role, enforced structure via a Zod schema, simple focused prompt.

## Common pitfalls

1. **Over-prompting** — 300 words of preamble about being "an incredibly sophisticated routing system" beats nothing out of a one-liner: "You route user queries to the correct agent based on intent."
2. **Inconsistent routing** — `temperature: 1.5` on a classifier means unpredictable routing. Use `0.1`.
3. **No output structure** — "return the agent and query somehow" invites chaos. Enforce it with a schema.

## Challenge: design your agent prompts

Before moving to implementation, plan your prompts. You'll reference these decisions when you implement the agents over the next few days.

**Scenario** — you're building an agent system with three components:

1. **Selector agent**: routes user queries to the appropriate specialized agent
2. **LinkedIn agent**: generates professional content
3. **RAG agent**: answers technical documentation questions

**For each agent, decide:**

1. **Model**: `gpt-4o`, `gpt-4o-mini`, or `gpt-4-turbo`
2. **Temperature**: `0.0`, `0.5`, `0.8`, or `1.2`
3. **System prompt**: write a 2–3 sentence system prompt
4. **Examples needed**: zero-shot or few-shot? Why?

Write your answers in your notes or a markdown file — actually write them, don't just think them. Time estimate: 15–20 minutes.

<details>
<summary>✅ Example answer (selector agent) — write yours first, then compare</summary>

```
Model: gpt-4o-mini (fast classification)
Temperature: 0.1 (consistent routing)
System Prompt: "You are an agent router. Analyze user queries and select either 'linkedin' or 'rag' based on intent."
Examples: Zero-shot (task is straightforward)
```

Now reason through the LinkedIn agent (creative content → higher temperature? bigger model?) and the RAG agent (grounded synthesis → what temperature keeps it factual but not robotic?) yourself. There's no single right answer — what matters is that you can defend each choice.

</details>

## Quick reference

**Prompt structure:**

```typescript
const systemPrompt = `You are [role].

[Context/available options]

Your task:
1. [Step 1]
2. [Step 2]

[Output format]`;
```

**API call pattern:**

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

## Further reading

- ⭐ [Prompt Engineering for Business Performance (Anthropic)](https://www.anthropic.com/news/prompt-engineering-for-business-performance) — best practices, few-shot vs zero-shot, measuring quality
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Temperature and Top P Explained](https://platform.openai.com/docs/api-reference/chat/create#temperature)
- [OpenAI Model Comparison](https://platform.openai.com/docs/models)

## ✅ Key takeaways

- The prompt stack has three roles: `system` (job description), `user` (the request), `assistant` (prior turns for context)
- Effective system prompts have a clear role, explicit options, numbered steps, and a defined output format — and stay concise
- Keep system prompts static and inject dynamic data into user messages, or you bust OpenAI's prompt cache on every request
- Low temperature (0.0–0.3) for classification/routing; mid for Q&A; high only for creative work
- Match the model to the task: gpt-4o-mini for the selector's fast classification, gpt-4o for the RAG agent's synthesis
- Start zero-shot; add few-shot examples only when you observe real misclassifications

## 🤖 Work with AI

```ai-prompt
title: Critique my agent prompt designs
---
I just completed a prompt-design exercise for a three-agent system: a selector agent (routes queries to 'linkedin' or 'rag'), a LinkedIn agent (generates professional posts), and a RAG agent (answers technical docs questions). For each I chose a model (gpt-4o / gpt-4o-mini / gpt-4-turbo), a temperature, a 2-3 sentence system prompt, and zero-shot vs few-shot.

Here are my answers: [PASTE YOUR THREE DESIGNS]

Act as a senior engineer reviewing them. For each agent: (1) challenge my model choice on cost — the selector runs on EVERY message; (2) test my temperature choice with a concrete failure scenario; (3) attack my system prompt for vagueness, contradiction, or cache-busting dynamic content; (4) give me one tricky user message and ask me to predict how my prompt handles it. Be tough but specific.
```

```ai-prompt
title: Temperature intuition drill
---
Help me build intuition for LLM temperature. Give me 8 real-world tasks one at a time (e.g. "extract invoice totals to JSON", "write a wedding toast", "route a support ticket to billing/tech/sales", "summarize a legal contract"). For each, I'll answer with a temperature range (0.0-0.3, 0.7-1.0, or 1.5-2.0) and one sentence of reasoning. Tell me if I'm right, and when I'm wrong, describe the concrete failure my choice would cause in production. Keep score and summarize my pattern of mistakes at the end.
```
