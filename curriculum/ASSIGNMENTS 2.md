# Assignments

Five hands-on submissions that have you apply concepts to new problems. Each assignment has two parts:

1. **Video** - Explain the concept applied to scenarios NOT covered in the lessons
2. **Code** - Complete the TODOs in the repo AND extend the implementation

---

## Assignment 1: Chunking + Sanitization

**Location:** End of Document Upload section

**Video (3-4 min):** Explain chunking strategy tradeoffs. How would you chunk:
- Medical records (HIPAA, structured fields, clinical notes)
- Confluence documentation (headers, code blocks, tables)
- Twitter/X posts (short, hashtags, threads)

What changes for each and why?

**Code:**
- Complete the ingestion TODOs to make the system work
- Add text sanitization: strip HTML tags, normalize whitespace, handle special characters, remove boilerplate (nav, footers, ads)

**Submit:**
- [Video Submission - Assignment 1](https://form.typeform.com/to/NdVcsThQ)
- [Code Submission - Assignment 1](https://form.typeform.com/to/A0pGKPqU)

---

## Assignment 2: Retrieval Quality + Query Preprocessing

**Location:** End of RAG Agent section

**Video (3-4 min):** Explain retrieval quality. How do you know if:
- Your chunks are too big or too small?
- You're retrieving the right content?
- Your similarity threshold is correct?

What metrics would you track?

**Code:**
- Complete the RAG agent TODOs
- Add query preprocessing: expand common abbreviations, normalize casing, handle typos with fuzzy matching, strip filler words

**Submit:**
- [Video Submission - Assignment 2](https://form.typeform.com/to/VcNBEHNA)
- [Code Submission - Assignment 2](https://form.typeform.com/to/EWWcsorL)

---

## Assignment 3: Reranking + Score Thresholding

**Location:** End of Reranking section

**Video (3-5 min):** Explain two-stage retrieval:
- When is reranking worth the latency and cost?
- When would you skip it entirely?
- How do you decide the cutoff between stage 1 and stage 2?

Give specific examples.

**Code:**
- Complete the reranking TODOs
- Add score thresholding: filter out low-confidence results, return "I don't know" when no results pass threshold, log filtered results for analysis

**Submit:**
- [Video Submission - Assignment 3](https://form.typeform.com/to/pwjkAruL)
- [Code Submission - Assignment 3](https://form.typeform.com/to/q3mEuSmX)

---

## Assignment 4: SQL Agent (RAG Without Vectors)

**Location:** After Testing section

**Repository:** [killer_agents](https://github.com/projectshft/killer_agents) (Prisma + SQLite already configured)

**Video (3-4 min):** Explain when to use structured queries vs vector search:
- What types of questions work better with SQL?
- What types need semantic search?
- How would you build a system that uses both?

**Code:**
- Complete the `databaseSearchAgent` that translates natural language to Prisma queries
- Understand SQL injection prevention (why Prisma's parameterized queries are safe)
- Get the UI working with natural language queries

**Submit:**
- [Video Submission - Assignment 4](https://form.typeform.com/to/TBD)
- [Code Submission - Assignment 4](https://form.typeform.com/to/TBD)

---

## Assignment 5: Capstone Project

**Location:** Capstone section

Build a complete RAG application for a domain of your choice. Requirements:

1. **Custom data source** - Not the provided documentation
2. **Thoughtful chunking** - Explain your strategy
3. **Query handling** - Preprocessing, retrieval, reranking (if appropriate)
4. **Evaluation** - How do you know it's working?
5. **One unique feature** - Something not covered in the curriculum

**Video (5-7 min):** Demo your application and explain your design decisions.

**Submit:**
- [Capstone Submission](https://form.typeform.com/to/TBD)

---

## Submission Schedule

| Assignment | Due |
|------------|-----|
| Assignment 1 | Before starting Assignment 2 |
| Assignment 2 | Before starting Assignment 3 |
| Assignment 3 | Before starting Assignment 4 |
| Assignment 4 | Before starting Capstone |
| Capstone | End of program |

---

## Grading Criteria

**Videos are graded on:**
- Clear explanation of the concept
- Application to scenarios NOT in the lessons
- Demonstration of understanding (not just recitation)

**Code is graded on:**
- TODOs completed and working
- Extension implemented correctly
- Code quality (readable, no obvious bugs)
