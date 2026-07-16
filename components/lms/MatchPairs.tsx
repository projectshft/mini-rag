'use client';

import { useMemo, useState } from 'react';

// Tap-to-match exercise: pair each item on the left with its match from
// the pool. Authored as a ```match fence containing JSON:
//
//   ```match
//   {
//     "title": "Match the chunking strategy to the content",
//     "note": "Optional hint line.",
//     "pairs": [
//       { "left": "Confluence pages with clean headings", "right": "Structure-aware: split on headings" },
//       { "left": "Scanned PDF contracts", "right": "OCR first, then sentence-aware chunks" }
//     ]
//   }
//   ```
//
// Tap a row to select it, tap a pill to assign. Check locks correct rows;
// "try again" returns only the wrong ones to the pool. Ephemeral: no
// persistence, resets on reload.

type MatchData = {
	title?: string;
	note?: string;
	pairs: { left: string; right: string }[];
};

function seededShuffle(items: string[]): string[] {
	let seed = items.join('').split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 13);
	const rand = () => {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		return seed / 0x7fffffff;
	};
	const arr = [...items];
	for (let tries = 0; tries < 10; tries++) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		if (arr.some((s, i) => s !== items[i])) break;
	}
	return arr;
}

export function MatchPairs({ source }: { source: string }) {
	let data: MatchData;
	let parseError = false;
	try {
		data = JSON.parse(source);
		if (!Array.isArray(data.pairs) || data.pairs.length < 3) throw new Error('bad shape');
	} catch {
		parseError = true;
		data = { pairs: [] };
	}

	const pool = useMemo(
		() => seededShuffle(data.pairs.map((p) => p.right)),
		[source] // eslint-disable-line react-hooks/exhaustive-deps
	);
	const [assigned, setAssigned] = useState<(string | null)[]>(() =>
		data.pairs.map(() => null)
	);
	const [active, setActive] = useState(0);
	const [checked, setChecked] = useState(false);
	const [locked, setLocked] = useState<boolean[]>(() => data.pairs.map(() => false));

	if (parseError) {
		return (
			<div className='not-prose rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600'>
				This match block has invalid JSON (needs ≥ 3 pairs) — check the lesson source.
			</div>
		);
	}

	const remaining = pool.filter((r) => !assigned.includes(r));
	const allAssigned = assigned.every(Boolean);
	const correctCount = assigned.filter((r, i) => r === data.pairs[i].right).length;
	const allCorrect = checked && correctCount === data.pairs.length;

	function nextOpen(from: number, arr: (string | null)[]): number {
		for (let step = 0; step < arr.length; step++) {
			const i = (from + step) % arr.length;
			if (!arr[i] && !locked[i]) return i;
		}
		return from;
	}

	function assign(right: string) {
		if (checked || locked[active] || assigned[active]) return;
		const next = [...assigned];
		next[active] = right;
		setAssigned(next);
		setActive(nextOpen(active + 1, next));
	}

	function unassign(i: number) {
		if (checked || locked[i]) return;
		const next = [...assigned];
		next[i] = null;
		setAssigned(next);
		setActive(i);
	}

	function check() {
		setChecked(true);
		setLocked(assigned.map((r, i) => r === data.pairs[i].right));
	}

	function tryAgain() {
		const next = assigned.map((r, i) => (r === data.pairs[i].right ? r : null));
		setAssigned(next);
		setChecked(false);
		setActive(nextOpen(0, next));
	}

	return (
		<div className='not-prose my-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm'>
			<p className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>
				🔗 {data.title ?? 'Match the pairs'}
			</p>
			<p className='mt-1 text-xs text-zinc-400'>
				{data.note ?? 'Tap a row, then tap its match from the pool below.'}
			</p>

			<div className='mt-3 space-y-1.5'>
				{data.pairs.map((pair, i) => {
					const right = assigned[i];
					const isRight = checked && right === pair.right;
					const isWrong = checked && right !== null && right !== pair.right;
					const isActive = !checked && i === active && !right;
					return (
						<div
							key={pair.left}
							onClick={() => !checked && (right ? unassign(i) : setActive(i))}
							className={`flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2 transition-colors sm:flex-nowrap ${
								isRight
									? 'border-emerald-400 bg-emerald-50'
									: isWrong
										? 'border-red-300 bg-red-50'
										: isActive
											? 'border-indigo-400 bg-indigo-50/50 ring-1 ring-indigo-300'
											: 'border-zinc-200 hover:border-indigo-300'
							}`}
						>
							<span className='min-w-0 flex-1 text-sm font-medium text-zinc-800'>
								{isRight ? '✓ ' : isWrong ? '✗ ' : ''}
								{pair.left}
							</span>
							<span className='text-zinc-300' aria-hidden>→</span>
							{right ? (
								<span
									className={`rounded-full px-2.5 py-1 text-xs font-medium ${
										isRight
											? 'bg-emerald-100 text-emerald-800'
											: isWrong
												? 'bg-red-100 text-red-700'
												: 'bg-indigo-100 text-indigo-800'
									}`}
								>
									{right}
								</span>
							) : (
								<span className='rounded-full border border-dashed border-zinc-200 px-2.5 py-1 text-xs text-zinc-300'>
									{isActive ? 'pick a match ↓' : '…'}
								</span>
							)}
						</div>
					);
				})}
			</div>

			{remaining.length > 0 && (
				<div className='mt-3 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3'>
					{remaining.map((right) => (
						<button
							key={right}
							type='button'
							onClick={() => assign(right)}
							className='cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 transition-colors hover:border-indigo-400 hover:bg-indigo-50/60'
						>
							{right}
						</button>
					))}
				</div>
			)}

			<div className='mt-3 flex items-center gap-3'>
				{!checked ? (
					<button
						type='button'
						disabled={!allAssigned}
						onClick={check}
						className='cursor-pointer rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-default disabled:opacity-40'
					>
						Check matches
					</button>
				) : allCorrect ? (
					<p className='text-sm font-semibold text-emerald-600'>✓ All matched</p>
				) : (
					<>
						<p className='text-sm font-semibold text-red-500'>
							{correctCount}/{data.pairs.length} matched — correct ones are locked in
						</p>
						<button
							type='button'
							onClick={tryAgain}
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
