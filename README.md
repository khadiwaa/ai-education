# Herbalife AI Education — Engineering Curriculum

A living curriculum for building AI fluency across Herbalife's engineering teams. This repo contains a reference documentation site for self-paced learning, interactive self-assessments via Copilot CLI, and slide decks for live presentations.

---

## Quick Start

```bash
cd docs
npm install
npm run start   # builds search index + serves at localhost:3000
```

> Use `npm run dev` instead if you're editing content and want live hot-reload (search won't work in dev mode).

---

## Curriculum Overview

### Phase 1 — AI Essentials *(start here)*

Foundations every engineer needs to work effectively with AI tools.

| Module | Topic | Docs |
|--------|-------|------|
| Phase 1 · Module 1 | How AI Actually Works | `docs/docs/phase-1/how-ai-works.mdx` |
| Phase 1 · Module 2 | Using AI Effectively | `docs/docs/phase-1/using-ai-effectively.mdx` |
| Phase 1 · Module 3 | AI in Your Engineering Workflow | `docs/docs/phase-1/ai-in-your-workflow.mdx` |

### Phase 2 — GitHub Copilot in Practice

Practical modules on using GitHub Copilot CLI and VS Code in daily engineering work.

| Module | Topic | Docs |
|--------|-------|------|
| Phase 2 · Module 1 | Copilot CLI Essentials | `docs/docs/phase-2/01-copilot-cli-essentials.mdx` |
| Phase 2 · Module 2 | Copilot in VS Code | `docs/docs/phase-2/02-copilot-in-vscode.mdx` |
| Phase 2 · Module 3 | Skills & Customization | `docs/docs/phase-2/03-skills-and-customization.mdx` |
| Phase 2 · Module 4 | MCP & Integrations | `docs/docs/phase-2/04-mcp-and-integrations.mdx` |
| Phase 2 · Module 5 | Real-World Workflows | `docs/docs/phase-2/05-real-world-workflows.mdx` |

### Phase 3 — Deep Dives *(self-select)*

Advanced modules you can take in any order based on your role and interests.

**Technical Track**

| Module | Topic |
|--------|-------|
| T1 | Transformer Architecture Deep Dive |
| T2 | Advanced Prompt Engineering & Evaluation |
| T3 | Embeddings, RAG & Retrieval Systems |
| T4 | Agents & Multi-Agent Systems |
| T5 | Fine-Tuning & Model Customization |
| T6 | Open-Source & Local Models |

**Strategic Track**

| Module | Topic |
|--------|-------|
| S1 | Platform Strategy & Vendor Evaluation |
| S2 | Cost Modeling & Optimization |
| S3 | AI Product Strategy |
| S4 | Team Education & Org Design |
| S5 | Staying Current |

---

## Self-Assessments

Each module ends with a self-assessment you run from your terminal using Copilot CLI. Results are saved locally and surfaced in the docs site.

### Running an assessment

Start a Copilot CLI session from the repo root, then say:

```
assess me phase 1 module 1
assess me phase 2 module 3
assess me phase 1          # runs all 3 Phase 1 modules
assess me phase 2          # runs all 5 Phase 2 modules
```

The skill asks **3 open-ended questions** per module. After your answers you get per-question scores (1–3), strengths, and focus areas linked back to the relevant doc section.

### Where results appear

**Markdown report** (personal, gitignored):
```
assessments/<your-name>-module-<N>-assessment-<YYYY-MM-DD>.md
```

**Browser results** — after running `npm run start`, visit `/assessments` in the docs site to see your scores and focus areas for every completed module. The **Question Bank** page (`/question-bank`) lists every question so you can review what's covered before or after assessing.

> Assessment JSON files in `docs/static/assessments/` are also gitignored — your results stay local.

See [`.github/extensions/ai-assessment/README.md`](.github/extensions/ai-assessment/README.md) for full details.

---

## Slide Decks

Phase 1 slides include deep speaker notes for presenters.

```bash
cd slides
npm install
npm run dev                                          # opens at localhost:3030
npm run dev -- decks/phase-1/01-how-ai-works.md    # specific deck
npm run export -- decks/phase-1/01-how-ai-works.md # export to PDF
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add content, fix errors, or propose new modules.

Content is markdown/MDX — if you can write markdown, you can contribute.
