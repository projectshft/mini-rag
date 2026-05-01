# Site Update - May 1, 2026

## Files to Update (Copy-Paste List)

```
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/0-how-to-learn/1-feynman-technique.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/1-intro-to-rag/1-what-is-rag.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/2-vector-math-basics/1-vectors-and-embeddings.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/2-vector-math-basics/2-implementing-similarity.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/2-vector-math-basics/3-word-math-fun.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/3-pinecone-integration/1-setting-up-pinecone-client.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/4-chunking-fundamentals/1-introduction-to-scraping.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/4-chunking-fundamentals/2-understanding-chunking.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/5-document-upload/1-uploading-with-a-script.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/5-document-upload/2-building-the-api-route.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/5-document-upload/3-querying-documents.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/6-fine-tuning/1-fine-tuning-overview.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/6-fine-tuning/2-running-fine-tuning.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/1-understanding-agent-systems.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/2-prompting-for-agents.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/3-implementing-selector-text-based.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/4-upgrading-to-structured-outputs.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/5-graceful-degradation.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/8-linkedin-agent/1-implementing-linkedin-agent.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/9-rag-agent/1-implementing-rag-agent.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/9-rag-agent/2-implementing-reranking.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/9-rag-agent/3-sparse-dense-vectors.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/9-rag-agent/sparse-dense-presentation.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/11-chat-interface/1-understanding-the-interface.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/12-observability/1-integrating-langsmith.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/13-testing-agents/1-testing-selector-agent.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/13-testing-agents/2-llm-as-judge.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/14-tool-calling-exploration/1-tool-calling-concepts.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/14-tool-calling-exploration/2-the-reveal.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/15-sql-agent/1-rag-without-vectors.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/17-capstone-project/1-final-project.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/18-interview-prep/0-overview.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/18-interview-prep/1-your-signature-story.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/18-interview-prep/2-strong-opinions-tradeoffs.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/18-interview-prep/3-rag-system-design.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/18-interview-prep/4-live-practice.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/18-interview-prep/README.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/0-index.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/1-embeddings-and-search.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/2-structured-outputs.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/3-tool-calling.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/4-chunking.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/5-streaming.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/6-human-in-the-loop.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/7-router-agent.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/8-langgraph.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/99-cheat-codes/9-prompt-templates.html
https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/ASSIGNMENTS.html
```

**Skip (Draft):** 10-ai-frameworks, 16-agent-patterns

---

## Student Branch Changes (student-todo-exercises)

- **LinkedIn Agent TODO** - Added missing step about `prompt` parameter (not `messages`)

---

## What Changed (Last 6 Weeks)

### HIGH-IMPACT

1. **New Assignment Structure** - 5 coding assignments (replaced weekly homework)
   - Assignment 1: Document Upload
   - Assignment 2: Selector Agent
   - Assignment 3: RAG Agent
   - Assignment 4: SQL Agent
   - Assignment 5: Capstone

2. **Observability: Helicone → LangSmith** - Complete migration in module 12

3. **Curriculum Reorganization**
   - Deleted: 4-pinecone-integration, 4.5-chunking-fundamentals (duplicates)
   - Moved tool-calling to module 14
   - Renumbered: agent-patterns (16), capstone (17), interview-prep (18)

4. **Solutions Removed** - From document upload module (before Assignment 1)

5. **New Content**
   - 0-how-to-learn/1-feynman-technique.html
   - 7-agent-architecture/5-graceful-degradation.html
   - 14-tool-calling-exploration/ (new module)
   - 17-capstone-project - "Finding Your Use Case" section
   - 9-rag-agent/sparse-dense-presentation.html

### MEDIUM-IMPACT

- Fix select-agent to use `responses.parse` pattern
- Fix tool-calling route for AI SDK v5
- Fix LLM-as-judge test
- Fix broken OpenAI documentation links
- Remove internal navigation references
- **LLM-as-Judge curriculum** - Clarified students implement from scratch (not copy code)
- **Module 13.1** - Fixed "Helicone" → "LangSmith" typo
- **Module 14.2** - Fixed "What's Next" from "Chat Interface" → "SQL Agent"
- **Removed all "Due: Before Assignment X"** - From modules 5, 9, 15
- **Fixed SQL Agent submission links** - Were TBD, now correct Typeform URLs

### LOW-IMPACT

- Removed outdated "Our Learning Path" from intro
- Added curriculum-guide.txt
- Added hybrid-search-demo.ts script

---

## Commit History

**May 1:** Curriculum alignment verification, LLM-as-Judge clarification, What's Next fixes
**April 26-27:** Hybrid search demo, curriculum cleanup, removed learning path
**April 20-23:** Link fixes, graceful degradation, solutions removed, HTML regeneration
**April 17-18:** Removed duplicate modules, chunking fixes
**April 4-11:** New assignment structure, module/week references removed
**March 26-30:** Helicone → LangSmith, curriculum reorder, link fixes
**March 17-25:** Feynman technique, tool-calling, LLM-as-judge, code fixes
