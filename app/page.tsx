"use client";

import { useState, type FormEvent } from "react";

interface Source {
  id: string;
  title: string;
  text: string;
  score: number;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [pasted, setPasted] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    const docs = pasted.trim() ? [{ title: "Pasted document", text: pasted }] : undefined;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, docs }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setAnswer(data.answer);
      setSources(data.sources);
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Docs Q&amp;A</h1>
      <p className="muted">
        Ask a question about the sample docs in <code>/data</code>, or paste your own text below.
      </p>

      <form onSubmit={onSubmit}>
        <label htmlFor="pasted">Your document (optional)</label>
        <textarea
          id="pasted"
          rows={6}
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          placeholder="Leave empty to use the sample docs."
        />

        <label htmlFor="question">Question</label>
        <div className="row">
          <input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="How long is the refund window?"
          />
          <button type="submit" disabled={loading || !question.trim()}>
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {answer && (
        <section>
          <h2>Answer</h2>
          <p className="answer">{answer}</p>
        </section>
      )}

      {sources.length > 0 && (
        <section>
          <h2>Sources</h2>
          <ol>
            {sources.map((s) => (
              <li key={s.id}>
                <strong>{s.title}</strong> <span className="muted">(score {s.score})</span>
                <p className="snippet">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
