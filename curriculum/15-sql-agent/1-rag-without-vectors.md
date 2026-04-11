# RAG Without Vectors: SQL Agents

Not all "retrieval" requires vector search. For structured data with known schemas, traditional database queries are often more precise, faster, and cheaper.

---

## When to Use SQL vs Vector Search

### SQL Strengths

SQL queries excel when you need:

- **Exact matches**: "Show me orders from customer ID 12345"
- **Aggregations**: "What's the total revenue last month?"
- **Filtering on known fields**: "Find users in California with premium accounts"
- **Sorting and pagination**: "Top 10 products by sales"
- **Joins across tables**: "Orders with their customer details"

```sql
-- Precise, fast, deterministic
SELECT * FROM influencers
WHERE genre = 'fitness' AND location = 'Los Angeles'
ORDER BY follower_count DESC
LIMIT 10;
```

### Vector Search Strengths

Vector search excels when you need:

- **Semantic similarity**: "Find documents about customer complaints" (even if they don't use the word "complaint")
- **Fuzzy matching**: "What's our policy on returns?" (matches refund policy docs)
- **Unstructured content**: Searching through PDFs, articles, support tickets
- **When you don't know the exact terms**: Natural language queries

```typescript
// Semantic, flexible, approximate
const results = await index.query({
  vector: await embed("frustrated customer experience"),
  topK: 10
});
```

### The Decision Framework

| Question | SQL | Vector |
|----------|-----|--------|
| Do I know the exact field names? | ✅ | |
| Is the data structured with a schema? | ✅ | |
| Do I need aggregations (COUNT, SUM, AVG)? | ✅ | |
| Is the query about meaning/similarity? | | ✅ |
| Is the content unstructured text? | | ✅ |
| Do users ask in natural language? | Depends | ✅ |

---

## Hybrid Approach: Best of Both

Many production systems use both:

```
User Query
    │
    ▼
┌─────────────┐
│   Router    │ ── "How many orders?" ──▶ SQL Agent
│             │
│             │ ── "What's our refund policy?" ──▶ RAG Agent
└─────────────┘
```

The router (which you've already built!) decides which retrieval method to use based on the query type.

---

## Building a SQL Agent

A SQL agent translates natural language to database queries:

```
"Show me fitness influencers in LA under $500"
                    │
                    ▼
            ┌───────────────┐
            │ Extract params│
            │ using LLM     │
            └───────────────┘
                    │
                    ▼
        genre: "fitness"
        location: "Los Angeles"
        maxPrice: 500
                    │
                    ▼
            ┌───────────────┐
            │ Build Prisma  │
            │ query         │
            └───────────────┘
                    │
                    ▼
        prisma.influencer.findMany({
          where: {
            genre: "fitness",
            location: "Los Angeles",
            price: { lte: 500 }
          }
        })
```

### Why Structured Outputs Matter Here

Use structured outputs to reliably extract query parameters:

```typescript
const QueryParamsSchema = z.object({
  genre: z.string().optional(),
  location: z.string().optional(),
  tier: z.enum(['micro', 'mid', 'macro', 'mega']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

// LLM extracts structured params from natural language
const params = await extractParams(userQuery);

// Build type-safe Prisma query
const results = await prisma.influencer.findMany({
  where: constructWhereClause(params)
});
```

---

## SQL Injection: Why Prisma is Safe

### The Dangerous Way (Raw SQL)

```typescript
// ❌ NEVER DO THIS - SQL injection vulnerability
const query = `SELECT * FROM users WHERE name = '${userInput}'`;

// User inputs: "'; DROP TABLE users; --"
// Resulting query: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
```

### The Safe Way (Prisma)

```typescript
// ✅ Prisma uses parameterized queries
const users = await prisma.user.findMany({
  where: { name: userInput }
});

// User input is treated as DATA, not SQL code
// Even malicious input just searches for that literal string
```

Prisma's query builder:
1. Separates SQL structure from data values
2. Escapes all user input automatically
3. Never interpolates user strings into SQL

**Key insight**: With Prisma, you're building queries with a type-safe API, not concatenating strings. The database receives the query structure and values separately.

---

## Assignment 4: SQL Agent

### Repository

Use the **killer_agents** repository:

```bash
git clone https://github.com/projectshft/killer_agents.git
cd killer_agents
yarn install
```

This repo has Prisma + SQLite configured with an influencer database (genres, tiers, pricing, locations).

### Video Assignment (3-4 minutes)

Explain when to use structured queries vs vector search:

1. **SQL strengths** - What types of questions work better with SQL?
2. **Vector strengths** - What types need semantic search?
3. **Hybrid approach** - How would you build a system that uses both?
4. **Tradeoffs** - Cost, latency, accuracy considerations

Give specific examples for each.

### Code Assignment

Complete the database search agent that translates natural language to Prisma queries.

**What you're building:**

The `databaseSearchAgent` in `app/agents/databaseSearchAgent.ts` that:
1. Takes natural language questions about influencers
2. Uses structured outputs to extract query parameters
3. Builds and executes a Prisma query
4. Returns formatted results

**Key files:**
- `app/agents/databaseSearchAgent.ts` - The agent logic
- `app/page.tsx` - The UI
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Sample data

**Requirements:**

1. **Query mapping:**
   - Support filtering by genre, tier, location, price range
   - Map natural language to Prisma `where` clauses
   - Use structured outputs for reliable parameter extraction

2. **SQL injection awareness:**
   - Understand why Prisma's parameterized queries are safe
   - Be ready to explain this in your video

3. **Working UI:**
   - Natural language input
   - Display matching influencers
   - Show how filters map to results

**What "done" looks like:**
- "Show me fitness influencers in LA" returns correct results
- "Find creators under $500" filters by price
- You can explain why Prisma is safer than raw SQL

### Submit Your Work

- [Video Submission - Assignment 4](https://form.typeform.com/to/TBD)
- [Code Submission - Assignment 4](https://form.typeform.com/to/TBD)

**Due:** Before starting Capstone

---

## Key Takeaways

1. **SQL and vector search solve different problems** - Use the right tool for the job
2. **Structured data with known schemas** → SQL
3. **Unstructured text with semantic queries** → Vector search
4. **Many systems need both** - Your router can decide
5. **Always use parameterized queries** - Prisma handles this automatically

---

## What's Next?

You now understand both retrieval approaches. Next up: **Agent Patterns** — common architectures for building AI systems.
