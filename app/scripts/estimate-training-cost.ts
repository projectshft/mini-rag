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
	// TODO: Implement token counting
	//
	// Use encodingForModel.encode() to tokenize the text
	// Return the number of tokens

	throw new Error('countTokens not implemented yet!');
}

function calculateTrainingCost(jsonlPath: string): void {
	// TODO: Implement training cost estimation
	//
	// Steps:
	// 1. Read the JSONL file and parse each line as a TrainingExample
	// 2. Calculate number of epochs based on example count:
	//    - If examples * TARGET_EPOCHS < MIN_TARGET_EXAMPLES: increase epochs
	//    - If examples * TARGET_EPOCHS > MAX_TARGET_EXAMPLES: decrease epochs
	// 3. Count tokens for each example (concatenate all message contents)
	//    - Cap each example at MAX_TOKENS_PER_EXAMPLE
	// 4. Calculate total billing tokens = sum of tokens * epochs
	// 5. Calculate cost at $0.008 per 1K tokens
	// 6. Print the results

	throw new Error('calculateTrainingCost not implemented yet!');
}

// Run the estimation
const jsonlPath = path.join(
	process.cwd(),
	'app/scripts/data/linkedin_training.jsonl'
);
calculateTrainingCost(jsonlPath);
