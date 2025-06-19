# AI-Powered Content Generation and Politically Charged News Whisperer

A full-stack TypeScript application demonstrating modern AI techniques including RAG (Retrieval Augmented Generation), fine-tuning, agents, and LLM observability with automated web scraping capabilities.

## Start Here!

**To understand how this system works**, check out our comprehensive **[Learning Guide](./LEARNING_GUIDE.md)** first! It covers:

-   TypeScript & Modern JS for AI development
-   Vector databases and linear algebra fundamentals
-   RAG implementation from scratch
-   Fine-tuning vs RAG decision making
-   Building AI agents and multi-agent systems
-   Testing AI systems effectively
-   Prompt engineering best practices
-   Data scraping and ingestion pipelines
-   Student project ideas and challenges

The learning guide is designed for early career engineers and includes practical examples from this codebase.

## Features

-   **Multi-Agent System**: 2 specialized agents for different content types:

    -   LinkedIn Agent: Uses a fine-tuned GPT-4 model for professional content to post on LinkedIn
    -   News Agent: Leverages Pinecone vector database for RAG-based news analysis

-   **Web Scraping**:

    -   Extraction of news articles from multiple sources
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
-   **Web Scraping**: Puppeteer
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

    - The application uses Puppeteer to automatically scrape news articles from configured sources
    - Articles are processed to extract content
    - Scraped content is automatically vectorized using OpenAI embeddings and stored in Pinecone

7. **Manual Article Upload**
    - Navigate to `/scrape-content` to manually scrape urls
    - Content is automatically vectorized and added to the Pinecone database

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
