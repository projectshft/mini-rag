# Curriculum Changes - April 17, 2026

## Summary

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

All changes have been committed and pushed to the curriculum branch as of April 17, 2026.

- Commit: d167663 - "Remove duplicate curriculum modules and update documentation"
- Branch deletions: student-starter (local and remote)
