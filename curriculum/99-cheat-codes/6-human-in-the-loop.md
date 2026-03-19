# Human-in-the-Loop

Require approval before destructive operations.

---

## Store Pending Actions

```typescript
const pendingApprovals = new Map<string, PendingAction>();

type PendingAction = {
  id: string;
  operation: 'DELETE' | 'UPDATE';
  query: string;
  affectedIds: string[];
  affectedCount: number;
  preview: any[];
  expiresAt: Date;
};
```

---

## Request Approval

```typescript
if (isDestructive) {
  const approvalId = crypto.randomUUID();

  pendingApprovals.set(approvalId, {
    id: approvalId,
    operation: 'DELETE',
    query: originalQuery,
    affectedIds: records.map(r => r.id),
    affectedCount: records.length,
    preview: records.slice(0, 5),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
  });

  return {
    type: 'AWAITING_APPROVAL',
    approvalId,
    message: `This will delete ${records.length} records.`,
    preview: records.slice(0, 5),
  };
}
```

---

## Handle Approval Response

```typescript
export async function handleApproval(approvalId: string, approved: boolean) {
  const pending = pendingApprovals.get(approvalId);

  if (!pending || new Date() > pending.expiresAt) {
    return { error: 'Approval expired' };
  }

  pendingApprovals.delete(approvalId);

  if (!approved) {
    return { message: 'Operation cancelled' };
  }

  // Execute the operation
  const result = await db.deleteMany({
    where: { id: { in: pending.affectedIds } },
  });

  return { message: `Deleted ${result.count} records` };
}
```

---

## Detect Destructive Intent

Use structured outputs to detect if a query is destructive:

```typescript
const analysisSchema = z.object({
  isDestructive: z.boolean().describe('True if DELETE or UPDATE'),
  operation: z.enum(['SELECT', 'DELETE', 'UPDATE', 'CREATE']),
  affectedTable: z.string().optional(),
});

const analysis = await generateObject({
  model: openai('gpt-4o-mini'),
  schema: analysisSchema,
  prompt: `Analyze this query: "${userQuery}"`,
});

if (analysis.object.isDestructive) {
  // Trigger approval flow
}
```

---

## Client-Side Approval UI

```typescript
function ApprovalDialog({ approval, onRespond }) {
  return (
    <div className="approval-dialog">
      <h3>Confirm Action</h3>
      <p>{approval.message}</p>

      <h4>Preview:</h4>
      <ul>
        {approval.preview.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <div className="actions">
        <button onClick={() => onRespond(approval.approvalId, true)}>
          Approve
        </button>
        <button onClick={() => onRespond(approval.approvalId, false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
```

---

## Full Flow Example

```typescript
// 1. User sends request
const response = await fetch('/api/agent', {
  method: 'POST',
  body: JSON.stringify({ query: 'Delete all inactive users' }),
});

const result = await response.json();

// 2. Check if approval needed
if (result.type === 'AWAITING_APPROVAL') {
  // Show approval UI
  const userApproved = await showApprovalDialog(result);

  // 3. Send approval response
  const finalResult = await fetch('/api/approve', {
    method: 'POST',
    body: JSON.stringify({
      approvalId: result.approvalId,
      approved: userApproved,
    }),
  });
}
```
