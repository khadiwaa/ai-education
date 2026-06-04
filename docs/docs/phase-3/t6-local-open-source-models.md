---
id: t6-local-open-source-models
title: "T6: Open-Source & Local Models"
---

# T6: Open-Source & Local Models

*Phase 3 · Deep Dive · Technical Track*

:::info Coming soon
This deep-dive module is being built. Want to contribute? [Open a PR](https://github.com/your-org/ai-education-hl/blob/main/CONTRIBUTING.md).
:::

---

## What this module covers

This module goes deep on the open-source AI ecosystem and how to run models locally — without sending data to a cloud provider. Topics will include:

### What open-source models are

- The difference between **open-weight** (weights released publicly) and **truly open-source** (weights + training data + code)
- Key open-weight model families: Llama (Meta), Mistral / Mixtral, Gemma (Google), Phi (Microsoft), Qwen (Alibaba), CodeLlama, DeepSeek
- How open-weight models compare to frontier models (GPT-4o, Claude Sonnet) on capability benchmarks
- Why you might choose an open-weight model: data privacy, cost, latency, on-premise requirements, customization

### Running models locally

- **Ollama** — the easiest way to run local models on macOS/Linux/Windows. Pull and run models with one command. Exposes a local API compatible with many tools.
- **LM Studio** — GUI-first local model runner, good for non-technical users
- **llama.cpp** — the C++ runtime that powers most local inference; understanding quantization (Q4, Q8, etc.) and why it matters for speed vs. quality
- Hardware considerations: what GPU/CPU/RAM you need for different model sizes; Apple Silicon MPS acceleration
- Quantization tradeoffs: smaller quantized models run faster on consumer hardware but sacrifice some quality

### Connecting local models to your tools

- Using Ollama's API with Copilot CLI and other OpenAI-compatible clients
- Using local models in VS Code extensions
- Building development workflows that use local models for code tasks (autocomplete, review) without sending code to external APIs — relevant for teams with data sensitivity requirements

### Evaluating local models for your use case

- How to run quick evals on local models for your specific tasks
- When local models are good enough vs. when you need frontier models
- Latency and throughput characteristics on common hardware

### Open-source ecosystem and staying current

- Hugging Face as the hub for model weights, datasets, and leaderboards
- The Open LLM Leaderboard for capability comparison
- Key research to watch: new model releases, quantization techniques, GGUF format

---

## Prerequisites

- Phase 1 (AI Essentials) — especially Module 1 (How AI Works)
- Basic command-line comfort

## Related Phase 3 modules

- [T1: Transformer Architecture](./t1-transformer-architecture) — understanding what is inside the model weights
- [T5: Fine-Tuning & Customization](./t5-fine-tuning) — customizing open-weight models for your domain
