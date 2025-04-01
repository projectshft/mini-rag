import * as fs from 'fs';
import { Pinecone } from '@pinecone-database/pinecone';
import * as path from 'path';
import { OpenAI } from 'openai';

const OPENAI_API_KEY = '';

const PINECONE_API_KEY = '';

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
const pineconeClient = new Pinecone({
	apiKey: PINECONE_API_KEY,
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
	const indexName = 'linkedin';
	const index = await ensureIndex(pineconeClient, indexName, 1536);

	const filePath = path.resolve(__dirname, 'data', 'linkedinposts.txt');
	const fileContent = fs.readFileSync(filePath, 'utf8');

	// Split posts at the metadata pattern and URN
	const posts = fileContent
		.split(/,TEXT,.*?urn:li:activity:\d+,/s)
		.filter(Boolean)
		.map((post) => post.trim())
		.filter((post) => post.length > 0);

	console.log(`Found ${posts.length} posts to process`);

	// Process each post sequentially
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		try {
			const embedding = await getEmbedding(openaiClient, post);

			await retryWithBackoff(() =>
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

			console.log(
				`Uploaded post ${i + 1} of ${posts.length} to Pinecone.`
			);
		} catch (error) {
			console.error(`Error processing post ${i + 1}:`, error);
			console.error('Post content:', post.substring(0, 100) + '...');
		}
	}

	console.log('Finished uploading posts to Pinecone.');
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
		model: 'text-embedding-ada-002', // TODO update to text-embedding-3-small
		input: text,
	});
	return response.data[0].embedding;
}

// Execute main function with error handling
main().catch((error) => {
	console.error('Script failed:', error);
	process.exit(1);
});
