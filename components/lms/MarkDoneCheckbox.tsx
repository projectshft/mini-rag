'use client';

import { useState, useTransition } from 'react';
import { toggleDay } from '@/app/learn/actions';

/**
 * Optimistic "mark as done" toggle. Updates the UI immediately, then
 * persists via the server action; reverts on failure.
 */
export function MarkDoneCheckbox({
	slug,
	initialDone,
}: {
	slug: string;
	initialDone: boolean;
}) {
	const [done, setDone] = useState(initialDone);
	const [pending, startTransition] = useTransition();

	function onToggle(next: boolean) {
		setDone(next);
		startTransition(async () => {
			try {
				await toggleDay(slug, next);
			} catch {
				setDone(!next); // revert
			}
		});
	}

	return (
		<label
			className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
				done
					? 'border-emerald-300 bg-emerald-50 text-emerald-700'
					: 'border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-indigo-400'
			} ${pending ? 'opacity-60' : ''}`}
		>
			<input
				type='checkbox'
				className='h-4 w-4 accent-emerald-500'
				checked={done}
				disabled={pending}
				onChange={(e) => onToggle(e.target.checked)}
			/>
			{done ? 'Completed' : 'Mark as done'}
		</label>
	);
}
