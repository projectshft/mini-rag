import type { Metadata } from 'next';
import { BuyButton } from '@/components/lms/BuyButton';
import { MetaPixel } from '@/components/lms/MetaPixel';

const BUY_URL = 'https://buy.stripe.com/eVq9ATgrv0Mkbd75Lx4wM0y';
const ON_SALE = Boolean(process.env.STRIPE_SECRET_KEY && process.env.AGENTIC_PAYMENT_LINK_ID);

export const metadata: Metadata = {
	title: 'Intro to Agentic Engineering | Parsity',
	description:
		'A self-paced course on building software with coding agents. Trust the code, verify the claims, and build a software factory. $47.',
};

const HABITS = [
	{
		title: 'Trust the code. Distrust the claims.',
		body: 'Models write great syntax. They also say "all tests pass" without running them. You will learn to tell the difference and turn claims into evidence.',
	},
	{
		title: 'Make it prove it',
		body: 'End-to-end tests, screenshots and mutation testing. Work that would be unreasonable to ask a person costs an agent a few tokens.',
	},
	{
		title: 'Fresh eyes, every time',
		body: 'The agent that wrote the code never reviews the code. Separate sessions, separate context, real review.',
	},
	{
		title: 'Write it down after three',
		body: 'When CLAUDE.md, AGENTS.md and skills actually help, why most of them rot, and why I stopped writing code comments.',
	},
];

const LESSONS = [
	'Start Here: Building With Agents',
	'Trust the Code, Not the Claims',
	'Is Your Test Suite Lying? Mutation Testing and Fresh Eyes',
	'The Rule of Three (and Why I Stopped Writing Comments)',
	'Multiple Agents, Worktrees and Chasing Trends',
	'Your Challenge: Build a Software Factory',
];

const FAQ = [
	{
		q: 'Which coding agent do I need?',
		a: 'Any of them. Claude Code, Codex, Cursor, whatever you like. The habits work with all of them. You bring your own agent subscription.',
	},
	{
		q: 'What are the $5 in credits for?',
		a: 'API calls from the starter app and your software factory, through our proxy. They do not pay for Claude Code, Codex or Cursor.',
	},
	{
		q: 'Do I need to know how to code?',
		a: "Yes, but the language doesn't matter. Everything here is language agnostic. The starter repo happens to be TypeScript, and if you can read code in any language you'll be fine. The whole point is judging what the agent produces.",
	},
	{
		q: 'What is not included?',
		a: 'No Slack, no mentors, no code review, no live sessions. It is the material, the starter repo and the credits. If you want the rest, that is the full AI engineering program.',
	},
	{
		q: 'Are there videos?',
		a: 'Almost none, on purpose. Watching someone else use an agent is like watching someone else go to the gym.',
	},
];

export default function AgenticEngineeringPage() {
	return (
		<main className='lms min-h-screen bg-white text-zinc-900'>
			<MetaPixel />
			<section className='mx-auto max-w-3xl px-4 pb-14 pt-16 sm:pt-24'>
				<p className='text-xs font-semibold uppercase tracking-wider text-blue-600'>
					Self-paced course from Parsity
				</p>
				<h1 className='mt-3 text-4xl font-bold tracking-tight sm:text-5xl'>
					Intro to Agentic Engineering
				</h1>
				<p className='mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600'>
					Coding was never the bottleneck. Good ideas were. Learn the handful of habits that held up
					through two years of building production software with coding agents, then build a software
					factory that turns a chat message into a reviewed pull request.
				</p>
				<div className='mt-8 flex flex-wrap items-center gap-4'>
					{ON_SALE ? (
					<BuyButton
						href={BUY_URL}
						className='rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700'
					>
						Get the course for $47
					</BuyButton>
					) : (
						<span className='inline-block rounded-xl bg-zinc-100 px-6 py-3 text-base font-semibold text-zinc-500'>Enrollment opens soon</span>
					)}
					<span className='text-sm text-zinc-500'>
						Includes a starter repo and $5 in API credits
					</span>
				</div>
			</section>

			<section className='border-t border-zinc-100 bg-zinc-50/60'>
				<div className='mx-auto max-w-3xl px-4 py-14'>
					<h2 className='text-2xl font-bold tracking-tight'>What you will actually learn</h2>
					<div className='mt-6 grid gap-4 sm:grid-cols-2'>
						{HABITS.map((h) => (
							<div key={h.title} className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
								<h3 className='font-semibold'>{h.title}</h3>
								<p className='mt-2 text-sm leading-relaxed text-zinc-600'>{h.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className='mx-auto max-w-3xl px-4 py-14'>
				<h2 className='text-2xl font-bold tracking-tight'>Six lessons, one challenge</h2>
				<ol className='mt-6 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm'>
					{LESSONS.map((l, i) => (
						<li key={l} className='flex items-center gap-3 px-4 py-3'>
							<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-xs font-semibold text-zinc-500'>
								{i + 1}
							</span>
							<span className='text-sm font-medium text-zinc-800'>{l}</span>
						</li>
					))}
				</ol>
				<p className='mt-4 text-sm text-zinc-500'>
					Every lesson runs against a small starter app you clone on day one, with quizzes, workplace
					scenarios and copy-ready prompts for your agent.
				</p>
			</section>

			<section className='border-t border-zinc-100 bg-zinc-50/60'>
				<div className='mx-auto max-w-3xl px-4 py-14'>
					<h2 className='text-2xl font-bold tracking-tight'>Who is teaching this</h2>
					<p className='mt-4 leading-relaxed text-zinc-600'>
						I&apos;m Brian Jenney. I&apos;ve built and led production AI systems, including RAG pipelines
						and agents, at two companies, and I run Parsity, where we train working developers. I
						haven&apos;t written much code by hand in a long time. I still read all of it.
					</p>
				</div>
			</section>

			<section className='mx-auto max-w-3xl px-4 py-14'>
				<h2 className='text-2xl font-bold tracking-tight'>Questions</h2>
				<div className='mt-6 space-y-3'>
					{FAQ.map((f) => (
						<details key={f.q} className='rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm'>
							<summary className='cursor-pointer font-medium'>{f.q}</summary>
							<p className='mt-3 text-sm leading-relaxed text-zinc-600'>{f.a}</p>
						</details>
					))}
				</div>
			</section>

			<section className='border-t border-zinc-100'>
				<div className='mx-auto max-w-3xl px-4 py-16 text-center'>
					<h2 className='text-2xl font-bold tracking-tight'>Stop typing the code</h2>
					<p className='mx-auto mt-3 max-w-xl text-zinc-600'>
						$47, lifetime access to the lessons, the starter repo and $5 in API credits.
					</p>
					{ON_SALE ? (
					<BuyButton
						href={BUY_URL}
						className='mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700'
					>
						Get the course for $47
					</BuyButton>
					) : (
						<span className='inline-block rounded-xl bg-zinc-100 px-6 py-3 text-base font-semibold text-zinc-500'>Enrollment opens soon</span>
					)}
					<p className='mt-6 text-xs text-zinc-400'>
						Questions? Email assistant@parsity.io
					</p>
				</div>
			</section>
		</main>
	);
}
