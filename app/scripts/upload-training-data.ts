/**
 * Fine-Tuning Training Data Upload Script
 *
 * This script uploads training data to OpenAI and creates a fine-tuning job to create
 * a custom model based on gpt-4o-mini-2024-07-18.
 *
 * WORKFLOW:
 * 1. Run this script to upload training data and start fine-tuning
 * 2. Monitor the fine-tuning job until completion (can take minutes to hours)
 * 3. Once complete, OpenAI will provide a fine-tuned model ID (format: ft:gpt-4o-mini-2024-07-18:personal::XXXXXXXX)
 * 4. Update app/api/config.ts with the new fine-tuned model ID
 *
 * RELATIONSHIP WITH CONFIG.TS:
 * - The config.ts file contains model enums used throughout the application
 * - After this script completes fine-tuning, you MUST update the fine-tuned model ID in config.ts
 * - Replace 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt' with your new model ID
 *
 * USAGE:
 * 1. Ensure OPENAI_API_KEY is set in your environment
 * 2. Run: yarn train
 * 3. Monitor the job via the provided dashboard link
 * 4. Update config.ts when the job completes successfully
 *
 * MODEL SELECTION GUIDE:
 * - Use 'gpt-4o-mini' for general queries or when fine-tuned model isn't needed
 * - Use the fine-tuned model (ft:gpt-4o-mini-2024-07-18:personal::XXXXXXXX) for specialized tasks
 *   that benefit from the training data (typically LinkedIn-related queries in this case)
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Uploads the training data file to OpenAI for fine-tuning.
 * This is step 1 of the fine-tuning process.
 */
async function uploadTrainingFile(filePath: string): Promise<string> {
	try {
		const file = await openai.files.create({
			file: fs.createReadStream(filePath),
			purpose: 'fine-tune',
		});
		console.log('File uploaded successfully:', file.id);
		return file.id;
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
}

/**
 * Creates a fine-tuning job using the uploaded training data.
 * This is step 2 of the fine-tuning process.
 * Once this job completes, you'll receive a fine-tuned model ID that needs to be
 * updated in app/api/config.ts to replace the current fine-tuned model reference.
 */
async function createFineTuningJob(fileId: string): Promise<void> {
	try {
		const job = await openai.fineTuning.jobs.create({
			training_file: fileId,
			model: 'gpt-4o-mini-2024-07-18', // Base model for fine-tuning
		});
		console.log('Fine-tuning job created successfully:', job.id);
		console.log(
			`You can monitor the job status using the OpenAI dashboard or the job ID:
			https://platform.openai.com/finetune/ftjob-${job.id}?filter=all`
		);
		console.log(
			'\n🚨 IMPORTANT: Once the fine-tuning job completes, you will receive a new fine-tuned model ID.'
		);
		console.log(
			'   Update the model ID in app/api/config.ts to use your new fine-tuned model.\n'
		);
	} catch (error) {
		console.error('Error creating fine-tuning job:', error);
		throw error;
	}
}

async function main() {
	if (!process.env.OPENAI_API_KEY) {
		console.error('Please set OPENAI_API_KEY environment variable');
		process.exit(1);
	}

	const jsonlPath = path.join(
		process.cwd(),
		'app/scripts/data/linkedin_training.jsonl'
	);

	try {
		console.log('Uploading training file...');
		const fileId = await uploadTrainingFile(jsonlPath);

		console.log('Creating fine-tuning job...');
		await createFineTuningJob(fileId);
	} catch (error) {
		console.error('Process failed:', error);
		process.exit(1);
	}
}

main();
