# 4-Week Program Schedule

**Program Goal:** Students submit their capstone project by the end of Week 4.

**Learning Format:**
- Self-paced modules with hands-on exercises
- Weekly homework assignments (video OR written)
- Weekly live sessions for Q&A and demos
- Building progressively toward the capstone

**Total Homework Assignments:** 3 main + 2 capstone videos

---

## Quick Reference: Week-by-Week

| Week | Modules | Key Deliverable | Homework Due | Time |
|------|---------|----------------|--------------|------|
| **Pre** | Setup | Environment ready | - | 3-4 hrs |
| **Week 1** | 1, 2, 4, 4.5, 5 | Document pipeline | HW #1, #2 | 8-12 hrs |
| **Week 2** | 7, 8, 9, 11 | Chat app with agents | HW #3 | 9-13 hrs |
| **Week 3** | 12, 13, 10*, 10.5* | Production ready | - | 6-8 hrs (11-15 w/ optional) |
| **Week 4** | 15 | Capstone project | Video #4, #5 | 12-20 hrs |

*Optional modules

---

## Pre-Course: Before Week 1 Starts

**Time Required:** 3-4 hours (spread over multiple days)

### Required Setup & Learning
- [ ] Watch linear algebra videos (vectors, dot products)
- [ ] Watch LLM/transformer architecture videos
- [ ] Read: Anthropic's "Building Effective Agents"
- [ ] Create accounts (OpenAI, Pinecone, Helicone, Vercel, GitHub)
- [ ] Clone repository and verify setup works

**Location:** `week-0-setup/PRE-COURSE-HOMEWORK.md`

**Why:** Students need foundational knowledge before diving into implementation.

---

## Homework Assignments Overview

**All homework can be submitted as video OR written** - student's choice!

| # | Topic | Format | Due | Location |
|---|-------|--------|-----|----------|
| 1 | Dot Products Explanation | 2-3 min video OR 500-800 words | Before Module 4 | `2-vector-math-basics/3-word-math-fun.md` |
| 2 | Chunking Strategies Research | 5-7 min video OR 800-1200 words | Before Module 5 | `4.5-chunking-fundamentals/2-understanding-chunking.md` |
| 3 | Re-ranking Deep Dive | 5-8 min video OR 1000-1500 words | Before Module 11 | `9-rag-agent/2-implementing-reranking.md` |
| 4 | Capstone Proposal | 2-3 min video (required) | Week 4 Monday | `15-capstone-project/1-final-project.md` |
| 5 | Capstone Demo | 3-5 min video (required) | Week 4 Friday | `15-capstone-project/1-final-project.md` |

---

## Week 1: RAG Fundamentals

**Theme:** Understanding and building basic RAG systems

### Modules to Complete

#### Module 1: Introduction to RAG (30 min)
- What is RAG and why it matters
- Problem: LLM hallucinations
- Solution: Retrieval-Augmented Generation
- Real-world applications

**Location:** `1-intro-to-rag/`

---

#### Module 2: Vector Math Basics (2-3 hours)
- Understanding embeddings and vectors
- Implementing cosine similarity
- Word math experiments ("king" - "man" + "woman" = "queen")
- Building intuition for semantic search

**Location:** `2-vector-math-basics/`

**Exercises:**
- [ ] Calculate cosine similarity between embeddings
- [ ] Experiment with word math
- [ ] Visualize vector relationships

---

#### Module 4: Pinecone Integration (1 hour)
- Setting up Pinecone client
- Creating indexes
- Upserting and querying vectors
- Understanding namespaces and metadata

**Location:** `4-pinecone-integration/`

**Exercises:**
- [ ] Create Pinecone index
- [ ] Upsert sample data
- [ ] Query vectors and verify results

---

#### Module 4.5: Chunking Fundamentals (2 hours)
- Why chunking matters
- Chunk size vs retrieval quality
- Overlap strategies
- Implementing semantic chunking

**Location:** `4.5-chunking-fundamentals/`

**Exercises:**
- [ ] Implement fixed-size chunking
- [ ] Implement semantic chunking
- [ ] Compare chunking strategies
- [ ] Test chunking with real documents

---

#### Module 5: Document Upload (2-3 hours)
- Building document ingestion pipeline
- Processing markdown/text files
- Generating embeddings at scale
- Storing in Pinecone with metadata

**Location:** `5-document-upload/`

**Exercises:**
- [ ] Build document upload API route
- [ ] Process and chunk React documentation
- [ ] Generate embeddings for chunks
- [ ] Upsert to Pinecone
- [ ] Verify documents are searchable

---

### Week 1 Homework & Deliverables

**📝 Homework Assignment #1** (Due before Module 4):
- **Video (2-3 min) OR Written (500-800 words)**
- Explain dot products to a non-math person
- Why they matter for RAG/semantic search
- **Location:** `2-vector-math-basics/3-word-math-fun.md`

**📝 Homework Assignment #2** (Due before Module 5):
- **Video (5-7 min) OR Written (800-1200 words)**
- Research 2 alternative chunking strategies
- Include comparison table
- **Location:** `4.5-chunking-fundamentals/2-understanding-chunking.md`

**🎯 Week 1 Deliverable:**
Working document ingestion pipeline that can:
- Upload and chunk documents
- Generate embeddings
- Store in Pinecone
- Query for relevant documents

**Total Time:** 8-12 hours

---

## Week 2: Building Intelligent Agents

**Theme:** Creating agents that use RAG to answer questions

### Modules to Complete

#### Module 7: Agent Architecture (2-3 hours)
- Understanding AI agents
- Prompting strategies
- Building a text-based selector
- Structured outputs with AI SDK

**Location:** `7-agent-architecture/`

**Exercises:**
- [ ] Build simple agent router
- [ ] Implement text-based routing
- [ ] Add structured outputs
- [ ] Test routing with various queries

---

#### Module 8: LinkedIn Agent (2-3 hours)
- Building a content generation agent
- Tool-calling patterns (optional, depending on approach)
- Context retrieval for content creation
- Prompt engineering for LinkedIn style

**Location:** `8-linkedin-agent/`

**Exercises:**
- [ ] Implement LinkedIn post generator
- [ ] Connect to vector database
- [ ] Test with various prompts
- [ ] Refine output quality

---

#### Module 9: RAG Agent (3-4 hours)
- Building the core RAG agent
- Implementing retrieval workflow
- Adding reranking for better results
- Understanding sparse vs dense vectors (optional reading)

**Location:** `9-rag-agent/`

**Exercises:**
- [ ] Implement basic RAG agent (9.1)
- [ ] Add reranking with Pinecone (9.2)
- [ ] Read about sparse/dense vectors (9.4)
- [ ] Test with technical queries
- [ ] Compare with/without reranking

---

#### Module 11: Chat Interface (2-3 hours)
- Connecting agents to UI
- Implementing streaming responses
- Managing conversation history
- Agent selection in the UI

**Location:** `11-chat-interface/`

**Exercises:**
- [ ] Wire up agent selector to UI
- [ ] Implement streaming chat
- [ ] Test all agents through UI
- [ ] Handle errors gracefully

---

### Week 2 Homework & Deliverables

**📝 Homework Assignment #3** (Due before Module 11):
- **Video (5-8 min) OR Written (1000-1500 words)**
- Explain re-ranking with 2-3 concrete examples
- Include diagrams showing before/after reranking
- **Location:** `9-rag-agent/2-implementing-reranking.md`

**🎯 Week 2 Deliverable:**
Working chat application with:
- Multiple intelligent agents (selector, LinkedIn, RAG)
- Streaming responses
- Agent routing based on user queries
- Clean, functional UI

**Total Time:** 9-13 hours

---

## Week 3: Production Ready & Advanced Topics

**Theme:** Making your application production-ready and learning advanced patterns

### Modules to Complete

#### Module 5.5: Fine-tuning (Optional) (2-3 hours)
- When and why to fine-tune
- Preparing training data
- Training a model on OpenAI
- Comparing fine-tuned vs base models

**Location:** `5-fine-tuning/`

**Exercises:**
- [ ] Prepare training dataset
- [ ] Fine-tune GPT-4o-mini
- [ ] Test fine-tuned model
- [ ] Compare performance

**Note:** Optional if students want specialized routing or style

---

#### Module 12: Observability (2 hours)
- Why observability matters
- Setting up Helicone
- Tracking costs and latency
- Debugging agent behavior

**Location:** `12-observability/`

**Exercises:**
- [ ] Integrate Helicone
- [ ] View request traces
- [ ] Analyze costs per agent
- [ ] Set up alerts (optional)

---

#### Module 13: Testing Agents (2-3 hours)
- Writing tests for agents
- Testing routing logic
- Testing retrieval quality
- Regression testing

**Location:** `13-testing-agents/`

**Exercises:**
- [ ] Write tests for selector agent
- [ ] Test RAG retrieval
- [ ] Test edge cases
- [ ] Run full test suite

---

#### Module 10: AI Frameworks - LangGraph (Optional) (3-4 hours)
- Introduction to LangGraph
- Building stateful agents
- Graph-based workflows
- When to use LangGraph vs simple workflows

**Location:** `10-ai-frameworks/`

**Exercises:**
- [ ] Build LangGraph research agent
- [ ] Implement state management
- [ ] Add conditional routing
- [ ] Compare with simple workflow

**Note:** Advanced/optional for students interested in complex orchestration

---

#### Module 10.5: Tool-Calling Exploration (Optional) (2 hours)
- Understanding tool-calling patterns
- When to use tools vs workflows
- Comparing approaches
- Trade-offs and cost analysis

**Location:** `10.5-tool-calling-exploration/`

**Note:** Conceptual only - students understand patterns without refactoring

---

### Week 3 Deliverables

**🎯 Production-ready application with:**
- Observability and monitoring (Helicone integrated)
- Test coverage for agents
- Fine-tuned model (optional)
- Understanding of advanced patterns (LangGraph/tool-calling)

**💡 Prepare for Capstone:**
- Start thinking about domain/topic
- Consider data sources
- Identify 2+ custom agents you want to build

**Core Time:** 6-8 hours
**With Optional:** 11-15 hours

---

## Week 4: Capstone Project

**Theme:** Building a custom RAG application from scratch

### Capstone Requirements

Students build their own RAG application incorporating concepts learned:

**Required Features:**
- [ ] Custom document ingestion (choose domain/topic)
- [ ] Vector database integration
- [ ] At least 2 custom agents
- [ ] Agent routing/selection
- [ ] Chat interface
- [ ] Basic observability

**Bonus Features (Choose 1-2):**
- [ ] Fine-tuned model for specific use case
- [ ] Reranking implementation
- [ ] Multiple data sources
- [ ] LangGraph workflow
- [ ] Comprehensive test suite

**Location:** `15-capstone-project/`

### Weekly Milestones & Submissions

**Monday: Kickoff** (🎥 Video Assignment #4)
- [ ] Submit **2-3 minute proposal video** covering:
  - Domain/topic chosen
  - Agents you'll build (2+ required)
  - Data sources you'll use
  - Expected challenges
- [ ] Get instructor feedback on scope

**Wednesday: Mid-Week Check-in**
- [ ] Document ingestion working
- [ ] At least 1 agent implemented
- [ ] Show progress for feedback
- [ ] Adjust scope if needed

**Friday: Final Submission** (🎥 Video Assignment #5)
- [ ] Submit GitHub repository with:
  - Complete working code
  - README with project description
  - Setup instructions
  - Challenges faced and solutions
- [ ] Submit **3-5 minute demo video** showing:
  - Overview of your application
  - Live demo of key features
  - What you learned
- [ ] Present in live session (5-10 min each)

**Total Time:** 12-20 hours

**Location:** `15-capstone-project/1-final-project.md`

---

## Weekly Live Sessions

### Week 1: RAG Foundations
- Review vector math concepts
- Demonstrate document upload pipeline
- Debug common Pinecone issues
- Q&A

### Week 2: Building Agents
- Review agent architecture patterns
- Demo working chat interface
- Discuss routing strategies
- Q&A

### Week 3: Production & Advanced Topics
- Review observability setup
- Discuss testing strategies
- Overview of LangGraph (for interested students)
- Capstone project kickoff and planning

### Week 4: Capstone Presentations
- 5-10 min presentations per student
- Demo your application
- Discuss challenges and learnings
- Feedback and next steps

---

## Time Commitment Summary

| Week | Core Modules | Optional Modules | Total (Core) | Total (With Optional) |
|------|-------------|------------------|--------------|---------------------|
| Pre-Course | 3-4 hours | - | 3-4 hours | 3-4 hours |
| Week 1 | 8-12 hours | - | 8-12 hours | 8-12 hours |
| Week 2 | 9-13 hours | - | 9-13 hours | 9-13 hours |
| Week 3 | 6-8 hours | 5-7 hours | 6-8 hours | 11-15 hours |
| Week 4 | 12-20 hours | - | 12-20 hours | 12-20 hours |
| **Total** | **38-57 hours** | **5-7 hours** | **38-57 hours** | **43-64 hours** |

**Recommended pace:** 10-16 hours per week for core content

---

## Success Metrics

By the end of the program, students will be able to:

✅ Explain how RAG works and when to use it
✅ Build document ingestion pipelines
✅ Implement vector search with Pinecone
✅ Create intelligent agents with routing
✅ Build production-ready chat interfaces
✅ Monitor and debug AI applications
✅ Test agent behavior
✅ Deploy a complete RAG application

---

## Tips for Success

### For Instructors:
- Emphasize pre-course homework - foundational knowledge is critical
- Week 1 can feel slow (math/theory) but builds essential intuition
- Week 2 is where it "clicks" - students see their work come together
- Week 3 should prioritize observability/testing over advanced topics
- Week 4: Keep students on track with midweek check-in

### For Students:
- Don't skip the pre-course homework
- Complete modules sequentially - each builds on the previous
- Test your code frequently - don't accumulate bugs
- Ask questions in live sessions
- Start capstone planning early in Week 3
- Scope your capstone realistically - better to do less, well

---

## Adjustments for Different Paces

### Accelerated (3 weeks):
- Combine Weeks 1-2 into Week 1
- Skip optional modules (fine-tuning, LangGraph)
- Week 3: Focus on capstone only

### Extended (6 weeks):
- Week 1-2: RAG Fundamentals (slower pace)
- Week 3: Building Agents
- Week 4: Advanced Topics (include all optional modules)
- Week 5-6: Capstone with deeper exploration

### Self-Paced:
- Complete modules at your own speed
- Submit capstone when ready
- Join office hours for support
