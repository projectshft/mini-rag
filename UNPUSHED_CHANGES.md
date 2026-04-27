# Curriculum Changes - Site Update Summary

**Last site update:** ~6 weeks ago (mid-March 2026)
**This document:** Summary of all changes since then for site republishing

---

## HIGH-IMPACT CHANGES (Affect Student Experience)

### 1. New Assignment Structure
**Changed from weekly homework to 5 coding assignments:**
- Assignment 1: Document Upload (complete TODOs)
- Assignment 2: Selector Agent (structured outputs)
- Assignment 3: RAG Agent (reranking)
- Assignment 4: SQL Agent (uses killer_agents repo, sql-agent branch)
- Assignment 5: Capstone Project

**Files:**
- `curriculum/ASSIGNMENTS.md` - NEW overview of all assignments
- All module files updated to remove "Week N" / "Module N" references

### 2. Observability: Helicone → LangSmith
**Replaced Helicone with LangSmith throughout:**
- `curriculum/12-observability/1-integrating-langsmith.md` - Complete rewrite
- Video walkthrough added
- New env vars: LANGSMITH_TRACING, LANGSMITH_ENDPOINT, LANGSMITH_API_KEY, LANGSMITH_PROJECT

### 3. Curriculum Reorganization
**Module changes:**
- Deleted `4-pinecone-integration/` (duplicate of 3-pinecone-integration)
- Deleted `4.5-chunking-fundamentals/` (duplicate of 4-chunking-fundamentals)
- Moved tool-calling to module 14 (after testing)
- Renumbered: agent-patterns (16), capstone (17), interview-prep (18)
- `9-rag-agent/3-sparse-dense-vectors.md` renumbered from 4

### 4. Solutions Removed Before Assignments
**To preserve learning experience:**
- Removed "Challenge Solution" from `5-document-upload/2-building-the-api-route.md`
- Removed "Video Solution Walkthrough" and "Complete Solution" from `5-document-upload/3-querying-documents.md`

### 5. New Content Added
- `curriculum/0-how-to-learn/1-feynman-technique.md` - Learning strategies
- `curriculum/7-agent-architecture/5-graceful-degradation.md` - Model fallbacks, retries, user messaging
- `curriculum/17-capstone-project/1-final-project.md` - Added "Finding Your Use Case" section with 10x Question framework
- `curriculum/14-tool-calling-exploration/` - Tool calling concepts and implementation

---

## MEDIUM-IMPACT CHANGES

### Code Fixes
- Fix select-agent to use `responses.parse` pattern
- Fix tool-calling route for AI SDK v5
- Fix LLM-as-judge test to use working structured output pattern
- Fix metadata field handling ('text' standard, 'content' fallback)
- Fix chunking and overlap issues

### Documentation Fixes
- Fix broken OpenAI embeddings documentation links
- Fix broken links across curriculum
- Remove internal navigation references
- Add topN configuration comments to reranking

### New Demo Scripts
- `app/scripts/exercises/hybrid-search-demo.ts` - Sparse + dense vectors demo
  - Creates hybrid index, uploads with both vector types, compares search modes
  - Available on both curriculum and student-todo-exercises branches
- `curriculum/9-rag-agent/sparse-dense-presentation.html` - Visual presentation

---

## LOW-IMPACT CHANGES

### Cleanup
- Removed outdated "Our Learning Path" from intro (listed 10 topics, actual curriculum has 19)
- Added `curriculum-guide.txt` for assistant reference
- Added draft module warnings to CLAUDE.md (modules 10, 16 are draft)
- Added curriculum alignment checklist to CLAUDE.md

### Experimental (Not in main curriculum)
- CLAP music search notebook (Weaviate) - in notebooks/
- Fine-tuning training scripts updates

---

## FILES CHANGED (Curriculum - need HTML regeneration)

### New Files
```
curriculum/ASSIGNMENTS.md
curriculum/0-how-to-learn/1-feynman-technique.md
curriculum/7-agent-architecture/5-graceful-degradation.md
curriculum/9-rag-agent/sparse-dense-presentation.html
curriculum/14-tool-calling-exploration/1-tool-calling-concepts.md
curriculum/14-tool-calling-exploration/2-the-reveal.md
app/scripts/exercises/hybrid-search-demo.ts
curriculum-guide.txt
```

### Modified Files
```
curriculum/1-intro-to-rag/1-what-is-rag.md (removed learning path)
curriculum/5-document-upload/2-building-the-api-route.md (removed solution)
curriculum/5-document-upload/3-querying-documents.md (removed solutions)
curriculum/9-rag-agent/3-sparse-dense-vectors.md (renumbered, added demo)
curriculum/12-observability/1-integrating-langsmith.md (complete rewrite)
curriculum/13-testing-agents/2-llm-as-judge.md (removed SQL assignment)
curriculum/15-sql-agent/1-rag-without-vectors.md (What's Next points to Capstone)
curriculum/17-capstone-project/1-final-project.md (added use case guidance)
+ many others with module/week reference removals
```

### Deleted Files
```
curriculum/4-pinecone-integration/ (entire folder - duplicate)
curriculum/4.5-chunking-fundamentals/ (entire folder - duplicate)
```

---

## BRANCH STATUS

Both branches are pushed and up to date:
- `curriculum` - Complete reference implementations
- `student-todo-exercises` - Starter code with TODOs

---

## DRAFT MODULES (Do Not Publish)

These modules are incomplete and should NOT be published:
- `10-ai-frameworks/` - LangGraph content (draft)
- `16-agent-patterns/` - Agent patterns content (draft)

---

## RECOMMENDED ACTIONS FOR SITE UPDATE

1. **Regenerate all HTML** from markdown files
2. **Update navigation** to reflect new module structure
3. **Remove** any references to deleted modules (4-pinecone-integration, 4.5-chunking-fundamentals)
4. **Add** new files listed above
5. **Verify** LangSmith instructions work (replaced Helicone)
6. **Test** assignment instructions are clear without solutions showing

---

## COMMIT HISTORY (Last 6 Weeks)

### April 26-27, 2026
- Remove outdated "Our Learning Path" section
- Add curriculum-guide.txt
- Add hybrid search demo script
- Move hybrid-search-demo.ts to app/scripts/exercises

### April 20-23, 2026
- Fix broken OpenAI embeddings documentation links
- Add use case guidance, graceful degradation lesson
- Remove solutions before Assignment 1
- Add CLAP music search notebook (experimental)
- Regenerate HTML for curriculum updates

### April 17-18, 2026
- Remove duplicate curriculum modules
- Fix chunking and overlap
- Updates from cohort 2

### April 4-11, 2026
- New assignment structure (5 assignments)
- Restructure assignments, remove module/week references
- Assignment 4: SQL types and pgvector content

### March 26-30, 2026
- Replace Helicone with LangSmith
- Fix broken documentation links
- Reorder curriculum (tool-calling after testing)
- Fix select-agent pattern

### March 17-25, 2026
- Add 4-week program schedule
- Add Feynman technique intro
- Add tool-calling curriculum
- Add LLM-as-judge test
- Fix various code issues
