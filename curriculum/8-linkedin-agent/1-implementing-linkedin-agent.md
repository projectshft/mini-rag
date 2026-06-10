# LinkedIn Agent

Now we'll implement an agent that uses **few-shot prompting** to respond in a specific LinkedIn voice with streaming responses.

---

> **Note on Fine-Tuning**
>
> This agent was originally built on a fine-tuned model. OpenAI deprecated fine-tuning (May 2026), so we now use **few-shot prompting** instead: we show the model a handful of real example posts in the prompt and ask it to imitate their style.
>
> This is how style transfer is done with modern models anyway — "context is all you really need." The fine-tuning module (`6-fine-tuning/`) covers the old approach conceptually.

---

## Video Walkthrough

Watch this guide to implementing the LinkedIn agent:

<iframe src="https://share.descript.com/embed/oSYwAxsn4AO" width="640" height="360" frameborder="0" allowfullscreen></iframe>

> The video shows the original fine-tuned model version. The agent structure (system prompt + `streamText()`) is the same — only the model and the style examples have changed.

---

## What You'll Build

An agent that:

-   Uses **few-shot prompting** to lock in a writing style — no custom model needed
-   Streams responses for a better user experience
-   Writes LinkedIn posts in a voice you choose

## How Few-Shot Prompting Works

Instead of training a model on hundreds of examples (fine-tuning), you paste a few examples directly into the prompt and tell the model to imitate them:

-   **Clear instructions** — what the post should achieve and what to imitate (tone, structure, formatting)
-   **A few example posts** — 3-5 is plenty; the model infers the voice from them
-   **The user's request** — the topic for the new post

This is faster to iterate on than fine-tuning: change an example, re-run, done.

## Implementation Steps

The agent implementation is in `app/agents/linkedin.ts`.

### 1. Pick Your Example Posts

The repo includes `data/brian_posts.csv` — 850+ real LinkedIn posts from Brian with engagement stats (impressions, reactions, comments).

Three of those posts are already wired up as defaults in `app/agents/example-posts.ts`. You can:

-   **Keep the defaults** — they're high-engagement posts with three different formats (story, list, short take)
-   **Pick your own from the CSV** — sort by `numImpressions` to find what performed best
-   **Use a creator you like** — paste in posts from anyone whose style you want to copy

Whatever you choose, pick examples with **different formats** so the model learns the voice, not a single template.

### 2. Implement the Agent

Your agent needs to:

1. **Build an examples block** from the posts in `app/agents/example-posts.ts`
2. **Build a system prompt** that tells the model to imitate the style (not the content) of the examples
3. **Include the user's request** — the original query and refined query from the selector agent
4. **Use `streamText()`** from the Vercel AI SDK to stream the response

The TODOs in `app/agents/linkedin.ts` guide you through each step.

## Key Concepts

### Few-Shot Prompting with Streaming

Here's the solution:

```typescript
import { EXAMPLE_POSTS } from './example-posts';

const examples = EXAMPLE_POSTS.map(
	(post, i) => `--- Example Post ${i + 1} ---\n${post}`
).join('\n\n');

const systemPrompt = `You are a professional LinkedIn copywriter who creates high-engagement posts.

Study the example posts below and match their voice, tone, structure, and formatting (short punchy lines, line breaks between thoughts, occasional lists and emphasis). Do NOT copy their content — only their style.

${examples}

Original user request: "${request.originalQuery}"
Refined query: "${request.query}"

Use the refined query to understand the user's intent and write a new LinkedIn post on that topic in the style of the examples.`;

return streamText({
	model: openai('gpt-4o'),
	system: systemPrompt,
	messages: request.messages,
});
```

Key points:

-   Return the `streamText()` result directly (no need to call additional methods or await)
-   The **examples go in the system prompt** — the model treats them as style reference, not conversation history
-   "Imitate the style, not the content" matters — without it, the model will recycle topics from the examples
-   A standard model (`gpt-4o`) replaces the fine-tuned model — the examples do the work the training data used to do

### Tuning the Output

If the output doesn't sound right:

-   **Add more examples** — 1-2 more posts can sharpen the voice
-   **Vary your examples** — if all your examples are stories, the model will always tell stories
-   **Tighten the instructions** — e.g. "keep it under 150 words", "end with a question"

### When Would Fine-Tuning Still Make Sense?

Conceptually (covered in `6-fine-tuning/`): an extremely niche domain few examples can't capture, very high-volume generation where prompt tokens cost more than training, or a style that drifts with few-shot. For a personal LinkedIn agent, few-shot prompting wins on every axis that matters: speed, cost, and iteration time.

## Resources

-   [Vercel AI SDK - streamText](https://sdk.vercel.ai/docs/ai-core/stream-text)
-   [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

## Testing

Once implemented, the selector agent will route requests to generate LinkedIn posts to this LinkedIn agent automatically. Try the same topic with different example posts swapped in — the change in voice should be obvious.
