# Week 4: RAG Agent (Days 22-28)

**Theme:** Advanced retrieval and chat interface

**Assignment:** RAG + Reranking (Due Day 34)

---

## Day 22: RAG Agent Implementation (Exercise)

**Time:** 90 min | **Type:** Hands-on

### Learning Objectives
- Implement end-to-end RAG retrieval
- Combine retrieved context with generation
- Handle cases with no relevant documents

### Content
1. [RAG Agent Basics](../9-rag-agent/1-rag-agent-basics.md)

### Exercise
Complete the TODOs in `app/agents/rag.ts`:

1. Embed the user query
2. Search Pinecone for relevant documents
3. Format context for the LLM
4. Generate response with retrieved context
5. Handle empty results gracefully

### Run Tests
```bash
yarn test:selector
```

### Key Takeaways
- RAG = Retrieve → Augment → Generate
- Context formatting affects response quality
- Always handle "no relevant docs found" case

---

## Day 23: Implementing Reranking

**Time:** 60 min | **Type:** Hands-on

### Learning Objectives
- Understand the over-fetch and rerank pattern
- Implement reranking with a second model
- Know when reranking helps vs hurts

### Content
1. [Implementing Reranking](../9-rag-agent/2-implementing-reranking.md)

### Exercise
Add reranking to your RAG agent:

1. Fetch more documents than needed (over-fetch)
2. Use a reranking model to score relevance
3. Take top-k after reranking
4. Pass refined context to generator

### Assignment Assigned
**RAG + Reranking** is now assigned. See [ASSIGNMENTS.md](../ASSIGNMENTS.md) for details.

### Key Takeaways
- First-stage retrieval is fast but imprecise
- Reranking is slower but more accurate
- Over-fetch → rerank → take top-k

---

## Day 24: Sparse & Dense Vectors

**Time:** 45 min | **Type:** Read

### Learning Objectives
- Understand sparse vs dense embeddings
- Know when to use hybrid search
- Recognize keyword matching use cases

### Content
1. [Sparse and Dense Vectors](../9-rag-agent/3-sparse-and-dense-vectors.md)

### Key Takeaways
- Dense = semantic meaning (what does it mean?)
- Sparse = keyword matching (what words are present?)
- Hybrid = best of both for many use cases

---

## Day 25: Chat Interface

**Time:** 60 min | **Type:** Read

### Learning Objectives
- Understand React streaming patterns
- Know how the chat UI manages state
- Recognize user experience considerations

### Content
1. [Understanding the Interface](../11-chat-interface/1-understanding-the-interface.md)
2. [Challenge: Source References](../11-chat-interface/2-challenge.md) (optional)

### Key Takeaways
- Streaming = token-by-token display for responsiveness
- State management handles conversation history
- Good UX requires loading states and error handling

---

## Day 26: LangSmith Observability

**Time:** 45 min | **Type:** Setup

### Learning Objectives
- Set up LangSmith for tracing
- Understand trace structure
- Debug agent behavior with traces

### Content
1. [Integrating LangSmith](../12-observability/1-integrating-langsmith.md)

### Setup Steps
1. Create LangSmith account at smith.langchain.com
2. Get API key
3. Add environment variables:
   ```
   LANGSMITH_TRACING=true
   LANGSMITH_ENDPOINT=https://api.smith.langchain.com
   LANGSMITH_API_KEY=lsv2_pt_...
   LANGSMITH_PROJECT="your-project-name"
   ```
4. Run your app and verify traces appear

### Key Takeaways
- Observability = visibility into what your agent is doing
- Traces show each LLM call, inputs, outputs
- Essential for debugging production issues

---

## Day 27: Assignment 3 Work

**Time:** 90 min | **Type:** Assignment

### Focus
Complete Assignment 3: RAG + Reranking

**Video (3-4 minutes):** Explain how you evaluate retrieval quality - chunk sizing, retrieval accuracy, similarity thresholds, and metrics.

**Code:** Complete the RAG agent TODOs, then add query preprocessing.

### Files
- `app/agents/rag.ts`

### Tips
- Video should show your understanding of quality tradeoffs
- Demonstrate reranking impact with examples
- Test with queries that should/shouldn't find results

### Submit (by Day 34)
- [Video Submission](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission](https://form.typeform.com/to/EWWcsorL)

---

## Day 28: REST

Take a break. Week 5 covers testing and tools.

Also finish Assignment 2 (Agent Selector) if not done.

### Assignment 2 Due
- [Video Submission](https://form.typeform.com/to/NdVcsThQ) (if required)
- [Code Submission](https://form.typeform.com/to/A0pGKPqU)

---

## Week 4 Checklist

- [ ] Implemented RAG agent with retrieval + generation
- [ ] Added reranking to improve retrieval quality
- [ ] Understand sparse vs dense vectors
- [ ] LangSmith configured and traces appearing
- [ ] Assignment 2 submitted (Due Day 27)
- [ ] Assignment 3 in progress (Due Day 34)
