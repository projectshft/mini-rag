# Vector Databases Study Sheet: Embedding Dimensions, Image Embeddings, Pinecone, and RAG
One important note first: OpenAI’s current Embeddings API docs are for **text embeddings**. The current `text-embedding-3-small` and `text-embedding-3-large` model pages list **image** as **not supported**. For image embeddings, the most relevant OpenAI references are the archived CLIP page and OpenAI’s cookbook example that uses CLIP locally for image search. ([developers.openai.com](https://developers.openai.com/api/docs/models/text-embedding-3-small))

## Recommended docs and guides

### OpenAI
1. **Vector embeddings guide** — official overview of embedding use cases, default dimensions, and the `dimensions` parameter. ([developers.openai.com](https://developers.openai.com/api/docs/guides/embeddings/))
2. **Create embeddings API reference** — exact request parameters, including `dimensions`, and the current input token limits. ([developers.openai.com](https://developers.openai.com/api/reference/resources/embeddings/methods/create/))
3. **`text-embedding-3-small` / `text-embedding-3-large` model pages** — useful for current performance, speed, modality, and price trade-offs. ([developers.openai.com](https://developers.openai.com/api/docs/models/text-embedding-3-small))
4. **Embeddings FAQ** — cosine similarity guidance and normalization details. ([help.openai.com](https://help.openai.com/en/articles/6824809-embeddings-faq))
5. **Embedding long inputs** — cookbook notebook on truncation vs. chunking for long documents. ([github.com](https://github.com/openai/openai-cookbook/blob/main/examples/Embedding_long_inputs.ipynb?short_path=96d7a37))
6. **Web QA with embeddings** — an end-to-end tutorial for building a basic retrieval system. ([developers.openai.com](https://developers.openai.com/api/docs/tutorials/web-qa-embeddings/))
7. **Custom image embedding search with CLIP** — OpenAI cookbook example for CLIP-based image retrieval. ([developers.openai.com](https://developers.openai.com/cookbook/examples/custom_image_embedding_search/))
8. **CLIP: Connecting text and images** — original OpenAI background reading for image-text embeddings. ([openai.com](https://openai.com/index/clip/))

### Pinecone
1. **Create an index / indexing overview** — confirms that dense index dimensions must match your embedding model and explains namespaces. ([docs.pinecone.io](https://docs.pinecone.io/guides/index-data/create-an-index))
2. **Understanding cost** — official storage-size formula: dense dimensions × 4 bytes, plus IDs and metadata. ([docs.pinecone.io](https://docs.pinecone.io/guides/manage-cost/understanding-cost))
3. **Decrease latency** — namespacing, metadata filtering, host targeting, and avoiding unnecessary returned vector values. ([docs.pinecone.io](https://docs.pinecone.io/guides/optimize/decrease-latency))
4. **Production checklist** — Pinecone’s practical guidance on dimensionality, namespaces, and capacity planning. ([docs.pinecone.io](https://docs.pinecone.io/guides/production/production-checklist))
5. **Hybrid search** — when to combine dense and sparse retrieval, and when a single hybrid index vs. separate indexes makes sense. ([docs.pinecone.io](https://docs.pinecone.io/guides/search/hybrid-search))
6. **Test Pinecone at scale** — useful once you move from prototype to production benchmarking. ([docs.pinecone.io](https://docs.pinecone.io/guides/get-started/test-at-scale))
7. **Build a RAG chatbot** — simple official RAG walkthrough. ([docs.pinecone.io](https://docs.pinecone.io/guides/get-started/build-a-rag-chatbot))
8. **Legal semantic search sample app** — especially relevant for your legal-tech scenario. ([docs.pinecone.io](https://docs.pinecone.io/examples/sample-apps/legal-semantic-search))

---

## Understanding Embedding Dimensions for RAG

These recommendations assume you’re using OpenAI’s `text-embedding-3` family with Pinecone. Treat them as **good starting defaults**, not immutable rules: OpenAI explicitly supports shortening embeddings with the `dimensions` parameter, and Pinecone notes that higher dimensions can improve accuracy but require more resources. ([developers.openai.com](https://developers.openai.com/api/reference/resources/embeddings/methods/create/))

## 1. Content Type Analysis

### LinkedIn Posts (short, casual, 1–3 paragraphs)
- **Recommended dimensions:** **512**
- **Reasoning:** Short social content usually needs solid topical similarity and tone awareness, but not the maximum representational capacity. A shortened embedding keeps storage and retrieval costs low while preserving plenty of semantic signal for short-form content. OpenAI explicitly supports shortening `text-embedding-3` vectors, and Pinecone notes that higher dimensions consume more resources. ([developers.openai.com](https://developers.openai.com/api/reference/resources/embeddings/methods/create/))

### Legal Documents (long, technical, precise language)
- **Recommended dimensions:** **3072**
- **Reasoning:** Legal retrieval is high-stakes and nuance-heavy, so I would bias toward the most capable embedding setting when using a general OpenAI model. That said, I would embed **chunks**, not entire long opinions, because OpenAI’s embeddings endpoint has an 8192-token per-input limit and the official long-input cookbook recommends truncation or chunking for longer texts. Pinecone’s own legal sample also chunks PDFs and uses a domain-specific legal embedding model, which is a good reminder that **model choice and chunking can matter as much as raw dimensionality**. ([developers.openai.com](https://developers.openai.com/api/docs/models/text-embedding-3-large))

### Product Reviews (mixed sentiment, varied length)
- **Recommended dimensions:** **1536**
- **Reasoning:** Reviews often need more nuance than social posts because retrieval may depend on aspect-level sentiment like battery life, fit, durability, shipping, or customer support. At the same time, review corpora are often large, so 3072 can be overkill. `1536` is a strong balance point. OpenAI’s own embeddings guide uses review data as a representative embeddings use case. ([developers.openai.com](https://developers.openai.com/api/docs/guides/embeddings/))

### Code Documentation (technical, structured)
- **Recommended dimensions:** **1536**
- **Reasoning:** Code docs are structured and jargon-dense, but you often care more about clear API/entity matching than the very last bit of semantic nuance. OpenAI’s official code-search example uses `text-embedding-3-small`, whose default output length is 1536, so that is a very reasonable default here. ([developers.openai.com](https://developers.openai.com/api/docs/guides/embeddings/))

## 2. Image Embeddings

### What models generate image embeddings?
The classic answer is **CLIP** and **ResNet-style vision encoders**. CLIP uses an image encoder and a text encoder, then projects both into the **same latent space** so you can compare images and text directly. ResNet embeddings are typically taken from the pooled feature vector before classification. Also, current OpenAI text embedding models are text-only, so for image embeddings you should think CLIP rather than the current Embeddings API. ([huggingface.co](https://huggingface.co/docs/transformers/en/model_doc/clip))

### What dimension ranges are typical for images?
Typical practical image embedding sizes are often in the **512–2048** range. Examples: the default CLIP config uses a **512**-dimensional shared projection space, OpenAI’s `clip-vit-large-patch14` config uses **768**, and a ResNet-50 pooled feature vector is effectively **2048** dimensions before the classifier. ([huggingface.co](https://huggingface.co/docs/transformers/en/model_doc/clip))

### How do image embedding dimensions compare to text?
With current OpenAI text embeddings, the defaults are **1536** for `text-embedding-3-small` and **3072** for `text-embedding-3-large`, so modern OpenAI text embeddings are often **larger** than common CLIP embeddings like 512 or 768. Within a single CLIP model, though, image and text embeddings share the **same projection dimension** by design. ([developers.openai.com](https://developers.openai.com/api/docs/guides/embeddings/))

## 3. The Dimension Trade-off Matrix

| Dimensions | Expected Accuracy | Expected Speed | Expected Storage Cost | Good Fit |
|---|---|---|---|---|
| 256 | Lower, but still surprisingly strong for first-stage recall | Fastest | Lowest | Massive-scale corpora, short text, rough semantic recall |
| 512 | Good | Fast | Low | Social content, lightweight RAG, high-volume search |
| 1536 | High | Medium | Medium | Strong general-purpose production default |
| 3072 | Highest | Slowest | Highest | High-stakes legal/technical retrieval |

This table is a **practical synthesis**, not a vendor guarantee. OpenAI explicitly frames smaller dimensions as a trade-off of performance vs. storage/compute, and Pinecone says higher dimensions can offer more accuracy but require more resources. Actual latency also depends on query shape, `top_k`, metadata filtering, namespaces, and whether you return vector values. ([openai.com](https://openai.com/index/new-embedding-models-and-api-updates/))

A useful anchor point from OpenAI: a `text-embedding-3-large` vector shortened to **256** dimensions can still outperform an unshortened **1536**-dimensional `text-embedding-ada-002` vector on MTEB. That is why smaller dimensions are more viable now than they used to be. ([openai.com](https://openai.com/index/new-embedding-models-and-api-updates/))

## 4. Real-World Scenario: Legal-Tech RAG

### Short case summaries (200–500 words)
- **Recommended dimensions:** **1536**
- **Why:** They are short enough that you do not need the maximum dimension every time, but still nuanced enough that 512 starts to feel aggressive for legal work. ([developers.openai.com](https://developers.openai.com/api/docs/guides/embeddings/))

### Full legal opinions (5,000–20,000 words)
- **Recommended dimensions:** **3072**, but only for **chunk embeddings**, not whole-document embeddings.
- **Why:** OpenAI’s official guidance for long inputs is chunking/truncation, and Pinecone’s legal example also chunks the source documents before embedding and indexing. ([github.com](https://github.com/openai/openai-cookbook/blob/main/examples/Embedding_long_inputs.ipynb?short_path=96d7a37))

### Case law citations (very short, highly precise)
- **Recommended approach:** Do not solve this with dense dimension alone.
- **Why:** Use **hybrid retrieval** so exact lexical patterns like `410 U.S. 113` or `347 U.S. 483` are preserved. Pinecone’s hybrid-search docs are explicit that semantic search can miss exact keyword matches, while lexical search helps with domain-specific terminology and precise terms. If you must pick a dense size for the citation side, **512 or 1536** is enough; the real win comes from adding sparse signals. ([docs.pinecone.io](https://docs.pinecone.io/guides/search/hybrid-search))

### Would I use different Pinecone indexes?
My default answer is **not unless evaluation proves I need them**. Pinecone recommends using **namespaces** rather than multiple indexes for logical partitioning, because namespaces can improve performance and cost by scanning only relevant records. So if I standardize on one dense dimension, I would keep summaries and opinion chunks in the **same index** and separate them by namespace or metadata. ([docs.pinecone.io](https://docs.pinecone.io/guides/index-data/indexing-overview))

However, a dense Pinecone index has a **fixed dimension** that must match the vectors you store. So if you truly want **1536 for summaries** and **3072 for opinion chunks**, then yes, you need **separate dense indexes** for those two dimensions. For citations, I would add **hybrid retrieval**. Pinecone recommends a **single hybrid index for most use cases**, and separate dense/sparse indexes only when you need sparse-only queries or independent reranking. ([docs.pinecone.io](https://docs.pinecone.io/guides/index-data/create-an-index))

### My pragmatic production choice
One **1536-dim dense index** for summaries and opinion chunks, chunk the long opinions, and layer **hybrid retrieval** onto citation-heavy searches. I would move full-opinion chunks to a separate **3072** index only if offline evaluation showed a clear recall or answer-quality win that justified the added storage and operational complexity. ([github.com](https://github.com/openai/openai-cookbook/blob/main/examples/Embedding_long_inputs.ipynb?short_path=96d7a37))

## 5. Cost Analysis

Using the Pinecone formula for dense vectors, storage is roughly:

```text
storage = number of records × dimensions × 4 bytes
```

That is only the vector payload; actual Pinecone index size also includes IDs and metadata. ([docs.pinecone.io](https://docs.pinecone.io/guides/manage-cost/understanding-cost))

For **100,000 documents**:

### 512 dimensions
```text
100,000 × 512 × 4 = 204,800,000 bytes
≈ 204.8 MB (decimal)
≈ 195.3 MiB (binary)
```

### 1536 dimensions
```text
100,000 × 1536 × 4 = 614,400,000 bytes
≈ 614.4 MB
≈ 586.0 MiB
```

### 3072 dimensions
```text
100,000 × 3072 × 4 = 1,228,800,000 bytes
≈ 1.2288 GB
≈ 1.144 GiB
```

### Relative difference
- **1536 dimensions** uses **3×** the vector storage of **512 dimensions**.
- **3072 dimensions** uses **6×** the vector storage of **512 dimensions**.
- **3072 dimensions** uses **2×** the vector storage of **1536 dimensions**.

## Bottom line

The cleanest mental model is:

- **512** for short, high-volume, lower-stakes text.
- **1536** for strong general-purpose production RAG.
- **3072** for high-stakes nuanced retrieval where cost is secondary.
- For **exact legal citations**, don’t rely on dense dimension alone; use **hybrid** retrieval. ([openai.com](https://openai.com/index/new-embedding-models-and-api-updates/))

---

## Optional study prompts for yourself

- Where does **chunking strategy** matter more than raw embedding dimension?
- When is **1536** good enough, even if **3072** might be slightly better?
- Why are **citations** a hybrid-search problem, not just an embedding-dimension problem?
- When is it operationally cleaner to use **one index + namespaces** versus **multiple indexes**?
- What evaluation metrics would justify moving from **1536** to **3072** in production?