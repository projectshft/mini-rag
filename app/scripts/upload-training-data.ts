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
 * USAGE:
 * 1. Ensure OPENAI_API_KEY is set in your environment
 * 2. Run: yarn train
 * 3. Monitor the job via the provided dashboard link
 * 4. Update config.ts when the job completes successfully
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
	// TODO: Implement training file upload
	//
	// Steps:
	// 1. Use openai.files.create() with the file and purpose: 'fine-tune'
	// 2. Log the file ID on success
	// 3. Return the file ID

	throw new Error('uploadTrainingFile not implemented yet!');
}

/**
 * Creates a fine-tuning job using the uploaded training data.
 * This is step 2 of the fine-tuning process.
 */
async function createFineTuningJob(fileId: string): Promise<void> {
	// TODO: Implement fine-tuning job creation
	//
	// Steps:
	// 1. Use openai.fineTuning.jobs.create() with training_file and model
	//    - Model: 'gpt-4o-mini-2024-07-18'
	// 2. Log the job ID and dashboard URL
	// 3. Remind user to update config.ts with new model ID after completion

	throw new Error('createFineTuningJob not implemented yet!');
}

async function main() {
	// TODO: Implement main orchestration
	//
	// Steps:
	// 1. Check for OPENAI_API_KEY environment variable
	// 2. Upload the training file using uploadTrainingFile()
	// 3. Create a fine-tuning job using createFineTuningJob()

	throw new Error('main not implemented yet!');
}

main();
