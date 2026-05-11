import fs from 'fs';
import path from 'path';

type TrainingExample = {
	messages: Array<{
		role: 'system' | 'user' | 'assistant';
		content: string;
	}>;
};

const systemPrompt = `You are Brian Jenney, a software engineering instructor and founder of Parsity, an online coding bootcamp. You write LinkedIn posts about software development, career advice for developers, learning to code, and the tech industry. Your writing style is:
- Direct and honest, sometimes contrarian
- Conversational and relatable
- Skeptical of hype and buzzwords
- Supportive of learners but realistic about challenges
- Uses occasional humor and self-deprecation
- Keeps posts concise and readable`;

const questionTemplates = [
	'What do you think about {topic}?',
	'Can you share your thoughts on {topic}?',
	'How do you feel about {topic}?',
	"What's your take on {topic}?",
	'Tell me about {topic}',
	'Can you write a LinkedIn post about {topic}?',
	'Share your perspective on {topic}',
	"What's your opinion on {topic}?",
	'Write something about {topic}',
	'Post about {topic}',
	'Explain {topic}',
	'Give me your honest opinion on {topic}',
	'What would you tell developers about {topic}?',
	'How should people think about {topic}?',
	'Break down {topic} for me',
	'Talk about {topic}',
	'Share your experience with {topic}',
	'What are your thoughts on {topic}?',
	'Discuss {topic}',
	'What should people know about {topic}?',
];

const genericPrompts = [
	'Write a LinkedIn post',
	'Share something on LinkedIn',
	'Post something',
	'What would you post on LinkedIn?',
	'Write about tech',
	'Share your thoughts',
	'Post about software development',
	'Write about being a developer',
	'Share career advice',
	'Post something for developers',
];

// Extract likely topics from posts
function extractTopic(text: string): string {
	// Get first sentence or first 100 chars as topic
	const firstSentence = text.split(/[.!?]/)[0];
	if (firstSentence && firstSentence.length < 150) {
		return firstSentence.trim();
	}
	return text.substring(0, 100).trim() + '...';
}

// Simple CSV parser - just split on newlines and handle quoted fields
function parseCSV(content: string): Array<Record<string, string>> {
	const lines = content.split('\n');
	const headers = lines[0].split(',').map((h) => h.trim());

	const records: Array<Record<string, string>> = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		if (!line.trim()) continue;

		// Simple parser - handles quoted fields
		const values: string[] = [];
		let current = '';
		let inQuotes = false;

		for (let j = 0; j < line.length; j++) {
			const char = line[j];

			if (char === '"') {
				inQuotes = !inQuotes;
			} else if (char === ',' && !inQuotes) {
				values.push(current.trim());
				current = '';
			} else {
				current += char;
			}
		}
		values.push(current.trim()); // Push last value

		const record: Record<string, string> = {};
		headers.forEach((header, idx) => {
			record[header] = values[idx] || '';
		});

		records.push(record);
	}

	return records;
}

function generateTrainingExamples(csvPath: string, numExamples: number): void {
	// Read and parse CSV
	const csvContent = fs.readFileSync(csvPath, 'utf-8');
	const records = parseCSV(csvContent);

	console.log(`Found ${records.length} posts in CSV`);

	// Filter posts with meaningful content (text field)
	const validPosts = records.filter((row) => {
		const text = row['text'] || '';
		return text.length > 50 && text.length < 3000;
	});

	console.log(`${validPosts.length} posts with valid length`);

	// Randomly sample posts
	const selectedPosts = validPosts
		.sort(() => Math.random() - 0.5)
		.slice(0, Math.min(numExamples, validPosts.length));

	const trainingExamples: TrainingExample[] = [];

	selectedPosts.forEach((post) => {
		const text = post['text'] || '';

		// Generate a question based on the post content
		const topic = extractTopic(text);
		const template =
			questionTemplates[
				Math.floor(Math.random() * questionTemplates.length)
			];
		const question = template.replace('{topic}', topic);

		trainingExamples.push({
			messages: [
				{
					role: 'system',
					content: systemPrompt,
				},
				{
					role: 'user',
					content: question,
				},
				{
					role: 'assistant',
					content: text,
				},
			],
		});

		// Also create a variation with a generic prompt - helps learn writing style
		// This helps the model learn the writing style more generally
		if (Math.random() > 0.5) {
			const genericPrompt =
				genericPrompts[
					Math.floor(Math.random() * genericPrompts.length)
				];
			trainingExamples.push({
				messages: [
					{
						role: 'system',
						content: systemPrompt,
					},
					{
						role: 'user',
						content: genericPrompt,
					},
					{
						role: 'assistant',
						content: text,
					},
				],
			});
		}
	});

	// Shuffle the examples
	const shuffled = trainingExamples.sort(() => Math.random() - 0.5);

	// Write to JSONL
	const outputPath = path.join(
		process.cwd(),
		'app/scripts/data/linkedin_training.jsonl'
	);

	const jsonlContent = shuffled.map((ex) => JSON.stringify(ex)).join('\n');

	fs.writeFileSync(outputPath, jsonlContent);

	console.log(`\n✅ Generated ${shuffled.length} training examples`);
	console.log(`📄 Saved to: ${outputPath}`);
	console.log(
		`\nRun 'npx tsx app/scripts/estimate-training-cost.ts' to estimate cost`
	);
}

// Generate 100 examples
const csvPath = path.join(
	process.cwd(),
	'app/scripts/data/brian_posts.csv'
);
generateTrainingExamples(csvPath, 100);
