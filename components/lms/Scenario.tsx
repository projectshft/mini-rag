'use client';

import { useState } from 'react';

// Workplace-scenario exercise: someone at work asks a nebulous question,
// the student picks the reply they'd actually give, and gets graded
// feedback. Often several answers are defensible — verdicts say which is
// strongest and why. Authored as a ```scenario fence containing JSON:
//
//   ```scenario
//   {
//     "who": "Your manager",
//     "setting": "Sprint planning. The vector DB line item is being questioned.",
//     "ask": "Why don't we just fine-tune a model on our docs instead of building all this RAG stuff?",
//     "note": "More than one answer is defensible — pick the one YOU'D say.",
//     "options": [
//       { "text": "...", "verdict": "best", "feedback": "..." },
//       { "text": "...", "verdict": "ok",   "feedback": "..." },
//       { "text": "...", "verdict": "weak", "feedback": "..." }
//     ],
//     "debrief": "Optional wrap-up shown after any pick."
//   }
//   ```
//
// verdicts: "best" (the strongest answer) · "ok" (defensible, weaker) ·
// "weak" (trap — sounds plausible, doesn't survive follow-ups).
// Ephemeral by design: no persistence, resets on reload.

type ScenarioOption = {
	text: string;
	verdict: 'best' | 'ok' | 'weak';
	feedback: string;
};

type ScenarioData = {
	who?: string;
	setting?: string;
	ask: string;
	note?: string;
	options: ScenarioOption[];
	debrief?: string;
};

const VERDICT = {
	best: {
		label: '★ Strong answer',
		banner: 'border-emerald-300 bg-emerald-50 text-emerald-800',
		chip: 'bg-emerald-100 text-emerald-700',
	},
	ok: {
		label: '~ Defensible, but weaker',
		banner: 'border-amber-300 bg-amber-50 text-amber-800',
		chip: 'bg-amber-100 text-amber-700',
	},
	weak: {
		label: '✗ Careful — this one backfires',
		banner: 'border-red-300 bg-red-50 text-red-700',
		chip: 'bg-red-100 text-red-600',
	},
} as const;

export function Scenario({ source }: { source: string }) {
	const [picked, setPicked] = useState<number | null>(null);
	const [showOthers, setShowOthers] = useState(false);

	let data: ScenarioData;
	try {
		data = JSON.parse(source);
		if (!data.ask || !Array.isArray(data.options) || data.options.length < 2) {
			throw new Error('bad shape');
		}
	} catch {
		return (
			<div className='not-prose rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600'>
				This scenario block has invalid JSON — check the lesson source.
			</div>
		);
	}

	const chosen = picked !== null ? data.options[picked] : null;

	return (
		<div className='not-prose my-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm'>
			<p className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>
				💼 On the job
			</p>
			{data.setting && <p className='mt-1 text-xs italic text-zinc-400'>{data.setting}</p>}

			{/* The ask, as a chat bubble */}
			<div className='mt-3 flex items-start gap-2.5'>
				<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-base' aria-hidden>
					🧑‍💼
				</span>
				<div className='rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2.5'>
					<p className='text-xs font-semibold text-zinc-500'>{data.who ?? 'Your manager'}</p>
					<p className='mt-0.5 text-sm text-zinc-800'>&ldquo;{data.ask}&rdquo;</p>
				</div>
			</div>

			{picked === null ? (
				<>
					<p className='mt-4 text-xs font-medium text-zinc-400'>
						{data.note ?? 'What do you say? Pick the reply you’d actually give.'}
					</p>
					<div className='mt-2 space-y-2'>
						{data.options.map((opt, i) => (
							<button
								key={i}
								type='button'
								onClick={() => setPicked(i)}
								className='block w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:border-blue-400 hover:bg-blue-50/40'
							>
								{opt.text}
							</button>
						))}
					</div>
				</>
			) : (
				<>
					{/* Your reply bubble */}
					<div className='mt-3 flex items-start justify-end gap-2.5'>
						<div className='rounded-2xl rounded-tr-sm bg-blue-600 px-3.5 py-2.5 text-sm text-white'>
							{chosen!.text}
						</div>
						<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base' aria-hidden>
							🧑‍💻
						</span>
					</div>

					{/* Verdict + feedback */}
					<div className={`mt-3 rounded-lg border px-3.5 py-2.5 text-sm ${VERDICT[chosen!.verdict].banner}`}>
						<p className='font-semibold'>{VERDICT[chosen!.verdict].label}</p>
						<p className='mt-1'>{chosen!.feedback}</p>
					</div>

					{data.debrief && (
						<p className='mt-2.5 border-l-2 border-zinc-200 pl-3 text-sm text-zinc-500'>
							{data.debrief}
						</p>
					)}

					{/* The other replies, annotated */}
					{!showOthers ? (
						<button
							type='button'
							onClick={() => setShowOthers(true)}
							className='mt-3 cursor-pointer text-xs font-medium text-blue-600 underline hover:text-blue-800'
						>
							How do the other replies land?
						</button>
					) : (
						<div className='mt-3 space-y-2 border-t border-zinc-100 pt-3'>
							{data.options.map((opt, i) =>
								i === picked ? null : (
									<div key={i} className='rounded-lg border border-zinc-100 bg-zinc-50/60 px-3.5 py-2.5'>
										<p className='text-sm text-zinc-600'>&ldquo;{opt.text}&rdquo;</p>
										<p className='mt-1.5 text-xs'>
											<span className={`rounded-full px-2 py-0.5 font-semibold ${VERDICT[opt.verdict].chip}`}>
												{VERDICT[opt.verdict].label}
											</span>
										</p>
										<p className='mt-1.5 text-xs text-zinc-500'>{opt.feedback}</p>
									</div>
								)
							)}
						</div>
					)}

					<button
						type='button'
						onClick={() => {
							setPicked(null);
							setShowOthers(false);
						}}
						className='mt-3 block cursor-pointer text-xs text-zinc-400 underline hover:text-zinc-600'
					>
						reset scenario
					</button>
				</>
			)}
		</div>
	);
}
