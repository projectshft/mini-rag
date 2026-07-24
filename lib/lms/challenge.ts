import { cache } from 'react';
import { promises as fs } from 'fs';
import path from 'path';

// Server-only loader for the 5-Day AI Advisor Challenge — a public-but-
// unlisted mini-course that lives at /challenge/<token>. Students build an
// AI advisory board of YouTubers (Gemini + system prompts + simple RAG +
// YouTube transcripts) against the projectshft/ai-advisor starter repo.
// The pages are ordinary curriculum-style markdown in challenge/*.md,
// rendered with the same LessonMarkdown pipeline as /learn, but with NO
// auth and NO progress rows: anyone with the link can read them, nobody
// can find them without it.
//
// The whole thing is a single client-rendered page (see the ChallengeCourse
// component) — these markdown files are the five steps it shows, with
// localStorage tracking progress in the browser. No auth, no server-side
// progress.
//
// The token is the whole access model. It's a capability URL: unguessable,
// unlinked from the rest of the site, noindexed (layout metadata +
// robots.txt + the scraper honeypot in middleware.ts). Rotate it by
// changing CHALLENGE_TOKEN in the deployment env — the old link 404s.

const DEFAULT_TOKEN = 'build-3809fed5ecb734f7';

export function isValidChallengeToken(token: string): boolean {
	return token === (process.env.CHALLENGE_TOKEN || DEFAULT_TOKEN);
}

export function challengeToken(): string {
	return process.env.CHALLENGE_TOKEN || DEFAULT_TOKEN;
}

export type ChallengePage = {
	slug: string; // filename without .md
	title: string; // first "# " heading
	time: string; // "**Time:** ..." line, e.g. "~30 min · Build"
	teaser: string; // one-liner for the step list, from the "> **The goal:**" quote
	body: string; // markdown after the Time line
	order: number; // 0-based position
};

// Explicit ordering — five steps, read in any order the student likes.
// Adding a step = add the file and list it here.
const PAGE_ORDER = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'];

const CHALLENGE_DIR = path.join(process.cwd(), 'challenge');
const TITLE_RE = /^#\s+(.+?)\s*$/m;
const TIME_RE = /^\*\*Time:\*\*\s*(.+?)\s*$/m;
const TEASER_RE = /^>\s*\*\*The goal:\*\*\s*(.+?)\s*$/m;

export const getChallengePages = cache(async (): Promise<ChallengePage[]> => {
	const pages: ChallengePage[] = [];
	for (const slug of PAGE_ORDER) {
		let raw: string;
		try {
			raw = await fs.readFile(path.join(CHALLENGE_DIR, `${slug}.md`), 'utf-8');
		} catch {
			continue; // listed but missing — skip rather than crash
		}
		const title = TITLE_RE.exec(raw)?.[1]?.trim() ?? slug;
		const timeMatch = TIME_RE.exec(raw);
		const time = timeMatch?.[1]?.trim() ?? '';
		const teaser = TEASER_RE.exec(raw)?.[1]?.trim() ?? '';
		let body = raw;
		if (timeMatch) {
			body = raw.slice(timeMatch.index + timeMatch[0].length);
		} else {
			const titleMatch = TITLE_RE.exec(raw);
			if (titleMatch) body = raw.slice(titleMatch.index + titleMatch[0].length);
		}
		pages.push({
			slug,
			title,
			time,
			teaser,
			body: body.replace(/^\s+/, ''),
			order: pages.length,
		});
	}
	return pages;
});

export const getChallengePage = cache(
	async (slug: string): Promise<ChallengePage | null> => {
		const pages = await getChallengePages();
		return pages.find((p) => p.slug === slug) ?? null;
	}
);
