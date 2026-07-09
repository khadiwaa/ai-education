# AI Education — Practical AI Skills for Professionals

A self-paced curriculum that teaches non-technical professionals how AI actually
works and how to use it well in everyday knowledge work — writing, research,
analysis, and planning — using the **Claude desktop app**. No coding required.

It's open source on purpose: fork it, rebrand it, and adapt it for your team.

---

## Quick start (running the site locally)

```bash
cd docs
npm install
npm run dev     # hot-reload dev server at localhost:3000 (search disabled in dev)
npm run build   # full production build — also validates every link and anchor
```

---

## Curriculum overview

### Phase 1 — AI Essentials *(start here)*

Foundations for working effectively with AI — no technical background assumed.

| Module | Topic | Docs |
|--------|-------|------|
| Phase 1 · Module 1 | How AI Actually Works | `docs/docs/phase-1/how-ai-works.mdx` |
| Phase 1 · Module 2 | Using AI Effectively | `docs/docs/phase-1/using-ai-effectively.mdx` |
| Phase 1 · Module 3 | AI in Your Workday | `docs/docs/phase-1/ai-in-your-workflow.mdx` |

### Phase 2 — Claude in Practice

Hands-on modules for the Claude desktop app.

| Module | Topic | Docs |
|--------|-------|------|
| Phase 2 · Module 1 | Getting Started with Claude | `docs/docs/phase-2/01-claude-essentials.mdx` |
| Phase 2 · Module 2 | Projects, Memory & Custom Instructions | `docs/docs/phase-2/02-projects-and-instructions.mdx` |
| Phase 2 · Module 3 | Creating Documents & Artifacts | `docs/docs/phase-2/03-creating-with-artifacts.mdx` |
| Phase 2 · Module 4 | Connectors, MCP & Skills | `docs/docs/phase-2/04-connectors-and-skills.mdx` |
| Phase 2 · Module 5 | Everyday Workflows | `docs/docs/phase-2/05-everyday-workflows.mdx` |

### Phase 3 — Working Confidently with AI

Judgment and responsibility: the difference between using AI and using it well.

| Module | Topic |
|--------|-------|
| 1 | Confidentiality, Privacy & Sensitive Data |
| 2 | Verifying AI Output & Managing Risk |
| 3 | Choosing AI Tools & Plans |
| 4 | Bringing AI to Your Team |
| 5 | Staying Current |

### Appendix — Under the Hood *(optional, technical)*

Deep dives for readers who want the technical detail: transformer architecture,
advanced prompting, embeddings & RAG, agents, fine-tuning, local models, and AI
product strategy. Not required for the curriculum.

---

## Self-assessments (Claude skill)

Each Phase 1 and Phase 2 module ends with an interview-style self-assessment that
runs **inside the Claude app** via a custom skill.

**Setup (once):**
1. Download the skill from the site: `/downloads/ai-assessment-skill.zip` (or grab it
   from `docs/static/downloads/` in this repo).
2. In Claude: **Settings → Capabilities → Skills → upload the zip**.
3. In any chat, say: `assess me on phase 1 module 1` (or `assess me on phase 2`, etc.).

Claude asks 3 open-ended questions per module, scores your answers against a hidden
rubric, gives you a personalized review plan with links back into the site, and ends
with a results block. Paste that block into the **Assessments** page (`/assessments`)
to track your scores in the browser — results are stored locally in your browser only.

**Rebuilding the skill** (after editing questions, rubrics, or the site URL):

```bash
cd docs && npm run build:skill
```

Question text lives in `docs/src/data/question-bank.json`; scoring rubrics live only
in `skills/ai-assessment/rubrics.json`. The build script validates the two stay in sync.

---

## Deploying to Vercel

The site is a standard Docusaurus app rooted at `docs/`:

1. Push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new).
2. Set **Root Directory** to `docs` (framework "Docusaurus" is auto-detected;
   build command `npm run build`, output directory `build`).
3. Deploy. Then update `url` in `docs/docusaurus.config.js` to your production
   domain and run `npm run build:skill` so the assessment skill links back to the
   right site.

---

## Adapting this for your team

Everything is markdown/MDX under `docs/docs/` — if you can write markdown, you can
adapt it. See [CONTRIBUTING.md](./CONTRIBUTING.md) for conventions, and
[CLAUDE.md](./CLAUDE.md) if you're editing with an AI coding assistant. Licensed
under [MIT](./LICENSE).
