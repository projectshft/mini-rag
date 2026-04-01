"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      sources?: { title: string; url: string; score: number }[];
    }>
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [uploadContent, setUploadContent] = useState("");
  const [uploadType, setUploadType] = useState<"urls" | "text">("urls");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleUpload = async () => {
    if (!uploadContent.trim()) return;

    setIsUploading(true);
    setUploadStatus("");

    try {
      if (uploadType === "urls") {
        // Upload URLs
        const urls = uploadContent
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean);

        const response = await fetch("/api/upload-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls }),
        });

        const data = await response.json();

        if (response.ok) {
          setUploadStatus(
            `✅ Success! Uploaded ${data.vectorsUploaded} vectors`,
          );
          setUploadContent("");
        } else {
          setUploadStatus(`❌ Error: ${data.error}`);
        }
      } else {
        // Upload raw text
        const response = await fetch("/api/upload-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: uploadContent }),
        });

        const data = await response.json();

        if (response.ok) {
          setUploadStatus(
            `✅ Success! Uploaded ${data.vectorsUploaded} vectors from text`,
          );
          setUploadContent("");
        } else {
          setUploadStatus(`❌ Error: ${data.error}`);
        }
      }
    } catch {
      setUploadStatus("❌ Failed to upload content");
    } finally {
      setIsUploading(false);
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userInput = input;
    setInput("");

    // Add user message to UI
    const userMessage = {
      id: uuidv4(),
      role: "user" as const,
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Build messages array including current input for API
    const currentMessages = [
      ...messages,
      { role: "user" as const, content: userInput },
    ];

    setIsStreaming(true);
    // Create a new assistant message
    const assistantMessageId = uuidv4();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ]);

    try {
      // Step 1: Select agent and get summarized query
      const agentResponse = await fetch("/api/select-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages }),
      });

      const { agent, query } = await agentResponse.json();

      // Step 2: Make direct API call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: currentMessages,
          agent,
          query,
        }),
      });

      if (!response.ok) {
        console.error("Error from chat API:", await response.text());
        return;
      }

      // Get the response stream and process it
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantResponse += chunk;

          // Update the assistant message with the accumulated response
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: assistantResponse }
                : msg,
            ),
          );
        }
        const rawSources = response.headers.get("x-sources");

        const sources = rawSources
          ? JSON.parse(decodeURIComponent(rawSources))
          : [];

        // After stream is done, attach sources
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, sources } : msg,
          ),
        );
        console.log(messages);
      }
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mini RAG Chat</h1>

      {/* Upload Section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Upload Content</h2>

        {/* Toggle between URLs and Text */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setUploadType("urls")}
            className={`px-4 py-2 rounded ${
              uploadType === "urls"
                ? "bg-blue-600 "
                : "bg-gray-200 text-gray-700"
            }`}
          >
            URLs
          </button>
          <button
            onClick={() => setUploadType("text")}
            className={`px-4 py-2 rounded ${
              uploadType === "text"
                ? "bg-blue-600 "
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Raw Text
          </button>
        </div>

        <textarea
          value={uploadContent}
          onChange={(e) => setUploadContent(e.target.value)}
          placeholder={
            uploadType === "urls"
              ? "Enter URLs (one per line)\nExample:\nhttps://react.dev/learn\nhttps://react.dev/reference/react/useState"
              : "Paste your text content here...\n\nThis can be documentation, articles, or any text you want to query."
          }
          className="w-full p-2 border rounded mb-2 h-32"
          disabled={isUploading}
        />
        <button
          onClick={handleUpload}
          disabled={isUploading || !uploadContent.trim()}
          className="px-4 py-2 bg-blue-600 text-black rounded disabled:bg-gray-400"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
      </div>

      {/* Chat Section */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Chat with Your Documents</h2>

        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              <p className="mb-2">👋 Welcome to Mini RAG!</p>
              <p className="text-sm">
                Upload some documents above, then ask questions about them.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded ${
                message.role === "user"
                  ? "bg-blue-100 ml-8"
                  : "bg-gray-100 mr-8"
              }`}
            >
              <p className="font-semibold mb-1">
                {message.role === "user" ? "👤 You" : "🤖 AI Assistant"}
              </p>
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Sources
                    </p>
                    <ul className="space-y-1">
                      {message.sources.map((source, i) => (
                        <li key={i}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {source.title || source.url}
                          </a>
                          <span className="ml-3">
                            SCORE: {source.score?.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
          {isStreaming && !messages[messages.length - 1]?.content && (
            <div className="p-3 rounded bg-gray-100 mr-8">
              <p className="text-gray-500">🤔 Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 p-2 border rounded"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-6 py-2 bg-green-600 text-black rounded disabled:bg-gray-400"
          >
            {isStreaming ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
