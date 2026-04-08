import { scrapeWithCheerio } from '../libs/scrapers/webScraper';

// Curated and validated URLs for RAG system
const urlsToTest = [
	// ===== TOP TIER (20K+ chars) =====
	// React Documentation
	'https://react.dev/learn',
	'https://react.dev/reference/react/useState',
	'https://react.dev/reference/react/useEffect',
	'https://react.dev/learn/thinking-in-react',
	'https://react.dev/learn/describing-the-ui',

	// Next.js Documentation
	'https://nextjs.org/docs/app/building-your-application/routing',
	'https://nextjs.org/docs/app/building-your-application/data-fetching',

	// TypeScript Documentation
	'https://www.typescriptlang.org/docs/handbook/2/basic-types.html',

	// GitHub READMEs (Rich content)
	'https://github.com/pinecone-io/pinecone-ts-client',
	'https://github.com/vercel/ai',

	// ===== SUPPORTING (5K-20K chars) =====
	// Vercel AI SDK (for agents)
	'https://sdk.vercel.ai/docs',
	'https://sdk.vercel.ai/docs/ai-sdk-core/generating-text',

	// More React
	'https://react.dev/reference/react',
	'https://react.dev/learn/state-a-components-memory',
	'https://react.dev/learn/render-and-commit',
	'https://react.dev/reference/react/useContext',
	'https://react.dev/reference/react/useReducer',

	// More Next.js
	'https://nextjs.org/docs',
	'https://nextjs.org/docs/getting-started',
	'https://nextjs.org/docs/app/building-your-application/rendering',

	// More TypeScript
	'https://www.typescriptlang.org/docs/handbook/intro.html',
	'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',

	// More GitHub READMEs
	'https://github.com/vercel/next.js',
	'https://github.com/facebook/react',
];

type TestResult = {
	url: string;
	status: 'success' | 'failed' | 'too_short';
	contentLength?: number;
	title?: string;
	error?: string;
};

async function validateUrls() {
	// TODO: Implement URL validation
	//
	// Steps:
	// 1. Loop through each URL in urlsToTest
	// 2. Call scrapeWithCheerio() on each URL
	// 3. Classify results as 'success', 'failed', or 'too_short'
	// 4. Add a small delay between requests (500ms) to avoid rate limiting
	// 5. Print summary: successful count, failed count, too short count
	// 6. List recommended URLs (successful with > 5000 chars content)
	// 7. List failed URLs with error reasons

	throw new Error('validateUrls not implemented yet!');
}

validateUrls();
