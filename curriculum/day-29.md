# Day 29 — Testing the Selector Agent

**Time:** ~60 min · Hands-on

> **Today:** you'll learn why testing LLM-powered code is fundamentally different from testing regular code, then run and extend a real test suite against your selector agent — testing routing decisions and structure, not exact text.

The selector agent is critical to your system — it routes queries to the right specialized agent. If it silently starts misrouting after a prompt tweak or a model update, everything downstream degrades. Today you'll learn how to test it effectively.

## Video walkthrough

Watch this guide to testing (and the course outro):

<iframe src="https://share.descript.com/embed/bLBxAMMBx6D" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## The challenge: non-deterministic AI

LLMs are **non-deterministic** — they can give different outputs for the same input:

```typescript
// Same query, different times:
selectAgent("How do hooks work?")
→ "Explain React hooks concepts"  // First run
→ "How to use React hooks"        // Second run
→ "React hooks tutorial"          // Third run
```

Even with `temperature=0`, you get slight variations. That breaks the mental model most of us bring from regular unit testing, where `f(x)` always equals the same `y`.

### What this means for testing

**❌ DON'T test:**

- Exact text output (`"should return 'Explain React hooks'"`)
- Specific word choices
- Response creativity or style

**✅ DO test:**

- Output structure (has required fields)
- Agent routing decisions (`linkedin` vs `rag`)
- Response validity (not empty, proper type)
- Error handling

### Our testing strategy

Keep tests simple and focused on what matters:

1. **Route verification** — does it pick the right agent?
2. **Structure validation** — does it return valid data?
3. **Edge case handling** — does it handle weird inputs?

We won't test exact text — just the routing decisions and the shape of the response. That's what keeps the suite stable despite non-determinism.

## The test suite

Location: `app/agents/__tests__/selector.test.ts`

**No server needed!** Tests import the API route handler from [`app/api/select-agent/route.ts`](https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/api/select-agent/route.ts) and call it directly — a common pattern in Next.js testing:

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

This is faster and more reliable than spinning up a dev server for tests.

### What we're testing

**1. LinkedIn agent routing**

```typescript
it('should route LinkedIn post creation to linkedin agent', async () => {
	const result = await selectAgent(
		'Write a LinkedIn post about learning TypeScript',
	);

	expect(result.agent).toBe('linkedin');
	expect(result.query).toBeTruthy();
});
```

Checks: routes to `'linkedin'`, and returns a non-empty refined query.

**2. RAG agent routing**

```typescript
it('should route technical documentation questions to rag agent', async () => {
	const result = await selectAgent('How do React hooks work?');

	expect(result.agent).toBe('rag');
	expect(result.query).toBeTruthy();
});
```

Checks: technical questions go to `'rag'`.

**3. Response structure**

```typescript
it('should return valid response structure', async () => {
	const result = await selectAgent('Any question here');

	expect(result).toHaveProperty('agent');
	expect(result).toHaveProperty('query');
	expect(['linkedin', 'rag']).toContain(result.agent);
});
```

Checks: required fields exist, and the agent is one of the valid names.

**4. Edge cases**

```typescript
it('should handle very short queries', async () => {
	const result = await selectAgent('Help');

	expect(['linkedin', 'rag']).toContain(result.agent);
});
```

Checks: doesn't crash on short input, still routes to a valid agent.

## Run the tests

```bash
yarn test:selector
```

First run takes 15–30 seconds — every test is a real OpenAI API call.

<details>
<summary>🔍 Expected output</summary>

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

All 11 tests should pass. Occasional routing variations are normal — that's non-determinism, not a bug.

</details>

```quiz
[
  {
    "q": "Why shouldn't you assert on the exact refined query text the selector returns?",
    "options": ["LLMs are non-deterministic — the same input can produce different (equally valid) phrasings on each run", "The refined query is encrypted", "Jest can't compare long strings"],
    "answer": 0,
    "explain": "Even at temperature=0 outputs vary slightly. Assert on what's stable: the routing decision and the response structure."
  },
  {
    "q": "A test asserts `expect(result.agent).toBe('linkedin')` for the query 'Tell me about JavaScript' and fails intermittently. What's the best fix?",
    "options": ["Increase the timeout", "The query is genuinely ambiguous — make it clearer ('Write a LinkedIn post about JavaScript') or accept either agent", "Retry the test until it passes"],
    "answer": 1,
    "explain": "'Tell me about JavaScript' could reasonably be a docs question OR career content. Ambiguous queries deserve ambiguous assertions — or clearer queries."
  },
  {
    "q": "How do these tests run without `yarn dev`?",
    "options": ["They mock the OpenAI API entirely", "They import the route handler function directly and call it with a mock request object", "Jest starts a hidden Next.js server"],
    "answer": 1,
    "explain": "The route handler is just an async function. Importing and calling it directly is faster and more reliable than going over HTTP — though the OpenAI calls inside it are still real."
  }
]
```

## When tests fail

**❌ "Timeout exceeded"**

```
Test timeout of 5000ms exceeded
```

Tests have a 15s timeout — this means the API is slow or down. Check OpenAI API status, your internet connection, and rate limits.

**❌ "Unexpected agent selected"**

```
Expected: 'linkedin'
Received: 'rag'
```

This can happen! LLMs are non-deterministic. Ask yourself:

- Is my test query actually clear?
- Could it reasonably go to either agent?
- Maybe my expectation is wrong?

**❌ "Missing API key"**

```
Error: OPENAI_API_KEY is not set
```

Check your `.env.local` file has the key.

### Handling ambiguity deliberately

Two levers:

1. **Make queries clearer:**

```typescript
❌ "Tell me about JavaScript"
✅ "Write a LinkedIn post about JavaScript"
✅ "How do I use JavaScript async/await?"
```

2. **Accept some randomness** for genuinely ambiguous queries:

```typescript
// Instead of this:
expect(data.selectedAgent).toBe('rag');

// Consider this:
expect(['linkedin', 'rag']).toContain(data.selectedAgent);
```

## Exercise: write your own tests

Now it's your turn. Add **2–3 new test cases** to `app/agents/__tests__/selector.test.ts`.

**Ideas to pick from:**

- **LinkedIn scenarios:** job search queries, resume and career advice, professional networking, personal branding
- **RAG scenarios:** debugging questions, API documentation lookups, framework best practices, code examples
- **Edge cases:** very long queries, special characters, mixed intent (could go to either agent)

Use this template:

```typescript
it('should route [scenario] to [agent] agent', async () => {
	const result = await selectAgent('[your test query]');

	expect(result.agent).toBe('[linkedin|rag]');
	expect(result.query).toBeTruthy();
});
```

Then run `yarn test:selector` and verify all existing tests still pass, your new tests pass, and there are no errors in the output.

<details>
<summary>💡 Hint 1 — reducing flakiness before it starts</summary>

Be specific in your test queries. "How can I improve my resume?" is unambiguous LinkedIn territory; "Tell me about careers in tech" could go either way. For any query where you can argue both routings, use `toContain` against both agents instead of `toBe`.

</details>

<details>
<summary>✅ Example test — try writing your own first</summary>

```typescript
it('should route resume advice to linkedin agent', async () => {
	const result = await selectAgent(
		'How can I improve my resume for software engineering roles?'
	);

	expect(result.agent).toBe('linkedin');
	expect(result.query).toBeTruthy();
});
```

</details>

**Tips:**

- **Be specific** — clear test queries reduce non-determinism
- **Test both agents** — add cases for both LinkedIn and RAG routing
- **Consider edge cases** — what happens with unusual inputs?
- **Keep it simple** — routing and structure, not exact text

## Quick reference

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

## ✅ Key takeaways

- LLMs are non-deterministic — test **routing decisions and response structure**, never exact output text
- Tests import the Next.js route handler directly and call it like a function — no running server needed
- An intermittently failing routing test usually means the query is genuinely ambiguous — clarify the query or accept either agent
- Keeping assertions loose where the model has legitimate freedom (and tight where it doesn't) is what makes AI test suites stable

## 🤖 Work with AI

```ai-prompt
title: Generate adversarial test cases for my selector
---
I have a selector agent that routes user queries to either a 'linkedin' agent (posts, career advice, networking, personal branding) or a 'rag' agent (technical documentation Q&A about React and web development). My tests live in app/agents/__tests__/selector.test.ts and assert on result.agent and result.query.

Generate 10 test queries designed to stress the router: 3 clearly-linkedin, 3 clearly-rag, and 4 deliberately ambiguous or adversarial (mixed intent, very short, special characters, off-domain). For each, tell me which assertion style to use — a strict expect(result.agent).toBe(...) or a loose expect(['linkedin','rag']).toContain(...) — and why. Then quiz me: show me 3 more queries and make ME classify them before you reveal your answer.
```

```ai-prompt
title: Explain-back — why AI testing is different
---
I just learned how to test a non-deterministic LLM-based selector agent. I'm going to explain to you, in my own words: (1) why asserting exact LLM output text is a mistake, (2) what we assert instead, and (3) how the tests call a Next.js route handler without a running server.

Play a skeptical senior engineer who has only ever tested deterministic code. Push back on my explanation ("so your tests just pass no matter what the model says?", "isn't calling the real OpenAI API in tests slow and flaky by definition?"). Poke holes until I've defended the strategy properly, then summarize the one weakest part of my explanation.
```
