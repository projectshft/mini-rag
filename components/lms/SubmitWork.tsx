'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { mySubmissions, submitWork } from '@/app/learn/submit-actions';
import type { SubmissionView } from '@/lib/lms/submissions';

// Hand in a GitHub repo for automatic checking. Authored in a lesson as:
//
//   ```submit
//   assignment: first-test
//   ```
//
// The assignment id names a folder in the grader repo. The server reads it
// from the lesson file, so nothing the browser sends decides what gets graded.

const POLL_MS = 5000;

function when(iso: string) {
	return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function StatusPill({ status }: { status: string }) {
	const map: Record<string, [string, string]> = {
		queued: ['Checking', 'bg-blue-50 text-blue-700'],
		received: ['Received', 'bg-zinc-100 text-zinc-600'],
		passed: ['Passed', 'bg-emerald-50 text-emerald-700'],
		failed: ['Not yet', 'bg-amber-50 text-amber-700'],
		error: ['Couldn’t check', 'bg-red-50 text-red-700'],
	};
	const [label, cls] = map[status] ?? [status, 'bg-zinc-100 text-zinc-600'];
	return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}

function Report({ s }: { s: SubmissionView }) {
	if (s.status === 'queued') {
		return <p className='mt-2 text-sm text-zinc-500'>Running the tests on your repository. This usually takes a minute or two.</p>;
	}
	if (s.status === 'received') {
		return <p className='mt-2 text-sm text-zinc-500'>Saved. Automatic checking isn&rsquo;t switched on yet, so your mentor will look at this one.</p>;
	}
	const r = s.result;
	if (!r) return null;
	const failedHidden = (r.hidden ?? []).filter((h) => !h.ok);
	return (
		<div className='mt-2 space-y-2 text-sm text-zinc-700'>
			<p>{r.summary}</p>
			{r.visible && (
				<p className='text-zinc-600'>
					Your tests: {r.visible.passed} passed, {r.visible.failed} failed.
					{r.visible.note ? ` ${r.visible.note}` : ''}
				</p>
			)}
			{failedHidden.length > 0 && (
				<div>
					<p className='font-medium text-zinc-800'>Cases our tests found that yours didn&rsquo;t cover:</p>
					<ul className='mt-1 list-disc pl-5'>
						{failedHidden.map((h) => (
							<li key={h.category}>
								{h.category}
								{h.required ? '' : ' (stretch)'}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export function SubmitWork() {
	const slug = (usePathname() ?? '').split('/').filter(Boolean).pop() ?? '';
	const [items, setItems] = useState<SubmissionView[] | null>(null);
	const [url, setUrl] = useState('');
	const [error, setError] = useState('');
	const [busy, setBusy] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const load = useCallback(async () => {
		try {
			setItems(await mySubmissions(slug));
		} catch {
			setItems((prev) => prev ?? []);
		}
	}, [slug]);

	useEffect(() => {
		load();
	}, [load]);

	const latest = items?.[0];
	useEffect(() => {
		if (latest?.status !== 'queued') return;
		timer.current = setTimeout(load, POLL_MS);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [latest, load]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setBusy(true);
		try {
			const out = await submitWork(slug, url);
			if (!out.ok) setError(out.error);
			else {
				setUrl('');
				await load();
			}
		} catch {
			setError('Something went wrong sending that. Try again.');
		} finally {
			setBusy(false);
		}
	}

	const passed = items?.some((s) => s.status === 'passed');
	const checking = latest?.status === 'queued';

	return (
		<div className='not-prose my-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
			<div className='flex items-center justify-between gap-3'>
				<h3 className='text-base font-semibold text-zinc-900'>Hand it in</h3>
				{passed && <StatusPill status='passed' />}
			</div>
			<p className='mt-1 text-sm text-zinc-500'>
				Paste the link to your GitHub repository. It has to be public so the tests can read it.
			</p>
			<form onSubmit={onSubmit} className='mt-3 flex flex-col gap-2 sm:flex-row'>
				<label className='sr-only' htmlFor='repo-url'>
					GitHub repository link
				</label>
				<input
					id='repo-url'
					type='url'
					required
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder='https://github.com/your-username/your-repo'
					className='min-w-0 flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
				/>
				<button
					type='submit'
					disabled={busy || checking}
					className='rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
				>
					{busy ? 'Sending' : checking ? 'Checking' : passed ? 'Submit again' : 'Submit'}
				</button>
			</form>
			{error && (
				<p role='alert' className='mt-2 text-sm text-red-600'>
					{error}
				</p>
			)}

			{items && items.length > 0 && (
				<ol className='mt-4 space-y-3 border-t border-zinc-100 pt-4'>
					{items.map((s, i) => (
						<li key={s.id} className={i === 0 ? '' : 'opacity-70'}>
							<div className='flex flex-wrap items-center gap-2 text-xs text-zinc-500'>
								<StatusPill status={s.status} />
								<span>{when(s.createdAt)}</span>
								<a href={s.repoUrl} target='_blank' rel='noopener noreferrer' className='truncate underline hover:text-zinc-700'>
									{s.repoUrl.replace('https://github.com/', '')}
								</a>
							</div>
							{i === 0 && <Report s={s} />}
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
