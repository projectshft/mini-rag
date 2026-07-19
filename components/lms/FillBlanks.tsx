'use client';

import { useState } from 'react';

// Fill-in-the-blank code exercise. Authored as a ```blanks fence with JSON:
//
//   ```blanks
//   {
//     "title": "Complete the selector's zod schema",
//     "note": "Optional hint line.",
//     "code": "const schema = z.object({\n  agent: z.___1___(['linkedin', 'rag']),\n  confidence: z.number().min(___2___).max(___3___)\n});",
//     "blanks": [
//       { "options": ["enum", "string", "union"], "answer": "enum", "explain": "…" },
//       { "options": ["0", "-1", "0.5"], "answer": "0", "explain": "…" },
//       { "options": ["1", "100", "10"], "answer": "1", "explain": "…" }
//     ]
//   }
//   ```
//
// ___N___ markers in `code` (1-indexed) become slots. Students pick an
// option per blank from pills below the code, then check. Per-blank ✓/✗
// with explanations. Ephemeral — resets on reload.

type Blank = { options: string[]; answer: string; explain?: string };
type BlanksData = { title?: string; note?: string; code: string; blanks: Blank[] };

export function FillBlanks({ source }: { source: string }) {
	const [picks, setPicks] = useState<Record<number, string>>({});
	const [checked, setChecked] = useState(false);

	let data: BlanksData;
	try {
		data = JSON.parse(source);
		if (!data.code || !Array.isArray(data.blanks) || data.blanks.length < 1) {
			throw new Error('bad shape');
		}
	} catch {
		return (
			<div className='not-prose rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600'>
				This blanks block has invalid JSON — check the lesson source.
			</div>
		);
	}

	// Split code on ___N___ markers, keeping the blank indices.
	const parts = data.code.split(/___(\d+)___/g);
	const allPicked = data.blanks.every((_, i) => picks[i]);
	const correctCount = data.blanks.filter((b, i) => picks[i] === b.answer).length;
	const allCorrect = checked && correctCount === data.blanks.length;

	function slotState(idx: number) {
		if (!checked) return picks[idx] ? 'picked' : 'empty';
		return picks[idx] === data.blanks[idx].answer ? 'right' : 'wrong';
	}

	const SLOT_CLS: Record<string, string> = {
		empty: 'border-dashed border-zinc-500 bg-zinc-800 text-zinc-400',
		picked: 'border-blue-400 bg-blue-500/20 text-blue-200',
		right: 'border-emerald-400 bg-emerald-500/20 text-emerald-300',
		wrong: 'border-red-400 bg-red-500/20 text-red-300',
	};

	return (
		<div className='not-prose my-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm'>
			<p className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>
				⌨️ {data.title ?? 'Fill in the blanks'}
			</p>
			{data.note && <p className='mt-1 text-xs text-zinc-400'>{data.note}</p>}

			{/* The code with slots */}
			<pre className='mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-[13px] leading-relaxed text-zinc-100'>
				<code>
					{parts.map((part, i) => {
						if (i % 2 === 0) return <span key={i}>{part}</span>;
						const idx = parseInt(part, 10) - 1;
						const blank = data.blanks[idx];
						if (!blank) return <span key={i}>___{part}___</span>;
						return (
							<span
								key={i}
								className={`mx-0.5 inline-block rounded-md border px-1.5 font-semibold ${SLOT_CLS[slotState(idx)]}`}
							>
								{picks[idx] ?? `?${idx + 1}`}
							</span>
						);
					})}
				</code>
			</pre>

			{/* Option pills per blank */}
			<div className='mt-3 space-y-2'>
				{data.blanks.map((blank, idx) => {
					const state = slotState(idx);
					return (
						<div key={idx} className='flex flex-wrap items-center gap-1.5'>
							<span className='w-8 shrink-0 text-xs font-semibold text-zinc-400'>
								?{idx + 1}
							</span>
							{blank.options.map((opt) => {
								const isPick = picks[idx] === opt;
								let cls = 'border-zinc-200 bg-white text-zinc-700 hover:border-blue-400';
								if (checked && opt === blank.answer) {
									cls = 'border-emerald-500 bg-emerald-50 text-emerald-800';
								} else if (checked && isPick) {
									cls = 'border-red-400 bg-red-50 text-red-600';
								} else if (isPick) {
									cls = 'border-blue-500 bg-blue-50 text-blue-800';
								}
								return (
									<button
										key={opt}
										type='button'
										disabled={checked}
										onClick={() => setPicks({ ...picks, [idx]: opt })}
										className={`cursor-pointer rounded-full border px-2.5 py-1 font-mono text-xs transition-colors disabled:cursor-default ${cls}`}
									>
										{opt}
									</button>
								);
							})}
							{checked && state === 'wrong' && blank.explain && (
								<span className='basis-full pl-8 text-xs text-zinc-500'>
									{blank.explain}
								</span>
							)}
						</div>
					);
				})}
			</div>

			{/* Actions / verdict */}
			<div className='mt-3 flex items-center gap-3'>
				{!checked ? (
					<button
						type='button'
						disabled={!allPicked}
						onClick={() => setChecked(true)}
						className='cursor-pointer rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-default disabled:opacity-40'
					>
						Check
					</button>
				) : (
					<>
						<p
							className={`text-sm font-semibold ${
								allCorrect ? 'text-emerald-600' : 'text-red-500'
							}`}
						>
							{allCorrect
								? '✓ Compiles clean'
								: `${correctCount}/${data.blanks.length} correct`}
						</p>
						<button
							type='button'
							onClick={() => {
								setPicks({});
								setChecked(false);
							}}
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
