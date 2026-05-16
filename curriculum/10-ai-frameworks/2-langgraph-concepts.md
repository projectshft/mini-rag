# LangGraph Concepts: Graphs, Nodes & State

In the previous lesson, you built a working agent with `createReactAgent`. Now let's understand **what's happening under the hood** - the graph-based architecture that powers LangGraph.

---

## What You'll Learn

- Core concepts: graphs, nodes, edges, and state
- How `createReactAgent` works internally
- When prebuilt agents aren't enough
- The mental model for custom graph design

---

## What is LangGraph?

**LangGraph** is a low-level orchestration framework for building long-running, stateful AI agents with complex workflows.

### Think of It This Way

**Your current agents (AI SDK):**
```
User Query → Process → Stream Response → Done
```

**LangGraph agents:**
```
User Query → Agent → [Decision Tree]
                ↓
            Tool Call? → Yes → Execute Tool → Loop Back
                ↓
            Need More Info? → Yes → Ask Question → Wait → Resume
                ↓
            Ready to Answer? → Yes → Stream Response
                ↓
            Save State → Can Resume Later
```

---

## Why LangGraph Exists

### The Problem with Simple Workflows

Your current RAG agent follows a fixed path:

```typescript
export async function ragAgent(request: AgentRequest) {
  // Always does these steps in order
  const embedding = await generateEmbedding(request.query);
  const results = await searchVectorDB(embedding);
  const reranked = await rerank(results);
  return streamText({ context: reranked });
}
```

**Limitations:**
- ❌ No branching logic (can't make decisions)
- ❌ No loops (can't retry or refine)
- ❌ No persistence (loses state between requests)
- ❌ No human-in-the-loop (can't pause for approval)
- ❌ Can't handle multi-step tasks that span hours or days

### The LangGraph Solution

```typescript
// LangGraph agent with decision-making
const graph = new StateGraph(StateAnnotation)
  .addNode("analyze_query", analyzeNode)
  .addNode("search_docs", searchNode)
  .addNode("call_api", apiNode)
  .addNode("generate_answer", generateNode)
  .addConditionalEdges("analyze_query", decideNextStep)
  .compile({ checkpointer });

// Can pause, resume, branch, loop, and persist state
```

---

## Core Concepts

### 1. Graph-Based Structure

Your agent is a **directed graph** where:
- **Nodes** = Actions your AI performs
- **Edges** = Connections defining the flow
- **State** = Shared memory accessible to all nodes

```
         ┌─────────┐
    ┌───→│ Node A  │───┐
    │    └─────────┘   │
    │                  ↓
┌───┴────┐      ┌─────────┐
│ Start  │      │ Node B  │──→ End
└───┬────┘      └─────────┘
    │                  ↑
    │    ┌─────────┐   │
    └───→│ Node C  │───┘
         └─────────┘
```

### 2. Nodes

**Nodes are functions** that:
- Receive the current state
- Perform an action (LLM call, tool execution, computation)
- Return updates to the state

```typescript
async function searchNode(state: AgentState) {
  console.log('🔍 Searching for:', state.query);

  const results = await searchDocs(state.query);

  return {
    searchResults: results,
    stepCount: state.stepCount + 1
  };
}
```

### 3. Edges

**Edges connect nodes** and define flow:

**Regular Edges** (deterministic):
```typescript
graph
  .addEdge("start", "search")
  .addEdge("search", "generate")
```

**Conditional Edges** (decision points):
```typescript
function decideNext(state: AgentState) {
  if (state.searchResults.length === 0) {
    return "ask_clarification";
  }
  if (state.confidence < 0.7) {
    return "search_again";
  }
  return "generate_answer";
}

graph.addConditionalEdges("search", decideNext);
```

### 4. State Management

**State is shared memory** that persists throughout the workflow:

```typescript
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right) // Merge strategy
  }),
  query: Annotation<string>(),
  searchResults: Annotation<string[]>(),
  confidence: Annotation<number>(),
  stepCount: Annotation<number>()
});
```

**Key Features:**
- Typed and validated
- Accessible to all nodes
- Can persist across sessions
- Supports custom merge logic (reducers)

---

## LangGraph vs AI SDK: When to Use Each

### Use AI SDK When You Need:

✅ **UI-first applications**
- React/Next.js integration
- Real-time streaming to frontend
- Simple agent interactions

✅ **Rapid prototyping**
- Quick experiments
- Proof of concepts
- Simple workflows

✅ **Linear workflows**
- No branching or loops
- Single-turn interactions
- Stateless operations

**Example Use Cases:**
- Chat interfaces with basic RAG
- Simple Q&A bots
- Content generation tools
- MVP/prototype applications

---

### Use LangGraph When You Need:

✅ **Complex orchestration**
- Branching logic and decision points
- Cyclical workflows (loops, reflection)
- Multi-agent collaboration

✅ **Stateful, long-running processes**
- Workflows spanning hours or days
- Pause and resume capability
- Persistent memory across sessions

✅ **Production-grade reliability**
- Fault tolerance and recovery
- Human oversight and approvals
- Audit trails and observability

✅ **Advanced agent patterns**
- Reflection (self-correction)
- Research and analysis workflows
- Multi-step automation

**Example Use Cases:**
- Customer support with escalation
- Research assistants gathering info over time
- Code generation with validation loops
- Travel booking with multi-step workflows
- Enterprise automation systems

---

## Real-World Comparison

### Scenario: Customer Support Bot

**With AI SDK (Simple):**
```typescript
// Works for basic Q&A
export async function supportAgent(request: AgentRequest) {
  const context = await searchFAQ(request.query);
  return streamText({
    model: openai('gpt-4o'),
    system: `Answer using this context: ${context}`,
    messages: request.messages
  });
}
```

**Limitations:**
- Can't escalate to human agent
- No memory of previous sessions
- Can't handle multi-turn problem solving
- No way to pause for manager approval

**With LangGraph (Production):**
```typescript
const graph = new StateGraph(SupportState)
  .addNode("classify_issue", classifyNode)
  .addNode("search_kb", searchNode)
  .addNode("attempt_resolution", resolveNode)
  .addNode("escalate_to_human", escalateNode)
  .addNode("request_approval", approvalNode)
  .addConditionalEdges("classify_issue", routeByComplexity)
  .addConditionalEdges("attempt_resolution", checkIfResolved)
  .compile({ checkpointer });

// Can:
// ✅ Remember previous interactions
// ✅ Escalate to human agent when stuck
// ✅ Pause for manager approval on refunds
// ✅ Resume from where it left off
// ✅ Loop through different resolution strategies
```

---

## Key LangGraph Features

### 1. Checkpointing (Persistence)

Save agent state at every step:

```typescript
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";

const checkpointer = SqliteSaver.fromConnString(":memory:");
const app = workflow.compile({ checkpointer });

// Every invocation auto-saves progress
const config = { configurable: { thread_id: "user_123" } };
await app.invoke(input, config);

// Later... resume from where it left off
await app.invoke(newInput, config);
```

**Benefits:**
- Fault tolerance (recover from crashes)
- Pause/resume workflows
- Maintain conversation history
- Support long-running processes

### 2. Human-in-the-Loop

Pause execution for human approval:

```typescript
import { interrupt } from "@langchain/langgraph";

async function approvalNode(state: State) {
  const decision = interrupt({
    action: state.proposedAction,
    prompt: "Approve this refund? (yes/no)"
  });

  return { approved: decision === "yes" };
}

// First call pauses at interrupt
const result = await app.invoke(input, config);

// Resume with decision
await app.invoke(Command.resume("yes"), config);
```

**Use Cases:**
- Manager approval workflows
- Safety checks before sensitive actions
- Manual review of AI decisions
- Interactive debugging

### 3. Built-in Memory

Store context across sessions:

```typescript
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right)
  }),
  userPreferences: Annotation<Record<string, any>>(),
  conversationSummary: Annotation<string>()
});

// Messages automatically accumulate
// Preferences persist across sessions
// Summary tracks conversation context
```

### 4. Streaming Support

Stream tokens and state updates in real-time:

```typescript
// Stream LLM tokens
for await (const chunk of app.stream(input, config)) {
  console.log(chunk);
}

// Stream state updates
for await (const update of app.stream(input, {
  ...config,
  streamMode: "updates"
})) {
  console.log("State changed:", update);
}
```

---

## Common LangGraph Patterns

### Pattern 1: ReAct (Reason + Act)

Agent that reasons about tools and uses them:

```
Query → Agent Thinks → Call Tool?
           ↓              ↓
        Answer      Execute Tool → Loop Back
```

**Use Case:** Research assistant that searches when needed

### Pattern 2: Reflection (Self-Correction)

Agent that critiques and improves its output:

```
Generate → Critique → Good Enough?
    ↑          ↓            ↓
    └──── Revise ←──── No  Yes → Done
```

**Use Case:** Code generation with validation

### Pattern 3: Multi-Agent Collaboration

Specialized agents work together:

```
Query → Triage Agent → Routes to Specialist
                ↓
        ┌───────┼───────┐
        ↓       ↓       ↓
      Agent   Agent   Agent
       A       B       C
```

**Use Case:** Customer support with specialists

### Pattern 4: Supervisor Pattern

Supervisor coordinates worker agents:

```
Supervisor → Assigns Task → Worker 1
    ↑                           ↓
    └──────── Reports ──────────┘
```

**Use Case:** Complex project management

---

## When NOT to Use LangGraph

### Skip LangGraph If:

❌ **Simple, single-turn LLM calls**
```typescript
// Just use AI SDK
const response = await streamText({
  model: openai('gpt-4o'),
  messages: [{ role: 'user', content: query }]
});
```

❌ **Linear workflows without branching**
```typescript
// Your current RAG agent is fine
embed → search → rerank → generate
```

❌ **Prototype applications without state**
- Building an MVP
- Testing ideas quickly
- No need for persistence

❌ **UI-heavy applications**
- AI SDK has better React integration
- Simpler streaming to UI
- Less complexity

---

## Learning Curve

**Time to Proficiency:**
- AI SDK: Hours to days
- LangGraph: 1-2 weeks

**Why the difference?**
- New mental model (graph-based thinking)
- More concepts to learn (nodes, edges, state, checkpointing)
- Production features add complexity

**Is it worth it?**
- For production agents: **Yes**
- For simple tools: **No**
- For learning: **Absolutely** (understand how production systems work)

---

## What You'll Build Next

In the next lesson, you'll implement a **LangGraph API route** that demonstrates:

✅ Stateful agent with decision-making
✅ Conditional routing based on query analysis
✅ Checkpointing for persistence
✅ Tool calling with loops
✅ State management across steps

You'll see firsthand how LangGraph differs from your current AI SDK agents.

---

## Additional Reading

### Official Documentation
- [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview) - Core concepts
- [LangGraph.js GitHub](https://github.com/langchain-ai/langgraphjs) - TypeScript examples
- [LangChain Academy](https://academy.langchain.com/) - Free structured course

### Deep Dives
- [Building Effective Agents (Anthropic)](https://www.anthropic.com/engineering/building-effective-agents) - Production patterns
- [LangGraph vs OpenAI Agents SDK](https://particula.tech/blog/langgraph-vs-crewai-vs-openai-agents-sdk-2026) - Framework comparison
- [Agent Orchestration in 2026](https://www.sitepoint.com/the-definitive-guide-to-agentic-design-patterns-in-2026/) - Design patterns

---

## Key Takeaways

✅ LangGraph is for complex, stateful, production-grade agents
✅ Uses graph-based architecture (nodes, edges, state)
✅ Provides checkpointing, human-in-the-loop, and memory
✅ Best for branching logic, loops, and long-running workflows
✅ AI SDK is better for simple, UI-first applications
✅ Learning curve is steeper but worth it for production systems
