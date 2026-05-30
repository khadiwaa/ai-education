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

<!--
Welcome everyone. This is Module 1 of 3 in our Phase 1 AI Essentials curriculum.

The goal of today's session is NOT to make you an AI researcher. The goal is to give you the right mental models so that when someone says "let's use a 70B model" or "we should fine-tune instead of using RAG," you know what they're talking about and can evaluate the tradeoff.

This module is the foundation. Everything we cover in modules 2 and 3 rests on understanding what's in here.

Estimated time: 40–50 minutes plus Q&A.
-->

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

<!--
Walk through the agenda. Reassure people that we're not going into deep math — this is about building the right mental models.

Emphasize the last point: by the end of this session, you won't be surprised or confused when you hear AI vocabulary. You'll be able to participate in those conversations and push back when something doesn't make sense.

If people have used ChatGPT or Copilot already — great, this will explain what's been happening. If they haven't — also great, this gives them the right foundation before they start.
-->

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

<!--
This is the most important slide in this deck. Pause here.

The common misconception is that LLMs have some kind of internal knowledge base they're querying, or that they're "thinking" the way humans think. They're not. They're doing one thing: given everything I've seen so far, what comes next?

This sounds trivially simple — but the magic is in the scale. The model has seen hundreds of billions of examples of human text, code, conversations, books, research papers. Through that training, it learned that after "The capital of France is" the most likely next token is "Paris." After "def fibonacci(" the most likely next tokens form a recursive function body. After "The patient presents with symptoms of" the most likely tokens look like a medical description.

The model doesn't "know" Paris is the capital of France in the way a human knows it. It knows that statistically, "Paris" follows "The capital of France is" in the training data. Usually these are the same thing. Sometimes they're not — and that's the root of hallucination, which we'll cover in Module 2.

Key insight to leave with: CONFIDENCE ≠ CORRECTNESS. The model predicts what's most likely — not what's true. We'll come back to this over and over.
-->

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

It's why models can be slow for long responses — every token is sequential, can't be parallelized.

It also explains why models can drift or hallucinate — each step is a probabilistic prediction, not a fact lookup.

</v-clicks>

<!--
"Autoregressive" is a technical term that just means: each output depends on all previous outputs. Auto = self, regressive = looking back.

The important practical consequence: there's no way to speed this up by just throwing more compute at it in parallel. You can have 1000 GPUs, but token 50 still has to wait for token 49. This is why long responses feel slow — the model is literally generating one token at a time.

The drift point is subtle but important. Because each token selection is probabilistic (more on temperature later), the model can wander. A long generation might start confidently correct and gradually drift into plausible-sounding but wrong territory — especially when it ventures past what's well-represented in its training data.

This is also why shorter, more focused prompts often get better results than long vague ones — less opportunity for drift.
-->

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

<!--
Tokenization is a topic that's easy to underestimate. It affects cost, context limits, and model behavior in subtle ways.

The way tokenization works: models use an algorithm called Byte Pair Encoding (BPE) to build a vocabulary of ~50,000–100,000 tokens. Common sequences get their own token; rare sequences get split into smaller pieces. This is computed on the training corpus before training even starts.

Why does this matter practically?

1. COST: If your team is calling the OpenAI or Anthropic API, you pay per token. A 1000-word document is about 1300 tokens. A verbose system prompt that's 500 words is 650 tokens that gets charged on EVERY request. This adds up fast at scale.

2. CONTEXT WINDOW: The context window limit is in tokens, not words. "200K context window" means 200,000 tokens — roughly 150,000 English words. But code, JSON, and structured data tokenize less efficiently than prose, so you often get less than you'd expect.

3. THE STRAWBERRY PROBLEM: This is a famous example. Ask GPT-3 how many R's are in "strawberry" and it gets it wrong. Why? Because "strawberry" tokenizes to something like ["straw", "berry"] — the model never sees individual characters. It can't count R's by looking at characters because it doesn't see characters. (Newer models handle this better with additional tricks, but the underlying issue remains.)

Demo opportunity: Go to platform.openai.com/tokenizer and show the audience how their company name or a technical term tokenizes.
-->

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

<!--
These numbers are useful to internalize for back-of-envelope calculations.

A few that often surprise engineers:

"200K context window" sounds like a lot. It is. But if you're trying to fit an entire large codebase into context — say, 500 files averaging 200 lines each — you're looking at millions of tokens. Way over any current context window. This is why tools like Copilot don't just dump your whole repo into the context; they have to be selective about what they include.

Also worth noting: output tokens are usually priced higher than input tokens. If you're generating long responses (summaries, code, reports), the output cost can dominate. This is a practical consideration when designing AI features.

Token pricing reference (approximate as of 2025):
- GPT-4o: ~$5/million input tokens, ~$15/million output tokens
- Claude 3.5 Sonnet: similar range
- Cheaper models (GPT-4o mini, Claude Haiku): 10–20x cheaper
- Open models via local inference: effectively free

The implication: for high-volume features, model selection is a major cost lever.
-->

---

# 🔬 Hands-on: tokenizer playground

**Try this right now:**

1. Go to **[platform.openai.com/tokenizer](https://platform.openai.com/tokenizer)**
2. Type the word `strawberry` — how many tokens?
3. Type some code — notice how it tokenizes differently than prose
4. Try a long technical word vs. a common short word

<br>

<v-click>

Notice: `strawberry` = 3 tokens

This is why models historically struggled to count letters in words — they don't "see" individual characters the way we do.

</v-click>

<!--
Give people 2–3 minutes to actually do this. It's worth it — seeing tokenization in action makes it concrete in a way that a slide can't.

Things to point out if you're demoing live:
- Type "strawberry" → shows 3 tokens with color coding
- Type "Hello world" vs. "Héllo wörld" — the accented version tokenizes differently, usually less efficiently
- Paste a block of Python code — notice how variable names, operators, whitespace all tokenize separately
- Type your company's internal tool names — they often get split in surprising ways

The strawberry example: historically, asking "how many R's are in strawberry?" would trip up models because "strawberry" might tokenize as ["straw", "berry"] — neither chunk contains a standalone R at the character level the model processes. Newer models have mitigation techniques, but this illustrates why character-level reasoning is genuinely harder for token-based models.
-->

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

<!--
This is a common source of confusion. People hear "70B model" and picture a database with 70 billion entries. It's not that.

Here's a better mental model. Imagine you're trying to teach a student everything they need to know to pass a general knowledge exam. You spend years having them read everything, and after each reading, you slightly adjust how their neurons connect based on whether they answered questions correctly. After billions of reading examples, those neural connections encode everything they learned. The parameters are those connections.

The knowledge is distributed — there's no single neuron that knows "Paris is the capital of France." That fact is encoded across millions of parameters working together. This is why you can't easily "edit" a fact in a model — the knowledge isn't stored anywhere specific.

Why does size matter?
- More parameters = more capacity to encode patterns
- But: more parameters ≠ always better. A 70B model with less training data can be worse than a 7B model with excellent training data and fine-tuning.
- And: more parameters = more compute required = more cost = more latency

Hardware reality:
- 7B model: runs fine on a MacBook Pro M3 with 32GB RAM (via Ollama, llama.cpp)
- 13B model: needs ~24GB VRAM, works on a gaming PC with a high-end GPU
- 70B model: needs ~40–80GB VRAM, typically a server with multiple GPUs or 4-bit quantization
- 400B+ model: needs a cluster, accessed only via API

Quantization (brief mention, more in T1 deep dive): you can compress models by reducing the precision of each parameter — from 16-bit floats to 8-bit integers or even 4-bit. A 4-bit quantized 70B model needs about 35GB instead of 140GB, with modest quality tradeoff. This is how tools like Ollama make large models accessible on consumer hardware.
-->

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

<!--
This is one of the more mind-bending aspects of how LLMs work, but you don't need the deep math — just the intuition.

Every token gets mapped to a vector — think of it as a point in a very high-dimensional space (typically 4,000–16,000 dimensions for large models). The meaning of the token is encoded in its position in that space.

The king/man/woman/queen example (from Word2Vec, 2013) is famous because it showed that vector arithmetic captures semantic relationships:
- king and man are related the same way queen and woman are related
- If you take the king vector, subtract the "maleness" direction, and add the "femaleness" direction, you get close to the queen vector

Why does this matter for you? It's the foundation of semantic search (which we cover in Module 2 with RAG). When you do a vector similarity search, you're finding tokens/documents whose vectors are close together in this space — meaning semantically similar, not just lexically similar.

For example: "automobile" and "car" have similar vectors even though they share no characters. A vector search for "car" would also surface "automobile" results. This is how modern search systems are built.

Keep this in mind when we talk about embeddings — it's the same concept applied at the document level rather than the token level.
-->

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

<!--
Before Transformers (pre-2017), the dominant architectures for language tasks were RNNs (Recurrent Neural Networks) and LSTMs. These processed text sequentially — token by token — and had trouble "remembering" things from early in the sequence by the time they got to the end. Think of it as reading with extreme short-term memory loss.

The Transformer solved this with self-attention: every token can directly attend to every other token in the context, regardless of distance. "The bank by the river" — by the time the model is predicting what comes after "flooded," it can directly look back at "bank" and "river" and recognize the connection.

The "Attention Is All You Need" paper is one of the most cited papers in history. It fundamentally changed the field. GPT, Claude, Gemini, Llama — all of them are transformer-based architectures.

What you need to know practically:
- Transformers are what enable LLMs to understand context — not just individual words but relationships between words
- The context window (which we cover in Module 2) is a direct consequence of how attention works — attending to everything within the window, nothing outside it
- "How many layers?" — large models have 80–120+ transformer layers stacked on top of each other. Each layer refines the representation. This is why "depth" (layers) and "width" (hidden dimension) are both important model characteristics.

For engineers who want to go deeper: Phase 2 Module T1 covers the transformer architecture in full detail — attention heads, Q/K/V matrices, feed-forward networks, residual connections. Not necessary for today, but available when you're ready.
-->

---

# Training: how models learn

<br>

**Pre-training** — the expensive part
- The model is shown massive amounts of text (the internet, books, code)
- For each piece of text, it tries to predict the next token
- When it's wrong, the weights are adjusted slightly (gradient descent)
- Repeat this trillions of times → the model learns

<br>

<v-click>

**Fine-tuning / RLHF** — making it useful
- After pre-training, the model knows how to predict text, but it's not "helpful"
- Fine-tuning on curated examples teaches it to follow instructions
- RLHF (Reinforcement Learning from Human Feedback) teaches it what "good" responses look like

</v-click>

<!--
Pre-training is genuinely staggering in scale. GPT-4 is estimated to have been trained on roughly 13 trillion tokens. Claude models are trained on similar scales. This is text scraped from the web, books, academic papers, GitHub, Wikipedia, code repositories — essentially a snapshot of human writing.

The training process:
1. Show the model a chunk of text: "The Eiffel Tower is located in"
2. Have it predict the next token
3. Compare prediction to the actual next token ("Paris")
4. Compute how wrong it was (the "loss")
5. Adjust weights slightly in the direction that would have made it less wrong (backpropagation + gradient descent)
6. Repeat 10^13 times

At the end of pre-training, you have a model that's extremely good at predicting text — but it will complete anything in any direction. Ask it "What's the capital of France?" and it might respond by generating the next plausible tokens on a Wikipedia page, which could be "Paris. The city is also known for..."

This is called the "base model" — capable but not task-aligned.

Fine-tuning (SFT - Supervised Fine-Tuning):
- Show the model thousands of examples of ideal conversations: here's a question, here's a great answer
- Train on these to make the model produce similar outputs
- This is what transforms the base model into an "assistant"

RLHF (Reinforcement Learning from Human Feedback):
- Have human raters compare pairs of responses: "Which of these is better?"
- Train a "reward model" that predicts what humans prefer
- Use that reward model to further adjust the weights via reinforcement learning
- This is what gives models their tone, safety behaviors, and nuanced helpfulness

This distinction matters when evaluating models: a "base model" and an "instruct model" from the same family are very different. Llama 3 base vs. Llama 3 Instruct — the base is barely useful for assistants; the instruct version is fine-tuned for conversations.
-->

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

<!--
This is a distinction that trips up a lot of people early in their AI journey, and it matters for several reasons.

Training cost scale:
- GPT-4 training: estimated $50–100M in compute
- Gemini Ultra: similar range
- A typical 7B open-source model fine-tune: $50–$500 on a cloud provider
- Training from scratch: only makes sense for very large companies or specialized use cases

Inference cost:
- GPT-4o API: ~$5/million input tokens, ~$15/million output tokens
- A typical chat message (500 tokens in, 500 out): fractions of a cent
- But at scale: 1 million requests/day × 0.01¢/request = $100/day = $36,500/year — starts to matter

Why this matters for your team:
1. "Can we train our own model on our codebase?" — probably not worth it. Training is expensive and requires massive data. Fine-tuning (a lighter version) might make sense in specific scenarios (Phase 2 T5 covers this).
2. "Can we update the model's knowledge?" — not directly. The weights are fixed. You can update knowledge via RAG (Module 2), but you can't "teach" the model new facts at inference time.
3. Cost modeling: when designing an AI feature, think about inference cost per request × expected volume. This is usually the main cost driver once the system is built.

The practical implication: your engineering team's relationship with AI is almost entirely on the inference side. You're API consumers, not model trainers. Understanding this shapes which architectural patterns make sense (hint: RAG is inference-time, fine-tuning is training-time, and they serve different purposes).
-->

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

<!--
Let's walk through a complete example. You type "Summarize this PR description: [text]" into Copilot.

1. TOKENIZE: Your message gets split into tokens. "Summarize" → 1 token. "this" → 1 token. "PR" → 1 token. Your PR description → hundreds of tokens. Total might be 300 tokens.

2. EMBED: Each token gets looked up in the embedding table — converted from a token ID to a vector of 4,096 numbers (for a medium-sized model). Now you have a matrix of 300 rows × 4,096 columns.

3. TRANSFORMER LAYERS: This matrix is passed through 80+ transformer layers (for a large model). In each layer:
   - Self-attention: each position attends to all other positions, weighted by relevance
   - Feed-forward network: further processing of each position
   - Residual connections + normalization: helps training stability
   After 80 layers, the model has a deep, contextually-aware representation of your entire prompt.

4. PREDICT NEXT TOKEN: The final layer's output for the last position goes through a linear layer + softmax, producing a probability distribution over all ~50,000 tokens in the vocabulary. The model picks the highest probability token (or samples from the distribution based on temperature).

5. OUTPUT + REPEAT: That token gets appended to the sequence, and the whole thing runs again for the next token. And again. And again, until the model predicts an end-of-sequence token or hits a length limit.

Latency components:
- For very long contexts: the attention computation grows quadratically with sequence length — doubling the context roughly 4x the attention compute
- For the generation phase: each token requires a full forward pass (though techniques like KV caching help reuse computation)
- Network latency to the API adds on top of raw compute time

This pipeline is why you sometimes see the first token arrive quickly and then subsequent tokens stream in — you're watching the autoregressive loop in real time.
-->

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

<!--
Take a minute to let people scan this. Encourage them to take a photo or note any terms they want to look up.

These terms will come up constantly in AI discussions, blog posts, vendor pitches, and job descriptions. Internalizing them is the foundation for everything else.

The reference doc at docs/phase-1/how-ai-works has this same vocabulary table plus more depth on each concept — great for people who want to review after the session.
-->

---

# What to take away

<v-clicks>

1. **Everything is next-token prediction.** Even complex reasoning is this simple idea, done extremely well at massive scale.

2. **Tokens ≠ words.** Think in tokens when you think about cost and context limits.

3. **Parameters = learned knowledge.** Model size roughly correlates to capability, but bigger isn't always necessary or better.

4. **Training ≠ inference.** Your team runs inference. The model provider does training. These are completely different.

5. **The Transformer and attention** are the architecture that makes context and relationships work.

</v-clicks>

<!--
These are the five things I want everyone to leave with. If someone can say all five of these back to me in their own words, they've got Module 1.

Quick check: does anyone want to try summarizing one of these in their own words? (Great for engagement if time allows.)

Transition: Now that we understand the mechanics, Module 2 is about using these systems effectively — how to get good results, why they sometimes fail, and the patterns that work in production. That's where prompt engineering, context windows, hallucination, and RAG come in.
-->

---

# Up next: Module 2

**Using AI Effectively — Prompts, Context, and Reliability**

- Context windows: the model's working memory
- Prompt engineering: how to get better results
- Hallucination: why it happens and how to work with it
- RAG: how to ground models in real data

<!--
Quick preview of Module 2.

If you're recording this session and sharing asynchronously, remind viewers that the reference documentation at docs/phase-1 goes into significantly more depth on all of these concepts. The slides are the live session — the docs are where you go to read at your own pace and go deeper.
-->

---
layout: center
---

# Questions?

*Module 1 of 3 — AI Essentials for Engineers*

<!--
Open for questions. Common ones that come up:

Q: "Is ChatGPT using the same architecture as Copilot?"
A: Both are transformer-based, yes. GPT-4 powers both ChatGPT and Copilot. The models are the same; the orchestration (system prompt, context injected, tools available) is what's different.

Q: "Can we run a model locally for privacy reasons?"
A: Yes — tools like Ollama let you run open models locally. We cover this briefly in Module 3 and in Phase 2 T5.

Q: "Why are there so many different models — GPT-4o, GPT-4o mini, Claude Sonnet, Claude Haiku...?"
A: Different points on the capability/cost/speed tradeoff. Haiku and mini are cheaper and faster; Opus and GPT-4o are more capable but expensive. We cover model selection in Phase 2 S1.

Q: "Will AI replace engineers?"
A: Address this thoughtfully. The honest answer is: it changes the work, not eliminates the need for engineers. AI is a force multiplier for well-defined tasks. It doesn't replace judgment, system design, stakeholder management, or novel problem solving. Module 3 covers this in more depth.
-->
