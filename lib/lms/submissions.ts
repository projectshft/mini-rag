// Graded submissions: a student hands in a public GitHub repo URL, the grader
// (a GitHub Actions workflow in a private repo) runs the visible and hidden
// tests against it, and reports back to /api/grade-callback.
//
// Student code never runs on this server. This file only records attempts,
// asks GitHub to start a grading run, and stores what the grader reports.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getDay } from './curriculum';
import { lmsPrisma } from './prisma';

export type GradeResult = {
	passed: boolean;
	// Short, student-facing sentence about the outcome.
	summary: string;
	commit?: string;
	visible?: { ok: boolean; passed: number; failed: number; minTests: number; note?: string };
	// One entry per hidden category. Only the category name is ever shown,
	// never the test itself.
	hidden?: { category: string; required: boolean; ok: boolean }[];
	error?: string;
};

export type SubmissionView = {
	id: string;
	repoUrl: string;
	status: string;
	result: GradeResult | null;
	createdAt: string;
	gradedAt: string | null;
};

const REPO_RE = /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100})$/;
const SUBMIT_RE = /```submit\s*\n([\s\S]*?)```/;
const MAX_ATTEMPTS_PER_DAY = 30;
// A run that hasn't reported back after this long is treated as lost, so the
// student isn't locked out of resubmitting.
const STALE_AFTER_MS = 15 * 60 * 1000;

/** Normalize a pasted GitHub repo link, or return null if it isn't one. */
export function parseRepoUrl(input: string): string | null {
	const trimmed = input
		.trim()
		.replace(/\/+$/, '')
		.replace(/\.git$/, '')
		.replace(/^http:\/\//, 'https://')
		.replace(/^https:\/\/www\./, 'https://');
	const m = REPO_RE.exec(trimmed);
	if (!m || m[2] === '.' || m[2] === '..') return null;
	return `https://github.com/${m[1]}/${m[2]}`;
}

/** The assignment id declared by a lesson's ```submit block, or null. */
export function assignmentFromBody(body: string): string | null {
	const block = SUBMIT_RE.exec(body);
	if (!block) return null;
	const id = /^assignment:\s*([a-z0-9][a-z0-9-]{0,60})\s*$/m.exec(block[1]);
	return id ? id[1] : null;
}

export async function getLessonAssignment(slug: string): Promise<{ assignment: string; track: string } | null> {
	const day = await getDay(slug);
	if (!day) return null;
	const assignment = assignmentFromBody(day.body);
	return assignment ? { assignment, track: day.track } : null;
}

export function graderConfigured(): boolean {
	return Boolean(
		process.env.GRADER_REPO && process.env.GRADER_GITHUB_TOKEN && process.env.GRADER_CALLBACK_SECRET
	);
}

export function sign(body: string, secret: string): string {
	return 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
}

export function verifySignature(body: string, header: string | null, secret: string | undefined): boolean {
	if (!header || !secret) return false;
	const expected = Buffer.from(sign(body, secret));
	const given = Buffer.from(header);
	return expected.length === given.length && timingSafeEqual(expected, given);
}

function toView(row: {
	id: string;
	repoUrl: string;
	status: string;
	result: unknown;
	createdAt: Date;
	gradedAt: Date | null;
}): SubmissionView {
	return {
		id: row.id,
		repoUrl: row.repoUrl,
		status: row.status,
		result: (row.result as GradeResult | null) ?? null,
		createdAt: row.createdAt.toISOString(),
		gradedAt: row.gradedAt?.toISOString() ?? null,
	};
}

export async function listSubmissions(studentId: string, slug: string): Promise<SubmissionView[]> {
	const rows = await lmsPrisma.submission.findMany({
		where: { studentId, lessonSlug: slug },
		orderBy: { createdAt: 'desc' },
		take: 10,
	});
	return rows.map(toView);
}

async function dispatch(submissionId: string, repoUrl: string, assignment: string, callbackUrl: string) {
	const res = await fetch(
		`https://api.github.com/repos/${process.env.GRADER_REPO}/actions/workflows/grade.yml/dispatches`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.GRADER_GITHUB_TOKEN}`,
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ref: process.env.GRADER_REF || 'main',
				inputs: { submission_id: submissionId, repo_url: repoUrl, assignment, callback_url: callbackUrl },
			}),
		}
	);
	if (!res.ok) throw new Error(`grader dispatch failed: ${res.status}`);
}

export type SubmitOutcome = { ok: true; submission: SubmissionView } | { ok: false; error: string };

/**
 * Record an attempt and start a grading run. `callbackUrl` is this deploy's
 * /api/grade-callback, passed in so the grader reports back to wherever the
 * submission came from.
 */
export async function createSubmission(
	studentId: string,
	slug: string,
	repoInput: string,
	callbackUrl: string
): Promise<SubmitOutcome> {
	const lesson = await getLessonAssignment(slug);
	if (!lesson) return { ok: false, error: 'This lesson has nothing to hand in.' };

	const repoUrl = parseRepoUrl(repoInput);
	if (!repoUrl) {
		return {
			ok: false,
			error: 'That doesn’t look like a GitHub repository link. It should look like https://github.com/your-username/first-test',
		};
	}

	const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const [inFlight, recent] = await Promise.all([
		lmsPrisma.submission.findFirst({
			where: {
				studentId,
				lessonSlug: slug,
				status: 'queued',
				createdAt: { gt: new Date(Date.now() - STALE_AFTER_MS) },
			},
		}),
		lmsPrisma.submission.count({ where: { studentId, createdAt: { gt: since } } }),
	]);
	if (inFlight) return { ok: false, error: 'Your last submission is still being checked. Give it a minute.' };
	if (recent >= MAX_ATTEMPTS_PER_DAY) {
		return { ok: false, error: 'That’s a lot of submissions for one day. Run the tests on your own machine first, then try again tomorrow.' };
	}

	const configured = graderConfigured();
	const row = await lmsPrisma.submission.create({
		data: {
			studentId,
			lessonSlug: slug,
			assignment: lesson.assignment,
			repoUrl,
			status: configured ? 'queued' : 'received',
		},
	});

	if (configured) {
		try {
			await dispatch(row.id, repoUrl, lesson.assignment, callbackUrl);
		} catch (e) {
			console.error('grader dispatch failed', e);
			const failed = await lmsPrisma.submission.update({
				where: { id: row.id },
				data: {
					status: 'error',
					gradedAt: new Date(),
					result: {
						passed: false,
						summary: 'We couldn’t start the check. Nothing is wrong with your work. Try again in a few minutes.',
						error: 'dispatch',
					},
				},
			});
			return { ok: true, submission: toView(failed) };
		}
	}
	return { ok: true, submission: toView(row) };
}

/** Store the grader's report. A pass also marks the lesson done. */
export async function applyGradeResult(submissionId: string, result: GradeResult): Promise<boolean> {
	const row = await lmsPrisma.submission.findUnique({ where: { id: submissionId } });
	if (!row) return false;
	// A report for an attempt that's already graded is a retry of the same
	// callback. Keep the first one.
	if (row.status !== 'queued') return true;

	const status = result.error ? 'error' : result.passed ? 'passed' : 'failed';
	await lmsPrisma.submission.update({
		where: { id: submissionId },
		data: { status, result, gradedAt: new Date() },
	});
	if (status === 'passed') {
		await lmsPrisma.lessonProgress.upsert({
			where: { studentId_lessonSlug: { studentId: row.studentId, lessonSlug: row.lessonSlug } },
			create: { studentId: row.studentId, lessonSlug: row.lessonSlug },
			update: {},
		});
	}
	return true;
}
