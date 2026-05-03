# Implementing the Selector Agent (Text-Based)

The selector is the brain of your agent system. It reads conversation history and decides which specialized agent should respond. In this module, you'll implement it using a simple text-based approach.

---

## Video Walkthrough

Watch this guide to implementing the selector:

<iframe src="https://share.descript.com/embed/ipwcGMBuApw" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Build

By the end of this module, you'll have:

-   A working selector agent that routes queries to the correct agent
-   Understanding of text-based LLM responses and parsing
-   Query refinement logic to clean user input
-   Validation and fallback handling

---

## Understanding the Route

Open `app/api/select-agent/route.ts`. This route receives conversation history and returns which agent should handle the request.

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

---

## The Text-Based Approach

We'll start with the simplest approach: ask the LLM to return text in a specific format, then parse it.

**Pros:**

-   ✅ Simple to understand and debug
-   ✅ Easy to see what the LLM returns (just read the text)
-   ✅ Works reliably with clear prompts
-   ✅ No extra dependencies
-   ✅ Good for learning and prototyping

**Cons:**

-   ❌ Manual string parsing (can be brittle)
-   ❌ No type safety
-   ❌ LLM might not always follow format exactly
-   ❌ Extra error handling needed

---

## Understanding the Setup

The route already has some helpers:

```typescript
// Take last 5 messages for context
const recentMessages = messages.slice(-5);

// Build agent descriptions from config
const agentDescriptions = Object.entries(agentConfigs)
	.map(([key, config]) => `- "${key}": ${config.description}`)
	.join('\n');
```

**Why last 5 messages?**

-   Provides conversation context without overwhelming the prompt
-   Captures follow-up questions (e.g., "How about the state one?" referring to earlier "React hooks" discussion)
-   Balances context vs token cost

**The `.slice(-5)` trick:**

```typescript
[1, 2, 3]
	.slice(-5) // [1, 2, 3] (all, since < 5)
	[(1, 2, 3, 4, 5, 6)].slice(-5); // [2, 3, 4, 5, 6] (last 5)
```

---

## Your Challenge: Implement the Selector

Now it's your turn! Follow these steps to implement the text-based selector.

### Step 1: Call OpenAI

Replace the first TODO block in `app/api/select-agent/route.ts` with an OpenAI call.

**Requirements:**

-   Use `gpt-4o-mini` model (fast and cheap for classification)
-   System prompt should:
    -   Explain you're an agent router
    -   List available agents using `agentDescriptions`
    -   Ask for a specific text format: `AGENT: [name]\nQUERY: [refined query]`
-   Include `recentMessages` for context

**Hints:**

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
		// Add recent messages here
	],
});
```

### Step 2: Parse the Text Response

Extract the agent and query from the LLM's text response.

**Requirements:**

-   Get the content from `completion.choices[0]?.message?.content`
-   Split by newlines to get individual lines
-   Find the line starting with "AGENT:"
-   Find the line starting with "QUERY:"
-   Extract the values after the colons

**Hints:**

```typescript
const lines = content.split('\n');
const agentLine = lines.find((line) => line.startsWith('AGENT:'));
const queryLine = lines.find((line) => line.startsWith('QUERY:'));

const agent = agentLine?.split(':')[1]?.trim();
const query = queryLine?.split(':')[1]?.trim();
```

### Step 3: Validate and Return

Add validation to handle edge cases.

**Requirements:**

-   Check if the agent exists in `agentConfigs`
-   If not found, default to `'rag'`
-   If query parsing fails, use the original user message
-   Return a JSON response with `agent` and `query`

**Hints:**

```typescript
const validAgent =
	agent && agentConfigs[agent as keyof typeof agentConfigs] ? agent : 'rag';

return NextResponse.json({
	agent: validAgent,
	query: query || messages[messages.length - 1]?.content || '',
});
```

---

## Testing Your Implementation

### Test 1: Start the Dev Server

```bash
yarn dev
```

### Test 2: Simple RAG Query

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

**Expected response:**

```json
{
	"agent": "rag",
	"query": "How to use useState hook in React"
}
```

**What to check:**

-   ✅ Agent is "rag" (technical documentation question)
-   ✅ Query is refined (removed "How do I" conversational language)

### Test 3: LinkedIn Query

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

**Expected response:**

```json
{
	"agent": "linkedin",
	"query": "LinkedIn profile content ideas"
}
```

### Test 4: Context Understanding

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

**The selector should:**

-   Understand "state one" refers to "useState" from context
-   Still route to RAG agent
-   Refine query to "React useState hook"

---

## Understanding Query Refinement

**Why refine queries?**

User input often has conversational fluff that's not useful for retrieval:

| Original User Query                                  | Refined Query (Selector Output) |
| ---------------------------------------------------- | ------------------------------- |
| "yo can you tell me how to use that useState thing?" | "How to use useState hook"      |
| "What's the deal with React components?"             | "React components explanation"  |
| "I need help understanding props lol"                | "React props"                   |

**Benefits:**

-   Better embedding matching in vector search
-   Clearer intent for the agent
-   Removes noise words ("yo", "lol", "can you")
-   More precise retrieval results

---

## Why GPT-4o-mini for the Selector?

**Model comparison:**

| Model       | Cost (per 1M tokens) | Speed  | Capability          |
| ----------- | -------------------- | ------ | ------------------- |
| gpt-4o      | $2.50                | Slow   | Best reasoning      |
| gpt-4o-mini | $0.15                | Fast   | Good classification |
| gpt-4-turbo | $1.00                | Medium | Balanced            |

**Why mini for selector?**

-   ✅ Routing is simple classification (not complex reasoning)
-   ✅ Faster response = better UX
-   ✅ Runs on every single message (cost adds up)
-   ✅ Mini is excellent at classification tasks

**Cost example:**

-   1,000 messages/day with selector
-   ~500 tokens per request
-   **gpt-4o-mini:** $0.075/day ($2.25/month)
-   **gpt-4o:** $1.25/day ($37.50/month)

For a high-traffic app, this saves thousands of dollars!

---

## Common Issues and Solutions

### Issue: Wrong Agent Selected

**Symptoms:**

-   Technical questions going to LinkedIn agent
-   Career questions going to RAG agent

**Cause:** Agent descriptions too vague

**Solution:** Update `app/agents/config.ts` with specific descriptions:

```typescript
// ❌ Too vague
linkedin: {
	description: 'For professional content';
}

// ✅ Specific
linkedin: {
	description: 'For questions about LinkedIn profiles, professional networking, career advice, and creating LinkedIn posts';
}
```

### Issue: Query Not Refined

**Symptoms:**

-   Query looks identical to user input
-   Still has conversational words like "hey", "can you", "please"

**Cause:** Prompt doesn't emphasize refinement

**Solution:** Make it explicit in the system prompt:

```typescript
content: `...
The query should be:
- Clear and specific
- Remove conversational words like "hey", "um", "please"
- Focus on the core question
- Use proper technical terms
- Keep it concise (under 10 words when possible)`;
```

### Issue: Parsing Errors

**Symptoms:**

```
TypeError: Cannot read property 'split' of undefined
```

**Cause:** LLM didn't follow format exactly

**Solutions:**

1. Add more explicit format instructions
2. Add defensive parsing:

```typescript
const agent = agentLine?.split(':')[1]?.trim() || 'rag';
const query =
	queryLine?.split(':')[1]?.trim() ||
	messages[messages.length - 1]?.content ||
	'';
```

---

## Reference Solution

<details>
<summary>⚠️ Only look at this after attempting the exercise! Click to reveal the complete solution.</summary>

```typescript
// TODO: Students should implement this themselves first!
// This solution is provided for reference only after attempting the exercise.

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

---

## What You've Learned

Now you understand:

-   ✅ How to build an agent selector with OpenAI
-   ✅ Text-based LLM responses and parsing
-   ✅ Query refinement for better retrieval
-   ✅ Why to use gpt-4o-mini for classification
-   ✅ Handling conversation context with message slicing
-   ✅ Fallback logic and error handling

