---
theme: default
title: "Module 1: How AI Actually Works"
info: |
  Phase 1 — AI Essentials for Engineers
  Module 1 of 3
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# How AI Actually Works

**Module 1 of 3 — AI Essentials for Engineers**

*Phase 1: The foundation everything else rests on*

---

# What we're covering today

<v-clicks>

- **Next-token prediction** — the surprisingly simple idea behind all of GenAI
- **Tokens** — what a model actually "sees" (not words, not characters)
- **Parameters** — what "a 70B model" actually means
- **Training vs. inference** — why this distinction matters
- **The vocabulary** you'll use every day

</v-clicks>

<br>

> After this module you'll understand what's happening under the hood when you use Copilot, ChatGPT, or any LLM — and you'll have the vocabulary to evaluate AI proposals your team puts in front of you.

---

# The core idea: next-token prediction

Everything in GenAI comes down to one surprisingly simple task:

<br>

> **Given all the text so far, what word (token) comes next?**

<br>

<v-clicks>

That's it. That's the whole trick.

A model trained on hundreds of billions of examples of text learns to make this prediction extremely well.

When you send a message to an LLM, it's not "thinking" or "reasoning" in the human sense — it's predicting one token at a time, each prediction conditioned on everything that came before.

</v-clicks>

---

# Autoregressive generation

The model generates text **one token at a time**, using its own previous output as input for the next step.

<br>

```
Prompt:  "The capital of France is"
Step 1:  "The capital of France is" → predicts → "Paris"
Step 2:  "The capital of France is Paris" → predicts → "."
Step 3:  "The capital of France is Paris." → predicts → (end)
```

<br>

<v-clicks>

This is called **autoregressive generation**.

It's why models can be slow for long responses — they can't parallelize this process. Every token is sequential.

It also explains why models can drift or hallucinate — each step is a probabilistic prediction, not a fact lookup.

</v-clicks>

---

# What is a token?

Models don't see words. They don't see characters. They see **tokens**.

<br>

<v-clicks>

A token is roughly **3–4 characters** on average in English — somewhere between a character and a word.

Common words are single tokens: `"the"`, `"is"`, `"cat"`

Longer or rarer words split into multiple tokens: `"unbelievable"` → `["un", "believ", "able"]`

Code and symbols can be unpredictable: `"!=="` might be one token or three

</v-clicks>

<br>

<v-click>

**Why does this matter?**
- Token count drives **cost** (you pay per token on most APIs)
- Token count drives **context window** limits
- Unusual words and code may tokenize inefficiently

</v-click>

---

# Tokens in practice

<br>

| Text | ~Tokens |
|------|---------|
| "Hello, how are you?" | 6 |
| A typical paragraph | 75–100 |
| A 1-page document | 500–600 |
| GPT-4o context window | 128,000 |
| Claude's context window | 200,000 |

<br>

<v-click>

**Rule of thumb:** 1 token ≈ ¾ of an English word, or ~4 characters.

A 1,000-word document ≈ 1,300 tokens.

</v-click>

---

# 🔬 Hands-on: tokenizer playground

**Try this right now:**

1. Go to **[platform.openai.com/tokenizer](https://platform.openai.com/tokenizer)**
2. Type the word `strawberry` — how many tokens?
3. Type some code — notice how it tokenizes differently than prose
4. Try a long technical word vs. a common short word

<br>

<v-click>

Notice: `strawberry` = 3 tokens (`straw`, `berry` ... or `s`, `traw`, `berry` depending on model)

This is why models historically struggled to count letters in words — they don't "see" individual characters the way we do.

</v-click>

---

# What are parameters?

When you hear "a 70B model" — those 70 billion numbers are called **parameters** (or weights).

<br>

<v-clicks>

Think of parameters as the model's **learned knowledge** — every relationship, pattern, and fact the model absorbed during training is encoded across those numbers.

More parameters → more capacity to store patterns → generally more capable (up to a point)

A 7B model can run on a laptop. A 70B model needs serious hardware. A 400B model needs a server cluster.

</v-clicks>

<br>

<v-click>

**The key insight:** the model doesn't "look things up" — it has knowledge *baked into* its weights from training. That's why training is expensive (you're computing those weights) and inference is cheaper (you're just running them).

</v-click>

---

# Vectors: the language models think in

Under the hood, every token gets converted into a **vector** — a list of hundreds or thousands of numbers.

<br>

<v-clicks>

These vectors encode **meaning** in a geometric space:
- Similar concepts end up close together
- Related words have consistent relationships

The famous example: `king − man + woman ≈ queen`

</v-clicks>

<br>

<v-click>

You don't need to know the math. Just know: **models think in vectors, not words.** Words get converted in, vectors get processed, tokens come out.

This becomes important when we talk about embeddings and search in Module 2.

</v-click>

---

# The Transformer

Almost every major LLM uses the same underlying architecture: **the Transformer**.

<br>

<v-clicks>

The Transformer was introduced by Google in 2017 ("Attention Is All You Need").

The key innovation: **attention** — a mechanism that lets every token look at every other token and figure out which ones are relevant to predicting the next token.

"The bank by the **river** was flooded" — `bank` attends to `river` to resolve ambiguity.

"She deposited money at the **bank**" — `bank` attends to `money` and `deposited`.

</v-clicks>

<br>

<v-click>

You'll hear "transformer" and "attention" constantly. The mental model: it's the architecture that lets models understand *context and relationships between words*, not just individual words.

</v-click>

---

# Training: how models learn

<br>

**Pre-training** — the expensive part
- The model is shown massive amounts of text (the internet, books, code)
- For each piece of text, it tries to predict the next token
- When it's wrong, the weights are adjusted slightly
- Repeat this trillions of times → the model learns

<br>

<v-click>

**Fine-tuning / RLHF** — making it useful
- After pre-training, the model knows how to predict text, but it's not "helpful"
- Fine-tuning on curated examples teaches it to follow instructions
- RLHF (Reinforcement Learning from Human Feedback) teaches it what "good" responses look like

</v-click>

---

# Training vs. Inference

Two completely different operations:

<br>

| | Training | Inference |
|--|---------|-----------|
| **What it is** | Computing the model's weights | Running the model to get a response |
| **Cost** | Enormous (millions of dollars for frontier models) | Cheap per query |
| **Who does it** | Model providers (Anthropic, OpenAI, Google) | You, every time you send a prompt |
| **Hardware** | Thousands of GPUs for weeks/months | One or a few GPUs per query |
| **When it happens** | Once (then periodic updates) | Every request |

<br>

<v-click>

**Why this matters:** When your team uses Copilot or the API, you're doing *inference* — running a pre-trained model. You're not training anything. Training is what the model providers do.

</v-click>

---

# What happens when you send a prompt

```
Your message
    ↓
Tokenize (text → tokens)
    ↓
Embed (tokens → vectors)
    ↓
Process through transformer layers (attention + math)
    ↓
Predict next token (the most likely one, with some randomness)
    ↓
Convert token back to text
    ↓
Repeat until done
    ↓
Response
```

<v-click>

The whole thing happens in milliseconds to seconds per token, depending on model size and hardware.

</v-click>

---

# Vocabulary for Module 1

<br>

| Term | What it means |
|------|--------------|
| **LLM** | Large Language Model — any of the big AI models (GPT, Claude, Gemini, etc.) |
| **Token** | The unit models work in — roughly ¾ of a word |
| **Parameter / Weight** | A learned number in the model; "70B" = 70 billion parameters |
| **Transformer** | The architecture almost all major LLMs use |
| **Attention** | The mechanism that lets tokens relate to each other |
| **Vector / Embedding** | How meaning is represented numerically inside the model |
| **Pre-training** | The initial, expensive training on massive text data |
| **Fine-tuning** | Further training to make the model useful and safe |
| **RLHF** | Human feedback used to teach the model what "good" responses look like |
| **Training** | Computing the model's weights — what providers do |
| **Inference** | Running the model — what happens every time you send a prompt |
| **Autoregressive** | Generating one token at a time, each conditioned on the previous ones |

---

# What to take away

<v-clicks>

1. **Everything is next-token prediction.** Even complex reasoning is this simple idea, done extremely well at massive scale.

2. **Tokens ≠ words.** Think in tokens when you think about cost and context limits.

3. **Parameters = learned knowledge.** Model size roughly correlates to capability, but bigger isn't always necessary or better.

4. **Training ≠ inference.** Your team runs inference. The model provider does training. These are completely different.

5. **The Transformer and attention** are the architecture that makes context and relationships work.

</v-clicks>

---

# Up next: Module 2

**Using AI Effectively — Prompts, Context, and Reliability**

- Context windows: the model's working memory
- Prompt engineering: how to get better results
- Hallucination: why it happens and how to work with it
- RAG: how to ground models in real data

---
layout: center
---

# Questions?

*Module 1 of 3 — AI Essentials for Engineers*
