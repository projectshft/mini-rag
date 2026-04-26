# Module 3: RAG System Design

Design RAG systems for different scenarios with clear reasoning about architecture, chunking, and retrieval.

---

## What You'll Build

By the end of this module, you'll have:

- Three complete system designs for different scenarios
- A framework for designing any RAG system
- A video walkthrough of one design

---

## Why System Design Matters

**Common interview question:**

"Design a RAG system for [legal documents / customer support / code documentation]."

**What they're testing:**

- Can you think through architecture end-to-end?
- Do you consider different content types?
- Can you explain chunking strategies?
- Do you think about tradeoffs?

This isn't about perfect answers - it's about demonstrating structured thinking.

---

## The Design Framework

For any RAG system, address these six areas:

### 1. Content Type & Characteristics
- What kind of data? (structured, unstructured, semi-structured)
- How large? (pages, tokens, documents)
- How often updated? (static, daily, real-time)
- What structure exists? (headings, sections, metadata)

### 2. Chunking Strategy
- Chunk by what? (size, semantic boundaries, structure)
- Overlap? (yes/no, how much)
- Metadata? (what to preserve)

### 3. Embedding & Storage
- Which embedding model?
- Index structure (single, multiple, namespaces)
- Metadata filtering strategy

### 4. Retrieval Strategy
- Search type (vector, hybrid, with metadata)
- How many results (topK)?
- Re-ranking? (yes/no, which model)

### 5. Generation
- Which LLM?
- Prompt structure
- Context handling

### 6. Updates & Maintenance
- How to handle new content?
- Deduplication strategy
- Timestamp tracking

---

## 🎥 Video: Live System Design Walkthrough

> **[VIDEO PLACEHOLDER]**
>
> **Title:** "RAG System Design: Thinking Out Loud"
>
> **Content:**
> - Walk through ONE scenario (legal docs recommended) as if in a real interview
> - Show the "messy" thinking process: pausing, considering alternatives, self-correcting
> - Demonstrate drawing architecture on a whiteboard/screen while explaining
> - Explicitly call out: "Here's where I'd pause and ask the interviewer a clarifying question"
> - End with a 30-second summary of key decisions
>
> **Duration:** 8-10 minutes
>
> **Why this video:** System design is the hardest interview skill to learn from reading. Senior devs need to see the pacing, when to go deep vs stay high-level, and how to handle "I don't know" moments gracefully.

---

## Scenario 1: Legal Document RAG

### The Prompt

"Design a RAG system for a law firm to query contracts, case law, and legal memos."

### Your Design

#### 1. Content Characteristics

Legal documents are:
- **Highly structured** (sections, clauses, numbered paragraphs)
- **Precise** (exact wording matters)
- **Long** (contracts can be 50+ pages)
- **Metadata-rich** (dates, parties, document type, jurisdiction)

#### 2. Chunking Strategy

**Approach: Chunk by semantic boundaries**

```typescript
// ✅ Good chunking for legal docs
Chunk by:
- Sections (numbered headings like "3.2 Indemnification")
- Clauses (complete legal statements)
- Paragraphs (within sections)

Preserve:
- Section numbers
- Heading text
- Document metadata (date, parties, type)
```

**Why not fixed-size chunks?**

❌ Fixed chunks split clauses mid-sentence
❌ Loses structural context
❌ Makes citations unclear ("found in chunk 47" is useless)

**Example:**

```
Document: employment-agreement-acme-2024.pdf
Section: 5.2 Non-Compete Clause

Chunk:
"5.2 Non-Compete Clause: Employee agrees not to engage in
competing business activities within 50 miles of Employer's
offices for a period of 12 months following termination..."

Metadata:
- document_id: "ea-acme-2024"
- section: "5.2"
- section_title: "Non-Compete Clause"
- doc_type: "employment_agreement"
- date: "2024-01-15"
- parties: ["Acme Corp", "John Doe"]
```

#### 3. Embedding & Storage

**Single index with metadata filtering:**

- One Pinecone index for all legal docs
- Filter by: `doc_type`, `date`, `parties`, `jurisdiction`
- Use namespaces for different clients (client isolation)

**Why?**

✅ Scales to thousands of documents
✅ Can query across document types
✅ Easy to filter to specific cases
✅ Client data isolation

#### 4. Retrieval Strategy

**Hybrid search with re-ranking:**

```typescript
// Step 1: Initial retrieval
const results = await index.query({
  vector: embedding,
  topK: 20,  // Cast wide net
  filter: {
    doc_type: { $in: ["contract", "memo"] },
    date: { $gte: "2020-01-01" }  // Recent docs only
  }
});

// Step 2: Re-rank with cross-encoder
const reranked = await cohere.rerank({
  query: userQuery,
  documents: results,
  topN: 5
});
```

**Why re-ranking?**

Legal queries are precise - "indemnification clauses in employment contracts" needs exact matches, not just "employment" OR "indemnification".

#### 5. Generation

**GPT-4 or Claude Opus:**

- Complex reasoning required
- Accuracy matters more than cost
- Need to quote exact text

**Prompt structure:**

```typescript
const systemPrompt = `You are a legal research assistant.
Answer based ONLY on the provided context.
Quote relevant sections verbatim with citations.
If the context doesn't contain the answer, say so clearly.

Context:
${retrievedChunks}

User query: ${query}

Respond with:
1. Direct answer
2. Relevant quotes (with section numbers)
3. Source documents`;
```

#### 6. Updates & Maintenance

**Challenges:**
- New contracts added daily
- Amendments modify existing docs
- Old contracts still relevant

**Strategy:**

- Track `document_id` + `version`
- Store `last_updated` timestamp
- Don't delete old versions (legal needs history)
- Use metadata to mark latest version

---

### Your Turn: Scenario 1

Design a RAG system for legal documents using the framework.

```markdown
## Legal Document RAG: My Design

### 1. Content Characteristics
[Describe the content]

### 2. Chunking Strategy
[How you'll chunk and why]

### 3. Embedding & Storage
[Index structure and metadata]

### 4. Retrieval Strategy
[Search approach and re-ranking]

### 5. Generation
[Model choice and prompt structure]

### 6. Updates & Maintenance
[How you'll handle changes]
```

---

## Scenario 2: Customer Support Knowledge Base

### The Prompt

"Design a RAG system for customer support agents to query internal documentation, FAQs, and troubleshooting guides."

### Your Design

#### 1. Content Characteristics

Support docs are:
- **Semi-structured** (mix of FAQs, guides, screenshots)
- **Updated frequently** (product changes weekly)
- **Varied length** (FAQs are short, guides are long)
- **Action-oriented** ("How to reset password", not theory)

#### 2. Chunking Strategy

**Approach: Chunk by question-answer pairs for FAQs, by steps for guides**

```typescript
// For FAQs:
Chunk = one Q&A pair

// For guides:
Chunk = one complete step (with substeps)

Preserve:
- Source type (FAQ vs guide)
- Category (billing, technical, account)
- Last updated date
```

**Example:**

```
FAQ Chunk:
Q: How do I reset my password?
A: Click "Forgot Password" on the login page, enter your email,
and follow the link sent to your inbox. Links expire in 24 hours.

Metadata:
- doc_type: "faq"
- category: "account_management"
- last_updated: "2024-03-01"
- page_url: "/help/account/password-reset"
```

#### 3. Embedding & Storage

**Single index with aggressive metadata:**

- One index for all support content
- Metadata: `category`, `product_version`, `last_updated`
- Boost recent content (weight by recency)

#### 4. Retrieval Strategy

**Hybrid search with recency bias:**

```typescript
// Retrieve
const results = await index.query({
  vector: embedding,
  topK: 10,
  filter: {
    last_updated: { $gte: cutoffDate },  // Prefer recent
    category: inferredCategory  // From query
  }
});

// Re-rank with recency weight
const scored = results.map(r => ({
  ...r,
  adjustedScore: r.score * (1 + recencyBoost(r.last_updated))
}));
```

**Why?**

Support docs change frequently - outdated answers are worse than no answer.

#### 5. Generation

**GPT-4o-mini:**

- Support queries are straightforward
- High volume (cost matters)
- Speed matters (agents waiting)

**Prompt structure:**

```typescript
const systemPrompt = `You are a helpful support assistant.
Provide clear, step-by-step instructions based on the context.
Include relevant links when available.
If information is outdated, mention the date.

Context:
${retrievedChunks}

User query: ${query}

Respond with:
1. Direct answer (2-3 sentences)
2. Step-by-step instructions (if applicable)
3. Links to full documentation`;
```

#### 6. Updates & Maintenance

**Challenges:**
- Docs updated daily
- Old content becomes obsolete
- Need to expire outdated info

**Strategy:**

- Re-scrape and re-embed weekly
- Mark old chunks with `deprecated: true`
- Filter out deprecated unless explicitly requested
- Track `product_version` to handle multiple versions

---

### Your Turn: Scenario 2

Design a RAG system for customer support using the framework.

```markdown
## Customer Support RAG: My Design

### 1. Content Characteristics
[Describe the content]

### 2. Chunking Strategy
[How you'll chunk and why]

### 3. Embedding & Storage
[Index structure and metadata]

### 4. Retrieval Strategy
[Search approach and filters]

### 5. Generation
[Model choice and prompt structure]

### 6. Updates & Maintenance
[How you'll handle frequent changes]
```

---

## Scenario 3: Code Documentation

### The Prompt

"Design a RAG system for querying documentation for React, Vue, and Angular."

### Your Design

#### 1. Content Characteristics

Code docs are:
- **Highly structured** (API refs, guides, examples)
- **Framework-specific** (mixing frameworks reduces relevance)
- **Code-heavy** (examples are critical)
- **Versioned** (React 18 vs 19 are different)

#### 2. Chunking Strategy

**Approach: Chunk by API reference entries and guide sections**

```typescript
// For API references:
Chunk = one function/hook/component
Include: signature, parameters, return type, examples

// For guides:
Chunk = one complete concept
Include: explanation + code examples

Preserve:
- Framework (react, vue, angular)
- Version (18, 19, etc)
- Doc type (api, guide, tutorial)
```

**Example:**

```
API Chunk: useState Hook

## useState

`const [state, setState] = useState(initialState)`

Parameters:
- initialState: The initial state value

Returns:
- Array with current state and setter function

Example:
```javascript
const [count, setCount] = useState(0);
```

Metadata:
- framework: "react"
- version: "18.0.0"
- doc_type: "api"
- api_name: "useState"
- category: "hooks"
```

#### 3. Embedding & Storage

**Separate namespaces per framework:**

```typescript
// In Pinecone:
namespaces: {
  "react-18": [...],
  "react-19": [...],
  "vue-3": [...],
  "angular-17": [...]
}

// Query specific namespace
const results = await index.namespace("react-18").query({...});
```

**Why namespaces instead of one index?**

✅ Prevents mixing React and Vue results
✅ Easy to update one framework independently
✅ Can query across frameworks when needed

#### 4. Retrieval Strategy

**Namespace-filtered search:**

```typescript
// Step 1: Detect framework from query
const framework = detectFramework(query);  // "react", "vue", etc.

// Step 2: Query that namespace
const results = await index
  .namespace(`${framework}-${version}`)
  .query({
    vector: embedding,
    topK: 5,
    filter: {
      doc_type: { $in: ["api", "guide"] }  // Prefer official docs
    }
  });
```

**Why not re-rank?**

Code docs are already well-structured - initial retrieval is usually good enough.

#### 5. Generation

**GPT-4o:**

- Balance of quality and cost
- Good at code examples
- Fast enough for chat

**Prompt structure:**

```typescript
const systemPrompt = `You are a technical documentation assistant.
Provide accurate answers with code examples.
Always specify which framework and version you're referencing.

Context from ${framework} ${version} docs:
${retrievedChunks}

User query: ${query}

Respond with:
1. Direct answer (2-3 sentences)
2. Code example
3. Link to full documentation`;
```

#### 6. Updates & Maintenance

**Challenges:**
- Frameworks release new versions
- Need to maintain multiple versions
- Deprecated APIs still queried

**Strategy:**

- Scrape docs per version
- Keep last 2-3 versions active
- Mark older versions as `archived: true`
- Default to latest, allow version selection

---

### Your Turn: Scenario 3

Design a RAG system for code documentation using the framework.

```markdown
## Code Documentation RAG: My Design

### 1. Content Characteristics
[Describe the content]

### 2. Chunking Strategy
[How you'll chunk and why]

### 3. Embedding & Storage
[Index structure and namespaces]

### 4. Retrieval Strategy
[Framework detection and search]

### 5. Generation
[Model choice and prompt structure]

### 6. Updates & Maintenance
[How you'll handle version updates]
```

---

## Written Assignment

Complete all three system designs using the framework:

1. Legal Document RAG
2. Customer Support RAG
3. Code Documentation RAG

**Instructions:**

- Address all six areas in the framework
- Explain your reasoning (don't just list choices)
- Mention tradeoffs
- Be specific (not "I'd use chunking" but "I'd chunk by semantic boundaries because...")

**Submission format:**

Three separate system designs in one markdown document.

---

## Video Assignment

Record yourself walking through ONE of your system designs and submit for feedback.

**Instructions:**

1. Choose your strongest design
2. Walk through all six areas (aim for 1-5 minutes total)
3. Use the "interviewer asks, you answer" format:

**Example script:**

"The question is: Design a RAG system for legal documents.

First, let me think about the content characteristics...
[Explain content characteristics]

For chunking, I would...
[Explain chunking strategy]

For embedding and storage...
[Explain embedding approach]

[Continue through all six areas]

So to summarize, the key decisions are...
[Summarize key choices]"

**Don't:**
- Read from notes
- Rush through (take your time)
- Skip the reasoning ("I'd use X because Y")

**What you'll receive feedback on:**
- Completeness of system design
- Quality of reasoning for each decision
- Tradeoff discussion
- Clarity of architecture explanation
- Interview readiness

---

## Practice Tips

### Tip 1: Draw the Architecture

While explaining, draw boxes and arrows:
- Data flow
- Components
- Decisions points

Helps you think clearly and shows structured thinking.

### Tip 2: Explain the "Why"

For every choice, say why:

❌ "I'd use GPT-4"
✅ "I'd use GPT-4 because legal queries need complex reasoning and accuracy matters more than cost"

### Tip 3: Mention What You're NOT Doing

Shows you considered alternatives:

"I'm not using fixed-size chunks because legal clauses would split mid-sentence."

### Tip 4: Stay Focused

Keep your explanation tight:
- Too brief = missing critical details
- Too long = losing focus on key decisions

---

## Common Mistakes

### Mistake 1: Too Generic

❌ "I'd use RAG with chunking and retrieval"
✅ "I'd chunk by semantic boundaries - specifically by numbered sections - because legal docs have explicit structure"

### Mistake 2: No Reasoning

❌ "I'd use re-ranking"
✅ "I'd use re-ranking because legal queries are precise and initial retrieval often returns related but not exact matches"

### Mistake 3: Forgetting Updates

Many designs forget ongoing maintenance. Always address:
- How do you handle new content?
- How do you update existing content?
- How do you prevent stale data?

### Mistake 4: One-Size-Fits-All

Don't use the same design for every scenario.

Legal docs ≠ Support docs ≠ Code docs

Each has different:
- Chunking needs
- Update frequency
- Accuracy requirements
- Cost constraints

---

## What You Learned

✅ Framework for designing any RAG system
✅ How to match chunking strategy to content type
✅ When to use namespaces vs filtering vs separate indexes
✅ How to explain system architecture clearly

---

## What's Next?

In Module 4, you'll practice answering common interview questions out loud - the final skill before real interviews.
