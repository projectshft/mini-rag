import { searchDocuments } from "@/app/libs/pinecone";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, topK = 5 } = body;

    if (!query || typeof query !== "string") {
      console.error("Query is required for RAG search");
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
    const results = await searchDocuments(query, topK);

    const formattedResults = results.map((doc) => ({
      id: doc.id,
      score: doc.score,
      content: doc.metadata?.text || "",
      source: doc.metadata?.source || "unknown",
      chunkIndex: doc.metadata?.chunkIndex,
      totalChunks: doc.metadata?.totalChunks,
    }));

    return NextResponse.json({
      query,
      resultsCount: formattedResults.length,
      results: formattedResults,
    });
  } catch (error) {
    console.error("❌ Error in RAG test route:", error);
    return NextResponse.json(
      { error: "Failed to perform RAG search" },
      { status: 500 },
    );
  }
}
