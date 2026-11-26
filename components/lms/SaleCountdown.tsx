'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function parts(ms: number) {
	const total = Math.max(0, Math.floor(ms / 1000));
	return {
		days: Math.floor(total / 86400),
		hours: Math.floor((total % 86400) / 3600),
		minutes: Math.floor((total % 3600) / 60),
		seconds: total % 60,
	};
}

const pad = (n: number) => String(n).padStart(2, '0');

export function SaleCountdown({
	endsAt,
	initialNow,
	children,
}: {
	endsAt: string;
	initialNow: number;
	children: React.ReactNode;
}) {
	const router = useRouter();
	const end = Date.parse(endsAt);
	const [now, setNow] = useState(initialNow);
	const remaining = end - now;
	const ended = remaining <= 0;

	useEffect(() => {
		setNow(Date.now());
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		if (ended) router.refresh();
	}, [ended, router]);

	if (ended) return null;
	const { days, hours, minutes, seconds } = parts(remaining);
	const units = [
		{ label: 'days', value: String(days) },
		{ label: 'hrs', value: pad(hours) },
		{ label: 'min', value: pad(minutes) },
		{ label: 'sec', value: pad(seconds) },
	];

	return (
		<div className='bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100' role='region' aria-label='Sale'>
			<div className='mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center'>
				<span>{children}</span>
				<span className='inline-flex items-center gap-1.5 font-mono tabular-nums' aria-live='off'>
					{units.map((u) => (
						<span key={u.label} className='rounded-md bg-zinc-800 px-1.5 py-0.5'>
							<span className='font-semibold text-white'>{u.value}</span>{' '}
							<span className='text-[11px] text-zinc-400'>{u.label}</span>
						</span>
					))}
				</span>
			</div>
		</div>
	);
}
