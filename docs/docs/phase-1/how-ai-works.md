---
id: how-ai-works
sidebar_position: 1
title: "Module 1: How AI Actually Works"
---

# Module 1: How AI Actually Works

*Phase 1 · ~45 minutes · Foundational*

---

## The core idea: next-token prediction

Everything in GenAI comes down to one surprisingly simple task:

> **Given all the text so far, what word (token) comes next?**

That's it. A model trained on hundreds of billions of examples of text learns to make this prediction extremely well. When you send a message to an LLM, it's not "thinking" in the human sense — it's predicting one token at a time, each prediction conditioned on everything that came before.

This is called **autoregressive generation**:

```
Prompt:  "The capital of France is"
Step 1:  "The capital of France is" → predicts → "Paris"
Step 2:  "The capital of France is Paris" → predicts → "."
Step 3:  "The capital of France is Paris." → predicts → (end)
```

This is why models can be slow for long responses — the generation is inherently sequential. It also explains why models sometimes drift or hallucinate — every step is a probabilistic prediction, not a fact lookup.

---

## What is a token?

Models don't see words. They don't see characters. They see **tokens** — chunks of text that average about 3–4 characters in English.

- Common words are usually single tokens: `the`, `is`, `cat`
- Longer or rarer words split into multiple tokens: `unbelievable` → `["un", "believ", "able"]`
- Code and symbols can be unpredictable

**Why it matters:**
- Token count drives **cost** — you pay per token on most APIs
- Token count drives **context window** limits
- Unusual terms (internal product names, niche libraries) may tokenize inefficiently

:::tip Rule of thumb
1 token ≈ ¾ of an English word, or ~4 characters. A 1,000-word document ≈ 1,300 tokens.
:::

**Try it:** Go to [platform.openai.com/tokenizer](https://platform.openai.com/tokenizer) and type the word `strawberry`. Notice how it splits across tokens — this is why models historically struggled to count letters.

---

## Parameters: what "a 70B model" means

When you hear "a 70B model," those 70 billion numbers are called **parameters** (or weights). Think of them as the model's learned knowledge — every relationship, pattern, and fact absorbed during training is encoded across those numbers.

- More parameters → more capacity → generally more capable (up to a point)
- A 7B model can run on a laptop
- A 70B model needs a capable server
- A 400B model needs a cluster

:::info Key insight
The model doesn't "look things up" — knowledge is baked into its weights from training. That's why training is expensive (computing those weights) and inference is much cheaper (just running them).
:::

---

## Vectors: what models think in

Every token gets converted into a **vector** — a list of hundreds or thousands of numbers that encodes meaning geometrically. Similar concepts end up close together in this space.

The classic example: `king − man + woman ≈ queen`

You don't need to know the math. Just know: **models think in vectors, not words.** This becomes important when we talk about embeddings and search in Module 2.

---

## The Transformer

Almost every major LLM uses the same underlying architecture: **the Transformer** (introduced by Google in 2017 with the paper "Attention Is All You Need").

The key innovation is **attention** — a mechanism that lets every token look at every other token to figure out which ones are relevant. This is how the model understands context:

- `"The bank by the **river** was flooded"` — `bank` attends to `river` to resolve meaning
- `"She deposited money at the **bank**"` — `bank` attends to `money` and `deposited`

The mental model: attention is what lets models understand *relationships between words*, not just individual words in isolation.

---

## How models are built

### Pre-training (the expensive part)

The model is shown massive amounts of text — the internet, books, code — and for each piece, tries to predict the next token. When it's wrong, the weights are adjusted. Repeat this trillions of times. This is what costs millions of dollars and takes months.

### Fine-tuning and RLHF (making it useful)

After pre-training, the model can predict text — but it's not "helpful." Fine-tuning on curated examples teaches it to follow instructions. RLHF (Reinforcement Learning from Human Feedback) uses human preferences to teach it what "good" responses look like.

---

## Training vs. Inference

These are completely different operations:

| | Training | Inference |
|--|---------|-----------|
| **What it is** | Computing the model's weights | Running the model to generate a response |
| **Cost** | Enormous (millions of dollars for frontier models) | Cheap per query |
| **Who does it** | Model providers (Anthropic, OpenAI, Google) | You, every time you send a prompt |
| **When it happens** | Once, then periodic updates | Every request |

:::note
When your team uses Copilot, ChatGPT, or any AI API, you're doing *inference* — running a pre-trained model. You're not training anything. Training is what the model providers do.
:::

---

## What happens when you send a prompt

```
Your message
    ↓
Tokenize (text → tokens)
    ↓
Embed (tokens → vectors)
    ↓
Process through transformer layers
    ↓
Predict next token
    ↓
Convert back to text
    ↓
Repeat until done
    ↓
Response
```

---

## Hands-on exercise

1. Go to [platform.openai.com/tokenizer](https://platform.openai.com/tokenizer)
2. Type a regular English sentence — count the tokens vs. the words
3. Type some code — notice how it tokenizes differently than prose
4. Type a long technical term from your work — how many tokens?
5. Type `strawberry` — can you see why models struggle with "how many r's?"

---

## Vocabulary

| Term | What it means |
|------|--------------|
| **LLM** | Large Language Model — any of the major AI models (GPT, Claude, Gemini, etc.) |
| **Token** | The unit models work in — roughly ¾ of a word |
| **Parameter / Weight** | A learned number in the model; "70B" = 70 billion parameters |
| **Transformer** | The architecture almost all major LLMs use |
| **Attention** | The mechanism that lets tokens relate to each other |
| **Vector / Embedding** | How meaning is represented numerically inside the model |
| **Pre-training** | Initial, expensive training on massive text data |
| **Fine-tuning** | Further training to make the model useful and safe |
| **RLHF** | Reinforcement Learning from Human Feedback — teaching the model what "good" looks like |
| **Training** | Computing the model's weights — what providers do |
| **Inference** | Running the model — what happens every time you send a prompt |
| **Autoregressive** | Generating one token at a time, each conditioned on the previous ones |

---

## Key takeaways

1. **Everything is next-token prediction.** Even complex reasoning is this simple idea, done extremely well at massive scale.
2. **Tokens ≠ words.** Think in tokens when reasoning about cost and context limits.
3. **Parameters = learned knowledge.** Model size roughly correlates to capability, but bigger isn't always necessary.
4. **Training ≠ inference.** Your team runs inference. The model provider does training.
5. **The Transformer and attention** are what make context and relationships work.

---

*Next: [Module 2 — Using AI Effectively](./using-ai-effectively)*
