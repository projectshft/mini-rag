import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChallengePages, isValidChallengeToken } from '@/lib/lms/challenge';

// Animated hero: the pipeline as a living diagram. Pure SVG + SMIL
// (animateMotion) and CSS keyframes — no client JS, works with the page
// server-rendered. Motion is decorative; prefers-reduced-motion disables
// the CSS half in globals.css.
function PipelineHero() {
	const stages = [
		{ x: 60, label: 'Spotify', sub: 'playlist', color: '#22c55e' },
		{ x: 220, label: 'Resolve', sub: 'find sound', color: '#2563eb' },
		{ x: 380, label: 'Scrape', sub: 'metadata', color: '#2563eb' },
		{ x: 540, label: 'Download', sub: 'yt-dlp', color: '#2563eb' },
		{ x: 700, label: 'Storage', sub: '.mp4', color: '#f59e0b' },
	];
	return (
		<div className='challenge-hero mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6'>
			<svg
				viewBox='0 0 760 150'
				className='w-full'
				role='img'
				aria-label='Pipeline: Spotify playlist to resolved TikTok sounds to scraped metadata to downloaded videos in storage'
			>
				{/* queue links between stages */}
				{stages.slice(0, -1).map((s, i) => (
					<g key={i}>
						<line
							x1={s.x + 34}
							y1={64}
							x2={stages[i + 1].x - 34}
							y2={64}
							stroke='#d4d4d8'
							strokeWidth='2'
							strokeDasharray='6 6'
							className='challenge-flow'
						/>
						<text
							x={(s.x + stages[i + 1].x) / 2}
							y={50}
							textAnchor='middle'
							className='fill-zinc-400'
							fontSize='10'
						>
							queue
						</text>
					</g>
				))}
				{/* work items traveling the pipeline */}
				{/* base opacity 0 keeps delayed dots invisible at the origin until
				    their animateMotion actually begins */}
				{[0, 1, 2].map((n) => (
					<circle key={n} r='4.5' fill='#2563eb' opacity='0'>
						<animateMotion
							dur='6s'
							begin={`${n * 2}s`}
							repeatCount='indefinite'
							path='M 94 64 L 666 64'
						/>
						<animate
							attributeName='opacity'
							values='0;0.9;0.9;0'
							keyTimes='0;0.08;0.92;1'
							dur='6s'
							begin={`${n * 2}s`}
							repeatCount='indefinite'
						/>
					</circle>
				))}
				{/* stage nodes */}
				{stages.map((s, i) => (
					<g key={s.label} className='challenge-node' style={{ animationDelay: `${i * 0.12}s` }}>
						<circle cx={s.x} cy={64} r='30' fill='#fff' stroke={s.color} strokeWidth='2.5' />
						<circle
							cx={s.x}
							cy={64}
							r='30'
							fill='none'
							stroke={s.color}
							strokeWidth='2.5'
							opacity='0.35'
							className='challenge-ping'
							style={{ animationDelay: `${i * 0.6}s` }}
						/>
						<text x={s.x} y={61} textAnchor='middle' fontSize='12' fontWeight='700' className='fill-zinc-800'>
							{s.label}
						</text>
						<text x={s.x} y={75} textAnchor='middle' fontSize='9' className='fill-zinc-400'>
							{s.sub}
						</text>
					</g>
				))}
				<text x={380} y={128} textAnchor='middle' fontSize='11' className='fill-zinc-400'>
					distributed · queue-driven · cron + HTTP triggered
				</text>
			</svg>
		</div>
	);
}

export default async function ChallengeIndexPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;
	if (!isValidChallengeToken(token)) notFound();

	const pages = await getChallengePages();

	return (
		<div>
			<div className='challenge-rise'>
				<span className='inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
					🛠 Build challenge · ~1 week of real engineering
				</span>
				<h1 className='mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-900'>
					A real Spotify playlist in.
					<br />
					Real TikTok videos out.
				</h1>
				<p className='mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600'>
					Build a cloud-native, queue-driven pipeline on Google Cloud that resolves
					every song in a real playlist to its TikTok sound, scrapes the page, and
					downloads the videos — surviving rate limits, retries, and 100-song runs.
					This is the kind of system AI engineers actually get paid to build.
				</p>
			</div>

			<PipelineHero />

			<div className='mt-10'>
				<h2 className='text-lg font-bold tracking-tight text-zinc-900'>
					The challenge in five parts
				</h2>
				<p className='mt-1 text-sm text-zinc-500'>
					Read them in order — each part is a piece of the spec plus the thinking
					behind it.
				</p>
				<ul className='mt-4 space-y-3'>
					{pages.map((p, i) => (
						<li
							key={p.slug}
							className='challenge-rise'
							style={{ animationDelay: `${0.12 + i * 0.09}s` }}
						>
							<Link
								href={`/challenge/${token}/${p.slug}`}
								className='group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md'
							>
								<span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-bold text-zinc-500 transition-colors group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white'>
									{i + 1}
								</span>
								<span className='min-w-0 flex-1'>
									<span className='block text-[15px] font-semibold text-zinc-800'>
										{p.title}
									</span>
									{p.teaser && (
										<span className='mt-0.5 block text-sm text-zinc-500'>{p.teaser}</span>
									)}
								</span>
								<span className='flex shrink-0 flex-col items-end gap-1'>
									{p.time && <span className='text-xs text-zinc-400'>{p.time}</span>}
									<span className='text-sm font-medium text-blue-600 transition-transform group-hover:translate-x-0.5'>
										→
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>

			<div
				className='challenge-rise mt-10 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'
				style={{ animationDelay: '0.6s' }}
			>
				<h2 className='text-sm font-bold uppercase tracking-wide text-zinc-500'>
					What clearing it proves
				</h2>
				<div className='mt-3 grid gap-3 sm:grid-cols-3'>
					<div className='rounded-xl bg-zinc-50 p-3'>
						<p className='text-sm font-semibold text-zinc-800'>Systems, not scripts</p>
						<p className='mt-1 text-xs leading-relaxed text-zinc-500'>
							Four services on Cloud Run talking only through queues — with retries,
							idempotency, and independent scaling.
						</p>
					</div>
					<div className='rounded-xl bg-zinc-50 p-3'>
						<p className='text-sm font-semibold text-zinc-800'>The messy real world</p>
						<p className='mt-1 text-xs leading-relaxed text-zinc-500'>
							Web search that lies, pages that change, rate limits that bite — and
							deterministic rules that survive all three.
						</p>
					</div>
					<div className='rounded-xl bg-zinc-50 p-3'>
						<p className='text-sm font-semibold text-zinc-800'>Proof over promises</p>
						<p className='mt-1 text-xs leading-relaxed text-zinc-500'>
							A public repo, run instructions, and hard evidence: real videos from a
							real playlist, on disk, with logs to match.
						</p>
					</div>
				</div>
				<Link
					href={`/challenge/${token}/${pages[0]?.slug ?? 'brief'}`}
					className='mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
				>
					Start with the mission →
				</Link>
			</div>
		</div>
	);
}
