# Day 12 — Fine-Tuning Overview

**Time:** ~45 min · Read + Watch

> **Today:** a lighter day. You'll learn what fine-tuning is, when it beats RAG (and when it doesn't), and why the industry has largely moved past it — knowledge you'll need for architecture decisions and interviews, even though you won't train a model yourself.

> **Important Update (May 2026)**
>
> As of May 7, 2026, OpenAI has limited access to fine-tuning and announced plans to eventually deprecate it fully. This change reflects the industry's recognition that **"context is all you really need"** — modern models like GPT-4o and Claude have become so capable that few-shot prompting and RAG can achieve results that previously required fine-tuning.
>
> **What this means for this course:**
> - You will **not** run fine-tuning scripts yourself
> - The LinkedIn agent now uses **few-shot prompting** — real example posts embedded in the prompt — instead of a fine-tuned model
> - Focus on **understanding the concepts** — the scripts are now historical artifacts showing how fine-tuning worked
> - Fine-tuning remains valuable knowledge because **other providers** (Anthropic, Cohere, open-source models via Hugging Face) still offer it
>
> The concepts in this module prepare you for the LinkedIn agent implementation on [Day 20](/learn/day-20), where you'll achieve the same style consistency with few-shot prompting.

## Video walkthrough

<iframe src="https://share.descript.com/embed/n9XnMJvmku2" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## What is fine-tuning?

**The concept:** train a base AI model on your examples to learn your specific patterns, style, and knowledge.

**Analogy:** base model = new hire with general knowledge. Fine-tuned model = experienced team member who knows your processes and style.

**How it works:**

1. Start with a base model (e.g. GPT-4o-mini)
2. Provide 100+ examples of YOUR responses
3. The provider adjusts model weights to match your patterns
4. You get a custom model that writes like you

## Fine-tuning vs RAG: when to use each

| Aspect | Fine-Tuning | RAG |
|--------|-------------|-----|
| **Best for** | Consistent style/voice, repeated tasks | Latest information, large knowledge bases |
| **Use cases** | Brand voice, classification, customer support | Documentation Q&A, research, fact lookup |
| **Data required** | 100+ quality examples | Dynamic document collection |
| **How to update** | Retrain the model | Add/remove documents |
| **Cost** | $0.10–1 training + 2x inference | Per-query retrieval + inference |
| **Traceability** | No source citations | Can cite sources |
| **Speed** | Fast (no retrieval) | Slightly slower (retrieval step) |

**In this course:**

- **LinkedIn Agent** uses few-shot prompting → a specific voice and style, no training required
- **RAG Agent** uses retrieval → current technical documentation

### When to fine-tune

✅ **Use fine-tuning when:**

- You need consistent brand voice or writing style
- The task is repetitive (classification, formatting, support)
- You have 100+ quality examples in your style
- Style/tone matters more than the latest information

❌ **Don't fine-tune when:**

- Information changes frequently
- The base model already performs well
- You have limited examples (<50)
- You need source citations

```quiz
[
  {
    "q": "Your company's internal docs change weekly and users need answers with source links. Fine-tuning or RAG?",
    "options": ["Fine-tuning — retrain weekly on the new docs", "RAG — update the document index as content changes, and retrieval naturally provides citations", "Neither will work for changing content"],
    "answer": 1,
    "explain": "Two dealbreakers for fine-tuning here: frequent updates (retraining every week is slow and costly) and traceability (a fine-tuned model can't cite where an answer came from)."
  },
  {
    "q": "What actually changes when a model is fine-tuned?",
    "options": ["Documents are attached to the model for lookup at inference time", "The model's internal weights are adjusted to match patterns in your training examples", "The system prompt is permanently saved into the model"],
    "answer": 1,
    "explain": "Fine-tuning is training: weights move. That's why it bakes in style and patterns — and why it can't be 'updated' by swapping a document; you must retrain."
  },
  {
    "q": "Why did OpenAI move to deprecate fine-tuning in May 2026?",
    "options": ["Fine-tuning was found to be fundamentally broken", "Modern models are capable enough that few-shot prompting and RAG achieve what fine-tuning used to be needed for — 'context is all you really need'", "It was replaced by a larger fine-tuning API"],
    "answer": 1,
    "explain": "Not a flaw in the technique — a shift in economics. When examples in the prompt get you the same style consistency with zero training cost and instant iteration, fine-tuning stops being worth it for most applications."
  },
  {
    "q": "You have 30 example responses and want a consistent support-bot voice. What's the pragmatic move?",
    "options": ["Fine-tune anyway — 30 is plenty", "Few-shot prompting: put your best examples directly in the prompt", "Collect 70 more examples before doing anything"],
    "answer": 1,
    "explain": "Fine-tuning wants 100+ examples to work well. With a small set, few-shot prompting typically wins: no training cost, instant iteration, and modern models imitate style well from a handful of examples."
  }
]
```

## Cost breakdown

**Training (one-time):**

- ~$0.10–$1.00 for 100 examples
- Based on token count in the training data

**Usage (ongoing):**

- Base model: $0.150 per 1M input tokens
- Fine-tuned: $0.300 per 1M input tokens (2x cost)

**Is it worth it?**

- ✅ Yes: style consistency is critical, high-volume use case
- ❌ No: one-off tasks, frequently changing needs

**Example:** 1,000 queries/day at 500 tokens each → extra cost of ~$0.075/day = $2.25/month. Worth it if the quality improvement matters — trivial money, so the real cost is operational (maintaining a custom model, retraining to update it).

## Training data requirements

**Format:** JSONL (one JSON object per line)

```jsonl
{"messages": [{"role": "system", "content": "You are a professional LinkedIn advisor"}, {"role": "user", "content": "How do I write a good headline?"}, {"role": "assistant", "content": "Your headline is the first thing people see..."}]}
```

**What makes good training data:**

- ✅ Diverse questions (cover different topics)
- ✅ Consistent voice (all responses sound like the same person)
- ✅ High quality (well-written, accurate)
- ✅ 100+ examples minimum (500+ ideal)

**What makes bad training data:**

- ❌ Repetitive questions (no variety)
- ❌ Inconsistent tone (multiple authors)
- ❌ Low quality (errors, incomplete)

## Why learn this if it's deprecated?

### 1. Context for industry decisions

Modern models are so capable that **"context is all you really need"** for most use cases. Few-shot prompting and RAG now achieve what previously required fine-tuning. This shift is why OpenAI deprecated it — not because the technique is flawed, but because it's no longer necessary for most applications.

### 2. Fine-tuning still exists elsewhere

| Provider | Fine-Tuning Status |
|----------|-------------------|
| OpenAI | Deprecated (May 2026) |
| Anthropic | Available for enterprise |
| Cohere | Available via Command models |
| Hugging Face | Full support for open-source models |
| Together AI | API-based fine-tuning |

### 3. Interview & architecture knowledge

You may be asked:

- "When would you fine-tune vs use RAG?"
- "How does fine-tuning work technically?"
- "What are the tradeoffs?"

Understanding the concepts prepares you for these discussions.

### 4. Historical context

Many production systems still run on fine-tuned models. Knowing how they were created helps you maintain legacy systems, understand cost structures, and make migration decisions.

## What's next

On [Day 13](/learn/day-13), you'll examine the fine-tuning code as an artifact, see how few-shot prompting replaces it in the LinkedIn agent — and submit **Assignment 1**.

## ✅ Key takeaways

- Fine-tuning adjusts model *weights* from your examples; RAG supplies *context* at query time — style vs knowledge is the core split
- Choose RAG when information changes or you need citations; fine-tuning only made sense for stable, style-heavy, high-volume tasks with 100+ quality examples
- OpenAI's May 2026 deprecation reflects "context is all you really need" — few-shot prompting and RAG now cover most former fine-tuning use cases
- Training data quality (diverse questions, one consistent voice, JSONL format) mattered more than quantity
- Fine-tuning still lives at Anthropic, Cohere, Hugging Face, and Together AI — and in interviews

## 🤖 Work with AI

```ai-prompt
title: Architecture drill — fine-tune, RAG, or few-shot?
---
I just studied the fine-tuning vs RAG tradeoffs: fine-tuning = weights adjusted from 100+ examples, great for consistent style, no citations, retrain to update; RAG = retrieval at query time, great for changing knowledge, citable sources; few-shot prompting = examples in the prompt, zero training, instant iteration.

Give me 6 realistic product scenarios ONE AT A TIME (e.g. "a legal firm wants a contract-clause Q&A tool over 10,000 documents that update monthly", "a brand wants every support reply in its exact voice, 50k replies/day"). For each, I'll pick fine-tune / RAG / few-shot / hybrid and justify it. Push back on my reasoning — especially around update frequency, citations, example count, and cost — before revealing your pick. Keep score.
```

```ai-prompt
title: Explain the deprecation to a stakeholder
---
I'm practicing the Feynman Technique. My scenario: I'm the AI engineer at a company whose product roadmap said "fine-tune GPT on our brand voice", and I have to explain to a non-technical VP why we're doing few-shot prompting instead — covering what fine-tuning was, why OpenAI limited it in May 2026, what "context is all you really need" means, and why our result will be just as good with faster iteration.

Play the VP. Ask the questions an executive would ask ("so we're NOT getting our own custom model? are we getting less than we paid for?", "what if OpenAI changes their mind?", "is our brand voice data wasted now?"). Flag any jargon I fail to translate, then grade my explanation 1–10 on clarity and persuasiveness.
```
