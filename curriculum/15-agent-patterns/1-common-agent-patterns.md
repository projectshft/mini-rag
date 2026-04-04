# Common Agent Patterns

As you build AI agents, you'll encounter recurring challenges and solutions. Understanding these patterns helps you choose the right approach for your use case.

---

## Pattern 1: Workflow Agents

**What it is:**
A fixed sequence of steps that always executes in the same order.

**Example:**

```
Query → Embed → Search → Rerank → Generate
```

**You've built this:** Your RAG agent

**When to use:**

- Every query needs the same process
- Predictable, deterministic behavior required
- Cost-sensitive (no decision overhead)
- Single-purpose agents

**Characteristics:**

- ✅ Simple and predictable
- ✅ Fast execution
- ✅ Lower cost per request
- ❌ No branching logic
- ❌ Can't skip unnecessary steps

---

## Pattern 2: Router Agents

**What it is:**
An agent that routes requests to specialized sub-agents based on intent.

**Example:**

```
Query → Analyze Intent → Route to:
  - RAG Agent (technical questions)
  - LinkedIn Agent (content creation)
  - General Agent (casual chat)
```

**You've built this:** Your selector agent

**When to use:**

- Multiple capabilities in one system
- Different queries need different handling
- Want specialized agents for specific tasks

**Characteristics:**

- ✅ Modular and maintainable
- ✅ Each agent can be optimized independently
- ✅ Clear separation of concerns
- ⚠️ Requires good routing logic
- ⚠️ Extra latency from routing step

---

## Pattern 3: Human-in-the-Loop (HITL)

**What it is:**
Agent pauses execution to request human approval or input before proceeding.

**Example:**

```
Query → Plan Action → Request Approval → Execute (if approved)
```

**Common use cases:**

- Destructive operations (delete, update database)
- High-stakes decisions (financial transactions)
- Content moderation (publish/reject)
- Compliance requirements (legal review)

**When to use:**

- Actions are irreversible
- Mistakes are costly
- Human judgment is required
- Regulatory compliance needed

**Characteristics:**

- ✅ Safety for critical operations
- ✅ Human oversight on important decisions
- ✅ Audit trail of approvals
- ❌ Slower (requires human response)
- ❌ Can't run fully automated

---

## Pattern 4: Tool-Calling Agents

**What it is:**
AI decides when and which tools to use based on the query.

**Example:**

```
Query → AI Decides:
  - Need docs? → Call search_documentation tool
  - Need calculation? → Call calculator tool
  - Simple question? → Answer directly
```

**When to use:**

- Query-dependent logic
- Multiple tools available
- Want intelligent resource allocation
- Cost optimization (skip unnecessary calls)

**Characteristics:**

- ✅ AI makes decisions dynamically
- ✅ Can skip expensive operations
- ✅ Flexible and intelligent
- ⚠️ Extra LLM call for decision
- ⚠️ Less predictable behavior

---

## Pattern 5: Iterative Refinement

**What it is:**
Agent evaluates its own output and refines until quality threshold is met.

**Example:**

```
Query → Generate → Evaluate Quality:
  - Good enough? → Return result
  - Not good enough? → Search more context → Generate again
```

**You've seen this:** Your LangGraph agent from Module 10 (optional)

**When to use:**

- Quality is more important than speed
- Results need validation
- Research or analysis tasks
- Complex problems requiring iteration

**Characteristics:**

- ✅ Higher quality results
- ✅ Self-correcting
- ✅ Can handle complex queries
- ❌ Slower execution
- ❌ Higher cost (multiple LLM calls)
- ❌ Need max iteration limits

---

## Pattern 6: Multi-Step Orchestration

**What it is:**
Agent breaks complex tasks into steps, executing them sequentially or in parallel.

**Example:**

```
"Write a blog post about React hooks"
  ↓
Step 1: Research hooks (search docs)
Step 2: Find code examples (search GitHub)
Step 3: Draft outline
Step 4: Write introduction
Step 5: Write examples section
Step 6: Write conclusion
```

**When to use:**

- Complex, multi-part tasks
- Need intermediate results
- Tasks can be decomposed
- Want transparency into progress

**Characteristics:**

- ✅ Handles complex workflows
- ✅ Can run steps in parallel
- ✅ Clear progress tracking
- ❌ More complex to build
- ❌ Requires careful orchestration

---

## Comparing Patterns

| Pattern          | Speed  | Cost    | Complexity | Control            | Use Case                     |
| ---------------- | ------ | ------- | ---------- | ------------------ | ---------------------------- |
| **Workflow**     | Fast   | Low     | Simple     | Fixed              | Single-purpose, predictable  |
| **Router**       | Medium | Medium  | Medium     | Branching          | Multi-capability systems     |
| **HITL**         | Slow\* | Low     | Medium     | Human approval     | Critical/destructive actions |
| **Tool-Calling** | Medium | Medium+ | Medium     | AI decides         | Query-dependent logic        |
| **Iterative**    | Slow   | High    | High       | Self-correcting    | Quality-critical tasks       |
| **Multi-Step**   | Slow   | High    | High       | Full orchestration | Complex workflows            |

\*HITL is slow because it waits for human response

---

## Combining Patterns

Real-world agents often combine multiple patterns:

**Example: Content Publishing System**

```
Router (route by intent)
  ↓
Tool-Calling (decide if research needed)
  ↓
Workflow (generate content)
  ↓
HITL (human approval before publishing)
```

**Example: Research Assistant**

```
Router (route to research vs chat)
  ↓
Iterative Refinement (search → evaluate → search again)
  ↓
Multi-Step (break research into subtopics)
  ↓
Workflow (generate final report)
```

---

## Choosing the Right Pattern

Ask yourself:

1. **Is every query handled the same way?**
    - Yes → Workflow
    - No → Router or Tool-Calling

2. **Are actions reversible?**
    - No → HITL
    - Yes → Proceed without approval

3. **Is quality more important than speed?**
    - Yes → Iterative Refinement
    - No → Workflow

4. **Is the task complex and multi-part?**
    - Yes → Multi-Step Orchestration
    - No → Simpler pattern

5. **Do you need AI to decide when to act?**
    - Yes → Tool-Calling
    - No → Fixed Workflow

---

## What's Next?

In the next lesson, we'll compare:

- **Workflow agents** (what you've already built)
- **Human-in-the-loop agents** (what you'll build next)

Understanding the tradeoffs will help you choose the right pattern for your use case.
