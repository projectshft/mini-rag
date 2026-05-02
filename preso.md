# What the F*ck is an AI Engineer?

---

## The Controversial Title

**AI Engineer** - a term that makes some people cringe

What it actually means:
- Full-stack engineer
- Who integrates LLMs into products
- Builds retrieval systems
- Designs agent workflows

**It's software engineering with a few new systems.**

---

## Who is this bald guy?

- Senior software engineer
- Worked at **two AI startups** (one acquired, one zero-to-one)
- Built AI systems for major record labels
- Designed AI engineering hiring process
- Interviewed dozens of candidates

I've seen the gaps. Now I'll show you how to fill them.

---

## The Opportunity

**Massive demand** for AI engineers

**Tiny talent pool** of people who actually know this stuff

The gap between "uses AI tools" and "builds AI systems" is huge.

**This is your roadmap to cross that gap.**

---

# The Learning Path

---

## Skills You'll Gain

1. **How LLMs Work** - The fundamentals
2. **Embeddings & Vectors** - The math that powers search
3. **Structured Outputs** - Making LLMs reliable
4. **RAG** - Retrieval Augmented Generation
5. **Agents** - LLM + tools + control loops
6. **Testing & Evals** - LLM-as-judge, datasets
7. **Observability** - Tracing and debugging

Let's break down how to learn each one.

---

# 1. How LLMs Work

---

## Understanding the Foundations

You don't need a PhD. You need intuition.

**What to understand:**
- Neural networks at a high level
- How transformers process text
- Attention mechanisms (conceptually)
- Why tokens matter

**This takes a few hours, not months.**

---

## Resources: How LLMs Work

**3Blue1Brown** (Free, visual, excellent)
- [Neural Networks playlist](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)
- [But what is a GPT? (Transformers)](https://www.youtube.com/watch?v=wjZofJX0v4M)

**Andrej Karpathy** (Free, hands-on)
- [Let's build GPT from scratch](https://www.youtube.com/watch?v=kCc8FmEb1nY)

**Goal:** Explain to a friend how a transformer turns text into predictions.

---

# 2. Embeddings & Vectors

---

## What Are Embeddings?

Text → Numbers that capture meaning

`"king"` → `[0.2, -0.5, 0.8, ...]`

Similar concepts = similar vectors.

**This is how semantic search works.**

---

## Resources: Embeddings

**Concepts:**
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Pinecone Learning Center](https://www.pinecone.io/learn/)

**Hands-on:**
- Build a simple similarity search
- Compare cosine similarity results
- See how "king - man + woman ≈ queen" actually works

**Goal:** Implement vector similarity from scratch.

---

# 3. Structured Outputs

---

## Why Structured Outputs Matter

LLMs return text. APIs need JSON.

**The problem:**
```
"The user wants to search for React hooks"
```

**The solution:**
```json
{ "agent": "rag", "query": "React hooks" }
```

Force the model to return valid, typed responses.

---

## Resources: Structured Outputs

**Concepts:**
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- Zod schemas with `zodResponseFormat`

**Practice Project:**
- [Cringe Influencer](https://github.com/projectshft/cringe-influencer)
- Build a social media post generator with typed LLM responses

**Goal:** Build something that treats an LLM like a typed API.

---

# 4. RAG (Retrieval Augmented Generation)

---

## RAG in 30 Seconds

LLMs don't know your data. RAG fixes that.

1. **Chunk** documents into pieces
2. **Embed** chunks into vectors
3. **Store** vectors in a database
4. **Query** - find relevant chunks
5. **Generate** - LLM answers with context

This is the #1 skill companies hire for.

---

## Resources: RAG

**Architecture:**
```
Documents → Chunking → Embeddings → Vector DB
                                        ↓
User Query → Query Embedding → Search → Top Results
                                            ↓
                                      LLM → Answer
```

**Hands-on:**
- Build a document Q&A system
- Experiment with chunk sizes
- Compare retrieval strategies

**Goal:** Build a working RAG system end-to-end.

---

# 5. Agents

---

## What Agents Actually Are

Not autonomous AI. Just:
- LLM
- Tools (API calls)
- Control loop

The LLM decides which tool to call. That's it.

**Most "agents" should be workflows** (fixed steps, predictable).

---

## Resources: Agents

**Concepts:**
- Workflow vs autonomous agents
- Tool calling patterns
- Graceful degradation

**Key insight:** Start with workflows. Add agent flexibility only when needed.

**Goal:** Build a router that selects between multiple tools.

---

# 6. Testing & Evaluation

---

## The Testing Problem

Traditional: Input → Expected output

LLMs: Input → Probabilistic output

**New approaches:**
- Evaluation datasets
- LLM-as-judge (model evaluates model)
- Regression testing for prompts

---

## Resources: Testing

**Pattern:** LLM-as-Judge
1. Define "golden" reference responses
2. Run your system
3. Ask another LLM to score the output
4. Pass/fail based on threshold

**Goal:** Build an eval suite that catches regressions.

---

# 7. Observability

---

## Why Observability Matters

Production AI systems drift:
- Models change
- Prompts evolve
- Data distributions shift

You need to see what's happening.

---

## Resources: Observability

**Tools:**
- LangSmith
- Langfuse
- Custom tracing

**What to track:**
- Every LLM call
- Latency and costs
- Error rates
- User feedback

**Goal:** Trace a request through your entire system.

---

# Putting It Together

---

## The Learning Order

1. **LLM Fundamentals** - 3Blue1Brown videos (few hours)
2. **Embeddings** - Build similarity search (1 day)
3. **Structured Outputs** - Cringe Influencer project (1 day)
4. **RAG** - Document Q&A system (1 week)
5. **Agents** - Router + tools (few days)
6. **Testing** - LLM-as-judge eval suite (few days)
7. **Observability** - Add tracing to your RAG app (1 day)

**Total: A few weeks of focused work.**

---

## What Makes You Valuable

Not just knowing the concepts.

**Having opinions:**
- When to use RAG vs fine-tuning
- When to build agents vs workflows
- When to use AI vs traditional code
- When NOT to use AI

**The engineer who explains tradeoffs clearly wins.**

---

## The Window

Companies want AI. They don't know how to build it.

This window won't stay open forever:
- Tools are getting easier
- More people are learning
- The early mover advantage is now

**The engineers who build real systems will always beat the ones who just talk about them.**

---

## Let's Talk

Schedule a time to chat:

https://calendly.com/brianjenney83/15-minute-meeting-your-web-dev-roadmap-clone

See if you're a good fit for the Parsity AI program.
