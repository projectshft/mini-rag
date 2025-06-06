# TypeScript RAG System Learning Guide 🎓

_A comprehensive guide for typescript engineers to master modern AI development using TypeScript, RAG, and Vector Databases_

## Table of Contents

1. [Understanding Vector Databases & Linear Algebra](#understanding-vector-databases--linear-algebra)
2. [RAG (Retrieval Augmented Generation) Deep Dive](#rag-retrieval-augmented-generation-deep-dive)
3. [Fine-Tuning vs RAG: When to Use Each](#fine-tuning-vs-rag-when-to-use-each)
4. [Building AI Agents](#building-ai-agents)
5. [Testing AI Systems](#testing-ai-systems)
6. [Prompt Engineering Fundamentals](#prompt-engineering-fundamentals)
7. [Data Scraping & Ingestion Pipeline](#data-scraping--ingestion-pipeline)
8. [Project Architecture & Best Practices](#project-architecture--best-practices)
9. [Project Guidelines](#student-project-guidelines)

---

## Understanding Vector Databases & Linear Algebra

### What Are Vector Embeddings?

Think of embeddings as **coordinates in meaning-space**. Just like GPS coordinates locate you geographically, embeddings locate text in semantic space.

#### Linear Algebra Fundamentals

**1. Vectors as Arrays of Numbers**

```typescript
// An embedding is just an array of numbers (typically 1536 dimensions for OpenAI)
type Embedding = number[]; // [0.1, -0.3, 0.8, ..., 0.2]

// Example: "climate change" might become:
const climateEmbedding = [0.1, -0.3, 0.8, 0.4, -0.2 /* ...1531 more numbers */];
const warmingEmbedding = [0.2, -0.2, 0.7, 0.5, -0.1 /* ...1531 more numbers */];
```

**2. Similarity = Dot Product**

```typescript
// Simplified similarity calculation (actual implementation is more complex)
function cosineSimilarity(a: number[], b: number[]): number {
	const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
	const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
	const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
	return dotProduct / (magnitudeA * magnitudeB);
}

// Higher similarity = more related meaning
// 0.9+ = very similar, 0.7+ = related, 0.5- = different topics
```

**3. Why Vector Databases Work**

```typescript
// Traditional keyword search:
searchKeywords('climate change'); // Only finds exact phrase

// Vector similarity search:
searchSemantic('climate change'); // Finds:
// - "global warming" (0.85 similarity)
// - "carbon emissions" (0.78 similarity)
// - "environmental policy" (0.72 similarity)
```

### Practical Implementation

```typescript
// From app/libs/pinecone.ts
export const searchDocuments = async (query: string, topK: number = 3) => {
	const index = pineconeClient.Index('articles');

	// 1. Convert text to vector
	const queryEmbedding = await openaiClient.embeddings.create({
		model: 'text-embedding-3-small',
		input: query,
	});

	// 2. Find similar vectors using cosine similarity
	const docs = await index.query({
		vector: queryEmbedding.data[0].embedding, // The 1536-dimensional array
		topK, // Return top K most similar
		includeMetadata: true,
	});

	return docs.matches; // Sorted by similarity score
};
```

---

## RAG (Retrieval Augmented Generation) Deep Dive

RAG combines **information retrieval** with **text generation** to give LLMs access to current, specific information.

### The RAG Pipeline

```typescript
// Complete RAG implementation from app/libs/openai/agents/news-agent.ts

async function ragPipeline(userQuestion: string): Promise<string> {
	// STEP 1: RETRIEVAL - Find relevant documents
	const relevantDocs = await searchVectors(userQuestion);

	// STEP 2: AUGMENTATION - Combine query + context
	const augmentedPrompt = `
    Question: ${userQuestion}
    
    Relevant Context:
    ${relevantDocs.join('\n\n---\n\n')}
    
    Instructions: Answer based on the provided context.
    `;

	// STEP 3: GENERATION - LLM generates response
	const response = await openaiClient.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content:
					'You are a helpful assistant. Use only the provided context to answer questions.',
			},
			{
				role: 'user',
				content: augmentedPrompt,
			},
		],
	});

	return response.choices[0].message.content;
}
```

### Why RAG is Powerful

1. **Up-to-date Information**: Add new data without retraining
2. **Source Attribution**: Can cite specific documents
3. **Reduced Hallucination**: Grounded in real data
4. **Cost Effective**: No need to retrain large models
5. **Domain Specific**: Works with specialized knowledge

### RAG vs Traditional Search

| Traditional Search       | RAG                     |
| ------------------------ | ----------------------- |
| Keyword matching         | Semantic understanding  |
| Returns documents        | Returns answers         |
| User reads & synthesizes | AI synthesizes for user |
| Static ranking           | Context-aware ranking   |

---

## Fine-Tuning vs RAG: When to Use Each

### Fine-Tuning: Teaching New Behaviors

**Use Fine-Tuning When:**

-   Changing how the model responds (tone, format, style)
-   Teaching domain-specific reasoning patterns
-   Improving performance on specific tasks
-   Need consistent behavior across many queries

```typescript
// Example: Fine-tuning for LinkedIn post generation
// Training data teaches the model Brian's writing style
{
  "messages": [
    {
      "role": "system",
      "content": "You are Brian Jenney, writing LinkedIn posts about software engineering"
    },
    {
      "role": "user",
      "content": "Write about TypeScript benefits"
    },
    {
      "role": "assistant",
      "content": "🔥 Hot take: TypeScript isn't just JavaScript with types...\n\nIt's JavaScript with confidence.\n\nWhen you're building production apps, those red squiggles aren't annoying - they're saving your career.\n\n#TypeScript #SoftwareEngineering"
    }
  ]
}
```

### RAG: Adding New Knowledge

**Use RAG When:**

-   Need access to current/changing information
-   Working with large knowledge bases
-   Information updates frequently
-   Need source attribution

```typescript
// Example: News analysis with current events
const newsAgent = async (query: string) => {
	// RAG retrieves latest news articles about the topic
	const currentNews = await searchVectors(query);

	// LLM analyzes using current information
	return await generateResponse(query, currentNews);
};
```

### Decision Matrix

| Scenario                         | Solution    | Example                         |
| -------------------------------- | ----------- | ------------------------------- |
| "Respond like a specific person" | Fine-Tuning | LinkedIn posts in Brian's style |
| "What happened yesterday?"       | RAG         | Current news analysis           |
| "Format responses as JSON"       | Fine-Tuning | API response formatting         |
| "Analyze this document"          | RAG         | Document Q&A                    |
| "Write code in our style"        | Fine-Tuning | Company coding standards        |
| "Find similar cases"             | RAG         | Legal/medical research          |

### Hybrid Approach

```typescript
// Best of both worlds: Fine-tuned model + RAG
const hybridAgent = async (query: string) => {
	const relevantDocs = await searchVectors(query);

	return await openaiClient.chat.completions.create({
		model: 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt', // Fine-tuned model
		messages: [
			{
				role: 'system',
				content:
					'You are Brian Jenney. Use the provided context to write in your characteristic style.',
			},
			{
				role: 'user',
				content: `${query}\n\nContext: ${relevantDocs.join('\n\n')}`,
			},
		],
	});
};
```

---

## Building AI Agents

Agents are AI systems that can reason, plan, and take actions. They're more than chatbots - they solve problems autonomously.

### Agent Architecture Patterns

#### 1. **Simple Dispatcher Agent**

```typescript
// From app/api/select-agent/route.ts
export async function selectAgent(query: string): Promise<'news' | 'general'> {
	const response = await openaiClient.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: `Classify queries:
                - "news": current events, politics, breaking news
                - "general": everything else
                
                Examples:
                - "What happened with the election?" → news
                - "How to center a div?" → general`,
			},
			{ role: 'user', content: query },
		],
	});

	return response.choices[0].message.content?.includes('news')
		? 'news'
		: 'general';
}
```

#### 2. **Specialized Task Agents**

```typescript
// News Agent - Specialized for current events with RAG
class NewsAgent {
	async process(query: string): Promise<string> {
		// 1. Search vector database for relevant articles
		const articles = await this.searchRelevantNews(query);

		// 2. Analyze and synthesize information
		return await this.generateNewsAnalysis(query, articles);
	}

	private async searchRelevantNews(query: string) {
		return await searchDocuments(query, 5);
	}

	private async generateNewsAnalysis(query: string, articles: any[]) {
		return await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content:
						'You are a news analyst. Provide balanced, fact-based analysis.',
				},
				{
					role: 'user',
					content: `${query}\n\nArticles:\n${articles
						.map((a) => a.content)
						.join('\n\n')}`,
				},
			],
		});
	}
}

// LinkedIn Agent - Specialized for content creation with fine-tuning
class LinkedInAgent {
	async process(query: string): Promise<string> {
		return await openaiClient.chat.completions.create({
			model: 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt', // Fine-tuned
			messages: [
				{
					role: 'system',
					content: 'You are Brian Jenney writing LinkedIn posts.',
				},
				{ role: 'user', content: query },
			],
		});
	}
}
```

#### 3. **Multi-Agent Orchestration**

```typescript
class AgentOrchestrator {
	private agents = {
		news: new NewsAgent(),
		linkedin: new LinkedInAgent(),
		general: new GeneralAgent(),
	};

	async process(query: string): Promise<string> {
		// 1. Route to appropriate agent
		const agentType = await this.selectAgent(query);

		// 2. Process with specialized agent
		const agent = this.agents[agentType];
		return await agent.process(query);
	}

	private async selectAgent(
		query: string
	): Promise<keyof typeof this.agents> {
		// Agent selection logic
		const response = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `Route queries to the best agent:
                    - news: current events, politics
                    - linkedin: content creation, professional posts  
                    - general: everything else`,
				},
				{ role: 'user', content: query },
			],
		});

		const result = response.choices[0].message.content?.toLowerCase();
		if (result?.includes('news')) return 'news';
		if (result?.includes('linkedin')) return 'linkedin';
		return 'general';
	}
}
```

### Agent Design Principles

1. **Single Responsibility**: Each agent has one clear purpose
2. **Composable**: Agents can work together
3. **Observable**: Log decisions and reasoning
4. **Robust**: Handle errors gracefully
5. **Testable**: Isolate components for testing

---

## Testing AI Systems

Testing AI systems requires different strategies than traditional software testing.

### 1. **Unit Testing Core Logic**

```typescript
// Test vector search functionality
describe('Vector Search', () => {
	it('should return relevant documents for climate queries', async () => {
		const results = await searchDocuments('climate change', 3);

		expect(results).toHaveLength(3);
		expect(results[0].score).toBeGreaterThan(0.7); // High similarity
		expect(results[0].metadata).toHaveProperty('content');
	});

	it('should handle empty results gracefully', async () => {
		const results = await searchDocuments('xzqwerty123', 3);

		expect(results).toEqual([]);
	});
});
```

### 2. **Integration Testing with AI APIs**

```typescript
describe('News Agent Integration', () => {
	it('should provide relevant news analysis', async () => {
		const query = 'latest developments in renewable energy';
		const response = await processNewsQuery(query, 'gpt-4o-mini');

		expect(response).toBeDefined();
		expect(response.length).toBeGreaterThan(100);
		expect(response.toLowerCase()).toMatch(/energy|renewable|solar|wind/);
	});

	it('should cite sources when available', async () => {
		const query = 'political election updates';
		const response = await processNewsQuery(query, 'gpt-4o-mini');

		// Should reference the retrieved articles
		expect(response).toMatch(/according to|based on|sources indicate/i);
	});
});
```

### 3. **Prompt Testing & Evaluation**

```typescript
// Test prompt variations for consistency
describe('Prompt Engineering Tests', () => {
	const testCases = [
		'Write a LinkedIn post about TypeScript',
		'Create a professional post about TypeScript benefits',
		'Generate LinkedIn content on TypeScript advantages',
	];

	testCases.forEach((prompt, index) => {
		it(`should generate consistent style for prompt ${
			index + 1
		}`, async () => {
			const response = await linkedInAgent.process(prompt);

			// Check for Brian's characteristic style
			expect(response).toMatch(/🔥|Hot take|#/); // Emojis and hashtags
			expect(response.split('\n').length).toBeGreaterThan(3); // Multi-line format
		});
	});
});
```

### 4. **Performance & Cost Testing**

```typescript
describe('Performance Tests', () => {
	it('should respond within acceptable time limits', async () => {
		const start = Date.now();
		const response = await processNewsQuery('tech news', 'gpt-4o-mini');
		const duration = Date.now() - start;

		expect(duration).toBeLessThan(5000); // 5 second max
		expect(response).toBeDefined();
	});

	it('should use cost-effective models appropriately', async () => {
		// Mock token counting
		const query = 'simple question';
		const response = await processNewsQuery(query, 'gpt-4o-mini');

		// Verify we're using the cheaper model for simple queries
		expect(mockOpenAI.lastCall.model).toBe('gpt-4o-mini');
	});
});
```

### 5. **Agent Behavior Testing**

```typescript
// Test agent routing decisions
describe('Agent Selection', () => {
	const testCases = [
		{ query: 'What happened in the election?', expected: 'news' },
		{ query: 'How do I center a div?', expected: 'general' },
		{ query: 'Current stock market trends', expected: 'news' },
		{ query: 'Best practices for React', expected: 'general' },
	];

	testCases.forEach(({ query, expected }) => {
		it(`should route "${query}" to ${expected} agent`, async () => {
			const agentType = await selectAgent(query);
			expect(agentType).toBe(expected);
		});
	});
});
```

---

## Prompt Engineering Fundamentals

Prompt engineering is the art and science of crafting inputs that get the best outputs from AI models.

### 1. **Basic Prompt Structure**

```typescript
// Poor prompt
const badPrompt = 'Write something about TypeScript';

// Good prompt
const goodPrompt = `
Role: You are a senior software engineer writing for a technical blog.

Task: Write a concise explanation of TypeScript's main benefits.

Context: The audience consists of JavaScript developers considering adoption.

Format: 
- Start with a compelling hook
- Include 3 specific benefits with examples
- End with a call to action
- Use a conversational but professional tone

Length: 200-300 words
`;
```

### 2. **System vs User Messages**

```typescript
// From app/libs/openai/agents/news-agent.ts
const messages = [
	{
		role: 'system', // Sets behavior and context
		content: `You are a news expert assistant. Use the provided news articles to answer the user's query.
        If the provided articles don't contain relevant information, say so and provide a general response.
        Always cite your sources when possible.`,
	},
	{
		role: 'user', // The actual query
		content: `Query: ${query}\n\nRelevant news articles:\n${relevantNews.join(
			'\n\n'
		)}`,
	},
];
```

### 3. **Few-Shot Learning**

```typescript
// Teaching the model through examples
const fewShotPrompt = `
You are a bias detector for news articles. Classify each article as "Liberal", "Conservative", or "Neutral".

Examples:

Article: "The new climate regulations will help save our planet from environmental disaster."
Classification: Liberal
Reasoning: Positive framing of environmental regulations

Article: "New regulations will burden businesses with unnecessary costs and red tape."
Classification: Conservative  
Reasoning: Emphasizes economic impact and government overreach

Article: "The regulation introduces new standards for emissions monitoring."
Classification: Neutral
Reasoning: Factual reporting without opinion

Now classify this article:
Article: ${article}
Classification:
`;
```

### 4. **Chain of Thought Prompting**

```typescript
const chainOfThoughtPrompt = `
Analyze this news query step by step:

Query: "${userQuery}"

Step 1: Identify the main topic
Step 2: Determine what information would be helpful
Step 3: Assess bias in available sources
Step 4: Synthesize a balanced response

Let me work through this:

Step 1: The main topic is...
`;
```

### 5. **Prompt Templates for Consistency**

```typescript
class PromptTemplates {
	static newsAnalysis(query: string, articles: string[]): string {
		return `
        Role: You are an impartial news analyst with expertise in political reporting.
        
        Task: Analyze the provided articles to answer the user's question about current events.
        
        Guidelines:
        - Present multiple perspectives when they exist
        - Cite specific sources using [Source: X]
        - Acknowledge uncertainty when information is limited
        - Avoid speculation beyond the provided articles
        
        Question: ${query}
        
        Articles:
        ${articles
			.map((article, i) => `[Source ${i + 1}]: ${article}`)
			.join('\n\n')}
        
        Analysis:
        `;
	}

	static biasDetection(content: string): string {
		return `
        Analyze the following content for political bias:
        
        Content: "${content}"
        
        Provide your analysis in this format:
        
        **Bias Level**: [Conservative/Liberal/Neutral]
        **Confidence**: [High/Medium/Low]  
        **Key Indicators**: [List specific phrases or framing that indicate bias]
        **Reasoning**: [Explain your classification]
        `;
	}
}
```

### 6. **Advanced Techniques**

#### **Role Playing**

```typescript
const rolePrompt = `
You are Brian Jenney, a senior software engineer known for:
- Practical, no-nonsense advice
- Using analogies to explain complex concepts  
- Encouraging but realistic tone
- Focus on real-world application

Write a LinkedIn post about why junior developers should learn TypeScript.
Include a personal anecdote and actionable advice.
`;
```

#### **Constrained Generation**

```typescript
const constrainedPrompt = `
Generate a news summary with these exact constraints:

Format: 
- Headline (max 10 words)
- Summary (exactly 3 bullet points)
- Analysis (50-75 words)
- Sources (list 2-3)

Topic: ${topic}
Tone: Neutral and factual
Perspective: Present both sides of controversial topics
`;
```

---

## Data Scraping & Ingestion Pipeline

Building a robust data pipeline is crucial for feeding your RAG system with quality information.

### 1. **Web Scraping with Firecrawl**

```typescript
// From app/libs/firecrawl.ts
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({
	apiKey: process.env.FIRECRAWL_API_KEY!,
});

export const scrapeUrl = async (url: string) => {
	try {
		const scrapeResponse = await app.scrapeUrl(url, {
			formats: ['markdown'], // Clean, structured format
			timeout: 30000,
			actions: [
				{ type: 'wait', milliseconds: 2000 }, // Wait for dynamic content
			],
		});

		return scrapeResponse.data?.markdown || '';
	} catch (error) {
		console.error('Scraping failed:', error);
		throw error;
	}
};
```

### 2. **Batch Processing Multiple Sources**

```typescript
// From app/config/newsSources.ts - Organized news sources
export const newsSources = {
	liberal: [
		'https://www.nytimes.com/section/politics',
		'https://www.washingtonpost.com/politics/',
		'https://www.theguardian.com/us-news',
		'https://www.npr.org/sections/politics/',
	],
	conservative: [
		'https://www.foxnews.com/politics',
		'https://www.wsj.com/news/politics',
		'https://www.dailywire.com/news',
		'https://www.breitbart.com/politics/',
	],
};

// Batch scraping implementation
async function scrapeNewsSources(): Promise<ScrapedArticle[]> {
	const allSources = [...newsSources.liberal, ...newsSources.conservative];

	const scrapePromises = allSources.map(async (url) => {
		try {
			const content = await scrapeUrl(url);
			const bias = newsSources.liberal.includes(url)
				? 'liberal'
				: 'conservative';

			return {
				content,
				bias,
				source: url,
				scrapedAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error(`Failed to scrape ${url}:`, error);
			return null;
		}
	});

	const results = await Promise.allSettled(scrapePromises);
	return results
		.filter(
			(result): result is PromiseFulfilledResult<ScrapedArticle> =>
				result.status === 'fulfilled' && result.value !== null
		)
		.map((result) => result.value);
}
```

### 3. **Data Validation & Cleaning**

```typescript
import { z } from 'zod';

// Schema for validating scraped content
const ArticleSchema = z.object({
	content: z.string().min(100, 'Article too short'),
	bias: z.enum(['liberal', 'conservative', 'neutral']),
	source: z.string().url(),
	title: z.string().optional(),
	publishDate: z.string().optional(),
	author: z.string().optional(),
});

type Article = z.infer<typeof ArticleSchema>;

// Clean and validate scraped content
function processScrapedContent(
	rawContent: string,
	source: string
): Article | null {
	try {
		// Basic cleaning
		const cleaned = rawContent
			.replace(/\s+/g, ' ') // Normalize whitespace
			.replace(/[^\w\s.,!?;:'"()-]/g, '') // Remove special chars
			.trim();

		// Extract title (first line or heading)
		const lines = cleaned.split('\n');
		const title = lines[0]?.replace(/^#+\s*/, '') || 'Untitled';

		// Determine bias based on source
		const bias = determineBias(source);

		// Validate with schema
		return ArticleSchema.parse({
			content: cleaned,
			bias,
			source,
			title,
		});
	} catch (error) {
		console.error('Content validation failed:', error);
		return null;
	}
}

function determineBias(source: string): 'liberal' | 'conservative' | 'neutral' {
	if (
		newsSources.liberal.some((url) =>
			source.includes(new URL(url).hostname)
		)
	) {
		return 'liberal';
	}
	if (
		newsSources.conservative.some((url) =>
			source.includes(new URL(url).hostname)
		)
	) {
		return 'conservative';
	}
	return 'neutral';
}
```

### 4. **Vectorization Pipeline**

```typescript
// From app/scripts/uploadArticlesToPinecone.ts
async function vectorizeAndStore(articles: Article[]): Promise<void> {
	const index = pineconeClient.Index('articles');

	// Process in batches to avoid rate limits
	const batchSize = 10;
	for (let i = 0; i < articles.length; i += batchSize) {
		const batch = articles.slice(i, i + batchSize);

		// Create embeddings for this batch
		const embeddings = await Promise.all(
			batch.map(async (article) => {
				const embedding = await openaiClient.embeddings.create({
					model: 'text-embedding-3-small',
					input: article.content,
				});

				return {
					id: `article-${Date.now()}-${i}`,
					values: embedding.data[0].embedding,
					metadata: {
						content: article.content,
						bias: article.bias,
						source: article.source,
						title: article.title,
					},
				};
			})
		);

		// Upload to Pinecone
		await index.upsert(embeddings);

		console.log(
			`Uploaded batch ${i / batchSize + 1} of ${Math.ceil(
				articles.length / batchSize
			)}`
		);

		// Rate limiting - wait between batches
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}
```

### 5. **Automated Pipeline**

```typescript
// Complete automated scraping and ingestion pipeline
class NewsIngestionPipeline {
	private scraper = new FirecrawlScraper();
	private vectorizer = new ArticleVectorizer();

	async runDaily(): Promise<void> {
		console.log('Starting daily news ingestion...');

		try {
			// 1. Scrape from all configured sources
			const rawArticles = await this.scraper.scrapeAllSources();
			console.log(`Scraped ${rawArticles.length} articles`);

			// 2. Clean and validate
			const validArticles = rawArticles
				.map((article) =>
					processScrapedContent(article.content, article.source)
				)
				.filter((article): article is Article => article !== null);
			console.log(`${validArticles.length} articles passed validation`);

			// 3. Remove duplicates
			const uniqueArticles = this.deduplicateArticles(validArticles);
			console.log(
				`${uniqueArticles.length} unique articles after deduplication`
			);

			// 4. Vectorize and store
			await this.vectorizer.processArticles(uniqueArticles);
			console.log('Articles successfully vectorized and stored');

			// 5. Clean up old articles (optional)
			await this.cleanupOldArticles();
		} catch (error) {
			console.error('Pipeline failed:', error);
			// TODO: Add alerting/monitoring
		}
	}

	private deduplicateArticles(articles: Article[]): Article[] {
		const seen = new Set<string>();
		return articles.filter((article) => {
			const hash = this.hashContent(article.content);
			if (seen.has(hash)) return false;
			seen.add(hash);
			return true;
		});
	}

	private hashContent(content: string): string {
		// Simple content hash for deduplication
		return content.slice(0, 100).toLowerCase().replace(/\s+/g, '');
	}
}
```

---

## Project Architecture & Best Practices

### 1. **Project Structure**

```
mini-rag/
├── app/
│   ├── api/                 # Next.js API routes
│   │   ├── stream-chat/     # Chat streaming endpoint
│   │   ├── upload-news/     # Manual article upload
│   │   └── select-agent/    # Agent routing
│   ├── libs/                # Core utilities
│   │   ├── openai/          # AI client and agents
│   │   │   └── agents/      # Specialized agent implementations
│   │   ├── pinecone.ts      # Vector database client
│   │   └── firecrawl.ts     # Web scraping client
│   ├── scripts/             # Data processing scripts
│   │   ├── data/            # Training data and sample articles
│   │   ├── upload-training-data.ts
│   │   └── uploadArticlesToPinecone.ts
│   ├── services/            # Business logic
│   │   └── vectorize/       # Vectorization services
│   ├── config/              # Configuration files
│   │   └── newsSources.ts   # News source definitions
│   └── components/          # React components
├── package.json
├── tsconfig.json
└── README.md
```

### 2. **Configuration Management**

```typescript
// app/api/config.ts - Centralized configuration
export const config = {
	openai: {
		apiKey: process.env.OPENAI_API_KEY!,
		models: {
			embedding: 'text-embedding-3-small',
			general: 'gpt-4o-mini',
			fineTuned: 'ft:gpt-4o-mini-2024-07-18:personal::BMIy4PLt',
		},
		maxTokens: {
			general: 1000,
			analysis: 2000,
		},
	},
	pinecone: {
		apiKey: process.env.PINECONE_API_KEY!,
		indexName: 'articles',
		dimension: 1536,
		topK: 5,
	},
	firecrawl: {
		apiKey: process.env.FIRECRAWL_API_KEY!,
		timeout: 30000,
	},
} as const;

// Type-safe environment validation
function validateEnvironment(): void {
	const required = [
		'OPENAI_API_KEY',
		'PINECONE_API_KEY',
		'FIRECRAWL_API_KEY',
	];

	for (const key of required) {
		if (!process.env[key]) {
			throw new Error(`Missing required environment variable: ${key}`);
		}
	}
}
```

### 3. **Error Handling Strategy**

```typescript
// Custom error types for different failure modes
export class VectorSearchError extends Error {
	constructor(message: string, public readonly query: string) {
		super(`Vector search failed: ${message}`);
		this.name = 'VectorSearchError';
	}
}

export class EmbeddingError extends Error {
	constructor(message: string, public readonly text: string) {
		super(`Embedding generation failed: ${message}`);
		this.name = 'EmbeddingError';
	}
}

// Centralized error handling
export async function safeApiCall<T>(
	operation: () => Promise<T>,
	fallback: T,
	errorContext: string
): Promise<T> {
	try {
		return await operation();
	} catch (error) {
		console.error(`${errorContext}:`, error);

		// Log to monitoring service (Helicone, etc.)
		await logError(error, errorContext);

		return fallback;
	}
}

// Usage in agents
export async function processNewsQuery(
	query: string,
	model: string
): Promise<string> {
	return safeApiCall(
		async () => {
			const relevantNews = await searchVectors(query);
			return await generateResponse(query, relevantNews, model);
		},
		"I'm sorry, I couldn't process your news query at this time. Please try again later.",
		`News query processing for: ${query}`
	);
}
```

### 4. **Performance Optimization**

```typescript
// Caching strategy for expensive operations
class EmbeddingCache {
	private cache = new Map<string, number[]>();
	private maxSize = 1000;

	async getEmbedding(text: string): Promise<number[]> {
		// Check cache first
		const cacheKey = this.hash(text);
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)!;
		}

		// Generate new embedding
		const embedding = await openaiClient.embeddings.create({
			model: 'text-embedding-3-small',
			input: text,
		});

		const vector = embedding.data[0].embedding;

		// Cache with size limit
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}

		this.cache.set(cacheKey, vector);
		return vector;
	}

	private hash(text: string): string {
		// Simple hash function for cache keys
		return text.slice(0, 50).toLowerCase().replace(/\s+/g, '');
	}
}

// Rate limiting for API calls
class RateLimiter {
	private calls: number[] = [];
	private maxCalls: number;
	private windowMs: number;

	constructor(maxCalls: number, windowMs: number) {
		this.maxCalls = maxCalls;
		this.windowMs = windowMs;
	}

	async throttle(): Promise<void> {
		const now = Date.now();

		// Remove old calls outside the window
		this.calls = this.calls.filter((time) => now - time < this.windowMs);

		// Wait if we're at the limit
		if (this.calls.length >= this.maxCalls) {
			const oldestCall = Math.min(...this.calls);
			const waitTime = this.windowMs - (now - oldestCall);

			if (waitTime > 0) {
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
		}

		this.calls.push(now);
	}
}
```

### 5. **Monitoring & Observability**

```typescript
// Integration with Helicone for LLM monitoring
import { Helicone } from 'helicone';

const helicone = new Helicone({
	apiKey: process.env.HELICONE_API_KEY!,
});

// Wrapped OpenAI client with monitoring
export const monitoredOpenAI = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
	defaultHeaders: {
		'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
	},
	baseURL: 'https://oai.hconeai.com/v1',
});

// Custom metrics tracking
class MetricsCollector {
	static async trackQuery(
		type: 'news' | 'general' | 'linkedin',
		query: string,
		responseTime: number,
		tokensUsed: number
	): Promise<void> {
		const metrics = {
			timestamp: new Date().toISOString(),
			type,
			queryLength: query.length,
			responseTime,
			tokensUsed,
			cost: this.calculateCost(tokensUsed, 'gpt-4o-mini'),
		};

		// Log to your monitoring system
		console.log('Query metrics:', metrics);

		// Could send to analytics service
		// await analytics.track('ai_query', metrics);
	}

	private static calculateCost(tokens: number, model: string): number {
		const rates = {
			'gpt-4o-mini': 0.0001 / 1000, // $0.0001 per 1K tokens
			'text-embedding-3-small': 0.00002 / 1000,
		};

		return tokens * (rates[model] || 0);
	}
}
```

---

## Student Project Guidelines

### 🎯 **Learning Objectives**

After completing this guide and building your own project, you should be able to:

1. **Build a RAG system** from scratch using TypeScript
2. **Implement fine-tuning** for custom model behavior
3. **Design AI agents** that route and process queries intelligently
4. **Set up data pipelines** for web scraping and vectorization
5. **Apply prompt engineering** techniques for better AI responses
6. **Test AI systems** effectively with appropriate metrics
7. **Understand vector databases** and their mathematical foundations

### 🚀 **Suggested Student Projects**

#### **Beginner Projects**

1. **Personal Knowledge Assistant**

    - Scrape your blog posts or notes
    - Build a RAG system to answer questions about your content
    - Add a simple chat interface

2. **Course Material Helper**

    - Vectorize lecture notes and textbooks
    - Create a study assistant that answers questions
    - Include source citations

3. **Recipe Recommendation System**
    - Scrape recipe websites
    - Build semantic search for "healthy chicken recipes"
    - Add dietary restriction filtering

#### **Intermediate Projects**

4. **Company Knowledge Base**

    - Scrape internal documentation/wikis
    - Build agents for different departments (HR, Engineering, etc.)
    - Add user authentication and permissions

5. **Legal Document Analyzer**

    - Vectorize legal documents or cases
    - Build query system for legal research
    - Add fine-tuning for legal language

6. **Investment Research Assistant**
    - Scrape financial news and reports
    - Create agents for different asset classes
    - Add bias detection for financial advice

#### **Advanced Projects**

7. **Multi-Language News Aggregator**

    - Scrape news in multiple languages
    - Build translation pipeline
    - Create agents for different regions/topics

8. **Academic Research Assistant**

    - Vectorize research papers from arXiv
    - Build citation network analysis
    - Add fine-tuning for academic writing

9. **Customer Support System**
    - Scrape support documentation
    - Build escalation logic for complex queries
    - Add sentiment analysis and response generation

### 📋 **Project Requirements Checklist**

**Core Requirements (Must Have):**

-   [ ] TypeScript implementation with proper types
-   [ ] Vector database integration (Pinecone or alternative)
-   [ ] At least one data scraping source
-   [ ] Basic RAG implementation with semantic search
-   [ ] Simple agent routing (2+ specialized agents)
-   [ ] Error handling and input validation
-   [ ] Basic testing suite
-   [ ] Environment configuration
-   [ ] Documentation with setup instructions

**Advanced Features (Choose 2-3):**

-   [ ] Fine-tuned model integration
-   [ ] Bias detection or content classification
-   [ ] Streaming chat interface
-   [ ] Multi-agent orchestration
-   [ ] Advanced prompt engineering techniques
-   [ ] Performance optimization (caching, rate limiting)
-   [ ] Monitoring and observability
-   [ ] Automated data pipeline
-   [ ] Source attribution and citations
-   [ ] Content filtering or moderation

**Bonus Points:**

-   [ ] Novel data source or domain
-   [ ] Creative agent specializations
-   [ ] Advanced UI/UX
-   [ ] Production deployment
-   [ ] Comprehensive testing including AI behavior tests
-   [ ] Performance benchmarking
-   [ ] Cost optimization analysis

### 🔍 **Evaluation Criteria**

**Technical Implementation (40%)**

-   Code quality and TypeScript usage
-   Architecture and design patterns
-   Error handling and edge cases
-   Testing coverage and quality

**AI System Design (30%)**

-   RAG implementation effectiveness
-   Agent design and routing logic
-   Prompt engineering quality
-   Model selection and configuration

**Data Pipeline (20%)**

-   Data scraping and cleaning
-   Vectorization strategy
-   Pipeline reliability and error handling
-   Data quality and validation

**Innovation & Creativity (10%)**

-   Novel applications or domains
-   Creative problem-solving
-   Unique features or approaches
-   Documentation and presentation quality

### 📚 **Recommended Learning Resources**

**TypeScript & Node.js:**

-   [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
-   [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

**Vector Databases & Embeddings:**

-   [Pinecone Learning Center](https://docs.pinecone.io/docs/overview)
-   [Understanding Embeddings](https://platform.openai.com/docs/guides/embeddings)
-   [Vector Database Comparison](https://benchmark.vectorview.ai/)

**LLMs & AI:**

-   [OpenAI API Documentation](https://platform.openai.com/docs)
-   [Prompt Engineering Guide](https://www.promptingguide.ai/)
-   [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)

**Testing AI Systems:**

-   [Testing LLM Applications](https://towardsdatascience.com/evaluating-llm-systems-metrics-challenges-and-best-practices-664ac25be7e5)
-   [Jest Testing Framework](https://jestjs.io/docs/getting-started)

**Linear Algebra for ML:**

-   [Khan Academy Linear Algebra](https://www.khanacademy.org/math/linear-algebra)
-   [3Blue1Brown Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra)

### 🎉 **Final Project Submission**

Create a repository with:

1. **Complete codebase** with TypeScript implementation
2. **README.md** with setup instructions and feature overview
3. **ARCHITECTURE.md** explaining your design decisions
4. **Demo video** (2-3 minutes) showing your system in action
5. **Testing report** with performance metrics and test coverage
6. **Reflection essay** (500 words) on what you learned

**Bonus**: Deploy your project and include the live URL!

---

_Good luck building your RAG system! Remember: the best way to learn AI engineering is by building real projects. Start simple, iterate often, and don't be afraid to experiment. 🚀_
