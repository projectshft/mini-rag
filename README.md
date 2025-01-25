# Cringy LinkedIn Post RAG App

This is a small app that helps users create LinkedIn posts by providing them with examples of cringy LinkedIn posts as context. It’s a simplified, “poor-man’s” Retrieval-Augmented Generation (RAG) implementation built with **Next.js**, **TypeScript**, and **OpenAI’s API**.

---

## What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique where a system retrieves relevant pieces of context (e.g., documents, data) and combines them with a language model’s output to generate responses. Instead of relying solely on the model’s internal knowledge, RAG provides tailored, context-aware results.

In this app, we mimic RAG by:

1. Storing examples of cringy LinkedIn posts as our “knowledge base.”
2. Using OpenAI’s API to generate a new LinkedIn post, augmented with those examples.

---

## How It Works

1. **Input:** Users provide a prompt or idea for a LinkedIn post.
2. **Retrieve:** The app fetches examples of cringy LinkedIn posts to serve as context.
3. **Generate:** Using the OpenAI API, the app creates a LinkedIn post based on the user’s input and the retrieved examples.

---

## Features

-   **Simple Contextual RAG:** Retrieves cringy LinkedIn posts to inspire or inform user-generated posts.
-   **Next.js Frontend:** A modern, fast interface for interacting with the app.
-   **TypeScript:** Ensures strong typing and reliability in the codebase.
-   **OpenAI Integration:** Leverages powerful language generation capabilities.

---

## Setup Instructions

### Prerequisites

1. **OpenAI API Key:**  
   You’ll need an API key to interact with OpenAI’s API. If you don’t already have one, sign up at [OpenAI](https://platform.openai.com/signup) and generate your API key.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/projectshft/mini-rag
    cd mini-rag
    ```
