import { AgentRequest, AgentResponse } from "./types";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function linkedInAgent(
  request: AgentRequest,
): Promise<AgentResponse> {
  // TODO: Step 1 - Get the fine-tuned model ID
  // Access process.env.OPENAI_FINETUNED_MODEL
  // If not configured, you might want to throw an error or use a fallback
  const modelId = process.env.OPENAI_FINETUNED_MODEL;
  if (!modelId) throw new Error("couldn't get model id");

  // TODO: Step 2 - Build the system prompt
  // Include instructions for the LinkedIn agent
  // Add context about the original and refined queries:
  //   - request.originalQuery - what the user originally asked
  //   - request.query - the refined/improved version
  // Tell the model to create engaging LinkedIn posts
  const systemPrompt = `You are a LinkedIn agent. Analyze the users refined query and create a unique Linkedin post.

Your task:
1. analyze the query
2. identify the topic for the post
3. create a unique post for the topic 
4. return the new post.`;
  // TODO: Step 3 - Stream the response
  // Use streamText() from the 'ai' package
  // Pass the model using openai()
  // Include system prompt and messages from request.messages
  // Return the stream

  return streamText({
    model: openai(modelId),
    system: systemPrompt,
    prompt: `
    Original User Request: ${request.originalQuery}
    Refined Query: ${request.query}
  `,
  });
}
