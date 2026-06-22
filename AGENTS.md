# AGENTS.md

This is the tool-agnostic entry point for AI coding agents working in this repo
(the [agents.md](https://agents.md) convention). To avoid drift, the **full,
canonical guidance lives in [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)**
— read that file. This page is a short pointer plus the essentials.

## What this repo is

The **Herbalife AI Education** curriculum: a Docusaurus docs site (`docs/`) plus a
Copilot CLI assessment skill (`.github/extensions/ai-assessment/`). It's a living
curriculum — Phase 1 (AI foundations), Phase 2 (using our tools), Phase 3 (optional
deep dives).

## Quick reference

- **Validate before committing:** `cd docs && npm run build` — the build throws on
  broken links/anchors, so a passing build is the link check. Don't commit around a
  failing build.
- **Keep assessments in sync:** the questions live in two files that must always
  match — `.github/extensions/ai-assessment/extension.mjs` (source of truth) and
  `docs/src/pages/question-bank/index.js` (human-readable mirror). Change both
  together (ids, wording, topics, anchors, "phase N module M" labels).
- **Don't duplicate concepts — cross-link** to the canonical section instead.
- **Verify fast-moving facts** (Copilot CLI commands, model names, prices, links)
  against official docs before writing them.

For the full rules — anchor-slug gotchas, branding, style conventions, commit
trailer, and the pre-commit checklist — see
[`.github/copilot-instructions.md`](./.github/copilot-instructions.md).
