# Contributing to the AI Education Curriculum

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
slides/decks/phase-1/    ← Slidev presentation decks (markdown)
docs/docs/phase-1/       ← Docusaurus reference docs (markdown)
```

Each module has two files with the same content in different formats:
- A **slide deck** (`.md` with Slidev frontmatter) for live presentations
- A **reference doc** (`.md` with standard markdown) for self-paced reading

When you update content, update both files to keep them in sync.

---

## Making a change

1. Fork the repo (or create a branch if you have write access)
2. Edit the relevant markdown file(s)
3. Test locally:
   - Slides: `cd slides && npm run dev`
   - Docs: `cd docs && npm run start`
4. Open a pull request with a brief description of what you changed and why

---

## Content guidelines

- **Write for engineers, not for academics.** Use analogies. Avoid jargon when plain language works.
- **Prefer "what it means" over "how it works."** Engineers need to make good decisions with AI, not build AI systems from scratch.
- **If something changed, say what changed and when.** AI moves fast — a note like "as of mid-2025" helps readers calibrate.
- **Hands-on exercises should use tools the team actually has.** Don't require paid APIs or proprietary access for exercises.
- **Keep vocabulary sections current.** If a term gets added to a module, add it to the vocabulary table.

---

## Suggesting a new module

Open an issue and use the "Content Suggestion" template. Include:
- What topic you think is missing
- Why it's important for the team right now
- Any source material or resources you'd recommend
