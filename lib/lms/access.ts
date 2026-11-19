import { cache } from 'react';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { trackSlug } from './curriculum';
import { lmsPrisma } from './prisma';
import { litellmConfigured, mintKey, revokeKey } from './litellm';

export const AGENTIC_TRACK = 'intro-to-agentic-engineering';

// Tracks that are only visible to students who were explicitly given them.
// A student with no `tracks` key sees every track EXCEPT these, so existing
// RAG students never see a track they didn't enroll in. Admins see everything.
export const GRANT_ONLY_TRACKS = ['software-engineering'];

/** Starter credit ($) for an agentic-only student, matching the $47 checkout. */
export function agenticCreditUsd(): number {
	const n = Number(process.env.AGENTIC_CREDIT_USD || 5);
	return Number.isFinite(n) && n > 0 ? n : 5;
}

/**
 * The Clerk publicMetadata that grants a set of tracks. An empty list means
 * the program default (no `tracks` key), so the `null`s here delete those keys
 * when merged by updateUserMetadata. A student restricted to a set that
 * includes the agentic track gets the same starter credit as a $47 buyer.
 */
export function trackGrantMetadata(tracks: string[]): {
	tracks: string[] | null;
	creditUsd: number | null;
} {
	if (tracks.length === 0) return { tracks: null, creditUsd: null };
	return {
		tracks,
		creditUsd: tracks.includes(AGENTIC_TRACK) ? agenticCreditUsd() : null,
	};
}

export type Access = {
	userId: string | null;
	tracks: string[] | null;
	isAdmin: boolean;
	creditUsd: number | null;
	creditKeyMinted: boolean;
};

export function readTracks(metadata: Record<string, unknown> | undefined): string[] | null {
	const tracks = metadata?.tracks;
	if (!Array.isArray(tracks)) return null;
	return tracks.filter((t): t is string => typeof t === 'string');
}

export const getAccess = cache(async (): Promise<Access> => {
	const user = await currentUser();
	if (!user) return { userId: null, tracks: null, isAdmin: false, creditUsd: null, creditKeyMinted: false };
	const credit = Number(user.publicMetadata?.creditUsd);
	return {
		userId: user.id,
		tracks: readTracks(user.publicMetadata),
		isAdmin: isAdminEmail(user.primaryEmailAddress?.emailAddress),
		creditUsd: Number.isFinite(credit) && credit > 0 ? credit : null,
		creditKeyMinted: Boolean(user.privateMetadata?.creditKeyMintedAt),
	};
});

export async function getAllowedTracks(): Promise<string[] | null> {
	return (await getAccess()).tracks;
}

function isAdminEmail(email: string | undefined): boolean {
	if (!email) return false;
	return (process.env.LMS_ADMIN_EMAILS ?? '')
		.toLowerCase()
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean)
		.includes(email.toLowerCase());
}

export function isTrackAllowed(track: string, allowed: string[] | null, isAdmin = false): boolean {
	if (isAdmin) return true;
	const slug = trackSlug(track);
	if (allowed === null) return !GRANT_ONLY_TRACKS.includes(slug);
	return allowed.includes(slug);
}

export async function ensureCreditKey(): Promise<void> {
	const access = await getAccess();
	if (!access.userId || access.tracks === null || access.creditUsd === null) return;
	if (access.creditKeyMinted || !litellmConfigured()) return;

	const student = await lmsPrisma.student.findUnique({ where: { id: access.userId } });
	if (!student || student.apiKey) return;

	const { key, expiresAt, budget } = await mintKey(student.email, access.creditUsd);
	const { count } = await lmsPrisma.student.updateMany({
		where: { id: access.userId, apiKey: null },
		data: {
			apiKey: key,
			apiKeyBudget: budget,
			apiKeyMintedAt: new Date(),
			apiKeyExpiresAt: expiresAt,
		},
	});
	if (count === 0) {
		await revokeKey(key).catch(() => {});
		return;
	}
	const client = await clerkClient();
	await client.users.updateUserMetadata(access.userId, {
		privateMetadata: { creditKeyMintedAt: new Date().toISOString() },
	});
}
