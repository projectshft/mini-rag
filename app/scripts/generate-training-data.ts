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
	// TODO: Implement topic extraction
	//
	// Steps:
	// 1. Get the first sentence of the text (split by .!?)
	// 2. If the first sentence is < 150 chars, return it trimmed
	// 3. Otherwise return first 100 chars + '...'

	throw new Error('extractTopic not implemented yet!');
}

// Simple CSV parser - just split on newlines and handle quoted fields
function parseCSV(content: string): Array<Record<string, string>> {
	// TODO: Implement CSV parsing
	//
	// Steps:
	// 1. Split content into lines
	// 2. Extract headers from first line
	// 3. For each remaining line, parse fields handling quoted values
	//    - Track whether you're inside quotes to handle commas within fields
	// 4. Map each row's values to headers to create Record objects
	// 5. Return array of records

	throw new Error('parseCSV not implemented yet!');
}

function generateTrainingExamples(csvPath: string, numExamples: number): void {
	// TODO: Implement training data generation
	//
	// Steps:
	// 1. Read and parse the CSV file using parseCSV()
	// 2. Filter to posts with text between 50-3000 chars
	// 3. Randomly sample numExamples posts
	// 4. For each post:
	//    a. Extract topic using extractTopic()
	//    b. Pick a random question template and fill in the topic
	//    c. Create a TrainingExample with system/user/assistant messages
	//    d. Optionally create a second example with a generic prompt
	// 5. Shuffle all examples
	// 6. Write to JSONL format at app/scripts/data/linkedin_training.jsonl

	throw new Error('generateTrainingExamples not implemented yet!');
}

// Generate 100 examples
const csvPath = path.join(
	process.cwd(),
	'app/scripts/data/brian_posts.csv'
);
generateTrainingExamples(csvPath, 100);
