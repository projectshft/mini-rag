import * as fs from 'fs';
import { Pinecone } from '@pinecone-database/pinecone';
import * as path from 'path';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pineconeClient = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY || '',
});

async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	retries = 5,
	delay = 1000
): Promise<T> {
	for (let i = 0; i < retries; i++) {
		try {
			return await fn();
		} catch (err) {
			if (i === retries - 1) throw err;
			console.log(`Retrying in ${delay}ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			delay *= 2; // Exponential backoff
		}
	}
	throw new Error('Failed after retries');
}

async function main() {
	const indexName = 'articles';
	const index = await ensureIndex(pineconeClient, indexName, 1536);

	const dataDir = path.resolve(__dirname, 'data');
	const conservativeDir = path.join(dataDir, 'conservative');
	const liberalDir = path.join(dataDir, 'liberal');

	// Process conservative articles
	await processArticles(conservativeDir, 'conservative', index);

	// Process liberal articles
	await processArticles(liberalDir, 'liberal', index);

	console.log('Finished uploading all articles to Pinecone.');
}

async function processArticles(
	dir: string,
	bias: 'conservative' | 'liberal',
	index: ReturnType<typeof pineconeClient.Index>
) {
	const files = fs.readdirSync(dir);
	console.log(`Processing ${files.length} ${bias} articles...`);

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const filePath = path.join(dir, file);

		try {
			const content = fs.readFileSync(filePath, 'utf8');
			const embedding = await getEmbedding(openaiClient, content);

			await retryWithBackoff(() =>
				index.upsert([
					{
						id: `${bias}-${i + 1}`,
						values: embedding,
						metadata: {
							content,
							bias,
							source: file,
						},
					},
				])
			);

			console.log(
				`Uploaded ${bias} article ${i + 1} of ${
					files.length
				} to Pinecone.`
			);
		} catch (error) {
			console.error(`Error processing ${bias} article ${file}:`, error);
		}
	}
}

async function ensureIndex(
	client: Pinecone,
	indexName: string,
	dimension: number
) {
	console.log(`Checking index: ${indexName}`);
	const indexes = await client.listIndexes();
	const idx = indexes.indexes?.find((index) => index.name === indexName);

	if (idx) {
		console.log(`Index ${indexName} already exists.`);
		return client.Index(indexName);
	}

	console.log(`Creating index: ${indexName}`);
	await client.createIndex({
		name: indexName,
		dimension,
		spec: {
			serverless: {
				cloud: 'aws',
				region: 'us-east-1',
			},
		},
	});

	return client.Index(indexName);
}

async function getEmbedding(api: OpenAI, text: string): Promise<number[]> {
	const response = await api.embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
	});
	return response.data[0].embedding;
}

// Execute main function with error handling
main().catch((error) => {
	console.error('Script failed:', error);
	process.exit(1);
});
