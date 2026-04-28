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

/**
 * TODO: Complete the judge system prompt
 *
 * The judge needs clear scoring criteria from 1-10. Include:
 * - What each score range means (10=perfect, 1=failed)
 * - That wording doesn't need to be identical
 * - That the actual response CAN be better than reference
 * - That incorrect information should be penalized heavily
 */
const JUDGE_SYSTEM_PROMPT = `You are an expert evaluator assessing AI response quality.

Compare the ACTUAL response against the REFERENCE response and score from 1-10:

SCORING CRITERIA:
// TODO: Define what each score range means
// - 10: ?
// - 8-9: ?
// - 6-7: ?
// - 4-5: ?
// - 2-3: ?
// - 1: ?

IMPORTANT:
// TODO: Add important evaluation guidelines
`;

/**
 * TODO: Define the Zod schema for judge responses
 *
 * The schema should include:
 * - score: number from 1-10
 * - reason: string explaining the score
 */
const JudgeResultSchema = z.object({
	// TODO: Add schema fields
	score: z.number(), // Add constraints
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
 *
 * Add at least 3 test cases for questions relevant to your RAG content.
 */
const TEST_CASES: TestCase[] = [
	// TODO: Add your first test case
	// {
	//   name: 'Descriptive name for this test',
	//   question: 'The question to ask your RAG system',
	//   goldenResponse: `The ideal response you want the system to give.
	//
	// Include all the key points that should be covered.
	// Use bullet points or paragraphs as appropriate.`,
	// },
];

// ============================================================================
// JUDGE IMPLEMENTATION
// ============================================================================

/**
 * TODO: Implement the judge function
 *
 * This function should:
 * 1. Call the OpenAI API with the judge system prompt
 * 2. Use structured outputs (zodResponseFormat) for reliable JSON
 * 3. Pass the question, actual response, and golden response to the judge
 * 4. Return the parsed JudgeResult
 *
 * Hint: Use openaiClient.chat.completions.create() with response_format
 */
async function judgeResponse(
	question: string,
	actualResponse: string,
	goldenResponse: string
): Promise<JudgeResult> {
	// TODO: Implement the judge call using structured outputs
	//
	// const response = await openaiClient.chat.completions.create({
	//   model: 'gpt-4o-mini',
	//   temperature: 0,
	//   messages: [...],
	//   response_format: zodResponseFormat(JudgeResultSchema, 'judge_result'),
	// });
	//
	// Parse and return the result

	throw new Error('TODO: Implement judgeResponse');
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
				goldenResponse
			);

			// 3. Log results for visibility
			console.log(`\n📊 Test: ${question}`);
			console.log(`   Score: ${score}/10`);
			console.log(`   Reason: ${reason}`);
			console.log(`   Threshold: ${PASSING_SCORE}`);

			// 4. Assert quality meets threshold
			expect(score).toBeGreaterThanOrEqual(PASSING_SCORE);
		}
	);
});
