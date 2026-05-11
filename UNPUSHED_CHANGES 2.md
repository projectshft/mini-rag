# Curriculum Changes

## Latest Changes - April 20, 2026

### Assignment 1 Fix: Remove Solutions Before Assignment

**Problem:** Assignment 1 asks students to "Complete the TODOs" but solutions were revealed in the lessons BEFORE the assignment, undermining the learning experience.

**Changes:**
- ✅ **Removed solution from `5-document-upload/2-building-the-api-route.md`** - Deleted "Challenge Solution" section (78 lines)
- ✅ **Removed solutions from `5-document-upload/3-querying-documents.md`** - Deleted "Video Solution Walkthrough" and "Complete Solution" sections
- ✅ **Updated SQL agent "What's Next"** - Now points to Capstone (not draft Agent Patterns module)
- ✅ **Added draft module warnings to CLAUDE.md** - Modules 10 (AI Frameworks) and 16 (Agent Patterns) marked as draft
- ✅ **Added curriculum alignment checklist to CLAUDE.md** - Process for verifying changes
- ✅ **Regenerated all HTML files** - 21 files updated

**Commit:** fce5939 - "Remove solutions before Assignment 1 + mark draft modules"

### Capstone Use Case Guidance + Graceful Degradation

**Problem:** Students need help identifying high-ROI use cases, and curriculum lacked production resilience content.

**Changes:**
- ✅ **Added "Finding Your Use Case" to Capstone** - Practical guidance for identifying real problems
  - "10x Question" framework: "What takes 10 minutes that should take 10 seconds?"
  - Real student examples (internal docs, recipes, legal research, etc.)
  - Where to look: work, personal projects, open data
- ✅ **NEW: Graceful Degradation lesson** (`7-agent-architecture/5-graceful-degradation.md`)
  - Model fallback chains
  - Provider redundancy (with embedding dimension warnings)
  - Circuit breaker pattern implementation
  - Error classification (retryable vs permanent)
  - User communication during degradation
- ✅ **Added "Think Beyond the Exercise"** to document upload module
  - Open-ended questions about scale, updates, quality, cost
  - No assignment, just prompts for deeper thinking

**Commit:** 4d29718 - "Add use case guidance, graceful degradation lesson, and open-ended thinking"

### Files Changed (April 20, 2026)

| File | Changes |
|------|---------|
| `curriculum/5-document-upload/2-building-the-api-route.md` | Removed solution + added "Think Beyond the Exercise" |
| `curriculum/5-document-upload/3-querying-documents.md` | Removed "Video Solution Walkthrough" + "Complete Solution" sections |
| `curriculum/15-sql-agent/1-rag-without-vectors.md` | "What's Next" now points to Capstone |
| `curriculum/15-sql-agent/1-rag-without-vectors.html` | **NEW** - generated HTML |
| `CLAUDE.md` | Added draft module warnings + curriculum alignment checklist |
| `curriculum/17-capstone-project/1-final-project.md` | Added "Finding Your Use Case" section |
| `curriculum/7-agent-architecture/5-graceful-degradation.md` | **NEW** - Production resilience lesson |
| + 15 other HTML files | Regenerated from markdown |

### Draft Modules (Do Not Reference)

These modules are in draft state and should NOT be referenced from other curriculum:
- `10-ai-frameworks/` - LangGraph content
- `16-agent-patterns/` - Agent patterns content

---

## Previous Changes - April 17, 2026

### Summary

- ✅ **Removed student-starter branch** - No longer needed (curriculum branch is the reference)
- ✅ **Removed duplicate modules** - Deleted 4-pinecone-integration and 4.5-chunking-fundamentals
- ✅ **Updated CLAUDE.md** - Reflects new 2-branch structure (curriculum + student-todo-exercises)
- Previously: Removed all "module" and "week" references from curriculum
- Previously: Created new assignment structure (5 submissions: 4 assignments + capstone)
- Previously: Moved SQL Agent to standalone module (15-sql-agent)
- Previously: Renumbered modules: agent-patterns (16), capstone (17), interview-prep (18)
- Assignment 4 uses killer_agents repo `sql-agent` branch

## Branch Structure (Current)

```
curriculum              - Complete working implementations (main reference)
student-todo-exercises  - TODOs for students to implement
```

**Deleted branches:**
- student-starter (April 17, 2026) - Was duplicate of student-todo-exercises with TODOs

## Module Structure (Current - Clean, No Duplicates)

```
0-how-to-learn
1-intro-to-rag
2-vector-math-basics
3-pinecone-integration      ← ONLY version (deleted 4-pinecone-integration)
4-chunking-fundamentals     ← ONLY version (deleted 4.5-chunking-fundamentals)
5-document-upload
6-fine-tuning
7-agent-architecture
8-linkedin-agent
9-rag-agent
10-ai-frameworks
11-chat-interface
12-observability
13-testing-agents           - LLM-as-judge (no more SQL assignment here)
14-tool-calling-exploration - Tool-calling patterns
15-sql-agent                - SQL Agent assignment (Assignment 4)
16-agent-patterns           - (was 15)
17-capstone-project         - (was 16)
18-interview-prep           - (was 17)
99-cheat-codes
```

## Recently Changed Files (April 17, 2026)

| File | Changes |
|------|---------|
| CLAUDE.md | Complete rewrite: removed student-starter references, updated to curriculum + student-todo-exercises structure, added full module list (0-18) |
| curriculum/4-pinecone-integration/ | **DELETED** (duplicate of 3-pinecone-integration) |
| curriculum/4.5-chunking-fundamentals/ | **DELETED** (duplicate of 4-chunking-fundamentals) |

## Previously Modified Files

| File | Changes |
|------|---------|
| curriculum/15-sql-agent/1-rag-without-vectors.md | NEW: SQL Agent assignment module |
| curriculum/ASSIGNMENTS.md | NEW: Overview of all 5 assignments |
| curriculum/9-rag-agent/3-sparse-dense-vectors.md | Renumbered from 4 |
| curriculum/13-testing-agents/2-llm-as-judge.md | Removed SQL assignment, added test creation challenge |
| curriculum/14-tool-calling-exploration/2-the-reveal.md | Added extension challenge, fixed outdated "next up" reference |

## killer_agents Repo

New `sql-agent` branch created with:
- Stripped trendResearchAgent and videoFinderAgent
- TODO version of databaseSearchAgent for students to implement
- Simplified README focused on SQL agent assignment

## Assignment 4 Video Topic

Students should cover:
1. Types of SQL queries (filtering, aggregation, joins, full-text)
2. pgvector - Postgres extension for vector search
3. When to use pgvector vs dedicated vector DBs

## Interview Prep Assessment (18-interview-prep)

**Status**: ✅ Good scope - not overly verbose

**Required deliverables:**
- Module 1: 1 written story + 1 video (signature story)
- Module 2: 5 written opinions + 1 video (strongest opinion)
- Module 3: 3 written system designs + 1 video walkthrough
- Module 4: Optional extra practice (3 videos + self-assessments)

**Total required**: 3 videos, 9 written pieces (~2,500 lines total)
**Assessment**: Appropriate workload, focused on practical interview skills

## All Changes Pushed

All changes have been committed and pushed to the curriculum branch.

**April 20, 2026:**
- Commit: 8f6a279 - "Fix broken OpenAI embeddings documentation links"
- Commit: ed607aa - "Regenerate HTML for curriculum updates"
- Commit: 4d29718 - "Add use case guidance, graceful degradation lesson, and open-ended thinking"
- Commit: fce5939 - "Remove solutions before Assignment 1 + mark draft modules"

**April 17, 2026:**
- Commit: d167663 - "Remove duplicate curriculum modules and update documentation"
- Branch deletions: student-starter (local and remote)
