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

<!--
Welcome back. Module 1 gave us the mechanics — what's actually happening inside these models. Module 2 is the practical toolkit: how do you use them well, and what are the patterns that work in production?

This module has three big themes:
1. Context: how the model "sees" your conversation, and the hard limits involved
2. Prompting: the techniques that actually move the needle on response quality
3. Reliability: hallucination, grounding, and RAG — the most important production pattern in AI today

Estimated time: 40–50 minutes.
-->

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

<!--
The "dramatically better results" is not an exaggeration. The difference between a naive prompt and a well-engineered prompt can be the difference between output you can use and output you have to throw away. We'll make this concrete with examples.

The hallucination section is the most important conceptually — it's the source of most AI failures in production and the thing that catches engineering teams off guard.
-->

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

<!--
The context window is one of the most important concepts for building AI features and using AI tools well.

Analogy: imagine a person who is extremely intelligent and can hold complex ideas in their head — but can only read from a single sheet of paper at a time. Everything on that sheet, they know. Everything not on that sheet, they have no access to. That's the context window.

The practical implications:

CONVERSATION HISTORY: Chat interfaces manage context by appending your entire conversation to every new message. This is why long conversations can feel slower and more expensive — and why some tools "summarize" old messages when the context gets long, to make room.

CODEBASE ACCESS: When Copilot helps with code, it doesn't have access to your entire repository. It has access to whatever the tool injected into the context — usually the current file, some related files, and maybe workspace metadata. The more precisely the tool chooses what to include, the better the results.

COST: You pay for every token in the context, every time. A 200K token context × 1,000 requests/day × $5/million tokens = $1,000/day just in input costs. Context management is cost management.

QUALITY: More context doesn't always mean better results. There's a well-documented phenomenon called "lost in the middle" — models perform worse on information buried in the middle of a very long context vs. information at the beginning or end. If you're feeding a model a 100-page document, key facts in the middle might be effectively invisible.
-->

---

# Context window: what it means in practice

<v-clicks>

**Good:** You can feed in large files, long documents, full conversation history — up to the limit.

**Bad:** There's a hard limit. Past the limit, the model literally cannot see that content.

**Subtle:** "Lost in the middle" — information buried deep in a long context is less reliably used than information at the start or end.

**Cost:** You pay per token. Bigger context = higher cost per request.

</v-clicks>

<br>

<v-click>

**Practical implication:** When using a coding assistant with your codebase as context, be intentional about *what* you include. Signal-to-noise matters.

</v-click>

<!--
The "lost in the middle" finding comes from a Stanford research paper. When researchers tested models with long contexts, they found retrieval accuracy was highest for information at the beginning and end of the context, and lowest for information in the middle. This is counterintuitive — you'd expect consistent performance throughout.

Practical consequence: if you're building a RAG system and injecting 10 retrieved documents into the context, the order matters. Put the most relevant documents first (or last), not buried in the middle of a big block.

For Copilot users: notice that Copilot often performs better when the relevant code is in your current file or open tabs. That's because what's "near" in your editor is what gets prioritized in context injection. If you want Copilot to know about a function in a different file, either open that file or paste the relevant section into your current chat.

Signal-to-noise: a common mistake is to dump everything you can into the context thinking "more information = better answers." But noisy context (lots of irrelevant information) can actually degrade performance. The model has to sort through it all, and irrelevant text can subtly confuse the output. Be selective and intentional.
-->

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

The system prompt is what Copilot, ChatGPT, and other tools use to shape model behavior before your message even arrives. It's why the same underlying model behaves differently in different products.

</v-click>

<!--
This diagram is worth spending time on because it demystifies a lot of "why does the AI behave like this?" questions.

THE SYSTEM PROMPT: This is a block of text injected before your first message. It's set by whoever built the product, not you. For ChatGPT, OpenAI's system prompt shapes its safety behaviors, tone, and refusals. For Copilot, GitHub's system prompt tells the model what kind of assistant it is, what tools it has, and how to behave. For a custom AI feature your team builds, the system prompt is yours to write — it's how you give the model its "personality" and constraints.

Why does the same model behave differently in different products? System prompts. You can take the exact same Claude Sonnet model and:
- With no system prompt: it'll do basically anything
- With a system prompt that says "You are a children's educational assistant": it'll refuse adult content and simplify language
- With Anthropic's Claude.ai system prompt: it gets all the safety behaviors you see in production

This is both powerful and important for security: system prompts can be leaked through prompt injection attacks (we cover this in Module 3).

CONVERSATION HISTORY: Every message in your current conversation gets appended to the context on each turn. The model doesn't have persistent memory — it just sees all the messages together each time. This is also why "starting a new chat" resets context.

TOOL DEFINITIONS: Not shown here, but coding agents also inject tool definitions (what tools the agent can use) into the prompt. These descriptions are part of what gets tokenized and charged.
-->

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

<!--
Zero-shot is what most people do by default — you just ask. It works well for common tasks that the model has seen millions of examples of during training (summarization, code generation, explanation).

It breaks down when:
- You need a very specific output format the model doesn't know to produce
- You have domain-specific requirements (internal terminology, specific voice/tone)
- The task is unusual or the model keeps missing what you're after

Few-shot is dramatically more effective for format-specific tasks. Instead of writing a three-paragraph explanation of the format you want, you just show two examples. The model pattern-matches much better than it follows complex instructions.

Example from practice: if you're building an AI feature that generates commit messages in a specific format your team uses (say: "[ticket-id]: [what changed] — [why it matters]"), it's much more reliable to give 3 example pairs than to write a rule. The model learns the format from examples rather than descriptions.

Important: few-shot examples need to be high quality. Bad examples teach bad patterns. If you're using few-shot to set a tone and your examples have subtle errors, the model will reproduce those errors.

The "few" in few-shot usually means 2–5 examples. Diminishing returns after that, and you're using up valuable context.
-->

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

<!--
Chain-of-thought is one of the most well-studied prompting techniques, and it actually works for an interesting reason.

Remember: models generate token by token, each conditioned on what came before. When you ask "what's the answer?" directly, the model jumps to the output immediately. When you ask it to reason step by step, it generates those reasoning steps as tokens — and those tokens become part of the context for the final answer.

In other words: the model literally "thinks out loud" and then uses its own thought process as input to the final answer. This is why the output quality improves — the reasoning tokens catch logical errors and inconsistencies before the model commits to a final answer.

Research finding: a study from Google showed that simply adding "Let's think step by step" to a math problem prompt improved accuracy on arithmetic benchmarks from ~18% to ~79%. That's a massive improvement from four words.

When NOT to use it: for simple, unambiguous tasks, chain-of-thought adds latency and cost with no benefit. "Convert this JSON to CSV" doesn't need step-by-step reasoning. Save it for genuinely complex tasks.

The "show your work" framing is useful for engineering decisions: asking for chain-of-thought on an architecture question not only gets better answers, it makes the reasoning auditable. You can read the reasoning and push back on specific steps rather than just getting an answer you have to trust or reject wholesale.
-->

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

<!--
Temperature is a parameter that affects how the model samples from its probability distribution at each step.

Without temperature: the model always picks the highest-probability token. Completely deterministic — same input always produces the same output (deterministic in the sense that there's no randomness, though in practice floating point precision can cause tiny variations).

With temperature > 0: instead of always picking the top token, the model samples from a probability distribution that's been modified by the temperature value. Higher temperature = flatter distribution = more "surprising" choices.

Mathematical detail for the curious: the logits (raw scores from the model) are divided by the temperature value before softmax. Low temperature sharpens the distribution (high-probability tokens become even more dominant). High temperature flattens it (less-probable tokens get more chance to be selected).

Practical implications:
- Low temperature (0–0.3): code, structured data extraction, anything that needs to be reliable and repeatable. Two runs should produce the same output.
- Medium temperature (0.5–0.8): most chat and writing tasks. Good balance between coherent and varied.
- High temperature (0.9+): brainstorming, creative writing, generating diverse options. Output can be surprising — sometimes brilliantly, sometimes incoherently.

API users: temperature is exposed as a parameter in all major APIs. For AI features in production, you'll want to set this explicitly rather than relying on the default.

Related parameters (not covered in depth here):
- top_p: alternative sampling strategy based on cumulative probability
- top_k: limit sampling to the top K highest-probability tokens
These are alternatives to temperature that accomplish similar goals. In practice, most teams use temperature and leave the others at defaults.
-->

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

<!--
This slide is the most important in Module 2. Pause here and make sure it lands.

The framing matters: hallucination is not a bug to be fixed. It's a structural consequence of how these models work. Next-token prediction optimizes for statistical likelihood, not factual accuracy. Usually those correlate. When they don't, hallucination happens.

The word "hallucination" is a bit misleading — it implies something strange and obvious. In practice, hallucinations are often subtle and perfectly plausible. The model generates text that looks exactly like accurate, authoritative output. This is what makes it dangerous.

Real examples:
1. A lawyer using ChatGPT to research case citations — the model fabricated six case citations that looked real, with proper formatting, realistic case names, plausible-sounding outcomes. The lawyer submitted them in a brief. The cases didn't exist. The lawyer faced sanctions.
2. Developers asking about API methods — the model invents method names that follow the naming conventions of the library but don't exist. The code looks correct. It fails at runtime.
3. Research summaries — the model correctly identifies real papers but invents statistics or conclusions that weren't in those papers, attributed to the real author.

The confidence issue: there's no calibration signal in the output. A correct answer and a hallucinated answer look identical. The model doesn't "know" when it's uncertain. Some models add uncertainty language ("I'm not sure, but...") but this isn't reliable — they can still be confident when wrong and uncertain when right.

Connection to Module 1: this is a direct consequence of next-token prediction. The model predicts the statistically most likely tokens, not the factually correct ones. "Paris" follows "The capital of France is" in billions of training examples — reliable. "The method db.getUser().withFilter()" may be extrapolated from patterns in the training data even if that specific method doesn't exist — unreliable.
-->

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

<!--
Let's make this concrete with a mental model.

Imagine the training process from the model's perspective. It's seen billions of sentences. It's learned that certain tokens follow other tokens with certain probabilities. It's never been explicitly taught "this is true" vs. "this is false" — it's only been taught "this token sequence is likely" vs. "unlikely."

For well-represented knowledge (major cities, common programming patterns, historical events that appeared millions of times in training data), the statistical patterns and factual accuracy are extremely well aligned. Asking "what's the capital of France" reliably gives Paris because "Paris" follows "capital of France" in nearly every training example.

For underrepresented knowledge (niche topics, recent events, your company's internal APIs, very specific numbers), the model may have seen only a few examples — or none. When it needs to fill that gap, it generates statistically plausible text based on similar patterns. This is hallucination.

Key insight: the model cannot tell you what it doesn't know. It has no uncertainty quantification on specific facts. It doesn't know that it's extrapolating vs. accurately recalling. It just predicts the next token.

Types of hallucination:
1. Factual errors: wrong facts about real things ("The Eiffel Tower is 400 meters tall")
2. Fabricated specifics: real entities with invented details (invented paper statistics)
3. Confabulation: mixing real and invented information plausibly
4. Code hallucination: methods, parameters, or behaviors that don't exist in the actual library
5. Temporal confusion: facts that were true in training data but have since changed

The "recency" issue: models have a training cutoff. Ask about events after that cutoff and you may get hallucinated answers that sound plausible. This is why "as of [date]" qualifications matter.
-->

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

<!--
The risk calibration here is really important for engineering teams making decisions about where to use AI.

HIGH RISK (be very careful):
- "What does our internal auth service's API look like?" → model will hallucinate based on similar APIs it's seen. Always provide the actual docs.
- "What were the exact performance numbers from our Q3 report?" → model doesn't have your internal data. Provide it.
- "What version of React should we use?" → model may have outdated training data. Check the actual docs.
- Any legal, medical, or financial advice → don't.

LOW RISK (AI is genuinely helpful and reliable here):
- "Here is a meeting transcript. Summarize the key decisions." → model is reading text you provided, not recalling facts. Very reliable.
- "Here is a function. Write a unit test for it." → model is generating based on code you provided. Generally reliable, though check edge cases.
- "Explain what the Builder pattern is." → common concept well-represented in training data. Reliable.
- "Convert this JSON to this schema." → pure transformation, no recall required. Reliable.

Mitigation strategies explained:
1. Give the model the source material: this is the most powerful mitigation. If you're asking about your API, paste the API docs. If you're asking about a library, paste the relevant documentation. The model shifts from "recall from training" to "summarize/reason about provided text" — much more reliable.
2. Citations: ask the model to cite specific passages from provided text. Easier to verify.
3. Chain-of-thought: the reasoning process can expose logical errors before the final answer.
4. First draft mindset: treat all AI output as a starting point for human review, not a finished product. This is the right default until you've established what the model is reliable for in your specific use case.
-->

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

<!--
This is the single most important practical insight from Module 2.

The grounding principle is almost too simple: if the model needs facts to answer a question, give it those facts. Don't ask it to remember them from training.

Why this works: when you paste documentation into the context, the model's task shifts from "recall from training" to "find the relevant part of this text and summarize it." Finding and summarizing from provided text is what models are incredibly good at. Precise recall from training is where they fail.

Demo opportunity: if you have a laptop handy, try this live:
1. Ask ChatGPT "What are the rate limits for [your internal API]?" → gets it wrong or says it doesn't know
2. Then paste your actual API docs and ask the same question → answers correctly and specifically

The model went from knowing nothing to being highly accurate, just by changing whether you're asking for recall vs. reasoning over provided content.

This is also why RAG (next slide) is so powerful — it's the systematic, automated version of this principle. Instead of manually pasting docs, the system retrieves relevant docs automatically and injects them into the context.

Important caveat: grounding doesn't solve everything. The model can still misunderstand the provided text, miss nuance, or make logical errors in its reasoning. But it eliminates the most common failure mode (factual hallucination) for the grounded information.
-->

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

<!--
RAG is the most commonly used production pattern for AI features right now. Understanding it is essential for anyone evaluating or building AI-powered features.

The core insight: instead of hoping the model knows the answer from training, you retrieve the relevant information at query time and give it to the model. The model's job becomes "answer this question based on the provided documents" rather than "recall this from training."

The retrieval step: how do you know which documents to retrieve? This is where embeddings come in (covered in depth in Phase 2 T3). The short version:
1. Pre-process: encode all your documents as vectors (embeddings)
2. At query time: encode the user's question as a vector
3. Find the documents whose vectors are most similar to the question vector
4. Retrieve those top-k documents
5. Inject them into the prompt

Why "most similar vectors" works: similar meaning = similar vector position. "How do I reset my password?" and "password reset instructions" will be vectorially close even if they share no words. The search is semantic, not keyword-based.

Real-world RAG examples:
- Internal docs chatbot: users ask questions about HR policies, the system retrieves the relevant policy section and the model answers
- Code assistance with private codebase: Copilot Enterprise retrieves relevant code from your repo based on what you're working on
- Customer support automation: ticket comes in, system retrieves similar past tickets and relevant knowledge base articles, model drafts a response
- Our own curriculum: eventually, a study assistant that retrieves relevant sections from these docs when engineers ask questions

When RAG fails: if the right document isn't in your knowledge base, or if the retrieval step surfaces the wrong documents, the model will still get it wrong — but at least it'll often say "I couldn't find this in the provided documentation" rather than hallucinating.
-->

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

<!--
This table gets asked about constantly in AI strategy discussions. Let me walk through each row.

JUST PROMPTING: Perfect for anything that's well-covered in training data and doesn't require private or current information. "Explain how OAuth works." "Review this algorithm for bugs." "Translate this code to TypeScript." No retrieval needed.

RAG: The right tool when you have a body of knowledge that:
- Is private (not in the model's training data)
- Changes frequently (documentation, APIs, policies)
- Needs precise, verifiable answers
The retrieval overhead adds latency, so it's overkill for pure reasoning tasks.

FINE-TUNING: Commonly misunderstood as "making the model know things." Fine-tuning is better understood as "teaching the model to behave differently" — the right tone, format, style, domain-specific output patterns. It's not reliable for injecting factual knowledge because the model can "forget" fine-tuned facts, it can be overridden by prompting, and it doesn't update as facts change. Fine-tuning is expensive and shouldn't be the first tool you reach for.

BIGGER CONTEXT WINDOW: Attractive because it's simple — just put everything in context and let the model figure it out. Works for small knowledge bases. Doesn't scale because of cost (you pay for every token on every request) and the "lost in the middle" problem.

The mental model for choosing:
- "Does the model already know this from training?" → just prompt
- "Is it private/changing knowledge?" → RAG
- "Do I need a specific output style/format/domain behavior?" → consider fine-tuning
- "Is the knowledge base small enough to fit in context efficiently?" → context stuffing might work
-->

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

<!--
Memory is one of the most commonly misunderstood aspects of AI systems for people who use these tools regularly.

The fundamental truth: every API call to an LLM is stateless. The model gets a prompt, generates a response, done. There's no persistent "memory" in the model itself. Everything that feels like memory is implemented by the application layer.

HOW CHAT HISTORY WORKS: When you're in a ChatGPT or Claude conversation, and you make your 10th message, the entire conversation is sent to the model every time. Message 1, message 2, ... message 10, all concatenated. The model doesn't "remember" — it re-reads everything each time. This is why conversations get slower and more expensive over time.

HOW CODING AGENT MEMORY WORKS: Copilot CLI and similar tools often write plan files and context notes to disk. When you start a new session, the agent reads these files back. It's like leaving yourself notes — the "memory" is in the file system, not in the model.

HOW CHATGPT/CLAUDE MEMORY WORKS: These products store summaries of past conversations in a database. When you start a new conversation, relevant memories are retrieved and injected into the system prompt. "User Alex works at a SaaS company with 110 engineers and is focused on AI education." That's a retrieved memory, not something the model remembered.

WHY THIS MATTERS:
1. If you want an AI tool to "know" something from session to session, you need to provide it — either by pasting it in, including it in a system prompt, or using a tool that has memory features.
2. Starting a new chat = wiped context. This can be surprising when you've been working on something for hours.
3. For AI features you build: if continuity matters (e.g., a support bot that should "know" a customer's history), you need to implement memory explicitly — retrieve past interactions and inject them into context.
-->

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

<!--
Give people 5–10 minutes to actually do this if this is a live workshop. If it's a recorded session, encourage people to pause and try it before watching the rest.

Good task types for this exercise:
- Summarize a recent meeting or decision document using different approaches
- Write a code review comment — try zero-shot vs. with the code pasted in
- Explain a technical concept from your domain — zero-shot vs. with source material

Common observations:
- Few-shot dramatically improves format-specific tasks
- Chain-of-thought helps most with multi-step reasoning or tradeoff analysis
- "With context" is almost always better for specific factual questions about your work

The goal is for people to develop an intuition for which technique fits which situation. That intuition is more valuable than memorizing rules.
-->

---

# Vocabulary for Module 2

<br>

| Term | What it means |
|------|--------------|
| **Context window** | Total text a model can see at once — its working memory |
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

<!--
Same note as Module 1: encourage people to take a photo or note terms they want to review.

The reference docs at docs/phase-1/using-ai-effectively cover all of these with more depth and examples.

If anyone wants to go really deep on RAG and embeddings, Phase 2 Module T3 covers the full implementation — vector databases, chunking strategies, hybrid search, RAG evaluation. That's the right next step for engineers who are building or evaluating AI-powered search/docs features.
-->

---

# What to take away

<v-clicks>

1. **Context window = working memory.** If it's not in the window, the model doesn't know it.

2. **Few-shot beats long instructions.** Show examples, don't just describe.

3. **Hallucination is structural, not a bug to fix.** Manage it by grounding the model in provided context.

4. **RAG is the dominant production pattern** for questions about specific, current, or private data.

5. **AI has no memory by default.** State persistence is something applications implement on top.

</v-clicks>

<!--
Five takeaways, same as Module 1. Let's make sure they land.

Quick check opportunity: "Can anyone give me a real example from our product where we'd want to use RAG?" or "What's a task where you'd want temperature = 0?"

Transition to Module 3: Now we have the foundations (Module 1) and the practical toolkit (Module 2). Module 3 is about applying this to your actual engineering work — how coding assistants work, what agents are, the security implications, and practical patterns for getting the most out of AI in your day-to-day work.
-->

---

# Up next: Module 3

**AI in Your Engineering Workflow**

- How coding assistants actually work
- Agents, tools, and MCP
- Practical AI in your daily engineering work
- Security: prompt injection every engineer must know

<!--
Preview the key practical pieces. Module 3 is the most directly actionable of the three — it's where all the theory connects to what engineers actually do every day.

The prompt injection section is particularly important for engineers who are building AI features. Don't skip it.
-->

---
layout: center
---

# Questions?

*Module 2 of 3 — AI Essentials for Engineers*

<!--
Open Q&A. Common questions:

Q: "How do you know when to use RAG vs. fine-tuning?"
A: Quick heuristic — if you're trying to inject knowledge (facts, docs, data), use RAG. If you're trying to change behavior (tone, format, domain-specific output style), consider fine-tuning. In practice, RAG is the right default for 80% of use cases.

Q: "Is there a way to make the model know when it doesn't know something?"
A: Sort of. You can prompt it with "If you're not sure, say you don't know." This helps somewhat. But it's not reliable — models can still be confidently wrong. The better solution is grounding: if the model is only supposed to answer based on provided docs, instruct it explicitly: "Only answer based on the provided documentation. If the answer isn't in the docs, say so."

Q: "What temperature does Copilot use?"
A: Not publicly disclosed, but coding tools generally use low temperatures (0.1–0.3) for code generation to prioritize correctness and repeatability.

Q: "Can we set a custom system prompt for Copilot?"
A: GitHub Copilot for Business/Enterprise has limited customization. For full control over the system prompt, you'd need to use the API directly and build your own integration.
-->
