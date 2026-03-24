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
// TEST CASES
// ============================================================================

interface TestCase {
	name: string;
	question: string;
	goldenResponse: string;
}

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
];

// ============================================================================
// JUDGE IMPLEMENTATION
// ============================================================================

async function judgeResponse(
	question: string,
	actualResponse: string,
	goldenResponse: string
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
			// 1. Get actual response from RAG system
			const actualResponse = await getRAGResponse(question);

			// 2. Have the LLM judge score it
			const { score, reason } = await judgeResponse(
				question,
				actualResponse,
				goldenResponse
			);

			// 3. Log results
			console.log(`\n📊 Test: ${question}`);
			console.log(`   Score: ${score}/10`);
			console.log(`   Reason: ${reason}`);
			console.log(`   Threshold: ${PASSING_SCORE}`);

			// 4. Assert quality meets threshold
			expect(score).toBeGreaterThanOrEqual(PASSING_SCORE);
		}
	);
});
