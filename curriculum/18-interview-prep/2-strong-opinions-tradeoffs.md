# Strong Opinions & Tradeoffs

Most candidates describe. Strong candidates take positions and defend them.

## Video Walkthrough

Watch this breakdown of forming and defending strong opinions in AI interviews:

<iframe src="https://share.descript.com/embed/0JA4vNMQTj5" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Build

By the end of this section, you'll have:

- Defensible positions on agents vs workflows
- Opinions on vector search vs SQL
- Framework for evaluating any tool or pattern
- A video recording explaining your strongest opinion

---

## Why Opinions Matter

**The problem:**

Interviewers ask: "What do you think about autonomous agents?"

Weak candidates say:
- "They're interesting" (says nothing)
- "I've heard they're good" (no opinion)
- "I don't know much about them" (unprepared)

Strong candidates say:
- "I prefer structured workflows over autonomous agents for production systems because they're more predictable and easier to debug. I'd only use autonomous agents for research tasks where the workflow isn't known upfront."

**What changed?**
- ✅ Clear position
- ✅ Reasoning
- ✅ Specific use cases
- ✅ Demonstrates practical experience

---

## The Framework

For any tool, pattern, or approach, have:

1. **Your position** - What do you prefer?
2. **Your reasoning** - Why do you prefer it?
3. **Tradeoffs** - What are you giving up?
4. **Use cases** - When would you choose differently?

---

## Opinion 1: Agents vs Structured Workflows

This is the most common interview question. You must have a clear answer.

### The Question

"Do you prefer autonomous agents or structured workflows?"

### Strong Answer Template

"In most production systems, I prefer [structured workflows / autonomous agents] because [reasoning]. However, I'd use [the other option] when [specific use case]."

### Example Answer

"In most production systems, I prefer structured workflows because they're predictable, testable, and easier to debug. When an LLM call fails, I know exactly where it happened and can replay it. With autonomous agents, the execution path changes every time, making debugging harder.

However, I'd use autonomous agents for research tasks or open-ended exploration where I don't know the workflow upfront. If I'm building a system to research market trends, an autonomous agent makes sense because the information gathering steps aren't predetermined."

---

### When to Use Each

**Structured Workflows** - Use when:
- You know the steps ahead of time
- Reliability matters more than flexibility
- You need to debug failures
- You're building production systems

Examples:
- Customer support (classify → route → respond)
- Email triage (read → categorize → draft reply)
- Document processing (extract → validate → store)

**Autonomous Agents** - Use when:
- The workflow isn't predetermined
- Exploration is the goal
- Flexibility matters more than predictability
- You're building research tools

Examples:
- Market research (where next steps depend on findings)
- Code exploration (following unknown codebases)
- Creative brainstorming (unexpected directions are valuable)

---

### Your Turn

Write your position:

```markdown
## Agents vs Workflows: My Opinion

In most production systems, I prefer _________________ because:

- [Reason 1]
- [Reason 2]
- [Reason 3]

However, I'd use _________________ when:

- [Use case 1]
- [Use case 2]

The key tradeoff is:
[What you gain vs what you lose]
```

---

## Opinion 2: Vector Search vs SQL

### The Question

"How would you approach retrieval for this data - vector search, or something else?"

The trap is jumping straight to embeddings and `1536` vs `512` dimensions. Strong candidates take a step back and ask where the data already lives.

### Strong Answer Template

"It depends on where the data is and how exact the retrieval needs to be. I'd use [approach] because [reasoning], and pair it with [other approach] when [different use case]."

### When to Use Each

**Vector search** - Best for:
- Semantic / fuzzy matching ("find docs *about* this", not exact terms)
- Unstructured text where keywords miss synonyms and paraphrases
- "More like this" retrieval

Downsides:
- Semantic similarity isn't always the *highest quality* match
- No hard guarantees - can surface plausible-but-wrong results
- Costs embeddings + a vector store

**SQL / structured filters** - Best for:
- Data that already lives in a relational store
- Exact constraints (date ranges, status, owner, jurisdiction)
- Domains where precision is non-negotiable (legal, medical, finance)

Downsides:
- No semantic understanding - misses synonyms and intent
- You have to know what to filter on

### Example Answer

"Before reaching for embeddings, I'd ask where the data is. If it's already in SQL or Mongo, sometimes the best move is just giving an agent query access to it - no vector store needed.

For something like legal or medical documents, pure vector search worries me because semantic similarity doesn't guarantee an exact match. I'd pair vector search with hard metadata filters - so I get the semantic recall, but I can still constrain by date, jurisdiction, or document type. Vector search isn't always the answer; it's one tool with real tradeoffs."

---

### Your Turn

Write your position:

```markdown
## Vector Search vs SQL: My Opinion

For [use case], I prefer _________________ because:

- [Reason 1]
- [Reason 2]

For [different use case], I'd pair it with _________________ because:

- [Reason 1]
- [Reason 2]

The key question I always ask first is:
[Where does the data live, and how exact does retrieval need to be?]
```

---

## Opinion 3: RAG Patterns

### Chunking Strategy

**The Question:** "How do you chunk documents for RAG?"

**Weak answer:** "I use 500-token chunks with 50-token overlap."

**Strong answer:** "It depends on the content type. For structured documents like API docs, I chunk by semantic boundaries - sections, function definitions, or paragraphs. For unstructured content like transcripts, I use fixed-size chunks with overlap. The key is aligning chunks with meaningful units, not arbitrary sizes."

---

### Re-Ranking

**The Question:** "Do you use re-ranking in your RAG systems?"

**Weak answer:** "Yes, it improves results."

**Strong answer:** "Yes, for anything beyond a prototype. Initial vector search casts a wide net - it's recall-focused. Re-ranking with a cross-encoder significantly improves precision by understanding the relationship between query and context. It adds latency, but the quality improvement is worth it for production systems."

---

### Your Turn

Write your position on two RAG patterns:

```markdown
## Chunking Strategy: My Opinion

For [content type], I use _________________ because:

- [Reason 1]
- [Reason 2]

For [different content type], I use _________________ because:

- [Reason 1]

## Re-Ranking: My Opinion

I [do / don't] use re-ranking in production because:

- [Reason 1]
- [Reason 2]

The tradeoff is:
[What you gain vs what you lose]
```

---

## Opinion 4: Model Selection

### The Question

"How do you choose which model to use?"

### Strong Answer Template

"I design systems so I can swap models easily. For [task type], I use [model] because [reasoning]. For [different task], I use [different model]."

### Example Answer

"I design systems so models are configurable, not hardcoded. For complex reasoning tasks like analyzing user intent or generating creative content, I use GPT-4 or Claude Opus because accuracy matters more than cost. For simple classification or structured extraction, I use GPT-4o-mini because it's 20x cheaper and fast enough for those tasks. I've seen projects blow their budget using GPT-4 for tasks that GPT-3.5 could handle."

---

### When to Use Each Model Size

**Large models (GPT-4, Claude Opus):**
- Complex reasoning
- Open-ended generation
- When quality matters more than cost
- Low request volume

**Small models (GPT-4o-mini, Claude Haiku):**
- Classification tasks
- Structured extraction
- High request volume
- When cost matters

**Fine-tuned models:**
- Consistent formatting
- Domain-specific knowledge
- Predictable outputs
- Cost optimization for high volume

---

### Your Turn

Write your position:

```markdown
## Model Selection: My Opinion

For [task type], I use _________________ because:

- [Reason 1]
- [Reason 2]

For [different task], I use _________________ because:

- [Reason 1]

I [do / don't] fine-tune models because:

- [Reason 1]
- [Reason 2]
```

---

## Opinion 5: Observability

### The Question

"How do you debug LLM failures?"

### Strong Answer

"I include observability from day one because LLM systems fail silently. I use tools like Helicone or LangSmith to track every request - inputs, outputs, latency, and costs. When a user reports a bad answer, I can replay the exact prompt and context that generated it. Without observability, debugging LLMs is guesswork."

### What to Monitor

**Must track:**
- Inputs and outputs
- Token usage and cost
- Latency
- Error rates
- Tool calls (for agents)

**Why it matters:**
- LLMs are non-deterministic
- Context matters (you need to see exact inputs)
- Failures are often subtle (bad answer, not error)
- Cost can spiral without monitoring

---

### Your Turn

Write your position:

```markdown
## Observability: My Opinion

I [do / don't] include observability because:

- [Reason 1]
- [Reason 2]

The tools I use are:

- [Tool 1] for [purpose]
- [Tool 2] for [purpose]

Without observability, the problem is:
[Specific debugging challenge]
```

---

## Written Assignment

Complete all five opinion sections above:

1. Agents vs Workflows
2. Vector Search vs SQL
3. RAG Patterns (Chunking + Re-Ranking)
4. Model Selection
5. Observability

**Instructions:**

- Write in complete sentences
- Include specific reasoning
- Mention tradeoffs explicitly
- Use examples from your experience

**Submission format:**

A single markdown document with all five opinions clearly labeled.

---

## Video Assignment

Record yourself explaining your strongest opinion and submit for feedback.

**Instructions:**

1. Choose ONE opinion from above (pick your strongest)
2. Keep it concise - aim for 1-5 minutes
3. Structure: Position → Reasoning → Tradeoffs → Use Cases
4. Don't read from notes
5. Sound confident (even if you're not 100% sure)
6. **Submit your video** - you'll receive feedback on your reasoning and delivery

**Example structure:**

"The question I'm answering is: Do you prefer agents or workflows?

In most production systems, I prefer structured workflows...
[Explain your reasoning]

However, I'd use agents for...
[Describe use cases]

The key tradeoff is...
[What you gain vs what you lose]

So my position is: start with workflows, add agents only when needed."

**What you'll receive feedback on:**
- Strength of your position
- Quality of reasoning
- Tradeoff awareness
- Use case appropriateness
- Confidence and clarity

---

## Practice Tips

### Tip 1: Pick a Side

Don't say "it depends" without then picking a default position.

❌ "It depends on the use case" (cop-out)
✅ "It depends, but I default to structured workflows unless I have a specific reason to use agents" (takes position)

### Tip 2: Use "I Prefer" Language

Sound opinionated:
- "I prefer..."
- "In my experience..."
- "I've found that..."
- "My approach is..."

### Tip 3: Cite Tradeoffs

Every decision has tradeoffs. Mention them:
- "The downside is..."
- "What you lose is..."
- "The tradeoff is..."
- "I'm willing to sacrifice X for Y because..."

### Tip 4: Be Willing to Change Your Mind

"I prefer workflows, but if you're building a research tool, I'd absolutely use agents."

Shows:
- Flexibility
- Practical thinking
- Not dogmatic

---

## Common Mistakes

### Mistake 1: No Position

❌ "Both are good, depends on the use case"
✅ "I default to X, but use Y when Z"

### Mistake 2: No Reasoning

❌ "I prefer vector search because it's better"
✅ "I prefer vector search for unstructured docs because it matches on meaning, not just keywords"

### Mistake 3: Ignoring Tradeoffs

❌ "Agents are great because they're autonomous"
✅ "Agents give you autonomy but you lose predictability and debuggability"

### Mistake 4: Sounding Uncertain

❌ "I think maybe workflows might be better sometimes?"
✅ "I prefer workflows for production systems"

Even if you're not 100% confident, sound like you have a position.

