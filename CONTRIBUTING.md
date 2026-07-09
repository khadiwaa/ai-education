# Contributing to the AI Education Curriculum

This is a living curriculum — it should evolve as AI tools change and as we learn what
works for real teams. Contributions are welcome, and so are wholesale forks: adapt it
for your own organization.

---

## Ways to contribute

- **Fix an error** — spot something outdated or incorrect? Fix it directly.
- **Improve an explanation** — if a concept is confusing, rewrite it.
- **Add an example** — real-world, profession-neutral examples are especially valuable.
- **Suggest a new module** — open an issue using the content suggestion template.
- **Update for new tooling** — AI moves fast. When something changes, update it.

---

## How content is organized

```
docs/docs/phase-1/    ← Phase 1: AI Essentials (3 modules)
docs/docs/phase-2/    ← Phase 2: Claude in Practice (5 modules)
docs/docs/phase-3/    ← Phase 3: Working Confidently with AI (5 modules)
docs/docs/appendix/   ← Under the Hood — optional technical deep dives
```

Module files use `.mdx` (Markdown + JSX) to support embedded assessment components.
Standard markdown works fine — you only need JSX if you're adding React components.

> **Editing with an AI assistant?** Point it at [`CLAUDE.md`](./CLAUDE.md) first — it
> captures the conventions that keep this repo consistent.

---

## Making a change

1. Fork the repo (or create a branch if you have write access)
2. Edit the relevant file(s) under `docs/docs/`
3. Test locally:
   ```bash
   cd docs && npm run dev    # hot-reload, instant preview
   cd docs && npm run build  # full build — fails on broken links/anchors; run before submitting
   ```
4. Open a pull request with a brief description of what you changed and why

---

## Content guidelines

- **Write for busy professionals, not academics or engineers.** Use analogies. Plain
  language beats jargon. Assume no programming knowledge in Phases 1–3.
- **Prefer "what it means" over "how it works."** Readers need to make good decisions
  with AI, not build AI systems. (The technical appendix is the exception.)
- **If something changed, say what changed and when.** A note like "as of mid-2026"
  helps readers calibrate.
- **Keep examples profession-neutral** — writing, research, analysis, meetings — so any
  team can use the curriculum as-is.
- **Safety content stays generic.** "Check your organization's policy" — never legal advice.
- **Don't re-teach a concept that lives elsewhere — cross-link it.** Each idea has one
  canonical home.
- **Validate the build before submitting.** `cd docs && npm run build` fails on broken
  links and missing heading anchors.

---

## If you touch the assessments

- Question text, topics, and section links live in `docs/src/data/question-bank.json`
  (rendered on the Question Bank page and shipped inside the Claude skill).
- Scoring rubrics live **only** in `skills/ai-assessment/rubrics.json` — never in the
  public JSON, so learners can't read the answer key.
- Every question id must exist in both files. Run `cd docs && npm run build:skill` —
  it validates parity and regenerates `docs/static/downloads/ai-assessment-skill.zip`.
  Commit the regenerated zip with your change.

---

## Suggesting a new module

Open an issue and use the "Content Suggestion" template. Include:
- What topic you think is missing
- Why it's important for this audience right now
- Any source material or resources you'd recommend
