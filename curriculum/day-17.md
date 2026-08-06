# Day 17 — Implementing the Selector (Text-Based)


> **Today:** you implement the brain of your agent system. The selector reads conversation history, picks the right agent, and refines the query — starting with the simplest approach: text in, text out, parse it yourself.

## Video walkthrough

Watch this guide to implementing the selector:

<iframe src="https://share.descript.com/embed/ipwcGMBuApw" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## What you'll build

By the end of today, you'll have:

- A working selector agent that routes queries to the correct agent
- Understanding of text-based LLM responses and parsing
- Query refinement logic to clean user input
- Validation and fallback handling

```visual
agent-router | Route a message to the right agent
```

## Understanding the route

Open [`app/api/select-agent/route.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/api/select-agent/route.ts). This route receives conversation history and returns which agent should handle the request.

**Input:**

```json
{
	"messages": [
		{ "role": "user", "content": "How do I use useState in React?" }
	]
}
```

**Output:**

```json
{
	"agent": "rag",
	"query": "How to use useState hook in React"
}
```

## The text-based approach

We'll start with the simplest approach: ask the LLM to return text in a specific format, then parse it.

**Pros:**

- Simple to understand and debug
- Easy to see what the LLM returns (just read the text)
- Works reliably with clear prompts
- No extra dependencies
- Good for learning and prototyping

**Cons:**

- Manual string parsing (can be brittle)
- No type safety
- LLM might not always follow the format exactly
- Extra error handling needed

(You'll fix the cons on [Day 18](/learn/day-18) by upgrading to structured outputs.)

## Understanding the setup

The route already has some helpers:

```typescript
// Take last 5 messages for context
const recentMessages = messages.slice(-5);

// Build agent descriptions from config
const agentDescriptions = Object.entries(agentConfigs)
	.map(([key, config]) => `- "${key}": ${config.description}`)
	.join('\n');
```

**Why last 5 messages?** Provides conversation context without overwhelming the prompt, captures follow-up questions (e.g., "How about the state one?" referring to an earlier "React hooks" discussion), and balances context vs token cost.

**The `.slice(-5)` trick:**

```typescript
[1, 2, 3].slice(-5); // [1, 2, 3] (all, since fewer than 5)
[1, 2, 3, 4, 5, 6].slice(-5); // [2, 3, 4, 5, 6] (last 5)
```

Notice `agentDescriptions` is built from [`app/agents/config.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/agents/config.ts) — add an agent to the config and the selector's prompt updates itself.

## Your challenge: implement the selector

Now it's your turn. Work through the TODOs in `app/api/select-agent/route.ts` in three steps. Try each step on your own before opening the hints — that struggle is where the learning happens.

### Step 1: Call OpenAI

Replace the first TODO block with an OpenAI call.

**Requirements:**

- Use the `gpt-4o-mini` model (fast and cheap for classification)
- The system prompt should:
  - Explain that the model is an agent router
  - List available agents using `agentDescriptions`
  - Ask for a specific text format: `AGENT: [name]\nQUERY: [refined query]`
- Include `recentMessages` for context

<details>
<summary>Hint 1 — the shape of the call</summary>

You need `openaiClient.chat.completions.create()` with a `model` and a `messages` array. The first message is your `system` prompt; the rest are the recent conversation messages spread in after it.

Think about what belongs in the system prompt: the router's job, the agent list (you already have `agentDescriptions` as a string — interpolate it), and the exact output format you'll parse in Step 2.

</details>

<details>
<summary>Hint 2 — a starting skeleton</summary>

```typescript
const completion = await openaiClient.chat.completions.create({
	model: 'gpt-4o-mini',
	messages: [
		{
			role: 'system',
			content: `You are an agent router...
Available agents:
${agentDescriptions}
Respond in this exact format:
AGENT: [agent_name]
QUERY: [refined query without conversational fluff]`,
		},
		// Add recent messages here — map them to { role, content }
	],
});
```

</details>

### Step 2: Parse the text response

Extract the agent and query from the LLM's text response.

**Requirements:**

- Get the content from `completion.choices[0]?.message?.content`
- Split by newlines to get individual lines
- Find the line starting with `AGENT:`
- Find the line starting with `QUERY:`
- Extract the values after the colons

<details>
<summary>Hint 1 — which array methods?</summary>

`content.split('\n')` gives you lines. `Array.prototype.find()` with `line.startsWith('AGENT:')` locates the right line. Then split that line on `':'` and `.trim()` the second piece. Use optional chaining everywhere — the LLM might not have followed the format.

</details>

<details>
<summary>Hint 2 — the parsing code</summary>

```typescript
const lines = content.split('\n');
const agentLine = lines.find((line) => line.startsWith('AGENT:'));
const queryLine = lines.find((line) => line.startsWith('QUERY:'));

const agent = agentLine?.split(':')[1]?.trim();
const query = queryLine?.split(':')[1]?.trim();
```

</details>

### Step 3: Validate and return

Add validation to handle edge cases.

**Requirements:**

- Check if the agent exists in `agentConfigs`
- If not found, default to `'rag'`
- If query parsing fails, use the original user message
- Return a JSON response with `agent` and `query`

<details>
<summary>Hint — validation with a fallback</summary>

```typescript
const validAgent =
	agent && agentConfigs[agent as keyof typeof agentConfigs] ? agent : 'rag';

return NextResponse.json({
	agent: validAgent,
	query: query || messages[messages.length - 1]?.content || '',
});
```

Why default to `'rag'`? It's the safest generalist — a misrouted technical question still gets a reasonable answer.

</details>

<details>
<summary>Solution — don't open until you've tried all three steps</summary>

```typescript
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = selectAgentSchema.parse(body);
		const { messages } = parsed;

		const recentMessages = messages.slice(-5);
		const agentDescriptions = Object.entries(agentConfigs)
			.map(([key, config]) => `- "${key}": ${config.description}`)
			.join('\n');

		// Step 1: Call OpenAI
		const completion = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are an agent router...
Available agents:
${agentDescriptions}

Respond in format:
AGENT: [agent_name]
QUERY: [refined query]`,
				},
				...recentMessages.map((msg) => ({ role: msg.role, content: msg.content })),
			],
		});

		// Step 2: Parse response
		const content = completion.choices[0]?.message?.content;
		if (!content) throw new Error('No response from OpenAI');

		const lines = content.split('\n');
		const agent = lines.find((l) => l.startsWith('AGENT:'))?.split(':')[1]?.trim();
		const query = lines.find((l) => l.startsWith('QUERY:'))?.split(':')[1]?.trim();

		// Step 3: Validate and return
		const validAgent = agent && agentConfigs[agent as keyof typeof agentConfigs] ? agent : 'rag';
		return NextResponse.json({ agent: validAgent, query });
	} catch (error) {
		console.error('Error selecting agent:', error);
		return NextResponse.json({ error: 'Failed to select agent' }, { status: 500 });
	}
}
```

</details>

```quiz
[
  {
    "q": "The LLM responds with 'Sure! AGENT: rag\\nQUERY: useState hook' — your parser breaks. What's the root issue with text-based parsing?",
    "options": ["The LLM isn't constrained to your format — parsing free text is inherently brittle", "gpt-4o-mini is too weak to follow instructions", "split('\\n') doesn't work on streamed responses"],
    "answer": 0,
    "explain": "Nothing forces the model to emit exactly 'AGENT: ...\\nQUERY: ...'. Preambles, case changes, and missing colons all break naive parsing — the core motivation for structured outputs on Day 18."
  },
  {
    "q": "Why does the fallback default to 'rag' when the parsed agent name isn't in agentConfigs?",
    "options": ["A wrong-but-valid route to the generalist agent beats crashing or returning an invalid agent the registry can't look up", "'rag' is alphabetically first", "The RAG agent is the cheapest to run"],
    "answer": 0,
    "explain": "The registry lookup would fail on an unknown name. Falling back to the general-purpose agent degrades gracefully — a preview of Day 19's theme."
  },
  {
    "q": "User asks 'Tell me about React hooks', then follows up with 'How about the state one?'. How does the selector handle the follow-up?",
    "options": ["The last-5-messages context lets it resolve 'the state one' to useState and route to rag", "It can't — follow-ups always route to the fallback agent", "It re-asks the user to clarify before routing"],
    "answer": 0,
    "explain": "Because recentMessages includes the earlier hooks exchange, the model can resolve the pronoun-like reference and still produce a refined query like 'React useState hook'."
  }
]
```

## Testing your implementation

### Test 1: start the dev server

```bash
yarn dev
```

### Test 2: simple RAG query

```bash
curl -X POST http://localhost:3000/api/select-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "How do I use useState in React?"
      }
    ]
  }'
```

<details>
<summary>Expected output</summary>

```json
{
	"agent": "rag",
	"query": "How to use useState hook in React"
}
```

**What to check:**

- Agent is `"rag"` (technical documentation question)
- Query is refined (removed the "How do I" conversational language)

</details>

### Test 3: LinkedIn query

```bash
curl -X POST http://localhost:3000/api/select-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What should I write about on my LinkedIn profile?"
      }
    ]
  }'
```

<details>
<summary>Expected output</summary>

```json
{
	"agent": "linkedin",
	"query": "LinkedIn profile content ideas"
}
```

</details>

### Test 4: context understanding

```bash
curl -X POST http://localhost:3000/api/select-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Tell me about React hooks"
      },
      {
        "role": "assistant",
        "content": "React hooks are functions that let you use state and lifecycle features..."
      },
      {
        "role": "user",
        "content": "How about the state one?"
      }
    ]
  }'
```

**The selector should:** understand "state one" refers to `useState` from context, still route to the RAG agent, and refine the query to something like "React useState hook".

## Understanding query refinement

User input often has conversational fluff that's not useful for retrieval:

| Original user query                                  | Refined query (selector output) |
| ---------------------------------------------------- | ------------------------------- |
| "yo can you tell me how to use that useState thing?" | "How to use useState hook"      |
| "What's the deal with React components?"             | "React components explanation"  |
| "I need help understanding props lol"                | "React props"                   |

**Benefits:** better embedding matching in vector search, clearer intent for the agent, removes noise words, more precise retrieval results.

## Why gpt-4o-mini for the selector?

| Model       | Cost (per 1M tokens) | Speed  | Capability          |
| ----------- | -------------------- | ------ | ------------------- |
| gpt-4o      | $2.50                | Slow   | Best reasoning      |
| gpt-4o-mini | $0.15                | Fast   | Good classification |
| gpt-4-turbo | $1.00                | Medium | Balanced            |

**Why mini?** Routing is simple classification (not complex reasoning), faster response = better UX, it runs on every single message (cost adds up), and mini is excellent at classification.

**Cost example** — 1,000 messages/day through the selector at ~500 tokens per request:

- **gpt-4o-mini:** $0.075/day ($2.25/month)
- **gpt-4o:** $1.25/day ($37.50/month)

For a high-traffic app, this choice saves thousands of dollars.

## Common issues and solutions

### Issue: wrong agent selected

**Symptoms:** technical questions going to the LinkedIn agent, career questions going to the RAG agent.

**Cause:** agent descriptions too vague. **Solution:** update [`app/agents/config.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/agents/config.ts) with specific descriptions:

```typescript
// Too vague
linkedin: {
	description: 'For professional content';
}

// Specific
linkedin: {
	description: 'For questions about LinkedIn profiles, professional networking, career advice, and creating LinkedIn posts';
}
```

### Issue: query not refined

**Symptoms:** query looks identical to user input, still has words like "hey", "can you", "please".

**Cause:** the prompt doesn't emphasize refinement. **Solution:** make it explicit in the system prompt:

```typescript
content: `...
The query should be:
- Clear and specific
- Remove conversational words like "hey", "um", "please"
- Focus on the core question
- Use proper technical terms
- Keep it concise (under 10 words when possible)`;
```

### Issue: parsing errors

**Symptoms:**

```
TypeError: Cannot read property 'split' of undefined
```

**Cause:** the LLM didn't follow the format exactly. **Solutions:** add more explicit format instructions, and add defensive parsing:

```typescript
const agent = agentLine?.split(':')[1]?.trim() || 'rag';
const query =
	queryLine?.split(':')[1]?.trim() ||
	messages[messages.length - 1]?.content ||
	'';
```

## Key takeaways

- The selector is one LLM call: system prompt (role + agent list + output format) plus the last 5 conversation messages
- Text-based output is great for learning and debugging, but parsing free text is brittle — the LLM isn't forced to follow your format
- Always validate the parsed agent against `agentConfigs` and fall back to `'rag'` — never trust LLM output blindly
- Query refinement strips conversational fluff, which pays off directly in retrieval quality
- gpt-4o-mini is the right model for routing: classification runs on every message, so speed and cost dominate

## Work with AI

```ai-prompt
title: Generate adversarial test cases for my selector
---
I just implemented a text-based agent selector in app/api/select-agent/route.ts. It sends the last 5 conversation messages to gpt-4o-mini with a system prompt asking for "AGENT: [name]\nQUERY: [refined query]", parses the lines, validates the agent against agentConfigs ('linkedin' | 'rag'), and falls back to 'rag'.

Generate 10 adversarial test messages as curl-ready JSON bodies for POST /api/select-agent, covering: (1) ambiguous queries touching BOTH domains, (2) follow-ups that only make sense with conversation context, (3) messages likely to make the LLM break the AGENT:/QUERY: format (e.g. asking it to respond in JSON or another language), (4) slang-heavy queries that test refinement. For each, tell me the expected agent and refined query BEFORE I run it, then help me diagnose any that misroute.
```

```ai-prompt
title: Explain my parsing code back and poke holes
---
Here is my Step 2 parsing code from the selector agent (I'll paste it below). First, I'll explain line by line what it does and why — play the skeptical senior engineer. After my explanation, poke holes: ask me what happens if the LLM returns a preamble line, lowercase 'agent:', a query containing a colon (like "React: hooks explained"), or an empty response. For each hole I can't answer, show me the one-line fix and explain why split(':')[1] specifically is a landmine.

[PASTE YOUR PARSING CODE HERE]
```
