# RAG App — MVP Design Doc

**What this is:** A short design doc for your RAG app MVP. No video needed — just fill this out and share it back.
**Due:** Friday (sooner is better).
**Length:** 1–2 pages. Bullet points are fine. "I don't know yet" is a valid answer — say so and say why.

Copy this file, delete the example at the bottom, and fill in each section.

---

## 1. High-level: how does the app work?
Two or three sentences. What does a user do, and what do they get back?

- **User does:**
- **App returns:**
- **Rough flow (user → … → answer):**

## 2. The data
- **What is the data?**
- **Where does it come from (the source)?**
- **How do you plan to get it?** (API, scrape, upload, existing DB…)

## 3. Freshness
- **Does the data need to be up to date?** (yes/no — and why)
- **If yes, how do you keep it fresh?** (nightly job, on-demand, webhook…)
- **How do you avoid duplicates when you re-ingest?** (dedup key: URL? ID? hash?)

## 4. Chunking & metadata
- **Chunking strategy:** (by size? by section? one record = one chunk?)
- **Chunk size / overlap (if any):**
- **Metadata stored per chunk:** (e.g. source URL, date, zipcode, category — what you'll filter on)

## 5. Vector store
- **Which vector store?** (Qdrant, pgvector, Pinecone…) and one line on why
- **Embedding model:**
- **Vector dimensions:**
- **Do you filter by metadata before/after search?**

## 6. Agent architecture / workflow
- **Is there an agent, or just retrieve → answer?**
- **Steps / tools the agent uses:**
- **When does it call the vector store vs. answer directly?**

## 7. Observability & evals
- **How will you know it's working?** (logging, tracing…)
- **How will you test answer quality?** (a handful of question→expected-answer pairs is enough for MVP)

---

## Example (Zillow-style property search)

**1. High-level:** User types what they want ("2-bed under $400k in 90041"). App searches indexed listings and returns a list of matching properties.

**2. Data:** Property listings (price, beds, address, description). Source: scraped from Zillow with crawl4AI. Got by running the scraper against target zip codes.

**3. Freshness:** Yes — prices/listings change. Nightly scrape of target zips (90041, 90011, …). Dedup on listing URL (or property ID); skip if hash of the listing is unchanged.

**4. Chunking & metadata:** One listing = one record (no splitting — listings are short). Metadata: zipcode, price, beds, source URL, scraped date. Filter on zipcode + price.

**5. Vector store:** Qdrant. Embedding: OpenAI `text-embedding-3-small`, 1536 dims. Filter by zipcode/price in Qdrant before ranking by vector similarity.

**6. Agent:** Simple retrieve → answer for MVP. Tool: `search_listings(query, zip, max_price)`. Agent calls it, formats the top results into a list.

**7. Observability & evals:** Log every query + returned listing IDs. Evals: 10 sample searches with the properties we'd expect back; check they show up in the top results.
