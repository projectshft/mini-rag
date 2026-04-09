# Introduction to Web Scraping for RAG

Before we can build our RAG system, we need data. Lots of it. This module covers how to ethically scrape web content to populate your vector database.

---

## Video Walkthrough

Watch this introduction to web scraping:

<iframe src="https://share.descript.com/embed/IKKjh70RIgn" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

-   What web scraping is and why it's important for RAG
-   Ethical scraping practices
-   Common use cases for scraped data
-   Why scraping is complex (and why we're keeping it simple)
-   What makes good vs bad scraped content

---

## The Problem: Empty Database

Right now, your Pinecone database is empty. We need to feed it information!

```
Empty Pinecone Index
        ↓
      No Data
        ↓
   Can't Answer Questions
        ↓
   Useless RAG System 😢
```

**The solution?** Scrape publicly available documentation and content from the web.

---

## What is Web Scraping?

At a high level, web scraping is:

```
Your Code (Robot) → Visits Website → Gets HTML → Extracts Text → Stores Data
```

**The Process:**

1. Send HTTP request to a URL
2. Receive HTML response
3. Parse the HTML (extract relevant content)
4. Clean and structure the data
5. Store in your database (Pinecone)

### Simple Example

```typescript
// Pseudo-code for scraping
const html = await fetch('https://react.dev/docs');
const parsed = parseHTML(html);
const text = extractText(parsed);
const cleaned = cleanText(text);

// Now we can embed and store this text!
```

---

## Real-World Use Cases

Web scraping powers many AI and data applications:

**1. Knowledge Base RAG Systems**

-   Scrape React/TypeScript/Next.js documentation
-   Build a coding assistant trained on latest docs
-   Always up-to-date with official sources

**2. Legal Tech**

-   Scrape court cases and outcomes
-   Build legal precedent search tool
-   Help lawyers research similar cases

**3. Competitive Analysis**

-   Scrape competitor websites
-   Track pricing changes
-   Monitor product features
-   Analyze marketing strategies

**4. Content Aggregation**

-   News articles for summarization
-   Product reviews for sentiment analysis
-   Social media for trend detection

**5. Research & Training**

-   Academic papers
-   Historical documents
-   Domain-specific knowledge bases

---

## The Ethics of Scraping

### The Controversial Reality

Web scraping is... complicated. Here's the truth:

**How OpenAI Got Its Knowledge:**

-   Scraped the entire internet
-   Billions of web pages
-   Books, articles, code, forums, everything
-   Led to lawsuits and ethical debates

**The Problem:**

-   Copyright concerns
-   Terms of Service violations
-   Privacy issues
-   Server load and costs

### The Ethical Way to Scrape

As developers, we should be ethical. Here's how:

**✅ DO:**

1. **Check `robots.txt`** - Every site has one at `/robots.txt`

    ```
    Example: https://react.dev/robots.txt
    ```

2. **Respect the rules**

    ```
    User-agent: *
    Disallow: /admin/        # Don't scrape this
    Allow: /docs/            # OK to scrape this
    ```

3. **Rate limit your requests**

    ```typescript
    // Don't hammer the server
    await sleep(1000); // Wait 1 second between requests
    ```

4. **Use public APIs when available**

    - Better than scraping
    - Designed for programmatic access
    - Usually more reliable

5. **Only scrape public content**
    - No login-protected pages
    - No personal information
    - No copyrighted content (without permission)

**❌ DON'T:**

-   Ignore `robots.txt`
-   Scrape at high frequency (DDoS-like behavior)
-   Bypass authentication
-   Scrape copyrighted content at scale
-   Violate Terms of Service

---

## Why This Course Uses Simple Scraping

**We're scraping:**

-   Open source documentation (React, TypeScript, Next.js, Pinecone)
-   Publicly available content
-   Content that explicitly allows scraping
-   Small amounts of data (not the entire internet!)

**Why keep it simple?**

-   Scraping is a MASSIVE topic (entire businesses built on it)
-   Not the focus of this course
-   Easy access to quality training data
-   Avoids legal/ethical gray areas
-   You can extend it later

**The provided code:**

-   Naive implementation (simple but works)
-   Scrapes basic HTML content
-   Respects `robots.txt`
-   Rate-limited requests
-   You're encouraged to extend it!

---

## Challenges with Scraping

### 1. Complex HTML Structure

Real websites are messy:

```html
<!-- What you want -->
<p>React Hooks were introduced in React 16.8.</p>

<!-- What you actually get -->
<div class="container">
	<div class="row">
		<div class="col-md-8">
			<article>
				<div class="content-wrapper">
					<p class="paragraph-style-1">
						React Hooks were introduced in React 16.8.
					</p>
				</div>
			</article>
		</div>
	</div>
</div>
<!-- Plus 500 more lines of navigation, ads, footers, etc. -->
```

**Solution:** Use tools like Cheerio or Puppeteer to parse HTML and extract just the content you need.

### 2. Dynamic Content

Modern websites use JavaScript to load content:

```
Initial HTML → Empty <div id="root"></div>
JavaScript runs → Content appears
Your scraper → Sees nothing!
```

**Solution:** Use headless browsers (Puppeteer, Playwright) that execute JavaScript.

### 3. Anti-Scraping Measures

Websites don't always want to be scraped:

-   CAPTCHA challenges
-   Rate limiting
-   IP blocking
-   User-agent detection
-   Dynamic page structure

**Solution:** Respect these measures. If a site doesn't want scraping, don't scrape it.

### 4. Data Quality

Not all scraped content is useful:

```html
<!-- Useful -->
<article>React is a JavaScript library for building UIs.</article>

<!-- Not useful -->
<nav>Home | About | Contact | Login</nav>
<footer>© 2024 Example Corp</footer>
<div class="ad">Buy Our Product!</div>
```

**Solution:** Be selective about what content you extract.

---

## The Size Problem: Why Chunking Matters

Let's say you scraped a massive React documentation page:

```
Total content: 50,000 words
Your embedding limit: 512 dimensions
```

**What happens if you try to embed the entire document?**

❌ Too much information → diluted meaning
❌ May exceed token limits
❌ Won't fit in LLM context window
❌ Loses specificity

**Example of the problem:**

```
User: "How do I use useState?"

Without chunking:
- Retrieves entire 50,000-word doc
- Contains useState... somewhere
- Plus useEffect, useContext, routing, styling, everything
- LLM gets confused by too much irrelevant context

With chunking:
- Retrieves 3 focused chunks about useState
- Each chunk: 500 characters
- Clear, focused context
- LLM generates perfect answer
```

This is why **chunking** is critical. We'll cover this in the next module.

---

## Preview: The Chunking Problem

Consider this sentence:

> "After years of research, scientists finally discovered that the secret to eternal youth lies in consistent..."

**Bad chunking (cuts off mid-sentence):**

```
Chunk 1: "After years of research, scientists finally discovered
          that the secret to eternal youth lies in consistent"
```

**Missing context!** Consistent what? Exercise? Drug use? Diet? Sleep?

**Good chunking (respects sentence boundaries):**

```
Chunk 1: "After years of research, scientists finally discovered
          that the secret to eternal youth lies in consistent
          exercise and healthy eating habits."
```

**Complete context!** Now the meaning is preserved.

---

## What Makes Good Scraped Content?

For RAG systems, quality matters:

### ✅ Good Content Characteristics

1. **Authoritative** - Official documentation, not random blog posts
2. **Complete** - Full thoughts, not fragments
3. **Structured** - Clear hierarchy (headings, paragraphs)
4. **Current** - Up-to-date information
5. **Relevant** - Matches your domain
6. **Clean** - No ads, navigation, footers

### ❌ Bad Content to Avoid

1. **Advertisements** - "Buy now! Limited time offer!"
2. **Navigation menus** - "Home | About | Contact"
3. **Boilerplate** - Repeated headers/footers
4. **Comments sections** - Often low quality
5. **Outdated content** - Deprecated APIs
6. **Duplicate content** - Same info multiple times

---

## Your Task: Think About Chunking

Before moving to the next module, consider these questions:

**Question 1:** How would you chunk a large legal document (10,000+ words)?

-   By sentence? Too granular?
-   By paragraph? What if paragraphs are huge?
-   By section? What if sections are small?

**Question 2:** Would you even need to chunk a LinkedIn post?

-   Most posts are 1-3 paragraphs
-   Already concise
-   Chunking might make it worse?

**Question 3:** What about chunking code documentation?

-   Function signatures
-   Code examples
-   Descriptions
-   How do they relate?

**There's no perfect answer!** Chunking is an art and a science. In the next module, we'll explore a naive chunking strategy and you'll implement your own improvements.

---

## What Separates RAG Novices from Experts

According to experienced practitioners:

> "In my opinion, this is what separates the RAG noobs from people that have deeper understanding."

**Beginners think:**

-   Just scrape everything
-   Dump it in the database
-   Let the AI figure it out

**Experts know:**

-   Scraping strategy matters
-   Chunking strategy is critical
-   Input quality determines output quality
-   Context preservation is everything

**Your advantage:** We're all learning this together. RAG is so new that even senior developers are still figuring it out. Form your own opinions, experiment, and document what works!
