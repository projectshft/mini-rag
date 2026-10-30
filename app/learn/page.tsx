import Link from 'next/link';
import {
	getBonusLessons,
	getDays,
	getInterviewLessons,
	getTracks,
	getWeeks,
	trackSlug,
} from '@/lib/lms/curriculum';
import {
	ensureStudent,
	getCompletedSlugs,
	isInterviewUnlocked,
} from '@/lib/lms/progress';
import { ensureCreditKey, getAccess, isTrackAllowed } from '@/lib/lms/access';
import { litellmProxyUrl } from '@/lib/lms/litellm';
import { lmsPrisma } from '@/lib/lms/prisma';
import { CreditKeyCard } from '@/components/lms/CreditKeyCard';

export default async function LearnPage({
	searchParams,
}: {
	searchParams: Promise<{ track?: string }>;
}) {
	const userId = await ensureStudent();
	const access = await getAccess();
	const restricted = access.tracks !== null;
	if (restricted && userId) {
		await ensureCreditKey().catch((e) => console.error('credit key mint failed', e));
	}
	const creditStudent =
		restricted && userId
			? await lmsPrisma.student.findUnique({
					where: { id: userId },
					select: { apiKey: true, apiKeyBudget: true },
				})
			: null;
	const [{ track: requestedTrack }, allTracks, allWeeks, allDays, interviewLessons, bonusLessons, completed, interviewUnlocked] =
		await Promise.all([
			searchParams,
			getTracks(),
			getWeeks(),
			getDays(),
			getInterviewLessons(),
			getBonusLessons(),
			userId ? getCompletedSlugs(userId) : Promise.resolve(new Set<string>()),
			userId ? isInterviewUnlocked(userId) : Promise.resolve(false),
		]);

	const tracks = allTracks.filter((t) => isTrackAllowed(t, access.tracks));
	const track = tracks.find((t) => trackSlug(t) === requestedTrack) ?? tracks[0] ?? '';
	const isMainTrack = track === (allTracks[0] ?? '');
	const showExtras = isMainTrack && !restricted;

	if (!track) {
		return (
			<div>
				<h1 className='text-2xl font-bold tracking-tight text-zinc-900'>Your course</h1>
				<p className='mt-5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 px-5 py-6 text-center text-sm text-zinc-500'>
					No course tracks are unlocked on your account yet. Reply to your invite email and we&rsquo;ll sort it out.
				</p>
			</div>
		);
	}

	const weeks = allWeeks.filter((w) => w.track === track);
	const days = allDays.filter((d) => d.track === track);

	const total = days.length;
	const done = days.filter((d) => completed.has(d.slug)).length;
	const pct = total ? Math.round((done / total) * 100) : 0;

	// The first not-yet-completed day, for the "continue" nudge.
	const nextUp = days.find((d) => !completed.has(d.slug));

	return (
		<div>
			<h1 className='text-2xl font-bold tracking-tight text-zinc-900'>Your course</h1>
			{restricted && tracks.length === 1 && (
				<p className='mt-1 text-sm font-medium text-blue-600'>{track}</p>
			)}
			{tracks.length > 1 && (
				<nav className='mt-4 inline-flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm' aria-label='Tracks'>
					{tracks.map((t) => (
						<Link
							key={t}
							href={`/learn?track=${trackSlug(t)}`}
							aria-current={t === track ? 'page' : undefined}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
								t === track ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:bg-zinc-100'
							}`}
						>
							{t}
						</Link>
					))}
				</nav>
			)}
			{isMainTrack && (
				<p className='mt-3 text-sm text-zinc-500'>
					42 days · 1–2 hours a day · 6 days on, 1 day off
				</p>
			)}

			{creditStudent?.apiKey && (
				<CreditKeyCard
					apiKey={creditStudent.apiKey}
					budget={creditStudent.apiKeyBudget ?? access.creditUsd ?? 0}
					baseUrl={litellmProxyUrl()}
				/>
			)}

			<div className='mt-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
				<div className='flex items-center justify-between text-sm'>
					<span className='font-medium text-zinc-700'>
						{done} / {total} days complete
					</span>
					<span className='font-semibold text-zinc-900'>{pct}%</span>
				</div>
				<div className='mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100'>
					<div
						className='h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all'
						style={{ width: `${pct}%` }}
					/>
				</div>
				{nextUp && (
					<Link
						href={`/learn/${nextUp.slug}`}
						className='mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
					>
						{done === 0 ? (isMainTrack ? 'Start Day 1' : 'Start here') : `Continue with Day ${nextUp.day}`} →
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
												className='rest-day-row flex items-center gap-3 bg-zinc-50/60 px-4 py-3'
											>
												<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-400'>
													{entry.dayInfo.day}
												</span>
												<span className='rest-day-label text-sm text-zinc-400'>
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
												className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-blue-50/40'
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
														Assignment
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

				{showExtras && bonusLessons.length > 0 && (
					<section>
						<div className='flex items-baseline justify-between'>
							<h2 className='text-lg font-bold tracking-tight text-zinc-900'>
								Bonus — Optional Labs
							</h2>
							<span className='text-xs font-medium text-zinc-400'>
								{bonusLessons.filter((l) => completed.has(l.slug)).length}/
								{bonusLessons.length} done
							</span>
						</div>
						<ul className='mt-3 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm'>
							{bonusLessons.map((lesson) => {
								const isDone = completed.has(lesson.slug);
								return (
									<li key={lesson.slug}>
										<Link
											href={`/learn/${lesson.slug}`}
											className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-blue-50/40'
										>
											<span
												className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
													isDone
														? 'bg-emerald-500 text-white'
														: 'border border-zinc-200 bg-white text-zinc-500'
												}`}
												aria-hidden
											>
												{isDone ? '✓' : '★'}
											</span>
											<span className='min-w-0 flex-1'>
												<span className='block truncate text-sm font-medium text-zinc-800'>
													{lesson.title}
												</span>
												{lesson.time && (
													<span className='block text-xs text-zinc-400'>
														{lesson.time}
													</span>
												)}
											</span>
											<span className='shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500'>
												optional
											</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</section>
				)}

				{showExtras && interviewLessons.length > 0 && (
					<section>
						<div className='flex items-baseline justify-between'>
							<h2 className='text-lg font-bold tracking-tight text-zinc-900'>
								Bonus — Interview Prep
							</h2>
							{interviewUnlocked ? (
								<span className='text-xs font-medium text-zinc-400'>
									{interviewLessons.filter((l) => completed.has(l.slug)).length}/
									{interviewLessons.length} done
								</span>
							) : (
								<span className='text-xs font-medium text-zinc-400'>Locked</span>
							)}
						</div>
						{interviewUnlocked ? (
							<ul className='mt-3 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm'>
								{interviewLessons.map((lesson, i) => {
									const isDone = completed.has(lesson.slug);
									return (
										<li key={lesson.slug}>
											<Link
												href={`/learn/${lesson.slug}`}
												className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-blue-50/40'
											>
												<span
													className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
														isDone
															? 'bg-emerald-500 text-white'
															: 'border border-zinc-200 bg-white text-zinc-500'
													}`}
													aria-hidden
												>
													{isDone ? '✓' : i + 1}
												</span>
												<span className='min-w-0 flex-1'>
													<span className='block truncate text-sm font-medium text-zinc-800'>
														{lesson.title}
													</span>
													{lesson.time && (
														<span className='block text-xs text-zinc-400'>
															{lesson.time}
														</span>
													)}
												</span>
											</Link>
										</li>
									);
								})}
							</ul>
						) : (
							<div className='mt-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 px-5 py-6 text-center'>
								<p className='text-sm font-medium text-zinc-500'>
									The AI Engineering Interview Playbook
								</p>
								<p className='mt-1 text-xs text-zinc-400'>
									{interviewLessons.length} sessions — signature stories, tradeoff
									opinions, RAG system design, live practice, and your résumé
									section. Your instructor unlocks this near the end of the program.
								</p>
							</div>
						)}
					</section>
				)}
			</div>
		</div>
	);
}
