# Integrating LangSmith for AI Observability

Observability isn't something new or specific to AI. It's standard software development practice. You have observability layers to understand when backend services go down, when error rates increase, when a service isn't responding correctly. If you get a bunch of 500 responses from a server, you know something's wrong.

With LLMs and agents, this becomes different. The responses - whether they're good or bad - are subjective. Your token costs aren't fixed. You need to understand: are token costs increasing from that prompt we just updated? Do the responses look good? You want to look at the chain of thought and see how your agents and RAG retrieval are working behind the scenes.

Otherwise, you're basically flying blind saying "Hey customer, when you find a mistake, let us know." That's not a good way to do things. You want to get ahead of these issues.

Luckily, LangSmith makes this super simple.

---

## Setting Up LangSmith

### Step 1: Create Your Project

1. Go to [smith.langchain.com](https://smith.langchain.com/)
2. Sign up and create your first app
3. Create a project (click "Projects" in the sidebar)
4. Click "Trace an existing app" and select OpenAI

### Step 2: Add Environment Variables

You'll get some output with your credentials. Add these to your `.env.local`:

```bash
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_pt_xxxxxxxxxxxxxxxxxxxxxxxx
LANGSMITH_PROJECT="your-project-name"
```

**Important:** Without `LANGSMITH_PROJECT` set, nothing will work. I had to learn this the hard way - if you don't have the project set, you won't see any traces at all.

**Where to find these:**
- **API Key**: Settings → API Keys → Create API Key
- **Project Name**: The project you created in step 3 (shown in left sidebar under Projects)

### Step 3: Update OpenAI Client

Update `app/libs/openai/openai.ts`:

```typescript
import OpenAI from 'openai';
import { wrapOpenAI } from 'langsmith/wrappers';

const baseClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
});

export const openaiClient = wrapOpenAI(baseClient);
```

The `wrapOpenAI` function wraps around whatever LLM library you're using. The nice thing about having this base client pattern is you could swap OpenAI for Anthropic, Groq, or whatever you decide to use in the future.

That's it! Save this, and your traces will start appearing.

---

## What You Can See

Once you make some requests, go to your LangSmith project and you'll see:

- **Runs**: Every API call with full input/output
- **System prompts**: What instructions were sent
- **User messages**: What the user said
- **Tokens**: Input tokens, output tokens, total tokens
- **Latency**: How long each request took
- **Error rates**: When things go wrong

Click on any run to dig into the details. You can see exactly what went to the model and what came back.

---

## Why This Matters

With this dashboard you can:

- **Check error rates**: Are errors spiking today?
- **Monitor latency**: Are requests getting slower?
- **Track token usage**: Have tokens gone way up or down? Why? What changed?
- **Debug agent routing**: "Wait, this went to the wrong agent" - now you can look inside and see what happened
- **Iterate confidently**: Make changes to prompts and see how they affect performance

You now have insight into how your app performs during all the changes you'll make as you iterate.

---

## Your Task

1. Create a LangSmith account and project
2. Add the 4 environment variables to `.env.local`
3. Update `app/libs/openai/openai.ts` with the wrapper
4. Run your app and ask a few questions
5. Check the LangSmith dashboard - you should see your traces

---

## Challenge: Add Custom Metadata

For more advanced usage, you can add metadata to traces to make them easier to filter. This helps when you have multiple agents and want to track costs or latency per agent.

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

Play around with this - LangSmith is quickly becoming the defacto standard monitoring tool for AI projects.

---

## What's Next?

You now have observability into your RAG system. In the next section, we'll test our selector agent to ensure it routes queries correctly.
