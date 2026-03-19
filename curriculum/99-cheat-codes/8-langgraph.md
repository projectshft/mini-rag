# LangGraph Basics

Build stateful agent workflows.

---

## Define State

```typescript
import { Annotation, StateGraph } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';

const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
  }),
  query: Annotation<string>(),
  needsResearch: Annotation<boolean>(),
  searchResults: Annotation<string[]>(),
  answer: Annotation<string>(),
});
```

---

## Create Nodes

```typescript
async function analyzeNode(state: typeof AgentState.State) {
  const analysis = await analyzeQuery(state.query);
  return {
    needsResearch: analysis.needsResearch,
  };
}

async function searchNode(state: typeof AgentState.State) {
  const results = await searchDocs(state.query);
  return {
    searchResults: results,
  };
}

async function answerNode(state: typeof AgentState.State) {
  const answer = await generateAnswer(state.query, state.searchResults);
  return {
    answer,
  };
}
```

---

## Conditional Routing

```typescript
function routeAfterAnalysis(state: typeof AgentState.State) {
  return state.needsResearch ? 'search' : 'answer';
}
```

---

## Build Graph

```typescript
const workflow = new StateGraph(AgentState)
  .addNode('analyze', analyzeNode)
  .addNode('search', searchNode)
  .addNode('answer', answerNode)
  .addEdge('__start__', 'analyze')
  .addConditionalEdges('analyze', routeAfterAnalysis, {
    search: 'search',
    answer: 'answer',
  })
  .addEdge('search', 'answer')
  .addEdge('answer', '__end__');

const app = workflow.compile();
```

---

## Execute Graph

```typescript
const result = await app.invoke({
  query: userQuery,
  messages: [],
  searchResults: [],
});

console.log(result.answer);
```

---

## Stream Graph Execution

```typescript
const stream = await app.stream({
  query: userQuery,
  messages: [],
  searchResults: [],
});

for await (const event of stream) {
  console.log('Node:', Object.keys(event)[0]);
  console.log('State update:', event);
}
```

---

## Add Memory (Checkpointing)

```typescript
import { MemorySaver } from '@langchain/langgraph';

const memory = new MemorySaver();

const app = workflow.compile({
  checkpointer: memory,
});

// Execute with thread ID for persistence
const result = await app.invoke(
  { query: userQuery },
  { configurable: { thread_id: 'user-123' } }
);

// Continue conversation in same thread
const result2 = await app.invoke(
  { query: followUpQuery },
  { configurable: { thread_id: 'user-123' } }
);
```

---

## Human-in-the-Loop with LangGraph

```typescript
import { interrupt } from '@langchain/langgraph';

async function deleteNode(state: typeof AgentState.State) {
  // Pause for human approval
  const approved = interrupt({
    message: `Delete ${state.affectedCount} records?`,
    preview: state.preview,
  });

  if (!approved) {
    return { status: 'cancelled' };
  }

  await performDelete(state.affectedIds);
  return { status: 'completed' };
}
```

---

## Graph Visualization

```typescript
// Get graph structure for visualization
const graphData = app.getGraph();

// Or export as Mermaid diagram
console.log(app.getGraph().drawMermaid());
```
