# Your Signature Story

**Time:** ~90 min · Write + Record

> **This session:** the most important skill in AI interviews — one clear, compelling story about a project you've built, structured with the Problem → Agitate → Solve → Reflect framework. You'll write it, record it, and iterate until it flows.

## Video walkthrough

Watch this walkthrough of the Problem, Agitate, Solve storytelling framework:

<iframe src="https://share.descript.com/embed/RfrRrXBdw8R" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## What you'll build

By the end of this session, you'll have:

- A clear 2-minute story about your RAG project
- A framework for explaining any technical project
- A video recording you can review and iterate on

## Why this matters

Most engineers ramble when asked "Tell me about a project you built":

- Start with implementation details
- Forget to explain the problem
- Don't explain why they made certain choices
- Run out of time before explaining outcomes

The fix is structure: the **Problem → Agitate → Solve → Reflect** framework.

## What the interviewer is really asking

"Tell me about a project you worked on" is deceptively hard. The interviewer isn't checking that you've shipped *something* — they're looking for evidence of four things:

- **Technical capability** — can you do real engineering work?
- **Leadership** — do you drive decisions, or just take tickets?
- **Impact** — did your work matter to the business or users?
- **Potential** — could you tackle a similar problem *at their company*?

That last one is the whole point. Pick a project that lets them imagine you solving their problems.

## Pick a project worth talking about

Before you write anything, pick the right project. The best stories involve a real technical achievement, not just "I built a CRUD app." Strong material usually falls into one of these buckets:

- **Optimizations** — speeding up a slow query or endpoint, with numbers to back it up ("cut p95 latency from 5s to 800ms")
- **A new process** — automating something painful (e.g. auto-fixing lint in CI, adding evals to catch regressions)
- **Greenfield features** — building a new capability from scratch
- **Migrations** — porting between frameworks, databases, or model providers
- **Hairy bugs** — a critical, hard-to-diagnose issue that needed a real fix (not "I fixed a button color")

If your only project so far is your capstone, that's fine — just make sure you can point to a real problem inside it (scaling ingestion, a retrieval-quality issue, a tricky chunking decision) rather than narrating the happy path.

## The framework

Your story flows through six sections. Work through each one in writing before you record anything.

### 1. What did you build?

Start simple and clear.

**Template:**

"I built a system that [does X] for [user type], so they can [outcome]."

**Example:**

"I built a RAG system that helps software engineers query React documentation so they can get answers faster than searching manually."

**Your turn** — write your one-sentence description:

```
I built a system that _________________ for _________________,
so they can _________________.
```

### 2. The problem

Make the problem feel real and non-trivial.

**Template:**

"The challenge here was [technical problem]. Why this is difficult is [core difficulty]."

**Good vs bad:**

```
❌ "The problem was we needed to search documents."
   (Too vague, not compelling)

✅ "The challenge was that naive keyword search returned irrelevant results.
   When a user asked 'How do hooks work?', keyword search would return
   every mention of the word 'hooks' across thousands of docs - most
   were useless. We needed semantic understanding, not keyword matching."
   (Specific, shows technical depth)
```

**Your turn** — write your problem statement:

```
The challenge here was:
[Write 2-3 sentences]
```

### 3. Your approach

This is the most important part. Show your thinking.

**Template:** "I considered a few approaches..." — then list 2–3 options, explain your choice, and explain the tradeoffs.

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

**Your turn** — write your approach section:

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

### 4. System design

Walk through your architecture at a high level.

**Template:**

"The system works like this: [step 1] → [step 2] → [step 3] → [result]"

**Example:**

"The system works like this: Users submit a query through a chat interface, I generate embeddings using OpenAI, query Pinecone to retrieve the top 5 most relevant chunks, then feed that context to GPT-4 which generates a grounded answer. Everything streams back to the user in real-time."

**Your turn** — write your system flow:

```
The system works like this:
[Step 1] → [Step 2] → [Step 3] → [Result]
```

### 5. Challenges / failures

Show iteration and debugging ability.

**Template:**

"One issue I ran into was [problem]. I debugged it by [approach] and discovered [insight]."

**Example:**

"One issue I ran into was poor retrieval quality - users would ask about 'state management' and get chunks about 'state machines'. I added re-ranking with Cohere to filter results after initial retrieval, which improved relevance by 40%."

**Why this matters** — it shows you encountered real problems (not just following a tutorial), can debug and iterate, and measure improvements.

**Your turn** — write about one challenge:

```
One issue I ran into was:
[Problem]

I [solved/debugged/improved] it by:
[Approach]

The result was:
[Outcome or learning]
```

### 6. What you learned

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

## Putting it all together

Your complete story should flow naturally through the six sections:

1. What I built
2. The problem
3. My approach
4. System design
5. Challenges
6. What I learned

## Common mistakes

### Mistake 1: starting with implementation

❌ "So I used TypeScript and Next.js and I installed Pinecone and..."

✅ "I built a RAG system for querying documentation. The challenge was..."

**Start with the problem, not the tech stack.**

### Mistake 2: no tradeoffs

❌ "I used vector search because it's better."

✅ "I chose vector search over keyword search because I needed semantic understanding. The tradeoff was cost - embeddings are expensive - but relevance mattered more."

**Always explain why you chose one option over another.**

### Mistake 3: vague problems

❌ "The problem was we needed to search data."

✅ "The problem was that with 10,000 documents, keyword search returned 500 results for common terms. Users couldn't find what they needed."

**Make the problem specific and real.**

### Mistake 4: no reflection

❌ "And that's my project."

✅ "If I did this again, I'd implement observability earlier. Debugging LLM failures without logs was painful."

**End with what you learned or would change.**

## Example story

Draft your own six sections first — then read this complete example and compare it against yours.

<details>
<summary>✅ Complete example story — draft yours before opening</summary>

### What I built

"I built a RAG system that helps YouTube content creators query their transcript data so they can repurpose content without re-watching hours of videos."

### The problem

"The challenge was that each creator has hundreds of transcripts, and naive search would mix content across different topics. If a creator asked 'What did I say about React hooks?', we'd return every mention of 'hooks' from videos about fishing, grappling hooks, and React - most totally irrelevant."

### My approach

"I considered three approaches: one shared index with metadata filtering, separate indexes per creator, or fine-tuning a model per creator. I chose metadata filtering because it scaled to thousands of creators without managing thousands of indexes, and I could add creators instantly without retraining models. The tradeoff was more complex query logic, but that was worth the scalability."

### System design

"The system works like this: when a user uploads transcripts, I chunk them by timestamp, generate embeddings with OpenAI, and store them in Pinecone with metadata like creator ID and video title. When they query, I filter to just their creator ID, retrieve the top 5 chunks, re-rank them with Cohere, then pass the context to GPT-4 which generates an answer with source citations."

### Challenges

"One issue I ran into was chunking by fixed size caused sentences to split mid-thought, leading to incoherent context. I switched to chunking by timestamp with overlap, which preserved semantic meaning and improved relevance."

### What I learned

"If I did this again, I'd implement structured outputs for citations from day one. I initially had GPT return freeform text, then had to parse out timestamps and video titles, which was error-prone. JSON mode would have saved me a week of debugging."

</details>

## Written assignment

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

## Video assignment

Record yourself telling your signature story and submit for feedback.

**Instructions:**

1. **Don't read from notes** — use your written version to practice, but record without reading
2. **Keep it focused** — aim for 1–5 minutes covering all six framework sections
3. **Record in one take** — don't edit, this simulates real interviews
4. **Watch it back** — notice where you stumbled, what sounded unclear
5. **Submit your video** — you'll receive feedback on structure, delivery, and content

**Setup:**

- Use Loom, Zoom, or your phone's camera
- Face the camera (simulates video interviews)
- Use a quiet space
- Smile (sounds cheesy, but makes a difference)

**What to watch for when reviewing:**

❌ Red flags: reading from notes, too many "um" or "like" filler words, losing track of structure, rambling without focus, forgetting to explain tradeoffs

✅ Good signs: clear structure (you can hear the sections), natural pacing, explaining "why" not just "what", confident delivery, concise and focused

**What you'll receive feedback on:** structure and framework adherence, clarity of explanations, tradeoff discussion, delivery and confidence, areas to improve for interviews.

## Practice tips

### Tip 1: practice the transitions

The hardest part is transitioning between sections. Practice these phrases:

- "The challenge here was..."
- "I considered a few approaches..."
- "I chose [option] because..."
- "The system works like this..."
- "One issue I ran into..."
- "If I did this again..."

### Tip 2: use your hands

When recording, gesture naturally. It helps you think more clearly, sound more conversational, and explain complex ideas better.

### Tip 3: record multiple takes

Your first take will probably be rough. That's normal.

- **Take 1:** will be awkward, you'll stumble
- **Take 2:** better, but you'll read too much from notes
- **Take 3:** starting to flow naturally
- **Take 4:** usually the best — confident and natural

Don't submit take 1. Do at least 3 takes.

### Tip 4: stay focused

If your explanation is getting long, you're probably including too much technical detail, explaining implementation instead of decisions, or rambling without structure. Cut ruthlessly. Focus on the framework.

## ✅ Key takeaways

- One practiced story beats ten improvised ones — interviewers are testing capability, leadership, impact, and whether they can imagine you solving *their* problems
- The six-section flow: what I built → the problem → my approach → system design → challenges → what I learned
- The approach section carries the most weight: name the alternatives you considered and why the tradeoffs pointed to your choice
- Start with the problem, never the tech stack — and always end with what you'd do differently
- Write first, then record without notes, then watch it back and re-record — at least 3 takes

## 🤖 Work with AI

```ai-prompt
title: Pressure-test my signature story
---
I'm preparing my signature story for AI engineering interviews using a six-part framework: what I built, the problem, my approach (with alternatives and tradeoffs), system design, challenges, and what I learned. Here's my written draft:

[paste your story]

Play a senior engineer interviewing me. First, grade each of the six sections 1-10 and flag the classic mistakes: starting with the tech stack, a vague problem statement, missing tradeoffs, no measurable outcome, no reflection. Then ask me the three hardest follow-up questions my story invites — the ones that would expose whether I actually made these decisions or just followed a tutorial (e.g. "why top-5 chunks and not top-20?", "how did you measure that relevance improvement?"). Wait for my answer to each before continuing. End with the one revision that would most strengthen the story.
```

```ai-prompt
title: Run my story delivery like a speech coach
---
I just recorded myself telling my signature story about my RAG project (target: 1-5 minutes, no notes, six sections: built / problem / approach / design / challenges / learned). Here's a rough transcript of what I said:

[paste or roughly reconstruct your transcript]

Act as a speech coach for technical interviews. Identify: (1) where my structure got lost — can you hear all six sections and the transitions ("the challenge here was...", "I considered a few approaches...", "if I did this again...")? (2) sentences that are implementation detail an interviewer doesn't need; (3) any claim missing its "why" or its tradeoff; (4) where I should pause for emphasis. Then rewrite my weakest 30-second stretch in my own voice — same facts, tighter delivery — so I can practice it for the next take.
```
