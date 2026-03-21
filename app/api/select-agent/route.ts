import { NextRequest, NextResponse } from "next/server";
import { openaiClient } from "@/app/libs/openai/openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { agentTypeSchema, messageSchema } from "@/app/agents/types";
import { agentConfigs } from "@/app/agents/config";

const selectAgentSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

const agentSelectionSchema = z.object({
  agent: agentTypeSchema,
  query: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = selectAgentSchema.parse(body);
    const { messages } = parsed;

    // Take last 5 messages for context
    const recentMessages = messages.slice(-5);

    // Build agent descriptions from config
    const agentDescriptions = Object.entries(agentConfigs)
      .map(([key, config]) => `- "${key}": ${config.description}`)
      .join("\n");

    // TODO: Step 1 - Call OpenAI with structured output
    // Use openaiClient.responses.parse()
    // Model: 'gpt-4o-mini'
    // Input: array of messages with:
    //   - System message explaining you're an agent router
    //   - Include agentDescriptions in the system message
    //   - ...recentMessages (spread the user's messages)
    // Text format: use zodTextFormat(agentSelectionSchema, 'agentSelection')
    const response = await openaiClient.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `You are an agent router. Analyze the users query and select either ‘linkedin’ or ‘rag’ based on the users intent. 
		  these are the agents you can choose from:
${agentDescriptions}

The query should be focused on the user's most recent message, but you can use the previous messages for context.
		  The query should be:
- Clear and specific
- Remove conversational words like "hey", "um", "please"
- Focus on the core question
- Use proper technical terms
- Keep it concise (under 10 words when possible).`,
        },
        {
          role: "user",
          content: recentMessages[0].content,
        },
        ...recentMessages,
      ],
      text: {
        format: zodTextFormat(agentSelectionSchema, "agentSelection"),
      },
      temperature: 0.0,
    });
    console.log("Raw response from OpenAI:", response.output_parsed);
    if (!response.output_parsed) {
      return NextResponse.json({
        agent: "rag",
        query: recentMessages[recentMessages.length - 1].content,
      });
    }
    // TODO: Step 2 - Extract the parsed output
    // The response has an output_parsed field
    // This will contain { agent, query }
    const { agent, query } = response.output_parsed;

    // TODO: Step 3 - Return the result
    // If output has both agent and query, return them
    // Otherwise, return a fallback: { agent: 'rag', query: last message content }

    return NextResponse.json({
      agent: agent,
      query: query,
    });
  } catch (error) {
    console.error("Error selecting agent:", error);
    return NextResponse.json(
      { error: "Failed to select agent" },
      { status: 500 },
    );
  }
}
