# 4-Week Compressed Schedule

**Goal:** Complete the program and submit capstone by end of Week 4

**Original Design:** 5 weeks → **Compressed:** 4 weeks

---

## Schedule Overview

| Week | Video Submission | Modules Covered | What You Build |
|------|-----------------|-----------------|----------------|
| **Week 1** | Dot products video | 1, 2, 4, 4.5 | Vector understanding, Pinecone setup, chunking |
| **Week 2** | Chunking strategies video | 5, 7, 8, 9 | Document pipeline, agents (selector, LinkedIn, RAG) |
| **Week 3** | Re-ranking video | 11, 12, 13 | Chat interface, observability, testing |
| **Week 4** | Capstone proposal + final videos | 15 | Complete capstone project |

---

## Week 1: RAG Foundations

**Video Submission:** [Dot Products Explanation](https://form.typeform.com/to/NdVcsThQ)
- 2-3 minute video OR 500-800 word essay
- Explain dot products to non-math person
- Due: End of Week 1

### Modules:
1. **Intro to RAG** (`1-intro-to-rag/`)
2. **Vector Math Basics** (`2-vector-math-basics/`)
3. **Pinecone Integration** (`4-pinecone-integration/`)
4. **Chunking Fundamentals** (`4.5-chunking-fundamentals/`)

### What You'll Build:
- Understanding of embeddings and similarity
- Pinecone index setup
- Chunking strategies implemented

---

## Week 2: Building Agents

**Video Submission:** [Chunking Strategies Research](https://form.typeform.com/to/VcNBEHNA)
- 5-7 minute video OR 800-1200 word report
- Research 2 alternative chunking strategies with comparison
- Due: End of Week 2

### Modules:
5. **Document Upload** (`5-document-upload/`)
6. **Agent Architecture** (`7-agent-architecture/`)
7. **LinkedIn Agent** (`8-linkedin-agent/`)
8. **RAG Agent** (`9-rag-agent/`)

### What You'll Build:
- Complete document ingestion pipeline
- Selector agent (routing)
- LinkedIn content generation agent
- RAG agent with reranking

---

## Week 3: Production Ready

**Video Submission:** [Re-ranking Deep Dive](https://form.typeform.com/to/pwjkAruL)
- 5-8 minute video OR 1000-1500 word guide
- Explain re-ranking with 2-3 examples and diagrams
- Due: End of Week 3

### Modules:
9. **Chat Interface** (`11-chat-interface/`)
10. **Observability** (`12-observability/`)
11. **Testing Agents** (`13-testing-agents/`)

### Optional (if time):
- **Fine-tuning** (`5-fine-tuning/`)
- **AI Frameworks/LangGraph** (`10-ai-frameworks/`)
- **Tool-Calling Exploration** (`10.5-tool-calling-exploration/`)

### What You'll Build:
- Chat UI connected to all agents
- Helicone observability integration
- Test suite for agent routing

---

## Week 4: Capstone Project

**Video Submissions:**
1. [Capstone Proposal](https://form.typeform.com/to/Z9JApCkF) - Due: Monday
2. [Capstone Final Demo](https://form.typeform.com/to/SF6b6edL) - Due: Friday

### Module:
12. **Capstone Project** (`15-capstone-project/`)

### Timeline:

**Monday:**
- Submit 2-3 minute proposal video
- [Code submission link](https://form.typeform.com/to/DXPyafyJ) (proposal doc/notes)
- Get instructor feedback

**Tuesday-Thursday:**
- Build your capstone
- Check in with instructor mid-week

**Friday:**
- Submit 3-5 minute demo video
- [Code submission link](https://form.typeform.com/to/TXjlfrlr) (GitHub repo)
- Present in live session

### Requirements:
- Working RAG system
- Custom data source
- Proper chunking strategy
- Vector database integration
- Example queries working
- Clean documentation

---

## Video Submission Links

| Week | Topic | Submission Link |
|------|-------|----------------|
| 1 | Dot Products | https://form.typeform.com/to/NdVcsThQ |
| 2 | Chunking Strategies | https://form.typeform.com/to/VcNBEHNA |
| 3 | Re-ranking | https://form.typeform.com/to/pwjkAruL |
| 4 | Capstone Proposal | https://form.typeform.com/to/Z9JApCkF |
| 4 | Capstone Final | https://form.typeform.com/to/SF6b6edL |

## Code Submission Links

| Week | Purpose | Submission Link |
|------|---------|----------------|
| 4 | Capstone Proposal | https://form.typeform.com/to/DXPyafyJ |
| 4 | Capstone Final | https://form.typeform.com/to/TXjlfrlr |

---

## Compression Strategy

**Original 5-week design:**
- Week 1: Modules 1-2 (foundations)
- Week 2: Modules 4-4.5 (chunking)
- Week 3: Modules 5-9 (agents)
- Week 4: Capstone proposal
- Week 5: Capstone final

**Compressed to 4 weeks:**
- Week 1: Modules 1-4.5 (foundations + chunking combined)
- Week 2: Modules 5-9 (pipeline + all agents)
- Week 3: Modules 11-13 (UI + production)
- Week 4: Capstone proposal + final (combined)

**Key Changes:**
- Week 1 combines vector math + chunking
- Week 2 adds document upload to agent building
- Week 4 compresses proposal + final into one week
- Optional modules (fine-tuning, LangGraph) remain optional

---

## Tips for Success

**Week 1:**
- Don't skip the math - understanding similarity is crucial
- Experiment with chunking early - it affects everything

**Week 2:**
- This is the hardest week - building multiple agents
- Test each agent individually before integration
- Use the provided tests to verify routing

**Week 3:**
- Observability helps you debug agents
- Write tests now, not later
- Start thinking about capstone ideas

**Week 4:**
- Keep capstone scope small - 4 days isn't much
- Better to do less, well, than more poorly
- Reuse your existing code/patterns
- Document as you go, not at the end
