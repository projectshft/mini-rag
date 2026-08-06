'use client';

import { useState } from 'react';
import {
	QUESTIONS,
	RESULTS,
	CALENDLY_URL,
	type Bucket,
} from './quiz-data';

// Public, no-auth lead quiz. `.lms` opts out of the site-wide retro styles.
type Step = 'intro' | number | 'capture' | 'result';
type Result = { score: number; total: number; bucket: Bucket };

export default function AiInterviewQuiz() {
	const [step, setStep] = useState<Step>('intro');
	const [answers, setAnswers] = useState<number[]>([]);
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [result, setResult] = useState<Result | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	function pick(qIndex: number, optIndex: number) {
		const next = [...answers];
		next[qIndex] = optIndex;
		setAnswers(next);
		setStep(qIndex + 1 < QUESTIONS.length ? qIndex + 1 : 'capture');
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setSubmitting(true);
		try {
			const res = await fetch('/api/quiz-lead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, phone: phone || undefined, answers }),
			});
			if (!res.ok) throw new Error('bad response');
			setResult(await res.json());
			setStep('result');
		} catch {
			setError('Something went wrong — check your email and try again.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className='lms flex min-h-screen flex-col bg-zinc-50 text-zinc-900'>
			<header className='border-b border-zinc-200 bg-white'>
				<div className='mx-auto flex max-w-2xl items-center justify-between px-4 py-3'>
					<span className='text-sm font-bold tracking-tight'>
						Parsity <span className='text-blue-600'>·</span> AI Dev
					</span>
					<a
						href='https://parsity.io'
						target='_blank'
						rel='noreferrer'
						className='text-sm font-medium text-zinc-500 hover:text-zinc-900'
					>
						parsity.io
					</a>
				</div>
			</header>

			<main className='mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10'>
				{step === 'intro' && (
					<div className='rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm'>
						<h1 className='text-3xl font-bold leading-tight tracking-tight'>
							Would you pass an AI engineering interview?
						</h1>
						<p className='mt-4 text-zinc-600'>
							Seven questions, straight from real AI-engineering interviews — the
							ones where candidates were <em>told</em> to use AI and still
							washed out. Free, about two minutes, no gotchas.
						</p>
						<p className='mt-2 text-sm text-zinc-500'>
							You’ll enter an email at the end to see where you land.
						</p>
						<button
							onClick={() => setStep(0)}
							className='mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700'
						>
							Start the quiz
						</button>
					</div>
				)}

				{typeof step === 'number' && (
					<div className='rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm'>
						<div className='flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-400'>
							<span>
								Question {step + 1} of {QUESTIONS.length}
							</span>
							<span>{Math.round((step / QUESTIONS.length) * 100)}%</span>
						</div>
						<div className='mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100'>
							<div
								className='h-full rounded-full bg-blue-500 transition-all'
								style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
							/>
						</div>
						<h2 className='mt-6 text-lg font-semibold leading-snug'>
							{QUESTIONS[step].q}
						</h2>
						<div className='mt-5 space-y-3'>
							{QUESTIONS[step].options.map((opt, i) => (
								<button
									key={i}
									onClick={() => pick(step, i)}
									className='block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-700 transition-colors hover:border-blue-400 hover:bg-blue-50/40'
								>
									{opt.text}
								</button>
							))}
						</div>
						{step > 0 && (
							<button
								onClick={() => setStep(step - 1)}
								className='mt-5 text-sm font-medium text-zinc-400 hover:text-zinc-600'
							>
								← Back
							</button>
						)}
					</div>
				)}

				{step === 'capture' && (
					<form
						onSubmit={submit}
						className='rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm'
					>
						<h2 className='text-2xl font-bold tracking-tight'>
							Where should we send your result?
						</h2>
						<p className='mt-2 text-sm text-zinc-500'>
							Enter your email to see how you did. Phone is optional — only if
							you’d like us to reach out about it.
						</p>
						<label className='mt-6 block text-sm font-medium text-zinc-700'>
							Email
							<input
								type='email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='you@example.com'
								className='mt-1 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500'
							/>
						</label>
						<label className='mt-4 block text-sm font-medium text-zinc-700'>
							Phone <span className='font-normal text-zinc-400'>(optional)</span>
							<input
								type='tel'
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder='+1 555 123 4567'
								className='mt-1 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500'
							/>
						</label>
						{error && <p className='mt-3 text-sm text-red-600'>{error}</p>}
						<button
							type='submit'
							disabled={submitting}
							className='mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60'
						>
							{submitting ? 'Scoring…' : 'See my result'}
						</button>
					</form>
				)}

				{step === 'result' && result && (
					<div className='rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm'>
						<p className='text-xs font-semibold uppercase tracking-wide text-blue-600'>
							Your result · {result.score}/{result.total}
						</p>
						<h2 className='mt-2 text-3xl font-bold tracking-tight'>
							{RESULTS[result.bucket].title}
						</h2>
						<p className='mt-4 text-zinc-600'>{RESULTS[result.bucket].blurb}</p>
						<div className='mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-5'>
							<p className='font-semibold text-zinc-900'>
								Want to go over your result with a human?
							</p>
							<p className='mt-1 text-sm text-zinc-600'>
								Book a free 15-minute call — we’ll walk through where you’d
								stand and what to sharpen before your next interview.
							</p>
							<a
								href={CALENDLY_URL}
								target='_blank'
								rel='noreferrer'
								className='mt-4 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700'
							>
								Book a call
							</a>
						</div>
						<a
							href='https://parsity.io/ai-dev'
							target='_blank'
							rel='noreferrer'
							className='mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800'
						>
							Or learn how we train AI engineers →
						</a>
					</div>
				)}
			</main>
		</div>
	);
}
