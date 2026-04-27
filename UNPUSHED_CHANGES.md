# Site Update - April 27, 2026

## Files to Update (Copy-Paste List)

```
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/0-how-to-learn
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/1-intro-to-rag
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/2-vector-math-basics
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/3-pinecone-integration
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/4-chunking-fundamentals
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/5-document-upload
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/6-fine-tuning
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/7-agent-architecture
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/8-linkedin-agent
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/9-rag-agent
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/11-chat-interface
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/12-observability
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/13-testing-agents
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/14-tool-calling-exploration
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/15-sql-agent
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/17-capstone-project
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/18-interview-prep
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/99-cheat-codes
https://github.com/projectshft/mini-rag/tree/curriculum/curriculum/ASSIGNMENTS.md
```

**Skip (Draft):** 10-ai-frameworks, 16-agent-patterns

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
   - 0-how-to-learn/1-feynman-technique.md
   - 7-agent-architecture/5-graceful-degradation.md
   - 14-tool-calling-exploration/ (new module)
   - 17-capstone-project - "Finding Your Use Case" section
   - 9-rag-agent/sparse-dense-presentation.html

### MEDIUM-IMPACT

- Fix select-agent to use `responses.parse` pattern
- Fix tool-calling route for AI SDK v5
- Fix LLM-as-judge test
- Fix broken OpenAI documentation links
- Remove internal navigation references

### LOW-IMPACT

- Removed outdated "Our Learning Path" from intro
- Added curriculum-guide.txt
- Added hybrid-search-demo.ts script

---

## Commit History

**April 26-27:** Hybrid search demo, curriculum cleanup, removed learning path
**April 20-23:** Link fixes, graceful degradation, solutions removed, HTML regeneration
**April 17-18:** Removed duplicate modules, chunking fixes
**April 4-11:** New assignment structure, module/week references removed
**March 26-30:** Helicone → LangSmith, curriculum reorder, link fixes
**March 17-25:** Feynman technique, tool-calling, LLM-as-judge, code fixes
