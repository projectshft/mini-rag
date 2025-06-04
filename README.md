# AI-Powered Content Generation and Politically Charged News Whisperer

It might look like this ⬇️

<img src="public/home_page.png"/>

A full-stack TypeScript application demonstrating modern AI techniques including RAG (Retrieval Augmented Generation), fine-tuning, agents, and LLM observability with automated web scraping capabilities.

## Features

-   **Multi-Agent System**: 2 specialized agents for different content types:

    -   LinkedIn Agent: Uses a fine-tuned GPT-4 model for professional content to post on LinkedIn
    -   News Agent: Leverages Pinecone vector database for RAG-based news analysis

-   **Automated Web Scraping**:

    -   Integration with Firecrawl.dev for intelligent web scraping
    -   Automated extraction of news articles from multiple sources
    -   Bias detection and content structuring
    -   Direct vectorization and storage in Pinecone database

-   **Training Pipeline**:

    -   Scripts for fine-tuning data preparation
    -   Cost estimation tools
    -   Training job management

-   **Observability**:
    -   Integration with Helicone for LLM monitoring
    -   Performance tracking
    -   Usage analytics

## Tech Stack

-   **Frontend**: Next.js, TypeScript, TailwindCSS
-   **Backend**: Next.js API Routes
-   **AI/ML**: OpenAI API, Pinecone Vector Database
-   **Web Scraping**: Firecrawl.dev for intelligent content extraction
-   **Monitoring**: Helicone
-   **Package Manager**: Yarn

## Learning Objectives

This repository serves as a practical guide for you to learn:

1. **RAG Implementation**

    - Vector database integration with Pinecone
    - Semantic search capabilities
    - Automated web scraping with Firecrawl.dev
    - Context-aware responses using retrieved content

2. **Fine-tuning**

    - Data preparation
    - Model training
    - Cost optimization

3. **Agent Architecture**

    - Specialized agent design
    - Response handling
    - Agent response format

4. **Web Scraping & Data Pipeline**

    - Intelligent content extraction using Firecrawl.dev
    - Automated bias detection
    - Content vectorization and storage

5. **LLM Observability**

    - Performance monitoring
    - Usage tracking
    - Cost management

6. **News Article Scraping & Vectorization**

    - The application uses Firecrawl.dev to automatically scrape news articles from configured sources
    - Articles are processed to extract content, detect political bias, and identify sources
    - Scraped content is automatically vectorized using OpenAI embeddings and stored in Pinecone
    - News sources are configured in `app/config/newsSources.ts` with both liberal and conservative outlets

7. **Manual Article Upload**
    - Navigate to `/news` to manually upload articles
    - Articles can be submitted with bias labels and source URLs
    - Content is automatically vectorized and added to the Pinecone database

## Mentee Challenges

Ready to take your skills to the next level? We've prepared three progressive challenges that will help you extend this project with advanced features:

### 🚀 [Challenge 1: Dynamic News Scraping Agent](./CHALLENGE_1_DYNAMIC_SCRAPING.md)

**Difficulty: Intermediate**
Build an intelligent agent that automatically discovers and scrapes new news sources when users ask about topics not covered by existing sources. This challenge involves creating a new agent, enhancing the selector agent, and implementing real-time content discovery.

### ⚖️ [Challenge 2: Balanced Political Perspective Querying](./CHALLENGE_2_BALANCED_SOURCES.md)

**Difficulty: Advanced**
Refactor the vector database architecture to enable balanced querying that returns both liberal and conservative perspectives on news topics. This is a significant architectural change involving multiple Pinecone indexes and intelligent result merging.

### 💾 [Challenge 3: Chat Persistence with Database Integration](./CHALLENGE_3_CHAT_PERSISTENCE.md)

**Difficulty: Intermediate-Advanced**
Transform the stateless chat system into a persistent, context-aware conversation platform using Prisma and a database. Enable conversation history, context continuity, and user session management.

Each challenge includes detailed problem descriptions, implementation hints, and success criteria. Choose based on your interests and skill level - they can be tackled independently or in sequence!

## Setup

1. **Clone the repository**

    ```bash
    git clone [repository-url]
    cd mini-rag
    ```

2. **Install dependencies**

    ```bash
    yarn install
    ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

    ```env
    OPENAI_API_KEY=your_openai_api_key
    PINECONE_API_KEY=your_pinecone_api_key
    HELICONE_API_KEY=your_helicone_api_key
    FIRECRAWL_API_KEY=your_fire_crawl_api_key
    ```

4. **Create an Account on OpenAI**

    - You are going to need to add ~$10 USD to an OpenAI account - do it!
    - You can swap out the OpenAI api with another (free-er) model if you so choose

5. **Database Setup in Pinecone**

    - Create a Pinecone index named 'articles'
    - Configure the index with dimension 1536 (for OpenAI embeddings)

6. **Training Data**
    - There is training data in `app/scripts/data/linkedin_training.jsonl` based on Brian Jenney's (that's me!) posts on LinkedIn
    - Use the provided scripts to estimate costs and upload training data

## Usage

1. **Start the development server**

    ```bash
    yarn dev
    ```

2. **Training the Model**

    ```bash
    # Estimate training costs
    yarn estimate-costs

    # Upload and start training
    yarn train
    ```

3. **Adding Articles to Vector Database**

    ```bash
    # Upload pre-existing articles from local files
    yarn upload-articles
    ```

4. **Using the Application**
    - Navigate to `http://localhost:3000`
    - Choose from example prompts or enter your own
    - The system will route your query to the appropriate agent
    - News queries will use RAG to search through scraped articles

## Scripts

-   `upload-training-data.ts`: Handles model fine-tuning
-   `estimate-training-cost.ts`: Calculates training expenses
-   `uploadArticlesToPinecone.ts`: Uploads pre-existing articles to vector database
-   `vectorize-articles.ts`: Processes and vectorizes news content for RAG

## Web Scraping Architecture

The application uses Firecrawl.dev for intelligent web scraping:

-   **Batch Scraping**: Processes multiple news sources simultaneously
-   **Structured Extraction**: Uses Zod schemas to ensure consistent data format
-   **Bias Detection**: Automatically categorizes content as liberal or conservative
-   **Error Handling**: Robust retry mechanisms and validation
-   **Vectorization Pipeline**: Seamlessly converts scraped content to embeddings

News sources are configured in `app/config/newsSources.ts` and include major outlets like:

-   Liberal: NYT, Washington Post, The Guardian, NPR, CNN
-   Conservative: Fox News, WSJ, Daily Wire, Breitbart, The Federalist

## Project Structure

```
mini-rag/
├── app/
│   ├── api/              # API routes
│   ├── libs/             # Shared utilities
│   ├── scripts/          # Training and data scripts
│   └── page.tsx          # Main application
```

## Resources

-   [OpenAI Documentation](https://platform.openai.com/docs)
-   [Pinecone Documentation](https://docs.pinecone.io)
-   [Helicone Documentation](https://docs.helicone.ai)
-   [Next.js Documentation](https://nextjs.org/docs)
