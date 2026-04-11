import * as fs from 'fs';
import * as path from 'path';

const CSV_URL =
	'https://huggingface.co/datasets/CShorten/ML-ArXiv-Papers/resolve/c878972daa0a5ec5f0d684354b6c8018f27d1316/ML-Arxiv-Papers.csv';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'white-papers');

const MAX_PAPERS = 500;

const RELEVANCE_KEYWORDS = [
	'rag',
	'retrieval-augmented',
	'retrieval augmented',
	'llm',
	'large language model',
	'embedding',
	'transformer',
	'agent',
	'language model',
	'fine-tuning',
	'fine tuning',
	'finetuning',
	'vector database',
	'vector search',
	'semantic search',
	'prompt engineering',
	'in-context learning',
	'instruction tuning',
	'reinforcement learning from human feedback',
	'rlhf',
	'attention mechanism',
	'gpt',
	'bert',
	'neural network',
	'deep learning',
	'natural language processing',
	'nlp',
	'text generation',
	'question answering',
	'summarization',
	'chatbot',
	'conversational ai',
	'knowledge graph',
	'information retrieval',
	'text classification',
	'named entity recognition',
	'sentiment analysis',
	'machine translation',
	'tokenization',
	'word2vec',
	'diffusion model',
];

type Paper = {
	title: string;
	abstract: string;
};

/**
 * Parse a single CSV line handling quoted fields that may contain
 * commas and newlines.
 */
function parseCSVLine(line: string): string[] {
	const fields: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
				// Escaped quote
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === ',' && !inQuotes) {
			fields.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}

	fields.push(current.trim());
	return fields;
}

/**
 * Parse the full CSV text into rows. Handles multi-line quoted fields.
 */
function parseCSV(text: string): string[][] {
	const rows: string[][] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];

		if (char === '"') {
			if (inQuotes && i + 1 < text.length && text[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
			current += char;
		} else if (char === '\n' && !inQuotes) {
			if (current.trim()) {
				rows.push(parseCSVLine(current));
			}
			current = '';
		} else {
			current += char;
		}
	}

	if (current.trim()) {
		rows.push(parseCSVLine(current));
	}

	return rows;
}

function isRelevant(title: string, abstract: string): boolean {
	const combined = `${title} ${abstract}`.toLowerCase();
	return RELEVANCE_KEYWORDS.some((keyword) => combined.includes(keyword));
}

async function fetchPapers(): Promise<void> {
	console.log('Fetching ML ArXiv papers CSV...');
	const response = await fetch(CSV_URL);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch CSV: ${response.status} ${response.statusText}`,
		);
	}

	const csvText = await response.text();
	console.log(
		`Downloaded CSV (${(csvText.length / 1024 / 1024).toFixed(1)} MB)`,
	);

	const rows = parseCSV(csvText);

	if (rows.length < 2) {
		throw new Error('CSV has no data rows');
	}

	// First row is headers
	const headers = rows[0].map((h) => h.toLowerCase().trim());
	const titleIdx = headers.indexOf('title');
	const abstractIdx = headers.indexOf('abstract');

	if (titleIdx === -1 || abstractIdx === -1) {
		throw new Error(
			`Could not find title/abstract columns. Headers: ${headers.join(', ')}`,
		);
	}

	console.log(`Parsed ${rows.length - 1} total papers`);
	console.log('Filtering for AI/ML relevance...');

	const papers: Paper[] = [];

	for (let i = 1; i < rows.length && papers.length < MAX_PAPERS; i++) {
		const row = rows[i];
		if (!row || row.length <= Math.max(titleIdx, abstractIdx)) continue;

		const title = row[titleIdx]?.trim();
		const abstract = row[abstractIdx]?.trim();

		if (!title || !abstract) continue;

		if (isRelevant(title, abstract)) {
			papers.push({ title, abstract });
		}
	}

	console.log(
		`Found ${papers.length} relevant papers (capped at ${MAX_PAPERS})`,
	);

	// Ensure output directory exists
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		console.log(`Created directory: ${OUTPUT_DIR}`);
	}

	// Write each paper as an individual JSON file
	for (let i = 0; i < papers.length; i++) {
		const filename = `paper-${String(i + 1).padStart(4, '0')}.json`;
		const filepath = path.join(OUTPUT_DIR, filename);
		fs.writeFileSync(filepath, JSON.stringify(papers[i], null, 2));
	}

	console.log(`Saved ${papers.length} papers to ${OUTPUT_DIR}`);
}

fetchPapers().catch((error) => {
	console.error('Error fetching papers:', error);
	process.exit(1);
});
