import { cache } from 'react';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { trackSlug } from './curriculum';
import { lmsPrisma } from './prisma';
import { litellmConfigured, mintKey, revokeKey } from './litellm';

export const AGENTIC_TRACK = 'intro-to-agentic-engineering';

export type Access = {
	userId: string | null;
	tracks: string[] | null;
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
	if (!user) return { userId: null, tracks: null, creditUsd: null, creditKeyMinted: false };
	const credit = Number(user.publicMetadata?.creditUsd);
	return {
		userId: user.id,
		tracks: readTracks(user.publicMetadata),
		creditUsd: Number.isFinite(credit) && credit > 0 ? credit : null,
		creditKeyMinted: Boolean(user.privateMetadata?.creditKeyMintedAt),
	};
});

export async function getAllowedTracks(): Promise<string[] | null> {
	return (await getAccess()).tracks;
}

export function isTrackAllowed(track: string, allowed: string[] | null): boolean {
	return allowed === null || allowed.includes(trackSlug(track));
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
