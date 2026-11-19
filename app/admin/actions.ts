'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/lms/admin';
import { lmsPrisma } from '@/lib/lms/prisma';
import { mintKey, revokeKey, updateKeyBudget } from '@/lib/lms/litellm';
import { getTracks, trackSlug } from '@/lib/lms/curriculum';
import { trackGrantMetadata } from '@/lib/lms/access';

/**
 * The track slugs ticked on an admin form, keeping only real tracks. None
 * ticked = the program default (every track except the grant-only ones).
 */
async function tracksFromForm(formData: FormData): Promise<string[]> {
	const valid = new Set((await getTracks()).map(trackSlug));
	const picked = formData.getAll('tracks').map(String);
	return [...new Set(picked)].filter((t) => valid.has(t));
}

function sendInvitation(
	client: Awaited<ReturnType<typeof clerkClient>>,
	email: string,
	tracks: string[]
) {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL;
	const grant = trackGrantMetadata(tracks);
	return client.invitations.createInvitation({
		emailAddress: email,
		...(appUrl ? { redirectUrl: `${appUrl}/sign-up` } : {}),
		...(grant.tracks
			? {
					publicMetadata: {
						tracks: grant.tracks,
						...(grant.creditUsd ? { creditUsd: grant.creditUsd } : {}),
						source: 'admin',
					},
				}
			: {}),
		notify: true,
		ignoreExisting: true,
	});
}

/**
 * Invite a student by email — Clerk sends the magic-link/code email. The
 * ticked tracks ride along on the invitation's publicMetadata and land on the
 * user when they sign up; none ticked = full program access.
 *
 * The invite link must land on /sign-up: sign-ups are Restricted, so the
 * account only gets created when the <SignUp> component consumes the
 * __clerk_ticket that Clerk appends to this URL. Pointing at a protected
 * route (like /learn) bounces the invitee to /sign-in, drops the ticket,
 * and strands them — no account exists yet, so sign-in always errors.
 * If NEXT_PUBLIC_APP_URL is unset, omit redirectUrl entirely so Clerk
 * falls back to its Account Portal flow instead of a broken relative URL.
 */
export async function inviteStudent(formData: FormData) {
	await requireAdmin();
	const email = String(formData.get('email') ?? '').trim();
	if (!email) return;

	const client = await clerkClient();
	await sendInvitation(client, email, await tracksFromForm(formData));
	revalidatePath('/admin');
}

/** Change which tracks a joined student can see. Takes effect on their next page load. */
export async function setStudentTracks(formData: FormData) {
	await requireAdmin();
	const userId = String(formData.get('userId') ?? '');
	if (!userId) return;

	const client = await clerkClient();
	// Merged into existing publicMetadata; the nulls in a "full program"
	// grant delete the tracks/creditUsd keys.
	await client.users.updateUserMetadata(userId, {
		publicMetadata: trackGrantMetadata(await tracksFromForm(formData)),
	});
	revalidatePath('/admin');
	revalidatePath('/learn');
}

/**
 * Change a pending invite's tracks. Clerk can't edit an invitation, so this
 * revokes it and sends a fresh one — the invitee gets a new email and the
 * old link stops working.
 */
export async function resendInvitationWithTracks(formData: FormData) {
	await requireAdmin();
	const invitationId = String(formData.get('invitationId') ?? '');
	const email = String(formData.get('email') ?? '').trim();
	if (!invitationId || !email) return;

	const tracks = await tracksFromForm(formData);
	const client = await clerkClient();
	await client.invitations.revokeInvitation(invitationId);
	await sendInvitation(client, email, tracks);
	revalidatePath('/admin');
}

/**
 * Evict a student. Clerk's ban is a paid-plan feature, so on the free plan the
 * eviction is a hard DELETE: remove the Clerk account (blocks sign-in and
 * kills sessions), revoke their proxy key, and drop their LMS row (progress
 * cascades). Permanent — re-access requires a fresh invite, and sign-up is
 * restricted so they can't self-register.
 */
export async function removeStudent(formData: FormData) {
	await requireAdmin();
	const userId = String(formData.get('userId') ?? '');
	if (!userId) return;

	// Best-effort: kill their proxy key so it can't keep spending once they're gone.
	const student = await lmsPrisma.student.findUnique({ where: { id: userId } });
	if (student?.apiKey) {
		try {
			await revokeKey(student.apiKey);
		} catch {
			// A proxy hiccup shouldn't block the eviction.
		}
	}

	const client = await clerkClient();
	await client.users.deleteUser(userId);
	await lmsPrisma.student.deleteMany({ where: { id: userId } }); // progress cascades

	revalidatePath('/admin');
}

/** Lock/unlock the interview-prep section for one student. */
export async function setInterviewAccess(formData: FormData) {
	await requireAdmin();
	const studentId = String(formData.get('studentId') ?? '');
	const unlock = String(formData.get('unlock') ?? '') === 'true';
	if (!studentId) return;

	await lmsPrisma.student.update({
		where: { id: studentId },
		data: { interviewUnlockedAt: unlock ? new Date() : null },
	});
	revalidatePath('/admin');
	revalidatePath('/learn');
}

/** Mint a budget-capped LiteLLM key for one student and store it. */
export async function mintStudentKey(formData: FormData) {
	await requireAdmin();
	const studentId = String(formData.get('studentId') ?? '');
	if (!studentId) return;

	const student = await lmsPrisma.student.findUnique({ where: { id: studentId } });
	if (!student || student.apiKey) return; // one key per student — revoke first

	const { key, expiresAt, budget } = await mintKey(student.email);
	await lmsPrisma.student.update({
		where: { id: studentId },
		data: {
			apiKey: key,
			apiKeyBudget: budget,
			apiKeyMintedAt: new Date(),
			apiKeyExpiresAt: expiresAt,
		},
	});
	revalidatePath('/admin');
}

/** Add $ to a student's key budget (ceiling moves, spend is preserved). */
export async function bumpStudentKeyBudget(formData: FormData) {
	await requireAdmin();
	const studentId = String(formData.get('studentId') ?? '');
	const amount = Number(formData.get('amount') ?? 0);
	if (!studentId || !(amount > 0)) return;

	const student = await lmsPrisma.student.findUnique({ where: { id: studentId } });
	if (!student?.apiKey) return;

	const newBudget = (student.apiKeyBudget ?? 0) + amount;
	await updateKeyBudget(student.apiKey, newBudget);
	await lmsPrisma.student.update({
		where: { id: studentId },
		data: { apiKeyBudget: newBudget },
	});
	revalidatePath('/admin');
}

/** Revoke a student's key on the proxy and clear it locally. */
export async function revokeStudentKey(formData: FormData) {
	await requireAdmin();
	const studentId = String(formData.get('studentId') ?? '');
	if (!studentId) return;

	const student = await lmsPrisma.student.findUnique({ where: { id: studentId } });
	if (!student?.apiKey) return;

	await revokeKey(student.apiKey);
	await lmsPrisma.student.update({
		where: { id: studentId },
		data: {
			apiKey: null,
			apiKeyBudget: null,
			apiKeyMintedAt: null,
			apiKeyExpiresAt: null,
		},
	});
	revalidatePath('/admin');
}

/** Cancel a pending invitation. */
export async function revokeInvitation(formData: FormData) {
	await requireAdmin();
	const invitationId = String(formData.get('invitationId') ?? '');
	if (!invitationId) return;

	const client = await clerkClient();
	await client.invitations.revokeInvitation(invitationId);
	revalidatePath('/admin');
}
