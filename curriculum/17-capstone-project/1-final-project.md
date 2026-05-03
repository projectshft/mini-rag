# Capstone Project

Build a complete RAG application for a domain of your choice.

---

## Two Options

**Option A:** Extend the existing RAG project by adding a new data source and agent

**Option B:** Build your own RAG system from scratch

Both options are equally valid. Choose what excites you most.

---

## Finding Your Use Case

**This is the highest ROI part of the capstone.** Building a RAG system for a real problem you care about—or one your company faces—can be career-changing.

### Where to Look for Ideas

**At work:**
- Documentation that's hard to search ("Where's the policy on X?")
- Onboarding knowledge that lives in senior engineers' heads
- Support tickets that keep asking the same questions
- Internal wikis that nobody can navigate
- Slack history that contains answers but is impossible to find

**Personal projects:**
- Your notes, journals, or research
- A hobby with lots of documentation (music, games, sports rules)
- Learning a new skill with scattered resources
- Organizing recipes, articles, or bookmarks you've saved

**Open data:**
- Legal documents (case law, contracts, regulations)
- Academic papers in a field you're interested in
- Public company filings (SEC, earnings calls)
- Government data (city council minutes, legislation)
- Product reviews or forum discussions

### The "10x Question"

Ask yourself: **"What takes me 10 minutes to find that should take 10 seconds?"**

That's your RAG use case.

### Real Student Examples

- **Internal docs search** - "Our engineering wiki has 500 pages and no one can find anything"
- **Recipe assistant** - "I have 200 saved recipes and can never remember which one has that technique"
- **Legal research** - "Finding relevant case law takes hours of reading"
- **Course notes** - "I took 3 years of notes but can't search them semantically"
- **API documentation** - "Our API docs are split across 5 repos"

**Don't overthink it.** Pick something you'll actually use after the course ends.

---

## Flexibility & Experimentation

You are not limited to the tools we used in class:

- **Any programming language** - Python, Go, Rust, Java, whatever you prefer
- **Any vector database** - Pinecone, Qdrant, Weaviate, Chroma, pgvector, etc.
- **Any LLM provider** - OpenAI, Anthropic, Cohere, local models, etc.
- **Any framework** - LangChain, LlamaIndex, Haystack, or build from scratch

**The only requirement:** Document your choices and explain why you made them.

---

## Part 1: Project Proposal

Before building, submit a proposal outlining your plan.

### Video Assignment (2-3 minutes)

Record a video explaining your project plan:

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

4. **Chunking Strategy:**
   - How will you chunk this content?
   - What chunk size and overlap make sense?
   - Any special considerations for this data type?

5. **Architecture:**
   - How will your system work at a high level?
   - If using agents, how will routing work?

### Submit Proposal

- [Proposal Video Submission](https://form.typeform.com/to/Z9JApCkF)
- [Proposal Notes](https://form.typeform.com/to/DXPyafyJ)

---

## Part 2: Final Submission

### Requirements

**Core Requirements (All Projects):**
- Working RAG system that retrieves relevant context and generates responses
- Proper chunking strategy for your data
- Vector embeddings stored in a vector database
- Working demo with example queries
- One unique feature not covered in the curriculum

**If Extending the Class Project:**
- Add one new data source
- Create a new vector index for this data
- Add one new agent responsible for the new data source
- Update routing so the correct agent is selected

**If Building From Scratch:**
- Document your architecture decisions
- Explain why you chose your tech stack
- Show how your system handles retrieval and generation

### Documentation

Your `README.md` must explain:
- What your project does
- Your tech stack and why you chose it
- How to run the project
- Your chunking strategy
- Example queries and expected behavior

### Video Assignment (5-7 minutes)

Record a video demonstrating your completed RAG system:

1. **Demo** - Show your RAG system in action with real queries
2. **Data** - Your data source and how you collected/processed it
3. **Retrieval** - Example queries demonstrating retrieval quality
4. **Technical choices** - Brief explanation of your decisions
5. **Challenges** - Any challenges you faced and how you solved them
6. **Unique feature** - Show off the thing that makes your project different

### Submit Final Project

- [Final Video Submission](https://form.typeform.com/to/SF6b6edL)
- [Code Submission](https://form.typeform.com/to/TXjlfrlr) (GitHub repo link)

---

## Evaluation Criteria

- Correct use of embeddings and chunking
- Working retrieval and generation pipeline
- Clean, readable code
- Clear explanation of design decisions
- Working demo with example queries
- Thoughtful documentation of technical choices
- One unique feature that shows creativity

---

## Guiding Principle

> **Build something that works. Explain your choices. Show us what you learned.**
