"use client";

import { useState } from "react";

interface SearchResult {
  caption: string;
  youtube_url: string;
  similarity: number;
}

export default function MusicSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5001/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data.results);
    } catch (e) {
      setError("Failed to connect. Is the Python server running? (python scripts/music-search-server.py)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Music Search</h1>
        <p className="text-gray-600 mb-6">
          Search using natural language. Powered by CLAP audio embeddings.
        </p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="e.g., chill lo-fi beats for studying"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={search}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {results.map((result, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">#{i + 1}</span>
                <span className="text-green-600 font-medium">
                  {(result.similarity * 100).toFixed(1)}% match
                </span>
              </div>
              <p className="text-gray-700 mb-3">{result.caption}</p>
              <a
                href={result.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Listen on YouTube
              </a>
            </div>
          ))}
        </div>

        {results.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 mt-8">
            <p>Try searching for:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                "sad piano ballad",
                "aggressive metal",
                "jazz saxophone",
                "upbeat electronic",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setQuery(example);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
