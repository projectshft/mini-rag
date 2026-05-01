# Testing the Selector Agent

The selector agent is critical to your RAG system - it routes queries to the right specialized agent. In this module, you'll learn how to test it effectively.

---

## Video Walkthrough

Watch this guide to testing and the course outro:

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://share.descript.com/embed/bLBxAMMBx6D" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

---

## What You'll Learn

- Why testing AI agents is challenging
- What you can (and can't) test with LLMs
- How to write simple, effective tests
- Running and debugging your test suite

---

## The Challenge: Non-Deterministic AI

### Why Testing AI is Different

LLMs are **non-deterministic** - they can give different outputs for the same input:

```typescript
// Same query, different times:
selectAgent("How do hooks work?")
→ "Explain React hooks concepts"  // First run
→ "How to use React hooks"        // Second run
→ "React hooks tutorial"          // Third run
```

Even with `temperature=0`, you get slight variations.

### What This Means for Testing

**❌ DON'T test:**

- Exact text output ("should return 'Explain React hooks'")
- Specific word choices
- Response creativity or style

**✅ DO test:**

- Output structure (has required fields)
- Agent routing decisions (linkedin vs rag)
- Response validity (not empty, proper type)
- Error handling

---

## Our Testing Strategy

We'll keep tests simple and focused on what matters:

1. **Route verification** - Does it pick the right agent?
2. **Structure validation** - Does it return valid data?
3. **Edge case handling** - Does it handle weird inputs?

We won't test exact text, just the routing decisions and structure.

---

## The Test Suite

Location: `app/agents/__tests__/selector.test.ts`

### Running the Tests

**No server needed!** Tests call the API handler directly.

```bash
yarn test:selector
```

This runs all selector agent tests. First time might take 15-30 seconds (calling OpenAI API).

### What We're Testing

#### How Tests Work

Tests import the API route handler directly:

```typescript
import { POST } from '@/app/api/select-agent/route';

// Create a mock request
const request = {
	json: async () => ({
		messages: [{ role: 'user', content: query }],
	}),
} as NextRequest;

// Call the handler directly
const response = await POST(request);
const result = await response.json();
```

#### 1. LinkedIn Agent Routing

```typescript
it('should route LinkedIn post creation to linkedin agent', async () => {
	const result = await selectAgent(
		'Write a LinkedIn post about learning TypeScript',
	);

	expect(result.agent).toBe('linkedin');
	expect(result.query).toBeTruthy();
});
```

**What we're checking:**

- ✅ Routes to `'linkedin'` agent
- ✅ Returns a non-empty refined query

#### 2. RAG Agent Routing

```typescript
it('should route technical documentation questions to rag agent', async () => {
	const result = await selectAgent('How do React hooks work?');

	expect(result.agent).toBe('rag');
	expect(result.query).toBeTruthy();
});
```

**What we're checking:**

- ✅ Routes to `'rag'` agent
- ✅ Technical questions go to RAG

#### 3. Response Structure

```typescript
it('should return valid response structure', async () => {
	const result = await selectAgent('Any question here');

	expect(result).toHaveProperty('agent');
	expect(result).toHaveProperty('query');
	expect(['linkedin', 'rag']).toContain(result.agent);
});
```

**What we're checking:**

- ✅ Has required fields (`agent` and `query`)
- ✅ Agent is valid ('linkedin' or 'rag')

#### 4. Edge Cases

```typescript
it('should handle very short queries', async () => {
	const result = await selectAgent('Help');

	expect(['linkedin', 'rag']).toContain(result.agent);
});
```

**What we're checking:**

- ✅ Doesn't crash on short input
- ✅ Still routes to a valid agent

---

## Running the Tests

### First Run

```bash
yarn test:selector
```

**Expected output:**

```
PASS app/agents/__tests__/selector.test.ts
  Selector Agent Routing
    LinkedIn Agent Routing
      ✓ should route LinkedIn post creation to linkedin agent (2145ms)
      ✓ should route career advice to linkedin agent (1832ms)
      ✓ should route professional networking questions to linkedin agent (1654ms)
    RAG Agent Routing
      ✓ should route technical documentation questions to rag agent (1723ms)
      ✓ should route coding questions to rag agent (1567ms)
      ✓ should route framework questions to rag agent (1689ms)
    Response Structure
      ✓ should return valid response structure (1543ms)
      ✓ should refine queries (1698ms)
    Edge Cases
      ✓ should handle very short queries (1421ms)
      ✓ should handle out-of-domain queries (1589ms)
      ✓ should handle ambiguous queries (1623ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Time:        17.234s
```

### What to Expect

- ✅ Tests take 15-20 seconds (calling OpenAI API)
- ✅ All 11 tests should pass
- ⚠️ Occasional routing variations are normal (non-determinism)

**How it works:** Tests import and call the API route handler directly, bypassing the need for a running server. This is faster and more reliable for testing.

---

## When Tests Fail

### Common Issues

**❌ "Timeout exceeded"**

```
Test timeout of 5000ms exceeded
```

**Fix:** Tests have 15s timeout - this means API is slow or down. Check:

- OpenAI API status
- Your internet connection
- Rate limits

**❌ "Unexpected agent selected"**

```
Expected: 'linkedin'
Received: 'rag'
```

**Fix:** This can happen! LLMs are non-deterministic. Ask yourself:

- Is my test query actually clear?
- Could it reasonably go to either agent?
- Maybe my expectation is wrong?

**❌ "Missing API key"**

```
Error: OPENAI_API_KEY is not set
```

**Fix:** Check your `.env.local` file has the key

---

## Understanding Non-Determinism

### Why Tests Might Fail Occasionally

```typescript
// This query is ambiguous:
'Tell me about JavaScript';

// Could route to:
// - 'rag' → technical documentation
// - 'linkedin' → career advice about learning JS

// Both are valid!
```

### How to Handle It

1. **Make queries clearer:**

```typescript
❌ "Tell me about JavaScript"
✅ "Write a LinkedIn post about JavaScript"
✅ "How do I use JavaScript async/await?"
```

2. **Accept some randomness:**

```typescript
// Instead of this:
expect(data.selectedAgent).toBe('rag');

// Consider this for ambiguous queries:
expect(['linkedin', 'rag']).toContain(data.selectedAgent);
```

---

## What We're NOT Testing

Remember, we're keeping it simple:

❌ **Not testing:**

- Exact refined query text
- Response quality or tone
- Specific word choices
- LLM creativity

✅ **Only testing:**

- Routing decisions
- Response structure
- Error handling
- Valid agent types

This keeps tests stable and reliable despite AI non-determinism.

---

## Exercise: Write Your Own Tests

Now it's your turn to add test cases to strengthen the test suite.

### Add 2-3 New Test Cases

Add new test cases to `app/agents/__tests__/selector.test.ts`:

**Test Ideas:**

**LinkedIn scenarios:**
- Job search queries
- Resume and career advice
- Professional networking questions
- Personal branding

**RAG scenarios:**
- Debugging questions
- API documentation lookups
- Framework best practices
- Code examples and tutorials

**Edge cases:**
- Very long queries
- Queries with special characters
- Mixed intent (could go to either agent)

### Test Template

```typescript
it('should route [scenario] to [agent] agent', async () => {
	const result = await selectAgent('[your test query]');

	expect(result.agent).toBe('[linkedin|rag]');
	expect(result.query).toBeTruthy();
});
```

### Example

```typescript
it('should route resume advice to linkedin agent', async () => {
	const result = await selectAgent(
		'How can I improve my resume for software engineering roles?'
	);

	expect(result.agent).toBe('linkedin');
	expect(result.query).toBeTruthy();
});
```

### Run Your Tests

```bash
yarn test:selector
```

**Verify:**
- All existing tests still pass ✅
- Your new tests pass ✅
- No errors in output

### Tips

- **Be specific:** Clear test queries reduce non-determinism
- **Test both agents:** Add cases for both LinkedIn and RAG routing
- **Consider edge cases:** What happens with unusual inputs?
- **Keep it simple:** Focus on routing and structure, not exact text

---

## Your Turn

**Step 1: Run existing tests**

```bash
yarn test:selector
```

**Verify:**

- All 11 tests pass ✅
- Takes 15-20 seconds
- No errors in output

**Step 2: Complete the exercise above**
- Add 2-3 new test cases
- Run tests to verify they pass
- Experiment with different query types

If tests fail, review the "When Tests Fail" section above.

**Note:** Tests call the API handler directly (no server needed). This is a common pattern in Next.js testing - you import the route handler and call it like a regular function.

---

## What's Next?

Now you have:

- ✅ Working agent system
- ✅ Observability with Helicone
- ✅ Test coverage for routing

Next up: **Capstone Project** where you'll deploy your custom RAG system!

---

## Quick Reference

```bash
# Run selector tests
yarn test:selector

# Run all tests
yarn test

# Run specific test
yarn test:selector -t "LinkedIn"

# Watch mode
yarn test:selector --watch
```
