'use client';

import { useState } from 'react';

/** Small copy-to-clipboard button used in the admin key table. */
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// clipboard unavailable — nothing to do
		}
	}

	return (
		<button
			type='button'
			onClick={copy}
			className='cursor-pointer rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-500 transition-colors hover:border-indigo-400 hover:text-indigo-700'
		>
			{copied ? '✓ Copied' : label}
		</button>
	);
}
