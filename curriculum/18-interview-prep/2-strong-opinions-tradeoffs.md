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

This is a strange time to be interviewing for AI roles. The rules haven't been written yet, and anyone who tells you they have probably doesn't know what they're talking about. That's exactly why this is *not* the time to play it safe with your opinions.

The weak answer isn't "I don't know" - almost nobody freezes up that badly. The weak answer is the **knee-jerk textbook response**:

> "What do you think about autonomous agents?"
>
> "Oh yeah, agents are the future. You'd always want an agent for something like this."

That sounds confident, but it says nothing. It's the answer everyone gives because it's the answer ChatGPT gives. The moment you sound like ChatGPT, the interviewer can't relate to you and can't tell whether you actually understand the tradeoffs.

A stronger answer takes a position, asks a question, and earns its conclusion:

> "Honestly, I'm a bit against reaching for an agent here. What you're describing sounds more like a workflow - there's a clear outcome and a handful of known paths to get there. A true agent is autonomous; it takes a fuzzy task and decides its own steps, which is powerful but hard to debug and test. I'd save that for something genuinely open-ended, like a coding assistant refactoring a service. For this, I'd build a workflow so every step is testable. But it depends - what does 'done' look like for this feature?"

Notice what that does:

- **Takes a real position** (even a slightly contrarian one) instead of the safe default
- **Asks a clarifying question** instead of assuming the problem
- **Teaches a little** - defines agent vs. workflow without condescending
- **Earns the conclusion** with tradeoffs, not buzzwords

A contrarian, well-reasoned take can backfire with the occasional interviewer who just wants a yes-man. You can't control that. What you *can* control is having thought it through - which beats a textbook answer every time.

---

## The Framework

For any tool, pattern, or approach, have:

1. **Your position** - What do you prefer?
2. **Your reasoning** - Why do you prefer it?
3. **Tradeoffs** - What are you giving up?
4. **Use cases** - When would you choose differently?

---

## Opinion 1: Agents vs Structured Workflows

This is the most common question you'll get. The intro already showed the shape of a good answer - the part most people whiff on is the follow-up: "Okay, so when *would* you actually reach for an agent?"

### The Question

"Do you prefer autonomous agents or structured workflows?"

### A realistic weak answer

"Agents are more powerful, so I'd lean agent." Confident, but it ignores that most production problems have a known shape, and it has no answer for the follow-up.

### A stronger answer

"For most production work I prefer a workflow. If I'm routing a customer-service question - classify it, then send it to the right place - that's a known outcome with a handful of paths, and I want every step testable with good and bad examples.

An agent earns its keep when 'done' is subjective. Think of a coding assistant refactoring a service: there's no fixed set of steps, and 'finished' is a judgment call. So you let it loop - pick from its tools, do some work, check its own progress, and decide when it's done. That autonomy is the whole point, but it's also why it's harder to test and debug. So: workflow by default, an agent when the task is genuinely open-ended."

Why it lands: you picked a side, then showed you understand the *other* side well enough to know exactly when you'd switch.

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

There's rarely one right answer here - usually just a wrong one (a fixed number you can't justify). Within the acceptable range a lot of answers work, so think out loud about the data instead of naming a number.

**A weak answer:** "I use 500-token chunks with 50-token overlap." Fine, but it's a reflex, not a decision.

**A stronger answer:** "Depends on the content. For FAQs I'd ask where they live - PDFs, Confluence, a webpage? - and how short they are. If they're tight Q&A pairs, I might embed the question and answer together so a user's question lands right on the answer, and keep the source and last-updated date as metadata. For something structured like API docs, I chunk on semantic boundaries - sections or function definitions. The point is to align chunks with meaningful units, not arbitrary sizes."

The move here: naming the tools in your belt - embedding Q+A, metadata, semantic boundaries - shows range even before you commit to one.

---

### Re-Ranking

**The Question:** "Do you use re-ranking in your RAG systems?"

**A weak answer:** "Yes, it improves results."

**A stronger answer:** "For anything past a prototype, yes. Initial vector search is recall-focused - it casts a wide net. A cross-encoder re-ranker then reads each query-document pair and reorders for precision. It costs a little latency and money, but for production that precision is usually worth it. For a quick internal tool, I might skip it."

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

### A stronger answer

"First, I make the model swappable - configurable, not hardcoded - because this stuff changes monthly and I don't want to be locked in. Then I match the model to the job. Heavy reasoning or anything user-facing and open-ended, I reach for a top-tier model where accuracy beats cost. High-volume classification or structured extraction, I drop to something small and cheap - often 20x cheaper and plenty good for that. I've watched projects torch their budget running a frontier model on a task a mini could've handled. Picking the model is a cheap decision to revisit, so I start cheap and upgrade only where quality actually suffers."

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

### A stronger answer

"I add observability from day one, because LLM systems fail silently - you get a bad answer, not an error. I wire in something like LangSmith or Helicone to capture every request: input, output, latency, cost. When someone reports a bad answer, I can replay the exact prompt and context that produced it. I also like giving users a thumbs up/down so I get a real signal on quality and can iterate on it. Without that, debugging an LLM is just guessing."

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

- Cop-out: "It depends on the use case"
- Takes a position: "It depends, but I default to structured workflows unless I have a specific reason to use agents"

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

- Weak: "Both are good, depends on the use case"
- Strong: "I default to X, but use Y when Z"

### Mistake 2: No Reasoning

- Weak: "I prefer vector search because it's better"
- Strong: "I prefer vector search for unstructured docs because it matches on meaning, not just keywords"

### Mistake 3: Ignoring Tradeoffs

- Weak: "Agents are great because they're autonomous"
- Strong: "Agents give you autonomy but you lose predictability and debuggability"

### Mistake 4: Sounding Uncertain

- Weak: "I think maybe workflows might be better sometimes?"
- Strong: "I prefer workflows for production systems"

Even if you're not 100% confident, sound like you have a position.

