'use client';

import { useState } from 'react';

// Inline lesson quiz. Authored in the day markdown as a ```quiz fence
// containing JSON:
//
//   ```quiz
//   [
//     {
//       "q": "Why do we chunk documents before embedding them?",
//       "options": ["Embeddings have input limits and retrieval needs focused pieces", "Pinecone requires it", "It makes the text smaller on disk"],
//       "answer": 0,
//       "explain": "Retrieval returns chunks — smaller, focused chunks mean the LLM sees exactly the relevant context."
//     }
//   ]
//   ```
//
// Behavior: pick an option → Check → right answers confirm; wrong answers
// reveal the correct one. The explanation shows either way. No grading, no
// persistence — it's a self-check, not an exam.

type QuizQuestion = {
	q: string;
	options: string[];
	answer: number;
	explain?: string;
};

// Authors naturally write the correct option first, which makes position a
// tell. Shuffle at render, seeded by the question text so server and client
// agree (no hydration mismatch) and the order is stable across re-renders.
function shuffle(item: QuizQuestion) {
	let h = 0;
	for (let i = 0; i < item.q.length; i++) h = (Math.imul(31, h) + item.q.charCodeAt(i)) | 0;
	const order = item.options.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		h = (Math.imul(h, 1103515245) + 12345) | 0;
		const j = (h >>> 0) % (i + 1);
		[order[i], order[j]] = [order[j], order[i]];
	}
	return {
		options: order.map((i) => item.options[i]),
		answer: order.indexOf(item.answer),
	};
}

function QuizItem({ item, index }: { item: QuizQuestion; index: number }) {
	const [picked, setPicked] = useState<number | null>(null);
	const [checked, setChecked] = useState(false);

	const { options, answer } = shuffle(item);
	const correct = checked && picked === answer;
	const wrong = checked && picked !== null && picked !== answer;

	return (
		<div className='not-prose rounded-xl border border-zinc-200 bg-white p-4 shadow-sm'>
			<p className='mb-3 font-medium text-zinc-800'>
				{index + 1}. {item.q}
			</p>
			<div className='space-y-2'>
				{options.map((opt, i) => {
					const isPick = picked === i;
					const isAnswer = i === answer;
					let cls = 'border-zinc-200 hover:border-blue-400 cursor-pointer bg-white';
					if (checked && isAnswer) cls = 'border-emerald-500 bg-emerald-50';
					else if (checked && isPick && !isAnswer) cls = 'border-red-400 bg-red-50';
					else if (isPick) cls = 'border-blue-500 bg-blue-50 cursor-pointer';
					return (
						<button
							key={i}
							type='button'
							disabled={checked}
							onClick={() => setPicked(i)}
							className={`block w-full rounded-lg border px-3 py-2 text-left text-sm text-zinc-700 transition-colors ${cls}`}
						>
							{opt}
						</button>
					);
				})}
			</div>
			{!checked ? (
				<button
					type='button'
					disabled={picked === null}
					onClick={() => setChecked(true)}
					className='mt-3 cursor-pointer rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-default disabled:opacity-40'
				>
					Check answer
				</button>
			) : (
				<div className='mt-3 text-sm'>
					{correct ? (
						<p className='font-semibold text-emerald-600'>✓ Correct</p>
					) : wrong ? (
						<p className='font-semibold text-red-500'>
							✗ Not quite — the answer is &ldquo;{options[answer]}&rdquo;
						</p>
					) : null}
					{item.explain && <p className='mt-1 text-zinc-500'>{item.explain}</p>}
					<button
						type='button'
						onClick={() => {
							setPicked(null);
							setChecked(false);
						}}
						className='mt-2 cursor-pointer text-xs text-zinc-400 underline hover:text-zinc-600'
					>
						try again
					</button>
				</div>
			)}
		</div>
	);
}

export function Quiz({ source }: { source: string }) {
	let questions: QuizQuestion[];
	try {
		const parsed = JSON.parse(source);
		questions = Array.isArray(parsed) ? parsed : parsed.questions;
		if (!Array.isArray(questions)) throw new Error('no questions array');
	} catch {
		return (
			<div className='not-prose rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600'>
				This quiz block has invalid JSON — check the lesson source.
			</div>
		);
	}

	return (
		<div className='my-6 space-y-4'>
			<p className='not-prose text-xs font-semibold uppercase tracking-wide text-zinc-400'>
				✏️ Quick check
			</p>
			{questions.map((item, i) => (
				<QuizItem key={i} item={item} index={i} />
			))}
		</div>
	);
}
