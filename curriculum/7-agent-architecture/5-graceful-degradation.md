# Graceful Degradation: When Models Fail

What happens when OpenAI goes down? Or when your primary model is overloaded? Production systems need fallback strategies.

---

## Why This Matters

**Real incidents:**
- OpenAI has experienced multiple outages (some lasting hours)
- Rate limits can spike during high-traffic periods
- Model deprecations happen with limited notice
- Regional issues can affect specific deployments

**The question:** Does your entire application crash, or does it degrade gracefully?

---

## Degradation Strategies

### Strategy 1: Model Fallback Chain

Try your preferred model first, fall back to alternatives:

```typescript
const MODEL_CHAIN = [
  { provider: 'openai', model: 'gpt-4o' },
  { provider: 'openai', model: 'gpt-4o-mini' },
  { provider: 'anthropic', model: 'claude-3-haiku-20240307' },
];

async function generateWithFallback(prompt: string): Promise<string> {
  for (const { provider, model } of MODEL_CHAIN) {
    try {
      return await callModel(provider, model, prompt);
    } catch (error) {
      console.warn(`${provider}/${model} failed, trying next...`);
      continue;
    }
  }
  throw new Error('All models failed');
}
```

**Tradeoffs:**
- Primary model gives best quality
- Fallbacks may be cheaper but lower quality
- User might notice quality difference

### Strategy 2: Provider Redundancy

Same capability across multiple providers:

```typescript
const EMBEDDING_PROVIDERS = {
  primary: {
    provider: 'openai',
    model: 'text-embedding-3-small',
    dimensions: 512,
  },
  fallback: {
    provider: 'cohere',
    model: 'embed-english-v3.0',
    dimensions: 512, // Must match!
  },
};
```

**Critical:** Embedding dimensions must match across providers if sharing a vector index.

### Strategy 3: Cached Responses

For common queries, cache successful responses:

```typescript
async function queryWithCache(query: string): Promise<string> {
  // Check cache first
  const cached = await cache.get(hashQuery(query));
  if (cached) return cached;

  try {
    const response = await generateResponse(query);
    await cache.set(hashQuery(query), response, { ttl: 3600 });
    return response;
  } catch (error) {
    // On failure, try semantic cache match
    const similar = await cache.findSimilar(query, threshold: 0.95);
    if (similar) return similar;
    throw error;
  }
}
```

### Strategy 4: Graceful Feature Reduction

Disable non-critical features when degraded:

```typescript
async function processQuery(query: string) {
  const results = await searchDocuments(query); // Core feature - must work

  let reranked = results;
  try {
    reranked = await rerankResults(results); // Nice-to-have
  } catch (error) {
    console.warn('Reranking unavailable, using raw results');
  }

  let summary;
  try {
    summary = await generateSummary(reranked); // Nice-to-have
  } catch (error) {
    summary = 'Summary unavailable. See results below.';
  }

  return { results: reranked, summary };
}
```

---

## Implementation Pattern: Circuit Breaker

Prevent cascading failures by stopping requests to failing services:

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailure: Date | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private resetTimeout: number = 30000
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure!.getTime() > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = new Date();
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Usage
const openaiBreaker = new CircuitBreaker(5, 30000);

async function callOpenAI(prompt: string) {
  return openaiBreaker.call(() => openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  }));
}
```

**How it works:**
1. **Closed** (normal): Requests pass through
2. **Open** (failing): Requests immediately fail (don't pile on)
3. **Half-open** (testing): Allow one request to test recovery

---

## Error Handling Best Practices

### Distinguish Error Types

```typescript
function isRetryable(error: unknown): boolean {
  if (error instanceof OpenAI.RateLimitError) return true;
  if (error instanceof OpenAI.APIConnectionError) return true;
  if (error instanceof OpenAI.InternalServerError) return true;

  // Don't retry auth errors or bad requests
  if (error instanceof OpenAI.AuthenticationError) return false;
  if (error instanceof OpenAI.BadRequestError) return false;

  return false;
}
```

### Exponential Backoff

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!isRetryable(error) || attempt === maxRetries - 1) {
        throw error;
      }
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## User Communication

**Don't just fail silently.** Tell users what's happening:

```typescript
function getUserMessage(error: unknown): string {
  if (error instanceof OpenAI.RateLimitError) {
    return "We're experiencing high demand. Please try again in a moment.";
  }
  if (error instanceof OpenAI.APIConnectionError) {
    return "We're having trouble connecting. Please check back shortly.";
  }
  return "Something went wrong. We're looking into it.";
}
```

---

## Think About It

1. **Your capstone project**: What's the minimum viable response if your LLM fails?
   - Can you return raw search results without summarization?
   - Can you show a cached response?
   - What message do you show users?

2. **Cost vs. reliability tradeoff**: Running multiple providers costs more. When is it worth it?

3. **Testing failures**: How would you test your fallback logic without waiting for a real outage?

---

## Quick Reference: Degradation Checklist

- [ ] **Fallback models defined** - What's your backup when primary fails?
- [ ] **Timeouts configured** - Don't wait forever for a response
- [ ] **Retries with backoff** - Don't hammer failing services
- [ ] **Circuit breaker** - Stop cascading failures
- [ ] **Error classification** - Retry transient, fail fast on permanent
- [ ] **User messaging** - Communicate status clearly
- [ ] **Monitoring/alerts** - Know when degradation is happening
- [ ] **Cached responses** - Serve stale data when fresh is unavailable

---

## Key Takeaways

1. **Plan for failure** - Every external service will eventually fail
2. **Degrade gracefully** - Partial functionality beats total failure
3. **Communicate clearly** - Users prefer "limited service" to cryptic errors
4. **Test your fallbacks** - Untested fallback code often doesn't work
5. **Monitor degradation** - Know when you're running on backup systems
