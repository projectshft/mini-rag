# Feed It Real Data

**Time:** ~30 min · Build

> **The goal:** pull real YouTube transcripts and feed them to your advisor — actual creator knowledge, not static JSON.

<!-- video embed goes here -->

## Why transcripts?

Models have a training cutoff — usually about two years back. They don't know what Theo said about Node.js last week, or Primeagen's latest Vim take. Download transcripts and inject them, and your advisor gets current knowledge from any creator.

## The bigger picture

Here's where you're headed. Production RAG systems:

- **Chunk** large documents into small pieces
- **Vectorize** each chunk into an array of 512–3072 numbers that captures its *meaning*
- **Store** those vectors in a database like Pinecone
- **Semantic search** — vectorize the question, compare to stored vectors, pull the closest chunks

Today you'll do a simpler version: download full transcripts, inject one when the user asks about that creator.

```match
{
  "title": "Production RAG vs. what you're building",
  "note": "Tap the production concept, then tap your version of it.",
  "pairs": [
    { "left": "Vector database (Pinecone)", "right": "A folder of .txt files" },
    { "left": "Semantic search over embeddings", "right": "Does the message mention 'theo'?" },
    { "left": "Chunking long documents", "right": "Injecting the whole transcript" },
    { "left": "Retrieval pipeline", "right": "fs.readFileSync when relevant" }
  ]
}
```

Same pattern, training wheels on. Every left-side concept exists to fix a limit you're about to feel.

## Download a transcript

Use Google Colab — no local Python setup. New notebook, first cell:

```python
!pip install youtube-transcript-api
```

Second cell (core of it):

```python
from youtube_transcript_api import YouTubeTranscriptApi

def download_transcript(video_id, languages=['en']):
    api = YouTubeTranscriptApi()
    transcript = api.fetch(video_id, languages=languages)
    return " ".join(s.text for s in transcript.snippets)

# The video ID is the part after v= in a YouTube URL:
# https://www.youtube.com/watch?v=X6AR2RMB5tE  ->  X6AR2RMB5tE
print(download_transcript("X6AR2RMB5tE"))
```

Download the `.txt` from Colab's file panel and drop it into your project:

```
ai-advisor/data/transcripts/
  theo.txt
  primogen.txt
  brian.txt
```

Name each file after the advisor.

## Inject it when relevant

```typescript
import fs from 'fs';
import path from 'path';

function getTranscriptForMessage(message: string): string {
	const m = message.toLowerCase();
	if (m.includes('theo')) {
		const p = path.join(process.cwd(), 'data/transcripts/theo.txt');
		if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8');
	}
	// add more advisors as needed
	return '';
}

// in POST, fold the transcript into your system prompt only when present:
const transcript = getTranscriptForMessage(message);
const systemPrompt = `You advise using a knowledge base of coding experts.
${transcript ? `Here is a transcript from the relevant expert:\n${transcript}\n\n` : ''}
If the question is not related to coding, do not try to answer it.`;
```

## The context window problem

You can't dump unlimited text into an LLM. Every model has a **context window** — a hard limit on input size. So: only inject transcripts when relevant, keep them reasonably sized, and never include all of them at once. In production, a vector database retrieves only the most relevant *chunks* instead of whole transcripts.

```quiz
[
  {
    "q": "Why bother with transcripts if the model already 'knows about' these YouTubers?",
    "options": ["Its knowledge stops at the training cutoff — transcripts give it what creators said recently, in their own words", "Transcripts make responses faster", "YouTube's API requires it"],
    "answer": 0,
    "explain": "Cutoffs are ~2 years back. Fresh transcripts are how your advisor knows what Theo said LAST WEEK."
  },
  {
    "q": "Why inject a transcript only when the message mentions that advisor?",
    "options": ["The context window — models cap input size, and irrelevant transcripts waste it", "Reading files is slow in Node.js", "Gemini charges per file"],
    "answer": 0,
    "explain": "Context is scarce. Being selective about what goes in is the whole discipline of RAG — vector databases just automate the selection."
  },
  {
    "q": "Your transcript is 400,000 characters and answers got worse. The production fix?",
    "options": ["Chunk the transcript and retrieve only the pieces relevant to the question", "Ask users for shorter questions", "Find a model with no context limit"],
    "answer": 0,
    "explain": "No model has an infinite (or free) context window. Chunk + retrieve-the-relevant-part is exactly what vector databases are for."
  }
]
```

## Test it

- "What does Theo think about Node.js?"
- "What's Prime's opinion on Vim?"
- "Tell me about Brian's views on testing"

Your advisor now answers using the actual content from those videos.

## The takeaway

- Transcripts are data — YouTube is a goldmine of expert knowledge
- You're now doing RAG with *real* content, not static JSON
- The context window forces you to be selective
- How you structure and name your data matters for retrieval

## Push it further

- **Build YOUR board** — 3–5 creators you actually follow, any field
- **Multiple videos per creator** — pick the most relevant one to inject
- **Topic routing** — detect the topic and pull from several creators
- **Chunking** — split long transcripts, inject only the relevant parts (this is what vector DBs do)

Last step: see these exact concepts running as a real product — and where to take it.

## Work with AI

```ai-prompt
title: Architect my transcript pipeline before I build it
---
I download YouTube transcripts (Colab + youtube-transcript-api), save them as data/transcripts/<advisor>.txt, and inject one into my Gemini prompt when the user's message mentions that advisor. I know the context window is the constraint.

Interview me like a senior engineer reviewing my plan, ONE question at a time: How big are my transcripts vs. my model's context limit? What happens when a question mentions two advisors? None, but is clearly about a topic one covers? How would I split a 90-minute transcript and pick a chunk? After my answers, sketch the simplest design that handles all of it — and tell me which parts a vector database would replace.
```
