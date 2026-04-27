# What is RAG?

Welcome to the world of Retrieval-Augmented Generation (RAG)! By the end of this curriculum, you'll have built a full-stack RAG application using TypeScript, Next.js, Pinecone, and OpenAI.

But first, let's understand what we're building and why it matters.

---

## Video Introduction

<iframe src="https://share.descript.com/embed/kC3EtmZ5R5K" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## The Problem RAG Solves

Imagine you're building a chatbot for your company's internal documentation. You could train a massive language model on all your docs, but that's expensive and the model might "hallucinate" or make up information that sounds plausible but is wrong.

What if instead, you could:

1. Store all your documents in a searchable format
2. When a user asks a question, find the most relevant documents
3. Feed those specific documents to a language model as context
4. Let the model answer based on that real, up-to-date information

That's exactly what RAG does!

---

## RAG in Simple Terms

RAG combines two powerful concepts:

**Retrieval**: Finding relevant information from a knowledge base
**Generation**: Using that information to generate accurate, contextual responses

Think of it like an open-book exam for AI. Instead of memorizing everything, the AI can "look up" relevant information and then provide answers based on that specific context.

---

## Understanding the Fundamentals

Before diving deeper, watch this explanation of how we turn words into numbers (embeddings):

<iframe src="https://share.descript.com/embed/atonPgRS57j" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## Real-World RAG Applications

- **Customer Support**: Answer questions based on your knowledge base
- **Internal Tools**: Query company documents, policies, and procedures
- **Educational Platforms**: Personalized tutoring based on course materials
- **Legal Research**: Find relevant case law and regulations
- **Medical Assistance**: Reference medical literature for diagnoses

---

## What We'll Build Together

Throughout this curriculum, we'll build a **Document Q&A System** that can:

- Ingest and process various document types (PDFs, web pages, text files)
- Convert documents into searchable vector embeddings
- Store embeddings in Pinecone (a vector database)
- Accept user questions through a Next.js interface
- Retrieve relevant document chunks
- Generate accurate answers using OpenAI's GPT models
- Handle follow-up questions with conversation context

And we'll do it all with **TypeScript** for type safety and better developer experience.

---

## Prerequisites Check

Before we dive in, make sure you're comfortable with:

- **TypeScript fundamentals** (we'll be using it throughout)
- **Next.js and React** (our frontend framework)
- **REST APIs** (we'll build several endpoints)
- **Basic database concepts** (though vector databases are different!)

Don't worry if you haven't worked with AI/ML before - we'll cover everything you need to know!

---

Let's build.
