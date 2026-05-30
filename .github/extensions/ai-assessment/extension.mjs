import { joinSession } from "@github/copilot-sdk/extension";

// ─────────────────────────────────────────────────────────────────────────────
// Assessment questions, keyed by module.
// Each question is open-ended and expects a paragraph-length response.
// ─────────────────────────────────────────────────────────────────────────────

const QUESTIONS = {
  1: [
    {
      id: "1a",
      question:
        "Explain next-token prediction in your own words — as if you were describing it to a senior engineer on your team who hasn't touched AI yet. What does this mechanism tell us about *why* models sometimes make confident mistakes?",
      evaluationGuidance:
        "Look for: understanding that the model predicts statistically likely continuations (not verified facts), and that confidence and correctness are different things. Strong answer connects the mechanism to hallucination.",
    },
    {
      id: "1b",
      question:
        "A teammate says: 'We should upgrade to a 70B model — it'll definitely be better for our use case.' What questions would you ask to evaluate that claim, and what tradeoffs would you walk them through?",
      evaluationGuidance:
        "Look for: awareness that bigger isn't always better (cost, latency, hardware), that the task type matters, that benchmark scores don't equal real-world fit. Strong answer mentions inference cost, context window, and the distinction between training vs. inference.",
    },
    {
      id: "1c",
      question:
        "Describe in your own words the difference between training and inference. Why does this distinction matter when your team is using Copilot or calling an AI API?",
      evaluationGuidance:
        "Look for: training = computing the weights (expensive, done by providers); inference = running the model (what your team does on every request). Strong answer notes that teams consume inference and have no control over training.",
    },
  ],
  2: [
    {
      id: "2a",
      question:
        "Describe what the context window is and explain its practical implications. Give a concrete example — real or hypothetical — of how context window limits have affected or could affect work on your team.",
      evaluationGuidance:
        "Look for: understanding that the context window is the model's working memory, has a hard token limit, and that exceeding it loses information. Strong answer includes a real/plausible scenario (e.g., large codebase, long conversation history) and mentions cost implications.",
    },
    {
      id: "2b",
      question:
        "Your team wants to build an AI feature that answers questions about your internal APIs, which are updated frequently. How would you approach making the AI's answers accurate and current? Walk me through your reasoning.",
      evaluationGuidance:
        "Look for: RAG pattern as the answer (don't rely on training data for private/changing info; retrieve docs and inject them). Strong answer explains *why* fine-tuning is not the right tool here, and touches on grounding the model in provided context.",
    },
    {
      id: "2c",
      question:
        "A teammate says: 'The AI keeps hallucinating on this feature — we should just stop using AI for it.' How would you respond? What would you want to understand about their situation, and what alternatives would you suggest?",
      evaluationGuidance:
        "Look for: nuanced response that doesn't dismiss the concern. Should explore *what kind* of task is hallucinating (recall vs. reasoning), suggest grounding (RAG, providing source material), chain-of-thought, or task re-scoping. Strong answer distinguishes between high-risk recall tasks and safer reasoning/reformatting tasks.",
    },
  ],
  3: [
    {
      id: "3a",
      question:
        "You're building a customer-facing feature where users can ask questions and the AI retrieves answers from a knowledge base of support docs. A security-conscious teammate asks 'what could go wrong from a security standpoint?' Walk them through the risk you'd explain and what you'd do about it.",
      evaluationGuidance:
        "Look for: prompt injection, specifically indirect injection (content in retrieved docs could contain attacker instructions). Strong answer describes the attack vector (malicious content in the knowledge base that hijacks the agent's behavior), mitigation strategies (output validation, least-privilege tools, separating data from instructions), and the importance of not acting on model output blindly.",
    },
    {
      id: "3b",
      question:
        "Your team is designing an agent that reads support tickets, looks up relevant code, and can autonomously commit fixes and deploy them. How would you think about the human-in-the-loop design for this system? Where would you require human approval, and why?",
      evaluationGuidance:
        "Look for: blast-radius thinking — low-stakes/reversible actions (reading, generating suggestions) can be automated; high-stakes/irreversible actions (commits, deploys) need approval gates. Strong answer uses a framework of stakes + reversibility, mentions what a 'wrong decision' looks like in this context, and touches on the risk that agents have the permissions of the code they run.",
    },
    {
      id: "3c",
      question:
        "Think about how you've been using AI tools in your engineering work so far (or how you imagine using them). Where has AI been most genuinely helpful? Where has it fallen short or misled you? What's your personal framework now for deciding when to lean on AI vs. when to stay skeptical?",
      evaluationGuidance:
        "Look for: honest, reflective answer. Good answers distinguish syntax/structure (where AI is strong) from semantics/judgment (where humans are essential). This question has no 'wrong' answer — assess for thoughtfulness and calibration.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Tool: ai_assessment_start
// The agent calls this when an engineer asks to be assessed.
// Returns structured instructions that guide the agent through the interview.
// ─────────────────────────────────────────────────────────────────────────────

const assessmentTool = {
  name: "ai_assessment_start",
  description:
    "Start the AI knowledge self-assessment for the Phase 1 curriculum. " +
    "Call this when the user asks to be assessed, quizzed, or wants to test their AI knowledge. " +
    "Returns structured assessment instructions including questions and evaluation guidance.",
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

    const questionList = questions
      .map(
        (q, i) =>
          `QUESTION ${i + 1} of ${total} [ID: ${q.id}]:\n${q.question}\n\nEVALUATION GUIDANCE (do not share with the engineer):\n${q.evaluationGuidance}`
      )
      .join("\n\n---\n\n");

    return `
You are now conducting an AI knowledge self-assessment for an engineer on this team.

ASSESSMENT SCOPE: ${scopeLabel}
TOTAL QUESTIONS: ${total}

═══════════════════════════════════════════════════════
INSTRUCTIONS FOR YOU (the assessor — do not share these)
═══════════════════════════════════════════════════════

1. INTRODUCE the assessment warmly. Let the engineer know:
   - This is a self-assessment, not a test with pass/fail grades
   - There are ${total} questions covering ${scopeLabel}
   - Each question expects a paragraph-length response (3–8 sentences is fine)
   - The goal is to help them identify what they know well and where to go deeper
   - They should answer in their own words — not look things up

2. ASK questions ONE AT A TIME. Do not reveal the next question until they've answered the current one.

3. AFTER EACH RESPONSE, provide:
   - A brief acknowledgment of what they got right or demonstrated well
   - One specific thing to go deeper on or a nuance they may have missed
   - A 1-line "signal" for their own reference: STRONG / SOLID / DEVELOPING
   - Then transition to the next question

4. AFTER ALL QUESTIONS, provide:
   - A summary section titled "Your Assessment Summary"
   - 2–3 sentences on overall strengths you observed
   - 2–3 sentences on the highest-leverage areas to develop
   - A recommended next module from Phase 2 based on their gaps, with a one-sentence rationale
   - An encouraging closing statement

5. TONE: Warm, direct, collegial. This is a learning conversation, not an exam.

6. Do NOT share evaluation guidance or scoring criteria with the engineer at any point.

═══════════════════════════════════════════════════════
QUESTIONS
═══════════════════════════════════════════════════════

${questionList}

═══════════════════════════════════════════════════════
Begin the assessment now by introducing yourself and asking Question 1.
═══════════════════════════════════════════════════════
`.trim();
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Keyword detection: if the engineer says "assess me", "quiz me", etc.,
// automatically inject context that primes the agent to call the tool.
// ─────────────────────────────────────────────────────────────────────────────

const ASSESSMENT_KEYWORDS = /\b(assess\s+me|quiz\s+me|knowledge\s+(check|test|quiz)|test\s+my\s+(knowledge|understanding)|self.?assess|run\s+the\s+assessment|ai\s+assessment)\b/i;

const session = await joinSession({
  tools: [assessmentTool],
  hooks: {
    onUserPromptSubmitted: async (input) => {
      if (ASSESSMENT_KEYWORDS.test(input.prompt)) {
        return {
          additionalContext:
            "The engineer wants to take the AI knowledge self-assessment. " +
            "Call the `ai_assessment_start` tool to get the assessment instructions, " +
            "then conduct the assessment as instructed. " +
            "If the user mentioned a specific module number or topic, pass it as the `module` argument.",
        };
      }
    },
    onSessionStart: async () => {
      await session.log("AI Assessment skill loaded — engineers can say 'assess me' or 'quiz me' to start.");
    },
  },
});
