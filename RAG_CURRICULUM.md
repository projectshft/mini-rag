# RAG Application Development Curriculum

## Overview
A hands-on curriculum for teaching junior to mid-level developers how to build production-ready RAG (Retrieval-Augmented Generation) applications.

---

## Module 1: Foundation - LLM Integration Basics
**Duration:** 30 minutes

### Concept
- Large Language Models (LLMs) as APIs
- Token-based pricing and context windows
- Basic prompt engineering principles

### Demo Feature
Show: `app/api/chat/route.ts` - Basic OpenAI API integration

### Background
"LLMs are powerful but stateless - they don't remember previous conversations or have access to your specific data. We'll solve these limitations throughout this course."

### Mini Challenge
Create a simple endpoint that:
1. Takes a user question
2. Adds a system prompt for a specific persona (e.g., "pirate", "shakespeare")
3. Returns the formatted response

---

## Module 2: Agent Architecture - Intelligent Routing
**Duration:** 45 minutes

### Concept
- Agent specialization and routing
- Multi-agent systems
- Response formatting and structured outputs

### Demo Feature
Show: 
- `app/services/agents/agentSelector.ts` - How queries are routed
- `app/services/agents/linkedinAgent.ts` & `newsAgent.ts` - Specialized agents

### Background
"Different tasks require different approaches. Agents let us specialize our AI's behavior and choose the right tool for each job."

### Mini Challenge
Add a third agent type:
1. Create a "CodeReviewAgent" that analyzes code snippets
2. Update the selector to route programming questions to this agent
3. Return responses in a structured format with: severity, issue, suggestion

---

## Module 3: Vector Databases - The AI Memory
**Duration:** 45 minutes

### Concept
- Embeddings: turning text into numbers
- Vector similarity search
- Semantic vs keyword search

### Demo Feature
Show:
- `app/libs/pinecone.ts` - Vector database setup
- `app/scripts/vectorize-articles.ts` - How text becomes vectors

### Background
"Embeddings let us find semantically similar content. Instead of exact matches, we find meaning matches - 'car' will find results about 'automobile', 'vehicle', etc."

### Mini Challenge
Create a similarity search tool:
1. Take a user's input text
2. Generate its embedding
3. Find the 3 most similar items from the database
4. Display similarity scores

---

## Module 4: RAG Implementation - Context-Aware AI
**Duration:** 60 minutes

### Concept
- Retrieval-Augmented Generation workflow
- Context injection
- Balancing retrieval vs generation

### Demo Feature
Show:
- `app/services/agents/newsAgent.ts` - Complete RAG pipeline
- How retrieved articles become context for responses

### Background
"RAG solves the knowledge problem - instead of hoping the AI knows about your data, we explicitly provide relevant context for each query."

### Mini Challenge
Implement a basic RAG flow:
1. Search vector database for relevant documents
2. Combine top 3 results as context
3. Create a prompt that includes: context + user question
4. Handle cases where no relevant content is found

---

## Module 5: Data Pipeline - Automated Knowledge Building
**Duration:** 45 minutes

### Concept
- Web scraping and content extraction
- Data validation and structuring
- Automated vectorization pipelines

### Demo Feature
Show:
- `app/api/scrape/route.ts` - Firecrawl integration
- `app/scripts/scrapeAndVectorize.ts` - End-to-end pipeline
- `app/config/newsSources.ts` - Source configuration

### Background
"A RAG system is only as good as its data. Automated pipelines ensure fresh, relevant content without manual intervention."

### Mini Challenge
Build a content ingestion pipeline:
1. Add a new content source (e.g., documentation site)
2. Extract and structure the content
3. Add metadata (source, timestamp, category)
4. Vectorize and store in the database

---

## Module 6: Fine-Tuning - Specialized AI Models
**Duration:** 30 minutes

### Concept
- When to fine-tune vs prompt engineering
- Training data preparation
- Cost-benefit analysis

### Demo Feature
Show:
- `app/scripts/data/linkedin_training.jsonl` - Training data format
- `app/scripts/upload-training-data.ts` - Training pipeline
- Fine-tuned model usage in LinkedIn agent

### Background
"Fine-tuning creates specialized models that understand your specific domain, tone, and patterns - like hiring a specialist vs a generalist."

### Mini Challenge
Prepare a fine-tuning dataset:
1. Collect 20 examples of input/output pairs for a specific task
2. Format in JSONL structure
3. Estimate training costs
4. Identify patterns the model should learn

---

## Module 7: Observability - Production Monitoring
**Duration:** 30 minutes

### Concept
- LLM observability and debugging
- Cost tracking and optimization
- Performance monitoring

### Demo Feature
Show:
- `app/libs/helicone.ts` - Observability setup
- How to track API calls, costs, and latency

### Background
"In production, you need to know: How much are we spending? Why did that response fail? Which prompts work best? Observability answers these questions."

### Mini Challenge
Add custom tracking:
1. Log prompt templates used
2. Track response times by agent type
3. Create cost alerts for unusual usage
4. Add user satisfaction scoring

---

## Progressive Project Challenge

### Build Your Own Domain-Specific RAG Application

**Week 1:** Basic Setup
- Choose a domain (recipes, documentation, product reviews)
- Set up basic LLM integration
- Create a simple chat interface

**Week 2:** Add Intelligence
- Implement 2 specialized agents
- Add agent routing logic
- Structure responses appropriately

**Week 3:** Add Memory
- Integrate vector database
- Build ingestion pipeline
- Implement RAG for one agent

**Week 4:** Scale & Monitor
- Add automated data collection
- Implement observability
- Optimize for cost and performance

---

## Key Takeaways

1. **Start Simple**: Basic LLM integration → Add complexity gradually
2. **Specialize**: Different problems need different solutions (agents)
3. **Augment**: RAG makes AI knowledgeable about YOUR data
4. **Automate**: Build pipelines for continuous learning
5. **Monitor**: What you can't measure, you can't improve

## Resources for Deep Dives

- **Embeddings**: [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- **Vector Search**: [Pinecone Learning Center](https://www.pinecone.io/learn/)
- **RAG Patterns**: [LangChain RAG Tutorial](https://python.langchain.com/docs/use_cases/question_answering/)
- **Fine-Tuning**: [OpenAI Fine-Tuning Docs](https://platform.openai.com/docs/guides/fine-tuning)

## Success Metrics

Students should be able to:
- [ ] Explain when to use RAG vs fine-tuning
- [ ] Build a basic multi-agent system
- [ ] Implement vector search functionality
- [ ] Create an automated data pipeline
- [ ] Monitor and optimize LLM costs