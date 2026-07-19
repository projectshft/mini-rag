# Day 26 — Observability with LangSmith


> **Today:** right now, when your agent gives a weird answer, you're guessing. In about ten lines of setup, LangSmith will show you every prompt, every token count, every latency spike — so you stop flying blind before Assignment 2.

## Video walkthrough

<iframe src="https://share.descript.com/embed/UplDjm9F27o" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## Why AI observability is different

Observability isn't something new or specific to AI — it's standard software practice. You have observability layers to know when backend services go down, when error rates spike, when a service stops responding. If you get a bunch of 500s from a server, you know something's wrong.

With LLMs and agents, it's different. The responses — good or bad — are **subjective**. Your token costs aren't fixed. You need to answer questions like: are token costs increasing because of that prompt we just updated? Do the responses look good? What did the agent chain actually do behind the scenes — how did the selector route, what did RAG retrieval feed the model?

Otherwise you're basically telling customers "when you find a mistake, let us know." That's not a good way to do things. You want to get ahead of these issues.

Luckily, LangSmith makes this super simple.

## Setting up LangSmith

### Step 1: Create your project

1. Go to [smith.langchain.com](https://smith.langchain.com/)
2. Sign up and create your first app
3. Create a project (click "Projects" in the sidebar)
4. Click "Trace an existing app" and select OpenAI

### Step 2: Add environment variables

You'll get output with your credentials. Add these to `.env.local`:

```bash
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_pt_xxxxxxxxxxxxxxxxxxxxxxxx
LANGSMITH_PROJECT="your-project-name"
```

**Important:** without `LANGSMITH_PROJECT` set, nothing will work. I had to learn this the hard way — if the project isn't set, you won't see any traces at all.

**Where to find these:**

- **API Key:** Settings -> API Keys -> Create API Key
- **Project name:** the project you created in step 3 (left sidebar under Projects)

### Step 3: Wrap the OpenAI client

Update [`app/libs/openai/openai.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/openai/openai.ts):

```typescript
import OpenAI from 'openai';
import { wrapOpenAI } from 'langsmith/wrappers';

const baseClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string,
});

export const openaiClient = wrapOpenAI(baseClient);
```

`wrapOpenAI` wraps around whatever LLM library you're using. And here's where the base-client pattern you've had since Week 1 pays off: every agent, route, and script imports `openaiClient` from this one file, so one changed export instruments the *entire app*. Swap OpenAI for Anthropic or Groq someday, and the same choke point works in your favor again.

That's it. Save, and your traces start appearing.

## What you can see

Make a few requests, open your LangSmith project, and you'll find:

- **Runs** — every API call with full input/output
- **System prompts** — the exact instructions that were sent
- **User messages** — what the user said
- **Tokens** — input, output, and total per call
- **Latency** — how long each request took
- **Error rates** — when things go wrong

Click any run to dig in. You see exactly what went to the model and what came back.

```quiz
[
  {
    "q": "Why isn't classic observability (status codes, uptime, error rates) enough for an LLM app?",
    "options": ["LLM APIs don't return status codes", "A bad LLM response is usually a 200 — quality is subjective and costs vary per request, so you need to inspect prompts, outputs, and tokens", "LLM apps never have server errors"],
    "answer": 1,
    "explain": "A hallucinated answer, a misrouted agent, or a 3x token spike all look like 'success' to an HTTP monitor. LLM observability watches content and cost, not just liveness."
  },
  {
    "q": "Why does wrapping ONE file (app/libs/openai/openai.ts) instrument the whole app?",
    "options": ["wrapOpenAI patches the OpenAI package globally at runtime", "LangSmith intercepts all outbound network traffic", "Every agent and route imports the shared openaiClient from that file, so the wrapped export is the single choke point"],
    "answer": 2,
    "explain": "This is the payoff of the base-client pattern: one import site to instrument, and one place to swap providers later."
  },
  {
    "q": "You set LANGSMITH_TRACING, ENDPOINT, and API_KEY but see zero traces. Most likely cause?",
    "options": ["LANGSMITH_PROJECT is missing from .env.local", "You need a paid LangSmith plan for tracing", "Traces only appear after 24 hours"],
    "answer": 0,
    "explain": "Without the project variable, nothing shows up at all — the lesson's hard-won gotcha. Check it first before debugging anything else."
  }
]
```

## Why this matters

With this dashboard you can:

- **Check error rates** — are errors spiking today?
- **Monitor latency** — are requests getting slower?
- **Track token usage** — have tokens jumped? Why? What changed?
- **Debug agent routing** — "wait, this went to the wrong agent" — now you can look inside the trace and see what happened
- **Iterate confidently** — change a prompt, watch the effect on quality, cost, and latency

You now have insight into how your app performs through every change you make as you iterate. This lands at the perfect time: tomorrow you finalize Assignment 2, and traces are exactly how you'll verify what your RAG agent retrieved and prompted.

## Your task

1. Create a LangSmith account and project
2. Add the 4 environment variables to `.env.local`
3. Update [`app/libs/openai/openai.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/openai/openai.ts) with the wrapper
4. Run your app and ask a few questions (hit both the RAG and LinkedIn agents)
5. Check the LangSmith dashboard — you should see your traces

<details>
<summary>Expected result — what a healthy trace looks like</summary>

In your project's **Runs** list you should see one entry per OpenAI call — that means a single chat message produces *multiple* runs: one for the selector, one for the query embedding, one for the final completion. Click the completion run and you should recognize your own system prompt, with the retrieved Pinecone context pasted inside it, plus token counts and latency on the right. If the list stays empty: check `LANGSMITH_PROJECT` first, then restart your dev server (Next.js only reads `.env.local` at startup).

</details>

## Challenge: add custom metadata

For more advanced usage, add metadata to traces so you can filter them — essential once you have multiple agents and want cost or latency *per agent*:

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

Try tagging your selector, RAG, and LinkedIn calls with an `agent` field, then filter the dashboard by it. Play around — LangSmith is quickly becoming the de facto standard monitoring tool for AI projects.

## Key takeaways

- Classic observability catches 500s; LLM observability catches **bad 200s** — subjective quality, drifting token costs, misrouted agents
- One wrapped export (`wrapOpenAI` in `app/libs/openai/openai.ts`) instruments every LLM call in the app — the base-client pattern earning its keep
- `LANGSMITH_PROJECT` is mandatory: without it you get silence, not an error
- Traces show the full chain — selector decision, retrieval context, final prompt — which is how you debug "why did it answer that?"
- Custom metadata (`langsmithExtra`) turns a pile of traces into per-agent cost and latency dashboards

## Work with AI

```ai-prompt
title: Read my traces with me
---
I just integrated LangSmith into my RAG app (wrapOpenAI around the shared client in app/libs/openai/openai.ts). My app makes several OpenAI calls per chat message: a selector call that routes to 'rag' or 'linkedin' and refines the query, an embedding call, and a gpt-4o completion with retrieved Pinecone context in the system prompt.

I'll paste the details of 2-3 traces from my dashboard (inputs, outputs, token counts, latency). Help me audit them: Does the routing decision look right for the user's message? Is the retrieved context in the final prompt actually relevant? Where are the tokens going — and is anything in the system prompt wastefully repeated per request (hint: the context appears in both system and prompt in my ragAgent)? Give me one concrete optimization ranked by effort vs. payoff.
```

```ai-prompt
title: Design my observability checklist for production
---
My RAG app now has LangSmith tracing, and I've added langsmithExtra metadata tagging each call with its agent (selector / rag / linkedin). Interview me, one question at a time, to build a one-page "weekly ops review" checklist: which 5 metrics should I look at every week (think: cost per agent, p95 latency, token drift after prompt changes, routing accuracy, error rate), what threshold on each should trigger investigation, and what the FIRST debugging step is when each one fires. Push back if my thresholds are arbitrary — make me justify them. Output the final checklist as a table I can save.
```
