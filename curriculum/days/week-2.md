# Week 2: Data Pipeline (Days 8-14)

**Theme:** Document upload, querying, and fine-tuning overview

**Assignment:** Document Upload continues (Due Day 13)

---

## Day 8: Uploading with a Script

**Time:** 60 min | **Type:** Read + Run

### Learning Objectives
- Understand the batch upload process
- Run the upload script to see it in action
- Know how metadata is structured

### Content
1. [Uploading with a Script](../5-document-upload/1-uploading-with-a-script.md)
2. [Uploading with a Script - Part 2](../5-document-upload/2-uploading-with-a-script-2.md)

### Run It
```bash
# Review the upload script
cat app/scripts/upload-documents.ts

# Run with sample data (if available)
npx ts-node app/scripts/upload-documents.ts
```

### Key Takeaways
- Batch upload = chunk + embed + upsert in bulk
- Metadata makes retrieval more targeted
- Script approach good for initial loads; API for ongoing

---

## Day 9: Building the API Route (Exercise)

**Time:** 90 min | **Type:** Hands-on

### Learning Objectives
- Implement the 9-step upload pipeline
- Handle chunking, embedding, and upserting
- Add proper error handling

### Content
1. [Building the API Route](../5-document-upload/3-building-the-api-route.md)

### Exercise
Complete the TODOs in `app/api/upload-document/route.ts`:

1. Validate input
2. Sanitize text
3. Chunk the document
4. Generate embeddings
5. Create vectors with metadata
6. Upsert to Pinecone
7. Return success response

### Run Tests
```bash
yarn test:chunking
```

### Key Takeaways
- API route = production-ready upload path
- Validate → Sanitize → Chunk → Embed → Store
- Error handling is critical for debugging

---

## Day 10: Querying Documents

**Time:** 45 min | **Type:** Hands-on

### Learning Objectives
- Implement document retrieval
- Understand similarity search parameters
- Test query quality

### Content
1. [Querying Documents](../5-document-upload/4-querying-documents.md)

### Exercise
Test retrieval with different queries:
```bash
yarn dev
# Then use the chat interface or API to test queries
```

### Key Takeaways
- Query = embed question → search vectors → return top-k
- `topK` controls how many results to fetch
- Metadata filters narrow search scope

---

## Day 11: Fine-Tuning Overview

**Time:** 60 min | **Type:** Read

### Learning Objectives
- Understand when to fine-tune vs use RAG
- Know the fine-tuning process at a high level
- Recognize fine-tuning use cases

### Content
1. [Introduction to Fine-Tuning](../6-fine-tuning/1-introduction-to-fine-tuning.md)
2. [Running a Fine-Tune](../6-fine-tuning/2-running-a-fine-tune.md)

### Key Takeaways
- Fine-tuning = change model behavior (style, format, domain)
- RAG = provide context (facts, up-to-date info)
- Often use both: fine-tuned model + RAG retrieval

---

## Day 12: Assignment 1 Work

**Time:** 90 min | **Type:** Assignment

### Focus
Work on Assignment 1: Document Upload

**Video (3-4 minutes):** Explain chunking strategy tradeoffs for medical records, Confluence docs, and Twitter posts.

**Code:** Complete the TODOs in the ingestion route, then add text sanitization.

### Files
- `app/api/upload-document/route.ts`
- `app/libs/chunking.ts`

### Tips
- Record your video explaining to a colleague
- Show your understanding of tradeoffs, not just implementation
- Test your code with different document types

---

## Day 13: Assignment 1 Completion

**Time:** 60 min | **Type:** Assignment

### Focus
Finish and submit Assignment 1

### Submit
- [Video Submission](https://form.typeform.com/to/NdVcsThQ)
- [Code Submission](https://form.typeform.com/to/A0pGKPqU)

### Checklist
- [ ] Video explains chunking tradeoffs clearly
- [ ] Code handles sanitization
- [ ] Tests pass
- [ ] Submitted both video and code

---

## Day 14: REST

Take a break. Week 3 introduces agents.

---

## Week 2 Checklist

- [ ] Ran upload script to understand batch process
- [ ] Implemented API route (all TODOs)
- [ ] Tested document querying
- [ ] Understand fine-tuning vs RAG tradeoffs
- [ ] Assignment 1 submitted
