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
	console.log(`📤 Uploading training file: ${filePath}`);

	const file = await openai.files.create({
		file: fs.createReadStream(filePath),
		purpose: 'fine-tune',
	});

	console.log(`✅ File uploaded successfully. File ID: ${file.id}`);
	return file.id;
}

/**
 * Creates a fine-tuning job using the uploaded training data.
 * This is step 2 of the fine-tuning process.
 */
async function createFineTuningJob(fileId: string): Promise<void> {
	console.log(`🚀 Creating fine-tuning job with file: ${fileId}`);

	const job = await openai.fineTuning.jobs.create({
		training_file: fileId,
		model: 'gpt-4o-mini-2024-07-18',
	});

	console.log(`\n✅ Fine-tuning job created successfully!`);
	console.log(`   Job ID: ${job.id}`);
	console.log(`   Status: ${job.status}`);
	console.log(`\n📊 Monitor progress at:`);
	console.log(`   https://platform.openai.com/finetune/${job.id}`);
	console.log(`\n⚠️  Once complete, update app/api/config.ts with the new model ID`);
}

async function main() {
	if (!process.env.OPENAI_API_KEY) {
		console.error('❌ OPENAI_API_KEY environment variable is not set');
		process.exit(1);
	}

	const trainingFilePath = path.join(
		process.cwd(),
		'app/scripts/data/linkedin_training.jsonl'
	);

	if (!fs.existsSync(trainingFilePath)) {
		console.error(`❌ Training file not found: ${trainingFilePath}`);
		process.exit(1);
	}

	const fileId = await uploadTrainingFile(trainingFilePath);
	await createFineTuningJob(fileId);
}

main();
