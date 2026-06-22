# Copilot instructions — Herbalife AI Education

These instructions apply to anyone (human or AI agent) editing this repository.
This is the **Herbalife AI Education** curriculum: a contributable, living set of
learning materials that builds AI fluency across Herbalife's engineering teams.
Read this file before making changes, and keep it accurate as conventions evolve.

## What this repo is

- A **Docusaurus** documentation site (`docs/`) for self-paced learning.
- A **Copilot CLI assessment skill** (`.github/extensions/ai-assessment/`) that
  quizzes engineers per module and writes local result files.
- It is a **living curriculum**. AI tooling, model names, and prices change fast —
  content is expected to be corrected and updated continuously.

## Structure

```
docs/docs/phase-1/   Phase 1 — AI Essentials (foundational mental models, 3 modules)
docs/docs/phase-2/   Phase 2 — Copilot in Practice (hands-on with our tools, 5 modules)
docs/docs/phase-3/   Phase 3 — Deep Dives (continued education: technical t1–t6 + strategic s1–s5)
docs/src/pages/question-bank/index.js   Human-readable mirror of every assessment question
.github/extensions/ai-assessment/extension.mjs   The assessment skill (question source of truth)
```

The three phases are intentionally layered: **Phase 1 = how LLMs work, Phase 2 =
how to use our tools effectively, Phase 3 = optional deeper/strategic study.** Keep
each phase in its lane — don't pull deep architecture into Phase 1, or re-teach
foundations in Phase 3.

## Golden rules (do these every time)

1. **Keep the Question Bank in sync with the assessment skill.** (See below — this
   has drifted badly before and is the easiest thing to break.)
2. **Don't duplicate concepts — cross-link instead.** (See "Avoid redundancy.")
3. **Verify fast-moving facts against official docs before you write them.** (See
   "Accuracy.")
4. **Run the build before committing.** `cd docs && npm run build` must pass —
   it fails on broken links/anchors. (See "Validate.")

## Keeping assessments in sync (highest-priority rule)

There are **two** representations of the assessment questions and they MUST match:

- **Source of truth:** `.github/extensions/ai-assessment/extension.mjs` (the
  `MODULES` object, keys `1`–`8`).
- **Mirror for humans:** `docs/src/pages/question-bank/index.js` (the `PHASES` array).

Rules:

- **Any change to a question in `extension.mjs` must be made in `index.js` in the
  same change**, and vice-versa. They are the most common thing to drift.
- They must agree on: question `id`, `shortTitle`, the question wording, the
  topics / `learningTopics`, and the doc anchor (`sectionLink`).
- **Question numbering is global across phases.** Modules are keyed `1`–`8`
  (Phase 1 = modules 1–3, Phase 2 = modules 4–8). Question ids are
  `"<module>-<n>"` (e.g. `1-1`, `4-3`). There are **25 questions total**
  (8 modules × 3, plus Module 1 has a 4th question `1-4`).
- A user-facing assessment is invoked as `assess me phase <p> module <m>` and maps
  to the global module key (Phase 1 Module 1 → `1`; Phase 2 Module 1 → `4`). Keep
  the user-facing "phase N module M" labels correct everywhere they appear
  (`assessments.js`, the question bank, README, and each module's assessment box).
- Every `sectionLink` anchor must point at a heading that actually exists in the
  target doc. If you rename a heading, update the anchor in **both** files.

## Avoid redundancy

- Teach each concept **once**, in its canonical home, and **cross-link** from
  anywhere else it comes up. Don't re-derive the same idea in multiple modules.
- Canonical homes (examples): the **agentic loop** lives in Phase 1 Module 1
  (`how-ai-works.mdx#the-agentic-loop`); **tool-calling mechanics** live in
  Phase 3 T4; **RAG-vs-alternatives** lives in Phase 3 T3. Reference these rather
  than restating them.
- When you must mention a concept taught elsewhere, give a 1–3 sentence recap plus
  a relative link, not a full re-explanation.
- Keep terminology consistent across modules (e.g. the agentic loop is
  Plan → Act → Observe — don't introduce synonyms like "Think" in one module and
  "Plan" in another).

## Accuracy (verify before you write)

AI tooling moves fast and the model is liable to state outdated specifics. Before
writing any of the following, **confirm against official sources**:

- **Copilot CLI** install/auth/commands — confirm against the official GitHub
  Copilot CLI docs. Known-correct as of this writing: install is
  `npm install -g @github/copilot` (Node 22+), also `brew install copilot-cli`,
  `winget install GitHub.Copilot`; first-run auth is the `/login` slash command;
  files are referenced with `@path`. The legacy `gh copilot suggest/explain`
  (`gh-copilot` extension) is a different, older tool — don't conflate them.
- **VS Code Chat** syntax: `#` = context variables (`#file`, `#selection`,
  `#terminal`), `@` = participants (`@workspace`, `@github`). Don't swap them.
- **Model names, context-window sizes, and prices** — these change constantly.
  Prefer naming the *capability* over a specific SKU when you can, and date any
  hard numbers ("as of mid-2025").
- **External resources** — verify links resolve and that referenced
  tools/leaderboards still exist (some get archived).
- A good habit, and one we teach: **ask AI to cite sources so a human can verify.**
  Hold this repo's own content to that standard.

## Validate before committing

- **Always run `cd docs && npm run build`** after editing docs. The site sets
  `onBrokenLinks: 'throw'`, so the build is our link/anchor checker — a passing
  build means internal links and heading anchors resolve. A failing build must be
  fixed, not committed around.
- Use `cd docs && npm run dev` for live preview while writing; `npm run build`
  before you commit.

### Anchor-slug gotchas (Docusaurus)

Heading anchors are auto-generated: lowercase, punctuation stripped, spaces →
hyphens. Watch for:

- An em-dash with surrounding spaces (`Foo — bar`) produces a **double** hyphen:
  `#foo--bar`.
- Headings containing code spans drop backticks, dots, and slashes:
  ``Custom instructions: `.github/copilot-instructions.md` `` →
  `#custom-instructions-githubcopilot-instructionsmd`.

When in doubt, build and let it tell you the link is broken.

## Style & content conventions

- Write **for engineers, not academics**. Favor "what it means / why it matters"
  over internal math. Use analogies.
- Hands-on exercises must use tools the team actually has — no paid APIs or
  proprietary access required.
- Code examples in **TypeScript/JavaScript or Java** (our primary stacks).
- Keep each module's **vocabulary table** current when you add a term.
- Note recency for fast-moving claims ("as of mid-2025").
- Module docs are `.mdx` so they can embed assessment components; plain markdown
  is fine unless you need JSX.

## Branding, identity, and personal files

- Product name: **Herbalife AI Education**. Repo: `alexkhadiwala-hl/ai-education`.
  Don't reintroduce placeholders like `your-org` / `herbalife` / `ai-education-hl`
  in config or links.
- **Personal assessment results are gitignored and must stay that way:**
  `/assessments/` and `docs/static/assessments/*.json`. Never commit a person's
  results.

## Commits

- Use the configured git identity (`Alex Khadiwala <alexkh@herbalife.com>`).
- Include the trailer:
  `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`.

## Pre-commit checklist

- [ ] Question Bank (`index.js`) matches the skill (`extension.mjs`) — ids, wording,
      topics, anchors, and "phase N module M" labels.
- [ ] No duplicated concept; cross-links used instead.
- [ ] Fast-moving facts (Copilot CLI, models, prices, links) verified.
- [ ] `cd docs && npm run build` passes.
- [ ] No personal assessment files staged.
