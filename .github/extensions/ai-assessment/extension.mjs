import { joinSession } from "@github/copilot-sdk/extension";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCORE_SIGNAL = {
  1: "Developing",
  2: "Solid",
  3: "Strong",
};

const MODULES = {
  1: {
    number: 1,
    name: "How AI Actually Works",
    label: "Module 1 — How AI Actually Works",
    questions: [
      {
        id: "1-1",
        shortTitle: "Token generation",
        question:
          "Walk me through what happens when you type a message and an LLM responds — from your input to the output token by token.",
        evaluationGuidance: {
          strong:
            "Covers tokenization, the forward pass, probability distribution over next tokens, sampling / temperature, and autoregressive token-by-token generation.",
          solid:
            "Explains token-by-token generation and that the output is probabilistic, but misses important detail.",
          developing:
            "Stays vague or treats the model like it retrieves stored answers.",
        },
        learningTopics: ["tokenization", "autoregressive generation", "temperature and sampling"],
        sectionLink: "/docs/phase-1/how-ai-works#how-text-generation-actually-works",
        focusAreaTopic: "Token generation mechanics",
        focusAreaDetail:
          "Review how tokenization, next-token probabilities, and sampling work together during generation.",
      },
      {
        id: "1-2",
        shortTitle: "Training vs inference",
        question:
          "What's the difference between training and inference? Why does it matter for how we use AI tools day-to-day?",
        evaluationGuidance: {
          strong:
            "Explains training as expensive gradient updates on massive data, inference as a forward pass with frozen weights, and connects that to knowledge cutoffs and models not learning from normal chats.",
          solid:
            "Gets the basic distinction but is fuzzy on the practical implications.",
          developing:
            "Suggests the model keeps learning from conversations or confuses the two phases.",
        },
        learningTopics: ["training vs inference", "knowledge cutoff", "frozen weights"],
        sectionLink: "/docs/phase-1/how-ai-works#training-vs-inference",
        focusAreaTopic: "Training vs inference",
        focusAreaDetail:
          "Review why deployed models use frozen weights and what that means for knowledge cutoffs and daily tool use.",
      },
      {
        id: "1-3",
        shortTitle: "Parameters and scale",
        question:
          "What is a parameter (weight) in an LLM? What does 'a 70B model' mean, and why does parameter count matter?",
        evaluationGuidance: {
          strong:
            "Explains parameters as learned numerical values adjusted during training, 70B as 70 billion parameters, and the capability / compute / memory tradeoffs of scale.",
          solid:
            "Understands the scale and that parameters encode learned patterns, but is fuzzy on mechanics or tradeoffs.",
          developing:
            "Treats parameters as configuration settings or cannot explain them.",
        },
        learningTopics: ["model parameters", "model scale", "compute requirements"],
        sectionLink: "/docs/phase-1/how-ai-works#parameters-and-scale",
        focusAreaTopic: "Model parameters and scale",
        focusAreaDetail:
          "Review what parameters encode and why scale affects both capability and compute requirements.",
      },
    ],
  },
  2: {
    number: 2,
    name: "Using AI Effectively",
    label: "Module 2 — Using AI Effectively",
    questions: [
      {
        id: "2-1",
        shortTitle: "Context window",
        question:
          "What is a context window, and what are two practical ways it affects how you use AI tools?",
        evaluationGuidance: {
          strong:
            "Explains the context window as the model's fixed-size working memory and names practical effects such as hidden content outside the window, 'lost in the middle', rising cost, or using /compact.",
          solid:
            "Knows it limits the prompt or working memory, but gives only one practical implication or misses nuance.",
          developing:
            "Gives a vague definition and no useful practical implications.",
        },
        learningTopics: ["context window", "lost in the middle", "context management"],
        sectionLink: "/docs/phase-1/using-ai-effectively#the-context-window",
        focusAreaTopic: "Context management",
        focusAreaDetail:
          "Review the context window limit, the lost-in-the-middle problem, and how to manage long conversations or large codebases.",
      },
      {
        id: "2-2",
        shortTitle: "Hallucination and grounding",
        question:
          "What is hallucination, and what's the most reliable technique for reducing it when you need factually accurate output?",
        evaluationGuidance: {
          strong:
            "Defines hallucination as plausible but false generation and identifies grounding / RAG as the most reliable mitigation, with verification or citations as supporting practices.",
          solid:
            "Knows what hallucination is and mentions grounding, but is fuzzy on why it works.",
          developing:
            "Treats hallucination like a simple bug or assumes a better model alone solves it.",
        },
        learningTopics: ["hallucination", "RAG", "grounding", "source-grounded generation"],
        sectionLink: "/docs/phase-1/using-ai-effectively#hallucination",
        focusAreaTopic: "Grounding and hallucination mitigation",
        focusAreaDetail:
          "Review why source-grounded generation reduces hallucination more reliably than relying on model recall alone.",
      },
      {
        id: "2-3",
        shortTitle: "Prompting techniques",
        question:
          "Explain the difference between zero-shot, few-shot, and chain-of-thought prompting. When would you use each?",
        evaluationGuidance: {
          strong:
            "Correctly defines zero-shot, few-shot, and chain-of-thought prompting and matches each one to appropriate use cases.",
          solid:
            "Knows the definitions but is fuzzy on when to use each technique.",
          developing:
            "Misses one of the techniques, especially chain-of-thought, or cannot explain when to use them.",
        },
        learningTopics: ["prompting techniques", "few-shot prompting", "chain of thought"],
        sectionLink: "/docs/phase-1/using-ai-effectively#prompting-techniques",
        focusAreaTopic: "Prompting strategy",
        focusAreaDetail:
          "Review when to use zero-shot, few-shot, and step-by-step reasoning patterns for different task types.",
      },
    ],
  },
  3: {
    number: 3,
    name: "AI in Your Engineering Workflow",
    label: "Module 3 — AI in Your Engineering Workflow",
    questions: [
      {
        id: "3-1",
        shortTitle: "What is an agent?",
        question:
          "What is an agent, and what makes it different from a single prompt-response interaction?",
        evaluationGuidance: {
          strong:
            "Describes an agent as model + tools + loop, explains that it can act, observe, and iterate, and distinguishes that from a single prompt-response round trip. Mentions the ReAct pattern.",
          solid:
            "Understands the multi-step nature but is fuzzy on tools or the observation loop.",
          developing:
            "Treats an agent as just a smarter chatbot.",
        },
        learningTopics: ["agent loop", "tool use", "ReAct pattern"],
        sectionLink: "/docs/phase-1/ai-in-your-workflow#what-is-an-agent",
        focusAreaTopic: "Agent loop",
        focusAreaDetail:
          "Review how agents combine model reasoning, tool calls, observations, and iteration to complete tasks.",
      },
      {
        id: "3-2",
        shortTitle: "Prompt injection",
        question:
          "What is prompt injection, and give an example of an indirect injection attack in a real engineering context.",
        evaluationGuidance: {
          strong:
            "Explains prompt injection as attacker-crafted instructions that try to override the model, distinguishes indirect injection via retrieved or uploaded content, and gives a realistic engineering example.",
          solid:
            "Understands direct injection but is fuzzy on indirect injection, or lacks a concrete example.",
          developing:
            "Confuses prompt injection with other attacks such as SQL injection or cannot explain it.",
        },
        learningTopics: ["prompt injection", "indirect injection", "AI security", "RAG security"],
        sectionLink: "/docs/phase-1/ai-in-your-workflow#prompt-injection-mandatory-security-knowledge",
        focusAreaTopic: "Prompt injection security",
        focusAreaDetail:
          "Review how indirect prompt injection can arrive through retrieved documents, tickets, files, or other untrusted content.",
      },
      {
        id: "3-3",
        shortTitle: "Blast radius and approval",
        question:
          "When should an AI agent always require human approval before taking an action? Use the 'blast radius' framing.",
        evaluationGuidance: {
          strong:
            "Uses blast radius and reversibility to explain why high-stakes or irreversible actions always need approval, while low-stakes reversible actions can be automated.",
          solid:
            "Gets the principle but misses good examples or the reversibility dimension.",
          developing:
            "Argues for fully autonomous or fully supervised agents without a risk-based framework.",
        },
        learningTopics: ["human-in-the-loop", "blast radius", "agent safety"],
        sectionLink: "/docs/phase-1/ai-in-your-workflow#human-in-the-loop",
        focusAreaTopic: "Human-in-the-loop design",
        focusAreaDetail:
          "Review how blast radius and reversibility determine where agents need approval checkpoints.",
      },
    ],
  },
};

function slugify(value) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "engineer";
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function getModule(moduleNumber) {
  return MODULES[moduleNumber];
}

function getQuestionById(id) {
  return Object.values(MODULES)
    .flatMap((module) => module.questions)
    .find((question) => question.id === id);
}

function buildQuestionCatalog(moduleNumbers) {
  return moduleNumbers
    .map((moduleNumber) => {
      const module = getModule(moduleNumber);
      const questionsText = module.questions
        .map(
          (question, index) => `QUESTION ${index + 1} of ${module.questions.length} [ID: ${question.id}] — ${question.shortTitle}
QUESTION TEXT: ${question.question}

EVALUATION GUIDANCE (do not share with the engineer):
- Strong (3): ${question.evaluationGuidance.strong}
- Solid (2): ${question.evaluationGuidance.solid}
- Developing (1): ${question.evaluationGuidance.developing}

LEARNING TOPICS (include in the report if score < 3):
${question.learningTopics.map((topic) => `  • ${topic}`).join("\n")}

SECTION LINK FOR FOLLOW-UP:
  • ${question.sectionLink}`
        )
        .join("\n\n---\n\n");

      return `${module.label}
${questionsText}`;
    })
    .join("\n\n═══════════════════════════════════════════════════════\n\n");
}

function buildModuleInstructions(moduleNumber) {
  const module = getModule(moduleNumber);
  const questionList = buildQuestionCatalog([moduleNumber]);

  return `
You are now conducting the ${module.label} self-assessment for an engineer on this team.

ASSESSMENT SCOPE: ${module.label}
TOTAL QUESTIONS: 3
MAX SCORE: 9

═══════════════════════════════════════════════════════
INSTRUCTIONS FOR YOU (the assessor — do not share these with the engineer)
═══════════════════════════════════════════════════════

STEP 1 — COLLECT NAME
If you do not already know the engineer's name from this conversation, ask: "Before we begin, what's your name?" Wait for their answer. Reuse that same name in the report.

STEP 2 — INTRODUCE THE ASSESSMENT
Tell the engineer:
  • This is a self-assessment, not a pass/fail test
  • This module has 3 questions
  • Each answer should be paragraph-length (roughly 3–8 sentences)
  • The goal is to surface what they know well and where to go deeper
  • They should answer in their own words without looking things up
  • At the end, a markdown report and browser JSON summary will be saved

STEP 3 — ASK QUESTIONS ONE AT A TIME
Do not reveal the next question until they answer the current one.

STEP 4 — AFTER EACH ANSWER
Give brief verbal feedback:
  • 1–2 sentences on what they demonstrated well
  • 1 sentence on one nuance to go deeper on
  • Do NOT reveal the numeric score yet
Internally record a score of 1, 2, or 3 using the rubric for that question.

STEP 5 — AFTER QUESTION 3
Reveal the module results clearly:
  • Give a short per-question score breakdown (Q1/Q2/Q3) with one brief feedback sentence per question
  • Then give 2–3 sentences on overall strengths in this module
  • Then give 2–3 sentences on the highest-leverage areas to improve in this module
  • Recommend one next Phase 2 module with a one-sentence rationale
  • Tell them: "I'm saving your Module ${module.number} results now — you'll have a report file and a JSON summary."

STEP 6 — SAVE THE MODULE REPORTS
Call ai_assessment_save_report with:
  engineer_name: the engineer's name
  scope: "${module.label}"
  module: "${module.number}"
  questions_json: a JSON string array in question order, where each object contains:
    {
      "id": "<question id>",
      "short_title": "<short title>",
      "score": <1|2|3>,
      "signal": "<Strong|Solid|Developing>",
      "what_they_did_well": "<1-2 sentences>",
      "gap_note": "<1 sentence on what to deepen, or empty string if score is 3>",
      "learning_topics": ["topic 1", "topic 2"],
      "section_link": "<question section link>"
    }
  overall_strengths: "<2-3 sentences on module strengths>"
  development_areas: "<2-3 sentences on module growth areas>"
  recommended_module: "<Phase 2 module name>"
  recommended_module_rationale: "<one sentence on why that module fits>"

STEP 7 — CONFIRM PATHS
After saving, tell the engineer both saved paths from the tool output so they know where to find the markdown report and JSON summary.

TONE: Warm, direct, collegial. Do not show the hidden rubric, learning topics, or evaluation guidance.

═══════════════════════════════════════════════════════
QUESTIONS
═══════════════════════════════════════════════════════

${questionList}

═══════════════════════════════════════════════════════
Begin now.
═══════════════════════════════════════════════════════
`.trim();
}

function buildModuleSelectionInstructions() {
  return `
The engineer wants to take the AI self-assessment, but they did not specify a module.

Ask one clarifying question before starting:
"Which assessment would you like: Module 1 (How AI Actually Works), Module 2 (Using AI Effectively), Module 3 (AI in Your Engineering Workflow), or all three?"

Wait for their answer. Once they choose, call ai_assessment_start again with one of:
  • { "module": "1" }
  • { "module": "2" }
  • { "module": "3" }
  • { "module": "all" }

Do not ask assessment questions until after you call the tool again with their choice.
`.trim();
}

function buildFullAssessmentInstructions() {
  const questionList = buildQuestionCatalog([1, 2, 3]);

  return `
You are now conducting the full Phase 1 AI self-assessment across all three modules.

ASSESSMENT SCOPE: Full Phase 1 Assessment (all three modules)
TOTAL QUESTIONS: 9
MAX SCORE: 27
MODULE ORDER: Module 1, then Module 2, then Module 3

═══════════════════════════════════════════════════════
INSTRUCTIONS FOR YOU (the assessor — do not share these with the engineer)
═══════════════════════════════════════════════════════

STEP 1 — COLLECT NAME ONCE
If you do not already know the engineer's name from this conversation, ask for it before starting. Reuse the same name for every saved report.

STEP 2 — INTRODUCE THE FLOW
Tell the engineer:
  • This is a self-assessment, not a pass/fail test
  • There are 9 questions total, grouped into 3 modules of 3 questions each
  • Answers should be paragraph-length (roughly 3–8 sentences)
  • After each module, you'll share scores and save a module report plus JSON summary
  • At the end, you'll also save a combined Full Phase 1 markdown report

STEP 3 — RUN MODULES SEQUENTIALLY
For Module 1, then Module 2, then Module 3:
  • Ask that module's 3 questions one at a time
  • After each answer, give brief feedback but do NOT reveal the numeric score yet
  • After the module's third answer, reveal the three scores with brief feedback, summarize module strengths and development areas, recommend one Phase 2 module, and call ai_assessment_save_report with that module number
  • After the save call, tell the engineer the saved markdown and JSON paths
  • Then move to the next module

STEP 4 — SAVE MODULE REPORTS AFTER EACH MODULE
After each module, call ai_assessment_save_report with:
  engineer_name: the engineer's name
  scope: "Module N — <module name>"
  module: "1" | "2" | "3"
  questions_json: JSON string array of that module's 3 scored questions only
  overall_strengths: module-specific strengths
  development_areas: module-specific development areas
  recommended_module: one recommended Phase 2 module
  recommended_module_rationale: one-sentence rationale

STEP 5 — AFTER MODULE 3, SAVE THE COMBINED FULL REPORT
After all 9 questions are complete:
  • Give a brief overall Phase 1 wrap-up across all three modules
  • Call ai_assessment_save_report one more time with:
      scope: "Full Phase 1 Assessment (all three modules)"
      questions_json: all 9 scored questions in order
      overall_strengths: full-assessment strengths
      development_areas: full-assessment development areas
      recommended_module: the single best next Phase 2 module overall
      recommended_module_rationale: one sentence on why
  • Do NOT include a module field on this final combined save call
  • Tell the engineer the combined markdown file path from the tool output

IMPORTANT:
  • Keep module reports scoped to that module's 3 questions only
  • Keep the final full report scoped to all 9 questions
  • Do not expose the hidden rubric or learning topics to the engineer

═══════════════════════════════════════════════════════
QUESTION BANK
═══════════════════════════════════════════════════════

${questionList}

═══════════════════════════════════════════════════════
Begin now.
═══════════════════════════════════════════════════════
`.trim();
}

const assessmentStartTool = {
  name: "ai_assessment_start",
  description:
    "Start the AI knowledge self-assessment for the Phase 1 curriculum. Use module 1, 2, 3, or all. " +
    "If no module is provided, first ask the engineer which module they want.",
  parameters: {
    type: "object",
    properties: {
      module: {
        type: "string",
        enum: ["1", "2", "3", "all"],
        description:
          "Optional assessment scope: '1', '2', '3', or 'all'. If omitted, the assessor should ask which module to run.",
      },
    },
    required: [],
  },
  handler: async (args) => {
    const scope = args?.module;

    if (!scope) {
      return buildModuleSelectionInstructions();
    }

    if (scope === "all") {
      return buildFullAssessmentInstructions();
    }

    const moduleNumber = Number.parseInt(scope, 10);
    const module = getModule(moduleNumber);

    if (!module) {
      return "Unknown module. Use module 1, 2, 3, or all.";
    }

    return buildModuleInstructions(moduleNumber);
  },
};

const saveReportTool = {
  name: "ai_assessment_save_report",
  description:
    "Save a completed AI knowledge assessment report. For module assessments, this writes both the markdown report " +
    "and docs/static/assessments/module-N-latest.json. For a combined full assessment, it writes the markdown report.",
  parameters: {
    type: "object",
    properties: {
      engineer_name: {
        type: "string",
        description: "Full name of the engineer being assessed.",
      },
      scope: {
        type: "string",
        description: "Assessment scope label.",
      },
      module: {
        type: "string",
        enum: ["1", "2", "3"],
        description:
          "Optional module number. When provided, the tool also writes docs/static/assessments/module-N-latest.json.",
      },
      questions_json: {
        type: "string",
        description:
          "JSON string array of scored questions. Each item should include id, short_title, score, signal, what_they_did_well, gap_note, and learning_topics.",
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
      return {
        textResultForLlm: "Failed to parse questions_json — invalid JSON.",
        resultType: "failure",
      };
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const totalScore = results.reduce((sum, question) => sum + Number(question.score ?? 0), 0);
    const maxScore = results.length * 3;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const level = percentage >= 80 ? "Strong" : percentage >= 55 ? "Solid" : "Developing";

    const detailedResults = results.map((result, index) => {
      const metadata = getQuestionById(result.id) ?? {};
      const score = Number(result.score ?? 0);
      return {
        ...result,
        index,
        score,
        signal: result.signal ?? SCORE_SIGNAL[score] ?? "",
        short_title: result.short_title ?? metadata.shortTitle ?? result.id,
        learning_topics: Array.isArray(result.learning_topics) ? result.learning_topics : metadata.learningTopics ?? [],
        section_link: result.section_link ?? metadata.sectionLink ?? "",
        focus_area_topic: metadata.focusAreaTopic ?? metadata.shortTitle ?? result.id,
        focus_area_detail:
          normalizeWhitespace(result.gap_note) || metadata.focusAreaDetail || "Review this concept in the module notes.",
      };
    });

    const uniqueLearningTopics = [...new Set(
      detailedResults
        .filter((question) => question.score < 3)
        .flatMap((question) => question.learning_topics)
        .filter(Boolean)
    )];

    const scoreRows = detailedResults
      .map(
        (question, index) =>
          `| ${index + 1} | ${question.short_title} | ${question.score}/3 | ${question.signal} |`
      )
      .join("\n");

    const questionDetails = detailedResults
      .map((question, index) => {
        const lines = [
          `### Q${index + 1}: ${question.short_title}`,
          `**Score:** ${question.score}/3 — ${question.signal}`,
          "",
          `**What you demonstrated:** ${question.what_they_did_well ?? ""}`,
        ];

        if (normalizeWhitespace(question.gap_note)) {
          lines.push("", `**To go deeper:** ${normalizeWhitespace(question.gap_note)}`);
        }

        if (question.learning_topics.length > 0) {
          lines.push("", "**Recommended reading:**");
          question.learning_topics.forEach((topic) => lines.push(`- ${topic}`));
        }

        if (question.section_link) {
          lines.push("", `**Section link:** ${question.section_link}`);
        }

        return lines.join("\n");
      })
      .join("\n\n---\n\n");

    const learningSection =
      uniqueLearningTopics.length > 0
        ? uniqueLearningTopics.map((topic) => `- ${topic}`).join("\n")
        : "_No significant gaps identified — strong performance across all questions._";

    const markdown = `# AI Knowledge Assessment Report

| | |
|---|---|
| **Engineer** | ${args.engineer_name} |
| **Date** | ${dateStr} at ${timeStr} |
| **Assessment scope** | ${args.scope} |
| **Overall score** | ${totalScore}/${maxScore} (${percentage}%) — **${level}** |

---

## Score Summary

| # | Question | Score | Signal |
|---|----------|-------|--------|
${scoreRows}

**Total: ${totalScore}/${maxScore} (${percentage}%) — ${level}**

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

    const cwd = process.cwd();
    const assessmentsDir = join(cwd, "assessments");
    const safeName = slugify(args.engineer_name);
    const markdownFilename = args.module
      ? `${safeName}-module-${args.module}-assessment-${dateStr}.md`
      : `${safeName}-ai-assessment-${dateStr}.md`;
    const markdownPath = join(assessmentsDir, markdownFilename);

    try {
      mkdirSync(assessmentsDir, { recursive: true });
      writeFileSync(markdownPath, markdown, "utf-8");

      let jsonPath;
      if (args.module) {
        const module = getModule(Number.parseInt(args.module, 10));
        const jsonDir = join(cwd, "docs", "static", "assessments");
        mkdirSync(jsonDir, { recursive: true });
        jsonPath = join(jsonDir, `module-${args.module}-latest.json`);

        const focusAreas = detailedResults
          .filter((question) => question.score < 3)
          .map((question) => ({
            topic: question.focus_area_topic,
            detail: question.focus_area_detail,
            sectionLink: question.section_link,
          }));

        const jsonPayload = {
          module: module.number,
          moduleName: module.name,
          name: args.engineer_name,
          date: dateStr,
          score: totalScore,
          maxScore,
          percentage,
          level,
          strengths: normalizeWhitespace(args.overall_strengths),
          focusAreas,
          questions: detailedResults.map((question) => ({
            id: question.id,
            shortTitle: question.short_title,
            score: question.score,
          })),
        };

        writeFileSync(jsonPath, `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf-8");
      }

      const pathLines = [`Markdown: assessments/${markdownFilename}`];
      if (jsonPath) {
        pathLines.push(`JSON: docs/static/assessments/module-${args.module}-latest.json`);
      }

      return {
        textResultForLlm:
          `Report saved successfully.\n` +
          `${pathLines.join("\n")}\n` +
          `Score: ${totalScore}/${maxScore} (${percentage}%) — ${level}\n` +
          `Engineer: ${args.engineer_name}`,
        resultType: "success",
      };
    } catch (error) {
      return {
        textResultForLlm: `Failed to write report: ${error.message}`,
        resultType: "failure",
      };
    }
  },
};

const ASSESSMENT_KEYWORDS =
  /\b(assess\s+me(?:\s+(?:module\s*[123]|all))?|quiz\s+me(?:\s+(?:module\s*[123]|all))?|module\s*[123]\s+assessment|knowledge\s+(check|test|quiz)|test\s+my\s+(knowledge|understanding)|self.?assess|run\s+the\s+assessment|phase\s*1\s+assessment|ai\s+assessment)\b/i;

function detectRequestedScope(prompt) {
  const normalized = prompt.toLowerCase();

  if (/\bmodule\s*1\b/.test(normalized) || normalized.includes("how ai actually works")) {
    return "1";
  }
  if (/\bmodule\s*2\b/.test(normalized) || normalized.includes("using ai effectively")) {
    return "2";
  }
  if (
    /\bmodule\s*3\b/.test(normalized) ||
    normalized.includes("ai in your engineering workflow") ||
    normalized.includes("ai in your workflow")
  ) {
    return "3";
  }
  if (
    /\ball\b/.test(normalized) ||
    normalized.includes("full phase 1") ||
    normalized.includes("all three modules") ||
    normalized.includes("entire phase 1")
  ) {
    return "all";
  }
  return null;
}

const session = await joinSession({
  tools: [assessmentStartTool, saveReportTool],
  hooks: {
    onUserPromptSubmitted: async (input) => {
      if (!ASSESSMENT_KEYWORDS.test(input.prompt)) {
        return;
      }

      const scope = detectRequestedScope(input.prompt);

      if (scope === "all") {
        return {
          additionalContext:
            "The engineer wants the full Phase 1 AI self-assessment. Call `ai_assessment_start` with `{ \"module\": \"all\" }`, " +
            "run Modules 1, 2, and 3 sequentially, save the per-module markdown + JSON reports after each module, and save the combined full markdown report at the end.",
        };
      }

      if (scope) {
        return {
          additionalContext:
            `The engineer wants ${getModule(Number.parseInt(scope, 10)).label}. ` +
            `Call \`ai_assessment_start\` with \`{ \"module\": \"${scope}\" }\` and follow the returned instructions exactly.`,
        };
      }

      return {
        additionalContext:
          "The engineer wants to take the AI self-assessment but did not specify a module. " +
          "Call `ai_assessment_start` with no arguments, ask them to choose Module 1, 2, 3, or all, then call the tool again with their choice.",
      };
    },
    onSessionStart: async () => {
      await session.log(
        "AI Assessment skill loaded — say 'assess me', 'quiz me', or specify module 1, 2, 3, or all to start."
      );
    },
  },
});
