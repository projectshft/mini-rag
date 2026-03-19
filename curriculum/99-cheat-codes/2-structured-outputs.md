# Structured Outputs

Force LLM to return valid JSON matching your schema.

---

## AI SDK (Vercel)

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const schema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
});

const result = await generateObject({
  model: openai('gpt-4o'),
  schema,
  prompt: `Analyze this review: "${userInput}"`,
});

// result.object is typed and validated
console.log(result.object.sentiment);
```

---

## OpenAI SDK

```typescript
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openai = new OpenAI();

const schema = z.object({
  selectedAgent: z.enum(['rag', 'linkedin', 'general']),
  query: z.string(),
});

const response = await openai.responses.parse({
  model: 'gpt-4o-mini',
  text: { format: zodTextFormat(schema, 'routing') },
  input: [
    { role: 'system', content: 'Route this query to the right agent.' },
    { role: 'user', content: userQuery },
  ],
});

const result = response.output_parsed;
```

---

## Gemini

```typescript
import { GoogleGenAI } from '@google/genai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const schema = z.object({
  price: z.number().optional(),
  category: z.string().optional(),
  isDestructive: z.boolean(),
});

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseJsonSchema: zodToJsonSchema(schema),
  },
});

const result = JSON.parse(response.text);
```

---

## Common Schemas

### Agent Routing

```typescript
const routingSchema = z.object({
  selectedAgent: z.enum(['rag', 'linkedin', 'general']),
  refinedQuery: z.string().describe('Query optimized for the selected agent'),
  confidence: z.number().min(0).max(1),
});
```

### Query Analysis

```typescript
const analysisSchema = z.object({
  needsResearch: z.boolean().describe('Whether this needs document lookup'),
  queryType: z.enum(['simple', 'technical', 'complex']),
  topics: z.array(z.string()).describe('Main topics in the query'),
});
```

### Content Extraction

```typescript
const extractionSchema = z.object({
  title: z.string(),
  summary: z.string().max(200),
  keyPoints: z.array(z.string()).max(5),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
});
```

### Database Query Parameters

```typescript
const queryParamsSchema = z.object({
  filters: z.object({
    category: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
  }),
  sortBy: z.enum(['relevance', 'price', 'date']).optional(),
  limit: z.number().max(100).default(10),
  isDestructive: z.boolean().describe('True if DELETE or UPDATE'),
});
```
