## Capstone Project: Build Your RAG System

For your capstone, you have two options:

**Option A:** Extend the existing RAG project by adding a new data source and agent

**Option B:** Build your own RAG system from scratch

Both options are equally valid. Choose what excites you most.

---

## Flexibility & Experimentation

We encourage you to experiment! You are not limited to the tools we used in class:

- **Any programming language** - Python, Go, Rust, Java, whatever you prefer
- **Any vector database** - Pinecone, Qdrant, Weaviate, Chroma, pgvector, etc.
- **Any LLM provider** - OpenAI, Anthropic, Cohere, local models, etc.
- **Any framework** - LangChain, LlamaIndex, Haystack, or build from scratch

**The only requirement:** Document your choices and explain why you made them.

---

## Week 4: Project Proposal

Before building, submit a proposal outlining your plan.

**Video Assignment:** Record a **2-3 minute video** explaining your project plan.

**Your proposal should cover:**

1. **Project Scope:**
   - Are you extending the class project or building from scratch?
   - What problem are you solving?

2. **Data Source:**
   - What data will you use? (articles, docs, posts, etc.)
   - Where will you get it? (public API, scraping, dataset)
   - Why did you choose this data?

3. **Technical Choices:**
   - What language/framework are you using?
   - What vector database did you choose and why?
   - What LLM provider are you using?
   - Any other libraries or tools you're experimenting with?

4. **Chunking Strategy:**
   - How will you chunk this content?
   - What chunk size and overlap make sense?
   - Any special considerations for this data type?

5. **Architecture:**
   - How will your system work at a high level?
   - If using agents, how will routing work?

**Submit Your Proposal:**
- [Video Submission - Week 4](https://form.typeform.com/to/Z9JApCkF)
- [Code Submission - Week 4](https://form.typeform.com/to/DXPyafyJ) (include link to proposal doc or notes)

**Due:** Before starting implementation

---

## Requirements

### Core Requirements (All Projects)
- Working RAG system that retrieves relevant context and generates responses
- Proper chunking strategy for your data
- Vector embeddings stored in a vector database
- Working demo with example queries

### If Extending the Class Project
- Add one new data source
- Create a new vector index for this data
- Add one new agent responsible for the new data source
- Update routing so the correct agent is selected

### If Building From Scratch
- Document your architecture decisions
- Explain why you chose your tech stack
- Show how your system handles retrieval and generation

---

### Documentation
Your `README.md` must explain:
- What your project does
- Your tech stack and why you chose it
- How to run the project
- Your chunking strategy
- Example queries and expected behavior

---

## Week 5: Final Submission

**Video Assignment:** Record a **3-5 minute video** demonstrating your completed RAG system.

**Your video should show:**
1. Your RAG system in action
2. Your data source and how you collected/processed it
3. Example queries demonstrating retrieval quality
4. Brief explanation of your technical choices
5. Any challenges you faced and how you solved them

**Submit Your Final Project:**
- [Video Submission - Week 5](https://form.typeform.com/to/SF6b6edL)
- [Code Submission - Week 5](https://form.typeform.com/to/TXjlfrlr) (include GitHub repo link)

---

## Evaluation Criteria
- Correct use of embeddings and chunking
- Working retrieval and generation pipeline
- Clean, readable code
- Clear explanation of design decisions
- Working demo with example queries
- Thoughtful documentation of technical choices

---

### Guiding Principle
> **Build something that works. Explain your choices. Show us what you learned.**
