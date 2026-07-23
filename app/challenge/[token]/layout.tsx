import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isValidChallengeToken } from '@/lib/lms/challenge';

// Public-but-unlisted: anyone with the tokened link can read, but the pages
// must never be discoverable — no index, no follow, and robots.txt also
// disallows /challenge (the token itself never appears anywhere crawlable).
export const metadata: Metadata = {
	title: '5-Day AI Advisor Challenge',
	robots: { index: false, follow: false, nocache: true },
};

export default async function ChallengeLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;
	// Wrong token = the page simply doesn't exist. No sign-in wall, no hint.
	if (!isValidChallengeToken(token)) notFound();

	return (
		<div className='lms min-h-screen bg-zinc-50/50'>
			<header className='sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur'>
				<div className='mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3'>
					<Link
						href={`/challenge/${token}`}
						className='shrink-0 text-[15px] font-bold tracking-tight text-zinc-900'
					>
						AI <span className='text-blue-600'>Advisor</span> Challenge
					</Link>
					<span className='text-xs font-medium text-zinc-400'>
						5 steps · Gemini + RAG
					</span>
				</div>
			</header>
			<div className='mx-auto max-w-3xl px-4 py-8'>{children}</div>
		</div>
	);
}
