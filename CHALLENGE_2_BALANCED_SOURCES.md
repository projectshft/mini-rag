# Challenge 2: Balanced Political Perspective Querying

## Problem with Current Architecture

The current Pinecone implementation (`app/libs/pinecone.ts`) uses a single index called 'linkedin' and doesn't differentiate between liberal and conservative news sources when retrieving documents. This means users might get biased results that only represent one political perspective, limiting the comprehensiveness and balance of news analysis.

## The Challenge

Refactor the vector database architecture to enable balanced querying that returns a mix of both liberal and conservative perspectives on news topics.

### Requirements

1. **Multiple Index Strategy**: Create separate Pinecone indexes for:

    - Liberal news sources
    - Conservative news sources
    - Potentially a neutral/mixed index

2. **Balanced Query Logic**: Implement a querying system that:

    - Retrieves documents from both liberal and conservative indexes
    - Maintains proportional representation (e.g., 50/50 split)
    - Allows users to specify their preferred balance if desired

3. **Enhanced Metadata**: Update document storage to include:

    - Political bias classification
    - Source credibility scores
    - Topic categorization for better filtering

4. **Smart Routing**: Modify the news agent to:
    - Query multiple indexes intelligently
    - Merge and rank results from different perspectives
    - Present balanced viewpoints in responses

## Getting Started Hints

1. **Current State Analysis**:

    - Review `app/libs/pinecone.ts` to understand current querying
    - Check how `app/services/newsScraper.ts` handles bias classification
    - Look at `app/config/newsSources.ts` for existing bias categorization

2. **Index Design Considerations**:

    - Should you create 2 indexes (liberal/conservative) or 3 (liberal/conservative/neutral)?
    - How will you handle sources that might not fit neatly into categories?
    - What naming convention will you use for the new indexes?

3. **Migration Strategy**:

    - How will you migrate existing data to the new index structure?
    - Should you create a script to re-vectorize and redistribute existing content?
    - What's your rollback plan if the new system has issues?

4. **Query Logic**:

    - How will you merge results from multiple indexes while maintaining relevance scores?
    - Should you query indexes in parallel or sequentially?
    - How will you handle cases where one perspective has significantly more content?

5. **User Experience**:
    - Should users be able to adjust the liberal/conservative balance?
    - How will you indicate to users that they're getting balanced perspectives?
    - What happens when only one perspective has relevant content?

## Technical Implementation Areas

-   **Pinecone Configuration**: Update index creation and management
-   **Vector Storage**: Modify how documents are categorized and stored
-   **Query Engine**: Rewrite search logic to handle multiple indexes
-   **News Agent**: Update to work with the new balanced querying system
-   **API Layer**: Potentially add endpoints for bias-specific queries

## Success Criteria

-   User queries about a political topic receive balanced perspectives
-   System clearly indicates when presenting liberal vs conservative viewpoints
-   Query performance remains acceptable despite multiple index searches
-   Content distribution is roughly balanced unless topic-specific imbalances exist
-   Users can optionally request bias-specific results if needed
