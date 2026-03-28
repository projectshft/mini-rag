# Understanding the Chat Interface

You've built the backend - agents, routing, retrieval. Now let's walk through the frontend code to see how it all comes together. The interface is intentionally bare-bones, leaving plenty of room for you to improve it.

---

## Video Walkthrough

Watch this walkthrough of the chat interface:

<iframe src="https://share.descript.com/embed/eGQzTq8Dl4l" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

By the end of this module, you'll understand:

-   How the custom streaming implementation works
-   The two-step flow: agent selection → chat response
-   How messages are managed with React state
-   Where the code can be improved (lots of opportunities!)

---

## The Complete Flow

```
1. User types question
        ↓
2. handleChatSubmit intercepts
        ↓
3. Add user message to UI
        ↓
4. Call /api/select-agent with conversation history
        ↓
5. Get { agent, query } back
        ↓
6. Call /api/chat with agent + query
        ↓
7. Stream response chunks
        ↓
8. Update assistant message as chunks arrive
        ↓
9. Display complete response
```

---

## Documentation Resources

**Fetch API & Streams:**

-   [Fetch API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Basic fetch usage
-   [Streams API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) - Understanding ReadableStream
-   [Using Readable Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams) - Reading stream data

**React Hooks:**

-   [useState Hook](https://react.dev/reference/react/useState) - State management
-   [useEffect Hook](https://react.dev/reference/react/useEffect) - Side effects (auto-scroll)
-   [useRef Hook](https://react.dev/reference/react/useRef) - DOM references

**Alternative Approaches:**

-   [Vercel AI SDK - useChat](https://sdk.vercel.ai/docs/api-reference/use-chat) - Higher-level chat hook
-   [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) - SSE alternative to streams

---

## State Management

Located at: `app/page.tsx` (lines 7-21)

```typescript
// Chat state
const [input, setInput] = useState('');
const [messages, setMessages] = useState<
	Array<{
		id: string;
		role: 'user' | 'assistant';
		content: string;
	}>
>([]);
const [isStreaming, setIsStreaming] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);

// Upload state
const [uploadContent, setUploadContent] = useState('');
const [uploadType, setUploadType] = useState<'urls' | 'text'>('urls');
const [isUploading, setIsUploading] = useState(false);
const [uploadStatus, setUploadStatus] = useState('');
```

**Why this structure?**

**Messages array:**

```typescript
{
  id: string,        // Unique ID for React keys
  role: 'user' | 'assistant',
  content: string    // Message text
}
```

Simple and straightforward. No complex message parts, no metadata. Just the essentials.

**Streaming flag:**

```typescript
const [isStreaming, setIsStreaming] = useState(false);
```

Prevents multiple simultaneous requests and shows loading state.

---

## The Chat Submit Handler

Located at: `app/page.tsx` (lines 84-175)

### Step 1: Prevent Default & Validate

```typescript
const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!input.trim() || isStreaming) return;
```

**Why these checks?**

-   `e.preventDefault()`: Stop form from refreshing page
-   `!input.trim()`: Reject empty or whitespace-only input
-   `isStreaming`: Prevent sending while already processing

### Step 2: Add User Message to UI

```typescript
const userInput = input;
setInput(''); // Clear input immediately for better UX

const userMessage = {
	id: uuidv4(),
	role: 'user' as const,
	content: userInput,
};

setMessages((prev) => [...prev, userMessage]);
```

**Why clear input first?**

-   Makes UI feel more responsive
-   User knows message was received
-   Can start typing next message

**Why `role: 'user' as const`?**
TypeScript needs to know it's the literal type `'user'`, not just `string`.

### Step 3: Select Agent

```typescript
const currentMessages = [
	...messages,
	{ role: 'user' as const, content: userInput },
];

setIsStreaming(true);

const agentResponse = await fetch('/api/select-agent', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ messages: currentMessages }),
});

const { agent, query } = await agentResponse.json();
```

**Key insight:**

```typescript
const currentMessages = [
	...messages, // Previous conversation
	{ role: 'user', content: userInput }, // NEW message
];
```

We build a messages array that includes the current input because:

-   Selector needs full context to route properly
-   Follow-up questions need conversation history
-   Query refinement benefits from context

### Step 4: Stream the Response

```typescript
const response = await fetch('/api/chat', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		messages: currentMessages,
		agent,
		query,
	}),
});

if (!response.ok) {
	console.error('Error from chat API:', await response.text());
	return;
}
```

**Why pass `currentMessages` again?**
The chat route needs conversation history to maintain context in the response.

### Step 5: Create Empty Assistant Message

```typescript
const assistantMessageId = uuidv4();
setMessages((prev) => [
	...prev,
	{
		id: assistantMessageId,
		role: 'assistant',
		content: '', // Start empty!
	},
]);
```

**Why create an empty message?**

-   We'll fill it in as chunks arrive
-   User sees message appear immediately
-   Creates smooth streaming effect

### Step 6: Read the Stream

```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let assistantResponse = '';

if (reader) {
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value);
		assistantResponse += chunk;

		// Update the message with accumulated response
		setMessages((prev) =>
			prev.map((msg) =>
				msg.id === assistantMessageId
					? { ...msg, content: assistantResponse }
					: msg,
			),
		);
	}
}
```

**Breaking it down:**

**Get a reader:**

```typescript
const reader = response.body?.getReader();
```

`getReader()` gives us control over the stream. We can read it chunk by chunk.

**Decode chunks:**

```typescript
const decoder = new TextDecoder();
const chunk = decoder.decode(value);
```

Chunks arrive as `Uint8Array`. TextDecoder converts them to strings.

**Accumulate response:**

```typescript
assistantResponse += chunk;
```

Build up the full response as chunks arrive.

**Update the message:**

```typescript
setMessages((prev) =>
	prev.map((msg) =>
		msg.id === assistantMessageId
			? { ...msg, content: assistantResponse }
			: msg,
	),
);
```

Find the assistant message by ID and update its content. React re-renders, user sees new text.

**Why this works:**

-   Each chunk updates the same message
-   User sees text appear progressively
-   No flashing or jumping

---

## Auto-Scroll to Bottom

Located at: `app/page.tsx` (lines 80-82)

```typescript
useEffect(() => {
	messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

**How it works:**

**1. Ref at the end of messages:**

```typescript
<div ref={messagesEndRef} /> // Placed after all messages
```

**2. Effect runs when messages change:**

```typescript
useEffect(() => {...}, [messages]);
```

**3. Scroll to that ref:**

```typescript
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
```

**Result:** Chat always shows the latest message, with smooth scrolling animation.

---

## Rendering Messages

Located at: `app/page.tsx` (lines 236-264)

```typescript
{
	messages.map((message) => (
		<div
			key={message.id}
			className={`p-3 rounded ${
				message.role === 'user'
					? 'bg-blue-100 ml-8'
					: 'bg-gray-100 mr-8'
			}`}
		>
			<p className='font-semibold mb-1'>
				{message.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
			</p>
			<div className='whitespace-pre-wrap'>{message.content}</div>
		</div>
	));
}
```

**Simple and effective:**

**Visual differentiation:**

-   User messages: blue background, left margin (pushes right)
-   Assistant messages: gray background, right margin (pushes left)

**Content rendering:**

```typescript
<div className='whitespace-pre-wrap'>{message.content}</div>
```

`whitespace-pre-wrap` preserves line breaks and whitespace while still wrapping long lines.

### Loading Indicator

```typescript
{
	isStreaming && !messages[messages.length - 1]?.content && (
		<div className='p-3 rounded bg-gray-100 mr-8'>
			<p className='text-gray-500'>🤔 Thinking...</p>
		</div>
	);
}
```

**Shows "Thinking..." when:**

-   `isStreaming` is true (request in progress)
-   Last message has no content yet (assistant message just created)

**Hides when:**

-   First chunk arrives (content no longer empty)

---

## The Input Form

Located at: `app/page.tsx` (lines 273-288)

```typescript
<form onSubmit={handleChatSubmit} className='flex gap-2'>
	<input
		value={input}
		onChange={(e) => setInput(e.target.value)}
		placeholder='Ask a question about your documents...'
		className='flex-1 p-2 border rounded'
		disabled={isStreaming}
	/>
	<button
		type='submit'
		disabled={isStreaming || !input.trim()}
		className='px-6 py-2 bg-green-600 text-black rounded disabled:bg-gray-400'
	>
		{isStreaming ? 'Sending...' : 'Send'}
	</button>
</form>
```

**Key features:**

**Controlled input:**

```typescript
value={input}
onChange={(e) => setInput(e.target.value)}
```

React manages the input value. This enables clearing it programmatically.

**Disabled during streaming:**

```typescript
disabled = { isStreaming };
```

Prevents typing while processing. User sees button change too.

**Dynamic button text:**

```typescript
{
	isStreaming ? 'Sending...' : 'Send';
}
```

Clear visual feedback about current state.

---

## What's Missing (Improvement Opportunities)

This is a **bare-bones** interface. Here are obvious improvements you could make:

### 1. Error Handling

```typescript
// Currently just console.error
catch (error) {
  console.error('Error in chat:', error);
}

// Could show to user:
setMessages(prev => [...prev, {
  id: uuidv4(),
  role: 'assistant',
  content: '❌ Sorry, something went wrong. Please try again.'
}]);
```

### 2. Conversation Persistence

Currently messages disappear on refresh. Could add:

-   LocalStorage persistence
-   Database storage
-   URL-based conversation IDs

### 3. Message Timestamps

```typescript
<p className='text-xs text-gray-500'>
	{new Date(message.timestamp).toLocaleTimeString()}
</p>
```

### 4. Copy Button for Responses

```typescript
<button onClick={() => navigator.clipboard.writeText(message.content)}>
	📋 Copy
</button>
```

### 5. Markdown Rendering

AI responses often include code blocks and formatting:

```typescript
import ReactMarkdown from 'react-markdown';

<ReactMarkdown>{message.content}</ReactMarkdown>;
```

### 6. Agent Indicator

Show which agent handled the response:

```typescript
<span className='text-xs'>
	{message.agent === 'rag' ? '📚 RAG Agent' : '💼 LinkedIn Agent'}
</span>
```

### 7. **Source References (Your Challenge!)**

For RAG responses, show which documents were used. More on this below...

---

## Your Challenge: Add Source References

When the RAG agent responds, it retrieves documents from Pinecone. Currently, the user has no idea which documents were used. Your task is to display source references.

### What You Need to Do

**1. Modify the RAG Agent to Return Sources**

Update `app/agents/rag.ts` to include source information:

```typescript
// After querying Pinecone:
const sources = queryResponse.matches.map((match) => ({
	title: match.metadata?.title || 'Untitled',
	url: match.metadata?.url || '',
	score: match.score || 0,
}));
```

**2. Pass Sources Through the Chat Route**

The tricky part: `streamText()` returns a text stream. How do you include metadata?

**Hint:** You can:

-   Return sources in a custom header
-   Use a different streaming format that includes metadata
-   Store sources in a separate state/database and reference by message ID
-   Modify the stream to include metadata at the end

**3. Display Sources in the UI**

Add a section below RAG responses:

```typescript
{
	message.role === 'assistant' && message.sources && (
		<div className='mt-3 pt-3 border-t'>
			<p className='text-xs font-semibold mb-2'>📚 Sources:</p>
			{message.sources.map((source, idx) => (
				<a
					key={idx}
					href={source.url}
					className='text-xs text-blue-600 block hover:underline'
					target='_blank'
					rel='noopener noreferrer'
				>
					{source.title} (Score: {source.score.toFixed(2)})
				</a>
			))}
		</div>
	);
}
```

### Hints

**Approach 1: Custom Headers**

```typescript
// In chat route:
const headers = new Headers();
headers.set('X-Sources', JSON.stringify(sources));
return new Response(stream, { headers });

// In frontend:
const sourcesHeader = response.headers.get('X-Sources');
const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];
```

**Approach 2: Append to Stream**

```typescript
// After streaming complete, append metadata:
yield`\n\n__SOURCES__${JSON.stringify(sources)}`;

// In frontend, parse it out:
if (chunk.includes('__SOURCES__')) {
	const [content, sourcesJson] = chunk.split('__SOURCES__');
	// Parse and store sources separately
}
```

**Approach 3: Separate API Call**

```typescript
// Store sources in memory with message ID
// Make a separate /api/sources/:messageId call
// Simpler but requires extra request
```

### Success Criteria

When done, users should see:

1. Regular streaming response as before
2. Below the response, a "Sources" section
3. Clickable links to the documents used
4. Relevance scores for each source
5. Only shown for RAG responses (not LinkedIn)

**Time estimate:** 1-2 hours

---

## Testing Your Interface

### Test 1: Basic Chat Flow

1. Upload a document
2. Ask a question
3. See message appear immediately
4. See "Thinking..." indicator
5. See response stream in word by word
6. Verify auto-scroll to bottom

### Test 2: Agent Routing

Ask different types of questions:

-   "Explain React hooks" → RAG agent
-   "Help me write a LinkedIn post" → LinkedIn agent

Check console logs to see which agent was selected.

### Test 3: Conversation Context

```
You: "What are React hooks?"
AI: [explains hooks]
You: "Give me an example"  ← Should understand context
AI: [provides hook example]
```

### Test 4: Edge Cases

-   Submit empty message (should be blocked)
-   Rapid clicking submit (should be blocked during streaming)
-   Long responses (should handle scrolling)
-   Error responses (check console logs)

### Test 5: Source References (After Challenge)

1. Ask a RAG question
2. Verify sources appear below response
3. Click source links (should open in new tab)
4. Check relevance scores make sense

---

## What You've Learned

Now you understand:

-   ✅ Custom streaming implementation with fetch + ReadableStream
-   ✅ Two-step agent selection + response flow
-   ✅ React state management for chat messages
-   ✅ Auto-scrolling with useRef and useEffect
-   ✅ Where the interface can be improved

---

## What's Next

**Congratulations!** You've built a complete RAG system:

-   ✅ Document upload and vectorization
-   ✅ Agent architecture with routing
-   ✅ Fine-tuned LinkedIn agent
-   ✅ RAG agent with retrieval and re-ranking
-   ✅ Streaming chat interface

**Optional next modules:**

-   **Module 12:** Observability with Helicone
-   **Module 13:** Testing your agents

---
