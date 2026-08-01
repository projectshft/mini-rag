# Day 13 — Fine-Tuning as History + Assignment


> **Today:** two things. First, a short code-archaeology session: you'll read the fine-tuning scripts as historical artifacts, then learn the technique you'll actually use — **few-shot prompting**, which turns out to be one small step from what you've already built. Then, **your Week 2 assignment is due**: your document upload pipeline, hardened with sanitization, plus your first Feynman video.

> **Important: Historical Context**
>
> As of May 7, 2026, OpenAI has limited access to fine-tuning. The scripts in this lesson are **artifacts** showing how fine-tuning used to be performed. You will **not** run these scripts yourself.
>
> **Instead, you will:**
> - Study the code to understand the workflow
> - Examine the training data format (JSONL)
> - Build the LinkedIn agent with **few-shot prompting** instead, in Week 3 — fine-tuned models, including the one previously provided for this course, can no longer be used
>
> **Why learn this anyway?**
> - Fine-tuning is not limited to OpenAI — Anthropic, Cohere, and open-source models (via Hugging Face, Axolotl, etc.) still support it
> - Understanding the process helps you evaluate when fine-tuning vs RAG vs prompting is appropriate
> - Many production systems still use fine-tuned models

## Video walkthrough

Watch this to understand the fine-tuning process. **Heads up:** it was recorded
while OpenAI fine-tuning still worked. Watch it for the mental model — don't try
to follow along, the API is closed now. The section below shows what you'll do
instead.

<iframe src="https://share.descript.com/embed/nub6vmvmL3a" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## The training script (artifact)

Located at [`app/scripts/upload-training-data.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/scripts/upload-training-data.ts), this script handled the entire fine-tuning workflow:

```
Training Data (JSONL)
    |
1. Upload to OpenAI
    |
2. Create fine-tuning job
    |
3. OpenAI trains model
    |
4. Get model ID
    |
5. Use in your app
```

**Step 1: upload the file**

```typescript
const file = await openai.files.create({
  file: fs.createReadStream(filePath),
  purpose: 'fine-tune',
});
```

**Step 2: start the training job**

```typescript
const job = await openai.fineTuning.jobs.create({
  training_file: fileId,
  model: 'gpt-4o-mini-2024-07-18',
});
```

That's it — OpenAI handled everything from there. It was run with `yarn train` (no longer functional), and the output looked like:

```bash
Uploading training file...
File uploaded successfully: file-abc123xyz

Creating fine-tuning job...
Fine-tuning job created successfully: ftjob-abc123

You can monitor the job status using the OpenAI dashboard or the job ID:
https://platform.openai.com/finetune/ftjob-abc123?filter=all

IMPORTANT: Once the fine-tuning job completes, you will receive
   a new fine-tuned model ID. Update the model ID in .env.local
   to use your new fine-tuned model.
```

**Key information:** the **file ID** confirmed the upload, the **job ID** tracked progress, and once training finished you got a **model ID** to drop into `.env.local` — a brand-new model, yours specifically.

## Examining the training data

The training data lives at `app/scripts/data/linkedin_training.jsonl`. Each line is one complete training example:

```jsonl
{"messages": [{"role": "system", "content": "You are a professional LinkedIn advisor helping with networking and career advice"}, {"role": "user", "content": "How do I write an effective LinkedIn headline?"}, {"role": "assistant", "content": "Your LinkedIn headline is prime real estate - you have 220 characters to make a strong first impression. Here's how to make it count:\n\n1. **Go beyond your job title**: Instead of just 'Software Engineer', try 'Software Engineer | Building scalable systems | React & Node.js expert'\n\n2. **Include keywords**: Think about what people search for when looking for someone like you\n\n3. **Show value**: What problems do you solve? What makes you different?\n\n4. **Use numbers when possible**: 'Helped 50+ startups scale' is more concrete than 'Experienced with startups'\n\nYour headline appears everywhere on LinkedIn - in search results, in comments, in connection requests. Make it work hard for you!"}]}
```

### Breaking it down

**System message (consistent):** sets the context — the *same text* in EVERY example.

**User message (varies):** the question/prompt — should cover a wide variety of topics.

**Assistant message (your voice):** this is what the model learns. It should be in YOUR style, tone, and approach.

### Monitoring a job

Jobs were tracked in the dashboard (https://platform.openai.com/finetune) or via API:

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

Statuses: `running` (be patient), `succeeded` (you have a model), `failed` (check the error — usually malformed JSONL, invalid system messages, or rate limits), `cancelled`.

Common data errors: JSONL lines that aren't valid JSON, blank lines, trailing commas, or too few examples (minimum 10, recommended 100+).

### Before vs after (what fine-tuning changed internally)

```
Before: Your Question -> Base Model -> Generic Response
After:  Your Question -> Fine-Tuned Model -> Response in YOUR Voice
```

Internally: base model weights + your training examples = adjusted weights. OpenAI moved millions of parameters to better match your data.

---

## What you'll actually use: few-shot prompting

Fine-tuned models can no longer be used — including the one this course used to
ship with. **You will not run a training job in this course, and you don't need
to.** Everything fine-tuning bought us, we get from few-shot prompting: put a
handful of real examples in the prompt and let a standard model imitate them.

### You already have every piece of this

This isn't a new technique. You've built all of it except the last step.

A few days ago you retrieved chunks from Pinecone and assembled them into a
block of text for a model to read. You stopped there — the query route returns
JSON, it never actually calls a chat model. Sending that text is the one step
you haven't taken yet, and it's the step the RAG agent takes in a couple of
weeks.

Few-shot prompting is that same send. The only thing that changes is **what**
you put in:

| | What goes in the prompt | What the model does with it |
|---|---|---|
| **Retrieval** | chunks you looked up | answers using those **facts** |
| **Few-shot** | example outputs you like | writes in that **style** |

Same mechanic, same request, no training step. That's the whole idea behind
"context is all you really need."

### First, how a chat request is actually shaped

You haven't had to look at this yet, and the code below won't make sense
without it.

A chat request isn't one string — it's a **list of messages**, each tagged with
who's speaking. `system` is standing instructions. `user` is a request.
`assistant` is a reply. Normally you send one `user` message and the model
writes the `assistant` one.

Few-shot means you write a few `user`/`assistant` pairs **yourself** first —
already-completed examples — so the model has something to imitate before it
reaches the real question. Each pair is one "shot." Three to five is "few."

### What it looks like in code

Fine-tuning meant a JSONL file, a training job, and a model ID in your `.env`:

```typescript
// The old way — a custom model that only exists after a training run
const response = await openai.chat.completions.create({
	model: 'ft:gpt-4o-mini-2024-07-18:parsity::abc123', // <- had to be trained first
	messages: [{ role: 'user', content: userQuestion }],
});
```

Few-shot is a normal model plus examples in the messages:

```typescript
// The new way — a stock model, and the examples ARE the training
const response = await openai.chat.completions.create({
	model: 'gpt-4o',
	messages: [
		{ role: 'system', content: 'You write LinkedIn posts in the style of the examples below.' },

		// Each pair is one "shot" — the exact same shape as one JSONL training line
		{ role: 'user', content: 'Write a post about imposter syndrome.' },
		{ role: 'assistant', content: examplePosts[0] },
		{ role: 'user', content: 'Write a post about switching careers at 35.' },
		{ role: 'assistant', content: examplePosts[1] },

		// ...then the real request
		{ role: 'user', content: userQuestion },
	],
});
```

Look at the two code blocks side by side. The JSONL training file you just read
had `{"messages": [system, user, assistant]}` on every line. Few-shot prompting
uses *the same message pairs* — it just sends them at request time instead of
shipping them off to a training job first.

**The tradeoffs, honestly:**

- **Cost:** few-shot is often *more* expensive per request — your examples ride
  along on every single call. It's cheaper overall because you skip training and
  never maintain a custom model.
- **Examples:** fine-tuning wanted 100+. Few-shot works with 3–5 good ones.
  Pick your best, not your most.
- **Iteration:** editing a string beats a 20-minute training run. This is the
  big one.
- **Context budget:** the examples eat tokens that could hold retrieved chunks.
  On a RAG agent you're splitting the same context window between facts and
  style.

The repo includes `data/brian_posts.csv` — 850+ real LinkedIn posts with
engagement stats. When you build the LinkedIn agent in Week 3, you'll pick a few
examples from it (or from any creator whose style you like) and wire them into
the prompt exactly like the snippet above.

```quiz
[
  {
    "q": "In the JSONL training format, which message is the model actually learning to imitate?",
    "options": ["The system message — it appears in every example", "The user message — variety teaches the model new topics", "The assistant message — that's the target output in your voice"],
    "answer": 2,
    "explain": "The system message stays constant (context), user messages vary (coverage), and the assistant messages are the behavior being trained — style, tone, structure."
  },
  {
    "q": "In few-shot prompting, what plays the role the JSONL training file used to play?",
    "options": ["Example posts embedded directly in the prompt at request time", "A vector database of past responses", "A larger system prompt with style adjectives like 'be punchy'"],
    "answer": 0,
    "explain": "Concrete examples in the prompt do the work training data used to do — the model imitates them on the fly, with no training step and instant iteration."
  },
  {
    "q": "What's the biggest operational advantage of few-shot prompting over a fine-tuned model?",
    "options": ["It's always cheaper per token", "Instant iteration — change an example and the very next request reflects it; no retraining, no custom model to maintain", "It produces deterministic outputs"],
    "answer": 1,
    "explain": "With fine-tuning, every style tweak meant new data, a training job, and a new model ID. With few-shot, editing the prompt IS the update. (Per-token, few-shot can actually cost MORE — the examples ride along on every request.)"
  }
]
```

## Fine-tuning elsewhere (still alive)

While OpenAI has deprecated fine-tuning, you can still fine-tune models on other platforms:

- **Hugging Face**: fine-tune open-source models (Llama, Mistral, etc.) — https://huggingface.co/docs/transformers/training
- **Anthropic**: Claude fine-tuning for enterprise customers
- **Cohere**: Command models with fine-tuning support
- **Together AI**: fine-tune open-source models via API
- **Axolotl** (popular open-source fine-tuning tool): https://github.com/OpenAccess-AI-Collective/axolotl
- OpenAI's fine-tuning docs (historical): https://platform.openai.com/docs/guides/fine-tuning

### Quick reference

```
Training script (artifact): app/scripts/upload-training-data.ts
Training data (reference): app/scripts/data/linkedin_training.jsonl
Example posts for few-shot prompting: data/brian_posts.csv
```

---

## Assignment

**Assignment: Document Upload — due today.** This is everything Week 2 built, wrapped up and submitted.

### Video (3–4 minutes)

Explain **chunking strategy tradeoffs**, Feynman-style — as if to a smart colleague who's never built a RAG system. How would you chunk these three document types?

1. **Medical records** — HIPAA considerations, structured fields mixed with clinical notes, sensitive data
2. **Confluence documentation** — headers, code blocks, tables, cross-references
3. **Twitter/X posts** — short content, hashtags, threads, mentions

For each type, cover:

- What chunk size would you use, and why?
- Where would you split (sentences, paragraphs, sections)?
- What metadata would you preserve?
- What special handling is needed?

No jargon without explanation. If you can't explain your chunk-size choice simply, that's a gap — go back to the chunking lesson before recording.

### Code

**Complete the TODOs** in the ingestion route to make the system work, then **extend it** with text sanitization.

**Files:**

- [`app/api/upload-document/route.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/api/upload-document/route.ts) — the 9-step upload route you built
- [`app/libs/chunking.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/chunking.ts) — including your `getLastWords()`

**Extension — add sanitization** (run it on content *before* chunking):

- Strip HTML tags from content
- Normalize whitespace (collapse multiple spaces/newlines)
- Handle special characters (smart quotes, em dashes, etc.)
- Remove boilerplate text (navigation, footers, "Click here to...", etc.)

**What "done" looks like:**

- Documents upload and chunk correctly (`yarn test:chunking` green, uploads visible in Pinecone, retrievable via `/api/rag-test`)
- Sanitization cleans messy web content before chunking
- You can demonstrate the before/after of sanitization

### Submit your work

- [Submit your assignment](https://form.typeform.com/to/ASSIGNMENT-FORM)

Post your video and code in **Slack** for feedback — seeing how others chunked the same three document types is half the value.

## Key takeaways

- **You will not fine-tune anything in this course** — OpenAI limited it in May 2026 and the course's old fine-tuned model is dead. The scripts are artifacts; read them, don't run them
- The fine-tuning workflow was: JSONL training file -> upload -> training job -> new model ID in `.env.local` — study `app/scripts/upload-training-data.ts` as the artifact
- In training data, the assistant messages are the product: consistent system message, varied user questions, your voice in every answer
- **Few-shot prompting is what you'll use instead**, and it's the move you're already set up for: putting text in the prompt, except the text is example *outputs* instead of retrieved *facts*
- Same message shape as one JSONL line (system / user / assistant), sent at request time — 3–5 good examples, zero training cost, edit-and-it's-live iteration
- Fine-tuning still exists at Anthropic, Cohere, Hugging Face, and Together AI — the concepts transfer
- This assignment is the whole Week 2 pipeline: chunking + upload route + sanitization, explained simply on video

## Work with AI

```ai-prompt
title: Rehearse my assignment video
---
I'm about to record my assignment video (3–4 minutes): chunking strategy tradeoffs for (1) medical records, (2) Confluence documentation, and (3) Twitter/X posts — chunk size, split points, metadata to preserve, and special handling for each.

Let me deliver my explanation to you in text, one document type at a time. After each one, respond as a sharp non-technical stakeholder: ask the obvious-but-hard questions ("why 500 characters and not 5,000?", "what happens to a patient's name in a chunk?", "a tweet is already tiny — why chunk at all?"). Point out jargon I didn't explain and claims I didn't justify. Then rate each explanation 1–10 and tell me the single weakest part to fix before I hit record.
```

```ai-prompt
title: Design my sanitization function — test cases first
---
For this assignment, I'm adding a sanitization step to my ingestion pipeline (app/api/upload-document/route.ts) that cleans scraped web content BEFORE it hits chunkText() in app/libs/chunking.ts. Requirements: strip HTML tags, normalize whitespace, handle special characters (smart quotes, em dashes), and remove boilerplate ("Click here", nav links, footers).

Before I write any code: generate 10 nasty realistic input strings a scraper might produce (nested tags, &nbsp; entities, cookie banners, mixed newlines, unicode quotes) and the exact cleaned output my function should return for each. Then let me write the function myself and paste it back to you — check it against your cases and tell me which ones fail and why, without rewriting it for me.
```
