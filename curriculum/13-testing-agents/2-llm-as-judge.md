# LLM-as-Judge Testing

Beyond testing routing decisions and structure, we can use an LLM to evaluate the **quality** of responses. This technique catches regressions when models update, prompts change, or retrieval drifts.

---

## What You'll Learn

- What LLM-as-judge testing is and when to use it
- How to create "golden" reference responses
- Building a scoring system with an LLM evaluator
- Setting appropriate pass/fail thresholds

---

## The Problem: Testing Response Quality

Routing tests tell us the right agent was selected, but they don't tell us if the response is actually good:

```typescript
// This passes, but is the response helpful?
expect(result.agent).toBe('rag');
expect(result.query).toBeTruthy();

// We have no idea if the actual answer was:
// ✅ "React hooks let you use state in functional components..."
// ❌ "I don't know anything about hooks"
// ❌ "Here's some random unrelated text..."
```

**LLM-as-judge** solves this by using another LLM call to evaluate response quality.

---

## How It Works

1. **Define a golden response** - A high-quality reference answer for a specific question
2. **Get the actual response** - Run your system and capture the output
3. **Ask an LLM to score it** - Compare actual vs golden on a 1-10 scale
4. **Pass/fail based on threshold** - If score < 8, the test fails

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Question  │────▶│  Your RAG   │────▶│   Actual    │
│             │     │   System    │     │  Response   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
┌─────────────┐                                │
│   Golden    │────────────────────────────────┼──────┐
│  Response   │                                │      │
└─────────────┘                                ▼      ▼
                                        ┌─────────────────┐
                                        │   LLM Judge     │
                                        │  Compare & Score│
                                        │    (1-10)       │
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │  Score >= 8?    │
                                        │  PASS : FAIL    │
                                        └─────────────────┘
```

---

## When to Use LLM-as-Judge

**Good use cases:**

- Catching quality regressions after model updates
- Validating prompt changes don't degrade responses
- Ensuring RAG retrieval changes don't hurt answer quality
- Smoke testing critical user journeys

**Not ideal for:**

- Testing exact output (use string matching)
- Testing routing logic (use existing selector tests)
- High-frequency CI runs (expensive and slow)

---

## Creating Golden Responses

The key to good LLM-as-judge tests is high-quality reference responses.

### Where to Get Golden Responses

1. **Copy from the chat interface** - Use your best real responses
2. **Write them manually** - Craft ideal responses for key questions
3. **Curate from production** - Save highly-rated user interactions

### What Makes a Good Golden Response

```typescript
// ❌ Too vague - hard to score against
const badGolden = 'React hooks are useful for state management.';

// ✅ Specific and comprehensive
const goodGolden = `React hooks let you use state and lifecycle features
in functional components. The most common hooks are:

1. useState - for managing local state
2. useEffect - for side effects like API calls
3. useContext - for accessing context values
4. useRef - for mutable references that persist across renders

Hooks must be called at the top level of your component, not inside
loops or conditions.`;
```

---

## The Scoring Prompt

The LLM judge needs clear instructions on how to evaluate:

```typescript
const JUDGE_SYSTEM_PROMPT = `You are an expert evaluator assessing AI response quality.

Compare the ACTUAL response against the REFERENCE response and score from 1-10:

SCORING CRITERIA:
- 10: Perfect - covers all key points, equally or more helpful
- 8-9: Excellent - covers most key points, minor omissions
- 6-7: Good - covers main idea but missing important details
- 4-5: Fair - partially correct but significant gaps
- 2-3: Poor - mostly incorrect or unhelpful
- 1: Failed - completely wrong or off-topic

IMPORTANT:
- Focus on factual accuracy and completeness
- The actual response doesn't need identical wording
- It CAN be better than the reference (still scores 10)
- Penalize incorrect information heavily`;
```

We use **structured outputs** with a Zod schema to guarantee valid responses - no JSON parsing needed!

---

## Implementation

Add a file here: `app/agents/__tests__/llm-judge.test.ts`

### The Judge Function (Using Structured Outputs)

We use OpenAI's structured outputs with a Zod schema to guarantee valid responses:

```typescript
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { openaiClient } from '@/app/libs/openai/openai';

// Define the schema for judge responses
const JudgeResultSchema = z.object({
	score: z.number().min(1).max(10),
	reason: z.string(),
});

type JudgeResult = z.infer<typeof JudgeResultSchema>;

async function judgeResponse(
	question: string,
	actualResponse: string,
	goldenResponse: string,
): Promise<JudgeResult> {
	const response = await openaiClient.chat.completions.create({
		model: 'gpt-4o-mini',
		temperature: 0,
		messages: [
			{ role: 'system', content: JUDGE_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `QUESTION: ${question}

REFERENCE RESPONSE:
${goldenResponse}

ACTUAL RESPONSE:
${actualResponse}

Score the actual response against the reference.`,
			},
		],
		response_format: zodResponseFormat(JudgeResultSchema, 'judge_result'),
	});

	const content = response.choices[0]?.message?.content;
	if (!content) {
		return { score: 0, reason: 'No response from judge' };
	}

	return JSON.parse(content) as JudgeResult;
}
```

**Why structured outputs?**

- Guaranteed valid JSON structure from the model
- Type safety with Zod schema
- The model is constrained to return exactly what we expect

### Test Cases with Golden Responses

```typescript
const TEST_CASES = [
	{
		name: 'React hooks explanation',
		question: 'How do React hooks work?',
		goldenResponse: `React hooks are functions that let you use state and
lifecycle features in functional components. Key hooks include:

- useState: Manages local component state
- useEffect: Handles side effects like data fetching
- useContext: Accesses React context
- useRef: Creates mutable references

Rules: Call hooks at the top level only, not in loops or conditions.`,
	},
	{
		name: 'Async/await explanation',
		question: 'Explain async/await in JavaScript',
		goldenResponse: `Async/await is syntax for handling asynchronous operations:

- async functions always return a Promise
- await pauses execution until a Promise resolves
- Makes async code read like synchronous code
- Use try/catch for error handling

Example:
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed:', error);
  }
}`,
	},
];
```

### The Test Suite

```typescript
describe('LLM-as-Judge Response Quality', () => {
	jest.setTimeout(30000); // LLM calls take time

	const PASSING_SCORE = 8;

	test.each(TEST_CASES)(
		'should produce quality response for: $name',
		async ({ question, goldenResponse }) => {
			// 1. Get actual response from your system
			const actualResponse = await getRAGResponse(question);

			// 2. Judge the response
			const { score, reason } = await judgeResponse(
				question,
				actualResponse,
				goldenResponse,
			);

			// 3. Log for debugging
			console.log(`\n📊 ${question}`);
			console.log(`   Score: ${score}/10`);
			console.log(`   Reason: ${reason}`);

			// 4. Assert quality threshold
			expect(score).toBeGreaterThanOrEqual(PASSING_SCORE);
		},
	);
});
```

---

## Running the Tests

```bash
# Run LLM-as-judge tests
yarn test:judge

# Run with verbose output
yarn test:judge --verbose
```

**Expected output:**

```
PASS app/agents/__tests__/llm-judge.test.ts
  LLM-as-Judge Response Quality
    ✓ should produce quality response for: React hooks explanation (4521ms)
      📊 How do React hooks work?
         Score: 9/10
         Reason: Covers all key hooks and rules, adds helpful examples
    ✓ should produce quality response for: Async/await explanation (3892ms)
      📊 Explain async/await in JavaScript
         Score: 8/10
         Reason: Accurate explanation, missing try/catch detail

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

---

## Choosing the Right Threshold

Why 8 as the passing score?

| Score | Meaning                      | Test Result |
| ----- | ---------------------------- | ----------- |
| 10    | Perfect match or better      | ✅ Pass     |
| 9     | Excellent, minor differences | ✅ Pass     |
| 8     | Good, covers key points      | ✅ Pass     |
| 7     | Decent but missing details   | ❌ Fail     |
| 6     | Acceptable but concerning    | ❌ Fail     |
| <6    | Quality problem              | ❌ Fail     |

**Adjust based on your needs:**

- Critical production tests: threshold = 9
- General quality checks: threshold = 8
- Loose smoke tests: threshold = 7

---

## Catching Regressions

LLM-as-judge excels at catching subtle regressions:

### Model Update Regression

```
Before (GPT-4): Score 9/10 ✅
After (GPT-4-turbo): Score 6/10 ❌

Reason: New model is more concise but missing key details
about hook rules and common pitfalls.
```

### Prompt Change Regression

```
Before: Score 9/10 ✅
After prompt edit: Score 5/10 ❌

Reason: Response now includes incorrect information about
hooks working inside loops.
```

### Retrieval Drift

```
Before: Score 9/10 ✅
After re-indexing: Score 4/10 ❌

Reason: RAG is now retrieving outdated documentation,
response references deprecated APIs.
```

---

## Exercise: Create Your Own LLM-as-Judge Tests

### Step 1: Add the Test Script to package.json

Add this script to your `package.json`:

```json
{
	"scripts": {
		"test:judge": "jest llm-judge"
	}
}
```

### Step 2: Create the Test File

Create `app/agents/__tests__/llm-judge.test.ts`:

```typescript
/**
 * LLM-AS-JUDGE TESTS
 *
 * These tests evaluate response QUALITY using another LLM as a judge.
 * Useful for catching regressions when:
 * - Model versions change
 * - Prompts are modified
 * - RAG retrieval drifts
 */

import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { POST as chatPOST } from '@/app/api/chat/route';
import { openaiClient } from '@/app/libs/openai/openai';

// ============================================================================
// JUDGE CONFIGURATION
// ============================================================================

const PASSING_SCORE = 8;

const JUDGE_SYSTEM_PROMPT = `You are an expert evaluator assessing AI response quality.

Compare the ACTUAL response against the REFERENCE response and score from 1-10:

SCORING CRITERIA:
- 10: Perfect - covers all key points, equally or more helpful than reference
- 8-9: Excellent - covers most key points, only minor omissions
- 6-7: Good - covers main idea but missing important details
- 4-5: Fair - partially correct but has significant gaps
- 2-3: Poor - mostly incorrect or unhelpful
- 1: Failed - completely wrong or off-topic

IMPORTANT:
- Focus on factual accuracy and completeness
- The actual response doesn't need identical wording
- It CAN be better than the reference (still scores 10)
- Penalize incorrect information heavily
- Consider if a user would find the response helpful`;

// Schema for structured output
const JudgeResultSchema = z.object({
	score: z.number().min(1).max(10),
	reason: z.string(),
});

type JudgeResult = z.infer<typeof JudgeResultSchema>;

// ============================================================================
// TEST CASES - Add your golden responses here!
// ============================================================================

interface TestCase {
	name: string;
	question: string;
	goldenResponse: string;
}

/**
 * TODO: Add your own test cases!
 *
 * How to get golden responses:
 * 1. Run `yarn dev` and open the chat interface
 * 2. Ask questions and find responses you're happy with
 * 3. Copy those responses here as golden references
 */
const TEST_CASES: TestCase[] = [
	{
		name: 'React hooks explanation',
		question: 'How do React hooks work?',
		goldenResponse: `React hooks are functions that let you use state and lifecycle features in functional components. The most common hooks include:

- useState: Manages local component state
- useEffect: Handles side effects like data fetching and subscriptions
- useContext: Accesses React context values
- useRef: Creates mutable references that persist across renders

Important rules for hooks:
1. Only call hooks at the top level of your component
2. Don't call hooks inside loops, conditions, or nested functions
3. Only call hooks from React function components or custom hooks`,
	},
	// TODO: Add more test cases for your specific use case
	// {
	//   name: 'Your test name',
	//   question: 'Your question here',
	//   goldenResponse: 'Your golden response here',
	// },
];

// ============================================================================
// JUDGE IMPLEMENTATION
// ============================================================================

async function judgeResponse(
	question: string,
	actualResponse: string,
	goldenResponse: string,
): Promise<JudgeResult> {
	const response = await openaiClient.chat.completions.create({
		model: 'gpt-4o-mini',
		temperature: 0,
		messages: [
			{ role: 'system', content: JUDGE_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `QUESTION: ${question}

REFERENCE RESPONSE:
${goldenResponse}

ACTUAL RESPONSE:
${actualResponse}

Score the actual response against the reference.`,
			},
		],
		response_format: zodResponseFormat(JudgeResultSchema, 'judge_result'),
	});

	const content = response.choices[0]?.message?.content;
	if (!content) {
		return { score: 0, reason: 'No response from judge' };
	}

	return JSON.parse(content) as JudgeResult;
}

// ============================================================================
// HELPER: Get response from RAG system
// ============================================================================

async function getRAGResponse(question: string): Promise<string> {
	const request = {
		json: async () => ({
			messages: [{ role: 'user', content: question }],
			agent: 'rag',
			query: question,
		}),
	} as Request;

	const response = await chatPOST(request);

	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error('No response body');
	}

	const decoder = new TextDecoder();
	let fullResponse = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		fullResponse += decoder.decode(value, { stream: true });
	}

	return fullResponse;
}

// ============================================================================
// TEST SUITE
// ============================================================================

describe('LLM-as-Judge Response Quality', () => {
	jest.setTimeout(30000);

	test.each(TEST_CASES)(
		'should produce quality response for: $name',
		async ({ question, goldenResponse }) => {
			// 1. Get actual response from your RAG system
			const actualResponse = await getRAGResponse(question);

			// 2. Have the LLM judge score it
			const { score, reason } = await judgeResponse(
				question,
				actualResponse,
				goldenResponse,
			);

			// 3. Log results for visibility
			console.log(`\n📊 Test: ${question}`);
			console.log(`   Score: ${score}/10`);
			console.log(`   Reason: ${reason}`);
			console.log(`   Threshold: ${PASSING_SCORE}`);

			// 4. Assert quality meets threshold
			expect(score).toBeGreaterThanOrEqual(PASSING_SCORE);
		},
	);
});
```

### Step 3: Get Golden Responses

1. Open your chat interface (`yarn dev`)
2. Ask questions you want to test
3. Copy the best responses as your golden references

### Step 4: Run and Iterate

```bash
yarn test:judge
```

If tests fail, check:

- Is your golden response too strict?
- Is the actual response actually bad?
- Does your judge prompt need adjustment?

---

## Tips for Effective LLM-as-Judge Tests

### Keep Test Cases Focused

```typescript
// ❌ Too broad - hard to evaluate
{
  question: 'Tell me everything about React',
  goldenResponse: '...(500 lines)...'
}

// ✅ Focused - clear evaluation criteria
{
  question: 'What are the rules for using React hooks?',
  goldenResponse: '...(key rules only)...'
}
```

### Use Consistent Golden Response Style

```typescript
// Pick a style and stick with it
// Option A: Bullet points
goldenResponse: `Key points:
- Point 1
- Point 2
- Point 3`;

// Option B: Paragraphs
goldenResponse: `First paragraph explaining concept.

Second paragraph with details.`;
```

### Don't Over-Test

```typescript
// ❌ Testing every possible question
const TEST_CASES = [
  /* 50 test cases */
];

// ✅ Testing critical user journeys
const TEST_CASES = [
  { name: 'Core concept 1', ... },
  { name: 'Core concept 2', ... },
  { name: 'Common edge case', ... },
];
```

---

## Cost Considerations

Each test makes 2 LLM calls:

1. Your RAG system response
2. The judge evaluation

**Cost estimate per test run:**

- ~$0.01-0.02 with GPT-4o-mini
- ~$0.05-0.10 with GPT-4o

**Recommendations:**

- Run on PR merges, not every commit
- Use GPT-4o-mini for judging (accurate enough, much cheaper)
- Keep test suite small and focused (5-10 critical cases)

---

## Your Challenge: Create Your Own Tests

Now it's your turn. Add at least 2-3 more test cases to the LLM-as-judge test file:

1. **Run your chat interface** (`yarn dev`)
2. **Ask questions** relevant to your documentation
3. **Copy the best responses** as golden references
4. **Add them to TEST_CASES** in `llm-judge.test.ts`
5. **Run the tests** and adjust thresholds if needed

Think about what questions are critical for your users. Those are the ones worth testing.

---

## Submit Your Work

When you've completed the LLM-as-judge exercise:

**What to submit:**
1. Your completed `app/agents/__tests__/llm-judge.test.ts` with:
   - Filled-in judge system prompt with scoring criteria
   - At least 3 test cases with golden responses
   - Working `judgeResponse` function implementation
2. Screenshot of your tests passing (`yarn test:judge`)

**Submit:**
- [Code Submission - LLM-as-Judge](https://form.typeform.com/to/TBD)

---

## What's Next?

You now have:

- ✅ Routing tests (selector tests)
- ✅ Quality tests (LLM-as-judge)
- ✅ Regression detection for model/prompt changes

Next up: **Tool-Calling Exploration** — when to let the AI decide vs. using fixed workflows.

---

## Quick Reference

```bash
# Run LLM-as-judge tests
yarn test:judge

# Run all agent tests
yarn test
```

### Test File Location

```
app/agents/__tests__/llm-judge.test.ts
```

### Passing Threshold

```typescript
const PASSING_SCORE = 8; // Adjust based on needs
```
