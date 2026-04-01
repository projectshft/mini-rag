import { AgentRequest, AgentResponse } from "./types";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { traceable } from "langsmith/traceable";

const generatePost = traceable(
  async (modelId: string, systemPrompt: string, prompt: string) => {
    return streamText({
      model: openai(modelId),
      system: systemPrompt,
      prompt,
    });
  },
  { name: "generate-post", run_type: "llm" },
);

export const linkedInAgent = traceable(
  async (request: AgentRequest): Promise<AgentResponse> => {
    const modelId = process.env.OPENAI_FINETUNED_MODEL;
    if (!modelId) throw new Error("couldn't get model id");

    const systemPrompt = `You are a LinkedIn agent. Analyze the users refined query and create a unique Linkedin post.

Your task:
1. analyze the query
2. identify the topic for the post
3. create a unique post for the topic
4. return the new post.`;

    const prompt = `
    Original User Request: ${request.originalQuery}
    Refined Query: ${request.query}
  `;

    return { stream: await generatePost(modelId, systemPrompt, prompt) };
  },
  { name: "linkedin-agent", run_type: "chain" },
);
