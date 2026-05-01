# AI Engineering Interview Playbook

How to think, explain, and stand out in AI engineering interviews.

---

## What This Covers

Most engineers struggle with AI interviews because they treat them like traditional software interviews. But AI engineering interviews test different skills:

- **Technical thinking** - Can you explain tradeoffs and make decisions?
- **Communication** - Can you articulate what you built and why?
- **Opinions** - Do you have defensible positions on frameworks, patterns, and tools?
- **System design** - Can you architect RAG systems, chunking strategies, and agent workflows?

This is not about memorizing answers. This is about learning how to think and explain like an engineer.

---

## What You'll Build

By the end, you'll have:

- ✅ A signature story about your RAG project
- ✅ Strong opinions on agents, frameworks, and RAG patterns
- ✅ System design answers for common scenarios
- ✅ Video recordings of your practice sessions
- ✅ Written artifacts you can reference before interviews

---

## Structure

### Your Signature Story
**Goal:** Craft a clear, compelling story about your project.

**Deliverables:**
- Written story using Problem → Agitate → Solve → Reflect framework
- Video recording of your story

---

### Strong Opinions & Tradeoffs
**Goal:** Develop defensible positions on agents, frameworks, and workflows.

**Deliverables:**
- Written opinions on agents vs workflows, LangChain vs LangGraph
- Video recording explaining your strongest opinion

---

### RAG System Design
**Goal:** Design RAG systems for different scenarios with clear reasoning.

**Deliverables:**
- Written system designs for 3 different scenarios
- Video walkthrough of one system design

---

### Live Practice
**Goal:** Practice answering common questions out loud.

**Deliverables:**
- 3 video recordings answering different interview questions

---

## Why This Works

**The problem with most interview prep:**
- Memorizing answers (sounds robotic)
- Generic responses (doesn't differentiate you)
- No practice speaking out loud (stumbles in real interviews)

**Our approach:**
- ✅ Build frameworks for thinking, not scripts
- ✅ Create written artifacts you can review
- ✅ Practice out loud with video recordings
- ✅ Get comfortable explaining your decisions

---

## How to Use This

### Step 1: Work Through Each Section in Order
Each section builds on the previous.

### Step 2: Do the Written Assignments First
Writing forces clarity. Do written assignments before video recordings.

### Step 3: Record Video Assignments
Speaking out loud is different from writing. Video exposes:
- Filler words ("um", "like", "you know")
- Unclear explanations
- Poor pacing
- Missing structure

### Step 4: Watch Your Videos
This is uncomfortable but critical. Notice:
- Where you stumbled
- What sounded unclear
- What you forgot to mention
- What you explained well

### Step 5: Iterate
Re-record until you can explain clearly without reading notes.

---

## What Interviewers Actually Look For

They are NOT looking for:
- ❌ Perfect answers
- ❌ Memorized scripts
- ❌ Buzzword bingo

They ARE looking for:
- ✅ Clear thinking
- ✅ Tradeoff awareness
- ✅ Strong opinions (with reasoning)
- ✅ Communication skills
- ✅ System design ability

**The best candidates don't just explain what they built — they explain why they built it that way.**

---

## Technical Foundations

Before interviews, make sure you can explain these concepts clearly.

### RAG Implementation

RAG is retrieval + generation. The core loop:

1. **Chunk** documents into smaller pieces (500-1000 tokens)
2. **Embed** chunks into vectors using an embedding model
3. **Store** vectors in a database (Pinecone, pgvector, etc.)
4. **Query** - embed the user's question, find similar chunks
5. **Generate** - pass retrieved chunks to the LLM as context

**Key interview points:**
- Why chunk? (Context windows, relevance, cost)
- Chunk overlap prevents cutting sentences mid-thought
- Embedding models (OpenAI, Cohere) convert text → vectors
- Cosine similarity finds "closest" vectors

### Embeddings & Vectors (Brief)

Vectors are just arrays of numbers: `[0.2, -0.5, 0.8, ...]`

Embedding models learn to place similar concepts close together in vector space. "King" and "Queen" are closer than "King" and "Banana".

For deeper understanding of the math behind LLMs and neural networks:
- [3Blue1Brown: Neural Networks](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)
- [3Blue1Brown: Transformers](https://www.youtube.com/watch?v=wjZofJX0v4M)

### Structured Outputs

Force the LLM to return valid JSON matching a schema:

```typescript
const schema = z.object({
  agent: z.enum(['rag', 'linkedin', 'general']),
  confidence: z.number(),
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [...],
  response_format: zodResponseFormat(schema, 'routing'),
});
```

**Why it matters:** Reliable parsing, type safety, no regex hacks.

### Practice Projects

Solidify your understanding with these small projects:

**[Cringe Influencer](https://github.com/projectshft/cringe-influencer)** - A small structured outputs project. Build a social media post generator with type-safe LLM responses.

---

## Ready to Start?

Start with Your Signature Story - it's the most important section. Nail this, and you'll stand out in every interview.
