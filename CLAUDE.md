# AI Education — repo conventions

This repo is the **AI Education** curriculum: a Docusaurus docs site (`docs/`) plus a
Claude assessment skill (`skills/ai-assessment/`). The curriculum teaches practical AI
skills to **non-technical professionals** using the Claude desktop app — the learner is
not a developer, so all learner-facing content must avoid code-centric examples and
assumed programming knowledge. (This file is maintainer guidance; the maintainer edits
the repo with AI coding tools.)

## Layout

```
docs/                       ← the Docusaurus site (the only app; build from here)
docs/docs/phase-1/          ← Phase 1: AI Essentials (3 modules, .mdx)
docs/docs/phase-2/          ← Phase 2: Claude in Practice (5 modules, .mdx)
docs/docs/phase-3/          ← Phase 3: Working Confidently with AI (5 modules)
docs/docs/appendix/         ← Under the Hood — optional technical deep dives
docs/src/data/question-bank.json   ← assessment questions (public; NO rubrics here)
skills/ai-assessment/       ← Claude skill: SKILL.md + rubrics.json (+ questions.json copied at build)
scripts/build-skill.mjs     ← packages the skill zip into docs/static/downloads/
```

## Commands

- `cd docs && npm run dev` — hot-reload dev server (search disabled in dev).
- `cd docs && npm run build` — full build; **throws on broken links/anchors**, so a
  passing build is the link check. Always run before committing content changes.
- `cd docs && npm run build:skill` — re-copies `question-bank.json` into the skill,
  validates question/rubric id parity, and re-zips
  `docs/static/downloads/ai-assessment-skill.zip`. Run after editing questions,
  rubrics, or `SKILL.md`.

## Assessment data sync rule

Question text/topics/links live in **`docs/src/data/question-bank.json`** (imported by
the Question Bank and Assessments pages and copied into the skill zip). Scoring rubrics
live **only** in `skills/ai-assessment/rubrics.json` — never put rubric/evaluation text
in `question-bank.json` or anywhere the site bundles, so learners can't read the answer
key. Every question id must exist in both files; `npm run build:skill` fails loudly on
mismatch. After changing either file, run `build:skill` and commit the regenerated zip.

## Content conventions

- Phase 1/2 module files are `.mdx` with explicit `id:` frontmatter; filenames use
  numeric prefixes (`01-...`) that Docusaurus strips from the doc id.
- Each Phase 1/2 module ends with `<AssessmentResults moduleNumber={N} phase={P} moduleInPhase={M} />`.
  Global module numbers: Phase 1 = 1–3, Phase 2 = 4–8. Phase 3 and the appendix have no assessments.
- Don't re-teach a concept that lives elsewhere — cross-link its canonical section.
- Heading anchors are load-bearing: `question-bank.json` `sectionLink`s and the skill's
  review links point at `#anchors`. If you rename a heading, grep `question-bank.json`
  for the old anchor. The build's `onBrokenAnchors: 'throw'` only covers doc-to-doc
  links, not JSON data.
- Verify fast-moving facts (Claude features, model names, plan pricing, URLs) against
  official docs before writing them.
- Keep examples profession-neutral (writing, research, analysis, meetings) — not legal-
  or engineering-specific. Safety guidance stays generic: "check your organization's
  policy," never legal advice.

## Runtime-only links (not covered by the build's link checker)

When renaming doc slugs, also update: `docs/src/lib/progress.js` (CURRICULUM ids),
`docs/src/components/ProgressSummary/index.js` (phase labels),
`docs/src/data/question-bank.json` (docLink/sectionLink), and the footer links in
`docs/docusaurus.config.js`.

## Deployment

Production: https://ai-education.alexkhadiwala.com (Vercel project `ai-education`,
Root Directory `docs`). **Pushes to `main` auto-deploy** through Vercel's Git
integration. `.github/workflows/deploy.yml` is a validation-only workflow: it runs
`npm run build:skill` and `npm run build` so broken links, anchors, or question/rubric
drift fail before or alongside deployment. Manual fallback: `cd docs && vercel deploy
--prod --yes`. If the production domain ever changes,
update `url` in `docs/docusaurus.config.js` and re-run `npm run build:skill`
(the skill bakes absolute site URLs).
