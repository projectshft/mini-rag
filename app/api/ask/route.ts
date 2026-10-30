import { NextResponse } from "next/server";
import { z } from "zod";
import { chunkDocuments, type Doc } from "@/lib/chunking";
import { loadSampleDocs } from "@/lib/docs";
import { askModel } from "@/lib/llm";
import { retrieve } from "@/lib/retrieve";

export const runtime = "nodejs";

const AskRequest = z.object({
  question: z.string().trim().min(1, "Question is required").max(1000),
  docs: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(200),
        text: z.string().max(50_000),
      }),
    )
    .max(20)
    .optional(),
  topK: z.number().int().min(1).max(10).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });
  }

  const parsed = AskRequest.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const { question, topK = 3 } = parsed.data;
  const docs: Doc[] = parsed.data.docs?.length
    ? parsed.data.docs.map((d, i) => ({ id: `pasted-${i + 1}`, title: d.title, text: d.text }))
    : await loadSampleDocs();

  const sources = retrieve(question, chunkDocuments(docs), topK);
  if (sources.length === 0) {
    return NextResponse.json({
      answer: "I couldn't find anything in the documents that matches that question.",
      sources: [],
    });
  }

  try {
    const answer = await askModel(question, sources);
    return NextResponse.json({
      answer,
      sources: sources.map(({ id, title, text, score }) => ({ id, title, text, score })),
    });
  } catch (error) {
    console.error("askModel failed", error);
    const message = error instanceof Error ? error.message : "Model call failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
