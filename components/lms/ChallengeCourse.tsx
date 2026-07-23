'use client';

import { useEffect, useRef, useState } from 'react';
import { LessonMarkdown } from './LessonMarkdown';

// The whole AI Advisor Challenge on one page. Five steps, rendered with the
// same LessonMarkdown pipeline as the LMS (so quizzes, match/blanks, mermaid,
// and visuals all work), plus a stepper you can click around freely.
//
// Progress lives in localStorage only — no account, no server. Keyed by the
// access token so different unlisted links track independently. We store the
// set of completed step slugs and the last-active step, and restore both on
// return.

export type CourseStep = {
	slug: string;
	title: string;
	teaser: string;
	time: string;
	body: string;
};

const CTA_COHORT = 'https://parsity.io/ai-dev';
const CTA_CALL =
	'https://calendly.com/brianjenney83/15-minute-meeting-your-web-dev-roadmap-clone';

export function ChallengeCourse({ steps, token }: { steps: CourseStep[]; token: string }) {
	const storageKey = `advisor-challenge:${token}`;
	const [active, setActive] = useState(0);
	const [done, setDone] = useState<Set<string>>(new Set());
	const [hydrated, setHydrated] = useState(false);
	const topRef = useRef<HTMLDivElement>(null);

	// Restore progress on mount.
	useEffect(() => {
		try {
			const raw = localStorage.getItem(storageKey);
			if (raw) {
				const saved = JSON.parse(raw) as { done?: string[]; active?: string };
				if (Array.isArray(saved.done)) setDone(new Set(saved.done));
				const idx = steps.findIndex((s) => s.slug === saved.active);
				if (idx >= 0) setActive(idx);
			}
		} catch {
			/* ignore corrupt/absent storage */
		}
		setHydrated(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Persist after hydration (so we never overwrite saved state with defaults).
	useEffect(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(
				storageKey,
				JSON.stringify({ done: [...done], active: steps[active]?.slug })
			);
		} catch {
			/* storage full / disabled — progress just won't persist */
		}
	}, [done, active, hydrated, steps, storageKey]);

	const step = steps[active];
	const total = steps.length;
	const completed = steps.filter((s) => done.has(s.slug)).length;
	const pct = total ? Math.round((completed / total) * 100) : 0;

	function goTo(idx: number) {
		setActive(idx);
		topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function markDone(slug: string, value: boolean) {
		setDone((prev) => {
			const next = new Set(prev);
			if (value) next.add(slug);
			else next.delete(slug);
			return next;
		});
	}

	function completeAndAdvance() {
		markDone(step.slug, true);
		if (active < total - 1) goTo(active + 1);
	}

	const isDone = done.has(step.slug);

	return (
		<div ref={topRef} className='lg:grid lg:grid-cols-[240px_1fr] lg:gap-8'>
			{/* ── Stepper ─────────────────────────────────────────── */}
			<aside className='lg:sticky lg:top-20 lg:self-start'>
				<div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
					<div className='flex items-center justify-between text-xs'>
						<span className='font-semibold text-zinc-700'>Your progress</span>
						<span className='font-semibold text-zinc-900'>{pct}%</span>
					</div>
					<div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100'>
						<div
							className='h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500'
							style={{ width: `${pct}%` }}
						/>
					</div>
					<p className='mt-1.5 text-[11px] text-zinc-400'>
						{completed} of {total} steps · saved on this device
					</p>

					<ol className='mt-4 space-y-1'>
						{steps.map((s, i) => {
							const stepDone = done.has(s.slug);
							const current = i === active;
							return (
								<li key={s.slug}>
									<button
										type='button'
										onClick={() => goTo(i)}
										aria-current={current ? 'step' : undefined}
										className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors ${
											current
												? 'bg-blue-50 font-semibold text-blue-700'
												: 'text-zinc-600 hover:bg-zinc-50'
										}`}
									>
										<span
											className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
												stepDone
													? 'bg-emerald-500 text-white'
													: current
														? 'border border-blue-500 bg-white text-blue-600'
														: 'border border-zinc-200 bg-white text-zinc-400'
											}`}
											aria-hidden
										>
											{stepDone ? '✓' : i + 1}
										</span>
										<span className='min-w-0 flex-1 truncate'>{s.title}</span>
									</button>
								</li>
							);
						})}
					</ol>
				</div>

				{/* Persistent plug */}
				<div className='mt-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm'>
					<p className='text-sm font-semibold text-zinc-800'>Ready to go pro?</p>
					<p className='mt-1 text-xs leading-relaxed text-zinc-500'>
						Vector databases, embeddings, evals — the production skills AI startups
						hire for.
					</p>
					<a
						href={CTA_COHORT}
						target='_blank'
						rel='noreferrer'
						className='mt-3 block rounded-xl bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-blue-700'
					>
						AI Developer Cohort →
					</a>
					<a
						href={CTA_CALL}
						target='_blank'
						rel='noreferrer'
						className='mt-2 block rounded-xl border border-zinc-200 px-3 py-2 text-center text-xs font-semibold text-zinc-600 transition-colors hover:border-blue-300 hover:text-blue-700'
					>
						Book 15 min with Brian
					</a>
				</div>
			</aside>

			{/* ── Active step ─────────────────────────────────────── */}
			<article key={step.slug} className='challenge-rise mt-8 min-w-0 lg:mt-0'>
				<header className='border-b border-zinc-200 pb-6'>
					<div className='flex flex-wrap items-center gap-2 text-sm text-zinc-500'>
						<span className='rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700'>
							Step {active + 1} of {total}
						</span>
						{step.time && <span className='text-xs text-zinc-400'>· {step.time}</span>}
						{isDone && (
							<span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700'>
								✓ Complete
							</span>
						)}
					</div>
					<h1 className='mt-2 text-[26px] font-bold leading-tight tracking-tight text-zinc-900'>
						{step.title}
					</h1>
				</header>

				<div className='mt-8'>
					<LessonMarkdown body={step.body} />
				</div>

				{/* Footer nav */}
				<div className='mt-10 flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between'>
					<label className='flex cursor-pointer items-center gap-2 text-sm text-zinc-600'>
						<input
							type='checkbox'
							checked={isDone}
							onChange={(e) => markDone(step.slug, e.target.checked)}
							className='h-4 w-4 cursor-pointer accent-emerald-500'
						/>
						Mark this step complete
					</label>

					<div className='flex items-center gap-2'>
						{active > 0 && (
							<button
								type='button'
								onClick={() => goTo(active - 1)}
								className='cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-800'
							>
								← Back
							</button>
						)}
						{active < total - 1 ? (
							<button
								type='button'
								onClick={completeAndAdvance}
								className='cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
							>
								{isDone ? 'Next step →' : 'Complete & continue →'}
							</button>
						) : (
							<button
								type='button'
								onClick={() => markDone(step.slug, true)}
								className='cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700'
							>
								{completed === total ? '🎉 All done!' : 'Finish the challenge ✓'}
							</button>
						)}
					</div>
				</div>
			</article>
		</div>
	);
}
