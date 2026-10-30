import type { Metadata } from 'next';
import Link from 'next/link';
import { claimPurchase, type ClaimResult } from '@/lib/lms/claim';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Claim your access · Intro to Agentic Engineering',
	robots: { index: false, follow: false, nocache: true },
};

const ERRORS: Record<Extract<ClaimResult, { kind: 'error' }>['reason'], { title: string; body: string }> = {
	missing: {
		title: 'No purchase found in this link',
		body: 'This page needs the link Stripe sends you to right after checkout. If you just paid, use the redirect from the checkout page or the link in your receipt email.',
	},
	invalid: {
		title: 'We couldn’t find that purchase',
		body: 'The checkout link looks invalid or expired. If you were charged, reply to your Stripe receipt and we’ll get you in by hand.',
	},
	unpaid: {
		title: 'Payment hasn’t gone through yet',
		body: 'Stripe hasn’t marked this checkout as paid. Give it a minute and refresh this page. If it stays stuck, reply to your receipt.',
	},
	'wrong-product': {
		title: 'This purchase isn’t for this course',
		body: 'That checkout was for a different product, so it can’t unlock Intro to Agentic Engineering. Reply to your receipt if you think this is a mistake.',
	},
	config: {
		title: 'Enrollment is temporarily unavailable',
		body: 'Something on our side isn’t set up correctly. Your payment is safe. Reply to your Stripe receipt and we’ll send your invite manually.',
	},
	failed: {
		title: 'Something went wrong sending your invite',
		body: 'Your payment is safe. Refresh this page to try again, or reply to your Stripe receipt and we’ll send your invite manually.',
	},
};

export default async function ClaimPage({
	searchParams,
}: {
	searchParams: Promise<{ session_id?: string | string[] }>;
}) {
	const { session_id } = await searchParams;
	const result = await claimPurchase(typeof session_id === 'string' ? session_id : undefined);

	return (
		<div className='lms min-h-screen bg-zinc-50/50'>
			<header className='sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur'>
				<div className='mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3'>
					<span className='shrink-0 text-[15px] font-bold tracking-tight text-zinc-900'>
						Intro to <span className='text-blue-600'>Agentic</span> Engineering
					</span>
				</div>
			</header>
			<div className='mx-auto max-w-xl px-4 py-12'>
				{result.kind === 'error' ? (
					<div className='rounded-2xl border border-amber-200 bg-white p-6 shadow-sm'>
						<h1 className='text-xl font-bold tracking-tight text-zinc-900'>
							{ERRORS[result.reason].title}
						</h1>
						<p className='mt-3 text-sm leading-relaxed text-zinc-600'>
							{ERRORS[result.reason].body}
						</p>
					</div>
				) : result.kind === 'existing' ? (
					<div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
						<span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700'>
							Payment received
						</span>
						<h1 className='mt-3 text-xl font-bold tracking-tight text-zinc-900'>
							You already have an account
						</h1>
						<p className='mt-3 text-sm leading-relaxed text-zinc-600'>
							<span className='font-medium text-zinc-800'>{result.email}</span> is already
							enrolled. Sign in with that email to find Intro to Agentic Engineering in your
							course.
						</p>
						<Link
							href='/sign-in'
							className='mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
						>
							Sign in →
						</Link>
					</div>
				) : (
					<div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
						<span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700'>
							Payment received
						</span>
						<h1 className='mt-3 text-xl font-bold tracking-tight text-zinc-900'>
							Check your inbox
						</h1>
						<p className='mt-3 text-sm leading-relaxed text-zinc-600'>
							We sent your invite to{' '}
							<span className='font-medium text-zinc-800'>{result.email}</span>. Open it and
							follow the link to create your account. Your API credits will be waiting on your
							course page.
						</p>
						<p className='mt-3 text-xs text-zinc-400'>
							Not there after a few minutes? Check spam, or reply to your Stripe receipt.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
