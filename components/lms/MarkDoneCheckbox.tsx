'use client';

import { useRef, useState, useTransition } from 'react';
import { toggleDay } from '@/app/learn/actions';

// Confetti egg: a small burst when a day is marked done; a bigger, longer
// one on day-42 (it IS the answer to everything). No dependency — just
// absolutely-positioned spans thrown with random transforms and cleaned
// up after the animation. Colors stay in the site's blue family.
const CONFETTI_COLORS = ['#2563eb', '#0ea5e9', '#22d3ee', '#10b981', '#f59e0b'];

function burst(anchor: HTMLElement, big: boolean) {
	const n = big ? 90 : 24;
	const host = document.createElement('div');
	host.style.cssText =
		'position:absolute;left:50%;top:50%;pointer-events:none;z-index:60;';
	anchor.style.position = 'relative';
	anchor.appendChild(host);

	for (let i = 0; i < n; i++) {
		const s = document.createElement('span');
		const angle = Math.random() * Math.PI * 2;
		const dist = (big ? 180 : 80) * (0.4 + Math.random() * 0.6);
		const size = 4 + Math.random() * (big ? 6 : 4);
		s.style.cssText = `position:absolute;width:${size}px;height:${size * 0.6}px;` +
			`background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};border-radius:1px;` +
			`transform:translate(0,0) rotate(0deg);opacity:1;` +
			`transition:transform ${big ? 1.4 : 0.8}s cubic-bezier(.15,.6,.3,1), opacity ${big ? 1.4 : 0.8}s ease-out;`;
		host.appendChild(s);
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				s.style.transform = `translate(${Math.cos(angle) * dist}px, ${
					Math.sin(angle) * dist + (big ? 60 : 30)
				}px) rotate(${(Math.random() - 0.5) * 720}deg)`;
				s.style.opacity = '0';
			})
		);
	}
	setTimeout(() => host.remove(), big ? 1600 : 1000);
}

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
	const labelRef = useRef<HTMLLabelElement>(null);

	function onToggle(next: boolean) {
		setDone(next);
		if (next && labelRef.current) {
			burst(labelRef.current, slug === 'day-42');
		}
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
			ref={labelRef}
			className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
				done
					? 'border-emerald-300 bg-emerald-50 text-emerald-700'
					: 'border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-blue-400'
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
