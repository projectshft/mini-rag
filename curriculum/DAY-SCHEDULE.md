# Day-Based Curriculum Schedule

Complete the RAG & AI Agents curriculum in 42 days with 1-2 hours of daily study.

**Structure:** 6 weeks of learning (6 days on, 1 rest day)

**Pace:** Working engineers using AI tools - focused, practical, no fluff

---

## Week 1: Foundations (Days 1-7)

### Day 1
- [0-how-to-learn/1-feynman-technique.html](0-how-to-learn/1-feynman-technique.html)
- [1-intro-to-rag/1-what-is-rag.html](1-intro-to-rag/1-what-is-rag.html)

### Day 2
- [2-vector-math-basics/1-vectors-and-embeddings.html](2-vector-math-basics/1-vectors-and-embeddings.html)

### Day 3
- [2-vector-math-basics/2-implementing-similarity.html](2-vector-math-basics/2-implementing-similarity.html)

### Day 4
- [2-vector-math-basics/3-word-math-fun.html](2-vector-math-basics/3-word-math-fun.html)

### Day 5
- [3-pinecone-integration/1-setting-up-pinecone-client.html](3-pinecone-integration/1-setting-up-pinecone-client.html)

### Day 6
- [4-chunking-fundamentals/1-introduction-to-scraping.html](4-chunking-fundamentals/1-introduction-to-scraping.html)

### Day 7
**REST**

---

## Week 2: Data Pipeline (Days 8-14)

### Day 8
- [4-chunking-fundamentals/2-understanding-chunking.html](4-chunking-fundamentals/2-understanding-chunking.html)

### Day 9
- [5-document-upload/1-uploading-with-a-script.html](5-document-upload/1-uploading-with-a-script.html)

### Day 10
- [5-document-upload/2-building-the-api-route.html](5-document-upload/2-building-the-api-route.html)

### Day 11
- [5-document-upload/3-querying-documents.html](5-document-upload/3-querying-documents.html)

### Day 12
- [6-fine-tuning/1-fine-tuning-overview.html](6-fine-tuning/1-fine-tuning-overview.html)

### Day 13
- [6-fine-tuning/2-running-fine-tuning.html](6-fine-tuning/2-running-fine-tuning.html)

**Assignment 1 Due:** Document Upload

### Day 14
**REST**

---

## Week 3: Agent Architecture (Days 15-21)

### Day 15
- [7-agent-architecture/1-understanding-agent-systems.html](7-agent-architecture/1-understanding-agent-systems.html)

### Day 16
- [7-agent-architecture/2-prompting-for-agents.html](7-agent-architecture/2-prompting-for-agents.html)

### Day 17
- [7-agent-architecture/3-implementing-selector-text-based.html](7-agent-architecture/3-implementing-selector-text-based.html)

### Day 18
- [7-agent-architecture/4-upgrading-to-structured-outputs.html](7-agent-architecture/4-upgrading-to-structured-outputs.html)

### Day 19
- [7-agent-architecture/5-graceful-degradation.html](7-agent-architecture/5-graceful-degradation.html)

### Day 20
- [8-linkedin-agent/1-implementing-linkedin-agent.html](8-linkedin-agent/1-implementing-linkedin-agent.html)

### Day 21
**REST**

---

## Week 4: RAG Agent (Days 22-28)

### Day 22
- [9-rag-agent/1-implementing-rag-agent.html](9-rag-agent/1-implementing-rag-agent.html)

### Day 23
- [9-rag-agent/2-implementing-reranking.html](9-rag-agent/2-implementing-reranking.html)

### Day 24
- [9-rag-agent/3-sparse-dense-vectors.html](9-rag-agent/3-sparse-dense-vectors.html)

### Day 25
- [11-chat-interface/1-understanding-the-interface.html](11-chat-interface/1-understanding-the-interface.html)

### Day 26
- [12-observability/1-integrating-langsmith.html](12-observability/1-integrating-langsmith.html)

### Day 27
**Assignment 2 Due:** RAG Agent

### Day 28
**REST**

---

## Week 5: Testing & Tools (Days 29-35)

### Day 29
- [13-testing-agents/1-testing-selector-agent.html](13-testing-agents/1-testing-selector-agent.html)

### Day 30
- [13-testing-agents/2-llm-as-judge.html](13-testing-agents/2-llm-as-judge.html)

### Day 31
- [14-tool-calling-exploration/1-tool-calling-concepts.html](14-tool-calling-exploration/1-tool-calling-concepts.html)

### Day 32
- [14-tool-calling-exploration/2-the-reveal.html](14-tool-calling-exploration/2-the-reveal.html)

### Day 33
- [15-sql-agent/1-rag-without-vectors.html](15-sql-agent/1-rag-without-vectors.html)

### Day 34
**Assignment 3 Due:** Reranking

### Day 35
**REST**

---

## Week 6: Capstone (Days 36-42)

### Day 36
- [17-capstone-project/1-final-project.html](17-capstone-project/1-final-project.html)

**Submit Capstone Proposal**

### Day 37
Capstone Development

### Day 38
Capstone Development

**Assignment 4 Due:** SQL Agent

### Day 39
Capstone Development

### Day 40
Capstone Polish & Documentation

### Day 41
Capstone Demo Recording

### Day 42
**REST / Buffer**

**Assignment 5 Due:** Capstone (Final Submission)

---

## Bonus Content

### LangGraph Extension (Optional)
- [10-ai-frameworks/2-langgraph-concepts.html](10-ai-frameworks/2-langgraph-concepts.html)
- [10-ai-frameworks/3-custom-state-graphs.html](10-ai-frameworks/3-custom-state-graphs.html)

---

## Assignment Schedule

| # | Name | Due |
|---|------|-----|
| 1 | Document Upload | Day 13 |
| 2 | RAG Agent | Day 27 |
| 3 | Reranking | Day 34 |
| 4 | SQL Agent | Day 38 |
| 5 | Capstone | Day 42 |

See [ASSIGNMENTS.md](./ASSIGNMENTS.md) for submission links.

---

## Quick Commands

```bash
yarn test:selector    # Agent routing tests
yarn test:chunking    # Chunking tests
yarn test             # All tests
yarn dev              # Start Next.js server
```
