import { joinSession } from "@github/copilot-sdk/extension";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCORE_SIGNAL = {
  1: "Developing",
  2: "Solid",
  3: "Strong",
};

const PHASES = {
  1: {
    number: 1,
    label: "Phase 1",
    selectionLabel: "full Phase 1",
    fullScope: "Full Phase 1 Assessment (all three modules)",
    moduleNumbers: [1, 2, 3],
    nextStepLabel: "one recommended Phase 2 module",
    nextStepDescription: "Recommend one Phase 2 module that best fits the engineer's current gaps.",
    nextRecommendations: [
      "Module 4 — Copilot CLI Essentials",
      "Module 5 — Copilot in VS Code",
      "Module 6 — Skills & Customization",
      "Module 7 — MCP & Integrations",
      "Module 8 — Real-World Workflows",
    ],
  },
  2: {
    number: 2,
    label: "Phase 2",
    selectionLabel: "full Phase 2",
    fullScope: "Full Phase 2 Assessment (all five modules)",
    moduleNumbers: [4, 5, 6, 7, 8],
    nextStepLabel: "one recommended Phase 3 deep dive",
    nextStepDescription: "Recommend one Phase 3 deep dive that best fits the engineer's current gaps or interests.",
    nextRecommendations: [
      "T1 — Transformer Architecture",
      "T2 — Advanced Prompt Engineering & Evaluation",
      "T3 — Embeddings, RAG & Retrieval Systems",
      "T4 — Agents & Multi-Agent Systems",
      "T5 — Fine-Tuning & Model Customization",
      "T6 — Open-Source & Local Models",
      "S1 — Platform Strategy & Vendor Evaluation",
      "S2 — Cost Modeling & Optimization",
      "S3 — AI Product Strategy",
      "S4 — Team AI Adoption & Education",
      "S5 — Staying Current in AI",
    ],
  },
};

const MODULES = {
  1: {
    number: 1,
    phase: 1,
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
      {
        id: "1-4",
        shortTitle: "The AI harness and agentic loop",
        question:
          "Describe what an AI harness does. When you type a message to Copilot CLI, what happens before and after the LLM is called?",
        evaluationGuidance: {
          strong:
            "Explains the harness as the orchestration layer that assembles context (memory, history, instructions, skills/extensions, MCP tools) before calling the LLM, and then handles tool calls, feeds results back, and loops until the task is done. Understands the LLM itself is stateless and passive — the harness creates the illusion of memory and agency.",
          solid:
            "Knows the harness does context assembly and tool execution but is fuzzy on the looping nature or doesn't distinguish LLM from harness clearly.",
          developing:
            "Treats the LLM as directly accessing files, memory, or the internet on its own without understanding the harness layer.",
        },
        learningTopics: ["AI harness", "agentic loop", "context assembly", "tool calls", "skills and extensions"],
        sectionLink: "/docs/phase-1/how-ai-works#what-happens-when-you-send-a-prompt",
        focusAreaTopic: "AI harness and agentic loop",
        focusAreaDetail:
          "Review how the harness assembles context from memory, instructions, and skills before calling the LLM, and how tool calls and the observe loop work during multi-step tasks.",
      },
    ],
  },
  2: {
    number: 2,
    phase: 1,
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
    phase: 1,
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
  4: {
    number: 4,
    phase: 2,
    name: "Copilot CLI Essentials",
    label: "Module 4 — Copilot CLI Essentials",
    questions: [
      {
        id: "4-1",
        shortTitle: "First session setup",
        question:
          "You open your terminal, navigate to a repo, and run `copilot` there for the first time. Walk me through what happens, why the trust and setup prompts matter, and what you should do next.",
        evaluationGuidance: {
          strong:
            "Explains that the working directory anchors Copilot's context, covers the trust prompt as a safety boundary for file/tool access, mentions session permissions, and describes using `/init` to seed repo instructions or defaults.",
          solid:
            "Knows there is a trust/setup flow and that the current directory matters, but is fuzzy on the security or configuration rationale.",
          developing:
            "Treats first-run prompts as something to click through without understanding what they control.",
        },
        learningTopics: ["first-use experience", "trust prompt", "/init", "working directory context"],
        sectionLink: "/docs/phase-2/copilot-cli-essentials#your-first-session-in-a-new-directory",
        focusAreaTopic: "First-run setup",
        focusAreaDetail:
          "Review how trust, session permissions, `/init`, and the repo root shape a new Copilot CLI session.",
      },
      {
        id: "4-2",
        shortTitle: "Context drift recovery",
        question:
          "Your Copilot CLI session has been running for a long time and the answers are getting less relevant. What's likely happening, and what are two slash-command-based ways to recover?",
        evaluationGuidance: {
          strong:
            "Explains context-window pressure or long-session drift, and recommends `/compact` to preserve compressed context plus `/clear` when a clean slate is better. May also mention `/context` to inspect usage or `/model` for task fit.",
          solid:
            "Knows `/compact` or `/clear` exist, but cannot clearly explain why session quality degraded or when to use each one.",
          developing:
            "Assumes the model is just broken or only suggests restarting the terminal without understanding session management.",
        },
        learningTopics: ["/compact", "/clear", "context window management", "session hygiene"],
        sectionLink: "/docs/phase-2/copilot-cli-essentials#slash-commands--the-complete-reference",
        focusAreaTopic: "Session hygiene",
        focusAreaDetail:
          "Review how `/compact`, `/clear`, and `/context` help you recover from long-session context drift.",
      },
      {
        id: "4-3",
        shortTitle: "Three context layers",
        question:
          "What are the three levels of context or memory in Copilot CLI, and when would you use each one?",
        evaluationGuidance: {
          strong:
            "Names persistent memory (`/memory`), repo-level custom instructions (`.github/copilot-instructions.md`), and session context, then explains the right use for each.",
          solid:
            "Recognizes there is session context versus something persistent, but cannot clearly name all three layers or describe when each fits best.",
          developing:
            "Treats memory as only the current conversation or confuses personal memory with repo instructions.",
        },
        learningTopics: ["persistent memory", "custom instructions", "session context", "/memory"],
        sectionLink: "/docs/phase-2/copilot-cli-essentials#memory-in-depth",
        focusAreaTopic: "Memory layers",
        focusAreaDetail:
          "Review the difference between persistent `/memory`, repo-level instructions, and task-specific session context.",
      },
    ],
  },
  5: {
    number: 5,
    phase: 2,
    name: "Copilot in VS Code",
    label: "Module 5 — Copilot in VS Code",
    questions: [
      {
        id: "5-1",
        shortTitle: "Three VS Code modes",
        question:
          "What's the difference between Copilot inline completions, Copilot Chat, and Copilot Edits in VS Code? Give a concrete example of when you'd use each.",
        evaluationGuidance: {
          strong:
            "Explains inline completions as in-editor continuation while typing, Chat as conversational Q&A or scoped generation, and Edits as reviewable multi-file patch generation, with concrete examples for each.",
          solid:
            "Knows the three surfaces exist, but is fuzzy on when to switch between Chat and Edits or lacks good examples.",
          developing:
            "Treats Copilot as only autocomplete or cannot distinguish the three workflows.",
        },
        learningTopics: ["inline completions", "Copilot Chat", "Copilot Edits", "mode selection"],
        sectionLink: "/docs/phase-2/copilot-in-vscode#inline-vs-chat-vs-edits",
        focusAreaTopic: "VS Code mode selection",
        focusAreaDetail:
          "Review the decision rule for choosing inline completions, Chat, or Edits based on task shape.",
      },
      {
        id: "5-2",
        shortTitle: "Chat context variables",
        question:
          "What are context variables in VS Code Copilot Chat, and name three you use to make prompts more relevant.",
        evaluationGuidance: {
          strong:
            "Explains that context variables ground prompts with repo, file, selection, terminal, or GitHub context, and names useful examples such as `@workspace`, `@file`, `#selection`, `#terminal`, or `@github`.",
          solid:
            "Knows one or two context variables, but is fuzzy on what they actually do or cannot name three strong day-to-day examples.",
          developing:
            "Does not know context variables exist or cannot explain why they improve prompt quality.",
        },
        learningTopics: ["context variables", "@workspace", "@file", "#selection", "#terminal"],
        sectionLink: "/docs/phase-2/copilot-in-vscode#context-variables-in-chat",
        focusAreaTopic: "Prompt grounding",
        focusAreaDetail:
          "Review how VS Code context variables reduce copy-paste and improve prompt grounding.",
      },
      {
        id: "5-3",
        shortTitle: "Edits review workflow",
        question:
          "You want Copilot to make a coordinated change across several files in VS Code. What does a strong Copilot Edits workflow look like, and what should you review in the diff before accepting it?",
        evaluationGuidance: {
          strong:
            "Describes tightly scoping the change, referencing the right files, asking for the smallest coherent patch, then reviewing the diff for scope creep, consistency, test coverage, and incomplete updates before accepting.",
          solid:
            "Understands Edits is for reviewable multi-file changes, but misses key review checks or how to scope the prompt well.",
          developing:
            "Treats Edits like blind code generation and does not emphasize reviewing the diff before acceptance.",
        },
        learningTopics: ["Copilot Edits", "multi-file changes", "diff review", "scoping prompts"],
        sectionLink: "/docs/phase-2/copilot-in-vscode#copilot-edits",
        focusAreaTopic: "Reviewing Edits output",
        focusAreaDetail:
          "Review how to scope Edits requests and inspect the resulting diff for consistency and unintended changes.",
      },
    ],
  },
  6: {
    number: 6,
    phase: 2,
    name: "Skills & Customization",
    label: "Module 6 — Skills & Customization",
    questions: [
      {
        id: "6-1",
        shortTitle: "Instructions file basics",
        question:
          "What is a `.github/copilot-instructions.md` file, where does it live, and what are two examples of guidance you'd put in it for a TypeScript or Java project?",
        evaluationGuidance: {
          strong:
            "Explains that it is repo-level Markdown guidance loaded into Copilot interactions, gives the correct path, and offers concrete examples such as test framework expectations, architecture boundaries, coding conventions, or validation commands.",
          solid:
            "Knows the file exists and roughly what it is for, but gives only vague examples or misses why it improves team consistency.",
          developing:
            "Has not heard of the file or cannot explain what belongs in it.",
        },
        learningTopics: ["copilot-instructions.md", "repo-level instructions", "team conventions"],
        sectionLink: "/docs/phase-2/skills-and-customization#custom-instructions-githubcopilot-instructionsmd",
        focusAreaTopic: "Repo instructions",
        focusAreaDetail:
          "Review what belongs in `.github/copilot-instructions.md` and how it improves consistency across the repo.",
      },
      {
        id: "6-2",
        shortTitle: "Repo-local skills",
        question:
          "What is a Copilot CLI skill or extension, why would a team package one inside `.github/extensions/`, and what kinds of workflows are good candidates?",
        evaluationGuidance: {
          strong:
            "Explains that skills/extensions package reusable Copilot behavior or tools, that repo-local extensions are versioned and shared with the repo, and names strong use cases like assessments, onboarding, release checklists, or internal lookups.",
          solid:
            "Knows skills add custom behavior, but is fuzzy on why repo-local packaging matters or cannot name good workflow candidates.",
          developing:
            "Confuses skills with slash commands or cannot explain why a team would build one.",
        },
        learningTopics: ["Copilot extensions", ".github/extensions", "repo-local workflows", "custom skills"],
        sectionLink: "/docs/phase-2/skills-and-customization#the-githubextensions-directory",
        focusAreaTopic: "Repo-local extensions",
        focusAreaDetail:
          "Review why teams keep shared skills under `.github/extensions/` and which repeated workflows are worth packaging there.",
      },
      {
        id: "6-3",
        shortTitle: "Context quality setup",
        question:
          "Without writing any extension code, what can you do in the workspace or repo to help Copilot get better context and produce stronger suggestions?",
        evaluationGuidance: {
          strong:
            "Names practical moves like opening the right related files, keeping clear naming conventions, maintaining READMEs/comments, surfacing canonical examples, and organizing the repo around stable patterns.",
          solid:
            "Understands that repo quality affects Copilot, but gives only one or two generic ideas without much operational detail.",
          developing:
            "Assumes Copilot quality is independent of repo structure or documentation quality.",
        },
        learningTopics: ["workspace configuration", "context quality", "open files", "canonical patterns"],
        sectionLink: "/docs/phase-2/skills-and-customization#workspace-configuration-helping-copilot-get-good-context",
        focusAreaTopic: "Workspace context quality",
        focusAreaDetail:
          "Review how open files, naming, documentation, and stable repo structure improve Copilot's local context.",
      },
    ],
  },
  7: {
    number: 7,
    phase: 2,
    name: "MCP & Integrations",
    label: "Module 7 — MCP & Integrations",
    questions: [
      {
        id: "7-1",
        shortTitle: "MCP in practice",
        question:
          "What is the Model Context Protocol (MCP), and how does it change what Copilot can do compared to a plain chat session?",
        evaluationGuidance: {
          strong:
            "Explains MCP as a standard protocol for exposing external tools and data to AI clients, notes the client/server model, and describes how it lets Copilot read issues, search docs, query systems, or use other tools beyond local chat context.",
          solid:
            "Knows MCP connects tools to the model, but is fuzzy on the protocol idea or on how it changes real workflows.",
          developing:
            "Treats MCP as a Copilot-only buzzword or cannot explain how it expands capability.",
        },
        learningTopics: ["MCP protocol", "tool integration", "external context"],
        sectionLink: "/docs/phase-2/mcp-and-integrations#mcp-revisited-now-in-practical-terms",
        focusAreaTopic: "MCP fundamentals",
        focusAreaDetail:
          "Review how MCP exposes external tools and data sources to Copilot through a standard protocol.",
      },
      {
        id: "7-2",
        shortTitle: "Connect an MCP server",
        question:
          "How do you connect an MCP server to Copilot CLI? Walk through the basic setup and verification steps.",
        evaluationGuidance: {
          strong:
            "Mentions using `/mcp add` or editing `~/.copilot/mcp-config.json`, choosing local vs HTTP server details, configuring command/args or URL plus env/headers/tools, and verifying with `/mcp show`.",
          solid:
            "Knows there is a config flow and maybe a command, but cannot describe the file path, setup fields, or how to verify the server is available.",
          developing:
            "Has not set one up and cannot describe where configuration lives or how to inspect connected servers.",
        },
        learningTopics: ["/mcp add", "mcp-config.json", "/mcp show", "server configuration"],
        sectionLink: "/docs/phase-2/mcp-and-integrations#how-to-configure-mcp-in-copilot-cli",
        focusAreaTopic: "MCP setup flow",
        focusAreaDetail:
          "Review the `/mcp add` flow, the `~/.copilot/mcp-config.json` file, and how to verify configured servers with `/mcp show`.",
      },
      {
        id: "7-3",
        shortTitle: "Safe first integrations",
        question:
          "If you were rolling out MCP to a software engineering team, what three integrations would you start with first, and what security principles would guide that rollout?",
        evaluationGuidance: {
          strong:
            "Names practical integrations like GitHub, web/fetch, filesystem, database, or ticketing tools, explains the workflow value of each, and includes security principles such as trust, read-heavy first, least privilege, and reviewing tool scope.",
          solid:
            "Can name a few useful integrations, but is weak on why they matter or how to think about permissions and rollout safety.",
          developing:
            "Offers generic examples without clear workflow benefits or ignores the security implications of connecting real tools.",
        },
        learningTopics: ["GitHub MCP", "practical integrations", "least privilege", "read-heavy rollout"],
        sectionLink: "/docs/phase-2/mcp-and-integrations#popular-mcp-servers",
        focusAreaTopic: "MCP rollout strategy",
        focusAreaDetail:
          "Review which MCP integrations deliver immediate engineering value and why least privilege matters when you add them.",
      },
    ],
  },
  8: {
    number: 8,
    phase: 2,
    name: "Real-World Workflows",
    label: "Module 8 — Real-World Workflows",
    questions: [
      {
        id: "8-1",
        shortTitle: "Diff review workflow",
        question:
          "Walk me through how you'd use Copilot CLI to help with a code review — from getting the diff to producing useful feedback.",
        evaluationGuidance: {
          strong:
            "Uses the interactive `!git diff` pattern to feed the diff into the session, asks Copilot for behavior/risk summaries, probes edge cases or weak error handling, and uses Copilot to draft clean review comments after forming a human judgment.",
          solid:
            "Knows Copilot can help summarize diffs or draft comments, but misses the interactive command pattern or the best review questions to ask.",
          developing:
            "Does code review separately and cannot describe a concrete Copilot-assisted review workflow.",
        },
        learningTopics: ["code review workflow", "!git diff", "risk-focused review", "review comments"],
        sectionLink: "/docs/phase-2/real-world-workflows#code-review-workflow",
        focusAreaTopic: "Copilot-assisted code review",
        focusAreaDetail:
          "Review the interactive `!git diff` pattern and the kinds of risk-oriented questions that make Copilot useful in review.",
      },
      {
        id: "8-2",
        shortTitle: "Generate useful tests",
        question:
          "You have a function with no tests. How would you use Copilot to generate a strong test suite, and what would you verify before committing those tests?",
        evaluationGuidance: {
          strong:
            "Explains giving Copilot the real function or selection, specifying the framework explicitly, naming important edge cases, then reviewing the generated tests for correctness, missing boundaries, and whether they actually exercise real behavior rather than tautologies.",
          solid:
            "Uses Copilot to generate tests and may mention edge cases, but does not emphasize framework choice or careful review of what the tests truly prove.",
          developing:
            "Accepts generated tests at face value without specifying constraints or checking whether they would catch real bugs.",
        },
        learningTopics: ["test generation", "edge cases", "framework specification", "test review"],
        sectionLink: "/docs/phase-2/real-world-workflows#test-generation-workflow",
        focusAreaTopic: "Test generation quality",
        focusAreaDetail:
          "Review how to specify the framework, enumerate important edge cases, and critically review AI-generated tests before committing them.",
      },
      {
        id: "8-3",
        shortTitle: "Hypothesis-driven debugging",
        question:
          "Describe a debugging workflow using Copilot when you have an error message but don't yet know the root cause.",
        evaluationGuidance: {
          strong:
            "Starts with the exact error, stack trace or terminal output, expected vs actual behavior, and what was already tried; asks Copilot for prioritized hypotheses and next files to inspect; then validates with logs, debugger steps, or tests and knows when to stop after a few non-converging rounds.",
          solid:
            "Pastes errors into Copilot and asks for fixes, but lacks a clear hypothesis-driven loop or does not distinguish AI help from runtime validation.",
          developing:
            "Uses Copilot only after finding the bug manually or expects a single pasted error to produce a reliable root cause.",
        },
        learningTopics: ["debugging workflow", "#terminal", "hypothesis-driven debugging", "validation loop"],
        sectionLink: "/docs/phase-2/real-world-workflows#debugging-workflow",
        focusAreaTopic: "Debugging with evidence",
        focusAreaDetail:
          "Review the information-complete debugging prompt and the habit of validating Copilot's hypotheses with logs, tests, or a debugger.",
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

function getPhase(phaseNumber) {
  return PHASES[phaseNumber];
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

function buildRecommendationInstruction(phaseNumber) {
  const phase = getPhase(phaseNumber);
  return `${phase.nextStepDescription}

Choose from this list:
${phase.nextRecommendations.map((item) => `  • ${item}`).join("\n")}`;
}

function buildModuleInstructions(moduleNumber) {
  const module = getModule(moduleNumber);
  const phase = getPhase(module.phase);
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
  • Recommend ${phase.nextStepLabel}
  • Tell them: "I'm saving your Module ${module.number} results now — you'll have a report file and a JSON summary."

${buildRecommendationInstruction(module.phase)}

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
  recommended_module: "<recommended next step from the list above>"
  recommended_module_rationale: "<one sentence on why that recommendation fits>"

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
The engineer wants to take the AI self-assessment, but they did not specify a module or phase.

Ask one clarifying question before starting:
"Which assessment would you like: Module 1 (How AI Actually Works), Module 2 (Using AI Effectively), Module 3 (AI in Your Engineering Workflow), Module 4 (Copilot CLI Essentials), Module 5 (Copilot in VS Code), Module 6 (Skills & Customization), Module 7 (MCP & Integrations), Module 8 (Real-World Workflows), full Phase 1, or full Phase 2?"

Wait for their answer. Once they choose, call ai_assessment_start again with one of:
  • { "module": "1" }
  • { "module": "2" }
  • { "module": "3" }
  • { "module": "4" }
  • { "module": "5" }
  • { "module": "6" }
  • { "module": "7" }
  • { "module": "8" }
  • { "module": "phase-1" }
  • { "module": "phase-2" }

You may also use { "module": "all" } as a legacy alias for the full Phase 1 assessment.

Do not ask assessment questions until after you call the tool again with their choice.
`.trim();
}

function buildPhaseAssessmentInstructions(phaseNumber) {
  const phase = getPhase(phaseNumber);
  const questionList = buildQuestionCatalog(phase.moduleNumbers);
  const totalQuestions = phase.moduleNumbers.length * 3;
  const maxScore = totalQuestions * 3;
  const moduleLabels = phase.moduleNumbers.map((moduleNumber) => getModule(moduleNumber).label).join(", then ");

  return `
You are now conducting the ${phase.fullScope}.

ASSESSMENT SCOPE: ${phase.fullScope}
TOTAL QUESTIONS: ${totalQuestions}
MAX SCORE: ${maxScore}
MODULE ORDER: ${moduleLabels}

═══════════════════════════════════════════════════════
INSTRUCTIONS FOR YOU (the assessor — do not share these with the engineer)
═══════════════════════════════════════════════════════

STEP 1 — COLLECT NAME ONCE
If you do not already know the engineer's name from this conversation, ask for it before starting. Reuse the same name for every saved report.

STEP 2 — INTRODUCE THE FLOW
Tell the engineer:
  • This is a self-assessment, not a pass/fail test
  • There are ${totalQuestions} questions total, grouped into ${phase.moduleNumbers.length} modules of 3 questions each
  • Answers should be paragraph-length (roughly 3–8 sentences)
  • After each module, you'll share scores and save a module report plus JSON summary
  • At the end, you'll also save a combined ${phase.label} markdown report

STEP 3 — RUN MODULES SEQUENTIALLY
For each module in order:
  • Ask that module's 3 questions one at a time
  • After each answer, give brief feedback but do NOT reveal the numeric score yet
  • After the module's third answer, reveal the three scores with brief feedback, summarize module strengths and development areas, recommend ${phase.nextStepLabel}, and call ai_assessment_save_report with that module number
  • After the save call, tell the engineer the saved markdown and JSON paths
  • Then move to the next module

${buildRecommendationInstruction(phaseNumber)}

STEP 4 — SAVE MODULE REPORTS AFTER EACH MODULE
After each module, call ai_assessment_save_report with:
  engineer_name: the engineer's name
  scope: "Module N — <module name>"
  module: one of ${phase.moduleNumbers.map((moduleNumber) => `"${moduleNumber}"`).join(" | ")}
  questions_json: JSON string array of that module's 3 scored questions only
  overall_strengths: module-specific strengths
  development_areas: module-specific development areas
  recommended_module: one recommended next step from the list above
  recommended_module_rationale: one-sentence rationale

STEP 5 — AFTER THE FINAL MODULE, SAVE THE COMBINED FULL REPORT
After all ${totalQuestions} questions are complete:
  • Give a brief overall ${phase.label} wrap-up across all ${phase.moduleNumbers.length} modules
  • Call ai_assessment_save_report one more time with:
      scope: "${phase.fullScope}"
      questions_json: all ${totalQuestions} scored questions in order
      overall_strengths: full-assessment strengths
      development_areas: full-assessment development areas
      recommended_module: the single best next step overall from the list above
      recommended_module_rationale: one sentence on why
  • Do NOT include a module field on this final combined save call
  • Tell the engineer the combined markdown file path from the tool output

IMPORTANT:
  • Keep module reports scoped to that module's 3 questions only
  • Keep the final full report scoped to all ${totalQuestions} questions
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
    "Start the AI knowledge self-assessment for the Phase 1 and Phase 2 curriculum. Use module 1-8, phase-1, phase-2, or all. " +
    "If no module is provided, first ask the engineer which assessment they want.",
  parameters: {
    type: "object",
    properties: {
      module: {
        type: "string",
        enum: ["1", "2", "3", "4", "5", "6", "7", "8", "phase-1", "phase-2", "all"],
        description:
          "Optional assessment scope: module '1' through '8', 'phase-1', 'phase-2', or legacy alias 'all' for the full Phase 1 assessment.",
      },
    },
    required: [],
  },
  handler: async (args) => {
    const scope = args?.module;

    if (!scope) {
      return buildModuleSelectionInstructions();
    }

    if (scope === "all" || scope === "phase-1") {
      return buildPhaseAssessmentInstructions(1);
    }

    if (scope === "phase-2") {
      return buildPhaseAssessmentInstructions(2);
    }

    const moduleNumber = Number.parseInt(scope, 10);
    const module = getModule(moduleNumber);

    if (!module) {
      return "Unknown assessment. Use module 1-8, phase-1, phase-2, or all.";
    }

    return buildModuleInstructions(moduleNumber);
  },
};

const saveReportTool = {
  name: "ai_assessment_save_report",
  description:
    "Save a completed AI knowledge assessment report. For module assessments, this writes both the markdown report " +
    "and docs/static/assessments/module-N-latest.json for modules 1-8. For combined phase assessments, it writes the markdown report.",
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
        enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
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
        description: "Name of the recommended Phase 2 module or Phase 3 deep dive.",
      },
      recommended_module_rationale: {
        type: "string",
        description: "One sentence explaining why this next step fits.",
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
          phase: module.phase,
          moduleName: module.name,
          name: args.engineer_name,
          date: dateStr,
          score: totalScore,
          maxScore,
          percentage,
          level,
          strengths: normalizeWhitespace(args.overall_strengths),
          recommendedNextStep: args.recommended_module,
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
  /\b(assess\s+me|quiz\s+me|knowledge\s+(?:check|test|quiz)|test\s+my\s+(?:knowledge|understanding)|self.?assess|run\s+the\s+assessment|module\s*[1-8]\s+assessment|phase\s*[12]\s+assessment|ai\s+assessment)\b/i;

function detectRequestedScope(prompt) {
  const normalized = prompt.toLowerCase();

  // "phase 2 module 1" style — must check BEFORE bare "phase 2" / "phase 1"
  const phaseModuleMatch = normalized.match(/phase\s*([12])\s+module\s*([1-5])/);
  if (phaseModuleMatch) {
    const phase = Number.parseInt(phaseModuleMatch[1], 10);
    const modInPhase = Number.parseInt(phaseModuleMatch[2], 10);
    // Phase 1: modules 1-3, Phase 2: modules 4-8
    const globalModule = phase === 1 ? modInPhase : modInPhase + 3;
    if (globalModule >= 1 && globalModule <= 8) return String(globalModule);
  }

  if (
    normalized.includes("full phase 2") ||
    normalized.includes("entire phase 2") ||
    normalized.includes("all five modules") ||
    normalized.includes("phase 2")
  ) {
    return "phase-2";
  }

  if (
    normalized.includes("full phase 1") ||
    normalized.includes("entire phase 1") ||
    normalized.includes("all three modules") ||
    normalized.includes("phase 1")
  ) {
    return "phase-1";
  }

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
  if (/\bmodule\s*4\b/.test(normalized) || normalized.includes("copilot cli essentials")) {
    return "4";
  }
  if (
    /\bmodule\s*5\b/.test(normalized) ||
    normalized.includes("copilot in vs code") ||
    normalized.includes("copilot in vscode")
  ) {
    return "5";
  }
  if (
    /\bmodule\s*6\b/.test(normalized) ||
    normalized.includes("skills & customization") ||
    normalized.includes("skills and customization")
  ) {
    return "6";
  }
  if (
    /\bmodule\s*7\b/.test(normalized) ||
    normalized.includes("mcp & integrations") ||
    normalized.includes("mcp and integrations")
  ) {
    return "7";
  }
  if (
    /\bmodule\s*8\b/.test(normalized) ||
    normalized.includes("real-world workflows") ||
    normalized.includes("real world workflows")
  ) {
    return "8";
  }
  if (/\ball\b/.test(normalized)) {
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

      if (scope === "all" || scope === "phase-1") {
        return {
          additionalContext:
            "The engineer wants the full Phase 1 AI self-assessment. Call `ai_assessment_start` with `{ \"module\": \"phase-1\" }` (or legacy alias `{ \"module\": \"all\" }`), " +
            "run Modules 1, 2, and 3 sequentially, save the per-module markdown + JSON reports after each module, and save the combined full markdown report at the end.",
        };
      }

      if (scope === "phase-2") {
        return {
          additionalContext:
            "The engineer wants the full Phase 2 AI self-assessment. Call `ai_assessment_start` with `{ \"module\": \"phase-2\" }`, " +
            "run Modules 4, 5, 6, 7, and 8 sequentially, save the per-module markdown + JSON reports after each module, and save the combined full markdown report at the end.",
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
          "The engineer wants to take the AI self-assessment but did not specify a module or phase. " +
          "Call `ai_assessment_start` with no arguments, ask them to choose Module 1-8, full Phase 1, or full Phase 2, then call the tool again with their choice.",
      };
    },
    onSessionStart: async () => {
      await session.log(
        "AI Assessment skill loaded — say 'assess me', 'quiz me', or specify module 1-8, full Phase 1, or full Phase 2 to start."
      );
    },
  },
});
