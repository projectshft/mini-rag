// Guards two conventions that kept silently rotting (see curriculum/AUTHORING.md):
//   1. No forward links — a day may only link to days already covered.
//   2. No numbered assignments — "Assignment 2" drifts when a lesson moves.
// Run: yarn check:curriculum
import { readdirSync, readFileSync } from 'node:fs';

const errors = [];

for (const file of readdirSync('curriculum').sort()) {
	// AUTHORING/README document the rules, so they quote the banned patterns.
	if (!file.endsWith('.md') || file === 'AUTHORING.md' || file === 'README.md') continue;
	const day = /^day-(\d+)\.md$/.exec(file)?.[1];
	const raw = readFileSync(`curriculum/${file}`, 'utf8');
	const lines = raw.split('\n');

	lines.forEach((line, i) => {
		const at = `curriculum/${file}:${i + 1}`;

		for (const m of line.matchAll(/\]\(\/learn\/([a-z0-9-]+)\)/g)) {
			errors.push(`${at}  cross-lesson link -> ${m[1]} (name the concept in prose; Next/Prev handles nav)`);
		}
		if (/Assignment \d/.test(line)) {
			errors.push(`${at}  numbered assignment (name it instead: "Assignment: RAG Agent")`);
		}
		// Case-insensitive: "day 18's structured outputs" slipped past the strict form.
		if (/\bday[ -]\d+/i.test(line) && i > 0) {
			errors.push(`${at}  day-number reference (say "last week"/"the chunking lesson" instead)`);
		}
	});

	// Quiz answer keys: an out-of-range index marks the correct option wrong and
	// tells the student a distractor was right.
	for (const m of raw.matchAll(/```quiz\n([\s\S]*?)```/g)) {
		let qs;
		try {
			qs = JSON.parse(m[1]);
		} catch {
			errors.push(`curriculum/${file}  quiz block is not valid JSON`);
			continue;
		}
		for (const q of qs) {
			if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
				errors.push(`curriculum/${file}  quiz answer ${q.answer} out of range: "${String(q.q).slice(0, 50)}"`);
			}
		}
	}

	for (const m of raw.matchAll(/```scenario\n([\s\S]*?)```/g)) {
		try {
			const d = JSON.parse(m[1]);
			if (!d.options?.some((o) => o.verdict === 'best')) {
				errors.push(`curriculum/${file}  scenario has no "best" option`);
			}
		} catch {
			errors.push(`curriculum/${file}  scenario block is not valid JSON`);
		}
	}
}

if (errors.length) {
	console.error(`curriculum check failed (${errors.length}):\n` + errors.map((e) => '  ' + e).join('\n'));
	process.exit(1);
}
console.log('curriculum ok — no forward links, no numbered assignments');
