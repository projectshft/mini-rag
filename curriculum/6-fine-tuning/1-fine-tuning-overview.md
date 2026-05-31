# Fine-Tuning Overview

Understand when to use fine-tuning vs RAG, and what fine-tuning can do for your application.

---

> **Important Update (May 2026)**
>
> As of May 7, 2026, OpenAI has limited access to fine-tuning and announced plans to eventually deprecate it fully. This change reflects the industry's recognition that **"context is all you really need"** — modern models like GPT-4o and Claude have become so capable that few-shot prompting and RAG can achieve results that previously required fine-tuning.
>
> **What this means for this course:**
> - You will **not** run fine-tuning scripts yourself
> - We provide a **pre-trained model** (`ft:gpt-4o-mini-2024-07-18:personal::COAiNLWZ`) for the LinkedIn agent exercises
> - Focus on **understanding the concepts** — the scripts are now historical artifacts showing how fine-tuning worked
> - Fine-tuning remains valuable knowledge because **other providers** (Anthropic, Cohere, open-source models via Hugging Face) still offer it
>
> The concepts in this module prepare you for the LinkedIn agent implementation, where you'll use our pre-trained model.

---

## Video Walkthrough

<iframe src="https://share.descript.com/embed/n9XnMJvmku2" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What is Fine-Tuning?

**The Concept:** Train a base AI model on your examples to learn your specific patterns, style, and knowledge.

**Analogy:** Base model = new hire with general knowledge. Fine-tuned model = experienced team member who knows your processes and style.

**How it works:**
1. Start with base model (GPT-4o-mini)
2. Provide 100+ examples of YOUR responses
3. OpenAI adjusts model weights to match your patterns
4. Get a custom model that writes like you

---

## Fine-Tuning vs RAG: When to Use Each

| Aspect | Fine-Tuning | RAG |
|--------|-------------|-----|
| **Best for** | Consistent style/voice, repeated tasks | Latest information, large knowledge bases |
| **Use cases** | Brand voice, classification, customer support | Documentation Q&A, research, fact lookup |
| **Data required** | 100+ quality examples | Dynamic document collection |
| **How to update** | Retrain the model | Add/remove documents |
| **Cost** | $0.10-1 training + 2x inference | Per-query retrieval + inference |
| **Traceability** | No source citations | Can cite sources |
| **Speed** | Fast (no retrieval) | Slightly slower (retrieval step) |

**In this course:**
- **LinkedIn Agent** uses fine-tuning → Your professional voice and style
- **RAG Agent** uses retrieval → Current technical documentation

---

## When to Fine-Tune

✅ **Use fine-tuning when:**
- You need consistent brand voice or writing style
- Task is repetitive (classification, formatting, support)
- You have 100+ quality examples in your style
- Style/tone matters more than latest information

❌ **Don't fine-tune when:**
- Information changes frequently
- Base model already performs well
- You have limited examples (<50)
- You need source citations

---

## Cost Breakdown

**Training (one-time):**
- ~$0.10-$1.00 for 100 examples
- Based on token count in training data

**Usage (ongoing):**
- Base model: $0.150 per 1M input tokens
- Fine-tuned: $0.300 per 1M input tokens (2x cost)

**Is it worth it?**
- ✅ Yes: Style consistency critical, high-volume use case
- ❌ No: One-off tasks, frequently changing needs

**Example:** 1000 queries/day with 500 tokens each
- Extra cost: ~$0.075/day = $2.25/month
- Worth it if quality improvements matter!

---

## Training Data Requirements

**Format:** JSONL (one JSON object per line)

```jsonl
{"messages": [{"role": "system", "content": "You are a professional LinkedIn advisor"}, {"role": "user", "content": "How do I write a good headline?"}, {"role": "assistant", "content": "Your headline is the first thing people see..."}]}
```

**What makes good training data:**
- ✅ Diverse questions (cover different topics)
- ✅ Consistent voice (all responses sound like same person)
- ✅ High quality (well-written, accurate)
- ✅ 100+ examples minimum (500+ ideal)

**What makes bad training data:**
- ❌ Repetitive questions (no variety)
- ❌ Inconsistent tone (multiple authors)
- ❌ Low quality (errors, incomplete)

---

## Why Learn This If It's Deprecated?

Even though OpenAI has deprecated fine-tuning, understanding it remains valuable:

### 1. Context for Industry Decisions

Modern models like GPT-4o and Claude 3.5 are so capable that **"context is all you really need"** for most use cases. Few-shot prompting and RAG now achieve what previously required fine-tuning.

This shift is why OpenAI deprecated fine-tuning — not because the technique is flawed, but because it's no longer necessary for most applications.

### 2. Fine-Tuning Still Exists Elsewhere

| Provider | Fine-Tuning Status |
|----------|-------------------|
| OpenAI | Deprecated (May 2026) |
| Anthropic | Available for enterprise |
| Cohere | Available via Command models |
| Hugging Face | Full support for open-source models |
| Together AI | API-based fine-tuning |

### 3. Interview & Architecture Knowledge

You may be asked:
- "When would you fine-tune vs use RAG?"
- "How does fine-tuning work technically?"
- "What are the tradeoffs?"

Understanding the concepts prepares you for these discussions.

### 4. Historical Context

Many production systems still run on fine-tuned models. Knowing how they were created helps you:
- Maintain legacy systems
- Understand cost structures
- Make migration decisions

---

## What's Next

In the next lesson, you'll examine the fine-tuning code as an artifact and configure your environment to use our pre-trained model.


