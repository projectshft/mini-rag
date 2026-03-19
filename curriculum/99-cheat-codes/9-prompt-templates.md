# Prompt Templates

Copy-paste prompts for common AI patterns.

---

## RAG System Prompt

```typescript
const ragSystemPrompt = `You are a helpful assistant that answers questions based on the provided context.

Context:
${context}

Instructions:
- Answer based on the context above
- If the context doesn't contain enough information, say so
- Be concise and accurate
- Include code examples when relevant`;
```

---

## RAG with Sources

```typescript
const ragWithSourcesPrompt = `You are a helpful assistant. Answer questions using ONLY the provided context.

Context:
${context}

Instructions:
- Answer based strictly on the context above
- Cite your sources using [Source: filename] format
- If the context doesn't contain the answer, say "I don't have enough information to answer this"
- Never make up information not in the context`;
```

---

## Agent Router Prompt

```typescript
const routerPrompt = `Analyze this query and route to the best agent.

Query: "${query}"

Agents:
${agents.map(a => `- ${a.name}: ${a.description}`).join('\n')}

Return the agent name and a refined query optimized for that agent.`;
```

---

## Query Analysis Prompt

```typescript
const queryAnalysisPrompt = `Analyze this user query and determine how to handle it.

Query: "${query}"

Determine:
1. Does this require searching documentation? (technical questions, how-to, API usage)
2. Is this a simple greeting or casual conversation?
3. What are the main topics or keywords?
4. Should the query be rephrased for better search results?`;
```

---

## Content Generation Prompt

```typescript
const contentPrompt = `Generate a LinkedIn post about: ${topic}

Writing samples for style reference:
${writingSamples}

Guidelines:
- Match the tone and style of the samples
- Be authentic and engaging
- Keep it under 1500 characters
- No hashtags or emojis unless in samples`;
```

---

## Code Explanation Prompt

```typescript
const codeExplanationPrompt = `Explain this code clearly and concisely.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. A brief summary of what it does
2. Step-by-step breakdown of key parts
3. Any potential issues or improvements`;
```

---

## SQL Generation Prompt

```typescript
const sqlGenerationPrompt = `Generate a SQL query based on this request.

Database Schema:
${schema}

User Request: "${request}"

Rules:
- Use only tables and columns from the schema
- Prefer JOINs over subqueries when possible
- Add appropriate WHERE clauses for safety
- Never generate DELETE or UPDATE without explicit request`;
```

---

## Destructive Action Detection

```typescript
const destructiveDetectionPrompt = `Analyze this query for destructive intent.

Query: "${query}"

Database Operations:
- SELECT: Reading data (safe)
- INSERT/CREATE: Adding data (safe)
- UPDATE: Modifying existing data (DESTRUCTIVE)
- DELETE: Removing data (DESTRUCTIVE)

Determine if this query would result in data modification or deletion.`;
```

---

## Summarization Prompt

```typescript
const summarizationPrompt = `Summarize the following content.

Content:
${content}

Requirements:
- Maximum ${maxLength} words
- Preserve key facts and figures
- Use bullet points for multiple items
- Maintain the original tone`;
```

---

## Classification Prompt

```typescript
const classificationPrompt = `Classify this text into one of the following categories.

Text: "${text}"

Categories:
${categories.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Return the category name and confidence (0-1).`;
```

---

## Extraction Prompt

```typescript
const extractionPrompt = `Extract structured information from this text.

Text:
${text}

Extract the following fields:
- name: Person or company name
- email: Email address if present
- phone: Phone number if present
- topics: Main topics discussed (array)
- sentiment: Overall sentiment (positive/negative/neutral)

Return null for any fields not found in the text.`;
```

---

## Rewrite/Improve Prompt

```typescript
const rewritePrompt = `Improve this text while preserving its meaning.

Original:
${original}

Improvements to make:
- Fix grammar and spelling
- Improve clarity and flow
- Make it more ${tone} (professional/casual/technical)
- Keep the same length (approximately)`;
```

---

## Few-Shot Example Prompt

```typescript
const fewShotPrompt = `Complete the task following these examples.

Examples:
${examples.map(e => `Input: ${e.input}\nOutput: ${e.output}`).join('\n\n')}

Now complete this:
Input: ${userInput}
Output:`;
```

---

## Chain of Thought Prompt

```typescript
const chainOfThoughtPrompt = `Solve this problem step by step.

Problem: ${problem}

Think through this carefully:
1. First, identify what we know
2. Then, determine what we need to find
3. Work through the logic step by step
4. Verify your answer makes sense

Show your reasoning, then provide the final answer.`;
```
