'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getAccess, isTrackAllowed } from '@/lib/lms/access';
import { ensureStudent } from '@/lib/lms/progress';
import {
	createSubmission,
	getLessonAssignment,
	listSubmissions,
	type SubmissionView,
	type SubmitOutcome,
} from '@/lib/lms/submissions';

async function allowedStudent(slug: string): Promise<string | null> {
	const userId = await ensureStudent();
	if (!userId) return null;
	const [lesson, access] = await Promise.all([getLessonAssignment(slug), getAccess()]);
	if (!lesson || !isTrackAllowed(lesson.track, access.tracks, access.isAdmin)) return null;
	return userId;
}

export async function mySubmissions(slug: string): Promise<SubmissionView[]> {
	const userId = await allowedStudent(slug);
	return userId ? listSubmissions(userId, slug) : [];
}

export async function submitWork(slug: string, repoUrl: string): Promise<SubmitOutcome> {
	const userId = await allowedStudent(slug);
	if (!userId) return { ok: false, error: 'Sign in to hand this in.' };

	const h = await headers();
	const host = h.get('x-forwarded-host') ?? h.get('host');
	const proto = h.get('x-forwarded-proto') ?? 'https';
	const callbackUrl = `${process.env.GRADER_CALLBACK_BASE_URL || `${proto}://${host}`}/api/grade-callback`;

	const outcome = await createSubmission(userId, slug, repoUrl, callbackUrl);
	if (outcome.ok) {
		revalidatePath('/learn');
		revalidatePath(`/learn/${slug}`);
	}
	return outcome;
}
