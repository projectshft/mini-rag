# Curriculum Authoring Guide

Every day file follows the same shape so the course reads in one voice and
the site can parse it. This doc is the spec. The exemplar is
[day-01.md](./day-01.md) — read it before writing or editing any day.

## File format

One file per study day: `day-NN.md` (zero-padded). Rest days have no file —
they're plain lines in README.md's Week index.

```markdown
# Day N — Title of the Day

**Time:** ~60 min · Hands-on

> **Today:** one or two sentences setting up what the student will do and why it matters.

...lesson content...

## ✅ Key takeaways

- three to five bullets, each a claim the student should be able to defend

## 🤖 Work with AI

(one or two ai-prompt blocks — see below)
```

Rules:

- The first `# ` heading and the `**Time:**` line are parsed into page
  chrome (title, badges). Everything after the Time line is the body.
- `**Time:**` values: `~45 min · Read + Watch`, `~60 min · Hands-on`,
  `~90 min · Build`, etc. Keep the `·` separator.
- Keep the Descript video iframes exactly as they are in the source
  lessons: `<iframe src="https://share.descript.com/embed/..." ...></iframe>`.
  They render responsive automatically — don't wrap them.
- Keep Typeform submission links exactly as-is on assignment days.
- Voice: direct, practical, working-engineer-to-working-engineer. No fluff.

## Links

- **Code references** → link to the student branch on GitHub:
  `https://github.com/projectshft/mini-rag/blob/student-todo-exercises/app/agents/rag.ts`
- **Other days** → `/learn/day-NN` (absolute path, works in the app).
- Never link to `curriculum/` module paths (they don't exist on the site)
  or leave relative `../module/lesson.md` links behind.

## Interactive blocks

Four special fences render as interactive islands (see
`components/lms/LessonMarkdown.tsx`):

### 1. Quiz — self-check questions

```` ```quiz ````
```json
[
  {
    "q": "Why do we chunk documents before embedding them?",
    "options": ["Embeddings have input limits and retrieval needs focused pieces", "Pinecone requires it", "It makes the text smaller on disk"],
    "answer": 0,
    "explain": "Retrieval returns chunks — smaller, focused chunks mean the LLM sees exactly the relevant context."
  }
]
```
The fence body is a JSON array. 2–4 questions per day, placed after the
main concept lands (not at the very end). Wrong options should be
*plausible* — the mistakes people actually make.

### 2. AI prompt — copyable prompts (the "AI-first" layer)

```` ```ai-prompt ````
```
title: Quiz me on today's material
---
You are my strict-but-friendly tutor. I just finished a lesson on <topic>.
Ask me 5 questions about it, ONE AT A TIME, waiting for my answer before
continuing. Start easy, get harder. If I'm wrong, don't give the answer —
give a hint and let me retry once. At the end, list the concepts I was
shaky on and explain each in two sentences.
```
The part before `---` is `title:`; the rest is the prompt students copy
into Claude. Every day ends with a `## 🤖 Work with AI` section holding
1–2 of these. Good patterns: "quiz me", "explain it back to me and poke
holes", "help me extend this exercise", "generate harder test cases".
Make prompts *specific to the day's content* — name the files, the
concepts, the exact exercise. Generic prompts are worthless.

### 3. Visual — embedded interactive explainer

```` ```visual ````
```
vector-search | Watch a query find its neighbors
```
Body = filename in `public/visuals/` without `.html`, optional `| caption`.
Only reference visuals that exist.

### 4. Order — tap-the-steps-in-order exercise

```` ```order ````
```
title: Put the RAG pipeline in order
---
Chunk the documents
Embed each chunk
Upsert vectors to Pinecone
Embed the user's question
Query Pinecone for nearest neighbors
Feed retrieved chunks + question to the LLM
```
Lines after `---` are the correct order; the component presents them
shuffled and students tap them into place. Use for *processes* (pipelines,
request flows, algorithms) — 4–6 steps, each short enough to read as a
pill. Don't use it where order is arbitrary or debatable.

### 5. Scenario — "what do you say?" workplace exercises

```` ```scenario ````
```json
{
  "who": "Your manager",
  "setting": "Sprint planning. The vector DB line item is being questioned.",
  "ask": "Why don't we just fine-tune a model on our docs instead of building all this RAG stuff?",
  "note": "More than one answer is defensible — pick the one YOU'D say.",
  "options": [
    { "text": "…", "verdict": "best", "feedback": "…" },
    { "text": "…", "verdict": "ok", "feedback": "…" },
    { "text": "…", "verdict": "weak", "feedback": "…" }
  ],
  "debrief": "Optional wrap-up shown after any pick."
}
```
The consultant-training island: a coworker asks a nebulous question, the
student picks the reply they'd actually give, gets a graded verdict
(`best` / `ok` / `weak`) with feedback, and can reveal how the other
replies land. Rules for writing good ones:

- **The ask must be something people actually say** ("why don't we just
  fine-tune?", "we should add tool calling", "these docs are stale — now
  what?"). Never quiz-question phrasing.
- **3–4 options, all plausible.** `weak` options are things a smart person
  might say that don't survive follow-up questions — never strawmen.
  Sometimes every option is defensible; the verdicts explain which is
  *strongest for this use case* and why.
- **Feedback teaches the reasoning, not the label** — it should read like
  a staff engineer explaining what lands with a manager and what invites
  the next hard question.
- Ephemeral: not persisted, resets on reload. Marking the day done is the
  only persistence.

### 6. Match — tap-to-match pairs

```` ```match ````
```json
{
  "title": "Match the chunking strategy to the content",
  "note": "Tap a row, then tap its match.",
  "pairs": [
    { "left": "Confluence pages with clean headings", "right": "Structure-aware: split on headings" },
    { "left": "Scanned PDF contracts", "right": "OCR first, then sentence-aware chunks" }
  ]
}
```
3–6 pairs. `left` = the situation, `right` = the technique/answer. Rights
must be mutually exclusive (no two rights that both fit one left). Correct
matches lock in on check; wrong ones return to the pool.

### 7. Mermaid — diagrams

Standard ```` ```mermaid ```` fences render as diagrams.

## Hints & reveals (toggle-able code)

Use `<details>` blocks for anything the student should *try before seeing*:
hints, solutions, expected output. Blank line after `<summary>` is required
(it lets the markdown inside render):

```html
<details>
<summary>💡 Hint 1 — what shape does the selector return?</summary>

The selector returns a *name*, not a result. Look at the `AgentName` type.

</details>

<details>
<summary>✅ Solution — don't open until you've tried</summary>

​```typescript
// working code here
​```

</details>
```

Convention: `💡 Hint N — <nudge>` for hints (escalating), `✅ Solution` for
full answers, `🔍 Expected output` for what running it should print.
Lessons that hand students big code blocks inline should be converted to
try-first + reveal.

## Assignment days (🎥)

Assignment days keep: what to build, the exact files to touch (linked to
the student branch), the video requirements (3–4 min, Feynman-style), and
the **Typeform submission links unchanged**. Remind students they can post
in Slack for feedback.
