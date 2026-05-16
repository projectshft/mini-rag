# Week 6: Capstone Project (Days 36-45)

**Theme:** Build something real

**Assignment:** Capstone (Due Day 45)

---

## Day 36: Capstone Kickoff

**Time:** 90 min | **Type:** Project

### Learning Objectives
- Choose your capstone project
- Plan the implementation
- Set up the project structure

### Assignment Assigned
**Capstone Project** is now assigned.

### Options

**Option A (Extend):** Add new agent + data source to class project
- Add a new domain (recipes, legal docs, code snippets)
- Implement a specialized agent for that domain
- Integrate with existing selector

**Option B (From Scratch):** Build RAG system for your own domain
- Choose a problem you care about
- Design the full pipeline
- Build end-to-end

### Deliverables
- Working RAG application
- README documentation
- 5-7 minute demo video
- GitHub repository

### Today's Goals
1. Choose your path (A or B)
2. Define your data source
3. Sketch your architecture
4. Set up project structure

---

## Day 37: Implementation - Data Pipeline

**Time:** 120 min | **Type:** Project

### Focus
Build the data ingestion pipeline.

### Checklist
- [ ] Data source identified and accessible
- [ ] Scraping/loading script working
- [ ] Chunking strategy chosen and implemented
- [ ] Text sanitization in place

### Tips
- Start with a small dataset to test the pipeline
- Verify chunks look reasonable before embedding
- Log everything for debugging

---

## Day 38: Implementation - Vector Storage

**Time:** 120 min | **Type:** Project

### Focus
Get documents into your vector database.

### Checklist
- [ ] Embeddings generating correctly
- [ ] Vectors uploading to Pinecone (or your chosen DB)
- [ ] Metadata structured for filtering
- [ ] Basic query returning results

### Tips
- Test retrieval with known queries
- Check similarity scores make sense
- Verify metadata is searchable

---

## Day 39: Implementation - Agent

**Time:** 120 min | **Type:** Project

### Focus
Build the agent that uses your RAG pipeline.

### Checklist
- [ ] Agent prompt written
- [ ] Retrieval integrated
- [ ] Response generation working
- [ ] Basic conversation flow tested

### Tips
- Start with a simple prompt, iterate
- Test edge cases (no results, ambiguous queries)
- Add reranking if retrieval quality needs improvement

---

## Day 40: Implementation - Polish

**Time:** 120 min | **Type:** Project

### Focus
Refine and improve your implementation.

### Checklist
- [ ] Error handling in place
- [ ] Edge cases covered
- [ ] Response quality improved
- [ ] Code cleaned up

### Also: Submit Assignment 4
**SQL Agent** is due today.
- [Video Submission](https://form.typeform.com/to/QR9Vohg0)
- [Code Submission](https://form.typeform.com/to/FNEjXTwk)

---

## Day 41: Documentation + Testing

**Time:** 90 min | **Type:** Project

### Focus
Document your project and add tests.

### Checklist
- [ ] README written with setup instructions
- [ ] Architecture documented
- [ ] Key decisions explained
- [ ] Basic tests added

### README Template
```markdown
# Project Name

## What it does
[One paragraph]

## Architecture
[Diagram or description]

## Setup
[Step-by-step instructions]

## Usage
[How to run it]

## Key Decisions
[Why you made the choices you made]
```

---

## Day 42: REST

Take a break before recording.

---

## Day 43: Demo Prep

**Time:** 90 min | **Type:** Project

### Focus
Prepare for your demo video.

### Prep Checklist
- [ ] Demo script written
- [ ] Key features identified
- [ ] Example queries prepared
- [ ] Edge cases to show selected

### Demo Structure (5-7 minutes)
1. **Problem** (30 sec): What problem does this solve?
2. **Architecture** (1 min): How is it built?
3. **Demo** (3-4 min): Show it working
4. **Learnings** (1 min): What did you learn?
5. **Future** (30 sec): What would you add?

---

## Day 44: Demo Video Recording

**Time:** 120 min | **Type:** Project

### Focus
Record your demo video.

### Recording Tips
- Practice once before recording
- Show happy path AND edge cases
- Speak to the camera like a colleague
- It's okay to do multiple takes

### Technical Setup
- Screen recording with audio
- Clean desktop, hide notifications
- Use a quiet environment
- Test audio levels first

---

## Day 45: Final Submission + MCP Bonus

**Time:** 60 min | **Type:** Wrap-up

### Submissions Due

**Assignment 5: Capstone**
- [Final Video](https://form.typeform.com/to/SF6b6edL)
- [Code Submission](https://form.typeform.com/to/TXjlfrlr)

### Final Checklist
- [ ] Code pushed to GitHub
- [ ] README complete
- [ ] Demo video uploaded
- [ ] Submission forms filled

### Bonus: MCP Integration (Optional)

If you finish early, explore Module 19: MCP Integration

1. [MCP Fundamentals](../19-mcp-integration/) - Protocol concepts
2. Build an MCP server exposing your RAG system
3. Connect to Claude Code or Inspector

This is bonus content - skip if you're tight on time.

---

## Week 6 Checklist

- [ ] Capstone project chosen
- [ ] Data pipeline built
- [ ] Agent implemented
- [ ] Documentation written
- [ ] Demo video recorded
- [ ] Final submission complete
- [ ] Course complete!

---

## Congratulations!

You've completed the RAG & AI Agents curriculum.

**What you've built:**
- Vector embeddings and similarity search
- Document chunking and ingestion pipelines
- Agent architecture and routing
- RAG implementation with reranking
- Testing strategies for LLM applications
- A complete capstone project

**Next steps:**
- Apply these skills at work
- Build more RAG applications
- Explore advanced topics (LangGraph, MCP)
- Help others learn

Good luck!
