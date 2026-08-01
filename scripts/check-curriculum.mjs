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
	const lines = readFileSync(`curriculum/${file}`, 'utf8').split('\n');

	lines.forEach((line, i) => {
		const at = `curriculum/${file}:${i + 1}`;

		for (const m of line.matchAll(/\]\(\/learn\/([a-z0-9-]+)\)/g)) {
			errors.push(`${at}  cross-lesson link -> ${m[1]} (name the concept in prose; Next/Prev handles nav)`);
		}
		if (/Assignment \d/.test(line)) {
			errors.push(`${at}  numbered assignment (name it instead: "Assignment: RAG Agent")`);
		}
		if (/\bDay \d+\b/.test(line) && i > 0) {
			errors.push(`${at}  "Day N" reference (say "last week"/"the chunking lesson" instead)`);
		}
	});
}

if (errors.length) {
	console.error(`curriculum check failed (${errors.length}):\n` + errors.map((e) => '  ' + e).join('\n'));
	process.exit(1);
}
console.log('curriculum ok — no forward links, no numbered assignments');
