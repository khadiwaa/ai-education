---
theme: default
title: "Module 2: Using AI Effectively"
info: |
  Phase 1 — AI Essentials for Engineers
  Module 2 of 3
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Using AI Effectively

**Module 2 of 3 — AI Essentials for Engineers**

*Prompts, context, hallucination, and retrieval*

---

# What we're covering today

<v-clicks>

- **Context windows** — the model's working memory and why it's a hard limit
- **Prompt engineering** — practical techniques that actually move the needle
- **Hallucination** — what it is, why it's unavoidable, and how to work with it
- **RAG** — the dominant pattern for grounding models in real knowledge
- **Memory** — how AI systems persist (and don't persist) state

</v-clicks>

<br>

> After this module you'll know how to get dramatically better results from any LLM, and you'll understand why AI sometimes confidently says wrong things.

---

# The context window

Every model has a **context window** — the total amount of text it can "see" at once.

<br>

<v-clicks>

Think of it as the model's working memory. Everything inside the window influences the response. Everything outside it doesn't exist.

The context window includes: your message, any system instructions, the conversation history, and any documents you've provided.

</v-clicks>

<br>

| Model | Context window |
|-------|---------------|
| GPT-4o | 128K tokens (~96K words) |
| Claude 3.5 Sonnet | 200K tokens (~150K words) |
| Gemini 1.5 Pro | 1M tokens (~750K words) |
| Smaller / local models | 4K–32K |

---

# Context window: what it means in practice

<v-clicks>

**Good:** You can feed in large codebases, long documents, full conversation history.

**Bad:** There's a hard limit. Past the limit, the model literally cannot see that content.

**Subtle:** More context doesn't always mean better results. Models tend to "lose" information buried in the middle of very long contexts — they're more reliable on what's at the beginning and end.

**Cost:** You pay per token. Bigger context = more expensive.

</v-clicks>

<br>

<v-click>

**Practical implication:** When using a coding assistant with your whole codebase as context, be intentional about *what* you include. Signal-to-noise matters.

</v-click>

---

# Anatomy of a prompt

Every interaction with an LLM has (at least) these components:

<br>

```
┌─────────────────────────────────────────────┐
│  SYSTEM PROMPT                              │
│  "You are a helpful assistant that..."      │
│  (set by the tool/product, often hidden)    │
├─────────────────────────────────────────────┤
│  CONVERSATION HISTORY                       │
│  [previous messages, if any]                │
├─────────────────────────────────────────────┤
│  USER MESSAGE                               │
│  "Refactor this function to..."             │
└─────────────────────────────────────────────┘
```

<v-click>

The system prompt is what Copilot, ChatGPT, and other tools use to shape model behavior before your message even arrives. It's why the same underlying model (say, GPT-4o) behaves differently in different products.

</v-click>

---

# Zero-shot vs. few-shot

**Zero-shot:** just ask. No examples provided.

```
"Summarize this meeting transcript in 3 bullet points."
```

<br>

<v-click>

**Few-shot:** show the model what "good" looks like with examples before your actual request.

```
"Here are two examples of the summaries I want:

Example 1: [input] → [output]
Example 2: [input] → [output]

Now summarize this transcript: [your transcript]"
```

</v-click>

<br>

<v-click>

**When to use few-shot:** when you need a specific format, tone, or style. When zero-shot keeps missing the mark. A couple of good examples beats paragraphs of instructions.

</v-click>

---

# Chain-of-thought prompting

For complex reasoning tasks, tell the model to **think step by step**.

<br>

```
❌  "What's the best database architecture for this use case?"

✅  "Walk me through the tradeoffs of different database
    architectures for this use case, then give me your
    recommendation."
```

<br>

<v-clicks>

Why it works: when a model has to write out its reasoning, it's more likely to catch errors in its own logic — the "thought" becomes part of the context that informs the final answer.

Useful for: technical decisions, debugging, architecture review, anything where you want the reasoning visible.

Not needed for: simple lookups, format conversions, well-defined tasks.

</v-clicks>

---

# Temperature: controlling randomness

**Temperature** controls how "creative" (random) the model's token selection is.

<br>

| Temperature | Behavior | Use when |
|-------------|----------|----------|
| 0.0 | Deterministic — always picks the highest-probability token | Code generation, data extraction, factual Q&A |
| 0.7 | Balanced — some creativity, stays coherent | General chat, summaries, writing assistance |
| 1.0+ | More random — diverse, sometimes surprising | Brainstorming, creative writing |

<br>

<v-click>

**Practical note:** Most coding tools (Copilot, Cursor) use low temperatures. Most chat interfaces use something in the 0.7 range. You can usually set this in API calls.

</v-click>

---

# Hallucination

This is the most important reliability concept in AI.

<br>

> **Hallucination:** The model confidently states something that is false.

<br>

<v-clicks>

It's not "lying" — the model has no concept of truth. It's predicting the next most-likely token, and sometimes the most statistically likely token is wrong.

The model has no internal fact-checker. It can't distinguish between things it "knows" and things it's making up.

**Classic examples:** Fabricated citations, made-up API method names, incorrect dates, plausible-sounding but wrong technical details.

</v-clicks>

---

# Why hallucination happens

Connecting back to Module 1:

<br>

<v-clicks>

**Next-token prediction** selects the statistically most probable continuation — not the factually correct one. These are usually the same for common knowledge, but diverge for:

- Niche topics with little training data
- Very specific numbers (dates, version numbers, statistics)
- Questions at the edge of what the model knows
- Questions the model was never trained to answer correctly

The model was trained to produce text that *looks* correct, not text that *is* correct. This distinction matters enormously.

</v-clicks>

---

# Working with hallucination

You can't eliminate it. You can manage it.

<br>

<v-clicks>

**High risk:** Specific facts (dates, stats, citations), API documentation details, legal/medical/financial claims, anything the model should "know" but might not.

**Low risk:** Summarizing text you provide, reformatting data, writing boilerplate code for well-known patterns, explaining concepts at a general level.

**Mitigation strategies:**
- Give the model the source material (don't ask it to recall facts from training)
- Ask for citations and check them
- Use chain-of-thought to surface reasoning
- Treat AI output as a first draft, not ground truth

</v-clicks>

---

# The grounding principle

The single most effective way to reduce hallucination:

<br>

> **Don't ask the model to recall. Give it the information and ask it to reason.**

<br>

<v-clicks>

```
❌  "What are the rate limits for our internal API?"

✅  "Here is the API documentation: [paste docs]
    What are the rate limits?"
```

When the model has the information in its context window, it's summarizing and reasoning — not recalling from training. This is dramatically more reliable.

This principle is the foundation of RAG.

</v-clicks>

---

# RAG: Retrieval-Augmented Generation

The dominant pattern for grounding AI in real, up-to-date knowledge.

<br>

```
User asks a question
        ↓
Search relevant documents / data
        ↓
Inject those documents into the prompt
        ↓
Model answers based on the provided context
        ↓
Response
```

<br>

<v-click>

The model isn't recalling from training data — it's reading the documents you injected. This makes it far more accurate for questions about your specific codebase, docs, or data.

</v-click>

---

# Why RAG instead of just training?

<br>

| Approach | Good for | Bad for |
|----------|----------|---------|
| **Prompt (just ask)** | General knowledge, reasoning tasks | Specific current facts |
| **RAG** | Up-to-date docs, private data, precise facts | Real-time data (still has a retrieval step) |
| **Fine-tuning** | Teaching *style* and *behavior* | Teaching factual knowledge reliably |
| **Bigger context window** | Fitting more in at once | Always having the right thing in context |

<br>

<v-click>

**Rule of thumb:** If the question is about your private data or anything that changes — use RAG. If it's about general concepts and reasoning — prompting alone is often enough.

</v-click>

---

# Memory in AI systems

LLMs have no memory between conversations. Every call starts fresh.

<br>

<v-clicks>

**Short-term (in-context):** Include previous messages in the prompt. This is how chat history works — it's just passed along each time. Limited by context window size.

**Medium-term (files):** The model reads/writes files as persistent storage. This is how coding agents (like Copilot CLI) maintain state across sessions — they write notes to files and read them back.

**Long-term (vector database):** Embed past interactions and retrieve relevant ones by meaning. This is how "memory" features in ChatGPT and Claude work.

</v-clicks>

<br>

<v-click>

When you start a new chat with an AI tool, it doesn't remember your last conversation — unless the product explicitly implements a memory mechanism.

</v-click>

---

# 🔬 Hands-on: four-way prompt comparison

Take one real task from your work. Solve it four ways:

<br>

1. **Zero-shot** — just ask directly
2. **Few-shot** — give 2–3 examples of what you want before asking
3. **Chain-of-thought** — ask it to reason step by step before answering
4. **With context** — paste in the relevant documentation or code, then ask

<br>

Compare the quality of responses. Notice which approach works best for which type of task.

---

# Vocabulary for Module 2

<br>

| Term | What it means |
|------|--------------|
| **Context window** | The total text a model can see at once — its working memory |
| **System prompt** | Pre-set instructions from the tool/product, before your message |
| **Zero-shot** | Asking without examples |
| **Few-shot** | Providing examples before your request |
| **Chain-of-thought** | Asking the model to reason step by step |
| **Temperature** | How random/creative the model's output is |
| **Hallucination** | When a model confidently states something false |
| **Grounding** | Providing source material so the model reasons from fact, not recall |
| **RAG** | Retrieval-Augmented Generation — search + inject + generate |
| **Embedding** | A vector representation of text, used for semantic search |
| **Vector database** | Where embeddings are stored for fast similarity search |
| **Memory** | How AI systems persist state across turns/sessions |

---

# What to take away

<v-clicks>

1. **Context window = working memory.** If it's not in the window, the model doesn't know it.

2. **Few-shot beats long instructions.** Show examples, don't just describe.

3. **Hallucination is structural, not a bug to fix.** Manage it by grounding the model in provided context.

4. **RAG is the dominant production pattern** for questions about specific, current, or private data.

5. **AI has no memory by default.** State persistence is something applications implement on top.

</v-clicks>

---

# Up next: Module 3

**AI in Your Engineering Workflow**

- How coding assistants actually work
- Agents, tools, and MCP
- Practical AI in your daily engineering work
- Security: prompt injection every engineer must know

---
layout: center
---

# Questions?

*Module 2 of 3 — AI Essentials for Engineers*
