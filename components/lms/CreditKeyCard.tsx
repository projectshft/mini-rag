import { CopyButton } from './CopyButton';

export function CreditKeyCard({
	apiKey,
	budget,
	baseUrl,
}: {
	apiKey: string;
	budget: number;
	baseUrl: string;
}) {
	const amount = Number.isInteger(budget) ? `$${budget}` : `$${budget.toFixed(2)}`;
	const envBlock = `OPENAI_API_KEY=${apiKey}\nOPENAI_BASE_URL=${baseUrl}`;

	return (
		<section className='mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm'>
			<div className='flex items-center justify-between gap-3'>
				<h2 className='text-sm font-semibold text-zinc-900'>Your {amount} in API credits</h2>
				<CopyButton text={envBlock} label='Copy' />
			</div>
			<pre className='mt-3 overflow-x-auto rounded-xl border border-zinc-200 bg-white px-4 py-3 font-mono text-xs leading-relaxed text-zinc-800 select-all'>
				{envBlock}
			</pre>
			<p className='mt-3 text-xs text-zinc-500'>
				Paste these two lines into the starter repo&rsquo;s <code className='font-mono'>.env</code> as{' '}
				<code className='font-mono'>OPENAI_API_KEY</code> and <code className='font-mono'>OPENAI_BASE_URL</code>; the key only works through this proxy.
			</p>
		</section>
	);
}
