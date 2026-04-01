import { z } from "zod";
import { agentTypeSchema, messageSchema } from "@/app/agents/types";
import { getAgent } from "@/app/agents/registry";
import { NextResponse } from "next/server";

const chatSchema = z.object({
  messages: z.array(messageSchema),
  agent: agentTypeSchema,
  query: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = chatSchema.parse(body);
    const { messages, agent, query } = parsed;

    // Get original user query (last message)
    const lastMessage = messages[messages.length - 1];
    const originalQuery = lastMessage?.content || query;

    // Get the agent executor from registry
    const agentExecutor = getAgent(agent);

    // Execute agent and get streamed response
    const { stream, sources } = await agentExecutor({
      type: agent,
      query,
      originalQuery,
      messages,
    });
    const streamResponse = stream.toTextStreamResponse();
    if (sources) {
      console.log(sources);
      const headers = new Headers(streamResponse.headers);
      headers.set("X-Sources", encodeURIComponent(JSON.stringify(sources)));
      return new NextResponse(streamResponse.body, { headers });
    }

    return streamResponse;
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
