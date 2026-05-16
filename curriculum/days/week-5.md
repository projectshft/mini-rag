# Week 5: Testing & Tools (Days 29-35)

**Theme:** Production readiness with testing and tool calling

**Assignment:** SQL Agent (Due Day 41)

---

## Day 29: Testing Selector Agent

**Time:** 60 min | **Type:** Hands-on

### Learning Objectives
- Write test cases for agent routing
- Understand deterministic vs probabilistic testing
- Create a test suite for the selector

### Content
1. [Testing Agents](../13-testing-agents/1-testing-agents.md)

### Exercise
Review and extend `app/agents/__tests__/selector.test.ts`:

1. Add test cases for edge cases
2. Test routing to each agent type
3. Verify fallback behavior

### Run Tests
```bash
yarn test:selector
```

### Key Takeaways
- Agent testing is probabilistic (outputs vary)
- Test routing decisions, not exact wording
- Cover happy paths, edge cases, and failures

---

## Day 30: LLM-as-Judge Testing

**Time:** 60 min | **Type:** Hands-on

### Learning Objectives
- Implement LLM-as-Judge pattern
- Evaluate response quality programmatically
- Know when to use LLM evaluation

### Content
1. [LLM as Judge](../13-testing-agents/2-llm-as-judge.md)

### Exercise
Create `app/agents/__tests__/llm-judge.test.ts`:

1. Define evaluation criteria
2. Have LLM rate response quality
3. Set thresholds for pass/fail

### Key Takeaways
- LLM-as-Judge = use LLM to evaluate LLM output
- Good for subjective quality (tone, helpfulness)
- Requires clear rubrics for consistent results

---

## Day 31: Tool Calling Concepts

**Time:** 45 min | **Type:** Read

### Learning Objectives
- Understand function/tool calling pattern
- Know how LLMs decide which tools to use
- Recognize tool calling use cases

### Content
1. [Tool Calling Introduction](../14-tool-calling-exploration/1-introduction.md)
2. [Tool Calling Concepts](../14-tool-calling-exploration/2-concepts.md)

### Key Takeaways
- Tool calling = LLM decides when to call functions
- Define tools with schemas (name, description, parameters)
- LLM returns structured call; you execute and return result

---

## Day 32: Tool Calling Implementation

**Time:** 60 min | **Type:** Hands-on

### Learning Objectives
- Implement tools for an agent
- Handle tool call responses
- Chain multiple tool calls

### Content
1. [Tool Calling Implementation](../14-tool-calling-exploration/3-implementation.md)

### Exercise
Implement a simple tool-calling agent:

1. Define tool schemas
2. Pass tools to OpenAI API
3. Handle tool call responses
4. Execute tool and return result

### Key Takeaways
- Tools extend what agents can do
- Clear descriptions help LLM choose correctly
- Always validate tool parameters

---

## Day 33: SQL Agent

**Time:** 60 min | **Type:** Read + Hands-on

### Learning Objectives
- Build RAG with SQL instead of vectors
- Understand when SQL beats vector search
- Implement database-backed retrieval

### Content
1. [SQL Agent Overview](../15-sql-agent/1-overview.md)
2. [SQL Agent Implementation](../15-sql-agent/2-implementation.md)

### Assignment Assigned
**SQL Agent** is now assigned. See [ASSIGNMENTS.md](../ASSIGNMENTS.md) for details.

**Repo:** Clone `sql-agent` branch from `https://github.com/projectshft/killer_agents.git`

### Key Takeaways
- SQL = structured queries on relational data
- Better for filtering, aggregation, exact matches
- Vector = better for semantic similarity

---

## Day 34: Assignment 4 Work

**Time:** 90 min | **Type:** Assignment

### Focus
Work on Assignment 4: SQL Agent

**Video (3-4 minutes):** Explain SQL query types (filtering, aggregation, joins, full-text search), pgvector, and when SQL beats dedicated vector DBs.

**Code:** Complete the `databaseSearchAgent` - define Zod schema, build Prisma WHERE clause, implement full agent flow.

### Files
- `app/agents/databaseSearchAgent.ts` (in sql-agent repo)

### Also: Submit Assignment 3
**RAG + Reranking** is due today.
- [Video Submission](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission](https://form.typeform.com/to/EWWcsorL)

---

## Day 35: REST (or LangGraph Extension)

Take a break. Week 6 is interview prep and capstone.

**Optional:** If you want deeper agent orchestration coverage, use this day for the LangGraph Extension:

1. [ReAct Agent Quick Start](../10-ai-frameworks/1-react-agent-quick-start.md) (45 min)
2. [LangGraph Concepts](../10-ai-frameworks/2-langgraph-concepts.md) (60 min)
3. [Custom State Graphs](../10-ai-frameworks/3-custom-state-graphs.md) (90 min)

LangGraph is recommended if you:
- Need human-in-the-loop workflows
- Want complex branching logic
- Are building multi-agent systems

---

## Week 5 Checklist

- [ ] Selector test suite extended
- [ ] LLM-as-Judge pattern implemented
- [ ] Understand tool calling pattern
- [ ] SQL agent concepts understood
- [ ] Assignment 3 submitted (Due Day 34)
- [ ] Assignment 4 in progress (Due Day 41)
- [ ] (Optional) LangGraph extension completed
