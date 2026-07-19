'use client';

import { useState } from 'react';

// An "AI-first" prompt block. Authored in the day markdown as:
//
//   ```ai-prompt
//   title: Quiz me on embeddings
//   ---
//   You are my strict-but-friendly AI tutor. I just finished a lesson on
//   embeddings. Ask me 5 questions one at a time...
//   ```
//
// The part before `---` is metadata (title: ...); the rest is the prompt.
// Students copy it into Claude (or any assistant) to get quizzed, get
// unstuck, or go deeper. The prompt text stays visible so they can read
// what they're about to run — reading good prompts is part of the course.

function parse(source: string): { title: string; prompt: string } {
	const sep = source.indexOf('\n---');
	if (sep !== -1) {
		const head = source.slice(0, sep);
		const title = /title:\s*(.+)/.exec(head)?.[1]?.trim() ?? 'Try this with your AI';
		return { title, prompt: source.slice(sep + 4).replace(/^\s+/, '') };
	}
	return { title: 'Try this with your AI', prompt: source.trim() };
}

export function AiPrompt({ source }: { source: string }) {
	const { title, prompt } = parse(source);
	const [copied, setCopied] = useState(false);
	const [expanded, setExpanded] = useState(false);

	const isLong = prompt.length > 420;
	const shown = expanded || !isLong ? prompt : prompt.slice(0, 420) + '…';

	async function copy() {
		try {
			await navigator.clipboard.writeText(prompt);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// clipboard unavailable — leave the text selectable
		}
	}

	return (
		<div className='not-prose my-6 overflow-hidden rounded-xl border border-cyan-200 bg-cyan-50/60'>
			<div className='flex items-center justify-between gap-3 border-b border-cyan-200 bg-cyan-100/60 px-4 py-2.5'>
				<p className='flex items-center gap-2 text-sm font-semibold text-cyan-900'>
					{title}
				</p>
				<button
					type='button'
					onClick={copy}
					className='shrink-0 cursor-pointer rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-700'
				>
					{copied ? '✓ Copied' : 'Copy prompt'}
				</button>
			</div>
			<pre className='m-0 max-h-none overflow-x-auto whitespace-pre-wrap bg-transparent px-4 py-3 font-sans text-[13.5px] leading-relaxed text-zinc-700'>
				{shown}
			</pre>
			{isLong && (
				<button
					type='button'
					onClick={() => setExpanded(!expanded)}
					className='block w-full cursor-pointer border-t border-cyan-200 px-4 py-2 text-left text-xs font-medium text-cyan-700 hover:bg-cyan-100/60'
				>
					{expanded ? 'Show less ▴' : 'Show full prompt ▾'}
				</button>
			)}
			<p className='border-t border-cyan-200 px-4 py-2 text-xs text-cyan-800/70'>
				Paste this into Claude (or your AI of choice) — working <em>with</em> AI is part of
				the course.
			</p>
		</div>
	);
}
