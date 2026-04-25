import fs from 'fs';
import path from 'path';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

const encodingForModel = new Tiktoken(o200k_base);

const MAX_TOKENS_PER_EXAMPLE = 16385;
const TARGET_EPOCHS = 3;
const MIN_TARGET_EXAMPLES = 100;
const MAX_TARGET_EXAMPLES = 25000;
const MIN_DEFAULT_EPOCHS = 1;
const MAX_DEFAULT_EPOCHS = 25;

type TrainingExample = {
	messages: Array<{
		role: string;
		content: string;
	}>;
};

function countTokens(text: string): number {
	return encodingForModel.encode(text).length;
}

function calculateTrainingCost(jsonlPath: string): void {
	const fileContent = fs.readFileSync(jsonlPath, 'utf-8');
	const lines = fileContent.trim().split('\n');
	const examples: TrainingExample[] = lines.map((line) => JSON.parse(line));

	const numExamples = examples.length;

	let epochs = TARGET_EPOCHS;
	if (numExamples * TARGET_EPOCHS < MIN_TARGET_EXAMPLES) {
		epochs = Math.min(
			MAX_DEFAULT_EPOCHS,
			Math.ceil(MIN_TARGET_EXAMPLES / numExamples)
		);
	} else if (numExamples * TARGET_EPOCHS > MAX_TARGET_EXAMPLES) {
		epochs = Math.max(
			MIN_DEFAULT_EPOCHS,
			Math.floor(MAX_TARGET_EXAMPLES / numExamples)
		);
	}

	let totalTokens = 0;
	for (const example of examples) {
		const text = example.messages.map((m) => m.content).join(' ');
		const tokens = Math.min(countTokens(text), MAX_TOKENS_PER_EXAMPLE);
		totalTokens += tokens;
	}

	const billingTokens = totalTokens * epochs;
	const costPerThousand = 0.008;
	const estimatedCost = (billingTokens / 1000) * costPerThousand;

	console.log('\n📊 Fine-Tuning Cost Estimate');
	console.log('═'.repeat(40));
	console.log(`Training examples:    ${numExamples}`);
	console.log(`Epochs:               ${epochs}`);
	console.log(`Tokens per epoch:     ${totalTokens.toLocaleString()}`);
	console.log(`Total billing tokens: ${billingTokens.toLocaleString()}`);
	console.log(`Estimated cost:       $${estimatedCost.toFixed(2)}`);
	console.log('═'.repeat(40));
}

// Run the estimation
const jsonlPath = path.join(
	process.cwd(),
	'app/scripts/data/linkedin_training.jsonl'
);
calculateTrainingCost(jsonlPath);
