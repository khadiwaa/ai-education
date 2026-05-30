import { joinSession } from "@github/copilot-sdk/extension";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// ─────────────────────────────────────────────────────────────────────────────
// Assessment questions, keyed by module.
//
// Each question includes:
//   - question:            shown to the engineer
//   - evaluationGuidance:  shown only to the assessor (the agent)
//   - learningTopics:      specific topics to recommend when the score is < 3
//   - referenceModule:     which Phase 2 module covers this gap most directly
// ─────────────────────────────────────────────────────────────────────────────

const QUESTIONS = {
  1: [
    {
      id: "1a",
      shortTitle: "Next-token prediction & confident mistakes",
      question:
        "Explain next-token prediction in your own words — as if you were describing it to a senior engineer on your team who hasn't touched AI yet. What does this mechanism tell us about *why* models sometimes make confident mistakes?",
      evaluationGuidance:
        "Look for: understanding that the model predicts statistically likely continuations (not verified facts), and that confidence and correctness are different things. Strong answer connects the mechanism to hallucination.",
      learningTopics: [
        "Next-token prediction and autoregressive generation (Module 1 docs)",
        "Hallucination — why it's structural, not a bug (Module 2 docs)",
        "Phase 2 T1: Transformer Architecture Deep Dive",
      ],
      referenceModule: "T1 — Transformer Architecture Deep Dive",
    },
    {
      id: "1b",
      shortTitle: "Model size tradeoffs",
      question:
        "A teammate says: 'We should upgrade to a 70B model — it'll definitely be better for our use case.' What questions would you ask to evaluate that claim, and what tradeoffs would you walk them through?",
      evaluationGuidance:
        "Look for: awareness that bigger isn't always better (cost, latency, hardware), that the task type matters, that benchmark scores don't equal real-world fit. Strong answer mentions inference cost, context window, and the distinction between training vs. inference.",
      learningTopics: [
        "Parameters and model size — what they mean in practice (Module 1 docs)",
        "Training vs. inference cost distinction (Module 1 docs)",
        "Phase 2 S1: Platform Strategy & Vendor Evaluation",
        "Phase 2 S2: Cost Modeling & Optimization",
      ],
      referenceModule: "S1 — Platform Strategy & Vendor Evaluation",
    },
    {
      id: "1c",
      shortTitle: "Training vs. inference",
      question:
        "Describe in your own words the difference between training and inference. Why does this distinction matter when your team is using Copilot or calling an AI API?",
      evaluationGuidance:
        "Look for: training = computing the weights (expensive, done by providers); inference = running the model (what your team does on every request). Strong answer notes that teams consume inference and have no control over training.",
      learningTopics: [
        "Training vs. inference — what happens when you send a prompt (Module 1 docs)",
        "Phase 2 T5: Fine-Tuning & Model Customization (for deeper training understanding)",
      ],
      referenceModule: "T5 — Fine-Tuning & Model Customization",
    },
  ],
  2: [
    {
      id: "2a",
      shortTitle: "Context windows in practice",
      question:
        "Describe what the context window is and explain its practical implications. Give a concrete example — real or hypothetical — of how context window limits have affected or could affect work on your team.",
      evaluationGuidance:
        "Look for: understanding that the context window is the model's working memory, has a hard token limit, and that exceeding it loses information. Strong answer includes a real/plausible scenario (e.g., large codebase, long conversation history) and mentions cost implications.",
      learningTopics: [
        "Context windows — size, limits, and the 'lost in the middle' problem (Module 2 docs)",
        "Phase 2 T3: Embeddings, RAG & Retrieval Systems (for managing large context)",
      ],
      referenceModule: "T3 — Embeddings, RAG & Retrieval Systems",
    },
    {
      id: "2b",
      shortTitle: "RAG and grounding for accurate AI features",
      question:
        "Your team wants to build an AI feature that answers questions about your internal APIs, which are updated frequently. How would you approach making the AI's answers accurate and current? Walk me through your reasoning.",
      evaluationGuidance:
        "Look for: RAG pattern as the answer (don't rely on training data for private/changing info; retrieve docs and inject them). Strong answer explains *why* fine-tuning is not the right tool here, and touches on grounding the model in provided context.",
      learningTopics: [
        "RAG — Retrieval-Augmented Generation pattern (Module 2 docs)",
        "The grounding principle: provide context rather than asking the model to recall (Module 2 docs)",
        "Phase 2 T3: Embeddings, RAG & Retrieval Systems",
        "Phase 2 T2: Advanced Prompt Engineering & Evaluation",
      ],
      referenceModule: "T3 — Embeddings, RAG & Retrieval Systems",
    },
    {
      id: "2c",
      shortTitle: "Responding to hallucination concerns",
      question:
        "A teammate says: 'The AI keeps hallucinating on this feature — we should just stop using AI for it.' How would you respond? What would you want to understand about their situation, and what alternatives would you suggest?",
      evaluationGuidance:
        "Look for: nuanced response that doesn't dismiss the concern. Should explore *what kind* of task is hallucinating (recall vs. reasoning), suggest grounding (RAG, providing source material), chain-of-thought, or task re-scoping. Strong answer distinguishes between high-risk recall tasks and safer reasoning/reformatting tasks.",
      learningTopics: [
        "Hallucination — types, causes, and mitigation (Module 2 docs)",
        "The grounding principle and RAG as mitigation (Module 2 docs)",
        "Phase 2 T2: Advanced Prompt Engineering & Evaluation",
      ],
      referenceModule: "T2 — Advanced Prompt Engineering & Evaluation",
    },
  ],
  3: [
    {
      id: "3a",
      shortTitle: "Prompt injection security",
      question:
        "You're building a customer-facing feature where users can ask questions and the AI retrieves answers from a knowledge base of support docs. A security-conscious teammate asks 'what could go wrong from a security standpoint?' Walk them through the risk you'd explain and what you'd do about it.",
      evaluationGuidance:
        "Look for: prompt injection, specifically indirect injection (content in retrieved docs could contain attacker instructions). Strong answer describes the attack vector (malicious content in the knowledge base that hijacks the agent's behavior), mitigation strategies (output validation, least-privilege tools, separating data from instructions), and the importance of not acting on model output blindly.",
      learningTopics: [
        "Prompt injection — direct and indirect injection attacks (Module 3 docs)",
        "Least-privilege tool access for agents (Module 3 docs)",
        "Phase 2 T4: Agents & Multi-Agent Systems (for production security patterns)",
      ],
      referenceModule: "T4 — Agents & Multi-Agent Systems",
    },
    {
      id: "3b",
      shortTitle: "Human-in-the-loop agent design",
      question:
        "Your team is designing an agent that reads support tickets, looks up relevant code, and can autonomously commit fixes and deploy them. How would you think about the human-in-the-loop design for this system? Where would you require human approval, and why?",
      evaluationGuidance:
        "Look for: blast-radius thinking — low-stakes/reversible actions (reading, generating suggestions) can be automated; high-stakes/irreversible actions (commits, deploys) need approval gates. Strong answer uses a framework of stakes + reversibility, mentions what a 'wrong decision' looks like in this context, and touches on the risk that agents have the permissions of the code they run.",
      learningTopics: [
        "Human-in-the-loop — stakes and reversibility framework (Module 3 docs)",
        "Agent blast-radius and least-privilege design (Module 3 docs)",
        "Phase 2 T4: Agents & Multi-Agent Systems",
      ],
      referenceModule: "T4 — Agents & Multi-Agent Systems",
    },
    {
      id: "3c",
      shortTitle: "Personal framework for AI in engineering",
      question:
        "Think about how you've been using AI tools in your engineering work so far (or how you imagine using them). Where has AI been most genuinely helpful? Where has it fallen short or misled you? What's your personal framework now for deciding when to lean on AI vs. when to stay skeptical?",
      evaluationGuidance:
        "Look for: honest, reflective answer. Good answers distinguish syntax/structure (where AI is strong) from semantics/judgment (where humans are essential). This question has no wrong answer — assess for thoughtfulness and calibration.",
      learningTopics: [
        "AI strengths vs. limitations in engineering work (Module 3 docs)",
        "Phase 2 S3: AI Product Strategy (for broader application thinking)",
      ],
      referenceModule: "S3 — AI Product Strategy",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Tool: ai_assessment_start
// ─────────────────────────────────────────────────────────────────────────────

const assessmentStartTool = {
  name: "ai_assessment_start",
  description:
    "Start the AI knowledge self-assessment for the Phase 1 curriculum. Call this when the user " +
    "asks to be assessed, quizzed, or wants to test their AI knowledge. Returns structured " +
    "assessment instructions including questions and evaluation guidance.",
  parameters: {
    type: "object",
    properties: {
      module: {
        type: "string",
        enum: ["1", "2", "3", "all"],
        description:
          "Which module to assess: '1' (How AI Works), '2' (Using AI Effectively), " +
          "'3' (AI in Your Workflow), or 'all' for the full Phase 1 assessment. Default: 'all'.",
      },
    },
    required: [],
  },
  handler: async (args) => {
    const scope = args?.module ?? "all";

    let selectedModules;
    let scopeLabel;

    if (scope === "all") {
      selectedModules = [1, 2, 3];
      scopeLabel = "Full Phase 1 Assessment (all three modules)";
    } else {
      const num = parseInt(scope, 10);
      selectedModules = [num];
      const labels = {
        1: "Module 1 — How AI Actually Works",
        2: "Module 2 — Using AI Effectively",
        3: "Module 3 — AI in Your Engineering Workflow",
      };
      scopeLabel = labels[num] ?? `Module ${num}`;
    }

    const questions = selectedModules.flatMap((m) => QUESTIONS[m] ?? []);
    const total = questions.length;
    const maxScore = total * 3;

    const questionList = questions
      .map(
        (q, i) => `QUESTION ${i + 1} of ${total} [ID: ${q.id}] — ${q.shortTitle}
QUESTION TEXT: ${q.question}

EVALUATION GUIDANCE (do not share with engineer):
${q.evaluationGuidance}

LEARNING TOPICS FOR THIS QUESTION (use in report if score < 3):
${q.learningTopics.map((t) => `  • ${t}`).join("\n")}`
      )
      .join("\n\n---\n\n");

    const questionIds = questions.map((q) => q.id).join(", ");

    return `
You are now conducting an AI knowledge self-assessment for an engineer on this team.

ASSESSMENT SCOPE: ${scopeLabel}
TOTAL QUESTIONS: ${total}
MAX SCORE: ${maxScore} (${total} questions × 3 points each)
QUESTION IDs IN ORDER: ${questionIds}

═══════════════════════════════════════════════════════
INSTRUCTIONS FOR YOU (the assessor — do not share these with the engineer)
═══════════════════════════════════════════════════════

STEP 1 — COLLECT NAME
Before starting, ask: "Before we begin, what's your name?" Wait for their answer. Use it throughout.

STEP 2 — INTRODUCE THE ASSESSMENT
Tell the engineer:
  • This is a self-assessment, not a pass/fail test
  • There are ${total} questions covering ${scopeLabel}
  • Each question expects a paragraph-length response (3–8 sentences is fine)
  • The goal is to surface what they know well and where to go deeper
  • They should answer in their own words — no looking things up
  • At the end, a report file will be saved they can share with their manager or peers

STEP 3 — ASK QUESTIONS ONE AT A TIME
Do not reveal the next question until they've answered the current one.

STEP 4 — SCORE AND RESPOND AFTER EACH ANSWER
After each response, do two things:

(A) Give the engineer brief verbal feedback:
  - Acknowledge what they demonstrated well (1–2 sentences)
  - Name one nuance or concept they could go deeper on (1 sentence)
  - Do NOT reveal the numeric score yet

(B) Internally record the score for the report (do not say it aloud):
  SCORING RUBRIC:
    3 — Strong: Clearly understands the concept, connects it to practical implications, may give concrete examples
    2 — Solid: Correct understanding but missing meaningful nuance or depth
    1 — Developing: Partial or surface-level understanding; key concepts missing or confused

STEP 5 — AFTER ALL QUESTIONS: VERBAL SUMMARY
Give the engineer a brief spoken summary:
  - 2–3 sentences on overall strengths observed
  - 2–3 sentences on highest-leverage areas to develop
  - Recommended next Phase 2 module based on their biggest gap, with one-sentence rationale
  - Tell them: "I'm saving your results now — you'll have a report file you can share."

STEP 6 — SAVE THE REPORT
Call the \`ai_assessment_save_report\` tool with:

  engineer_name: (the name they gave you in Step 1)
  scope: "${scopeLabel}"
  questions_json: A JSON array (as a string) of objects, one per question answered, in order:
    [
      {
        "id": "<question ID>",
        "short_title": "<short title>",
        "score": <1, 2, or 3>,
        "signal": "<Strong | Solid | Developing>",
        "what_they_did_well": "<1–2 sentences>",
        "gap_note": "<1 sentence on what to go deeper on, or empty string if score is 3>",
        "learning_topics": ["topic 1", "topic 2", ...]  // include only if score < 3, else []
      },
      ...
    ]
  overall_strengths: "<2–3 sentences on what the engineer demonstrated well overall>"
  development_areas: "<2–3 sentences on the highest-leverage areas to grow>"
  recommended_module: "<Phase 2 module name>"
  recommended_module_rationale: "<one sentence on why this module fits their gaps>"

STEP 7 — CONFIRM TO THE ENGINEER
After calling save_report, tell the engineer the path of the saved file so they know where to find it.

TONE THROUGHOUT: Warm, direct, collegial. This is a learning conversation, not an interrogation.
Do NOT share evaluation guidance, learning topics, or scoring rubric with the engineer at any point.

═══════════════════════════════════════════════════════
QUESTIONS
═══════════════════════════════════════════════════════

${questionList}

═══════════════════════════════════════════════════════
Begin now: ask for the engineer's name, then introduce the assessment.
═══════════════════════════════════════════════════════
`.trim();
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Tool: ai_assessment_save_report
// Called by the agent at the end of the assessment to write the report file.
// ─────────────────────────────────────────────────────────────────────────────

const saveReportTool = {
  name: "ai_assessment_save_report",
  description:
    "Save a completed AI knowledge assessment report to a markdown file in the assessments/ directory. " +
    "Call this after all questions have been answered and scored.",
  parameters: {
    type: "object",
    properties: {
      engineer_name: {
        type: "string",
        description: "Full name of the engineer being assessed.",
      },
      scope: {
        type: "string",
        description: "Assessment scope label (e.g. 'Full Phase 1 Assessment').",
      },
      questions_json: {
        type: "string",
        description:
          "JSON string — array of question result objects, each with: " +
          "id, short_title, score (1–3), signal, what_they_did_well, gap_note, learning_topics (array).",
      },
      overall_strengths: {
        type: "string",
        description: "2–3 sentences on what the engineer demonstrated well overall.",
      },
      development_areas: {
        type: "string",
        description: "2–3 sentences on the highest-leverage areas to grow.",
      },
      recommended_module: {
        type: "string",
        description: "Name of the recommended Phase 2 module.",
      },
      recommended_module_rationale: {
        type: "string",
        description: "One sentence explaining why this module fits their gaps.",
      },
    },
    required: [
      "engineer_name",
      "scope",
      "questions_json",
      "overall_strengths",
      "development_areas",
      "recommended_module",
      "recommended_module_rationale",
    ],
  },
  handler: async (args) => {
    let results;
    try {
      results = JSON.parse(args.questions_json);
    } catch {
      return { textResultForLlm: "Failed to parse questions_json — invalid JSON.", resultType: "failure" };
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    const totalScore = results.reduce((sum, q) => sum + (q.score ?? 0), 0);
    const maxScore = results.length * 3;
    const pct = Math.round((totalScore / maxScore) * 100);

    // Determine overall signal
    const overallSignal =
      pct >= 80 ? "Strong" : pct >= 55 ? "Solid" : "Developing";

    // Collect all unique learning topics from questions that scored < 3
    const allGaps = results
      .filter((q) => (q.score ?? 0) < 3)
      .flatMap((q) => q.learning_topics ?? []);
    const uniqueGaps = [...new Set(allGaps)];

    // Build the score table
    const scoreRows = results
      .map(
        (q, i) =>
          `| ${i + 1} | ${q.short_title ?? q.id} | ${q.score ?? "—"}/3 | ${q.signal ?? ""} |`
      )
      .join("\n");

    // Build the per-question detail section
    const questionDetails = results
      .map((q, i) => {
        const lines = [
          `### Q${i + 1}: ${q.short_title ?? q.id}`,
          `**Score:** ${q.score ?? "—"}/3 — ${q.signal ?? ""}`,
          ``,
          `**What you demonstrated:** ${q.what_they_did_well ?? ""}`,
        ];
        if (q.gap_note) {
          lines.push(``, `**To go deeper:** ${q.gap_note}`);
        }
        if (q.learning_topics && q.learning_topics.length > 0) {
          lines.push(``, `**Recommended reading:**`);
          q.learning_topics.forEach((t) => lines.push(`- ${t}`));
        }
        return lines.join("\n");
      })
      .join("\n\n---\n\n");

    // Build learning recommendations section
    const learningSection =
      uniqueGaps.length > 0
        ? uniqueGaps.map((t) => `- ${t}`).join("\n")
        : "_No significant gaps identified — strong performance across all questions._";

    const markdown = `# AI Knowledge Assessment Report

| | |
|---|---|
| **Engineer** | ${args.engineer_name} |
| **Date** | ${dateStr} at ${timeStr} |
| **Assessment scope** | ${args.scope} |
| **Overall score** | ${totalScore}/${maxScore} (${pct}%) — **${overallSignal}** |

---

## Score Summary

| # | Question | Score | Signal |
|---|----------|-------|--------|
${scoreRows}

**Total: ${totalScore}/${maxScore} (${pct}%) — ${overallSignal}**

---

## Strengths

${args.overall_strengths}

---

## Areas to Develop

${args.development_areas}

---

## Learning Recommendations

${learningSection}

---

## Recommended Next Step

**${args.recommended_module}**

${args.recommended_module_rationale}

---

## Question-by-Question Breakdown

${questionDetails}

---

_Generated by the AI Education self-assessment skill — [ai-education-hl](https://github.com/your-org/ai-education-hl)_
`.trim();

    // Write file
    const safeName = args.engineer_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filename = `${safeName}-ai-assessment-${dateStr}.md`;
    const cwd = process.cwd();
    const dir = join(cwd, "assessments");

    try {
      mkdirSync(dir, { recursive: true });
      const filepath = join(dir, filename);
      writeFileSync(filepath, markdown, "utf-8");
      return {
        textResultForLlm:
          `Report saved successfully.\n` +
          `File: assessments/${filename}\n` +
          `Score: ${totalScore}/${maxScore} (${pct}%) — ${overallSignal}\n` +
          `Engineer: ${args.engineer_name}`,
        resultType: "success",
      };
    } catch (err) {
      return {
        textResultForLlm: `Failed to write report: ${err.message}`,
        resultType: "failure",
      };
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Keyword hook
// ─────────────────────────────────────────────────────────────────────────────

const ASSESSMENT_KEYWORDS =
  /\b(assess\s+me|quiz\s+me|knowledge\s+(check|test|quiz)|test\s+my\s+(knowledge|understanding)|self.?assess|run\s+the\s+assessment|ai\s+assessment)\b/i;

const session = await joinSession({
  tools: [assessmentStartTool, saveReportTool],
  hooks: {
    onUserPromptSubmitted: async (input) => {
      if (ASSESSMENT_KEYWORDS.test(input.prompt)) {
        return {
          additionalContext:
            "The engineer wants to take the AI knowledge self-assessment. " +
            "Call the `ai_assessment_start` tool to get the assessment instructions, " +
            "then conduct the full assessment as instructed — including collecting the engineer's name " +
            "and calling `ai_assessment_save_report` at the end. " +
            "If the user mentioned a specific module number or topic, pass it as the `module` argument.",
        };
      }
    },
    onSessionStart: async () => {
      await session.log(
        "AI Assessment skill loaded — say 'assess me' or 'quiz me' to start. A sharable report will be saved when done."
      );
    },
  },
});
