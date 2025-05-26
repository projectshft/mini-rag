# Challenge 1: Dynamic News Scraping Agent

## Problem with Current Architecture

The current system only scrapes from a predefined list of news sources in `app/config/newsSources.ts`. When users ask about news topics that aren't covered by these sources, the AI chat cannot provide comprehensive answers because it lacks relevant, up-to-date information.

## The Challenge

Create a dynamic scraping system that automatically identifies and scrapes relevant news sources when a user queries about topics not yet supported in our current index.

### Requirements

1. **New Scraping Agent**: Create a new agent that can:

    - Identify when a news query requires additional sources
    - Find relevant news URLs for the specific topic
    - Trigger scraping jobs for these new sources

2. **Enhanced Selector Agent**: Update the selector agent (`app/libs/openai/agents/selector-agent.ts`) to:

    - Detect when a news query might need additional sources
    - Route to the new scraping agent when needed
    - Handle the workflow between scraping and answering

3. **Integration**: Ensure the new scraped content is:
    - Vectorized and stored in Pinecone
    - Available for immediate querying
    - Properly tagged with source and bias information

## Getting Started Hints

1. **Study the existing flow**:

    - Look at how `app/services/newsScraper.ts` currently works
    - Understand the `app/libs/firecrawl.ts` integration
    - Review how the selector agent routes queries

2. **Consider using search APIs**:

    - Google News API or similar to find relevant articles
    - News aggregator APIs to discover sources covering specific topics

3. **Think about the user experience**:

    - Should scraping happen in real-time or be queued?
    - How do you handle scraping failures gracefully?
    - What's the fallback when no new sources are found?

4. **Architecture considerations**:
    - Where should the new agent live in `app/libs/openai/agents/`?
    - How will you modify the selector agent's prompt and logic?
    - What new API endpoints might you need?

## Success Criteria

-   User asks about a breaking news topic not in current sources
-   System automatically finds and scrapes 3-5 relevant articles
-   User receives a comprehensive answer using the newly scraped content
-   New content is available for future queries on the same topic
