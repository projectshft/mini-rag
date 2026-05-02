/**
 * LLM-AS-JUDGE TESTS
 *
 * These tests compare generated LinkedIn posts against golden standard responses.
 * The judge evaluates if the actual output matches the quality of the reference.
 *
 * Students: Add more test cases to the GOLDEN_TEST_CASES array!
 */

import { POST as selectAgent } from '@/app/api/select-agent/route';
import { NextRequest } from 'next/server';
import { openaiClient } from '@/app/libs/openai/openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

// Test case definition with golden standard response
interface GoldenTestCase {
	query: string;
	goldenResponse: string;
	description: string;
}

// GOLDEN TEST CASES - Add more here!
const GOLDEN_TEST_CASES: GoldenTestCase[] = [
	{
		query: 'Write a linkedin post on how AI is detrimental to new coders',
		goldenResponse: `AI is the new boogeyman, lurking in the shadows.

It's coming to steal our jobs, right?

Well, let's talk about junior developers.

I hear whispers of AI replacing these entry-level positions. And I can't help but ask, who's going to maintain this AI? Who will troubleshoot when it hits a snag?

More AI?

Let's pump the brakes on the speculation and hype, folks.

Junior developers may be risky hires. Yes, I said it. They need hand-holding. They break things. They're not immediate contributors.

But guess what?

We were all juniors once. Even the most seasoned developer was a "n00b" at some point.

Here's my advice to all you juniors out there feeling the heat from the AI scare:

Stop down-playing yourself.

Ditch the "junior" tag from your resume and LinkedIn. Don't babble about your school project. Do talk about the app you're launching. Use strong language to describe your experiences. Instead of saying "I created an app using XYZ tech", try "I migrated a JS app to TypeScript to enhance the developer experience".

In the face of AI, it's not about being "junior" or "senior". It's about showcasing your value, your ability to adapt and grow. It's about proving you're a problem solver, not just a coder.

So, are we really going to let the AI boogeyman scare us? Or are we going to step up, grow, and show our worth?

AI might be on the rise, but remember, it's humans who create, maintain, and innovate.

Don't forget that.`,
		description: 'LinkedIn post about AI impact on new coders',
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
	// TODO: Students - Add more test cases!
];

// Schema for the judge's evaluation
const judgeEvaluationSchema = z.object({
	score: z.number().min(1).max(10).describe('Overall quality score 1-10'),
	matchesGoldenStandard: z
		.boolean()
		.describe('Whether the response quality matches or exceeds the golden standard'),
	contentMatch: z.string().describe('How well the content/message matches'),
	styleMatch: z.string().describe('How well the style/format matches (sentence length, line breaks, tone)'),
	reasoning: z.string().describe('Brief explanation of the evaluation'),
});

describe('LLM-as-Judge: Response Quality', () => {
	jest.setTimeout(60000);

	const createRequest = (body: object): NextRequest => {
		return { json: async () => body } as NextRequest;
	};

	// Generate content using same approach as chat endpoint
	const generateContent = async (query: string) => {
		const selectRequest = createRequest({
			messages: [{ role: 'user', content: query }],
		});
		const selectResponse = await selectAgent(selectRequest);
		const { indexes, query: refinedQuery } = await selectResponse?.json();

		const response = await openaiClient.responses.create({
			model: 'gpt-4o-mini',
			temperature: 1,
			input: [
				{
					role: 'system',
					content: `Write a linkedin post about the topic the user requests.
Mimic the tone and style of a professional thought leader.
NO EMOJIS!!!!`,
				},
				{
					role: 'user',
					content: refinedQuery,
				},
			],
		});

		return { indexes, refinedQuery, content: response.output_text };
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
- Score 5-6 means content is good but style doesn't match, or vice versa
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
		console.log('Matches Golden Standard:', evaluation?.matchesGoldenStandard);
		console.log('Content Match:', evaluation?.contentMatch);
		console.log('Style Match:', evaluation?.styleMatch);
		console.log('Reasoning:', evaluation?.reasoning);

		// Assert quality threshold
		expect(evaluation?.score).toBeGreaterThanOrEqual(6);
		expect(evaluation?.matchesGoldenStandard).toBe(true);
	});
});
