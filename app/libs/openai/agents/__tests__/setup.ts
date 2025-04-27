import dotenv from 'dotenv';
import path from 'path';

// Try loading from .env first, then .env.test as fallback
const envPath = path.resolve(process.cwd(), '.env');
const envTestPath = path.resolve(process.cwd(), '.env.test');

// Load environment variables
dotenv.config({ path: envPath });
dotenv.config({ path: envTestPath, override: true });

// Ensure required environment variables are set
const requiredEnvVars = [
	'OPENAI_API_KEY',
	'PINECONE_API_KEY',
	'HELICONE_API_KEY',
];

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		console.warn(`Warning: Missing environment variable: ${envVar}`);
		// Set a dummy value for testing
		process.env[envVar] = 'test_' + envVar;
	}
}
