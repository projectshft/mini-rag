# Upgrading to Structured Outputs

In the previous module, you implemented the selector using text parsing. Now you'll upgrade it to use OpenAI's structured outputs feature, which guarantees valid JSON responses every time.

---

## Video Walkthrough

Watch this guide to structured outputs:

<iframe src="https://share.descript.com/embed/V2JXix9ZTB0" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

By the end of this module, you'll have:

- Understanding of OpenAI's structured outputs feature
- Knowledge of Zod schemas for runtime validation
- A more reliable, type-safe selector implementation
- Experience refactoring from text parsing to structured outputs

---

## The Problem with Text Parsing

Your current implementation works, but it has limitations:

**LLM might return unpredictable formats:**
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

**Your parsing code needs to handle all these edge cases:**
```typescript
const lines = content.split('\n');
const agentLine = lines.find((line) => line.startsWith('AGENT:'));
// What if it's lowercase? What if there's extra whitespace?
```

---

## The Solution: Structured Outputs

**Structured outputs** guarantee that the LLM returns JSON matching your exact schema.

**How it works:**
```typescript
// 1. You define what you want
const schema = z.object({
  agent: z.enum(['linkedin', 'rag']),
  query: z.string(),
});

// 2. OpenAI constrains the model to only output valid JSON matching this schema
// 3. You get a guaranteed valid, type-safe response
```

### Benefits Comparison

| Aspect | Text Parsing | Structured Outputs |
|--------|--------------|-------------------|
| Type Safety | ❌ No | ✅ Yes (Zod validates) |
| Parsing | ❌ Manual | ✅ Automatic |
| Reliability | ⚠️ Can fail | ✅ Always valid JSON |
| DX | ❌ No autocomplete | ✅ Full TypeScript support |
| Debugging | ✅ Easy to see | ⚠️ Less transparent |
| Code Complexity | ⚠️ More parsing logic | ✅ Simpler |

---

## Documentation Resources

Before you start, familiarize yourself with these official docs:

**OpenAI Structured Outputs:**
- [Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs) - Complete guide to structured outputs
- [API Reference](https://platform.openai.com/docs/api-reference/chat/create#chat-create-response_format) - `response_format` parameter details

**Zod Schema Validation:**
- [Zod Documentation](https://zod.dev/) - Full Zod documentation
- [Zod GitHub](https://github.com/colinhacks/zod) - Examples and advanced usage
- [OpenAI Helpers: Zod](https://github.com/openai/openai-node/blob/master/helpers.md) - `zodTextFormat` helper

---

## Understanding Zod Schemas

Before we refactor, let's understand the schemas in `app/agents/types.ts`:

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
- Composes schemas (agentSelectionSchema uses agentTypeSchema)

**Example validation:**
```typescript
// ✅ Valid
agentSelectionSchema.parse({ agent: 'rag', query: 'React hooks' })

// ❌ Invalid - throws error
agentSelectionSchema.parse({ agent: 'invalid', query: 'test' })
// Error: Invalid enum value. Expected 'linkedin' | 'rag', received 'invalid'
```

---

## Your Challenge: Refactor to Structured Outputs

Now refactor your selector to use structured outputs.

### Step 1: Import the Helper

Add this import at the top of `app/api/select-agent/route.ts`:

```typescript
import { zodTextFormat } from 'openai/helpers/zod';
```

### Step 2: Update the OpenAI Call

Replace your `openaiClient.chat.completions.create()` call with the structured outputs API.

**Requirements:**
- Use `openaiClient.responses.parse()` instead of `chat.completions.create()`
- Change `messages` parameter to `input`
- Add `text.format` with `zodTextFormat(agentSelectionSchema, 'agent_selection')`
- Remove "respond in this exact format" from your prompt (OpenAI handles it)

**Hints:**
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

**Key changes:**
- `responses.parse()` instead of `chat.completions.create()`
- `input` instead of `messages`
- Added `text.format` with Zod schema
- Simplified system prompt (no format instructions needed)

### Step 3: Remove Parsing Logic

Replace all your text parsing code with direct access to the parsed result.

**Requirements:**
- Remove the `content.split()`, `.find()`, and string manipulation code
- Access the result directly from `result.output_parsed`
- Return `agent` and `query` from the parsed result

**Hints:**
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

**Benefits:**
- No manual string splitting
- No validation logic needed (Zod handles it)
- Full TypeScript autocomplete on `result.output_parsed`
- Guaranteed to match schema or throw error (caught by try/catch)

---

## Testing Your Refactored Implementation

Run the same curl tests from the previous module. The responses should be identical!

### Test 1: RAG Query

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

**Expected response:**
```json
{
  "agent": "rag",
  "query": "React hooks explanation"
}
```

### Test 2: LinkedIn Query

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

**Expected response:**
```json
{
  "agent": "linkedin",
  "query": "LinkedIn post about AI"
}
```

### Test 3: Edge Case (Invalid Agent Name)

Try to trick it by mentioning multiple agents:

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

**What happens:**
- OpenAI's structured output will pick ONE valid agent (probably "rag" since React is mentioned first)
- The schema enforces `z.enum(['linkedin', 'rag'])` - can't return both!
- You get a valid response even for ambiguous queries

---

## Behind the Scenes: How It Works

**When you use structured outputs:**

1. OpenAI converts your Zod schema to JSON Schema
2. The model's token generation is **constrained** by the schema
3. The model can literally only output valid JSON matching your schema
4. Response is automatically validated against Zod schema
5. You get a type-safe object (no parsing needed)

**Example:**
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

---

## Comparing the Two Approaches

### Text-Based Version (Before)

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

**Lines of code:** ~20
**Type safety:** ❌ None
**Can fail:** ⚠️ Yes (parsing errors)

### Structured Outputs Version (After)

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

**Lines of code:** ~8
**Type safety:** ✅ Full TypeScript support
**Can fail:** ✅ Only on validation errors (caught by try/catch)

---

## When to Use Each Approach

### Use Text Parsing When:
- ✅ Prototyping and learning
- ✅ Simple output formats
- ✅ You want to see raw LLM responses for debugging
- ✅ Output format might change frequently

### Use Structured Outputs When:
- ✅ Production applications
- ✅ Type safety is important
- ✅ Complex nested schemas
- ✅ You want guaranteed valid responses
- ✅ Multiple developers working on the codebase

**For this project:** Structured outputs are recommended for production!

---

## Common Issues and Solutions

### Issue: Schema Not Found Error

**Symptoms:**
```
Cannot find name 'agentSelectionSchema'
```

**Cause:** Schema is not exported from `types.ts`

**Solution:** Export the schema:
```typescript
export const agentSelectionSchema = z.object({
  agent: agentTypeSchema,
  query: z.string(),
});
```

### Issue: output_parsed is undefined

**Symptoms:**
```
Cannot read property 'agent' of undefined
```

**Cause:** Response parsing failed

**Solution:** Add null check:
```typescript
if (!result.output_parsed) {
  throw new Error('Failed to parse response');
}
return NextResponse.json({
  agent: result.output_parsed.agent,
  query: result.output_parsed.query,
});
```

### Issue: Still Getting Text Responses

**Symptoms:**
Response looks like text instead of structured JSON

**Cause:** Using wrong API method

**Solution:** Make sure you're using `responses.parse()` not `chat.completions.create()`

---

<details>
<summary>Click to reveal the full refactored solution</summary>

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

---

## What You've Learned

Now you understand:
- ✅ OpenAI's structured outputs feature
- ✅ How Zod schemas enforce runtime validation
- ✅ Benefits of structured outputs over text parsing
- ✅ How to refactor from text-based to structured approach
- ✅ When to use each approach

---

## Quick Reference

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

**Zod schema examples:**
```typescript
z.string()                          // Any string
z.number()                          // Any number
z.boolean()                         // true or false
z.enum(['a', 'b', 'c'])            // One of these strings
z.array(z.string())                 // Array of strings
z.object({ key: z.string() })       // Object with structure
z.string().optional()               // Optional string
```

**Further Reading:**
- [OpenAI Structured Outputs Best Practices](https://platform.openai.com/docs/guides/structured-outputs#best-practices)
- [Zod Type Inference Guide](https://zod.dev/?id=type-inference)
- [JSON Schema vs Zod](https://zod.dev/?id=json-schema)
