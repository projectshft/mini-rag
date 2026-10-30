import { clerkClient } from '@clerk/nextjs/server';
import { AGENTIC_TRACK, readTracks } from './access';

export type ClaimResult =
	| { kind: 'invited'; email: string }
	| { kind: 'pending'; email: string }
	| { kind: 'existing'; email: string }
	| { kind: 'error'; reason: 'missing' | 'invalid' | 'unpaid' | 'wrong-product' | 'config' | 'failed' };

type CheckoutSession = {
	payment_status?: string;
	payment_link?: string | null;
	customer_details?: { email?: string | null } | null;
};

const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]+$/;

function clerkErrorCodes(e: unknown): string[] {
	const errors = (e as { errors?: { code?: string }[] })?.errors;
	return Array.isArray(errors) ? errors.map((x) => x.code ?? '') : [];
}

async function fetchCheckoutSession(
	sessionId: string,
	secretKey: string
): Promise<CheckoutSession | null> {
	const res = await fetch(
		`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
		{ headers: { Authorization: `Bearer ${secretKey}` }, cache: 'no-store' }
	);
	if (res.status === 404) return null;
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(`Stripe checkout session lookup → ${res.status}: ${body.slice(0, 200)}`);
	}
	return (await res.json()) as CheckoutSession;
}

export async function claimPurchase(sessionId: string | undefined): Promise<ClaimResult> {
	if (!sessionId) return { kind: 'error', reason: 'missing' };
	if (!SESSION_ID_RE.test(sessionId)) return { kind: 'error', reason: 'invalid' };

	const secretKey = process.env.STRIPE_SECRET_KEY;
	const paymentLinkId = process.env.AGENTIC_PAYMENT_LINK_ID;
	if (!secretKey || !paymentLinkId) return { kind: 'error', reason: 'config' };

	let session: CheckoutSession | null;
	try {
		session = await fetchCheckoutSession(sessionId, secretKey);
	} catch (e) {
		console.error('claim: stripe lookup failed', e);
		return { kind: 'error', reason: 'failed' };
	}
	if (!session) return { kind: 'error', reason: 'invalid' };
	if (session.payment_link !== paymentLinkId) return { kind: 'error', reason: 'wrong-product' };
	if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
		return { kind: 'error', reason: 'unpaid' };
	}

	const email = session.customer_details?.email?.trim().toLowerCase();
	if (!email) return { kind: 'error', reason: 'invalid' };

	try {
		const client = await clerkClient();

		const { data: users } = await client.users.getUserList({ emailAddress: [email] });
		const user = users[0];
		if (user) {
			const tracks = readTracks(user.publicMetadata);
			if (tracks && !tracks.includes(AGENTIC_TRACK)) {
				await client.users.updateUserMetadata(user.id, {
					publicMetadata: { tracks: [...tracks, AGENTIC_TRACK] },
				});
			}
			return { kind: 'existing', email };
		}

		const { data: invitations } = await client.invitations.getInvitationList({
			query: email,
			status: 'pending',
		});
		if (invitations.some((i) => i.emailAddress.toLowerCase() === email)) {
			return { kind: 'pending', email };
		}

		const appUrl = process.env.NEXT_PUBLIC_APP_URL;
		const creditUsd = Number(process.env.AGENTIC_CREDIT_USD || 5);
		await client.invitations.createInvitation({
			emailAddress: email,
			...(appUrl ? { redirectUrl: `${appUrl}/sign-up` } : {}),
			publicMetadata: {
				tracks: [AGENTIC_TRACK],
				creditUsd: Number.isFinite(creditUsd) ? creditUsd : 5,
				source: 'agentic-47',
			},
			notify: true,
			ignoreExisting: true,
		});
		return { kind: 'invited', email };
	} catch (e) {
		const codes = clerkErrorCodes(e);
		if (codes.includes('duplicate_record')) return { kind: 'pending', email };
		if (codes.includes('form_identifier_exists')) return { kind: 'existing', email };
		console.error('claim: clerk invite failed', e);
		return { kind: 'error', reason: 'failed' };
	}
}
