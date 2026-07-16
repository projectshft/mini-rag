import Link from 'next/link';
import { getDays, getWeeks } from '@/lib/lms/curriculum';
import { ensureStudent, getCompletedSlugs } from '@/lib/lms/progress';

export default async function LearnPage() {
	const userId = await ensureStudent();
	const [weeks, days, completed] = await Promise.all([
		getWeeks(),
		getDays(),
		userId ? getCompletedSlugs(userId) : Promise.resolve(new Set<string>()),
	]);

	const total = days.length;
	const done = days.filter((d) => completed.has(d.slug)).length;
	const pct = total ? Math.round((done / total) * 100) : 0;

	// The first not-yet-completed day, for the "continue" nudge.
	const nextUp = days.find((d) => !completed.has(d.slug));

	return (
		<div>
			<h1 className='text-2xl font-bold tracking-tight text-zinc-900'>Your course</h1>
			<p className='mt-1 text-sm text-zinc-500'>
				42 days · 1–2 hours a day · 6 days on, 1 day off
			</p>

			<div className='mt-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
				<div className='flex items-center justify-between text-sm'>
					<span className='font-medium text-zinc-700'>
						{done} / {total} days complete
					</span>
					<span className='font-semibold text-zinc-900'>{pct}%</span>
				</div>
				<div className='mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100'>
					<div
						className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all'
						style={{ width: `${pct}%` }}
					/>
				</div>
				{nextUp && (
					<Link
						href={`/learn/${nextUp.slug}`}
						className='mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700'
					>
						{done === 0 ? 'Start Day 1' : `Continue with Day ${nextUp.day}`} →
					</Link>
				)}
			</div>

			<div className='mt-10 space-y-10'>
				{weeks.map((week) => {
					const weekDays = week.entries.filter((e) => e.kind === 'day');
					const weekDone = weekDays.filter(
						(e) => e.kind === 'day' && completed.has(e.dayInfo.slug)
					).length;
					return (
						<section key={week.name}>
							<div className='flex items-baseline justify-between'>
								<h2 className='text-lg font-bold tracking-tight text-zinc-900'>
									{week.name}
								</h2>
								<span className='text-xs font-medium text-zinc-400'>
									{weekDone}/{weekDays.length} done
								</span>
							</div>
							<ul className='mt-3 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm'>
								{week.entries.map((entry) => {
									if (entry.kind === 'rest') {
										return (
											<li
												key={`rest-${entry.dayInfo.day}`}
												className='flex items-center gap-3 bg-zinc-50/60 px-4 py-3'
											>
												<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-400'>
													{entry.dayInfo.day}
												</span>
												<span className='text-sm text-zinc-400'>
													{entry.dayInfo.label}
												</span>
											</li>
										);
									}
									const d = entry.dayInfo;
									const isDone = completed.has(d.slug);
									return (
										<li key={d.slug}>
											<Link
												href={`/learn/${d.slug}`}
												className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-indigo-50/40'
											>
												<span
													className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
														isDone
															? 'bg-emerald-500 text-white'
															: 'border border-zinc-200 bg-white text-zinc-500'
													}`}
													aria-hidden
												>
													{isDone ? '✓' : d.day}
												</span>
												<span className='min-w-0 flex-1'>
													<span className='block truncate text-sm font-medium text-zinc-800'>
														{d.title.replace(/^Day \d+\s*[—–-]\s*/, '')}
													</span>
													{d.time && (
														<span className='block text-xs text-zinc-400'>
															{d.time}
														</span>
													)}
												</span>
												{d.isDeliverable && (
													<span
														className='shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700'
														title='Assignment due — submit via the links in the lesson'
													>
														🎥 Assignment
													</span>
												)}
											</Link>
										</li>
									);
								})}
							</ul>
						</section>
					);
				})}
			</div>
		</div>
	);
}
