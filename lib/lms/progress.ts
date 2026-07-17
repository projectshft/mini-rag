import { auth, currentUser } from '@clerk/nextjs/server';
import { lmsPrisma } from './prisma';

/**
 * Ensure a Student row exists for the current Clerk user (created lazily
 * on first authenticated access), and return their Clerk userId. Returns
 * null if not signed in. Writes only on first-ever access.
 */
export async function ensureStudent(): Promise<string | null> {
	const { userId } = await auth();
	if (!userId) return null;

	const existing = await lmsPrisma.student.findUnique({ where: { id: userId } });
	if (!existing) {
		const user = await currentUser();
		const email = user?.primaryEmailAddress?.emailAddress ?? '';
		try {
			// The email is unique. A row may already hold it under a *different*
			// Clerk id — e.g. after switching Clerk instances (keyless -> dev ->
			// production), which re-issues user ids. Drop that orphaned row (its
			// progress cascades) so the current id can claim the email.
			if (email) {
				await lmsPrisma.student.deleteMany({ where: { email, NOT: { id: userId } } });
			}
			await lmsPrisma.student.create({
				data: { id: userId, email, firstSeenAt: new Date() },
			});
		} catch (e) {
			// Next.js fires several concurrent requests per navigation, so two of
			// them can race to create the same first-time student row. A unique
			// violation (P2002) just means another request already won — the row
			// exists, so treat it as success rather than crashing the page.
			if ((e as { code?: string })?.code !== 'P2002') throw e;
		}
	}
	return userId;
}

/** Whether this student's interview-prep section has been unlocked by an admin. */
export async function isInterviewUnlocked(userId: string): Promise<boolean> {
	const student = await lmsPrisma.student.findUnique({
		where: { id: userId },
		select: { interviewUnlockedAt: true },
	});
	return Boolean(student?.interviewUnlockedAt);
}

/** Set of day slugs this student has marked done. */
export async function getCompletedSlugs(userId: string): Promise<Set<string>> {
	const rows = await lmsPrisma.lessonProgress.findMany({
		where: { studentId: userId },
		select: { lessonSlug: true },
	});
	return new Set(rows.map((r) => r.lessonSlug));
}
