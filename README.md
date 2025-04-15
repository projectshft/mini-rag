# AI-Powered Content Generation

A full-stack TypeScript application demonstrating modern AI techniques including RAG (Retrieval Augmented Generation), fine-tuning, agents, and LLM observability.

## Features

-   **Multi-Agent System**: Three specialized agents for different content types:

    -   LinkedIn Agent: Uses a fine-tuned GPT-4 model for professional content
    -   News Agent: Leverages Pinecone vector database for RAG-based news analysis
    -   General Agent: Handles miscellaneous queries

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
-   **Monitoring**: Helicone
-   **Package Manager**: Yarn

## Learning Objectives

This repository serves as a practical guide for developers to learn:

1. **RAG Implementation**

    - Vector database integration
    - Semantic search
    - Context-aware responses

2. **Fine-tuning**

    - Data preparation
    - Model training
    - Cost optimization

3. **Agent Architecture**

    - Specialized agent design
    - Routing logic
    - Response handling

4. **LLM Observability**
    - Performance monitoring
    - Usage tracking
    - Cost management

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
    PINECONE_ENVIRONMENT=your_pinecone_environment
    HELICONE_API_KEY=your_helicone_api_key
    ```

4. **Database Setup**

    - Create a Pinecone index named 'news'
    - Configure the index with dimension 1536 (for OpenAI embeddings)

5. **Training Data**
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

3. **Using the Application**
    - Navigate to `http://localhost:3000`
    - Choose from example prompts or enter your own
    - The system will route your query to the appropriate agent

## Scripts

-   `upload-training-data.ts`: Handles model fine-tuning
-   `estimate-training-cost.ts`: Calculates training expenses
-   `vectorize-articles.ts`: Processes news content for RAG

## Project Structure

```
mini-rag/
├── app/
│   ├── api/              # API routes
│   ├── libs/             # Shared utilities
│   ├── scripts/          # Training and data scripts
│   └── page.tsx          # Main application
├── public/               # Static assets
└── package.json          # Dependencies
```

## Contributing

This project is meant for educational purposes. Feel free to:

-   Fork the repository
-   Submit issues
-   Create pull requests
-   Share your learnings

## License

MIT License - feel free to use this as a learning resource or base for your own projects.

## Resources

-   [OpenAI Documentation](https://platform.openai.com/docs)
-   [Pinecone Documentation](https://docs.pinecone.io)
-   [Helicone Documentation](https://docs.helicone.ai)
-   [Next.js Documentation](https://nextjs.org/docs)
