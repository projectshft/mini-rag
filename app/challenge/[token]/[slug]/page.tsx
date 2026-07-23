import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
	getChallengePage,
	getChallengePages,
	isValidChallengeToken,
} from '@/lib/lms/challenge';
import { LessonMarkdown } from '@/components/lms/LessonMarkdown';

// One part of the AI Build Challenge. Same chrome and markdown pipeline as
// /learn lessons (badges, prose, interactive islands), minus everything that
// needs an account: no MarkDoneCheckbox, no progress rows — these pages are
// public-by-token and stateless.
export default async function ChallengePartPage({
	params,
}: {
	params: Promise<{ token: string; slug: string }>;
}) {
	const { token, slug } = await params;
	if (!isValidChallengeToken(token)) notFound();

	const [page, pages] = await Promise.all([getChallengePage(slug), getChallengePages()]);
	if (!page) notFound();

	const idx = pages.findIndex((p) => p.slug === slug);
	const prev = idx > 0 ? pages[idx - 1] : null;
	const next = idx >= 0 && idx < pages.length - 1 ? pages[idx + 1] : null;

	return (
		<article className='challenge-rise'>
			<Link
				href={`/challenge/${token}`}
				className='text-sm font-medium text-zinc-400 hover:text-zinc-600'
			>
				← All parts
			</Link>

			<header className='mt-4 border-b border-zinc-200 pb-6'>
				<div className='flex flex-wrap items-center gap-2 text-sm text-zinc-500'>
					<span className='rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700'>
						Part {idx + 1}/{pages.length}
					</span>
					{page.time && <span className='text-xs text-zinc-400'>· {page.time}</span>}
				</div>
				<h1 className='mt-2 text-[26px] font-bold leading-tight tracking-tight text-zinc-900'>
					{page.title}
				</h1>
			</header>

			<div className='mt-8'>
				<LessonMarkdown body={page.body} />
			</div>

			<nav className='mt-10 flex items-center justify-between gap-4 border-t border-zinc-200 pt-6 text-sm'>
				{prev ? (
					<Link
						href={`/challenge/${token}/${prev.slug}`}
						className='max-w-[45%] truncate font-medium text-blue-600 hover:text-blue-800'
					>
						← {prev.title}
					</Link>
				) : (
					<span />
				)}
				{next ? (
					<Link
						href={`/challenge/${token}/${next.slug}`}
						className='max-w-[45%] truncate text-right font-medium text-blue-600 hover:text-blue-800'
					>
						{next.title} →
					</Link>
				) : (
					<Link
						href={`/challenge/${token}`}
						className='text-right font-medium text-blue-600 hover:text-blue-800'
					>
						Back to the overview →
					</Link>
				)}
			</nav>
		</article>
	);
}
