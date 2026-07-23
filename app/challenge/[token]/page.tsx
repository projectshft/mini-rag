import { notFound } from 'next/navigation';
import { getChallengePages, isValidChallengeToken } from '@/lib/lms/challenge';
import { ChallengeCourse } from '@/components/lms/ChallengeCourse';

// Animated hero: your question fans out to the advisory board, their takes
// flow into Gemini, a grounded answer comes back. Pure SVG + SMIL
// (animateMotion) and CSS keyframes — no client JS, works server-rendered.
// Motion is decorative; prefers-reduced-motion disables the CSS half in
// globals.css.
function AdvisoryBoardHero() {
	const advisors = [
		{ y: 32, label: 'Prime', sub: 'perf · vim', color: '#f59e0b' },
		{ y: 75, label: 'Theo', sub: 'ts · web', color: '#8b5cf6' },
		{ y: 118, label: 'Brian', sub: 'ship it', color: '#22c55e' },
	];
	return (
		<div className='challenge-hero mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6'>
			<svg
				viewBox='0 0 760 155'
				className='w-full'
				role='img'
				aria-label='Your question goes to an advisory board of YouTubers, their content flows into Gemini, and a grounded answer comes back'
			>
				{/* question → each advisor, advisor → Gemini */}
				{advisors.map((a) => (
					<g key={a.label}>
						<line x1={104} y1={75} x2={296} y2={a.y} stroke='#d4d4d8' strokeWidth='2' strokeDasharray='6 6' className='challenge-flow' />
						<line x1={364} y1={a.y} x2={526} y2={75} stroke='#d4d4d8' strokeWidth='2' strokeDasharray='6 6' className='challenge-flow' />
					</g>
				))}
				<line x1={594} y1={75} x2={666} y2={75} stroke='#d4d4d8' strokeWidth='2' strokeDasharray='6 6' className='challenge-flow' />

				{/* your question fanning out to the board */}
				{advisors.map((a, i) => (
					<circle key={`q-${a.label}`} r='4.5' fill='#2563eb' opacity='0'>
						<animateMotion dur='5s' begin={`${i * 0.35}s`} repeatCount='indefinite' path={`M 104 75 L 296 ${a.y}`} />
						<animate attributeName='opacity' values='0;0.9;0.9;0' keyTimes='0;0.05;0.42;0.47' dur='5s' begin={`${i * 0.35}s`} repeatCount='indefinite' />
					</circle>
				))}
				{/* each advisor's take flowing into Gemini */}
				{advisors.map((a, i) => (
					<circle key={`t-${a.label}`} r='4.5' fill={a.color} opacity='0'>
						<animateMotion dur='5s' begin={`${2.4 + i * 0.35}s`} repeatCount='indefinite' path={`M 364 ${a.y} L 526 75`} />
						<animate attributeName='opacity' values='0;0.9;0.9;0' keyTimes='0;0.05;0.42;0.47' dur='5s' begin={`${2.4 + i * 0.35}s`} repeatCount='indefinite' />
					</circle>
				))}
				{/* the grounded answer */}
				<circle r='5' fill='#15803d' opacity='0'>
					<animateMotion dur='5s' begin='4.2s' repeatCount='indefinite' path='M 594 75 L 666 75' />
					<animate attributeName='opacity' values='0;1;1;0' keyTimes='0;0.06;0.22;0.3' dur='5s' begin='4.2s' repeatCount='indefinite' />
				</circle>

				{/* you */}
				<g className='challenge-node'>
					<circle cx={70} cy={75} r='34' fill='#fff' stroke='#2563eb' strokeWidth='2.5' />
					<circle cx={70} cy={75} r='34' fill='none' stroke='#2563eb' strokeWidth='2.5' opacity='0.35' className='challenge-ping' />
					<text x={70} y={72} textAnchor='middle' fontSize='12' fontWeight='700' className='fill-zinc-800'>You</text>
					<text x={70} y={86} textAnchor='middle' fontSize='8.5' className='fill-zinc-400'>ask anything</text>
				</g>
				{/* the board */}
				{advisors.map((a, i) => (
					<g key={a.label} className='challenge-node' style={{ animationDelay: `${0.12 + i * 0.12}s` }}>
						<circle cx={330} cy={a.y} r='20' fill='#fff' stroke={a.color} strokeWidth='2.5' />
						<circle cx={330} cy={a.y} r='20' fill='none' stroke={a.color} strokeWidth='2.5' opacity='0.35' className='challenge-ping' style={{ animationDelay: `${i * 0.7}s` }} />
						<text x={330} y={a.y + 3.5} textAnchor='middle' fontSize='10' fontWeight='700' className='fill-zinc-800'>{a.label}</text>
						<text x={378} y={a.y + 3.5} textAnchor='start' fontSize='8' className='fill-zinc-300'>{a.sub}</text>
					</g>
				))}
				<text x={330} y={12} textAnchor='middle' fontSize='9' fontWeight='600' className='fill-zinc-400'>YOUR ADVISORY BOARD</text>
				{/* gemini */}
				<g className='challenge-node' style={{ animationDelay: '0.5s' }}>
					<circle cx={560} cy={75} r='34' fill='#fff' stroke='#2563eb' strokeWidth='2.5' />
					<circle cx={560} cy={75} r='34' fill='none' stroke='#2563eb' strokeWidth='2.5' opacity='0.35' className='challenge-ping' style={{ animationDelay: '1.2s' }} />
					<text x={560} y={72} textAnchor='middle' fontSize='11.5' fontWeight='700' className='fill-zinc-800'>Gemini</text>
					<text x={560} y={86} textAnchor='middle' fontSize='8.5' className='fill-zinc-400'>free tier</text>
				</g>
				{/* answer */}
				<g className='challenge-node' style={{ animationDelay: '0.62s' }}>
					<circle cx={700} cy={75} r='30' fill='#fff' stroke='#15803d' strokeWidth='2.5' />
					<text x={700} y={72} textAnchor='middle' fontSize='10' fontWeight='700' className='fill-zinc-800'>Answer</text>
					<text x={700} y={85} textAnchor='middle' fontSize='8' className='fill-zinc-400'>grounded</text>
				</g>
				<text x={380} y={150} textAnchor='middle' fontSize='11' className='fill-zinc-400'>retrieve what they said · augment the prompt · generate the answer</text>
			</svg>
		</div>
	);
}

export default async function ChallengePage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;
	if (!isValidChallengeToken(token)) notFound();

	const steps = await getChallengePages();

	return (
		<div>
			<div className='challenge-rise'>
				<span className='inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
					🎙 Free build challenge · 5 steps · ~2 hours total
				</span>
				<h1 className='mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-900'>
					Build an AI advisory board
					<br />
					of your favorite YouTubers.
				</h1>
				<p className='mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600'>
					Ask &ldquo;What does Theo think about testing?&rdquo; or &ldquo;What&rsquo;s
					Primeagen&rsquo;s take on Vim?&rdquo; and get answers grounded in what these
					creators <em>actually said</em>. You&rsquo;ll build it yourself with
					Gemini&rsquo;s free tier, system prompts, and simple RAG. No magic — just
					software development. Jump around freely; your progress saves on this device.
				</p>
			</div>

			<AdvisoryBoardHero />

			<div className='mt-10'>
				<ChallengeCourse steps={steps} token={token} />
			</div>
		</div>
	);
}
