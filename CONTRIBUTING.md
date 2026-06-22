# Contributing to the Herbalife AI Education Curriculum

This is a living curriculum — it should evolve as AI tooling changes, as we learn what works with our teams, and as we deepen our own understanding. Contributions from everyone are welcome.

---

## Ways to contribute

- **Fix an error** — spot something outdated or incorrect? Fix it directly.
- **Improve an explanation** — if a concept is confusing, rewrite it.
- **Add an example** — real-world examples from our codebase or work are especially valuable.
- **Suggest a new module** — open an issue using the content suggestion template.
- **Update for new tooling** — AI tooling moves fast. When something changes, update it.

---

## How content is organized

```
docs/docs/phase-1/    ← Phase 1: AI Essentials (3 modules)
docs/docs/phase-2/    ← Phase 2: Copilot in Practice (5 modules)
docs/docs/phase-3/    ← Phase 3: Deep Dives (technical + strategic tracks)
```

Module files use `.mdx` (Markdown + JSX) to support embedded assessment components. Standard markdown syntax works fine — you only need JSX if you're adding React components.

> **Editing with an AI assistant?** Read [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) first — it captures the conventions that keep this repo consistent (assessment sync, avoiding redundancy, verifying fast-moving facts, and validating the build). The highlights below apply to everyone.

---

## Making a change

1. Fork the repo (or create a branch if you have write access)
2. Edit the relevant `.mdx` file(s) under `docs/docs/`
3. Test locally:
   ```bash
   cd docs && npm run dev    # hot-reload, instant preview
   cd docs && npm run build  # full build — fails on broken links/anchors; run before submitting
   ```
4. Open a pull request with a brief description of what you changed and why

---

## Content guidelines

- **Write for engineers, not for academics.** Use analogies. Avoid jargon when plain language works.
- **Prefer "what it means" over "how it works."** Engineers need to make good decisions with AI, not build AI systems from scratch.
- **If something changed, say what changed and when.** AI moves fast — a note like "as of mid-2025" helps readers calibrate.
- **Hands-on exercises should use tools the team actually has.** Don't require paid APIs or proprietary access for exercises.
- **Keep vocabulary sections current.** If a term gets added to a module, add it to the vocabulary table.
- **Use TypeScript/JavaScript or Java for code examples.** These are the primary languages used across Herbalife engineering teams.
- **Don't re-teach a concept that lives elsewhere — cross-link it.** Each idea has one canonical home; reference it instead of restating it.
- **Validate the build before submitting.** `cd docs && npm run build` fails on broken links and missing heading anchors, so a passing build is the check that your links resolve.

---

## If you touch the assessments

The assessment questions exist in **two files that must stay in sync**:

- `.github/extensions/ai-assessment/extension.mjs` — the skill (source of truth).
- `docs/src/pages/question-bank/index.js` — the human-readable Question Bank page.

If you change a question, change **both** files in the same PR — they must agree on
the question id, title, wording, topics, and the doc anchor it links to. See
[`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for the full rules.

---

## Suggesting a new module

Open an issue and use the "Content Suggestion" template. Include:
- What topic you think is missing
- Why it's important for the team right now
- Any source material or resources you'd recommend
