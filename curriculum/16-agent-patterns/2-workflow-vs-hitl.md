**DRAFT - This module is not yet part of the core curriculum**

---

# Workflow vs Human-in-the-Loop

You've already built a **workflow agent**. Now let's understand when you need a **human-in-the-loop (HITL) agent** instead.

---

## Your RAG Agent: A Workflow Pattern

Let's review what you built in the RAG agent section:

```typescript
export async function ragAgent(request: AgentRequest) {
	// Step 1: Generate embedding
	const embedding = await generateEmbedding(request.query);

	// Step 2: Search Pinecone
	const results = await searchPinecone(embedding);

	// Step 3: Rerank results
	const reranked = await rerank(results);

	// Step 4: Generate response with context
	return streamText({
		model: openai('gpt-4o'),
		system: `Context: ${reranked}`,
		messages: request.messages,
	});
}
```

**Key characteristics:**

- ✅ Executes automatically from start to finish
- ✅ No human intervention required
- ✅ Fast and efficient
- ✅ Safe because it's read-only (only searches and generates)

**Why this works:**
Your RAG agent only **reads** data and generates text. There's no risk of:

- Deleting data
- Modifying records
- Spending money
- Breaking systems

The worst that can happen is a bad answer, which is low-stakes.

---

## When Workflow Agents Aren't Enough

Consider these scenarios:

### Scenario 1: Database Deletion

```typescript
'Delete all influencers with less than 1000 followers';
```

**Workflow approach:**

```typescript
Query → Generate SQL → Execute DELETE → Done
```

**Problem:** What if the AI misunderstood? What if it deletes the wrong records? **This is irreversible.**

---

### Scenario 2: Content Publishing

```typescript
'Publish this blog post to production';
```

**Workflow approach:**

```typescript
Query → Generate post → Publish to website → Done
```

**Problem:** What if the content has errors? What if it violates brand guidelines? **This is public-facing.**

---

### Scenario 3: Financial Transactions

```typescript
'Transfer $10,000 to vendor account';
```

**Workflow approach:**

```typescript
Query → Parse amount → Execute transfer → Done
```

**Problem:** What if the AI misread the amount? What if it's the wrong vendor? **This involves money.**

---

## Enter: Human-in-the-Loop

HITL adds a pause for human approval before executing critical actions:

```typescript
Query → Plan Action → WAIT FOR APPROVAL → Execute (if approved)
```

### Example: Safe Database Deletion

```typescript
export async function hitlAgent(request: AgentRequest) {
	// Step 1: AI plans the action
	const plan = await generateDeletionPlan(request.query);
	// Example: "DELETE FROM influencers WHERE followers < 1000"

	// Step 2: Ask human for approval
	const approval = await requestHumanApproval({
		action: 'Database Deletion',
		query: plan.sql,
		affectedRows: plan.estimatedCount,
		reasoning: plan.reasoning,
	});

	// Step 3: Only execute if approved
	if (approval.approved) {
		const result = await executeQuery(plan.sql);
		return { success: true, rowsDeleted: result.count };
	} else {
		return { success: false, reason: 'User rejected' };
	}
}
```

**Key differences from workflow:**

- ⏸️ Pauses for human decision
- 🛡️ Prevents accidental damage
- 📋 Creates audit trail
- 🤔 Lets human verify AI's plan

---

## Comparison: RAG Agent vs HITL Agent

### Your RAG Agent (Workflow)

**Flow:**

```
User: "How do I use React hooks?"
  ↓
Embed query → Search docs → Rerank → Generate answer
  ↓
User: "Here's your answer..."
```

**Time to complete:** 2-3 seconds

**Risk if AI makes mistake:** User gets wrong information (low stakes)

**When to use:**

- Read-only operations
- Information retrieval
- Content generation (not publishing)
- Analysis and recommendations

---

### HITL Agent (Approval Required)

**Flow:**

```
User: "Delete inactive influencers"
  ↓
Generate SQL: "DELETE FROM influencers WHERE last_active < '2024-01-01'"
  ↓
Show to user: "This will delete ~247 rows. Approve?"
  ↓
User clicks: [Approve] or [Reject]
  ↓
If approved: Execute deletion
```

**Time to complete:** Depends on human (seconds to hours)

**Risk if AI makes mistake:** Prevented by human review (high safety)

**When to use:**

- Write operations (CREATE, UPDATE, DELETE)
- Financial transactions
- Publishing content
- Compliance-regulated actions
- Irreversible operations

---

## Architecture Comparison

### Workflow Agent Architecture

```
┌─────────┐
│  User   │
└────┬────┘
     │ query
     ↓
┌─────────────┐
│  AI Agent   │ ← Autonomous
└─────────────┘
     │
     │ result
     ↓
┌─────────┐
│  User   │
└─────────┘
```

**Communication:** One-way (user asks → agent responds)

---

### HITL Agent Architecture

```
┌─────────┐
│  User   │
└────┬────┘
     │ query
     ↓
┌─────────────┐
│  AI Agent   │ ← Plans action
└─────────────┘
     │
     │ proposed action
     ↓
┌─────────────┐
│   Human     │ ← Reviews & decides
└─────────────┘
     │
     │ approval/rejection
     ↓
┌─────────────┐
│  AI Agent   │ ← Executes if approved
└─────────────┘
     │
     │ result
     ↓
┌─────────┐
│  User   │
└─────────┘
```

**Communication:** Two-way (agent asks human for input)

---

## Code Structure Comparison

### Your Workflow RAG Agent

```typescript
// app/agents/rag.ts
export async function ragAgent(request: AgentRequest) {
	// All steps execute automatically
	const context = await retrieveContext(request.query);
	return streamText({
		system: `Context: ${context}`,
		messages: request.messages,
	});
}
```

**Properties:**

- Single async function
- No pauses
- Returns immediately (streaming)
- No external state

---

### HITL Agent Structure

```typescript
// app/agents/hitl.ts
export async function hitlAgent(request: AgentRequest) {
	// Step 1: Plan
	const plan = await generatePlan(request.query);

	// Step 2: Store plan and wait for approval
	const approvalId = await storePendingAction(plan);

	return {
		type: 'AWAITING_APPROVAL',
		approvalId: approvalId,
		plan: plan,
		message: 'Please review and approve this action',
	};
}

// Separate endpoint for approval
export async function handleApproval(approvalId: string, approved: boolean) {
	const plan = await getPendingAction(approvalId);

	if (approved) {
		return await executePlan(plan);
	} else {
		return { cancelled: true };
	}
}
```

**Properties:**

- Multi-step with state
- Pauses between plan and execution
- Requires approval endpoint
- Stores pending actions

---

## When to Choose Each Pattern

### Choose Workflow (like your RAG agent) when:

✅ Operations are **read-only**

- Searching databases
- Generating content (not publishing)
- Analyzing data
- Providing recommendations

✅ Mistakes are **low-stakes**

- Wrong answer → user asks again
- Bad recommendation → user ignores it
- Incorrect analysis → easily corrected

✅ **Speed matters**

- Real-time chat
- Live search
- Instant responses

✅ **No human available**

- Automated systems
- Off-hours operations
- High-volume requests

---

### Choose HITL when:

🛡️ Operations are **destructive**

- DELETE queries
- UPDATE operations
- DROP tables
- Data migrations

🛡️ Actions are **irreversible**

- Publishing to production
- Sending emails/notifications
- Financial transactions
- Legal agreements

🛡️ Mistakes are **high-stakes**

- Financial loss
- Data loss
- Compliance violations
- Brand damage

🛡️ **Human judgment required**

- Subjective decisions
- Regulatory compliance
- Creative approval
- Risk assessment

---

## Real-World Example: Influencer Database

Let's see both patterns applied to an influencer marketing database:

### Safe Operations (Workflow)

```typescript
// ✅ Read-only: Use workflow
'Show me all influencers with over 10k followers';
'Analyze engagement rates for fashion influencers';
'Generate a report of top performers';
```

**Why:** These only read data. Mistakes are low-stakes.

---

### Risky Operations (HITL)

```typescript
// 🛡️ Destructive: Use HITL
"Delete influencers who haven't posted in 6 months";
'Update all fitness influencers to premium tier';
'Mark these 50 accounts as inactive';
```

**Why:** These modify data. Mistakes could delete valuable records.

---

## The Cost of HITL

HITL adds safety but has tradeoffs:

**Latency:**

- Workflow: 2-3 seconds
- HITL: Minutes to hours (waiting for human)

**Throughput:**

- Workflow: Unlimited
- HITL: Limited by human capacity

**Complexity:**

- Workflow: Simple async function
- HITL: State management, approval UI, notifications

**Cost:**

- Workflow: Just LLM costs
- HITL: LLM + human time

**When it's worth it:** When the cost of a mistake exceeds the cost of review.

---

## Hybrid Approach

Many systems use both patterns:

```typescript
export async function smartAgent(request: AgentRequest) {
	// Step 1: Classify the query
	const classification = await classifyQuery(request.query);

	if (classification.type === 'READ_ONLY') {
		// Use workflow for safe operations
		return await workflowAgent(request);
	} else if (classification.type === 'WRITE') {
		// Use HITL for destructive operations
		return await hitlAgent(request);
	}
}
```

**Examples:**

- "Show me influencers" → Workflow (instant)
- "Delete influencers" → HITL (requires approval)

---

## Key Takeaways

✅ **Workflow agents** (your RAG agent): Fast, autonomous, good for read-only operations

🛡️ **HITL agents**: Slower, safer, necessary for destructive operations

🤔 **Choose based on risk**: Can you afford a mistake? If not, use HITL.

🏗️ **Architecture differs**: Workflow is one function, HITL needs state and approval flow

💰 **HITL has costs**: Human time, latency, complexity - only use when needed
