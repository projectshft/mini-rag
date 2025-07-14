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
	const tokens = encodingForModel.encode(text);
	return tokens.length;
}

function calculateTrainingCost(jsonlPath: string): void {
	const fileContent = fs.readFileSync(jsonlPath, 'utf-8');
	const examples = fileContent
		.split('\n')
		.filter((line) => line.trim())
		.map((line) => JSON.parse(line) as TrainingExample);

	const n_train_examples = examples.length;
	let n_epochs = TARGET_EPOCHS;

	if (n_train_examples * TARGET_EPOCHS < MIN_TARGET_EXAMPLES) {
		n_epochs = Math.min(
			MAX_DEFAULT_EPOCHS,
			Math.ceil(MIN_TARGET_EXAMPLES / n_train_examples)
		);
	} else if (n_train_examples * TARGET_EPOCHS > MAX_TARGET_EXAMPLES) {
		n_epochs = Math.max(
			MIN_DEFAULT_EPOCHS,
			Math.floor(MAX_TARGET_EXAMPLES / n_train_examples)
		);
	}

	const convo_lens = examples.map((example) => {
		const totalContent = example.messages
			.map((msg) => msg.content)
			.join(' ');
		return countTokens(totalContent);
	});

	const n_billing_tokens_in_dataset = convo_lens.reduce(
		(sum, length) => sum + Math.min(MAX_TOKENS_PER_EXAMPLE, length),
		0
	);

	console.log(
		`Dataset has ~${n_billing_tokens_in_dataset} tokens that will be charged for during training`
	);
	console.log(
		`By default, you'll train for ${n_epochs} epochs on this dataset`
	);
	console.log(
		`By default, you'll be charged for ~${
			n_epochs * n_billing_tokens_in_dataset
		} tokens`
	);

	// Calculate cost (assuming $0.008 per 1K tokens for fine-tuning)
	const costPer1KTokens = 0.008;
	const totalCost =
		((n_epochs * n_billing_tokens_in_dataset) / 1000) * costPer1KTokens;
	console.log(`Estimated cost: $${totalCost.toFixed(2)}`);
}

// Run the estimation
const jsonlPath = path.join(
	process.cwd(),
	'app/scripts/data/linkedin_training.jsonl'
);
calculateTrainingCost(jsonlPath);
