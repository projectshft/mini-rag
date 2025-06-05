# Video Recording Guide - RAG Course

## Course Overview
**Total Runtime:** ~3-4 hours of content
**Target Audience:** Junior/Mid TypeScript developers
**Format:** Screen recordings with code walkthrough

---

## Video 1: Course Introduction (5-7 mins)
### Recording Notes
- Start with the running app demo
- Show LinkedIn post generation
- Show news query with sources
- "By the end of this course, you'll understand every piece"

### Key Shots
1. Home page with example prompts
2. Agent selection in action
3. Vector search results
4. Cost tracking dashboard

### Script Points
- "RAG solves the knowledge problem"
- "We'll build from simple to complex"
- "Real production patterns, not toy examples"

---

## Video 2: LLM Basics & First API Call (15-20 mins)
### Screen Setup
- VS Code on left
- Terminal on bottom right
- Browser on top right

### Recording Flow
1. **Start in** `app/api/chat/route.ts`
2. **Show simple call first** (hardcoded)
3. **Add error handling**
4. **Introduce typing**
5. **Test in browser**

### Key Teaching Moments
- [ ] Show token counting
- [ ] Demonstrate rate limit error
- [ ] Explain temperature parameter
- [ ] Show API pricing page

### B-Roll Needed
- OpenAI pricing page
- Token visualization tool

---

## Video 3: Building an Agent System (25-30 mins)
### Files to Have Open
- `app/services/agents/agentSelector.ts`
- `app/services/agents/linkedinAgent.ts`
- `app/services/agents/newsAgent.ts`

### Demo Sequence
1. **Trace a request** through the selector
2. **Show agent decision** console logs
3. **Break the selector** (live debugging)
4. **Add a new agent** from scratch

### Visual Aids
- Diagram: Request → Selector → Agent → Response
- Side-by-side: Different agent outputs

### Common Mistakes to Show
- Overlapping agent responsibilities
- Missing agent type in selector

---

## Video 4: Vector Databases Explained (20-25 mins)
### Pre-Recording Setup
- Have Pinecone dashboard open
- Prepare 3-4 text samples
- Vector visualization tool ready

### Teaching Sequence
1. **Manual embedding generation**
   ```typescript
   // Show raw numbers
   console.log(embedding.data[0].embedding.slice(0, 10))
   ```
2. **Visual explanation** (use drawing tool)
3. **Live similarity search**
4. **Show Pinecone dashboard**

### Key Demos
- [ ] Compare embeddings of similar vs different texts
- [ ] Show how typos don't break semantic search
- [ ] Demonstrate multilingual similarity

---

## Video 5: Implementing RAG (30-35 mins)
### Code Path to Follow
1. Start: `app/services/agents/newsAgent.ts`
2. Trace: `searchArticles()` function
3. Show: Context injection in prompt
4. Test: With and without context

### Live Coding Exercise
Build a minimal RAG from scratch:
```typescript
// 1. Get embedding
// 2. Search Pinecone
// 3. Format context
// 4. Generate response
```

### Before/After Comparison
- Question: "What's the latest on climate policy?"
- Without RAG: Generic, outdated
- With RAG: Specific, current, sourced

---

## Video 6: Data Pipeline & Automation (25-30 mins)
### Terminal Commands Ready
```bash
yarn scrape-news
yarn vectorize-articles
```

### Recording Segments
1. **Manual article upload** (`/news` page)
2. **Firecrawl scraping** (show HTML → JSON)
3. **Batch processing** (multiple sources)
4. **Scheduling discussion**

### Error Scenarios to Demo
- [ ] Scraping timeout
- [ ] Invalid HTML structure
- [ ] Duplicate detection

---

## Video 7: Fine-Tuning Deep Dive (20-25 mins)
### Pre-Recording Tasks
- Have cost calculator ready
- Prepare before/after examples
- OpenAI fine-tuning dashboard

### Structure
1. **When to fine-tune** (decision tree)
2. **Data preparation** (`linkedin_training.jsonl`)
3. **Cost analysis** (run calculator live)
4. **Results comparison**

### Key Visuals
- Training data format
- Cost breakdown
- Performance metrics

---

## Video 8: Production Considerations (15-20 mins)
### Dashboard Tours
- Helicone dashboard walkthrough
- Cost spike investigation
- Performance optimization

### Topics to Cover
- [ ] API key security
- [ ] Rate limiting strategies
- [ ] Caching patterns
- [ ] Error handling

---

## Video 9: Building Your Own (10-15 mins)
### Challenge Presentation
- Show the 3 challenge files
- Explain progression
- Provide starter hints

### Inspiration Examples
- Customer support bot
- Documentation assistant
- Code review helper
- Recipe finder

---

## Recording Tips

### Screen Resolution
- 1920x1080 minimum
- Increase font size to 16-18pt
- High contrast theme

### Pacing
- Pause after key concepts
- Repeat important points
- Show errors and fixes

### Engagement
- "Let's break this on purpose"
- "What do you think happens next?"
- "Pause here and try it yourself"

### File Management
- Keep solution branches ready
- Have backup code snippets
- Pre-populate test data

### Post-Production Notes
- Add chapter markers at each module
- Include code snippets in description
- Link to specific file lines in repo

---

## Quick Reference During Recording

### Always Visible Browser Tabs
1. Running app (localhost:3000)
2. OpenAI docs
3. Pinecone dashboard
4. Cost calculator

### Terminal Aliases
```bash
alias dev="yarn dev"
alias scrape="yarn scrape-news"
alias costs="yarn estimate-costs"
```

### Test Queries Ready
- "Write a LinkedIn post about TypeScript"
- "What's the latest on AI regulation?"
- "Summarize recent climate news"

### Debugging Phrases
- "This error is actually perfect because..."
- "A common mistake here is..."
- "Let me show you why this matters..."