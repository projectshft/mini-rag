import { clerkClient } from '@clerk/nextjs/server';
import { lmsPrisma } from '@/lib/lms/prisma';
import { getDays } from '@/lib/lms/curriculum';
import {
	litellmConfigured,
	litellmProxyUrl,
	keySpend,
	KEY_BUDGET_USD,
	KEY_DURATION_DAYS,
	type KeySpend,
} from '@/lib/lms/litellm';
import { CopyButton } from '@/components/lms/CopyButton';
import { RemoveStudentButton } from '@/components/lms/RemoveStudentButton';
import {
	inviteStudent,
	revokeInvitation,
	setInterviewAccess,
	mintStudentKey,
	bumpStudentKeyBudget,
	revokeStudentKey,
} from './actions';

export const dynamic = 'force-dynamic';

// Prefilled email for sending a student their key (same wording the
// medical-rag cohort sheet used) — opens the admin's own mail client.
function keyEmailHref(email: string, key: string): string {
	const subject = 'Your Parsity API key (for class)';
	const body = [
		`Hey — here's your private API key for class, courtesy of Parsity. It has $${KEY_BUDGET_USD} in credits, plenty to get started.`,
		'',
		"Set BOTH of these when you use it. The key ONLY works through our proxy — with just the key on its own it won't:",
		'',
		`  OPENAI_API_KEY=${key}`,
		`  OPENAI_BASE_URL=${litellmProxyUrl()}`,
		'',
		"Then use it with the OpenAI SDK exactly as normal (any model, e.g. gpt-4o-mini). If it doesn't work, just reply to this email.",
		'',
		'— Brian',
	].join('\n');
	return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default async function AdminPage() {
	const client = await clerkClient();

	const [students, days, inviteList] = await Promise.all([
		lmsPrisma.student.findMany({
			include: { progress: { select: { lessonSlug: true } } },
			orderBy: { invitedAt: 'asc' },
		}),
		getDays(),
		client.invitations.getInvitationList({ status: 'pending' }),
	]);

	// Live spend per key (proxy lookups tolerate failure → null → "—").
	const keysConfigured = litellmConfigured();
	const spendByStudent = new Map<string, KeySpend | null>();
	if (keysConfigured) {
		await Promise.all(
			students
				.filter((s) => s.apiKey)
				.map(async (s) => {
					spendByStudent.set(s.id, await keySpend(s.apiKey!));
				})
		);
	}

	const total = days.length || 1;
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
					className='min-w-64 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-blue-500'
				/>
				<button
					type='submit'
					className='cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
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

			{/* API keys (LiteLLM proxy) */}
			<section>
				<h2 className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>
					API keys · ${KEY_BUDGET_USD} / {KEY_DURATION_DAYS} days via the class proxy
				</h2>
				{!keysConfigured ? (
					<p className='mt-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 px-4 py-4 text-sm text-zinc-500'>
						Not configured. Set <code className='rounded bg-zinc-100 px-1'>LITELLM_PROXY_URL</code> and{' '}
						<code className='rounded bg-zinc-100 px-1'>LITELLM_MASTER_KEY</code> to mint
						budget-capped student keys from here (see docs/LMS-SETUP.md).
					</p>
				) : students.length === 0 ? (
					<p className='mt-3 text-sm text-zinc-500'>
						No students have joined yet — keys are minted per joined student.
					</p>
				) : (
					<div className='mt-3 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm'>
						<table className='w-full border-collapse text-sm'>
							<thead>
								<tr className='bg-zinc-50 text-left'>
									<th className='px-3 py-2 font-semibold text-zinc-700'>Student</th>
									<th className='px-3 py-2 font-semibold text-zinc-400'>Key</th>
									<th className='px-3 py-2 text-right font-semibold text-zinc-400'>
										Spend / budget
									</th>
									<th className='px-3 py-2 text-right font-semibold text-zinc-400'>
										Expires
									</th>
									<th className='px-3 py-2 text-right font-semibold text-zinc-400'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-zinc-100'>
								{students.map((s) => {
									const spend = spendByStudent.get(s.id);
									const expired =
										s.apiKeyExpiresAt && s.apiKeyExpiresAt.getTime() < Date.now();
									return (
										<tr key={s.id}>
											<td className='max-w-56 truncate px-3 py-2 font-medium text-zinc-800'>
												{s.email || s.id}
											</td>
											<td className='whitespace-nowrap px-3 py-2'>
												{s.apiKey ? (
													<span className='flex items-center gap-2'>
														<code className='rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500'>
															{s.apiKey.slice(0, 7)}…{s.apiKey.slice(-4)}
														</code>
														<CopyButton text={s.apiKey} label='Copy key' />
													</span>
												) : (
													<span className='text-xs text-zinc-300'>no key</span>
												)}
											</td>
											<td className='whitespace-nowrap px-3 py-2 text-right tabular-nums text-zinc-600'>
												{s.apiKey
													? spend
														? `$${spend.spend.toFixed(2)} / $${(spend.maxBudget ?? s.apiKeyBudget ?? 0).toFixed(0)}`
														: `— / $${(s.apiKeyBudget ?? 0).toFixed(0)}`
													: ''}
											</td>
											<td className='whitespace-nowrap px-3 py-2 text-right text-xs text-zinc-500'>
												{s.apiKeyExpiresAt ? (
													<span className={expired ? 'font-semibold text-red-500' : ''}>
														{expired ? 'expired ' : ''}
														{s.apiKeyExpiresAt.toISOString().slice(0, 10)}
													</span>
												) : (
													''
												)}
											</td>
											<td className='whitespace-nowrap px-3 py-2 text-right'>
												{!s.apiKey ? (
													<form action={mintStudentKey} className='inline'>
														<input type='hidden' name='studentId' value={s.id} />
														<button className='cursor-pointer rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-700'>
															Mint key
														</button>
													</form>
												) : (
													<span className='flex items-center justify-end gap-2'>
														<a
															href={keyEmailHref(s.email, s.apiKey)}
															className='rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-blue-400 hover:text-blue-700'
															title='Opens a prefilled email in your mail client'
														>
															✉️ Send
														</a>
														<form
															action={bumpStudentKeyBudget}
															className='inline-flex items-center gap-1'
														>
															<input type='hidden' name='studentId' value={s.id} />
															<input
																type='number'
																name='amount'
																min='1'
																step='1'
																defaultValue='10'
																className='w-14 rounded-md border border-zinc-200 px-1.5 py-1 text-right text-xs text-zinc-700 outline-none focus:border-blue-400'
																aria-label='Dollars to add'
															/>
															<button className='cursor-pointer rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100'>
																+$
															</button>
														</form>
														<form action={revokeStudentKey} className='inline'>
															<input type='hidden' name='studentId' value={s.id} />
															<button className='cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-500'>
																Revoke
															</button>
														</form>
													</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
				{keysConfigured && (
					<p className='mt-2 text-xs text-zinc-400'>
						Keys work only through the proxy: students set{' '}
						<code className='rounded bg-zinc-100 px-1'>OPENAI_API_KEY</code> +{' '}
						<code className='rounded bg-zinc-100 px-1'>OPENAI_BASE_URL={litellmProxyUrl()}</code>.
						&ldquo;+$&rdquo; raises the ceiling (spend is preserved); Revoke kills the key on
						the proxy immediately.
					</p>
				)}
			</section>

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
									return (
										<tr key={s.id}>
											<td className='sticky left-0 z-10 max-w-56 truncate bg-white px-3 py-2 font-medium text-zinc-800'>
												{s.email || s.id}
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
																? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
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
												<RemoveStudentButton userId={s.id} email={s.email || s.id} />
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
