# AI Assessment Skill

A GitHub Copilot CLI skill that runs interactive self-assessments for the Phase 1 curriculum.

## How to use

Open your terminal in this repo and start Copilot CLI. Then say any of these:

```
assess me
quiz me
assess me module 1
quiz me module 2
module 3 assessment
assess me all
```

If you say only `assess me` or `quiz me`, the skill will ask which module you want: 1, 2, 3, or all.

## What changed

- **Per-module assessments** now run 3 questions at a time
- **Module-specific reports** are saved after each module
- **Browser JSON summaries** are written to `docs/static/assessments/`
- **Full Phase 1 assessment** is still available with `assess me all`

## Module coverage

| Module | Questions |
|--------|-----------|
| **1 — How AI Actually Works** | Token generation, training vs. inference, parameters and scale |
| **2 — Using AI Effectively** | Context window, hallucination and grounding, prompting techniques |
| **3 — AI in Your Engineering Workflow** | Agents, prompt injection, blast radius / approvals |

## Output files

For a single module, the skill saves:

- `assessments/<name-slug>-module-<N>-assessment-<YYYY-MM-DD>.md`
- `docs/static/assessments/module-<N>-latest.json`

For `assess me all`, it saves the three module-specific files above and a combined markdown report:

- `assessments/<name-slug>-ai-assessment-<YYYY-MM-DD>.md`

The `assessments/` directory remains gitignored. The JSON files under `docs/static/assessments/` are intended to stay in the repo.

## How it works

The extension lives in `.github/extensions/ai-assessment/extension.mjs` and registers two tools:

- `ai_assessment_start` — starts a specific module assessment, the full assessment, or asks the user to choose a module
- `ai_assessment_save_report` — saves markdown reports and, for module runs, writes `module-N-latest.json`

A keyword hook on `onUserPromptSubmitted` detects phrases like `assess me`, `quiz me module 1`, and `module 2 assessment`, then primes the agent with the right tool call.
