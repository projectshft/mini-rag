import * as fs from 'fs';
import { pineconeClient } from '../libs/pinecone';
import { openaiClient } from '../libs/openai';
import { type Pinecone } from '@pinecone-database/pinecone';
import * as path from 'path';
import { type OpenAI } from 'openai';

async function retryWithBackoff(fn: () => void, retries = 5, delay = 1000) {
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
}

async function main() {
	const indexName = 'linkedin';
	const index = await ensureIndex(pineconeClient, indexName, 1536);

	const filePath = path.resolve(__dirname, 'data', 'linkedinposts.txt');
	const posts = fs.readFileSync(filePath, 'utf8').split('**');

	posts.map(async (post, i) => {
		const embedding = await getEmbedding(openaiClient, post);

		retryWithBackoff(() =>
			index.upsert([
				{
					id: `post-${i + 1}`,
					values: embedding,
					metadata: {
						post,
					},
				},
			])
		);

		console.log(`Uploaded post ${i + 1} to Pinecone.`);
	});
}

async function ensureIndex(
	client: Pinecone,
	indexName: string,
	dimension: number
) {
	console.log(`Creating index: ${indexName}`);
	const indexes = await client.listIndexes();
	console.log(indexes);
	const idx = indexes.indexes?.find((index) => index.name === indexName);
	if (idx) {
		console.log(`Index ${indexName} already exists.`);
		return client.Index(indexName);
	}

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
		model: 'text-embedding-ada-002',
		input: text,
	});
	return response.data[0].embedding;
}

main();
