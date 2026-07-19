'use client';

import { useEffect, useState } from 'react';

// Live playground: run a SMALL real OpenAI call with YOUR class API key,
// right inside the lesson. Authored as a ```try-it fence with JSON:
//
//   ```try-it
//   { "kind": "embedding-similarity", "title": "Feel the meaning-space" }
//   { "kind": "temperature",          "title": "Same prompt, two temperatures" }
//   { "kind": "structured-output",    "title": "The selector, live" }
//   { "kind": "injection",            "title": "Poison a retrieval, watch the model obey" }
//   ```
//
// The key is the one the instructor mints in /admin (works only through
// the class LiteLLM proxy, budget-capped). Stored in localStorage only —
// the server uses it for exactly one upstream call and never keeps it.

const KEY_STORAGE = 'parsity-class-key';

type Kind = 'embedding-similarity' | 'temperature' | 'structured-output' | 'injection';
type TryItData = { kind: Kind; title?: string; description?: string };

async function call(body: Record<string, unknown>) {
	const res = await fetch('/api/lms/try', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
	return data;
}

function KeyRow({ apiKey, setApiKey }: { apiKey: string; setApiKey: (k: string) => void }) {
	const [editing, setEditing] = useState(!apiKey);
	const [draft, setDraft] = useState('');

	if (!editing) {
		return (
			<p className='mt-2 text-xs text-zinc-400'>
				🔑 Using your class key{' '}
				<code className='rounded bg-zinc-100 px-1'>{apiKey.slice(0, 7)}…{apiKey.slice(-4)}</code>{' '}
				<button
					type='button'
					onClick={() => setEditing(true)}
					className='cursor-pointer underline hover:text-zinc-600'
				>
					change
				</button>
			</p>
		);
	}
	return (
		<div className='mt-2 flex flex-wrap items-center gap-2'>
			<input
				type='password'
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				placeholder='sk-… (your class API key)'
				className='min-w-52 flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 outline-none placeholder:text-zinc-300 focus:border-blue-400'
			/>
			<button
				type='button'
				onClick={() => {
					const k = draft.trim();
					if (!k) return;
					localStorage.setItem(KEY_STORAGE, k);
					setApiKey(k);
					setEditing(false);
					setDraft('');
				}}
				className='cursor-pointer rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700'
			>
				Save key
			</button>
			<p className='basis-full text-[11px] text-zinc-400'>
				This is the key your instructor emailed you ($-capped, only works through the class
				proxy). Saved in this browser only.
			</p>
		</div>
	);
}

function Spinner() {
	return <span className='inline-block animate-pulse text-zinc-400'>running…</span>;
}

export function TryIt({ source }: { source: string }) {
	const [apiKey, setApiKey] = useState('');
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const [result, setResult] = useState<Record<string, unknown> | null>(null);
	// per-kind inputs
	const [a, setA] = useState('the deploy failed on staging');
	const [b, setB] = useState('the release broke in the test environment');
	const [prompt, setPrompt] = useState('Give me a name for a coffee shop for programmers.');
	const [text, setText] = useState('Draft something spicy about tech interviews for my feed');
	const [question, setQuestion] = useState('How do I roll back a failed deploy?');

	useEffect(() => {
		setApiKey(localStorage.getItem(KEY_STORAGE) ?? '');
	}, []);

	let data: TryItData;
	try {
		data = JSON.parse(source);
		if (!data.kind) throw new Error('no kind');
	} catch {
		return (
			<div className='not-prose rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600'>
				This try-it block has invalid JSON — check the lesson source.
			</div>
		);
	}

	async function run(body: Record<string, unknown>) {
		setBusy(true);
		setError('');
		setResult(null);
		try {
			setResult(await call({ ...body, key: apiKey, kind: data.kind }));
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Something went wrong.');
		} finally {
			setBusy(false);
		}
	}

	const inputCls =
		'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-300 focus:border-blue-400';
	const runCls =
		'cursor-pointer rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-default disabled:opacity-40';

	return (
		<div className='not-prose my-6 rounded-xl border border-sky-200 bg-sky-50/40 p-4'>
			<p className='text-xs font-semibold uppercase tracking-wide text-sky-700'>
				⚡ Try it live{data.title ? ` — ${data.title}` : ''}
			</p>
			{data.description && <p className='mt-1 text-xs text-zinc-500'>{data.description}</p>}
			<p className='mt-1 text-xs text-zinc-400'>
				Real API call, your key, about a tenth of a cent.
			</p>
			<KeyRow apiKey={apiKey} setApiKey={setApiKey} />

			<div className='mt-3 space-y-2'>
				{data.kind === 'embedding-similarity' && (
					<>
						<input className={inputCls} value={a} onChange={(e) => setA(e.target.value)} placeholder='First text' />
						<input className={inputCls} value={b} onChange={(e) => setB(e.target.value)} placeholder='Second text' />
						<button type='button' disabled={busy || !apiKey} onClick={() => run({ a, b })} className={runCls}>
							Embed both &amp; compare
						</button>
						{result && (
							<div className='rounded-lg border border-zinc-200 bg-white p-3'>
								<div className='flex items-baseline justify-between text-sm'>
									<span className='font-medium text-zinc-700'>cosine similarity</span>
									<span className='text-lg font-bold tabular-nums text-zinc-900'>
										{(result.similarity as number).toFixed(4)}
									</span>
								</div>
								<div className='mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100'>
									<div
										className='h-full rounded-full bg-blue-500'
										style={{ width: `${Math.max(0, (result.similarity as number)) * 100}%` }}
									/>
								</div>
								<p className='mt-2 text-xs text-zinc-400'>
									{result.dimensions as number} dimensions · {result.model as string} ·{' '}
									{(result.similarity as number) > 0.6
										? 'these mean roughly the same thing'
										: (result.similarity as number) > 0.35
											? 'related, not equivalent'
											: 'far apart in meaning-space'}
								</p>
							</div>
						)}
					</>
				)}

				{data.kind === 'temperature' && (
					<>
						<input className={inputCls} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Your prompt' />
						<button type='button' disabled={busy || !apiKey} onClick={() => run({ prompt })} className={runCls}>
							Run at temp 0.0 and 1.4
						</button>
						{result && (
							<div className='grid gap-2 sm:grid-cols-2'>
								<div className='rounded-lg border border-zinc-200 bg-white p-3'>
									<p className='text-xs font-bold text-sky-700'>🧊 temperature 0.0</p>
									<p className='mt-1.5 whitespace-pre-wrap text-sm text-zinc-700'>{result.cold as string}</p>
								</div>
								<div className='rounded-lg border border-zinc-200 bg-white p-3'>
									<p className='text-xs font-bold text-amber-600'>🔥 temperature 1.4</p>
									<p className='mt-1.5 whitespace-pre-wrap text-sm text-zinc-700'>{result.hot as string}</p>
								</div>
								<p className='text-xs text-zinc-400 sm:col-span-2'>
									Run it again — the cold side should barely move; the hot side reinvents itself.
								</p>
							</div>
						)}
					</>
				)}

				{data.kind === 'structured-output' && (
					<>
						<input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder='A message for the selector to route' />
						<button type='button' disabled={busy || !apiKey} onClick={() => run({ text })} className={runCls}>
							Route it (strict JSON schema)
						</button>
						{result && (
							<div className='rounded-lg border border-zinc-200 bg-white p-3'>
								<pre className='overflow-x-auto whitespace-pre-wrap text-xs text-zinc-700'>
									{JSON.stringify(result.parsed ?? result.raw, null, 2)}
								</pre>
								<p className={`mt-2 text-xs font-semibold ${result.valid ? 'text-emerald-600' : 'text-red-500'}`}>
									{result.valid
										? '✓ Valid against the schema — no string parsing, no surprises'
										: '✗ Did not validate — this is what the zod safety net is for'}
								</p>
							</div>
						)}
					</>
				)}

				{data.kind === 'injection' && (
					<>
						<details className='rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-500'>
							<summary className='cursor-pointer font-medium text-zinc-600'>
								📄 The retrieved document (contains a hidden instruction)
							</summary>
							<pre className='mt-2 overflow-x-auto whitespace-pre-wrap'>{(result?.doc as string) ?? 'Run it once to see the document the model will read.'}</pre>
						</details>
						<input className={inputCls} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder='Your innocent question' />
						<button type='button' disabled={busy || !apiKey} onClick={() => run({ question })} className={runCls}>
							Ask with the poisoned context
						</button>
						{result && (
							<div className='rounded-lg border border-zinc-200 bg-white p-3'>
								<p className='whitespace-pre-wrap text-sm text-zinc-700'>{result.answer as string}</p>
								<p
									className={`mt-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
										result.leaked
											? 'bg-red-50 text-red-600'
											: 'bg-emerald-50 text-emerald-700'
									}`}
								>
									{result.leaked
										? '⚠️ The injection WORKED — the model obeyed an instruction hidden in retrieved data. This is why you validate content before indexing it.'
										: '✓ The model resisted it this time. Run it again — injection is probabilistic, which is exactly why "it seemed fine in testing" is not a defense.'}
								</p>
							</div>
						)}
					</>
				)}
			</div>

			{busy && <p className='mt-2 text-sm'><Spinner /></p>}
			{error && <p className='mt-2 text-sm font-medium text-red-500'>{error}</p>}
		</div>
	);
}
