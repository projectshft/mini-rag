# Site Update - June 11, 2026

Delta since the last site update (May 1, 2026). Publish the lesson HTML to the
day it belongs to. **Never publish the schedule** (STUDY-PLAN, DAY-SCHEDULE,
days/week-*) — those are internal only.

---

## PRIMARY: Fine-tuning deprecation (modules 6 & 8)

OpenAI limited fine-tuning access (May 7, 2026). The course now teaches it as a
concept only — students no longer run the scripts, and the LinkedIn agent uses
**few-shot prompting** instead of a fine-tuned model.

| Day | Lesson HTML |
|-----|-------------|
| Day 12 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/6-fine-tuning/1-fine-tuning-overview.html |
| Day 13 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/6-fine-tuning/2-running-fine-tuning.html |
| Day 20 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/8-linkedin-agent/1-implementing-linkedin-agent.html |

What changed:
- Module 6 page 1 — adds the deprecation notice + "Why Learn This If It's
  Deprecated?" section ("context is all you really need"; other providers still
  offer it). Removes "run the fine-tuning script" / "build the LinkedIn agent
  that uses this fine-tuned model."
- Module 6 page 2 — scripts reframed as historical artifacts.
- Module 8 — LinkedIn agent rewritten to use few-shot prompting (real example
  posts in the prompt); redundant fine-tuned-models link removed; wording polished.

---

## Other lessons that changed (publish to their day)

| Day | Lesson HTML |
|-----|-------------|
| Day 1  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/1-intro-to-rag/1-what-is-rag.html |
| Day 2  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/2-vector-math-basics/1-vectors-and-embeddings.html |
| Day 3  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/2-vector-math-basics/2-implementing-similarity.html |
| Day 4  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/2-vector-math-basics/3-word-math-fun.html |
| Day 5  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/3-pinecone-integration/1-setting-up-pinecone-client.html |
| Day 6  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/4-chunking-fundamentals/1-introduction-to-scraping.html |
| Day 8  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/4-chunking-fundamentals/2-understanding-chunking.html |
| Day 9  | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/5-document-upload/1-uploading-with-a-script.html |
| Day 10 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/5-document-upload/2-building-the-api-route.html |
| Day 11 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/5-document-upload/3-querying-documents.html |
| Day 15 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/1-understanding-agent-systems.html |
| Day 16 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/2-prompting-for-agents.html |
| Day 17 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/3-implementing-selector-text-based.html |
| Day 18 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/7-agent-architecture/4-upgrading-to-structured-outputs.html |
| Day 22 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/9-rag-agent/1-implementing-rag-agent.html |
| Day 23 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/9-rag-agent/2-implementing-reranking.html |
| Day 24 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/9-rag-agent/3-sparse-dense-vectors.html (heavily rewritten to match video) |
| Day 25 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/11-chat-interface/1-understanding-the-interface.html |
| Day 26 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/12-observability/1-integrating-langsmith.html |
| Day 29 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/13-testing-agents/1-testing-selector-agent.html |
| Day 30 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/13-testing-agents/2-llm-as-judge.html |
| Day 32 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/14-tool-calling-exploration/2-the-reveal.html |
| Day 34 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/20-security/1-llm-rag-security.html (new module — includes hands-on prompt-injection challenge) |
| Day 36 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/17-capstone-project/1-final-project.html |
| Day 42 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/10-ai-frameworks/2-langgraph-concepts.html |
| Day 42 | https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/10-ai-frameworks/3-custom-state-graphs.html |

Also updated:
- https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/ASSIGNMENTS.html
- https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/AI-REFERENCE.html

---

## New content NOT yet placed on a day

These lessons changed/are new but aren't in the day schedule yet — confirm the
day before publishing:

- https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/14-tool-calling-exploration/3-mcp-basics.html (new)
- https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/10-ai-frameworks/1-react-agent-quick-start.html (new; replaces deleted intro)
- **New module 19 — MCP integration:**
  - https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/19-mcp-integration/1-what-is-mcp.html
  - https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/19-mcp-integration/1-exposing-rag-over-mcp.html
  - https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/19-mcp-integration/2-building-mcp-server.html
- **Module 18 interview-prep** pages 1-4 updated (no longer in the Week 6 plan)

(Module 20 — Security is now scheduled on Day 34, see the table above.)

---

## Deletions (remove from site if currently published)

- https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/10-ai-frameworks/1-introduction-to-langgraph.html → replaced by `1-react-agent-quick-start.html`
- https://github.com/projectshft/mini-rag/blob/curriculum/curriculum/10-ai-frameworks/2-building-langgraph-agent.html → replaced by `2-langgraph-concepts.html` + `3-custom-state-graphs.html`

---

## Still draft — do NOT publish

- `16-agent-patterns/*` (all three pages marked DRAFT)

---

_Previous full-site list (May 1, 2026) is in git history: `git show f9c8577:UNPUSHED_CHANGES.md`._
