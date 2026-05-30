# AI Education — Engineering Curriculum

A living curriculum for building AI fluency across engineering teams. Contains slide decks for live presentations and a reference documentation site for self-paced learning.

---

## What's in here

| Directory | What it is | How to run |
|-----------|-----------|------------|
| `slides/` | Slidev presentation decks | `cd slides && npm install && npm run dev` |
| `docs/` | Docusaurus reference site | `cd docs && npm install && npm run start` |

---

## Curriculum Overview

### Phase 1 — AI Essentials (start here)

Three modules covering the foundations every engineer needs to work effectively with AI tools.

| Module | Topic | Deck | Reference |
|--------|-------|------|-----------|
| 1 | How AI Actually Works | `slides/decks/phase-1/01-how-ai-works.md` | `docs/docs/phase-1/01-how-ai-works.md` |
| 2 | Using AI Effectively | `slides/decks/phase-1/02-using-ai-effectively.md` | `docs/docs/phase-1/02-using-ai-effectively.md` |
| 3 | AI in Your Engineering Workflow | `slides/decks/phase-1/03-ai-in-your-workflow.md` | `docs/docs/phase-1/03-ai-in-your-workflow.md` |

### Phase 2 — Deep Dives (self-select)

Advanced modules you can take in any order based on what's most relevant to your work.

| Module | Topic |
|--------|-------|
| T1 | Transformer Architecture Deep Dive |
| T2 | Advanced Prompt Engineering & Evaluation |
| T3 | Embeddings, RAG & Retrieval Systems |
| T4 | Agents & Multi-Agent Systems |
| T5 | Fine-Tuning & Model Customization |
| S1 | Platform Strategy & Vendor Evaluation |
| S2 | Cost Modeling & Optimization |
| S3 | AI Product Strategy |
| S4 | Team Education & Org Design |
| S5 | Staying Current |

---

## Quick Start

### Running the slide decks

```bash
cd slides
npm install
npm run dev        # opens in browser at localhost:3030
```

To present a specific deck:
```bash
npm run dev -- decks/phase-1/01-how-ai-works.md
```

To export a deck to PDF:
```bash
npm run export -- decks/phase-1/01-how-ai-works.md
```

### Running the reference site

```bash
cd docs
npm install
npm run start      # opens at localhost:3000
```

---

## Self-assessment skill (Copilot CLI)

If you're using GitHub Copilot CLI in this repo, a self-assessment skill is built in. Just say:

```
assess me
quiz me
test my understanding of module 2
```

The skill runs an **interactive interview** — 9 open-ended questions across all three Phase 1 modules. After each answer you get feedback on what you demonstrated and one thing to deepen. At the end you get a verbal summary and a **saved report file**:

```
assessments/<your-name>-ai-assessment-<YYYY-MM-DD>.md
```

The report includes a score per question (1–3), overall score, strengths, development areas, and specific learning recommendations linked to any gaps. You can share it with your manager, peers, or use it to track your own progress over time.

See [`.github/extensions/ai-assessment/README.md`](.github/extensions/ai-assessment/README.md) for full details.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add content, fix errors, or propose new modules.

Content is markdown — if you can write markdown, you can contribute.
