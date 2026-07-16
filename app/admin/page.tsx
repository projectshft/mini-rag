import { clerkClient } from '@clerk/nextjs/server';
import { lmsPrisma } from '@/lib/lms/prisma';
import { getDays } from '@/lib/lms/curriculum';
import {
	inviteStudent,
	revokeStudent,
	unbanStudent,
	revokeInvitation,
	setInterviewAccess,
} from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
	const client = await clerkClient();

	const [students, days, userList, inviteList] = await Promise.all([
		lmsPrisma.student.findMany({
			include: { progress: { select: { lessonSlug: true } } },
			orderBy: { invitedAt: 'asc' },
		}),
		getDays(),
		client.users.getUserList({ limit: 200 }),
		client.invitations.getInvitationList({ status: 'pending' }),
	]);

	const total = days.length || 1;
	const bannedById = new Map(userList.data.map((u) => [u.id, u.banned]));
	const pending = inviteList.data;
	// A day starts a new week block → draw a left border before it.
	const isWeekStart = (i: number) => i === 0 || days[i].week !== days[i - 1].week;

	return (
		<div className='space-y-10'>
			<div>
				<h1 className='text-2xl font-bold tracking-tight text-zinc-900'>Students</h1>
				<p className='mt-1 text-sm text-zinc-500'>
					Invite by email, track completion, revoke access.
				</p>
			</div>

			{/* Invite */}
			<form
				action={inviteStudent}
				className='flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'
			>
				<input
					type='email'
					name='email'
					required
					placeholder='student@example.com'
					className='min-w-64 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-indigo-500'
				/>
				<button
					type='submit'
					className='cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700'
				>
					Send invite
				</button>
			</form>

			{/* Pending invitations */}
			{pending.length > 0 && (
				<section>
					<h2 className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>
						Pending invites ({pending.length})
					</h2>
					<ul className='mt-3 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm'>
						{pending.map((inv) => (
							<li
								key={inv.id}
								className='flex items-center justify-between px-4 py-2.5 text-sm'
							>
								<span className='text-zinc-700'>{inv.emailAddress}</span>
								<form action={revokeInvitation}>
									<input type='hidden' name='invitationId' value={inv.id} />
									<button className='cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-500'>
										Cancel
									</button>
								</form>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* Progress matrix */}
			<section>
				<h2 className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>
					Progress ({students.length} joined)
				</h2>
				{students.length === 0 ? (
					<p className='mt-3 text-sm text-zinc-500'>No students have joined yet.</p>
				) : (
					<div className='mt-3 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm'>
						<table className='w-full border-collapse text-sm'>
							<thead>
								<tr className='bg-zinc-50'>
									<th className='sticky left-0 z-10 bg-zinc-50 px-3 py-2 text-left font-semibold text-zinc-700'>
										Student
									</th>
									<th className='px-2 py-2 text-right font-semibold text-zinc-400'>%</th>
									{days.map((d, i) => (
										<th
											key={d.slug}
											className={`w-6 px-0 py-2 text-center text-[10px] font-normal text-zinc-400 ${
												isWeekStart(i) ? 'border-l-2 border-zinc-200' : ''
											}`}
											title={`Week ${d.week}, Day ${d.day}: ${d.title}`}
										>
											{d.day}
										</th>
									))}
									<th
										className='whitespace-nowrap border-l-2 border-zinc-200 px-3 py-2 text-center font-semibold text-zinc-400'
										title='Interview-prep section: locked until you unlock it per student'
									>
										🎤 Interview
									</th>
									<th className='px-3 py-2 text-right font-semibold text-zinc-400'>
										Access
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-zinc-100'>
								{students.map((s) => {
									const doneSet = new Set(s.progress.map((p) => p.lessonSlug));
									const doneCount = days.filter((d) => doneSet.has(d.slug)).length;
									const pct = Math.round((doneCount / total) * 100);
									const banned = bannedById.get(s.id) ?? false;
									return (
										<tr key={s.id} className={banned ? 'opacity-50' : ''}>
											<td className='sticky left-0 z-10 max-w-56 truncate bg-white px-3 py-2 font-medium text-zinc-800'>
												{s.email || s.id}
												{banned && (
													<span className='ml-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600'>
														revoked
													</span>
												)}
											</td>
											<td className='px-2 py-2 text-right tabular-nums text-zinc-500'>
												{pct}%
											</td>
											{days.map((d, i) => (
												<td
													key={d.slug}
													className={`px-0 py-2 text-center ${
														isWeekStart(i) ? 'border-l-2 border-zinc-100' : ''
													}`}
													title={`Day ${d.day}: ${d.title}`}
												>
													<span
														className={`mx-auto block h-2.5 w-2.5 rounded-full ${
															doneSet.has(d.slug)
																? 'bg-emerald-500'
																: 'bg-zinc-200'
														}`}
													/>
												</td>
											))}
											<td className='whitespace-nowrap border-l-2 border-zinc-100 px-3 py-2 text-center'>
												<form action={setInterviewAccess} className='inline'>
													<input type='hidden' name='studentId' value={s.id} />
													<input
														type='hidden'
														name='unlock'
														value={s.interviewUnlockedAt ? 'false' : 'true'}
													/>
													<button
														className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
															s.interviewUnlockedAt
																? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
																: 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
														}`}
														title={
															s.interviewUnlockedAt
																? 'Interview prep is UNLOCKED for this student — click to lock'
																: 'Interview prep is locked — click to unlock'
														}
													>
														{s.interviewUnlockedAt ? 'Unlocked' : 'Locked'}
													</button>
												</form>
											</td>
											<td className='whitespace-nowrap px-3 py-2 text-right'>
												{banned ? (
													<form action={unbanStudent} className='inline'>
														<input type='hidden' name='userId' value={s.id} />
														<button className='cursor-pointer text-xs font-medium text-emerald-600 hover:text-emerald-800'>
															Restore
														</button>
													</form>
												) : (
													<form action={revokeStudent} className='inline'>
														<input type='hidden' name='userId' value={s.id} />
														<button className='cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-500'>
															Revoke
														</button>
													</form>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</div>
	);
}
