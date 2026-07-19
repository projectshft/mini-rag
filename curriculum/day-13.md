# Day 13 — Running Fine-Tuning + Assignment 1


> **Today:** two things. First, a code archaeology session — you'll read the fine-tuning scripts as historical artifacts and understand the workflow they automated, plus the few-shot pattern that replaced them. Then, **Assignment 1 is due**: your document upload pipeline, hardened with sanitization, plus your first Feynman video.

> **Important: Historical Context**
>
> As of May 7, 2026, OpenAI has limited access to fine-tuning. The scripts in this lesson are **artifacts** showing how fine-tuning used to be performed. You will **not** run these scripts yourself.
>
> **Instead, you will:**
> - Study the code to understand the workflow
> - Examine the training data format (JSONL)
> - Build the LinkedIn agent with **few-shot prompting** instead (on [Day 20](/learn/day-20)) — fine-tuned models, including the one previously provided for this course, can no longer be used
>
> **Why learn this anyway?**
> - Fine-tuning is not limited to OpenAI — Anthropic, Cohere, and open-source models (via Hugging Face, Axolotl, etc.) still support it
> - Understanding the process helps you evaluate when fine-tuning vs RAG vs prompting is appropriate
> - Many production systems still use fine-tuned models

## Video walkthrough

Watch this guide to understand the fine-tuning process:

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

## What replaced it: few-shot prompting

Since fine-tuned models can no longer be used (including the one previously provided for this course), the LinkedIn agent now uses **few-shot prompting**: real example posts embedded directly in the prompt, and a standard model (`gpt-4o`) imitates their style.

The repo includes `data/brian_posts.csv` — 850+ real LinkedIn posts with engagement stats. On [Day 20](/learn/day-20) you'll pick a few examples from it (or from any creator whose style you like) and wire them into the agent.

This is the modern pattern: **the examples in the prompt do the work that training data used to do** — no training cost, no custom model to maintain, instant iteration.

### Before vs after (what fine-tuning changed internally)

```
Before: Your Question -> Base Model -> Generic Response
After:  Your Question -> Fine-Tuned Model -> Response in YOUR Voice
```

Internally: base model weights + your training examples = adjusted weights. OpenAI moved millions of parameters to better match your data.

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

**Assignment 1: Document Upload — due today.** This is everything Week 2 built, wrapped up and submitted.

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

No jargon without explanation. If you can't explain your chunk-size choice simply, that's a gap — go back to [Day 8](/learn/day-08) before recording.

### Code

**Complete the TODOs** in the ingestion route to make the system work, then **extend it** with text sanitization.

**Files:**

- [`app/api/upload-document/route.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/api/upload-document/route.ts) — the 9-step upload route from [Day 10](/learn/day-10)
- [`app/libs/chunking.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/libs/chunking.ts) — including your `getLastWords()` from [Day 8](/learn/day-08)

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

- [Video Submission](https://form.typeform.com/to/NdVcsThQ)
- [Code Submission](https://form.typeform.com/to/A0pGKPqU)

Post your video and code in **Slack** for feedback — seeing how others chunked the same three document types is half the value.

## Key takeaways

- The fine-tuning workflow was: JSONL training file -> upload -> training job -> new model ID in `.env.local` — study `app/scripts/upload-training-data.ts` as the artifact
- In training data, the assistant messages are the product: consistent system message, varied user questions, your voice in every answer
- Few-shot prompting replaced it here: examples in the prompt (from `data/brian_posts.csv`) do what training data did, with zero training cost and instant iteration
- Fine-tuning still exists at Anthropic, Cohere, Hugging Face, and Together AI — the concepts transfer
- Assignment 1 is the whole Week 2 pipeline: chunking + upload route + sanitization, explained simply on video

## Work with AI

```ai-prompt
title: Rehearse my Assignment 1 video
---
I'm about to record my Assignment 1 video (3–4 minutes): chunking strategy tradeoffs for (1) medical records, (2) Confluence documentation, and (3) Twitter/X posts — chunk size, split points, metadata to preserve, and special handling for each.

Let me deliver my explanation to you in text, one document type at a time. After each one, respond as a sharp non-technical stakeholder: ask the obvious-but-hard questions ("why 500 characters and not 5,000?", "what happens to a patient's name in a chunk?", "a tweet is already tiny — why chunk at all?"). Point out jargon I didn't explain and claims I didn't justify. Then rate each explanation 1–10 and tell me the single weakest part to fix before I hit record.
```

```ai-prompt
title: Design my sanitization function — test cases first
---
For Assignment 1, I'm adding a sanitization step to my ingestion pipeline (app/api/upload-document/route.ts) that cleans scraped web content BEFORE it hits chunkText() in app/libs/chunking.ts. Requirements: strip HTML tags, normalize whitespace, handle special characters (smart quotes, em dashes), and remove boilerplate ("Click here", nav links, footers).

Before I write any code: generate 10 nasty realistic input strings a scraper might produce (nested tags, &nbsp; entities, cookie banners, mixed newlines, unicode quotes) and the exact cleaned output my function should return for each. Then let me write the function myself and paste it back to you — check it against your cases and tell me which ones fail and why, without rewriting it for me.
```
