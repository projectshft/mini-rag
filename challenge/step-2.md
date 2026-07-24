# Give It a Personality

**Time:** ~20 min · Hands-on

> **The goal:** add a system prompt so your advisor stays in its lane instead of answering random questions about wine or the weather.

<iframe src="https://share.descript.com/embed/KUooyjeVWNS" width="640" height="360" frameborder="0" allowfullscreen></iframe>

## The problem

Your chatbot works, but it's **too helpful**. Ask it about the weather in France? It'll tell you. Ask it to solve a linked list problem? Sure! Remember Chipotle's chatbot that ended up helping people with coding interviews? Yeah — don't be Chipotle.

For a real product, you want the AI to have a role and to know when to say "that's not my job."

## What's a system prompt?

Instructions you give the AI **before** the user's message. Think of it like Single Responsibility Principle, but for your AI:

- **Who am I?** — "You are an AI mentor who understands RAG and agents"
- **What do I do?** — "You only answer questions related to coding"
- **What do I NOT do?** — "If it's not about coding, say you're not sure"
- **Constraints?** — "You only use TypeScript in code examples"

```match
{
  "title": "Match each line to its job",
  "note": "Tap a line, then tap the role it plays.",
  "pairs": [
    { "left": "You are an AI mentor who understands RAG and agents", "right": "Who am I? — identity & expertise" },
    { "left": "You only answer questions related to coding", "right": "What do I do? — the lane" },
    { "left": "If it's not about coding, say you're not sure", "right": "What do I NOT do? — the guardrail" },
    { "left": "You only use TypeScript in code examples", "right": "Constraints — output rules" }
  ]
}
```

## Add it to your route

Drop a system prompt in front of the user's message:

```typescript
const SYSTEM_PROMPT = `
You are an AI mentor that understands RAG, agents, and other advanced AI concepts.
You only answer questions related to coding.
You only use TypeScript in your responses for code examples.
If the question is not related to coding, say that you are not sure and do not try to answer it.
`;

const userResponse = await model.generateContent(
	`${SYSTEM_PROMPT}\n\n User message: ${message}`
);
```

The `${SYSTEM_PROMPT}\n\n User message: ${message}` format helps the model tell your instructions apart from the user's input.

## Test it

- "Tell me about France's wine selection" → should politely decline
- "Tell me about using Pinecone as a vector database" → should give a helpful, TypeScript-focused answer

## Why this matters

**Guardrails save money.** Every off-topic question you answer costs tokens on production models. **Guardrails prevent embarrassment.** You don't want your roofing-company chatbot explaining dynamic programming.

```quiz
[
  {
    "q": "Why does a long, rule-stuffed system prompt often perform WORSE?",
    "options": ["Cognitive overload — too many instructions degrade the model's ability to follow any of them", "Longer prompts cost less so the model tries less", "System prompts have a hard 100-word limit"],
    "answer": 0,
    "explain": "Same as code: single responsibility wins. Give the AI one job and state it tightly."
  },
  {
    "q": "Your bot happily answers 'Tell me about France's wine.' What's missing from the prompt?",
    "options": ["An explicit instruction for what NOT to do and how to decline", "A bigger model", "More example wine questions"],
    "answer": 0,
    "explain": "Models default to helpful. If you don't spell out the off-limits behavior, they'll answer everything."
  }
]
```

## A note on memory

Right now every message starts fresh — the AI forgets what you asked 30 seconds ago, like the fish from Finding Nemo. You *can* add history with Gemini's `startChat()`, but we're keeping it simple. Something to explore on your own.

## The takeaway

- System prompts control personality, expertise, and constraints
- Think SRP — what's this AI's single job?
- Explicitly say what it should NOT do
- Guardrails save money and prevent embarrassment

## Push it further

- **New persona:** a sarcastic code reviewer, a patient beginner tutor, a strict senior who only approves clean code.
- **Jailbreak detection:** catch "ignore your instructions and…" attempts and respond appropriately.
- **Add memory:** wire up `startChat()` with a history array. The Finding Nemo fish deserves better.

Next: our advisor stays in its lane, but only knows its training data. Let's give it a knowledge base.

## Work with AI

```ai-prompt
title: Red-team my system prompt
---
Here's my AI advisor's system prompt: it says the AI is a coding mentor, only answers coding questions, only uses TypeScript in examples, and says "I'm not sure" for anything off-topic.

Play a mischievous user trying to break it. Throw 5 messages at me ONE AT A TIME — off-topic questions, roleplay tricks, "ignore your instructions" attempts, half-coding-half-not questions. For each, I'll say what I think my AI does; you tell me what it PROBABLY actually does and how to patch the prompt. End with a hardened version.
```
