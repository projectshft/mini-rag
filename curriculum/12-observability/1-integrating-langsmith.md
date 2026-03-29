# Integrating LangSmith for AI Observability

Production AI applications need visibility into API calls, costs, latency, and errors. This is where **LangSmith** comes in - an observability platform specifically built for LLM applications.

---

## What You'll Learn

-   Why observability matters for AI applications
-   How to set up LangSmith in 3 steps
-   Viewing traces in the dashboard

---

## Why Observability Matters

Without observability, you're flying blind:

-   **Cost surprises**: Suddenly $500 bill, no idea why
-   **Performance issues**: Slow responses, can't debug
-   **Quality problems**: Bad outputs, no data to improve
-   **Usage patterns**: Don't know what users are asking

With observability you get:

-   Full request/response logs
-   Cost tracking per request
-   Latency monitoring
-   Error tracking and debugging

---

## Setting Up LangSmith

### Step 1: Create Account & Get API Key

1. Go to [smith.langchain.com](https://smith.langchain.com/)
2. Sign up for free account
3. Navigate to Settings → API Keys
4. Create and copy your API key

### Step 2: Add Environment Variables

Add to your `.env.local`:

```bash
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_pt_xxxxxxxxxxxxxxxxxxxxxxxx
LANGSMITH_PROJECT="your-project-name"
```

### Step 3: Update OpenAI Client

Update `app/libs/openai/openai.ts`:

**Before:**

```typescript
import OpenAI from 'openai';

export const openaiClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
});
```

**After:**

```typescript
import OpenAI from 'openai';
import { wrapOpenAI } from 'langsmith/wrappers';

const baseClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
});

export const openaiClient = wrapOpenAI(baseClient);
```

**That's it!** All OpenAI API calls are now automatically traced.

---

## How It Works

```
Your App → wrapOpenAI wrapper → OpenAI API
                ↓
           Logs trace data (async)
                ↓
         LangSmith Dashboard
```

The wrapper intercepts your API calls, forwards them to OpenAI, and sends trace data asynchronously. Performance impact is minimal.

---

## Viewing Your Data

Visit your LangSmith dashboard to see:

-   **Traces**: Every API call with full request/response
-   **Latency**: How long each call took
-   **Tokens**: Input/output token counts
-   **Cost**: Estimated cost per request

Click any trace to see the full conversation, including system prompts and responses.

---

## Your Task

1. Sign up for LangSmith at [smith.langchain.com](https://smith.langchain.com/)
2. Add environment variables to `.env.local`
3. Update `app/libs/openai/openai.ts` with the wrapper
4. Run your app and ask a few questions
5. Check the LangSmith dashboard to see your traces

---

## Common Issues

**"Traces not appearing"**
→ Check `LANGSMITH_TRACING=true` in your `.env`

**"Unauthorized" error**
→ Verify your `LANGSMITH_API_KEY` is correct

**"Module not found: langsmith"**
→ Run `yarn add langsmith`

---

## Challenge: Add Custom Metadata

Once basic tracing works, try adding metadata to your traces. This helps you filter and analyze data in the dashboard.

### Why Metadata Matters

Imagine your app has multiple agents (LinkedIn, RAG, General). Without metadata, all traces look the same in the dashboard. With metadata, you can:

-   Filter traces by agent type
-   Track costs per agent
-   See which agents are slowest
-   Debug specific user sessions

### How to Add Metadata

Pass a second argument with `langsmithExtra`:

```typescript
const response = await openaiClient.chat.completions.create(
	{
		model: 'gpt-4o-mini',
		messages: [{ role: 'user', content: query }],
	},
	{
		langsmithExtra: {
			metadata: {
				agent: 'linkedin',
				userId: 'user-123',
			},
		},
	}
);
```

### Challenge Tasks

1. Add an `agent` metadata field to each of your agents (linkedin, rag, general)
2. Make a few requests to each agent
3. In the LangSmith dashboard, filter by agent to see the breakdown
4. Compare latency and cost between agents

---

## What's Next?

You now have observability into your RAG system. In the next section, we'll test our selector agent to ensure it routes queries correctly.
