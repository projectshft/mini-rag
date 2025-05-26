# Challenge 3: Chat Persistence with Database Integration

## Problem with Current Architecture

The current chat system (`app/api/stream-chat/route.ts`) is stateless - it processes individual queries without maintaining conversation history or user context. This means:

-   Users lose their conversation history when they refresh the page
-   The AI cannot reference previous questions or build on past context
-   No analytics or insights can be gathered from user interactions
-   Users can't revisit or share interesting conversations

## The Challenge

Implement a database layer using Prisma (or another ORM) to persist chat conversations, enabling conversation history, context awareness, and user session management.

### Requirements

1. **Database Schema Design**: Create tables for:

    - Users/Sessions (anonymous or authenticated)
    - Conversations/Chats
    - Individual Messages
    - Agent selections and metadata

2. **Prisma Integration**: Set up:

    - Prisma schema with appropriate relationships
    - Database migrations
    - Client configuration and connection management

3. **API Enhancements**: Modify existing endpoints to:

    - Save all chat interactions to the database
    - Retrieve conversation history
    - Support conversation threading and context

4. **Context-Aware Responses**: Enable the AI to:
    - Reference previous messages in the conversation
    - Maintain topic continuity across multiple queries
    - Provide more personalized responses based on chat history

## Getting Started Hints

1. **Current System Analysis**:

    - Study `app/api/stream-chat/route.ts` to understand the current flow
    - Look at `app/api/select-agent/route.ts` for agent selection logic
    - Review how the frontend currently handles chat state

2. **Database Design Considerations**:

    - Should you use PostgreSQL, SQLite, or another database?
    - How will you handle anonymous users vs authenticated users?
    - What's the relationship between conversations and individual messages?
    - How will you store agent metadata and selection reasoning?

3. **Schema Planning**:

    ```sql
    // Example schema structure to consider:
    User (id, sessionId, createdAt)
    Conversation (id, userId, title, createdAt, updatedAt)
    Message (id, conversationId, role, content, agentType, timestamp)
    AgentSelection (id, messageId, selectedAgent, reasoning, confidence)
    ```

4. **Implementation Steps**:

    - Set up Prisma and choose your database provider
    - Design and create your schema
    - Create database utilities and connection management
    - Modify API routes to save/retrieve data
    - Update the frontend to handle conversation history

5. **Context Integration**:
    - How will you pass conversation history to the AI agents?
    - Should you summarize long conversations to stay within token limits?
    - How will you handle context for different agent types?

## Technical Implementation Areas

-   **Database Setup**: Prisma configuration, schema design, migrations
-   **API Modifications**: Update all chat-related endpoints to persist data
-   **Context Management**: Modify agents to use conversation history
-   **Frontend Updates**: Add conversation history UI and session management
-   **Performance**: Consider pagination, indexing, and query optimization

## Advanced Features to Consider

-   **Conversation Summarization**: Automatically generate titles for conversations
-   **Search**: Allow users to search through their chat history
-   **Export**: Enable users to export or share conversations
-   **Analytics**: Track popular topics, agent usage, and user patterns
-   **Conversation Branching**: Allow users to fork conversations at different points

## Success Criteria

-   Users can see their complete conversation history
-   AI agents can reference previous messages for better context
-   Conversations persist across browser sessions
-   System can handle multiple concurrent conversations per user
-   Database queries are optimized and performant
-   Chat history enhances rather than slows down the user experience

## Getting Started Commands

```bash
# Install Prisma
yarn add prisma @prisma/client

# Initialize Prisma
npx prisma init

# Generate Prisma client after schema changes
npx prisma generate

# Run migrations
npx prisma migrate dev
```
