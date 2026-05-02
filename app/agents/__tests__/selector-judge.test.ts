/**
 * LLM-AS-JUDGE TESTS
 *
 * These tests compare generated LinkedIn posts against golden standard responses.
 * The judge evaluates if the actual output matches the quality of the reference.
 *
 * Students: Add more test cases to the GOLDEN_TEST_CASES array!
 */

import { openaiClient } from '@/app/libs/openai/openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

// Test case definition with golden standard response
interface GoldenTestCase {
	query: string;
	goldenResponse: string;
	description: string;
}

// GOLDEN TEST CASES - Add more here!
const GOLDEN_TEST_CASES: GoldenTestCase[] = [
	{
		query: 'write a post on AI taking over junior developer jobs',
		goldenResponse: `
		The AI apocalypse is upon us, or so they say. 

Are junior developers really going to be the first casualties?

Here's the thing - AI is a tool, not a magical solution. It can automate tasks, but who is going to build and maintain AI? More AI? 🤔

We're so busy heralding the end of junior jobs, we're forgetting who's going to step up when we need a senior dev to fix a critical issue.

AI replacing junior devs is just hype and speculation. It's scaring off potential talent. We're forgetting the value of human creativity, problem-solving, and the ability to adapt. 

Yes, junior developers are risky. They need hand-holding, they make mistakes. But here's the deal - nearly every developer starts as a "junior". And every "junior" learns and grows with experience.

Instead of worrying about AI taking over, let's focus on empowering our junior developers. Give them the tools to grow, to learn, to become the senior devs of the future. 

Remove 'junior', 'aspiring', and 'learning' from your resume and LinkedIn. Instead, talk about the app or website you're launching. Use strong language to showcase your experience. Sell the benefits of the features you've created. 

In this rapidly evolving tech world, we all start as "juniors". But with the right attitude, we can all become "seniors". 

So let's stop hyping the AI apocalypse and start focusing on nurturing our human talent. Because at the end of the day, it's the human element that makes technology truly powerful.
`,
		description: 'LinkedIn post about AI taking over junior developer jobs',
	},
	{
		query: 'Write a post on vector databases and why 512 vs 1536 dimensions is a debated topic',
		goldenResponse: `The battle rages on: 512 dimensions vs 1536 dimensions in vector databases.

And I'm here to say: it's not about the number.

- It's about the application.
- It's about the problem you're trying to solve.

I've spent countless hours diving deep into vector databases: cosine similarity, matrix multiplication, dot product. The whole enchilada.

And here's what I've learned:

Choosing 512 or 1536 dimensions is not the endgame. It's just a part of the bigger picture.

Just like white board interviews, the dimensions you use depend on the problem at hand. Sometimes recursion works better, sometimes it's a tree structure.

And just like with AI, it's not about vibe coding. It's about understanding what's happening beneath the surface.

Here's what I do:

1. Experiment: Test different dimensions on your specific problem. See what works best for your application.
2. Don't get fixated: Be ready to switch things up if the situation demands. Flexibility is key.
3. Stay on top of the game: Keep learning and updating your knowledge. The world of AI is fast-paced. Don't get left behind.

The bottom line?

512 or 1536 dimensions doesn't define the success of your project.

It's understanding the problem, experimenting with solutions, and being ready to pivot that does.

So, roll up your sleeves and dive in!

Good luck out there.`,
		description: 'LinkedIn post about vector database dimensions debate',
	},
];

// Schema for the judge's evaluation
const judgeEvaluationSchema = z.object({
	score: z.number().min(1).max(10).describe('Overall quality score 1-10'),
	matchesGoldenStandard: z
		.boolean()
		.describe(
			'Whether the response quality matches or exceeds the golden standard',
		),
	contentMatch: z.string().describe('How well the content/message matches'),
	styleMatch: z
		.string()
		.describe(
			'How well the style/format matches (sentence length, line breaks, tone)',
		),
	reasoning: z.string().describe('Brief explanation of the evaluation'),
});

describe('LLM-as-Judge: Response Quality', () => {
	jest.setTimeout(60000);

	// Helper to read streaming response
	const readStreamResponse = async (response: Response): Promise<string> => {
		const reader = response.body?.getReader();
		if (!reader) throw new Error('No response body');

		const decoder = new TextDecoder();
		let content = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			content += decoder.decode(value, { stream: true });
		}

		return content;
	};

	// Generate content using actual API calls
	const generateContent = async (query: string) => {
		// Call select-agent API
		const selectResponse = await fetch(`${BASE_URL}/api/select-agent`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				messages: [{ role: 'user', content: query }],
			}),
		});

		if (!selectResponse.ok) {
			throw new Error(`Select agent failed: ${selectResponse.status}`);
		}

		const { indexes, query: refinedQuery } = await selectResponse.json();

		// Call chat API
		const chatResponse = await fetch(`${BASE_URL}/api/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ indexes, query: refinedQuery }),
		});

		if (!chatResponse.ok) {
			throw new Error(`Chat API failed: ${chatResponse.status}`);
		}

		const content = await readStreamResponse(chatResponse);

		return { indexes, refinedQuery, content };
	};

	// LLM Judge compares actual vs golden standard
	const judgeAgainstGolden = async (
		testCase: GoldenTestCase,
		actualContent: string,
	) => {
		const evaluation = await openaiClient.responses.parse({
			model: 'gpt-4o-mini',
			input: [
				{
					role: 'system',
					content: `You are an expert evaluator comparing AI-generated LinkedIn posts.

Compare the ACTUAL response against the GOLDEN STANDARD reference.
Evaluate both CONTENT (message, stance, topics covered) and STYLE (sentence length, line breaks, tone, formatting).

Be strict but fair:
- Score 7+ means production-ready, matches golden standard in both content and style
- Score 5-7 means content is good but style doesn't match, or vice versa
- Score below 5 means significant gaps in both content and style`,
				},
				{
					role: 'user',
					content: `
Original Query: "${testCase.query}"

GOLDEN STANDARD (reference for content AND style):
"""
${testCase.goldenResponse}
"""

ACTUAL RESPONSE (to evaluate):
"""
${actualContent}
"""

Judge how well the actual response matches the golden standard in:
1. CONTENT: Does it convey a similar message and stance?
2. STYLE: Does it use similar formatting (short lines, punchy sentences, structure)?`,
				},
			],
			temperature: 0.1,
			text: {
				format: zodTextFormat(judgeEvaluationSchema, 'evaluation'),
			},
		});

		return evaluation.output_parsed;
	};

	it.each(GOLDEN_TEST_CASES)('$description', async (testCase) => {
		const { indexes, refinedQuery, content } = await generateContent(
			testCase.query,
		);

		console.log('\n--- Test Case ---');
		console.log('Query:', testCase.query);
		console.log('Indexes:', indexes);
		console.log('Refined Query:', refinedQuery);
		console.log('\n--- Generated Content ---');
		console.log(content);

		const evaluation = await judgeAgainstGolden(testCase, content);

		console.log('\n--- Judge Evaluation ---');
		console.log('Score:', evaluation?.score);
		console.log(
			'Matches Golden Standard:',
			evaluation?.matchesGoldenStandard,
		);
		console.log('Content Match:', evaluation?.contentMatch);
		console.log('Style Match:', evaluation?.styleMatch);
		console.log('Reasoning:', evaluation?.reasoning);

		// Assert quality threshold
		expect(evaluation?.score).toBeGreaterThanOrEqual(6);
		expect(evaluation?.matchesGoldenStandard).toBe(true);
	});
});
