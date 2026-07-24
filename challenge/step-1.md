# Your First AI Call

**Time:** ~20 min · Hands-on

> **The goal:** the most fundamental thing in all of AI engineering — text goes to Gemini, text comes back. Get the starter running and make your first call.

<iframe src="https://share.descript.com/embed/O63bxwYi9mM" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## Before you start

Grab the starter project and a free Gemini API key — takes about five minutes.

```bash
git clone https://github.com/projectshft/ai-advisor.git
cd ai-advisor
git checkout student-starter
npm install
```

Then get your key:

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click **"Get API key in Google AI Studio"**, sign in, **"Create API key"**
3. Copy it into your env file:

```bash
cp .env.example .env.local
# then add: GEMINI_API_KEY=your_api_key_here
```

Start the dev server with `npm run dev` and open [localhost:3000](http://localhost:3000). You'll see a glorious green-screen AS/400 terminal — that retro look is intentional, so you focus on the AI, not the CSS.

## What you're building this week

An **AI advisory board** — a chat interface where you can ask "What does Theo think about testing?" or "What's Primeagen's take on Vim?" and get answers grounded in what these creators *actually said*.

But it all starts here, with the simplest possible thing: you type something, it goes to Gemini, Gemini sends something back.

## How LLM APIs really work

At its core, an LLM API is just like any other API:

1. You send text (a "prompt")
2. The model processes it
3. You get text back (the "completion")

That's it. **Text in, text out.** Everything else — chatbots, assistants, code generators — is built on this. Don't let it feel magical. It's just another API that returns text instead of JSON.

## Make the call

Open `app/api/chat/route.ts` and fill in the TODOs. Try it yourself before peeking.

<details>
<summary>Solution — don't open until you've tried</summary>

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json();

		const userResponse = await model.generateContent(message);
		const response = userResponse.response.text();

		return NextResponse.json({ response });
	} catch (error) {
		console.error('Chat API error:', error);
		return NextResponse.json(
			{ error: 'Failed to generate response' },
			{ status: 500 }
		);
	}
}
```

</details>

Then send a message from the UI. Try "Write a haiku about coding" or "Explain APIs to a 5 year old."

**Heads up:** model names change constantly. If Cursor or Claude suggests one that errors out, check the [Gemini docs](https://ai.google.dev/gemini-api/docs/models) for what actually exists today.

```quiz
[
  {
    "q": "At its core, what is an LLM API?",
    "options": ["Text in, text out — a regular API that returns generated text instead of JSON", "A model that runs inside your browser", "A database of pre-written answers"],
    "answer": 0,
    "explain": "Everything in AI engineering builds on this one pattern. It's just another API — don't let it feel magical."
  },
  {
    "q": "You added GEMINI_API_KEY to .env.local but the route says the key is missing. Most likely fix?",
    "options": ["Restart the dev server — Next.js reads env vars at startup", "Rename the file to .env.production", "The free tier needs a credit card first"],
    "answer": 0,
    "explain": "The #1 gotcha here: env vars load when the server starts, so any change needs a restart."
  }
]
```

## Look under the hood

Log the raw response to see there's no magic:

```typescript
const userResponse = await model.generateContent(message);
console.log(JSON.stringify(userResponse.response, null, 2));
```

Your terminal shows tokens used, the formatted text, metadata. Just an API response.

## The takeaway

- LLM APIs are simple: **text in, text out**
- The SDK handles auth and HTTP for you
- Always handle errors — APIs fail
- Model names change — trust the docs, not your AI assistant's memory

And remember: the frameworks and languages don't matter. You could build this in Rust, Python, whatever. The syntax changes; the concepts don't.

## Push it further

- **Swap providers:** rewrite the route to use OpenAI or Anthropic. You'll see they all work basically the same way.
- **Add streaming:** make the response arrive token by token with `generateContentStream()`.
- **Log everything:** tokens, response time, model version — what you'd want in production.

Next up: right now the AI answers *anything* — the weather, your homework. Let's give it a job.

## Work with AI

```ai-prompt
title: Explain my own first API call back to me
---
I just built my first LLM integration: a Next.js API route that takes a message, sends it to Gemini via the @google/generative-ai SDK (generateContent on gemini-2.0-flash), and returns the response text.

Quiz me on my own code, ONE question at a time: what happens if the API key is missing? When and where does the env var get read? What's inside the response object besides the text? What happens if Gemini times out? If I'm wrong, give a hint and let me retry once. End by telling me the one thing beginners most misunderstand about LLM APIs.
```
