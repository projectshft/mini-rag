# Your Signature Story

This is the most important skill in AI interviews. You need one clear, compelling story about a project you've built.

## Video Walkthrough

Watch this walkthrough of the Problem, Agitate, Solve storytelling framework:

<iframe src="https://share.descript.com/embed/RfrRrXBdw8R" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Build

By the end of this section, you'll have:

- A clear 2-minute story about your RAG project
- A framework for explaining any technical project
- A video recording you can review and iterate on

---

## Why This Matters

**The problem:**

Most engineers ramble when asked "Tell me about a project you built":
- Start with implementation details
- Forget to explain the problem
- Don't explain why they made certain choices
- Run out of time before explaining outcomes

**The solution:**

Use the **Problem → Agitate → Solve → Reflect** framework.

---

## What the Interviewer Is Really Asking

"Tell me about a project you worked on" is deceptively hard. The interviewer isn't checking that you've shipped *something* - they're looking for evidence of four things:

- **Technical capability** - can you do real engineering work?
- **Leadership** - do you drive decisions, or just take tickets?
- **Impact** - did your work matter to the business or users?
- **Potential** - could you tackle a similar problem *at their company*?

That last one is the whole point. Pick a project that lets them imagine you solving their problems.

---

## Pick a Project Worth Talking About

Before you write anything, pick the right project. The best stories involve a real technical achievement, not just "I built a CRUD app." Strong material usually falls into one of these buckets:

- **Optimizations** - speeding up a slow query or endpoint, with numbers to back it up ("cut p95 latency from 5s to 800ms")
- **A new process** - automating something painful (e.g. auto-fixing lint in CI, adding evals to catch regressions)
- **Greenfield features** - building a new capability from scratch
- **Migrations** - porting between frameworks, databases, or model providers
- **Hairy bugs** - a critical, hard-to-diagnose issue that needed a real fix (not "I fixed a button color")

If your only project so far is your capstone, that's fine - just make sure you can point to a real problem inside it (scaling ingestion, a retrieval-quality issue, a tricky chunking decision) rather than narrating the happy path.

---

## The Framework

### 1. What Did You Build?

Start simple and clear.

**Template:**

"I built a system that [does X] for [user type], so they can [outcome]."

**Example:**

"I built a RAG system that helps software engineers query React documentation so they can get answers faster than searching manually."

**Your turn:**

Write your one-sentence description:

```
I built a system that _________________ for _________________,
so they can _________________.
```

---

### 2. The Problem

Make the problem feel real and non-trivial.

**Template:**

"The challenge here was [technical problem]. Why this is difficult is [core difficulty]."

**Good examples:**

```
❌ "The problem was we needed to search documents."
   (Too vague, not compelling)

✅ "The challenge was that naive keyword search returned irrelevant results.
   When a user asked 'How do hooks work?', keyword search would return
   every mention of the word 'hooks' across thousands of docs - most
   were useless. We needed semantic understanding, not keyword matching."
   (Specific, shows technical depth)
```

**Your turn:**

Write your problem statement:

```
The challenge here was:
[Write 2-3 sentences]
```

---

### 3. Your Approach

This is the most important part. Show your thinking.

**Template:**

"I considered a few approaches..."

Then:
- List 2-3 options
- Explain your choice
- Explain tradeoffs

**Example:**

```
I considered three approaches:

1. Fine-tuning a model on all documentation
   - Pro: Very accurate for known content
   - Con: Expensive to train, can't handle new docs

2. Simple RAG with one index for everything
   - Pro: Easy to implement
   - Con: Mixes different frameworks, reduces relevance

3. RAG with metadata filtering per framework
   - Pro: Better relevance, scalable
   - Con: More complex query logic

I chose option 3 because scalability and relevance mattered more
than initial simplicity. I could add new frameworks without
retraining, and users got more relevant results.
```

**Why this works:**

- Shows you considered alternatives
- Demonstrates tradeoff thinking
- Proves you made conscious decisions (not just following tutorials)

**Your turn:**

Write your approach section:

```
I considered [number] approaches:

1. [Approach 1]
   - Pro:
   - Con:

2. [Approach 2]
   - Pro:
   - Con:

3. [Approach 3] (if applicable)
   - Pro:
   - Con:

I chose [approach] because [reasoning about tradeoffs].
```

---

### 4. System Design

Walk through your architecture at a high level.

**Template:**

"The system works like this: [step 1] → [step 2] → [step 3] → [result]"

**Example:**

"The system works like this: Users submit a query through a chat interface, I generate embeddings using OpenAI, query Pinecone to retrieve the top 5 most relevant chunks, then feed that context to GPT-4 which generates a grounded answer. Everything streams back to the user in real-time."

**Your turn:**

Write your system flow:

```
The system works like this:
[Step 1] → [Step 2] → [Step 3] → [Result]
```

---

### 5. Challenges / Failures

Show iteration and debugging ability.

**Template:**

"One issue I ran into was [problem]. I debugged it by [approach] and discovered [insight]."

**Example:**

"One issue I ran into was poor retrieval quality - users would ask about 'state management' and get chunks about 'state machines'. I added re-ranking with Cohere to filter results after initial retrieval, which improved relevance by 40%."

**Why this matters:**

Shows you:
- Encountered real problems (not just following a tutorial)
- Can debug and iterate
- Measure improvements

**Your turn:**

Write about one challenge:

```
One issue I ran into was:
[Problem]

I [solved/debugged/improved] it by:
[Approach]

The result was:
[Outcome or learning]
```

---

### 6. What You Learned

Have an opinion about what you'd do differently.

**Template:**

"If I did this again, I would [change] because [reason]."

**Example:**

"If I did this again, I would implement structured outputs earlier. I spent a lot of time parsing text responses when I should have used JSON mode from the start. It's more reliable and easier to test."

**Your turn:**

```
If I did this again, I would:
[What you'd change]

Because:
[Why this matters]
```

---

## Putting It All Together

Your complete story should flow naturally through these sections:

**Structure:**
1. What I built
2. The problem
3. My approach
4. System design
5. Challenges
6. What I learned

---

## Written Assignment

Write your complete signature story using the framework above.

**Instructions:**

1. Use the template provided in each section
2. Write in complete sentences (not bullet points)
3. Iterate until it flows naturally

**Submission format:**

```markdown
## My Signature Story

### What I Built
[Your answer]

### The Problem
[Your answer]

### My Approach
[Your answer]

### System Design
[Your answer]

### Challenges
[Your answer]

### What I Learned
[Your answer]
```

---

## Video Assignment

Record yourself telling your signature story and submit for feedback.

**Instructions:**

1. **Don't read from notes** - use your written version to practice, but record without reading
2. **Keep it focused** - aim for 1-5 minutes covering all six framework sections
3. **Record in one take** - don't edit, this simulates real interviews
4. **Watch it back** - notice where you stumbled, what sounded unclear
5. **Submit your video** - you'll receive feedback on structure, delivery, and content

**Setup:**

- Use Loom, Zoom, or your phone's camera
- Face the camera (simulates video interviews)
- Use a quiet space
- Smile (sounds cheesy, but makes a difference)

**What to watch for when reviewing:**

❌ Red flags:
- Reading from notes
- Too many "um" or "like" filler words
- Losing track of structure
- Rambling without focus
- Forgetting to explain tradeoffs

✅ Good signs:
- Clear structure (you can hear the sections)
- Natural pacing
- Explaining "why" not just "what"
- Confident delivery
- Concise and focused

**What you'll receive feedback on:**
- Structure and framework adherence
- Clarity of explanations
- Tradeoff discussion
- Delivery and confidence
- Areas to improve for interviews

---

## Practice Tips

### Tip 1: Practice the Transitions

The hardest part is transitioning between sections. Practice these phrases:

- "The challenge here was..."
- "I considered a few approaches..."
- "I chose [option] because..."
- "The system works like this..."
- "One issue I ran into..."
- "If I did this again..."

### Tip 2: Use Your Hands

When recording, gesture naturally. It helps:
- You think more clearly
- You sound more conversational
- Explains complex ideas better

### Tip 3: Record Multiple Takes

Your first take will probably be rough. That's normal.

- **Take 1:** Will be awkward, you'll stumble
- **Take 2:** Better, but you'll read too much from notes
- **Take 3:** Starting to flow naturally
- **Take 4:** Usually the best - confident and natural

Don't submit take 1. Do at least 3 takes.

### Tip 4: Stay Focused

If your explanation is getting long, you're probably:
- Including too much technical detail
- Explaining implementation instead of decisions
- Rambling without structure

Cut ruthlessly. Focus on the framework.

---

## Common Mistakes

### Mistake 1: Starting with Implementation

❌ "So I used TypeScript and Next.js and I installed Pinecone and..."

✅ "I built a RAG system for querying documentation. The challenge was..."

**Start with the problem, not the tech stack.**

### Mistake 2: No Tradeoffs

❌ "I used vector search because it's better."

✅ "I chose vector search over keyword search because I needed semantic understanding. The tradeoff was cost - embeddings are expensive - but relevance mattered more."

**Always explain why you chose one option over another.**

### Mistake 3: Vague Problems

❌ "The problem was we needed to search data."

✅ "The problem was that with 10,000 documents, keyword search returned 500 results for common terms. Users couldn't find what they needed."

**Make the problem specific and real.**

### Mistake 4: No Reflection

❌ "And that's my project."

✅ "If I did this again, I'd implement observability earlier. Debugging LLM failures without logs was painful."

**End with what you learned or would change.**

---

## Example Story

Here's a complete example following the framework:

### What I Built

"I built a RAG system that helps YouTube content creators query their transcript data so they can repurpose content without re-watching hours of videos."

### The Problem

"The challenge was that each creator has hundreds of transcripts, and naive search would mix content across different topics. If a creator asked 'What did I say about React hooks?', we'd return every mention of 'hooks' from videos about fishing, grappling hooks, and React - most totally irrelevant."

### My Approach

"I considered three approaches: one shared index with metadata filtering, separate indexes per creator, or fine-tuning a model per creator. I chose metadata filtering because it scaled to thousands of creators without managing thousands of indexes, and I could add creators instantly without retraining models. The tradeoff was more complex query logic, but that was worth the scalability."

### System Design

"The system works like this: when a user uploads transcripts, I chunk them by timestamp, generate embeddings with OpenAI, and store them in Pinecone with metadata like creator ID and video title. When they query, I filter to just their creator ID, retrieve the top 5 chunks, re-rank them with Cohere, then pass the context to GPT-4 which generates an answer with source citations."

### Challenges

"One issue I ran into was chunking by fixed size caused sentences to split mid-thought, leading to incoherent context. I switched to chunking by timestamp with overlap, which preserved semantic meaning and improved relevance."

### What I Learned

"If I did this again, I'd implement structured outputs for citations from day one. I initially had GPT return freeform text, then had to parse out timestamps and video titles, which was error-prone. JSON mode would have saved me a week of debugging."

