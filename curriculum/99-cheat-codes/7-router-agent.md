# Router Agent

Route queries to specialized agents.

---

## Basic Router

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const routingSchema = z.object({
  agent: z.enum(['rag', 'linkedin', 'general']),
  refinedQuery: z.string(),
  reasoning: z.string(),
});

async function routeQuery(query: string) {
  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: routingSchema,
    prompt: `Route this query to the best agent:

Query: "${query}"

Agents:
- rag: Technical questions about documentation
- linkedin: Content creation for LinkedIn
- general: General questions and chat

Select the best agent and optionally refine the query.`,
  });

  return result.object;
}
```

---

## Execute Routed Query

```typescript
const routing = await routeQuery(userQuery);

switch (routing.agent) {
  case 'rag':
    return ragAgent(routing.refinedQuery);
  case 'linkedin':
    return linkedinAgent(routing.refinedQuery);
  default:
    return generalAgent(routing.refinedQuery);
}
```

---

## Router with Confidence

```typescript
const routingSchema = z.object({
  agent: z.enum(['rag', 'linkedin', 'general']),
  confidence: z.number().min(0).max(1),
  refinedQuery: z.string(),
});

const routing = await routeQuery(query);

// Fall back to general if low confidence
if (routing.confidence < 0.7) {
  return generalAgent(query);
}
```

---

## Dynamic Agent Registry

```typescript
type Agent = {
  name: string;
  description: string;
  handler: (query: string) => Promise<string>;
};

const agents: Agent[] = [
  {
    name: 'rag',
    description: 'Search technical documentation and code examples',
    handler: ragAgent,
  },
  {
    name: 'linkedin',
    description: 'Generate LinkedIn posts matching your writing style',
    handler: linkedinAgent,
  },
  {
    name: 'general',
    description: 'Answer general questions and have conversations',
    handler: generalAgent,
  },
];

async function routeWithRegistry(query: string) {
  const agentEnum = z.enum(agents.map(a => a.name) as [string, ...string[]]);

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      agent: agentEnum,
      refinedQuery: z.string(),
    }),
    prompt: `Route this query:

Query: "${query}"

Agents:
${agents.map(a => `- ${a.name}: ${a.description}`).join('\n')}`,
  });

  const agent = agents.find(a => a.name === result.object.agent);
  return agent!.handler(result.object.refinedQuery);
}
```

---

## Multi-Agent Routing

Route to multiple agents when needed:

```typescript
const multiRouteSchema = z.object({
  agents: z.array(z.enum(['rag', 'linkedin', 'general'])),
  queries: z.record(z.string()), // { agentName: refinedQuery }
});

const routing = await generateObject({
  model: openai('gpt-4o-mini'),
  schema: multiRouteSchema,
  prompt: `This query may need multiple agents:

Query: "${query}"

Select all relevant agents and provide refined queries for each.`,
});

// Execute in parallel
const results = await Promise.all(
  routing.object.agents.map(agent =>
    executeAgent(agent, routing.object.queries[agent])
  )
);
```
