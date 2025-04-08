# GitHub Repository Scraper and Vectorizer

This tool scrapes your GitHub public repositories and adds them to a Pinecone vector database for semantic search.

## Features

-   Scrapes your public GitHub repositories
-   Filters repositories by update date (last X days)
-   Extracts repository metadata and content
-   Chunks content for better vectorization
-   Adds repository data to Pinecone vector database
-   Avoids duplicate processing of already scraped repositories

## Prerequisites

-   Node.js and npm
-   Puppeteer (for web scraping)
-   OpenAI API key (for embeddings)
-   Pinecone API key and index

## Setup

1. Make sure you have the required environment variables:

    ```
    OPENAI_API_KEY=your_openai_api_key
    PINECONE_API_KEY=your_pinecone_api_key
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Create a Pinecone index named "github" with the appropriate dimensions for the OpenAI embeddings model (1536 for text-embedding-ada-002).

## Usage

Run the scraper and vectorizer:

```
npx ts-node app/scripts/scrape-and-vectorize-github.ts
```

This will:

1. Scrape your GitHub repositories
2. Save them to `github-repos.json`
3. Process and vectorize the repositories
4. Add them to your Pinecone index

## Customization

You can modify the following parameters in the script:

-   `username`: Your GitHub username
-   `daysThreshold`: Number of days to look back for updated repositories (default: 30)
-   `OUTPUT_FILE`: Path to save the scraped repositories (default: 'github-repos.json')

## How It Works

1. **Scraping**: The tool uses Puppeteer to scrape your GitHub profile and repository pages.
2. **Filtering**: It filters repositories updated within the specified time period.
3. **Content Extraction**: For each repository, it extracts metadata and content.
4. **Chunking**: The content is split into smaller chunks for better vectorization.
5. **Vectorization**: Each chunk is converted to an embedding using OpenAI's API.
6. **Storage**: The embeddings are stored in Pinecone with metadata for retrieval.

## Troubleshooting

-   If you encounter rate limiting from GitHub, consider using a GitHub token for authentication.
-   For large repositories, the scraping process may take longer.
-   Ensure your Pinecone index has enough capacity for the number of vectors you're adding.
