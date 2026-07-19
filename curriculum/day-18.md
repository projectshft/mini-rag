# Day 18 — Upgrading to Structured Outputs


> **Today:** yesterday your selector parsed free text and hoped the LLM followed the format. Today you refactor it to OpenAI's structured outputs with a Zod schema — guaranteed valid JSON, type-safe, no string surgery.

## Video walkthrough

Watch this guide to structured outputs:

<iframe src="https://share.descript.com/embed/V2JXix9ZTB0" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## What you'll learn

By the end of today, you'll have:

- Understanding of OpenAI's structured outputs feature
- Knowledge of Zod schemas for runtime validation
- A more reliable, type-safe selector implementation
- Experience refactoring from text parsing to structured outputs

## The problem with text parsing

Your [Day 17](/learn/day-17) implementation works, but it has limitations. The LLM might return unpredictable formats:

```typescript
// Expected:
"AGENT: rag\nQUERY: useState info"

// But you might get:
"Here's my response:\nAGENT: rag\nQUERY: useState info\nHope that helps!"
// Or:
"AGENT rag\nQUERY: useState info"  // Missing colon!
// Or:
"agent: rag\nquery: useState"     // Wrong case!
```

Your parsing code needs to handle all these edge cases:

```typescript
const lines = content.split('\n');
const agentLine = lines.find((line) => line.startsWith('AGENT:'));
// What if it's lowercase? What if there's extra whitespace?
```

## The solution: structured outputs

**Structured outputs** guarantee that the LLM returns JSON matching your exact schema.

```typescript
// 1. You define what you want
const schema = z.object({
	agent: z.enum(['linkedin', 'rag']),
	query: z.string(),
});

// 2. OpenAI constrains the model to only output valid JSON matching this schema
// 3. You get a guaranteed valid, type-safe response
```

### Benefits comparison

| Aspect          | Text parsing          | Structured outputs        |
| --------------- | --------------------- | ------------------------- |
| Type safety     | No                 | Yes (Zod validates)    |
| Parsing         | Manual             | Automatic              |
| Reliability     | Can fail           | Always valid JSON      |
| DX              | No autocomplete    | Full TypeScript support |
| Debugging       | Easy to see        | Less transparent       |
| Code complexity | More parsing logic | Simpler                |

## Documentation resources

Before you start, skim these official docs:

**OpenAI structured outputs:**

- [Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs) — complete guide
- [API Reference](https://platform.openai.com/docs/api-reference/chat/create#chat-create-response_format) — `response_format` parameter details

**Zod schema validation:**

- [Zod Documentation](https://zod.dev/) — full docs
- [Zod GitHub](https://github.com/colinhacks/zod) — examples and advanced usage
- [OpenAI Helpers: Zod](https://github.com/openai/openai-node/blob/master/helpers.md) — the `zodTextFormat` helper

## Understanding Zod schemas

Before we refactor, look at the schemas in [`app/agents/types.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/agents/types.ts):

```typescript
import { z } from 'zod';

// Message schema - validates incoming messages
export const messageSchema = z.object({
	role: z.enum(['user', 'assistant', 'system']),
	content: z.string(),
});

// Agent type schema - the valid agent names
export const agentTypeSchema = z.enum(['linkedin', 'rag']);

// Selection schema - what the selector returns
const agentSelectionSchema = z.object({
	agent: agentTypeSchema,
	query: z.string(),
});
```

**What Zod does:**

- Validates data at runtime
- Provides TypeScript types automatically
- Throws descriptive errors if validation fails
- Composes schemas (`agentSelectionSchema` uses `agentTypeSchema`)

Build the schema yourself before you scroll further:

```blanks
{
  "title": "Complete the selector's zod schemas",
  "note": "Every blank is a real decision — pick what you'd actually write.",
  "code": "export const messageSchema = z.object({\n  role: z.___1___(['user', 'assistant', 'system']),\n  content: z.___2___(),\n});\n\nexport const agentTypeSchema = z.enum(['linkedin', 'rag']);\n\nconst agentSelectionSchema = z.___3___({\n  agent: ___4___,\n  query: z.string(),\n});",
  "blanks": [
    { "options": ["enum", "string", "literal"], "answer": "enum", "explain": "role must be one of exactly three values — that's an enum. z.string() would accept 'banana' as a role." },
    { "options": ["string", "text", "any"], "answer": "string", "explain": "Free-form text is z.string(). z.any() throws away the type safety you came here for; z.text() doesn't exist." },
    { "options": ["object", "schema", "shape"], "answer": "object", "explain": "A schema with named fields is z.object({...})." },
    { "options": ["agentTypeSchema", "z.string()", "'linkedin' | 'rag'"], "answer": "agentTypeSchema", "explain": "Compose schemas — reuse the enum you already defined. z.string() would let the model route to an agent that doesn't exist; the union syntax is TypeScript types, not zod." }
  ]
}
```

And here's the whole day in one live call — the selector returning schema-constrained JSON, using your class key:

```try-it
{ "kind": "structured-output", "title": "The selector, live", "description": "Sends your message through a real selector with a strict JSON schema ({ agent, confidence, reasoning }). Try to phrase something that breaks it — the schema won't let it." }
```

**Example validation:**

```typescript
// Valid
agentSelectionSchema.parse({ agent: 'rag', query: 'React hooks' })

// Invalid - throws error
agentSelectionSchema.parse({ agent: 'invalid', query: 'test' })
// Error: Invalid enum value. Expected 'linkedin' | 'rag', received 'invalid'
```

## Your challenge: refactor to structured outputs

Refactor your selector in [`app/api/select-agent/route.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/api/select-agent/route.ts). Work through each step yourself before opening the hints.

### Step 1: Import the helper

Add this import at the top of the file:

```typescript
import { zodTextFormat } from 'openai/helpers/zod';
```

### Step 2: Update the OpenAI call

Replace your `openaiClient.chat.completions.create()` call with the structured outputs API.

**Requirements:**

- Use `openaiClient.responses.parse()` instead of `chat.completions.create()`
- Change the `messages` parameter to `input`
- Add `text.format` with `zodTextFormat(agentSelectionSchema, 'agent_selection')`
- Remove "respond in this exact format" from your prompt (OpenAI handles it now)

<details>
<summary>Hint 1 — what changes, what stays</summary>

The system prompt content mostly survives — the router role, the `agentDescriptions` list, the query-refinement instruction. What goes away is the `AGENT:/QUERY:` format instruction, because the schema now enforces the shape. The message array moves from `messages:` to `input:`, and the schema plugs in under `text.format`.

</details>

<details>
<summary>Hint 2 — the full call shape</summary>

```typescript
const result = await openaiClient.responses.parse({
	model: 'gpt-4o-mini',
	input: [
		{
			role: 'system',
			content: `You are an agent router. Based on the conversation history, determine which agent should handle the request and create a focused query.

Available agents:
${agentDescriptions}

The query should be a refined, clear version of what the user wants, removing conversational fluff.`,
		},
		...recentMessages.map((msg) => ({
			role: msg.role,
			content: msg.content,
		})),
	],
	text: {
		format: zodTextFormat(agentSelectionSchema, 'agent_selection'),
	},
});
```

Key changes: `responses.parse()` instead of `chat.completions.create()`, `input` instead of `messages`, `text.format` carries the Zod schema, and the prompt no longer needs format instructions.

</details>

### Step 3: Remove the parsing logic

Replace all your text parsing code with direct access to the parsed result.

**Requirements:**

- Remove the `content.split()`, `.find()`, and string-manipulation code
- Access the result directly from `result.output_parsed`
- Return `agent` and `query` from the parsed result

<details>
<summary>Hint — what replaces ~15 lines of parsing</summary>

```typescript
// Remove all this:
// const content = completion.choices[0]?.message?.content;
// const lines = content.split('\n');
// const agentLine = lines.find(...)
// const agent = agentLine?.split(':')[1]?.trim();

// Replace with:
return NextResponse.json({
	agent: result.output_parsed.agent,
	query: result.output_parsed.query,
});
```

No manual string splitting, no validation logic (Zod handles it), full TypeScript autocomplete on `result.output_parsed`, and it's guaranteed to match the schema or throw (caught by your try/catch).

</details>

<details>
<summary>Solution — full refactored route, don't open until you've tried</summary>

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { openaiClient } from '@/app/libs/openai/openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { agentTypeSchema, messageSchema } from '@/app/agents/types';
import { agentConfigs } from '@/app/agents/config';

const selectAgentSchema = z.object({
	messages: z.array(messageSchema).min(1),
});

const agentSelectionSchema = z.object({
	agent: agentTypeSchema,
	query: z.string(),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = selectAgentSchema.parse(body);
		const { messages } = parsed;

		const recentMessages = messages.slice(-5);

		const agentDescriptions = Object.entries(agentConfigs)
			.map(([key, config]) => `- "${key}": ${config.description}`)
			.join('\n');

		// Use structured outputs
		const result = await openaiClient.responses.parse({
			model: 'gpt-4o-mini',
			input: [
				{
					role: 'system',
					content: `You are an agent router. Based on the conversation history, determine which agent should handle the request and create a focused query.

Available agents:
${agentDescriptions}

The query should be a refined, clear version of what the user wants, removing conversational fluff.`,
				},
				...recentMessages.map((msg) => ({
					role: msg.role,
					content: msg.content,
				})),
			],
			text: {
				format: zodTextFormat(agentSelectionSchema, 'agent_selection'),
			},
		});

		// Return parsed result directly
		return NextResponse.json({
			agent: result.output_parsed.agent,
			query: result.output_parsed.query,
		});
	} catch (error) {
		console.error('Error selecting agent:', error);
		return NextResponse.json(
			{ error: 'Failed to select agent' },
			{ status: 500 }
		);
	}
}
```

</details>

## Behind the scenes: how it works

When you use structured outputs:

1. OpenAI converts your Zod schema to JSON Schema
2. The model's token generation is **constrained** by the schema
3. The model can literally only output valid JSON matching your schema
4. The response is automatically validated against the Zod schema
5. You get a type-safe object (no parsing needed)

```typescript
// Your schema says agent must be 'linkedin' or 'rag'
agent: z.enum(['linkedin', 'rag'])

// The model cannot output:
// - "linkedin_agent" (not in enum)
// - "RAG" (wrong case)
// - ["rag"] (wrong type)
// - null (not allowed)

// It can ONLY output exactly: "linkedin" or "rag"
```

```quiz
[
  {
    "q": "How do structured outputs GUARANTEE the response matches your schema?",
    "options": ["OpenAI constrains the model's token generation so it can only emit JSON valid against the schema", "The SDK retries the request until the JSON happens to validate", "The prompt threatens the model with format instructions in all caps"],
    "answer": 0,
    "explain": "The Zod schema becomes a JSON Schema that constrains decoding itself — invalid tokens can't be generated. It's enforcement, not a polite request."
  },
  {
    "q": "With `agent: z.enum(['linkedin', 'rag'])`, what happens if the model 'wants' to answer with a third agent name?",
    "options": ["It can't — generation is constrained to the enum values, so you always get 'linkedin' or 'rag'", "It returns null and you fall back manually", "It returns the string with a warning field attached"],
    "answer": 0,
    "explain": "That's why the Day 17 validate-and-fallback dance shrinks: the enum makes invalid agent names unrepresentable in the output."
  },
  {
    "q": "You switched to responses.parse() but responses still look like free text. Most likely cause?",
    "options": ["You're still calling chat.completions.create() somewhere instead of responses.parse()", "Your temperature is too high", "Zod schemas only work with gpt-4o, not gpt-4o-mini"],
    "answer": 0,
    "explain": "This is the classic refactor slip — the structured behavior comes from responses.parse() plus text.format. The old call path ignores your schema entirely."
  },
  {
    "q": "What's the honest downside of structured outputs vs text parsing?",
    "options": ["Less transparency — you don't see raw model text, which made debugging easy in the text version", "It's slower because JSON has more tokens", "It only supports flat, non-nested schemas"],
    "answer": 0,
    "explain": "Text parsing let you read exactly what the model said. Structured outputs trade that visibility for reliability — usually the right trade in production."
  }
]
```

## Testing your refactored implementation

Run the same curl tests from [Day 17](/learn/day-17) — the responses should be identical.

### Test 1: RAG query

```bash
curl -X POST http://localhost:3000/api/select-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Explain React hooks"
      }
    ]
  }'
```

<details>
<summary>Expected output</summary>

```json
{
	"agent": "rag",
	"query": "React hooks explanation"
}
```

</details>

### Test 2: LinkedIn query

```bash
curl -X POST http://localhost:3000/api/select-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Help me write a LinkedIn post about AI"
      }
    ]
  }'
```

<details>
<summary>Expected output</summary>

```json
{
	"agent": "linkedin",
	"query": "LinkedIn post about AI"
}
```

</details>

### Test 3: edge case (try to trick it)

Mention multiple agents' domains at once:

```bash
curl -X POST http://localhost:3000/api/select-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Can you tell me about React and also help with my LinkedIn?"
      }
    ]
  }'
```

**What happens:** OpenAI's structured output picks ONE valid agent (probably `"rag"` since React is mentioned first). The schema enforces `z.enum(['linkedin', 'rag'])` — it can't return both. You get a valid response even for ambiguous queries.

## Comparing the two approaches

### Text-based version (before)

```typescript
// Call OpenAI
const completion = await openaiClient.chat.completions.create({
	model: 'gpt-4o-mini',
	messages: [...],
});

// Parse response manually
const content = completion.choices[0]?.message?.content;
const lines = content.split('\n');
const agentLine = lines.find((line) => line.startsWith('AGENT:'));
const agent = agentLine?.split(':')[1]?.trim();

// Validate manually
const validAgent =
	agent && agentConfigs[agent as keyof typeof agentConfigs] ? agent : 'rag';

return NextResponse.json({ agent: validAgent, query });
```

~20 lines · no type safety · can fail on parsing errors

### Structured outputs version (after)

```typescript
// Call OpenAI with schema
const result = await openaiClient.responses.parse({
	model: 'gpt-4o-mini',
	input: [...],
	text: {
		format: zodTextFormat(agentSelectionSchema, 'agent_selection'),
	},
});

// Use parsed result directly
return NextResponse.json({
	agent: result.output_parsed.agent,
	query: result.output_parsed.query,
});
```

~8 lines · full TypeScript support · fails only on validation errors (caught by try/catch)

## When to use each approach

**Text parsing when:** prototyping and learning, simple output formats, you want raw LLM responses for debugging, or the format changes frequently.

**Structured outputs when:** production applications, type safety matters, complex nested schemas, guaranteed valid responses, multiple developers on the codebase.

**For this project:** structured outputs are the production choice.

## Common issues and solutions

### Issue: schema not found error

**Symptoms:** `Cannot find name 'agentSelectionSchema'`

**Cause:** the schema isn't exported from `types.ts`. **Solution:**

```typescript
export const agentSelectionSchema = z.object({
	agent: agentTypeSchema,
	query: z.string(),
});
```

### Issue: `output_parsed` is undefined

**Symptoms:** `Cannot read property 'agent' of undefined`

**Cause:** response parsing failed. **Solution:** add a null check:

```typescript
if (!result.output_parsed) {
	throw new Error('Failed to parse response');
}
return NextResponse.json({
	agent: result.output_parsed.agent,
	query: result.output_parsed.query,
});
```

### Issue: still getting text responses

**Symptoms:** response looks like text instead of structured JSON.

**Cause:** wrong API method. **Solution:** make sure you're using `responses.parse()`, not `chat.completions.create()`.

## Quick reference

**Structured outputs pattern:**

```typescript
import { zodTextFormat } from 'openai/helpers/zod';

const schema = z.object({
	field1: z.string(),
	field2: z.enum(['option1', 'option2']),
});

const result = await openaiClient.responses.parse({
	model: 'gpt-4o-mini',
	input: [...messages],
	text: {
		format: zodTextFormat(schema, 'schema_name'),
	},
});

const data = result.output_parsed; // Type-safe!
```

**Zod schema cheat sheet:**

```typescript
z.string()                    // Any string
z.number()                    // Any number
z.boolean()                   // true or false
z.enum(['a', 'b', 'c'])       // One of these strings
z.array(z.string())           // Array of strings
z.object({ key: z.string() }) // Object with structure
z.string().optional()         // Optional string
```

**Further reading:** [Structured Outputs Best Practices](https://platform.openai.com/docs/guides/structured-outputs#best-practices) · [Zod Type Inference](https://zod.dev/?id=type-inference) · [JSON Schema vs Zod](https://zod.dev/?id=json-schema)

## Key takeaways

- Structured outputs constrain the model's token generation to your schema — valid JSON is guaranteed, not requested
- Zod gives you one schema for both runtime validation and TypeScript types, and `zodTextFormat()` wires it into the OpenAI call
- The refactor swaps `chat.completions.create()` + ~15 lines of parsing for `responses.parse()` + `result.output_parsed`
- `z.enum(['linkedin', 'rag'])` makes invalid agent names unrepresentable — most of yesterday's fallback logic evaporates
- Text parsing still has a place for prototyping and debugging; structured outputs win in production

## Work with AI

```ai-prompt
title: Explain structured outputs back and poke holes
---
I just refactored my agent selector (app/api/select-agent/route.ts) from text parsing to OpenAI structured outputs: openaiClient.responses.parse() with text.format: zodTextFormat(agentSelectionSchema, 'agent_selection'), where the schema is z.object({ agent: z.enum(['linkedin','rag']), query: z.string() }).

I'm going to explain to you, Feynman-style, HOW the guarantee works — from Zod schema to JSON Schema to constrained token generation. After my explanation, poke holes: ask me what can still fail (network errors? refusals? output_parsed being undefined?), whether I still need my 'rag' fallback from the text version and why/why not, and what I lost in debuggability. Rate my explanation 1-10 and tell me the one gap to study before my weekly video.
```

```ai-prompt
title: Help me extend the schema
---
My selector returns z.object({ agent: z.enum(['linkedin','rag']), query: z.string() }) via OpenAI structured outputs. Help me extend it as an exercise — but make ME write the code first at each step.

Step 1: add a `confidence: z.number()` (0-1) field and a `reasoning: z.string()` field. Ask me: what should the system prompt say about them, and where would the chat route use confidence (hint: low-confidence routing)? Step 2: add an optional field and ask me how z.string().optional() behaves differently in structured outputs. Step 3: quiz me on what happens to existing consumers of this API response when fields are added. Critique my code against Zod and zodTextFormat best practices as we go.
```
