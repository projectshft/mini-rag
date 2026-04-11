# Unpushed Curriculum Changes

## Summary

- Removed all "module" and "week" references from curriculum
- Created new assignment structure (5 submissions: 4 assignments + capstone)
- Moved SQL Agent to standalone module (15-sql-agent)
- Renumbered modules: agent-patterns (16), capstone (17), interview-prep (18)
- Assignment 4 uses killer_agents repo `sql-agent` branch

## Module Structure

```
13-testing-agents     - LLM-as-judge (no more SQL assignment here)
14-tool-calling-exploration - Tool-calling patterns
15-sql-agent          - NEW: SQL Agent assignment (Assignment 4)
16-agent-patterns     - (was 15)
17-capstone-project   - (was 16)
18-interview-prep     - (was 17)
```

## New Files

- curriculum/15-sql-agent/1-rag-without-vectors.md
- curriculum/ASSIGNMENTS.md (overview of all 5 assignments)

## Modified Files

| File | Changes |
|------|---------|
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
