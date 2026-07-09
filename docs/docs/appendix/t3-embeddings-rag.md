---
id: t3-embeddings-rag
sidebar_position: 4
title: "T3: Embeddings, RAG & Retrieval Systems"
---

This module assumes you already know how to prompt models and how LLM APIs work.
It focuses on the retrieval layer that makes LLM applications grounded, current, and operationally reliable.
If you build internal copilots, knowledge assistants, code search, ticket summarizers, or policy Q&A systems, this is the layer that usually decides whether the experience feels useful or fake.

:::info Audience framing
This is written for engineers who already ship distributed systems, APIs, search features, and data pipelines.
The goal is not to define basic ML vocabulary.
The goal is to give you enough depth to make good engineering tradeoffs when retrieval becomes part of your production architecture.
:::

## Why Retrieval Systems Matter

Retrieval systems answer a simple engineering question.
How do you give a model the right facts at the right time without retraining the whole model every time your knowledge changes?

For many business applications, the hard part is not language generation.
The hard part is getting precise, current, organization-specific context into the prompt.
That is the job of embeddings, ranking, metadata filtering, and retrieval pipelines.

A strong retrieval system can turn a general-purpose model into a domain-aware assistant.
A weak retrieval system turns the same model into a confident liar.

### The problem RAG is solving

Large language models have two core limitations that matter in enterprise systems.

- Their pretraining data is stale.
- Their internal weights are not a trustworthy knowledge base for your company documents.
- They do not automatically know what changed in your codebase yesterday.
- They do not know which policy PDF was superseded last week.
- They do not know which customer contract clause applies to the current region.

Retrieval-augmented generation, or RAG, solves this by fetching relevant context at request time.
The model does not need to memorize everything.
It needs to reason over the retrieved material.

### Where retrieval shows up in real systems

Retrieval is not only for chatbots.
It appears in many engineering workflows.

- Internal support assistants over documentation and runbooks.
- Code assistants that search repositories, ADRs, and API docs.
- Case management systems that surface past resolutions.
- Security copilots that retrieve policy, control mappings, and incident history.
- Sales enablement assistants over product sheets, pricing rules, and competitive notes.
- Compliance assistants over regulations, contracts, and audit evidence.

### So what for engineers

If you treat retrieval as a bolt-on vector query, you will miss most of the system quality work.
Production retrieval quality depends on the full stack.

- How documents are cleaned.
- How content is chunked.
- Which embedding model is used.
- Which index structure is used.
- Whether keyword search is combined with semantic search.
- Whether results are reranked.
- Whether metadata filters are applied before search.
- Whether evaluation covers retrieval and answer quality separately.

:::tip Practical takeaway
Most failed “RAG” projects are not caused by the generator.
They are caused by missing data hygiene, bad chunking, poor ranking, or no evaluation loop.
Treat retrieval like a search system with LLM output layered on top.
:::

## What Embeddings Are

Embeddings are dense numeric vectors that represent the meaning of text, code, or other inputs.
An embedding model maps an input into a point in a high-dimensional space.
Inputs that are semantically similar tend to land closer together.

That “closer together” phrase is the entire operational idea.
If a user asks a question, you embed the query.
You compare that query vector to vectors for stored document chunks.
You retrieve the nearest neighbors.

### Dense vectors and semantic similarity

Traditional keyword search asks whether terms overlap.
Embedding search asks whether meanings align.

Two strings can be semantically close even when they share few words.
For example, these may end up near each other in vector space.

- “How do I rotate AWS access keys?”
- “What is the procedure for regenerating IAM credentials?”

A pure lexical engine may miss that relationship.
A good embedding model often captures it.

Dense vectors are called dense because nearly every dimension has a value.
This differs from sparse representations such as bag-of-words or BM25 term vectors, where most dimensions are zero.

### Why high-dimensional geometry matters

Embedding spaces are geometric objects.
Each dimension is not usually human interpretable.
You should not expect dimension 417 to mean “security” or dimension 92 to mean “latency”.
What matters is the relative position of vectors.

In practice, models output vectors with dimensions such as:

- 384
- 768
- 1024
- 1536
- 3072

Higher dimension does not automatically mean better retrieval.
It usually means:

- more storage per item,
- more memory pressure in the index,
- potentially better expressive capacity,
- and sometimes more latency or cost.

:::note Engineering intuition
Think of an embedding vector as a lossy semantic fingerprint.
It preserves enough signal for ranking and clustering.
It does not preserve the full source document.
That is why retrieved chunks still need to be passed to a generator.
:::

### Cosine similarity, dot product, and vector geometry

Most vector search systems rank by a similarity function.
The three you will see most often are cosine similarity, dot product, and Euclidean distance.

Cosine similarity measures the angle between two vectors.
It cares about direction more than magnitude.
This is often useful when vectors may vary in length but semantic orientation matters most.

Dot product multiplies corresponding dimensions and sums them.
It is related to cosine similarity but also depends on vector magnitude.
If vectors are normalized to unit length, dot product and cosine ranking become equivalent.

Euclidean distance measures straight-line distance between two points.
It is intuitive geometrically, but in modern embedding systems cosine or inner product are more common choices.

| Measure | Intuition | Sensitive to vector length? | Common use |
| --- | --- | --- | --- |
| Cosine similarity | Angle between vectors | No, after normalization | General semantic retrieval |
| Dot product | Direction plus magnitude | Yes, unless normalized | Some ANN indexes and model defaults |
| Euclidean distance | Literal geometric distance | Yes | Less common for text retrieval |

A practical point matters here.
You must know what your model and index expect.
If the model docs assume normalization and your system does not normalize, ranking quality can degrade silently.

### A small geometry example

Imagine a query vector `q` and two candidate chunks `a` and `b`.
If `a` points in almost the same direction as `q`, cosine similarity is high.
If `b` has a large magnitude but a worse angle, dot product might still favor `b` unless you normalize.

That is why “just use vector search” is not a real implementation plan.
The similarity function, normalization rule, and index settings are part of retrieval quality.

```ts
const dot = (a: number[], b: number[]) =>
  a.reduce((sum, value, i) => sum + value * b[i], 0);

const norm = (v: number[]) => Math.sqrt(dot(v, v));

const cosine = (a: number[], b: number[]) => dot(a, b) / (norm(a) * norm(b));

const q = [0.3, 0.8, 0.1];
const a = [0.2, 0.75, 0.05];
const b = [1.5, 0.4, 0.2];

console.log({
  cosineToA: cosine(q, a),
  cosineToB: cosine(q, b),
  dotToA: dot(q, a),
  dotToB: dot(q, b),
});
```

### Embeddings are not perfect understanding

Embedding spaces compress meaning.
Compression always drops detail.
That means embeddings are powerful, but not magical.

Common limitations include:

- fine-grained numeric distinctions are often weak,
- rare identifiers can be hard to retrieve,
- negation can be brittle,
- fresh jargon may not be captured well,
- code symbols may need specialized models,
- multilingual or mixed-format corpora may need model-specific validation.

If you index incident reports, “approved” and “not approved” may land closer than you want.
If you index code, function names and stack traces may still need lexical search.

### So what for engineers

Engineers should take away four operational rules.

- Embeddings are ranking features, not truth.
- Geometry choices affect retrieval behavior.
- Domain-specific evaluation beats vendor benchmarks.
- Vector search should almost always be combined with other retrieval signals.

:::warning Common mistake
Do not assume that a high-quality chat model implies high-quality embeddings.
Embedding quality, dimensionality, cost, multilingual support, and ranking behavior are separate concerns.
:::

## Embedding Models and Ranking Models

The term “embedding model” is often used too loosely.
In retrieval systems you usually work with at least two model families.

- A bi-encoder embedding model for fast candidate retrieval.
- Optionally, a cross-encoder or reranker model for precise rescoring of a small candidate set.

### Embedding models versus generative models

A generative model predicts the next token.
Its main job is synthesis, completion, explanation, and reasoning over prompt context.

An embedding model produces a numeric representation.
Its main job is retrieval, clustering, classification support, deduplication, or similarity search.

These goals create different optimization pressures.

| Model type | Primary output | Main optimization target | Typical role |
| --- | --- | --- | --- |
| Generative LLM | Tokens | Coherent generation and reasoning | Final answer generation |
| Embedding model | Dense vector | Semantic proximity | Retrieval candidate generation |
| Cross-encoder reranker | Relevance score | Pairwise or listwise ranking precision | Re-ranking top candidates |

A powerful generator with weak retrieval still hallucinates.
A strong retriever with a mediocre generator often still produces useful grounded answers.
That is why retrieval engineering deserves its own design effort.

### Bi-encoder retrieval

In a bi-encoder setup, queries and documents are encoded independently.
That means you can precompute document embeddings once.
At query time, you only embed the query and run nearest-neighbor search.

This is what makes large-scale semantic retrieval feasible.
You can store millions of document vectors and search them efficiently.

The tradeoff is that the model does not directly inspect a query-document pair together during first-stage retrieval.
That limits ranking precision.

### Cross-encoder reranking

A cross-encoder takes both the query and the candidate text together as input.
It reads them jointly and outputs a relevance score.
That usually produces better ranking quality.

The downside is cost and latency.
You cannot realistically run a cross-encoder against every document in a large corpus.
You use it after a fast first-stage retriever narrows the list.

A common architecture is:

1. Use embeddings and ANN search to retrieve top 50 or top 100 candidates.
2. Apply metadata filters if needed.
3. Run a cross-encoder reranker on those candidates.
4. Keep the top 5 to 10 chunks for generation.

### Bi-encoder versus cross-encoder tradeoff

| Property | Bi-encoder | Cross-encoder |
| --- | --- | --- |
| Precompute document representations | Yes | No |
| Large-scale search | Excellent | Poor |
| Ranking precision | Good | Better |
| Latency per candidate | Low | Higher |
| Typical role | Recall-oriented candidate generation | Precision-oriented reranking |

:::tip Retrieval rule of thumb
Use a bi-encoder to get the right neighborhood.
Use a cross-encoder to sort the neighborhood correctly.
:::

### Popular model families

You will encounter a mix of hosted APIs and open models.
The right choice depends on latency budget, licensing, hosting constraints, multilingual needs, and data sensitivity.

| Family | Notes | Strengths | Caveats |
| --- | --- | --- | --- |
| OpenAI `text-embedding-3-small` / `text-embedding-3-large` | Hosted API embeddings | Strong general quality, easy integration | Hosted dependency, API cost, residency considerations |
| Cohere Embed | Popular for enterprise retrieval and reranking stacks | Strong retrieval ecosystem, multilingual options | Hosted dependency unless self-hosted alternatives fit better |
| Nomic Embed | Open-weight friendly options such as `nomic-embed-text` | Good open ecosystem, local deployment options | Validate domain fit and operational maturity |
| BGE family | Widely used open models from BAAI | Strong benchmarks, many sizes, rerankers available | Need your own hosting and evaluation |

A few practical notes:

- Bigger embedding models do not always justify their storage and latency cost.
- Open models can be excellent when data residency or cost control matters.
- Vendor benchmarks often overstate gains on your actual documents.
- For code retrieval, evaluate on code and developer queries, not generic sentence pairs.

### Model selection checklist

When comparing embedding models, check more than leaderboard position.

- Does the model support the languages used in your corpus?
- Does it handle code, markdown, tables, and logs reasonably well?
- What is the vector dimension?
- What is the cost per million tokens or per document batch?
- Can you self-host if legal or network requirements change?
- What is the maximum input length for embedding?
- Are document and query prompts or prefixes recommended?
- Does the provider also offer reranking models that fit your stack?

### Query and document instruction tuning

Some embedding models perform better when queries and documents are formatted differently.
For example, a model may recommend prefixes like “query:” and “passage:”.
Other models are trained with instruction-style prompts.

Ignoring those recommendations can reduce retrieval quality.
This is especially common when teams swap models without updating preprocessing.

### So what for engineers

Do not buy into a single-model fantasy.
Modern retrieval stacks are multi-model systems.

- One model may be best for embeddings.
- Another may be best for reranking.
- A third may be best for answer generation.

That is normal.
These stages optimize for different things.

:::warning Common architecture smell
If the team says “we use model X for everything because it is our standard LLM,” expect retrieval quality to plateau early.
Purpose-built retrieval models usually outperform general reuse of a generator for all stages.
:::

## Vector Databases and Approximate Nearest Neighbor Search

A vector database is a storage and query system optimized for similarity search over embeddings.
At minimum, it stores vectors and metadata and supports nearest-neighbor retrieval.
More mature systems add filtering, replication, persistence, sharding, compression, hybrid search, and operational tooling.

### What a vector database actually does

The value of a vector database is not “it stores arrays of floats.”
A relational database can store arrays too.
The value is that it supports efficient search in high-dimensional space.

A production vector store commonly provides:

- vector indexing,
- approximate nearest neighbor search,
- metadata filtering,
- bulk ingestion,
- update and delete operations,
- durability and replication,
- tenancy and namespace isolation,
- operational metrics and scaling controls.

### Why approximate search exists

Exact nearest-neighbor search compares the query vector against every stored vector.
That works for small corpora.
It becomes expensive at scale.

If you have millions of chunks, exact search can be too slow or too costly for interactive workloads.
Approximate nearest neighbor, or ANN, algorithms trade a little recall for much better speed and scalability.

That trade is usually acceptable because:

- first-stage retrieval is recall-oriented, not final ranking,
- reranking can correct some misses within the candidate set,
- and users care more about latency plus relevance than mathematical exactness.

### HNSW in practice

HNSW stands for Hierarchical Navigable Small World.
It is one of the most common ANN structures for retrieval systems.

At a high level, HNSW builds a graph where each vector connects to a subset of nearby vectors.
Search navigates through that graph to find promising regions quickly instead of scanning everything.

Why engineers like HNSW:

- high retrieval quality,
- strong practical recall/latency balance,
- incremental insertions are usually supported,
- widely available across vendors and libraries.

Tradeoffs of HNSW:

- memory usage can be significant,
- index construction can be slower than simpler structures,
- tuning parameters affect recall, latency, and build time.

Common knobs include:

- `M` for graph connectivity,
- `efConstruction` for indexing effort,
- `efSearch` for query-time search breadth.

Increasing search breadth often improves recall but increases latency.
That is a classic production tuning trade.

### IVF-PQ in practice

IVF-PQ combines two ideas.

- IVF, inverted file, partitions vectors into coarse clusters.
- PQ, product quantization, compresses vectors into compact codes.

This can dramatically reduce memory footprint and improve scalability.
It is useful when corpora are very large and memory efficiency matters.

Tradeoffs of IVF-PQ:

- more aggressive approximation,
- more tuning complexity,
- recall can fall if partitioning or quantization choices are poor,
- updates may be more operationally involved depending on the implementation.

HNSW often wins for quality and simplicity in mid-scale deployments.
IVF-PQ becomes attractive when scale and memory pressure dominate.

### Comparing ANN approaches at a high level

| Approach | Strength | Weakness | Good fit |
| --- | --- | --- | --- |
| Exact search | Perfect recall | Slow at scale | Small corpora, benchmarking, correctness checks |
| HNSW | Excellent quality-speed balance | Higher memory use | Most interactive enterprise RAG systems |
| IVF-PQ | Lower memory footprint, scalable | More approximation and tuning | Very large corpora, cost-sensitive serving |

:::info Practical guidance
Always keep a path to exact search for small offline eval sets.
You need a correctness reference when tuning ANN parameters.
If you only measure one approximate index against another approximate index, you lose the ground truth anchor.
:::

### Product options and tradeoffs

There is no universally best vector database.
The right choice depends on your existing platform, team skill set, compliance constraints, and scale profile.

| Option | What it is | Strengths | Tradeoffs | Best fit |
| --- | --- | --- | --- | --- |
| `pgvector` | PostgreSQL extension for vector search | Reuses Postgres ops, joins with relational data, simple stack | Not always the best choice for extreme scale or highly specialized ANN tuning | Teams already standardized on Postgres |
| Pinecone | Managed vector database | Operational simplicity, managed scaling, mature retrieval docs | Managed service dependency, cost considerations | Teams that want fast time-to-value |
| Weaviate | Vector database with rich retrieval features | Hybrid search, modules, strong ecosystem content | Operational model may be heavier than minimal needs | Teams wanting flexible retrieval features |
| Chroma | Developer-friendly vector store | Simple local workflows, prototyping speed | Production posture depends on deployment pattern | Local experimentation and smaller systems |
| Qdrant | Dedicated vector database | Strong filtering, good performance, open-source option | Another system to operate if self-hosted | Teams wanting open-source production vector search |

A few grounded heuristics:

- If your data already lives in Postgres and retrieval scale is moderate, `pgvector` is often a very reasonable first production step.
- If your team does not want to operate search infrastructure, a managed service can remove a lot of operational drag.
- If metadata filtering is central to relevance, validate filter performance early, not after index migration.
- If you need tenant isolation, deletion guarantees, and predictable operational tooling, test those before vendor selection.

### Schema design still matters

Even with a vector database, data modeling is not optional.
For each indexed chunk, you usually need:

- chunk text,
- embedding vector,
- document ID,
- source URI,
- title or section label,
- created and updated timestamps,
- version or checksum,
- security scope,
- chunk position,
- document type,
- product or domain tags.

These fields power:

- metadata filtering,
- deduplication,
- chunk stitching,
- freshness checks,
- permissions enforcement,
- debugging and auditability.

### So what for engineers

Choose a vector store the same way you would choose any infrastructure component.
Optimize for operational fit, not hype.

- If your team is strong in Postgres and weak in new infra, start there.
- If your corpus is huge and latency-sensitive, benchmark dedicated engines.
- If compliance and tenancy are hard constraints, treat them as first-class selection criteria.
- If you cannot measure recall and latency together, you are not doing capacity planning yet.

```shell
# Example: benchmark retrieval latency and top-k quality across two backends
node scripts/retrieval-benchmark.js \
  --dataset docs/eval/rag-queries.json \
  --backends pgvector,pinecone \
  --topK 20 \
  --rerank false
```

## Full RAG Architecture

RAG is a pipeline, not a single query.
It has an indexing side and a serving side.
Both matter.

### Indexing pipeline

The indexing pipeline prepares content for retrieval.
A typical production flow looks like this.

1. Ingest source documents from systems of record.
2. Normalize content into a retrieval-friendly text representation.
3. Split content into chunks.
4. Extract metadata.
5. Compute embeddings.
6. Write chunks, vectors, and metadata to the index.
7. Validate counts, versions, and permissions.

The indexing pipeline is where many bugs are introduced.
Examples include:

- missing pages from PDF extraction,
- incorrect markdown rendering,
- stripping tables that actually contain the answer,
- embedding outdated versions after failed incremental sync,
- or leaking documents across tenant boundaries.

### Query-time retrieval pipeline

A strong serving path usually includes more than “embed query, search vectors, answer.”
A realistic pipeline often looks like this.

1. Receive the user query.
2. Apply access control context.
3. Optionally rewrite or expand the query.
4. Run metadata pre-filters.
5. Execute vector retrieval and often keyword retrieval.
6. Fuse results from multiple retrievers.
7. Rerank the top candidates.
8. Construct the final prompt with selected chunks and citations.
9. Generate the answer.
10. Log retrieval traces and outcomes for evaluation.

That is why RAG is closer to search engineering than to simple prompt engineering.

### Generation pipeline

The generation stage still matters.
Poor prompt construction can waste good retrieval.

A grounded answer prompt usually includes:

- the user question,
- retrieved passages,
- source labels,
- instructions to cite or say “I don’t know,”
- output format constraints,
- and sometimes conversation state.

The generator should be constrained to use retrieved evidence where possible.
If the application requires citations, enforce source-aware formatting in the prompt or downstream renderer.

### Why RAG versus fine-tuning for current knowledge

RAG and fine-tuning solve different problems.

RAG is best when knowledge changes frequently or is too large and dynamic to encode into model weights.
This includes:

- documentation,
- tickets,
- policies,
- contracts,
- codebases,
- runbooks,
- and customer-specific data.

Fine-tuning is usually better for behavioral adaptation.
Examples include:

- response style,
- schema-constrained output habits,
- domain-specific writing conventions,
- specialized tool use patterns.

Trying to use fine-tuning as a document storage layer is usually a mistake.
Weights are a poor substitute for explicit, updateable knowledge retrieval.

### Common RAG failure modes

A poor answer can fail before generation even starts.
Common failure modes include:

- The answer exists, but chunking split the needed facts apart.
- The answer exists, but the retriever missed it.
- The right chunk was retrieved, but low-ranked and trimmed out.
- The chunk was retrieved, but prompt assembly exceeded context budget.
- The chunk is stale, duplicated, or superseded.
- The model answered from prior knowledge instead of retrieved context.
- The query needed filters such as product, tenant, or version, but filters were missing.
- The answer required joining multiple chunks, but the pipeline only passed isolated snippets.

These failures imply different fixes.
That is why observability at each stage is necessary.
If all you log is the final answer, debugging is guesswork.

### Retrieval is not the same as grounding

Retrieving context does not guarantee faithful use of that context.
Generation can still hallucinate, overgeneralize, or cite the wrong chunk.
That is why answer evaluation must inspect both retrieval quality and grounding quality.

### So what for engineers

Design RAG as two pipelines with explicit contracts.

- Indexing pipeline contract: what content enters the corpus, how it is normalized, versioned, and deleted.
- Serving pipeline contract: how a query becomes filtered candidates, reranked context, and a source-grounded answer.

:::tip Architecture habit
When debugging RAG, ask in this order.
Did we index the needed fact?
Did we retrieve it?
Did we rank it high enough?
Did we pass it to the model?
Did the model use it faithfully?
:::

```ts
export type RetrievedChunk = {
  id: string;
  documentId: string;
  text: string;
  score: number;
  metadata: {
    source: string;
    section?: string;
    version?: string;
    tenantId?: string;
  };
};

export type RagTrace = {
  query: string;
  filters: Record<string, string | string[]>;
  retrieved: RetrievedChunk[];
  reranked: RetrievedChunk[];
  finalContext: RetrievedChunk[];
};
```

## Chunking Strategies

Chunking is one of the highest-leverage design choices in RAG.
The embedding model cannot rescue bad chunk boundaries indefinitely.
If chunks are too small, you lose context.
If chunks are too large, retrieval gets noisy and prompt budgets collapse.

### Fixed-size chunking with overlap

This is the default starting point in many systems.
You split text by token or character count and add overlap between adjacent chunks.

Benefits:

- simple to implement,
- predictable chunk count,
- easy to parallelize,
- reasonable baseline for many corpora.

Weaknesses:

- boundaries ignore semantics,
- sections can be cut mid-thought,
- tables and lists can be mangled,
- code blocks can be split in unhelpful places.

Overlap helps preserve continuity.
But too much overlap inflates storage, indexing cost, and retrieval duplication.

### Semantic chunking

Semantic chunking attempts to split at meaningful boundaries.
That can mean:

- sentence clusters,
- paragraph groups,
- heading boundaries,
- discourse segments,
- or embedding-based similarity transitions.

This often improves passage coherence.
However, it also increases implementation complexity.
You need to validate whether the improved chunk quality actually produces better retrieval metrics on your corpus.

### Document-specific chunking strategies

Different source types deserve different chunkers.
A single chunking policy for every document format is usually lazy engineering.

#### Code and repository content

For code, chunk by meaningful units when possible.

- function,
- class,
- interface,
- file section,
- README heading,
- API route block.

Important metadata for code retrieval includes:

- repository,
- branch or revision,
- file path,
- symbol name,
- language,
- start and end lines.

Why this matters:

- Developers search with identifiers and architectural intent.
- Code answers often need lexical precision plus surrounding semantic context.
- Splitting blindly by tokens can separate a function signature from its body or its comments.

#### PDF and slide content

PDFs are tricky because layout carries meaning.
A useful strategy may be:

- extract page-level structure,
- preserve headings and tables when possible,
- chunk within pages,
- keep page number metadata,
- store document revision and publication date.

Blind PDF text extraction can scramble columns, headers, and footers into nonsense.
If you index that noise, retrieval quality suffers and debugging becomes painful.

#### Markdown and docs content

Markdown is usually best chunked by heading hierarchy.
That preserves topic boundaries and makes citations more readable.

A common policy is:

- H1 or page title as document metadata,
- H2/H3 boundaries as natural chunk separators,
- list and code block preservation within the chunk,
- section path stored as metadata.

This is especially useful for internal docs, playbooks, ADRs, and knowledge bases.

### Chunk size tradeoffs

There is no universal chunk size.
The right size depends on document structure, embedding model, reranking strategy, and question type.

| Chunk strategy | Typical advantage | Typical risk | Good fit |
| --- | --- | --- | --- |
| Small chunks | High precision, less noise | Misses multi-paragraph context | Fact lookup, FAQs |
| Medium chunks | Balanced precision and context | Still may split some concepts | General enterprise docs |
| Large chunks | More context per hit | Lower precision, prompt bloat | Narrative docs, policy sections |

Useful rules of thumb:

- If the answer often spans adjacent paragraphs, your chunks may be too small.
- If retrieval returns vaguely related walls of text, your chunks may be too large.
- If top-k contains many near-duplicate overlaps, overlap is probably too aggressive.
- If code search misses function-level answers, use code-aware chunking and lexical hybrid retrieval.

### Parent-child and contextual chunking

A useful production pattern is parent-child retrieval.
You embed small child chunks for precision.
You store links to larger parent sections for context assembly.

At query time:

1. retrieve precise child chunks,
2. map them back to parent sections,
3. pass the right parent context to the model.

This often outperforms choosing between small or large chunks exclusively.
You get precise retrieval with richer final context.

### Chunking checklist

Before locking chunking policy, test these questions.

- Are headings preserved?
- Are tables recoverable?
- Are code blocks split safely?
- Are citations readable to end users?
- Can adjacent chunks be stitched for answer synthesis?
- Are duplicate overlaps inflating the top results?
- Are page, section, or symbol boundaries represented in metadata?

### So what for engineers

Chunking is not preprocessing trivia.
It is query-time relevance engineering done ahead of time.

:::warning Common mistake
Teams often spend more time comparing embedding models than chunking policies.
In many enterprise corpora, chunking quality produces a bigger lift than switching from one strong embedding model to another.
:::

```shell
# Example: build multiple chunking variants for A/B evaluation
node scripts/build-index.js --strategy fixed-512-overlap-64
node scripts/build-index.js --strategy markdown-heading
node scripts/build-index.js --strategy code-symbol-aware
```

## Hybrid Search, Re-ranking, and Metadata Filtering

Strong retrieval systems rarely rely on a single signal.
Hybrid retrieval combines multiple ways of finding relevant content.
Then reranking sharpens the final candidate list.
Metadata filters constrain the search space to what is actually eligible.

### Why hybrid search often wins

Vector search is good at semantic similarity.
BM25 and related lexical methods are good at exact keywords, identifiers, and rare terms.
Enterprise queries often need both.

Examples where lexical search is critical:

- error codes,
- class names,
- feature flags,
- ticket IDs,
- policy numbers,
- version strings,
- API field names.

Examples where semantic search is critical:

- paraphrased questions,
- concept-level queries,
- synonym-heavy user language,
- vague but intent-rich requests.

Hybrid search combines both worlds.
That is why it frequently outperforms either pure BM25 or pure vector search alone.

### BM25 plus vector retrieval

A common production pattern is:

1. run BM25 to get lexical candidates,
2. run vector search to get semantic candidates,
3. merge the result lists,
4. apply fusion or reranking,
5. send the best final context to generation.

This is especially valuable for code, operational documents, and enterprise knowledge bases with lots of structured identifiers.

### Reciprocal Rank Fusion

Reciprocal Rank Fusion, or RRF, is a simple and effective way to combine ranked lists.
Instead of trying to normalize scores from different retrievers directly, RRF uses rank positions.

A typical formula looks like:

`RRF(d) = Σ 1 / (k + rank_i(d))`

Where:

- `d` is a document,
- `rank_i(d)` is the rank from retriever `i`,
- `k` is a damping constant.

Why engineers like RRF:

- simple,
- robust,
- no need to align score scales across BM25 and vector systems,
- often strong in practice.

### Re-ranking with cross-encoders

After hybrid retrieval, reranking is where you buy precision.
A cross-encoder can consider the actual query-document pair and output a tighter relevance score.

Typical gains from reranking:

- fewer irrelevant top passages,
- better handling of subtle distinctions,
- improved answer grounding,
- better top-3 or top-5 quality even if top-50 recall was already decent.

Typical costs:

- higher latency,
- higher compute cost,
- limited throughput unless batched carefully.

You should rerank when:

- the answer quality is highly sensitive to top-k precision,
- your users ask subtle questions,
- the corpus contains many near-matches,
- or the generator context budget is limited.

### Metadata filtering

Metadata filters apply structured constraints before or during retrieval.
This is essential, not optional, in many systems.

Common filters include:

- tenant or customer,
- product area,
- region,
- document type,
- version,
- access scope,
- date range,
- repository or branch.

Why pre-filters matter:

- they reduce irrelevant candidates,
- they improve latency by shrinking search scope,
- they prevent policy or permission violations,
- they improve answer faithfulness by excluding misleading near-neighbors.

### Pre-filter versus post-filter

Filtering after retrieval is often wrong for both relevance and safety.
If you retrieve across all tenants and then discard disallowed results, you may throw away the true nearest neighbors and degrade answer quality.
You also increase exposure risk in logs and traces.

Prefer structured pre-filtering whenever the system supports it.

### Retrieval stack comparison

| Layer | Role | Typical tools |
| --- | --- | --- |
| Lexical retrieval | Exact term matching | BM25, inverted index |
| Semantic retrieval | Meaning-based candidate generation | Embeddings + ANN |
| Fusion | Combine multiple retrievers | RRF, weighted merge |
| Reranking | Improve top-k precision | Cross-encoder |
| Filtering | Enforce scope and structure | Metadata predicates |

### So what for engineers

If you only implement vector similarity, you are building an incomplete retriever.
In most serious systems, the higher-performing design is:

- filtered search,
- hybrid retrieval,
- fusion,
- reranking,
- then answer generation.

:::tip Practical sequence
Add metadata filters before chasing better models.
Add hybrid retrieval before chasing larger embedding dimensions.
Add reranking before expanding context windows blindly.
:::

```ts
type SearchRequest = {
  query: string;
  tenantId: string;
  product?: string;
  version?: string;
};

async function retrieve(request: SearchRequest) {
  const filters = {
    tenantId: request.tenantId,
    ...(request.product ? { product: request.product } : {}),
    ...(request.version ? { version: request.version } : {}),
  };

  const [bm25Hits, vectorHits] = await Promise.all([
    lexicalSearch(request.query, filters),
    vectorSearch(request.query, filters),
  ]);

  const fused = reciprocalRankFusion([bm25Hits, vectorHits]);
  return rerank(request.query, fused.slice(0, 50));
}
```

## Evaluating RAG Systems

You cannot improve retrieval by vibe.
You need evaluation datasets, metrics, and traceability from query to answer.

### Retrieval metrics

Retrieval metrics measure whether relevant chunks are found and where they rank.

#### Recall@k

Recall@k asks whether at least one relevant item appears in the top `k` results, or more generally what fraction of relevant items are retrieved within top `k`.
It is a core signal for first-stage retrieval.

If recall@20 is poor, your retriever is missing the answer neighborhood entirely.
No generator prompt can save that.

#### Mean Reciprocal Rank

MRR focuses on how early the first relevant result appears.
It rewards systems that surface a good hit near the top.
That matters because many serving stacks only pass a few chunks forward.

#### NDCG

NDCG, normalized discounted cumulative gain, accounts for graded relevance and rank position.
It is useful when some chunks are more relevant than others, which is common in real corpora.

| Metric | What it tells you | Best use |
| --- | --- | --- |
| Recall@k | Did the retriever find relevant material? | First-stage retriever quality |
| MRR | How early does the first strong hit appear? | Top-result usefulness |
| NDCG | How well is the whole ranked list ordered? | Multi-grade ranking evaluation |

### Generation metrics

Retrieval is necessary but not sufficient.
You also need to evaluate the final answer.

Common generation-oriented dimensions include:

- faithfulness to retrieved context,
- answer relevance to the question,
- context relevance of the retrieved passages,
- citation accuracy,
- completeness,
- abstention quality when evidence is insufficient.

These metrics are partly subjective, which is why curated eval sets and rubric-based review matter.

### RAGAS and structured RAG evaluation

RAGAS is a popular framework for evaluating RAG systems.
It focuses on dimensions such as:

- faithfulness,
- answer relevance,
- context relevance,
- context precision.

Its value is not that it replaces human judgment.
Its value is that it gives teams a repeatable evaluation harness for comparing pipeline changes.

Use RAGAS or similar frameworks as part of a broader eval strategy.
Do not confuse an automated score with a complete quality guarantee.

### Building an eval set

A good retrieval eval set usually contains:

- realistic user questions,
- accepted reference answers or relevant documents,
- expected metadata constraints,
- known edge cases,
- adversarial or ambiguous queries,
- freshness-sensitive cases.

Sources for eval queries include:

- support tickets,
- internal search logs,
- documentation feedback,
- resolved incidents,
- expert-authored challenge sets.

### Evaluating retrieval and generation separately

Do not collapse everything into one final-answer score.
Separate the pipeline.

- Retrieval eval asks: did we fetch the right evidence?
- Generation eval asks: did we use the evidence well?

This decomposition helps diagnose regressions.
If recall rises and answer faithfulness falls, the issue might be prompt construction or context overload.
If answer relevance falls while generator settings are unchanged, the retriever may be drifting.

### Online evaluation

Offline evals are essential.
They are also incomplete.
Production systems benefit from online signals such as:

- click-through or citation-open rate,
- reformulation rate,
- user thumbs up or down,
- escalation rate to human support,
- task completion rate.

Be careful with naive proxies.
Users sometimes rate a fast wrong answer higher than a slow cautious answer.
Design feedback loops with that bias in mind.

### So what for engineers

Treat retrieval evaluation like test coverage for a search system.
Every major change should answer these questions.

- Did recall@k improve or regress?
- Did reranking improve NDCG enough to justify latency?
- Did the final answer become more faithful?
- Did filter logic accidentally exclude relevant documents?
- Did chunking changes help one source type while hurting another?

:::warning Common mistake
Do not evaluate only on synthetic benchmark questions.
If your real traffic contains acronyms, ticket IDs, code symbols, and product shorthand, your eval set must contain them too.
:::

```shell
# Example: run an offline RAG eval suite
node scripts/eval-rag.js \
  --queries docs/eval/enterprise-rag.json \
  --metrics recall@5,recall@20,mrr,ndcg,faithfulness,answer-relevance
```

## Production RAG Patterns

Once a RAG prototype works in a notebook or demo script, engineering work begins.
Production retrieval is mostly about change management, data freshness, cost control, and observability.

### Indexing pipeline design

A robust indexing pipeline usually has explicit stages and checkpoints.

- source fetch,
- content extraction,
- normalization,
- chunking,
- metadata enrichment,
- embedding,
- write to store,
- validation and reconciliation.

Good pipeline properties include:

- idempotent reprocessing,
- versioned document identifiers,
- dead-letter handling,
- checksum-based change detection,
- metrics for dropped or malformed documents.

### Incremental updates

Most corpora change over time.
Rebuilding the entire index on every change is often wasteful.
Incremental indexing is usually the right answer.

Useful patterns include:

- detect changed documents via content hash,
- re-embed only affected chunks,
- tombstone deleted documents,
- preserve version metadata for rollback and audit.

Freshness bugs are common and subtle.
For example, if you delete old chunks asynchronously but query the index immediately, users may receive mixed-version answers.
Design update semantics deliberately.

### Embedding cache

Embedding cost can become significant.
Caching helps in two places.

- Document embedding cache during indexing.
- Query embedding cache for repeated or normalized queries.

Document caching is straightforward when content hashes are stable.
Query caching needs care because user queries can vary in wording.
Normalization or semantic caching can help, but measure before adding complexity.

### Query rewriting

Some user queries are too vague or too conversational for direct retrieval.
Query rewriting can improve recall.

Examples:

- expand acronyms,
- insert missing product names from session context,
- rewrite pronouns to explicit entities,
- convert a chat follow-up into a standalone question.

This is especially important in conversational systems where users ask “what about for EU customers?” after earlier turns.
The retriever needs the resolved query, not just the literal final message.

### HyDE

HyDE stands for Hypothetical Document Embeddings.
The idea is to ask a model to generate a hypothetical answer or passage for the query, embed that synthetic passage, and search using it.

Why it can help:

- user queries are short and underspecified,
- the hypothetical passage may better match document style,
- retrieval quality can improve for concept-heavy questions.

Why it can hurt:

- it adds latency and complexity,
- the hypothetical text may drift into the wrong concept neighborhood,
- it is not a substitute for solid baseline retrieval.

Treat HyDE as an evaluated enhancement, not a default requirement.

### Context assembly and deduplication

Top-k retrieval often returns overlapping or redundant chunks.
A good context builder should:

- deduplicate near-identical chunks,
- preserve source diversity when useful,
- merge adjacent chunks when continuity matters,
- cap total tokens by budget,
- keep source labels intact for citations.

### Observability for retrieval

At minimum, log these artifacts for sampled requests.

- normalized query,
- filters,
- retriever hits,
- fusion output,
- reranker output,
- final chunks sent to generation,
- answer text,
- user feedback when available.

Without these traces, debugging “bad answers” becomes folklore.

### Cost controls

Retrieval systems spend money in multiple places.

- embedding generation,
- vector storage,
- ANN compute,
- reranking,
- final generation tokens.

Good cost controls include:

- batch embedding jobs,
- caching,
- selective reranking,
- adaptive top-k,
- skipping expensive steps for trivial queries.

### So what for engineers

The prototype milestone is not “we answered a few questions.”
The real milestone is “we can re-index safely, trace failures, measure recall, and keep costs predictable.”

:::tip Production habit
Create a small “golden questions” set tied to critical business tasks.
Run it on every major indexing, chunking, or ranking change.
This catches regressions earlier than waiting for user complaints.
:::

## When to Use RAG vs Fine-Tuning vs Long Context

These options are complementary.
They are not interchangeable.

### Decision framework

| Need | Best default choice | Why |
| --- | --- | --- |
| Frequently changing knowledge | RAG | External knowledge can be updated without retraining |
| Organization-specific documents and policies | RAG | Retrieval gives explicit, inspectable evidence |
| Consistent style or structured behavior | Fine-tuning | Behavior adaptation lives better in weights |
| Small corpus that fits comfortably in prompt | Long context | Simplest path when retrieval infra is unnecessary |
| Massive corpus with sparse relevant facts | RAG | Selective retrieval beats dumping everything |
| Better task policy or tool use habits | Fine-tuning or agent tuning | Retrieval does not teach behavior |

### RAG is usually right when

- the corpus changes daily or weekly,
- users need citations,
- permissions matter,
- facts must be inspectable,
- knowledge spans too many documents for naive long context.

### Fine-tuning is usually right when

- the problem is behavioral rather than factual,
- you want stable response patterns,
- you need the model to follow domain-specific output conventions,
- retrieval is already good but answer style is not.

### Long context is usually right when

- the source material per request is already known,
- the document set is small,
- latency is acceptable,
- you do not need a full search layer yet.

Examples include:

- summarizing one meeting transcript,
- reviewing one pull request with known files,
- extracting action items from one PDF.

### Combining strategies

Many production systems combine all three.

- Use RAG for dynamic knowledge.
- Use fine-tuning for response behavior or tool use habits.
- Use long context to pass selected retrieved evidence or full single-document context.

### So what for engineers

Do not start by asking “which technique is best?”
Start by asking where the system’s truth should live.

- If truth lives in changing documents, use retrieval.
- If truth is already in the request payload, long context may be enough.
- If the issue is behavior, not knowledge, fine-tuning may help more.

:::warning Strategy mistake
Trying to solve stale knowledge with fine-tuning creates operational pain.
Trying to solve poor tool-use behavior with RAG creates architectural noise.
Match the technique to the bottleneck.
:::

## Key Takeaways

- Embeddings are dense vectors that capture semantic proximity, not perfect understanding.
- Cosine similarity, dot product, and normalization choices materially affect retrieval behavior.
- Embedding models, rerankers, and generators optimize for different jobs.
- Vector databases matter because ANN indexing makes large-scale semantic search practical.
- HNSW is a strong default for many production systems; IVF-PQ matters more at larger scale and tighter memory budgets.
- RAG quality depends on the full indexing and serving pipeline, not just the model.
- Chunking policy is often a bigger lever than swapping between already-strong embedding models.
- Hybrid retrieval usually beats pure vector retrieval in enterprise settings.
- Cross-encoder reranking often improves precision enough to justify targeted use.
- Metadata pre-filters are critical for relevance, safety, and multi-tenant correctness.
- Evaluate retrieval and generation separately using metrics like recall@k, MRR, NDCG, and grounded-answer measures.
- Production RAG requires incremental indexing, observability, caching, and explicit change management.
- Use RAG for current external knowledge, fine-tuning for behavior, and long context when the relevant material is already known per request.

## Further Reading

- Lewis et al., “Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks”: https://arxiv.org/abs/2005.11401
- RAGAS documentation and project resources: https://docs.ragas.io/
- Pinecone Learning Center: https://www.pinecone.io/learn/
- Weaviate blog and learning content: https://weaviate.io/blog
- Qdrant documentation: https://qdrant.tech/documentation/
- `pgvector` project documentation: https://github.com/pgvector/pgvector
- Cohere Embed and Rerank docs: https://docs.cohere.com/
- Nomic Embed resources: https://docs.nomic.ai/
- BGE model collection and usage notes: https://huggingface.co/BAAI
