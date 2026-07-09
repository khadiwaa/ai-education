# AGENTS.md

This is the tool-agnostic entry point for AI coding agents working in this repo
(the [agents.md](https://agents.md) convention). To avoid drift, the **full,
canonical guidance lives in [`CLAUDE.md`](./CLAUDE.md)** — read that file. This
page is a short pointer plus the essentials.

## What this repo is

The **AI Education** curriculum: a Docusaurus docs site (`docs/`) plus a Claude
assessment skill (`skills/ai-assessment/`). It teaches practical AI skills to
non-technical professionals using the Claude desktop app — Phase 1 (AI
foundations), Phase 2 (Claude in practice), Phase 3 (working confidently with
AI), and an optional technical appendix.

## Quick reference

- **Validate before committing:** `cd docs && npm run build` — the build throws on
  broken links/anchors, so a passing build is the link check. Don't commit around a
  failing build.
- **Keep assessments in sync:** question text lives in
  `docs/src/data/question-bank.json`; scoring rubrics live only in
  `skills/ai-assessment/rubrics.json`. Ids must match — `cd docs && npm run build:skill`
  validates parity and regenerates the downloadable skill zip.
- **Don't duplicate concepts — cross-link** to the canonical section instead.
- **Verify fast-moving facts** (Claude features, model names, prices, links)
  against official docs before writing them.

For the full rules — anchor-slug gotchas, runtime-only links, content style, and
deployment — see [`CLAUDE.md`](./CLAUDE.md).
