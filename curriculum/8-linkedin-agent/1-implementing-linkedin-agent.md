# LinkedIn Agent

Now that we have your fine-tuned model, we'll implement an agent that uses it to respond in your personal LinkedIn style with streaming responses.

---

## Video Walkthrough

Watch this guide to implementing the LinkedIn agent:

<iframe src="https://share.descript.com/embed/oSYwAxsn4AO" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Build

An agent that:

-   Uses your fine-tuned model
-   Streams responses for a better user experience
-   Responds in your personal conversational style

## Implementation Steps

The agent implementation is in `app/agents/linkedin.ts`.

### 1. Configure Your Fine-Tuned Model

Add your fine-tuned model ID to your `.env.local`:

```bash
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:your-org:your-model:id
```

You can find this ID in your OpenAI dashboard under Fine-tuning, or from the API response when you created the fine-tune.

### 2. Implement the Agent

Your agent needs to:

1. **Get the model ID** from environment variables (`process.env.OPENAI_FINETUNED_MODEL`)
2. **Build a system prompt** that defines the agent's role as a LinkedIn copywriter
3. **Use `prompt`** to provide the user's original request and refined query as context
4. **Use `streamText()`** from the Vercel AI SDK to stream the response

The TODOs in `app/agents/linkedin.ts` guide you through each step.

## Key Concepts

### Streaming Responses with Prompt

Using `streamText()` provides a better user experience by showing the response as it's generated. Here's the solution:

```typescript
return streamText({
	model: openai(process.env.OPENAI_FINETUNED_MODEL!),
	system: 'You are a professional linkedin copywriter to create high engagement linkedin posts',
	prompt: `
    Original User Request: ${_request.originalQuery}
    Refined Query: ${_request.query}
  `,
});
```

Key points:

-   Return the `streamText()` result directly (no need to call additional methods or await)
-   Use **`prompt`** (not `messages`) to provide context - this is simpler for single-turn agent responses
-   The `prompt` includes both the original user request and the refined query from the selector agent
-   The `system` parameter sets the agent's role and behavior
-   The fine-tuned model is passed using `openai(process.env.OPENAI_FINETUNED_MODEL!)`

## Resources

-   [Vercel AI SDK - streamText](https://sdk.vercel.ai/docs/ai-core/stream-text)
-   [OpenAI Fine-tuning Guide](https://platform.openai.com/docs/guides/fine-tuning)

## Testing

Once implemented, the selector agent will route requests to generate LinkedIn posts to this LinkedIn agent automatically.
