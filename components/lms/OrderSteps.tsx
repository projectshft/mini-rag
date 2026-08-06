'use client';

import { useMemo, useState } from 'react';

// Put-the-steps-in-order exercise. Authored in the day markdown as:
//
//   ```order
//   title: Put the RAG pipeline in order
//   ---
//   Chunk the documents
//   Embed each chunk
//   Upsert vectors to Pinecone
//   Embed the user's question
//   Query Pinecone for nearest neighbors
//   Feed retrieved chunks + question to the LLM
//   ```
//
// Lines after `---` are the CORRECT order. The component presents them
// shuffled; the student taps steps in the order they think is right,
// then checks. Per-slot right/wrong feedback; tap a placed step to put
// it back. Self-check only — no grading, no persistence.

function parse(source: string): { title: string; steps: string[] } {
	const sep = source.indexOf('\n---');
	let title = 'Put the steps in order';
	let body = source;
	if (sep !== -1) {
		const head = source.slice(0, sep);
		title = /title:\s*(.+)/.exec(head)?.[1]?.trim() ?? title;
		body = source.slice(sep + 4);
	}
	const steps = body
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean);
	return { title, steps };
}

// Deterministic shuffle (seeded by content) so server and client render
// identically — and guaranteed not to present the already-correct order.
function shuffled(steps: string[]): string[] {
	let seed = steps.join('').split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);
	const rand = () => {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		return seed / 0x7fffffff;
	};
	const arr = [...steps];
	for (let tries = 0; tries < 10; tries++) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		if (arr.some((s, i) => s !== steps[i])) break;
	}
	return arr;
}

export function OrderSteps({ source }: { source: string }) {
	const { title, steps } = parse(source);
	const pool = useMemo(() => shuffled(steps), [source]); // eslint-disable-line react-hooks/exhaustive-deps
	const [placed, setPlaced] = useState<string[]>([]);
	const [checked, setChecked] = useState(false);

	if (steps.length < 3) {
		return (
			<div className='not-prose rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600'>
				This order block needs at least 3 steps — check the lesson source.
			</div>
		);
	}

	const remaining = pool.filter((s) => !placed.includes(s));
	const allPlaced = placed.length === steps.length;
	const correctCount = placed.filter((s, i) => s === steps[i]).length;
	const allCorrect = checked && correctCount === steps.length;

	function place(step: string) {
		if (checked) return;
		setPlaced([...placed, step]);
	}
	function unplace(step: string) {
		if (checked) return;
		setPlaced(placed.filter((s) => s !== step));
	}
	function reset() {
		setPlaced([]);
		setChecked(false);
	}

	return (
		<div className='not-prose my-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm'>
			<p className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>
				{title}
			</p>
			<p className='mt-1 text-xs text-zinc-400'>
				Tap the steps in the order they happen. Tap a placed step to put it back.
			</p>

			{/* Your order (slots) */}
			<ol className='mt-3 space-y-1.5'>
				{steps.map((_, i) => {
					const step = placed[i];
					if (!step) {
						return (
							<li
								key={`slot-${i}`}
								className='flex items-center gap-2.5 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/60 px-3 py-2 text-sm text-zinc-300'
							>
								<span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-400'>
									{i + 1}
								</span>
								…
							</li>
						);
					}
					const right = checked && step === steps[i];
					const wrong = checked && step !== steps[i];
					return (
						<li key={step}>
							<button
								type='button'
								onClick={() => unplace(step)}
								disabled={checked}
								className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
									right
										? 'border-emerald-500 bg-emerald-50 text-emerald-800'
										: wrong
											? 'border-red-400 bg-red-50 text-red-700'
											: 'cursor-pointer border-blue-200 bg-blue-50/60 text-zinc-800 hover:border-blue-400'
								}`}
							>
								<span
									className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
										right
											? 'bg-emerald-500 text-white'
											: wrong
												? 'bg-red-400 text-white'
												: 'bg-blue-500 text-white'
									}`}
								>
									{right ? '✓' : wrong ? '✗' : i + 1}
								</span>
								{step}
							</button>
						</li>
					);
				})}
			</ol>

			{/* Pool */}
			{remaining.length > 0 && (
				<div className='mt-3 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3'>
					{remaining.map((step) => (
						<button
							key={step}
							type='button'
							onClick={() => place(step)}
							className='cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-blue-400 hover:bg-blue-50/60'
						>
							{step}
						</button>
					))}
				</div>
			)}

			{/* Actions / verdict */}
			<div className='mt-3 flex items-center gap-3'>
				{!checked ? (
					<button
						type='button'
						disabled={!allPlaced}
						onClick={() => setChecked(true)}
						className='cursor-pointer rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-default disabled:opacity-40'
					>
						Check order
					</button>
				) : (
					<>
						<p
							className={`text-sm font-semibold ${
								allCorrect ? 'text-emerald-600' : 'text-red-500'
							}`}
						>
							{allCorrect
								? '✓ Perfect — that’s the pipeline'
								: `${correctCount}/${steps.length} in the right position`}
						</p>
						<button
							type='button'
							onClick={reset}
							className='cursor-pointer text-xs text-zinc-400 underline hover:text-zinc-600'
						>
							try again
						</button>
					</>
				)}
			</div>
		</div>
	);
}
