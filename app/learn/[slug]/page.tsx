import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDay, getDays } from '@/lib/lms/curriculum';
import { ensureStudent, getCompletedSlugs } from '@/lib/lms/progress';
import { LessonMarkdown } from '@/components/lms/LessonMarkdown';
import { MarkDoneCheckbox } from '@/components/lms/MarkDoneCheckbox';

export default async function DayPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const [day, days] = await Promise.all([getDay(slug), getDays()]);
	if (!day) notFound();

	const userId = await ensureStudent();
	const completed = userId ? await getCompletedSlugs(userId) : new Set<string>();
	const isDone = completed.has(slug);

	// Prev/next by global curriculum order (rest days have no pages).
	const idx = days.findIndex((d) => d.slug === slug);
	const prev = idx > 0 ? days[idx - 1] : null;
	const next = idx >= 0 && idx < days.length - 1 ? days[idx + 1] : null;
	const title = day.title.replace(/^Day \d+\s*[—–-]\s*/, '');

	return (
		<article>
			<Link href='/learn' className='text-sm font-medium text-zinc-400 hover:text-zinc-600'>
				← All days
			</Link>

			<header className='mt-4 border-b border-zinc-200 pb-6'>
				<div className='flex flex-wrap items-center gap-2 text-sm text-zinc-500'>
					<span className='rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700'>
						Day {day.day}
					</span>
					<span className='text-xs text-zinc-400'>Week {day.week}</span>
					{day.time && <span className='text-xs text-zinc-400'>· {day.time}</span>}
					{day.isDeliverable && (
						<span className='rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700'>
							🎥 Assignment due
						</span>
					)}
				</div>
				<h1 className='mt-2 text-[26px] font-bold leading-tight tracking-tight text-zinc-900'>
					{title}
				</h1>
				<div className='mt-4'>
					<MarkDoneCheckbox slug={slug} initialDone={isDone} />
				</div>
			</header>

			<div className='mt-8'>
				<LessonMarkdown body={day.body} />
			</div>

			<nav className='mt-12 flex items-center justify-between gap-4 border-t border-zinc-200 pt-5 text-sm'>
				{prev ? (
					<Link
						href={`/learn/${prev.slug}`}
						className='max-w-[45%] truncate font-medium text-indigo-600 hover:text-indigo-800'
					>
						← Day {prev.day}
					</Link>
				) : (
					<span />
				)}
				{next ? (
					<Link
						href={`/learn/${next.slug}`}
						className='max-w-[45%] truncate text-right font-medium text-indigo-600 hover:text-indigo-800'
					>
						Day {next.day} →
					</Link>
				) : (
					<span />
				)}
			</nav>
		</article>
	);
}
