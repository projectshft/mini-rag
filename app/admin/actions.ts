'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/lms/admin';

/** Invite a student by email — Clerk sends the magic-link/code email. */
export async function inviteStudent(formData: FormData) {
	await requireAdmin();
	const email = String(formData.get('email') ?? '').trim();
	if (!email) return;

	const client = await clerkClient();
	await client.invitations.createInvitation({
		emailAddress: email,
		redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/learn`,
		notify: true,
		ignoreExisting: true,
	});
	revalidatePath('/admin');
}

/** Revoke access = ban in Clerk (revokes sessions, blocks sign-in). */
export async function revokeStudent(formData: FormData) {
	await requireAdmin();
	const userId = String(formData.get('userId') ?? '');
	if (!userId) return;

	const client = await clerkClient();
	await client.users.banUser(userId);
	revalidatePath('/admin');
}

/** Restore a previously revoked student. */
export async function unbanStudent(formData: FormData) {
	await requireAdmin();
	const userId = String(formData.get('userId') ?? '');
	if (!userId) return;

	const client = await clerkClient();
	await client.users.unbanUser(userId);
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
