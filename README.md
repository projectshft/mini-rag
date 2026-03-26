# AI-Powered Content Generation and RAG

A full-stack TypeScript application demonstrating modern AI techniques including RAG (Retrieval Augmented Generation), fine-tuning, agents, and LLM observability with automated web scraping capabilities.

## Prerequisites

Before getting started, you'll need to set up the following services:

### Required API Keys

1. **OpenAI API Key** (https://platform.openai.com/api-keys)

    - You'll need at least $5 in credits on your OpenAI account
    - Used for embeddings, chat completions, and fine-tuning

2. **Pinecone API Key** (https://www.pinecone.io/)

    - Free tier available
    - Used for vector database storage and similarity search

3. **LangSmith API Key** (https://smith.langchain.com/)
    - Free tier available
    - Used for LLM observability and monitoring

Create a `.env` file in the root directory with these keys:

```
OPENAI_API_KEY=your_openai_key_here
PINECONE_API_KEY=your_pinecone_key_here
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=your_langsmith_key_here
PINECONE_INDEX=your_index_name
OPENAI_FINETUNED_MODEL=your_finetuned_model_id (optional)
```

### Recommended Learning Resources

Before diving into the code, we highly recommend watching 3Blue1Brown's series on neural networks and embeddings to build intuition for how these systems work:

-   [Neural Networks Series](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) - Visual introduction to neural networks
-   [But what is a GPT?](https://www.youtube.com/watch?v=wjZofJX0v4M) - Understanding transformer architecture
-   [Visualizing Attention](https://www.youtube.com/watch?v=eMlx5fFNoYc) - How attention mechanisms work

## Features

-   **Multi-Agent System**: 2 specialized agents for different content types:

    -   LinkedIn Agent: Uses a fine-tuned GPT-4 model for professional content to post on LinkedIn
    -   RAG Agent: Leverages Pinecone vector database for RAG-based content analysis

-   **Web Scraping**:

    -   Extraction of articles from multiple sources
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
    - Automated web scraping
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

    - Intelligent content extraction
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

## 🚨 Your Mission: Fix This Broken App

**This app doesn't work yet.** Your job is to build it from scratch by completing exercises and TODOs. When you're done, you'll have a fully functional AI-powered chat app with:

1. **RAG Agent** - Chat with your knowledge base (technical docs, articles, etc.)
2. **LinkedIn Agent** - Fine-tuned on Brian's LinkedIn posts to generate professional content

### What You Need To Do:

**Step 1: Understand Vector Math (30 mins)**

Before writing any code, build intuition for how embeddings work:

```bash
# Run the word arithmetic exercise
yarn exercise:word-math
```

This demonstrates "word math" like `king - man + woman ≈ queen`. Understanding this is crucial for understanding RAG.

-   Learn: [3Blue1Brown Neural Networks](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi), [Vector Embeddings](https://platform.openai.com/docs/guides/embeddings)

**Step 2: Set Up Your Vector Database**

Create a Pinecone index and configure your environment:

1. Sign up at [Pinecone](https://www.pinecone.io/) (free tier)
2. Create an index:
    - Name: `rag-tutorial`
    - Dimensions: `512`
    - Metric: `cosine`
3. Add to `.env`:
    ```bash
    OPENAI_API_KEY=sk-proj-...
    PINECONE_API_KEY=...
    PINECONE_INDEX=rag-tutorial
    ```

-   Learn: [Pinecone Quickstart](https://docs.pinecone.io/guides/get-started/quickstart)

**Step 3: Upload Knowledge Base to Pinecone**

Scrape documentation and upload embeddings:

```bash
# Edit app/scripts/scrapeAndVectorizeContent.ts to add your URLs
# Then run:
yarn tsx app/scripts/scrapeAndVectorizeContent.ts
```

This will scrape URLs, chunk the content, generate embeddings, and upload to Pinecone.

-   Learn: [Chunking Strategies](https://www.pinecone.io/learn/chunking-strategies/), [Text Embeddings](https://platform.openai.com/docs/guides/embeddings/use-cases)

**Step 4: Train Your LinkedIn Agent**

Fine-tune a model on Brian's LinkedIn posts:

```bash
# Generate training data from posts
yarn tsx app/scripts/generate-training-data.ts

# (Optional) Estimate cost before training
yarn tsx app/scripts/estimate-training-cost.ts

# Upload to OpenAI and start fine-tuning job
yarn tsx app/scripts/upload-training-data.ts
```

Once training completes (~10-20 mins), add the model ID to `.env`:

```bash
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:personal::YOUR_ID
```

-   Learn: [OpenAI Fine-Tuning Guide](https://platform.openai.com/docs/guides/fine-tuning), [When to Fine-Tune vs RAG](https://platform.openai.com/docs/guides/fine-tuning/when-to-use-fine-tuning)

**Step 5: Fix All The TODOs**

Search the codebase for `TODO` comments - you'll find them in:

-   `app/api/upload-document/route.ts` - Implement document upload pipeline
-   `app/libs/openai/agents/linkedin-agent.ts` - Complete LinkedIn agent
-   `app/libs/openai/agents/rag-agent.ts` - Build RAG retrieval and generation
-   `app/libs/openai/agents/selector-agent.ts` - Create agent router

Key concepts you'll implement:

-   **RAG**: [What is RAG?](https://www.pinecone.io/learn/retrieval-augmented-generation/), [Vector Similarity Search](https://platform.openai.com/docs/guides/embeddings/use-cases)
-   **Agents**: [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs), [Multi-Agent Systems](https://www.anthropic.com/research/building-effective-agents)
-   **Streaming**: [Vercel AI SDK](https://sdk.vercel.ai/docs), [Server-Sent Events](https://platform.openai.com/docs/api-reference/streaming)

**Step 6: Run The App**

```bash
yarn install
yarn dev
```

Visit `http://localhost:3000` and test:

-   Upload new documents (URLs or raw text)
-   Ask technical questions (should use RAG agent)
-   Request LinkedIn posts (should use fine-tuned agent)

**Step 7: Run Tests**

```bash
# Test your agent selector
yarn test:selector

# Test all implementations
yarn test
```

### Hints:

-   The `student-working-version` branch has the complete solution if you get stuck
-   Use `console.log()` liberally to understand data flow
-   Check Pinecone dashboard to verify vectors are uploaded
-   Use Helicone dashboard to debug LLM calls and see cost
-   Read the inline comments in TODO sections - they guide you step-by-step

**Good luck! Figure it out. 🚀**

---

## 🚀 Want to Build This With Me?

This repo is a preview of the full hands-on program where we build AI applications together as a group. You'll get live support, code reviews, and build production-ready AI systems alongside other developers.

**[Reserve your spot here →](https://buy.stripe.com/eVqeVe6FSaI3aEWdWXdjO0i)**

---

## Resources

-   [OpenAI Documentation](https://platform.openai.com/docs)
-   [Pinecone Documentation](https://docs.pinecone.io)
-   [LangSmith Documentation](https://docs.langchain.com/langsmith)
-   [Vercel AI SDK](https://sdk.vercel.ai/docs)
-   [Next.js Documentation](https://nextjs.org/docs)
