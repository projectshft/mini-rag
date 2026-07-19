// Shared definition for the public "Would You Pass an AI Engineering
// Interview?" lead quiz. Questions are drawn from real AI-engineering
// interviews Brian ran (the "leave Cursor on", textbook-answers-that-collapse,
// prompt-paste-accept, and "that's a great question" stalling tells). The
// server scores authoritatively from the chosen indices; the client only
// renders text, so shipping point values here is harmless.

export type Option = { text: string; points: number };
export type Question = { q: string; note?: string; options: Option[] };

export const QUESTIONS: Question[] = [
	{
		q: 'The interviewer says: "Leave Cursor on — we want to see how you solve this WITH AI." What do you do?',
		options: [
			{
				text: 'Switch to plain VS Code to prove you can code without the crutch',
				points: 0,
			},
			{
				text: 'Use it, and narrate out loud why you accept some suggestions and reject others',
				points: 2,
			},
			{
				text: 'Let it generate the solution and move on once the tests pass',
				points: 0,
			},
		],
	},
	{
		q: '"How would you chunk medical documents versus social media posts?" The strongest move is to…',
		options: [
			{ text: 'Give a clean, confident, standard chunking answer right away', points: 0 },
			{
				text: 'Ask a clarifying question, then reason about tradeoffs — structure, tables, and metadata vs. short, informal, hashtag-heavy text',
				points: 2,
			},
			{ text: 'Say they’re basically the same, just split by character count', points: 0 },
		],
	},
	{
		q: 'Cursor hands you a working anagram function — but with nested try/catches, logging, and a README to run it. You…',
		options: [
			{ text: 'Ship it. It works and passes the tests', points: 0 },
			{ text: 'Delete the cruft, keep the minimal version, and say why', points: 2 },
			{ text: 'Ask the AI to explain what it just wrote', points: 1 },
		],
	},
	{
		q: "You scaffolded a Next.js app with AI. The interviewer points at the top line — `'use client'` — and asks what it does. You…",
		options: [
			{ text: 'Explain it — you know your stack cold, tool or no tool', points: 2 },
			{
				text: 'Freeze — you’ve "used Next for a couple years" but never needed to know',
				points: 0,
			},
			{ text: 'Wave it off as "just boilerplate Next adds"', points: 0 },
		],
	},
	{
		q: '"Our agent gave a user a wrong answer. How would you debug it?" You say…',
		options: [
			{ text: '"First I’d replicate the issue and check the logs" (and repeat it when pushed)', points: 0 },
			{
				text: 'Trace the actual inputs: what got retrieved, was the context right, what did the prompt look like — then add an eval to catch it next time',
				points: 2,
			},
			{ text: 'Ask the AI why its own answer was wrong', points: 0 },
		],
	},
	{
		q: 'You notice you open every answer with "that’s a great question" and pause before a fully-formed reply appears. To an experienced interviewer, that reads as…',
		options: [
			{ text: 'Thoughtful and polite', points: 0 },
			{
				text: 'A stalling tell — the verbal equivalent of a loading spinner while an answer gets fed to you',
				points: 2,
			},
		],
	},
	{
		q: 'AI can solve almost any coding challenge you’ll be handed. So what is the interviewer REALLY evaluating?',
		options: [
			{ text: 'How fast you get to a passing solution', points: 0 },
			{
				text: 'Whether they’d want to work with you — your judgment, your reasoning, and how you communicate tradeoffs',
				points: 2,
			},
			{ text: 'How good your prompts are', points: 0 },
		],
	},
];

export const TOTAL = QUESTIONS.reduce(
	(n, x) => n + Math.max(...x.options.map((o) => o.points)),
	0,
);

/** Authoritative scoring from chosen option indices (server-side). */
export function scoreAnswers(answers: number[]): number {
	return QUESTIONS.reduce((sum, question, i) => {
		const opt = question.options[answers[i]];
		return sum + (opt ? opt.points : 0);
	}, 0);
}

export type Bucket = 'hireable' | 'at-risk' | 'flagged';

export function bucketFor(score: number): Bucket {
	if (score >= 11) return 'hireable';
	if (score >= 6) return 'at-risk';
	return 'flagged';
}

export const RESULTS: Record<Bucket, { title: string; blurb: string }> = {
	hireable: {
		title: 'You’d likely get the offer',
		blurb:
			'You treat AI as leverage and can defend every call you make — exactly what interviewers are desperate to find and rarely do. The gap now is proving it under pressure and telling the story right.',
	},
	'at-risk': {
		title: 'You’re on the bubble',
		blurb:
			'You can use the tools, but you’re leaning on them without a strong critical-thinking layer. "Prompt, paste, accept, move on" is the #1 reason good candidates get passed over — and it’s very fixable.',
	},
	flagged: {
		title: 'You’d get flagged',
		blurb:
			'Some answers read like the candidates who get caught — textbook responses that collapse on the follow-up, or accepting AI output wholesale. Good news: it’s a skills gap, not a character flaw, and it’s teachable.',
	},
};

export const CALENDLY_URL = 'https://calendly.com/brianjenney83';
