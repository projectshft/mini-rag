# Instructor Guide - RAG Application Curriculum

## Quick Teaching Reference

### Pre-Session Setup
- Ensure all students have Node.js 18+ installed
- Verify API keys are ready (can use shared demo keys)
- Have the application running locally for live demos
- Prepare backup slides for any component failures

---

## Module-by-Module Teaching Notes

### Module 1: LLM Basics (30 min)
**Key Demo Points:**
```typescript
// Show this simple example first
const response = await openai.chat.completions.create({
  messages: [{ role: "user", content: "Hello!" }],
  model: "gpt-3.5-turbo",
});
```

**Common Questions:**
- "Why use TypeScript?" → Type safety for API responses
- "What about rate limits?" → Introduce retry logic concept

**Live Coding Tip:** Start with a hardcoded API call, then refactor to show best practices

---

### Module 2: Agents (45 min)
**Key Demo Points:**
- Show agent selector decision-making in real-time
- Demonstrate how wrong routing affects output quality

**Interactive Element:**
Ask students to predict which agent handles:
- "Write a LinkedIn post about React"
- "What's the latest on climate change?"
- "Generate a tweet about AI"

**Debugging Exercise:** Intentionally break the selector and fix it live

---

### Module 3: Vector Databases (45 min)
**Visual Aid Needed:** 
- Diagram showing text → embedding → vector space
- Live visualization of similarity scores

**Hands-On Demo:**
```typescript
// Show embedding generation
const embedding = await openai.embeddings.create({
  input: "TypeScript is awesome",
  model: "text-embedding-ada-002",
});
console.log(embedding.data[0].embedding); // Show the numbers!
```

**Key Insight:** "Similar meanings = nearby vectors"

---

### Module 4: RAG Implementation (60 min)
**Step-by-Step Breakdown:**
1. User asks question
2. Generate embedding for question
3. Search vector DB
4. Retrieve relevant docs
5. Inject into prompt
6. Generate response

**Common Pitfall:** Too much context overwhelming the model
**Solution:** Show context trimming strategies

**Live A/B Test:** Same question with/without RAG

---

### Module 5: Data Pipeline (45 min)
**Practical Demo:**
- Scrape a news article live
- Show before/after of raw HTML vs structured data
- Trace the full journey to vector DB

**Error Handling Focus:**
- What if scraping fails?
- Invalid content structure
- Duplicate detection

**Real-World Example:** Show rate limiting and retry logic

---

### Module 6: Fine-Tuning (30 min)
**Cost Calculator Demo:**
```bash
# Run this live
yarn estimate-costs
# Show actual $ amounts
```

**Decision Framework:**
When to fine-tune:
- Consistent style/tone needed ✓
- Domain-specific language ✓
- Complex reasoning ✗ (use RAG)

**Show Before/After:** Compare base vs fine-tuned model outputs

---

### Module 7: Observability (30 min)
**Live Dashboard Tour:**
- Show Helicone dashboard
- Point out cost spikes
- Demonstrate debugging a failed request

**Practical Exercise:**
"Find the most expensive API call from yesterday"

---

## Time Management Tips

### If Running Behind:
- Skip fine-tuning theory, focus on practical demo
- Combine modules 6 & 7 into "Production Considerations"
- Provide pre-written code for challenges

### If Running Ahead:
- Deep dive into embedding models comparison
- Discuss alternative vector databases
- Show production deployment considerations

---

## Code Snippets for Quick Reference

### Basic Agent Structure
```typescript
class Agent {
  async process(input: string): Promise<AgentResponse> {
    // 1. Validate input
    // 2. Retrieve context (if RAG)
    // 3. Generate response
    // 4. Format output
  }
}
```

### RAG Query Pattern
```typescript
const relevantDocs = await vectorDB.query({
  vector: await generateEmbedding(userQuery),
  topK: 3,
  includeMetadata: true,
});

const context = relevantDocs.map(doc => doc.text).join('\n');
const response = await llm.complete({
  prompt: `Context: ${context}\n\nQuestion: ${userQuery}`,
});
```

### Error Handling Pattern
```typescript
try {
  const result = await riskyOperation();
} catch (error) {
  if (error.code === 'rate_limit') {
    await delay(1000);
    return retry();
  }
  logger.error('Operation failed', { error, context });
  throw new UserFriendlyError('Something went wrong');
}
```

---

## Student Engagement Techniques

1. **Polls**: "Who has used ChatGPT?" → "Who has used an API?"
2. **Pair Programming**: For challenges, pair experienced with beginners
3. **Live Debugging**: Make intentional mistakes and fix them
4. **Real Examples**: Use current news/topics for demos

---

## Assessment Checklist

After each module, students should be able to:

- [ ] Module 1: Make a successful API call to OpenAI
- [ ] Module 2: Explain why we need different agents
- [ ] Module 3: Describe what an embedding represents
- [ ] Module 4: Draw the RAG pipeline flow
- [ ] Module 5: List 3 challenges in web scraping
- [ ] Module 6: Calculate fine-tuning costs
- [ ] Module 7: Identify a performance bottleneck

---

## Troubleshooting Guide

**"My API key doesn't work"**
- Check for extra spaces
- Verify billing is set up
- Use the test endpoint first

**"Vector search returns nothing"**
- Check if data was uploaded
- Verify embedding dimensions match
- Test with exact text match first

**"The app won't build"**
- Clear node_modules and reinstall
- Check Node version
- Verify all env vars are set

---

## Post-Session Resources

Share these with students:
1. Link to this codebase
2. API key best practices guide
3. Cost optimization tips
4. Community Discord/Slack for questions

## Feedback Collection

End with:
- What was the most valuable module?
- What would you build with this knowledge?
- What topic needs more explanation?