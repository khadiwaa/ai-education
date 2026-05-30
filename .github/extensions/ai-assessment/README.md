# AI Assessment Skill

A GitHub Copilot CLI skill that gives engineers an interactive self-assessment based on the Phase 1 curriculum. At the end, it saves a sharable report to a markdown file.

## How to use

Open your terminal in this repo and start Copilot CLI. Then simply say:

```
assess me
quiz me
run the AI knowledge check
test my understanding
```

The skill detects these phrases and automatically kicks off the assessment.

You can also scope it to a specific module:

```
assess me on module 1
quiz me on using AI effectively
run the assessment for module 3
```

## What to expect

1. The assessor asks for your name (used in the report)
2. **9 questions** across all three Phase 1 modules (3 per module), or fewer if scoped
3. Each question expects a **paragraph-length response** — explain your thinking
4. After each answer: brief feedback on what you demonstrated well and one thing to deepen
5. At the end: a verbal summary plus a saved report file

## The report

After the assessment, a markdown report is saved to:

```
assessments/<your-name>-ai-assessment-<YYYY-MM-DD>.md
```

The report includes:
- **Score per question** (1–3) with signal: Strong / Solid / Developing
- **Overall score** (e.g. 22/27 — 81% — Strong)
- **Strengths** — what you demonstrated well across the assessment
- **Development areas** — highest-leverage gaps to address
- **Learning recommendations** — specific topics and Phase 2 modules linked to your gaps
- **Question-by-question breakdown** — per-question feedback, score, and reading recommendations

This file is listed in `.gitignore` and won't be committed — it's yours to share as you choose (with your manager, peers, or to track your own progress over time).

## What's covered

| Module | Questions |
|--------|-----------|
| **1 — How AI Actually Works** | Next-token prediction, model size tradeoffs, training vs. inference |
| **2 — Using AI Effectively** | Context windows, grounding/RAG for accurate answers, hallucination |
| **3 — AI in Your Workflow** | Prompt injection security, agent human-in-the-loop design, personal framework |

## Scoring rubric

| Score | Signal | Meaning |
|-------|--------|---------|
| 3 | Strong | Clear understanding, connected to practical implications, concrete examples |
| 2 | Solid | Correct but missing meaningful nuance or depth |
| 1 | Developing | Partial or surface-level; key concepts missing or confused |

## How it works (for contributors)

The skill is a Copilot CLI extension in `.github/extensions/ai-assessment/extension.mjs`.

It registers two tools:
- **`ai_assessment_start`** — returns structured assessment instructions including questions, evaluation guidance (hidden from engineers), and learning topics per question
- **`ai_assessment_save_report`** — takes structured results from the agent and writes the formatted markdown report

A keyword hook (`onUserPromptSubmitted`) detects phrases like "assess me" and primes the agent to call `ai_assessment_start`.

To update or add questions, edit the `QUESTIONS` object in `extension.mjs`. Each question has:
- `id` — unique identifier
- `shortTitle` — used in the score table and report
- `question` — shown to the engineer
- `evaluationGuidance` — what the agent looks for (never shown to the engineer)
- `learningTopics` — resources recommended when score < 3
- `referenceModule` — the Phase 2 module most relevant to this gap
