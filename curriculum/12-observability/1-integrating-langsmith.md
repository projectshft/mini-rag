# Integrating LangSmith for AI Observability

Production AI applications need visibility into API calls, costs, latency, and errors. This is where **LangSmith** comes in - an observability platform specifically built for LLM applications.

---

## What You'll Learn

-   Why observability matters for AI applications
-   How LangSmith tracks OpenAI API usage
-   Setting up LangSmith with minimal code changes
-   Monitoring costs, performance, and usage patterns

---

## Why Observability Matters

### The Problem with "Black Box" AI

Without observability, you're flying blind:

-   **Cost surprises**: Suddenly $500 bill, no idea why
-   **Performance issues**: Slow responses, can't debug
-   **Quality problems**: Bad outputs, no data to improve
-   **Usage patterns**: Don't know what users are asking

### What Good Observability Provides

-   **Cost tracking**: Per-user, per-agent, per-request costs
-   **Performance monitoring**: Latency, throughput, errors
-   **Quality metrics**: Token usage, model performance
-   **Usage insights**: Popular queries, failure patterns
-   **Debugging**: Full request/response logs

---

## Introducing LangSmith

**LangSmith** is an observability platform by LangChain for LLM applications.

**Key Features:**

-   Request/response logging
-   Cost tracking per request
-   Latency monitoring
-   Custom metadata for filtering
-   Usage analytics and dashboards
-   Trace visualization for debugging
-   Evaluation tools built-in

**Why LangSmith?**

-   Simple integration (wrap your client)
-   Works with any LLM provider
-   Free tier available
-   Built-in evaluation and testing tools
-   Excellent trace visualization

**Learn more:**

-   [LangSmith Documentation](https://docs.langchain.com/langsmith)
-   [LangSmith GitHub](https://github.com/langchain-ai/langsmith-sdk)

---

## Setting Up LangSmith

### Step 1: Create LangSmith Account

1. Go to [smith.langchain.com](https://smith.langchain.com/)
2. Sign up for free account
3. Navigate to Settings → API Keys
4. Create and copy your LangSmith API key

### Step 2: Install the SDK

```bash
yarn add langsmith
```

### Step 3: Add Environment Variables

Add to your `.env` or `.env.local`:

```bash
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_pt_xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Update OpenAI Client

The integration is straightforward. Update `app/libs/openai/openai.ts`:

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

**That's it!** All OpenAI API calls are now automatically traced in LangSmith.

---

## How It Works

### The Wrapper Pattern

```
Your App → wrapOpenAI wrapper → OpenAI API
                ↓
           Logs trace data
                ↓
         LangSmith Dashboard
```

The `wrapOpenAI` wrapper intercepts your API calls:

1. Captures request details (model, messages, parameters)
2. Forwards request to OpenAI
3. Captures response and timing
4. Sends trace data to LangSmith asynchronously

**Performance impact:** Minimal - tracing happens asynchronously

---

## Viewing Your Data

### LangSmith Dashboard

Once integrated, visit your LangSmith dashboard to see:

**1. Traces**

-   Every API call with full request/response
-   Timestamps, latency, tokens used
-   Nested traces for complex pipelines

**2. Cost Analytics**

-   Total spend over time
-   Cost per model/trace
-   Token usage trends

**3. Performance Metrics**

-   Average latency
-   Error rates
-   Request volume

**4. Debugging Tools**

-   Click any trace to see full details
-   Compare inputs/outputs across runs
-   Filter by metadata

---

## Advanced: Tracing Custom Functions

Use `traceable` to trace your entire pipeline:

```typescript
import OpenAI from 'openai';
import { wrapOpenAI } from 'langsmith/wrappers';
import { traceable } from 'langsmith/traceable';

const openaiClient = wrapOpenAI(
	new OpenAI({
		apiKey: process.env.OPENAI_API_KEY as string,
	})
);

// Wrap your RAG function to trace the entire pipeline
const ragQuery = traceable(
	async function ragQuery(question: string) {
		// 1. Retrieve documents
		const docs = await retrieveDocuments(question);

		// 2. Generate response
		const response = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'Answer based on context: ' + docs },
				{ role: 'user', content: question },
			],
		});

		return response.choices[0]?.message?.content;
	},
	{ name: 'rag-query' }
);
```

This creates a hierarchical trace showing:

-   Parent: `rag-query` function
-   Child: OpenAI API call

---

## Adding Metadata

Add custom metadata to traces for filtering:

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
				userId: userId,
				environment: 'production',
			},
		},
	}
);
```

Now you can filter and analyze by agent, user, or environment in the dashboard!

---

## Real-World Example: Cost Tracking

**Scenario:** Your RAG system has two agents:

-   LinkedIn agent (fine-tuned model, expensive)
-   Knowledge Base agent (gpt-4o-mini, cheap)

**Without LangSmith:**

-   Total OpenAI bill: $250/month
-   No idea which agent costs what
-   Can't optimize spend

**With LangSmith:**

```
LinkedIn agent:     $200/month (80% of cost)
  - 10,000 requests
  - Avg: $0.02/request

Knowledge Base:     $50/month (20% of cost)
  - 50,000 requests
  - Avg: $0.001/request
```

**Action:** You discover LinkedIn agent is too expensive. Options:

1. Cache common requests
2. Switch to cheaper base model
3. Add rate limiting
4. Optimize prompts to use fewer tokens

---

## Your Challenge

### Task 1: Integrate LangSmith

1. Sign up for LangSmith account at [smith.langchain.com](https://smith.langchain.com/)
2. Get API key
3. Add environment variables to `.env.local`
4. Update `app/libs/openai/openai.ts` with the wrapper

### Task 2: Generate Some Traffic

Make a few requests to your RAG system:

```bash
yarn dev
# Open http://localhost:3000
# Ask some questions
```

### Task 3: Explore Dashboard

Visit LangSmith dashboard and find:

-   Total requests made
-   Cost per request
-   Average latency
-   Request/response traces

### Task 4: Add Custom Metadata (Optional)

Update your agent implementations to include custom metadata:

-   Agent name
-   User identifier
-   Query type

---

## Common Issues

**"Traces not appearing"**
→ Check `LANGSMITH_TRACING=true` in your `.env`

**"Unauthorized" error**
→ Verify your `LANGSMITH_API_KEY` is correct

**"Module not found: langsmith"**
→ Run `yarn add langsmith`

**Traces appearing but no cost data**
→ Cost calculation may take a few minutes to populate

---

## When to Use LangSmith

**Always use in production**

-   Essential for debugging
-   Critical for cost management
-   Required for optimization

**Use in development/staging**

-   Catch issues before production
-   Understand usage patterns early
-   Test trace visualization

**Maybe skip in local dev**

-   Can add slight overhead
-   Less important for rapid iteration
-   Enable when debugging specific issues

---

## Alternatives to LangSmith

Other observability tools for LLMs:

**Helicone**

-   Proxy-based approach
-   Simple setup
-   Good for OpenAI-only projects

**Weights & Biases**

-   ML experiment tracking
-   Heavier weight
-   Good for research/experimentation

**Custom Logging**

-   Full control
-   More work to build
-   Good for specific needs

**Why we chose LangSmith:**

-   Works with any LLM provider
-   Excellent trace visualization
-   Built-in evaluation tools
-   Active development

---

## What's Next?

You now have full observability into your RAG system!

In the next section, we'll test our selector agent to ensure it routes queries correctly to the right agents.
