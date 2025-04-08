import fs from 'fs/promises';
import { openaiClient } from '@/app/libs/openai';
import { pineconeClient } from '@/app/libs/pinecone';
import { Index } from '@pinecone-database/pinecone';
import { GitHubRepo } from '../scraping/github';

// Function to chunk text into smaller pieces
function chunkText(text: string, maxChunkSize: number = 1000): string[] {
	const chunks: string[] = [];
	let currentChunk = '';

	// Split by paragraphs or newlines
	const paragraphs = text.split(/\n\s*\n/);

	for (const paragraph of paragraphs) {
		if (currentChunk.length + paragraph.length <= maxChunkSize) {
			currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
		} else {
			if (currentChunk) chunks.push(currentChunk);
			currentChunk = paragraph;
		}
	}

	if (currentChunk) chunks.push(currentChunk);

	return chunks;
}

// Function to create a text representation of a repo
function createRepoText(repo: GitHubRepo): string {
	return `
    Repository: ${repo.name}
    Description: ${repo.description}
    Language: ${repo.language}
    Stars: ${repo.stars}
    Forks: ${repo.forks}
    Last Updated: ${repo.lastUpdated}
    URL: https://github.com${repo.url}
    
    Content:
    ${repo.content}
  `;
}

// Function to vectorize and store a repository
async function vectorizeRepo(repo: GitHubRepo, index: Index) {
	const repoText = createRepoText(repo);
	const chunks = chunkText(repoText);

	for (let i = 0; i < chunks.length; i++) {
		const chunk = chunks[i];

		// Generate embedding for the chunk
		const embeddingResponse = await openaiClient.embeddings.create({
			model: 'text-embedding-ada-002',
			input: chunk,
		});

		const embedding = embeddingResponse.data[0].embedding;

		// Create a unique ID for this chunk
		const id = `${repo.name}-chunk-${i}`;

		// Prepare metadata
		const metadata = {
			repoName: repo.name,
			repoUrl: `https://github.com${repo.url}`,
			chunkIndex: i,
			totalChunks: chunks.length,
			lastUpdated: repo.lastUpdated,
			language: repo.language,
		};

		// Upsert to Pinecone
		await index.upsert([
			{
				id,
				values: embedding,
				metadata,
			},
		]);
	}
}

// Main function to process repositories and add them to Pinecone
export async function processReposToPinecone(
	reposFilePath: string,
	daysThreshold: number = 30
) {
	try {
		// Read the repositories file
		const reposData = await fs.readFile(reposFilePath, 'utf-8');
		const repos: GitHubRepo[] = JSON.parse(reposData);

		// Filter repos by update date
		const thresholdDate = new Date();
		thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

		const recentRepos = repos.filter((repo) => {
			const updateDate = new Date(repo.lastUpdated);
			return updateDate >= thresholdDate;
		});

		console.log(`Processing ${recentRepos.length} recent repositories`);

		// Get Pinecone index
		const index = pineconeClient.Index('github');

		// Process each repository
		for (const repo of recentRepos) {
			console.log(`Processing repository: ${repo.name}`);
			await vectorizeRepo(repo, index);
			console.log(`Completed processing: ${repo.name}`);
		}

		console.log('All repositories processed successfully');
	} catch (error) {
		console.error('Error processing repositories:', error);
		throw error;
	}
}

// Run the function if this file is executed directly
if (require.main === module) {
	const reposFilePath = 'github-repos.json';
	const daysThreshold = 30; // Number of days to look back

	processReposToPinecone(reposFilePath, daysThreshold)
		.then(() => console.log('Done'))
		.catch((error) => console.error('Error:', error));
}
