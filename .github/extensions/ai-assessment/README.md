# AI Assessment Skill

A GitHub Copilot CLI skill that gives engineers an interactive self-assessment based on the Phase 1 curriculum.

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

- **9 questions** across the three Phase 1 modules (3 per module), or fewer if you scope to a specific module
- Each question expects a **paragraph-length response** — explain your thinking, don't just give one-word answers
- After each answer, you'll get brief feedback: what you demonstrated well and one thing to go deeper on
- At the end, you'll get a **summary** of your strengths and recommended next steps
- This is a self-assessment, not a graded test — be honest with yourself

## What's covered

| Module | Questions |
|--------|-----------|
| **1 — How AI Actually Works** | Next-token prediction, model size tradeoffs, training vs. inference |
| **2 — Using AI Effectively** | Context windows, grounding/RAG for accurate answers, hallucination |
| **3 — AI in Your Workflow** | Prompt injection security, agent human-in-the-loop design, personal framework |

## How it works (for contributors)

The skill is a Copilot CLI extension in `.github/extensions/ai-assessment/extension.mjs`.

It registers one tool (`ai_assessment_start`) and a keyword hook. When an engineer asks to be assessed, the hook primes the agent to call the tool. The tool returns structured assessment instructions — the 9 questions plus (hidden) evaluation guidance — and the agent conducts the conversational interview from there.

To update or add questions, edit the `QUESTIONS` object in `extension.mjs`. Questions are organized by module (1, 2, 3) and each has:
- `id` — unique identifier
- `question` — what the engineer is asked (shown to them)
- `evaluationGuidance` — what the agent looks for (never shown to the engineer)
