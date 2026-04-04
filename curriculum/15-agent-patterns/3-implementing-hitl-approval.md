# Implementing Human-in-the-Loop Approval

In this lesson, you'll see why human-in-the-loop is critical for destructive operations - and implement approval workflows for an influencer database agent.

---

## Video Walkthrough

Watch the full implementation and demonstration:

**🎥 Video:** [Human-in-the-Loop Implementation](#)

---

## The Repository

We'll use a separate repository for this implementation:

**📁 Repository:** [killer_agents](https://github.com/projectshft/killer_agents)

```bash
git clone https://github.com/projectshft/killer_agents.git
cd killer_agents
yarn install
```

This repo contains an influencer marketing database with a natural language search agent.

---

## The Problem

The `killer_agents` repo has an agent that searches an influencer database. Users can ask questions like:

```
"Show me fitness influencers in LA"
"Find creators with less than 10k followers"
"Delete inactive accounts"
```

### Current Implementation

Let's look at how the agent currently works:

```typescript
// app/agents/databaseSearchAgent.ts
export const databaseSearchAgent = async (agentAction: AgentAction) => {
  // 1. AI extracts search parameters with structured output
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: zodToJsonSchema(sqlSchema),
    },
  });

  // 2. Build query from extracted parameters
  const whereClause = constructWhereClause(sqlProps);
  const influencers = await prisma.influencer.findMany({ where: whereClause });

  // 3. If destructive, DELETE IMMEDIATELY! 😱
  if (sqlProps?.isDestructive) {
    await prisma.influencer.deleteMany({
      where: { id: { in: influencers.map(inf => inf.id) } },
    });

    return {
      message: `Deleted ${influencers.length} influencers.`,
      isDestructive: true,
    };
  }

  return { message: formatResults(influencers), isDestructive: false };
};
```

### The Danger

**Do you see the problem?**

When a user says "Delete inactive accounts", the AI:

1. Parses the request
2. Finds matching influencers
3. **Immediately deletes them** - no confirmation!

What could go wrong?

- **Misinterpretation:** "Remove duplicates" → AI deletes records it thinks are duplicates
- **Ambiguity:** "Clean up the database" → AI deletes... something?
- **Accidents:** User meant to type "Show" but typed "Delete"
- **Scale:** One bad command could wipe hundreds of records

**There's no undo button.**

---

## A Real Scenario

Imagine this conversation:

**User:** "Delete all influencers who haven't posted in 6 months"

**What the AI does:**
1. Interprets "6 months" as `last_active < '2024-09-17'`
2. Finds 247 influencers matching this criteria
3. Deletes all 247 records
4. Returns: "Deleted 247 influencers."

**What if the user meant:**
- "Show me" influencers who haven't posted (typo)
- "Mark as inactive" not delete
- 3 months, not 6 months
- Only from a specific campaign

**The damage is done. The data is gone.**

---

## The Solution: Human-in-the-Loop

Instead of executing destructive operations immediately, we:

1. **Plan** the operation
2. **Preview** what will be affected
3. **Wait** for human approval
4. **Execute** only if approved

### New Flow

```
User: "Delete inactive influencers"
     ↓
AI parses request
     ↓
AI finds 247 matching records
     ↓
⏸️ PAUSE - Show preview to user:
   "This will delete 247 influencers.
    Sample: @fitness_jane, @travel_mike, @food_sarah...
    [Approve] [Reject]"
     ↓
User clicks [Approve] or [Reject]
     ↓
If approved → Execute deletion
If rejected → Cancel, no changes
```

---

## Implementation Overview

We need to add three things:

### 1. Pending Actions Store

Store operations waiting for approval:

```typescript
// In-memory for demo, use database in production
const pendingApprovals = new Map<string, PendingAction>();

type PendingAction = {
  id: string;
  query: string;
  operation: 'DELETE' | 'UPDATE';
  affectedIds: string[];
  affectedCount: number;
  preview: Influencer[];
  createdAt: Date;
  expiresAt: Date;
};
```

### 2. Modified Agent Response

Return approval request instead of executing:

```typescript
if (sqlProps?.isDestructive) {
  // DON'T execute - create pending approval
  const approvalId = crypto.randomUUID();

  pendingApprovals.set(approvalId, {
    id: approvalId,
    query: agentAction.originalQuery,
    operation: 'DELETE',
    affectedIds: influencers.map(inf => inf.id),
    affectedCount: influencers.length,
    preview: influencers.slice(0, 5), // Show first 5
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
  });

  return {
    type: 'AWAITING_APPROVAL',
    approvalId,
    message: `This will delete ${influencers.length} influencers.`,
    preview: influencers.slice(0, 5),
    isDestructive: true,
  };
}
```

### 3. Approval Endpoint

Handle user's decision:

```typescript
// app/actions/approveAction.ts
export async function approveAction(
  approvalId: string,
  approved: boolean
): Promise<{ success: boolean; message: string }> {
  const pending = pendingApprovals.get(approvalId);

  if (!pending) {
    return { success: false, message: 'Approval expired or not found' };
  }

  if (new Date() > pending.expiresAt) {
    pendingApprovals.delete(approvalId);
    return { success: false, message: 'Approval expired' };
  }

  if (!approved) {
    pendingApprovals.delete(approvalId);
    return { success: true, message: 'Operation cancelled' };
  }

  // Execute the deletion
  const result = await prisma.influencer.deleteMany({
    where: { id: { in: pending.affectedIds } },
  });

  pendingApprovals.delete(approvalId);

  return {
    success: true,
    message: `Deleted ${result.count} influencers`
  };
}
```

---

## UI Changes

Update the frontend to handle approval state:

```typescript
// app/page.tsx
export default function Home() {
  const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(null);

  const handleSubmit = async () => {
    const result = await executeAgent(query);

    if (result.type === 'AWAITING_APPROVAL') {
      // Show approval UI instead of results
      setPendingApproval({
        id: result.approvalId,
        message: result.message,
        preview: result.preview,
      });
    } else {
      setAgentResult(result);
    }
  };

  const handleApproval = async (approved: boolean) => {
    const result = await approveAction(pendingApproval.id, approved);
    setPendingApproval(null);
    setAgentResult({ message: result.message });
  };

  // Render approval modal when pendingApproval exists
  if (pendingApproval) {
    return (
      <ApprovalModal
        approval={pendingApproval}
        onApprove={() => handleApproval(true)}
        onReject={() => handleApproval(false)}
      />
    );
  }

  // ... normal UI
}
```

---

## Approval Modal Component

```typescript
// app/components/ApprovalModal.tsx
export function ApprovalModal({ approval, onApprove, onReject }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>⚠️ Confirm Destructive Operation</h2>

        <p className="warning">{approval.message}</p>

        <div className="preview">
          <h3>Records that will be affected:</h3>
          <ul>
            {approval.preview.map(inf => (
              <li key={inf.id}>
                {inf.name} - {inf.metadata?.tier?.name || 'Unknown tier'}
              </li>
            ))}
          </ul>
          {approval.totalCount > approval.preview.length && (
            <p>...and {approval.totalCount - approval.preview.length} more</p>
          )}
        </div>

        <div className="actions">
          <button onClick={onReject} className="btn-cancel">
            ❌ Cancel
          </button>
          <button onClick={onApprove} className="btn-danger">
            ⚠️ Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Safety Features

### 1. Expiration

Approvals expire after 5 minutes:

```typescript
if (new Date() > pending.expiresAt) {
  pendingApprovals.delete(approvalId);
  return { success: false, message: 'Approval expired - please try again' };
}
```

### 2. Preview Affected Records

Show users exactly what will be deleted:

```typescript
preview: influencers.slice(0, 10).map(inf => ({
  id: inf.id,
  name: inf.name,
  tier: inf.metadata?.tier?.name,
  followers: inf.followerCount,
}))
```

### 3. Audit Log

Track all approvals and rejections:

```typescript
await prisma.auditLog.create({
  data: {
    action: approved ? 'APPROVED' : 'REJECTED',
    operation: pending.operation,
    affectedCount: pending.affectedCount,
    query: pending.query,
    userId: session?.user?.id,
    timestamp: new Date(),
  }
});
```

### 4. Require Re-authentication

For high-stakes operations, require password:

```typescript
if (pending.affectedCount > 100) {
  // Require password confirmation for large deletions
  const verified = await verifyPassword(userId, password);
  if (!verified) {
    return { success: false, message: 'Invalid password' };
  }
}
```

---

## Before vs After

### Before (Dangerous)

```
User: "Delete inactive influencers"
↓
AI: "Deleted 247 influencers."
↓
User: "Wait, I meant..."
↓
Too late. Data is gone.
```

### After (Safe)

```
User: "Delete inactive influencers"
↓
AI: "This will delete 247 influencers.
     Preview: @jane, @mike, @sarah...
     [Approve] [Cancel]"
↓
User reviews → Clicks [Cancel]
↓
AI: "Operation cancelled. No changes made."
↓
Data is safe. User can refine their query.
```

---

## Testing

### Test 1: Safe Query (No Approval Needed)

```
"Show me fitness influencers"
```

**Expected:** Returns results immediately, no approval modal.

### Test 2: Destructive Query (Requires Approval)

```
"Delete influencers with less than 1000 followers"
```

**Expected:** Shows approval modal with preview. Click [Cancel] → no deletion.

### Test 3: Approve Deletion

```
"Delete test account @test_user"
```

**Expected:** Shows approval → Click [Approve] → Account deleted.

### Test 4: Expired Approval

```
"Delete old accounts"
```

**Expected:** Wait 5+ minutes → Try to approve → "Approval expired".

---

## Key Takeaways

✅ **Never execute destructive operations without confirmation**

✅ **Show users exactly what will be affected**

✅ **Add expiration to prevent stale approvals**

✅ **Log all approvals for audit trail**

✅ **Consider additional verification for large operations**

---

## When to Use HITL

| Operation | HITL Required? |
|-----------|---------------|
| SELECT (read) | ❌ No |
| INSERT (create) | ⚠️ Sometimes |
| UPDATE (modify) | ✅ Yes |
| DELETE (remove) | ✅ Yes |
| DROP TABLE | ✅ Absolutely |

---

## Exercise

1. Clone the `killer_agents` repository
2. Run the current version - try "Delete inactive accounts"
3. Implement the HITL approval flow
4. Add the approval modal UI
5. Test both safe and destructive queries

**Bonus challenges:**
- Add audit logging
- Add expiration cleanup (cron job)
- Add Slack notifications for approvals
- Add bulk approval for admins

---

## What You Learned

✅ Why immediate execution of destructive operations is dangerous

✅ How to implement pending approval state

✅ Building approval UI with preview

✅ Safety features: expiration, audit logs, re-authentication

✅ Testing HITL workflows
