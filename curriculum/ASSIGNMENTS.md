# Assignments

6 assignments over 45 days, one per week.

---

## Assignment Schedule

| # | Name | Assigned | Due | Focus |
|---|------|----------|-----|-------|
| 1 | Document Upload | Day 6 | Day 13 | Chunking + Upload Route |
| 2 | Agent Selector | Day 19 | Day 27 | Structured Outputs |
| 3 | RAG + Reranking | Day 23 | Day 34 | Retrieval Quality |
| 4 | SQL Agent | Day 33 | Day 41 | Alternative Retrieval |
| 5 | Interview Prep | Day 36 | Day 45 | Communication |
| 6 | Capstone | Day 39 | Day 45 | Full Integration |

---

## Assignment 1: Document Upload

**Assigned:** Day 6 | **Due:** Day 13

**Video (3-4 minutes):** Explain chunking strategy tradeoffs for medical records, Confluence docs, and Twitter posts.

**Code:** Complete the TODOs in the ingestion route, then add text sanitization (strip HTML, normalize whitespace, handle special characters, remove boilerplate).

**Files:** `app/api/upload-document/route.ts`, `app/libs/chunking.ts`

**Submit:**
- [Video Submission](https://form.typeform.com/to/NdVcsThQ)
- [Code Submission](https://form.typeform.com/to/A0pGKPqU)

---

## Assignment 2: Agent Selector

**Assigned:** Day 19 | **Due:** Day 27

**Code:** Implement structured output routing with Zod schemas and proper fallbacks.

**Files:** `app/api/select-agent/route.ts`

**Submit:**
- [Code Submission](https://form.typeform.com/to/A0pGKPqU)

---

## Assignment 3: RAG + Reranking

**Assigned:** Day 23 | **Due:** Day 34

**Video (3-4 minutes):** Explain how you evaluate retrieval quality - chunk sizing, retrieval accuracy, similarity thresholds, and metrics.

**Code:** Complete the TODOs in the RAG agent, then add query preprocessing (expand abbreviations, normalize casing, strip filler words).

**Files:** `app/agents/rag.ts`

**Submit:**
- [Video Submission](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission](https://form.typeform.com/to/EWWcsorL)

---

## Assignment 4: SQL Agent

**Assigned:** Day 33 | **Due:** Day 41

**Video (3-4 minutes):** Explain SQL query types (filtering, aggregation, joins, full-text search), pgvector, and when SQL beats dedicated vector DBs.

**Code:** Complete the `databaseSearchAgent` - define Zod schema, build Prisma WHERE clause, implement full agent flow.

**Repo:** Clone `sql-agent` branch from `https://github.com/projectshft/killer_agents.git`

**Files:** `app/agents/databaseSearchAgent.ts`

**Submit:**
- [Video Submission](https://form.typeform.com/to/QR9Vohg0)
- [Code Submission](https://form.typeform.com/to/FNEjXTwk)

---

## Assignment 5: Interview Prep

**Assigned:** Day 36 | **Due:** Day 45

**Videos to Record:**
1. **Signature Story** (2-3 min): Your background and RAG project experience
2. **Technical Deep Dive** (3-4 min): Explain a challenging technical decision
3. **Tradeoff Discussion** (2-3 min): RAG vs fine-tuning, or similar tradeoff

**Submit:**
- [Video Submission](https://form.typeform.com/to/NdVcsThQ)

---

## Assignment 6: Capstone Project

**Assigned:** Day 39 | **Due:** Day 45

Build a complete RAG application for a domain of your choice.

**Option A:** Extend the existing RAG project with a new data source and agent

**Option B:** Build your own RAG system from scratch

**Deliverables:**
- Working RAG application
- README documentation
- 5-7 minute demo video
- GitHub repository

**Proposal Submit:**
- [Proposal Video](https://form.typeform.com/to/Z9JApCkF)
- [Proposal Notes](https://form.typeform.com/to/DXPyafyJ)

**Final Submit:**
- [Final Video](https://form.typeform.com/to/SF6b6edL)
- [Code Submission](https://form.typeform.com/to/TXjlfrlr)

---

## Practice Exercises (Not Graded)

### LLM-as-Judge

**Code:** Implement the LLM-as-judge test pattern to evaluate agent routing quality.

**Files:** `app/agents/__tests__/llm-judge.test.ts`

**Submit:**
- [Code Submission](https://form.typeform.com/to/FNEjXTwk)

---

## Bonus: MCP Integration

**Available:** Day 45 (if time permits)

**Video (3-4 minutes):** Explain what MCP is and why you'd expose RAG over it. Explain it like you're talking to a colleague who hasn't heard of MCP.

**Code:** Get your MCP server running and demonstrate it with at least one client (Inspector, CLI client, or IDE integration).

**Files:** `mcp/rag-server.ts`, `app/lib/rag.ts`

**Bonus Challenge:** Design (don't build) an MCP server for your company. What tools would you expose? What security considerations apply?

**Submit:**
- [Video Submission](https://form.typeform.com/to/YOUR_FORM_ID)
- [Code Submission](https://form.typeform.com/to/YOUR_FORM_ID)
