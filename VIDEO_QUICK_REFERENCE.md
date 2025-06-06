# Video Course Quick Reference

## Course Flow (9 Videos, ~3.5 hours)

### 🎬 Video 1: Intro & Demo (7 min)

-   Show working app
-   Tease what they'll learn
-   "From API call to production RAG"

### 🎬 Video 2: LLM Basics (20 min)

**File:** `app/api/chat/route.ts`

-   Simple OpenAI call
-   Error handling
-   Costs & tokens

### 🎬 Video 3: Agent System (30 min)

**Files:** `app/services/agents/*`

-   Router pattern
-   Specialized agents
-   Live debugging

### 🎬 Video 4: Vector DB (25 min)

**File:** `app/libs/pinecone.ts`

-   Embeddings demo
-   Similarity search
-   Visual explanation

### 🎬 Video 5: RAG Implementation (35 min)

**File:** `app/services/agents/newsAgent.ts`

-   Full RAG pipeline
-   Before/after comparison
-   Build minimal version

### 🎬 Video 6: Data Pipeline (30 min)

**Files:** `app/scripts/scrapeAndVectorize.ts`

-   Web scraping
-   Batch processing
-   Error handling

### 🎬 Video 7: Fine-Tuning (25 min)

**File:** `app/scripts/upload-training-data.ts`

-   When to use it
-   Cost calculator
-   Results comparison

### 🎬 Video 8: Production (20 min)

**File:** `app/libs/helicone.ts`

-   Monitoring
-   Cost tracking
-   Best practices

### 🎬 Video 9: Your Turn (15 min)

-   Show challenges
-   Project ideas
-   Next steps

---

## Key Files to Reference

```
app/
├── api/
│   ├── chat/route.ts          (Basic LLM call)
│   └── scrape/route.ts        (Web scraping)
├── services/
│   └── agents/
│       ├── agentSelector.ts   (Router)
│       ├── linkedinAgent.ts   (Fine-tuned)
│       └── newsAgent.ts       (RAG example)
├── libs/
│   ├── openai.ts             (Client setup)
│   ├── pinecone.ts           (Vector DB)
│   └── helicone.ts           (Monitoring)
└── scripts/
    ├── upload-training-data.ts
    ├── scrapeAndVectorize.ts
    └── vectorize-articles.ts
```

---

## Demo Queries

**LinkedIn Agent:**

-   "Write a post about React hooks"
-   "Create a TypeScript tip"

**News Agent:**

-   "Latest on AI regulation"
-   "Climate change updates"

**Break the Selector:**

-   "Generate a recipe" (no agent)

---

## Common Issues to Demo

1. **Rate Limiting**

    - Trigger with rapid calls
    - Show retry logic

2. **No Context Found**

    - Query obscure topic
    - Show fallback behavior

3. **Wrong Agent Selected**
    - Ambiguous query
    - Debug selector logic

---

## Key Concepts Checklist

-   [ ] Stateless LLMs need context
-   [ ] Agents specialize behavior
-   [ ] Embeddings capture meaning
-   [ ] RAG provides fresh knowledge
-   [ ] Fine-tuning customizes style
-   [ ] Monitoring prevents surprises

---

## Recording Reminders

📱 **Screen Setup**

-   VS Code (increase font)
-   Terminal (clear history)
-   Browser (incognito mode)
-   Close notifications

🎯 **Teaching Style**

-   Show mistakes & fixes
-   Explain the "why"
-   Build incrementally
-   Celebrate small wins

⏱️ **Pacing**

-   Pause after concepts
-   Repeat key points
-   Leave thinking time
-   "Try this yourself"
