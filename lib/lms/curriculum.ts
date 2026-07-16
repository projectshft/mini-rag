import { cache } from 'react';
import { promises as fs } from 'fs';
import path from 'path';

// Server-only: reads the curriculum markdown from disk. The files are
// bundled into the serverless function via outputFileTracingIncludes in
// next.config.ts. The markdown is the single source of truth — edit a
// day file (or the README week index), push, and the site reflects it.
//
// Structure: 6 weeks × 7 days (6 study days + 1 rest day), 42 days total.
// curriculum/README.md's "## Week index" section is the canonical ordering
// — it lists each day as "- Day N — [title](day-NN.md)", marks assignment
// days with 🎥, and lists rest days as plain (link-less) lines. Days are
// keyed by SLUG (the filename without .md, e.g. "day-03"), which is stable
// across curriculum edits, so student progress never shifts under a day.

export type Day = {
	slug: string; // filename without .md, e.g. "day-03"
	day: number; // 1..42
	title: string; // from the file's first "# " heading (fallback: index link text)
	time: string; // from the "**Time:** ...**" line, e.g. "~60 min · Hands-on"
	body: string; // day markdown, after the title + time lines
	week: number; // 1..6
	order: number; // global position among study days, for prev/next nav
	isDeliverable: boolean; // 🎥 assignment due / submission day
};

// A rest day — shown in the index for the full-schedule feel, but has no
// page and no progress row.
export type RestDay = {
	day: number;
	label: string; // e.g. "Rest day"
};

export type WeekEntry =
	| { kind: 'day'; dayInfo: Day }
	| { kind: 'rest'; dayInfo: RestDay };

// An extra lesson outside the day schedule. Two flavors, same shape:
// - "interview-NN" — listed under README "## Interview prep", gated
//   per-student by Student.interviewUnlockedAt
// - "bonus-*" — listed under README "## Bonus lessons", always available
//   (optional labs like the Bible chunking exercise)
export type InterviewLesson = {
	slug: string;
	title: string;
	time: string;
	body: string;
	order: number;
};

export type BonusLesson = InterviewLesson;

export type Week = {
	week: number; // 1..6
	name: string; // e.g. "Week 1 — Foundations (Days 1–7)"
	entries: WeekEntry[];
};

const CURRICULUM_DIR = path.join(process.cwd(), 'curriculum');

// A group header inside the week index: "**Week 3 — Agent Architecture (Days 15–21)**".
const GROUP_RE = /^\*\*Week\s+(\d+)\s*[—–-]\s*(.+?)\*\*\s*$/;
// A day line: "- Day 12 — [Fine-Tuning Overview](day-12.md) 🎥"
const DAY_LINK_RE = /^-\s*Day\s+(\d+)\s*[—–-]\s*\[([^\]]+)\]\(([A-Za-z0-9._-]+)\.md\)/;
// A rest / no-page day line: "- Day 7 — 🌴 Rest day"
const DAY_REST_RE = /^-\s*Day\s+(\d+)\s*[—–-]\s*(.+?)\s*$/;
const TITLE_RE = /^#\s+(.+?)\s*$/m;
const TIME_RE = /^\*\*Time:\*\*\s*(.+?)\s*$/m;

type IndexEntry =
	| { kind: 'day'; day: number; slug: string; linkText: string; isDeliverable: boolean }
	| { kind: 'rest'; day: number; label: string };
type IndexGroup = { week: number; name: string; entries: IndexEntry[] };

/** Parse the "## Week index" section of README.md into ordered groups. */
const parseIndex = cache(async (): Promise<IndexGroup[]> => {
	let readme = '';
	try {
		readme = await fs.readFile(path.join(CURRICULUM_DIR, 'README.md'), 'utf-8');
	} catch {
		return [];
	}

	// Scope to the "## Week index" section (up to the next "## " heading).
	const start = readme.search(/^##\s+Week index\s*$/m);
	if (start === -1) return [];
	const rest = readme.slice(start + 1);
	const end = rest.search(/^##\s+/m);
	const section = end === -1 ? rest : rest.slice(0, end);

	const groups: IndexGroup[] = [];
	let current: IndexGroup | null = null;

	for (const rawLine of section.split('\n')) {
		const line = rawLine.trim();
		const g = GROUP_RE.exec(line);
		if (g) {
			current = {
				week: parseInt(g[1], 10),
				name: `Week ${g[1]} — ${g[2].trim()}`,
				entries: [],
			};
			groups.push(current);
			continue;
		}
		if (!current) continue;

		const link = DAY_LINK_RE.exec(line);
		if (link) {
			current.entries.push({
				kind: 'day',
				day: parseInt(link[1], 10),
				linkText: link[2].trim(),
				slug: link[3],
				isDeliverable: line.includes('🎥'),
			});
			continue;
		}
		const restDay = DAY_REST_RE.exec(line);
		if (restDay) {
			current.entries.push({
				kind: 'rest',
				day: parseInt(restDay[1], 10),
				label: restDay[2].trim(),
			});
		}
		// anything else (prose, legend) is skipped
	}

	return groups;
});

function parseDayFile(
	raw: string,
	entry: Extract<IndexEntry, { kind: 'day' }>,
	week: number,
	order: number
): Day {
	const title = TITLE_RE.exec(raw)?.[1]?.trim() || entry.linkText;
	const timeMatch = TIME_RE.exec(raw);
	const time = timeMatch?.[1]?.trim() ?? '';

	// Body = everything after the "**Time:**" line (or after the title if
	// there's no time line): title + time render in page chrome, the rest
	// is the day's content.
	let body = raw;
	if (timeMatch) {
		body = raw.slice(timeMatch.index + timeMatch[0].length);
	} else {
		const titleMatch = TITLE_RE.exec(raw);
		if (titleMatch) body = raw.slice(titleMatch.index + titleMatch[0].length);
	}

	return {
		slug: entry.slug,
		day: entry.day,
		title,
		time,
		body: body.replace(/^\s+/, ''),
		week,
		order,
		isDeliverable: entry.isDeliverable,
	};
}

/** All study days in curriculum order (used for nav + the admin matrix). */
export const getDays = cache(async (): Promise<Day[]> => {
	const groups = await parseIndex();
	const bySlug = new Map<string, Day>();
	let order = 0;

	for (const group of groups) {
		for (const entry of group.entries) {
			if (entry.kind !== 'day' || bySlug.has(entry.slug)) continue;
			let raw: string;
			try {
				raw = await fs.readFile(path.join(CURRICULUM_DIR, `${entry.slug}.md`), 'utf-8');
			} catch {
				continue; // linked file missing — skip rather than crash
			}
			bySlug.set(entry.slug, parseDayFile(raw, entry, group.week, order++));
		}
	}

	return [...bySlug.values()];
});

/** A single day by slug, or null if unknown. */
export const getDay = cache(async (slug: string): Promise<Day | null> => {
	const days = await getDays();
	return days.find((d) => d.slug === slug) ?? null;
});

/**
 * Parse a README section ("## Interview prep" / "## Bonus lessons") of
 * `- [title](slug.md)` links into lessons, restricted to a slug prefix.
 */
async function parseExtraSection(
	header: RegExp,
	slugPrefix: string
): Promise<InterviewLesson[]> {
	let readme = '';
	try {
		readme = await fs.readFile(path.join(CURRICULUM_DIR, 'README.md'), 'utf-8');
	} catch {
		return [];
	}

	const start = readme.search(header);
	if (start === -1) return [];
	const rest = readme.slice(start + 1);
	const end = rest.search(/^##\s+/m);
	const section = end === -1 ? rest : rest.slice(0, end);

	const linkRe = new RegExp(`^-\\s*\\[([^\\]]+)\\]\\((${slugPrefix}[A-Za-z0-9._-]+)\\.md\\)`);
	const lessons: InterviewLesson[] = [];
	for (const rawLine of section.split('\n')) {
		const link = linkRe.exec(rawLine.trim());
		if (!link) continue;
		let raw: string;
		try {
			raw = await fs.readFile(path.join(CURRICULUM_DIR, `${link[2]}.md`), 'utf-8');
		} catch {
			continue;
		}
		const title = TITLE_RE.exec(raw)?.[1]?.trim() || link[1].trim();
		const timeMatch = TIME_RE.exec(raw);
		const time = timeMatch?.[1]?.trim() ?? '';
		let body = raw;
		if (timeMatch) {
			body = raw.slice(timeMatch.index + timeMatch[0].length);
		} else {
			const titleMatch = TITLE_RE.exec(raw);
			if (titleMatch) body = raw.slice(titleMatch.index + titleMatch[0].length);
		}
		lessons.push({
			slug: link[2],
			title,
			time,
			body: body.replace(/^\s+/, ''),
			order: lessons.length,
		});
	}
	return lessons;
}

/**
 * The gated interview-prep lessons, in README "## Interview prep" order.
 * Empty array if the section (or its files) don't exist.
 */
export const getInterviewLessons = cache(async (): Promise<InterviewLesson[]> => {
	return parseExtraSection(/^##\s+Interview prep\s*$/m, 'interview-');
});

/**
 * Ungated optional labs, in README "## Bonus lessons" order (slug prefix
 * "bonus-"). Always visible to every signed-in student.
 */
export const getBonusLessons = cache(async (): Promise<BonusLesson[]> => {
	return parseExtraSection(/^##\s+Bonus lessons\s*$/m, 'bonus-');
});

/** A single bonus lesson by slug, or null. */
export const getBonusLesson = cache(async (slug: string): Promise<BonusLesson | null> => {
	const lessons = await getBonusLessons();
	return lessons.find((l) => l.slug === slug) ?? null;
});

/** A single interview lesson by slug, or null. */
export const getInterviewLesson = cache(
	async (slug: string): Promise<InterviewLesson | null> => {
		const lessons = await getInterviewLessons();
		return lessons.find((l) => l.slug === slug) ?? null;
	}
);

/** The curriculum grouped for display: the six weeks, days + rest days in order. */
export const getWeeks = cache(async (): Promise<Week[]> => {
	const [groups, days] = await Promise.all([parseIndex(), getDays()]);
	const bySlug = new Map(days.map((d) => [d.slug, d]));

	return groups.map((group) => ({
		week: group.week,
		name: group.name,
		entries: group.entries
			.map((e): WeekEntry | null => {
				if (e.kind === 'rest') {
					return { kind: 'rest', dayInfo: { day: e.day, label: e.label } };
				}
				const dayInfo = bySlug.get(e.slug);
				return dayInfo ? { kind: 'day', dayInfo } : null;
			})
			.filter((e): e is WeekEntry => e !== null),
	}));
});
