import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

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

async function createFineTuningJob(fileId: string): Promise<void> {
	try {
		const job = await openai.fineTuning.jobs.create({
			training_file: fileId,
			model: 'gpt-4o-mini-2024-07-18',
		});
		console.log('Fine-tuning job created successfully:', job.id);
		console.log(
			`You can monitor the job status using the OpenAI dashboard or the job ID:
			https://platform.openai.com/finetune/ftjob-${job.id}?filter=all`
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
