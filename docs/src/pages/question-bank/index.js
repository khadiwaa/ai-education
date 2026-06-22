import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

// ─── Question data ───────────────────────────────────────────────────────────
// Source of truth is extension.mjs — this page is the human-readable view.

const PHASES = [
  {
    phase: 1,
    label: 'Phase 1 — AI Essentials',
    modules: [
      {
        number: 1,
        title: 'How AI Actually Works',
        docLink: '/docs/phase-1/how-ai-works',
        questions: [
          {
            id: '1-1',
            shortTitle: 'Token generation',
            question: "Walk me through what happens when you type a message and an LLM responds — from your input to the output token by token.",
            topics: ['tokenization', 'autoregressive generation', 'temperature and sampling'],
            sectionLink: '/docs/phase-1/how-ai-works#the-core-idea-next-token-prediction',
          },
          {
            id: '1-2',
            shortTitle: 'Training vs inference',
            question: "What's the difference between training and inference? Why does it matter for how we use AI tools day-to-day?",
            topics: ['training vs inference', 'knowledge cutoff', 'frozen weights'],
            sectionLink: '/docs/phase-1/how-ai-works#training-vs-inference',
          },
          {
            id: '1-3',
            shortTitle: 'Parameters and scale',
            question: "What is a parameter (weight) in an LLM? What does 'a 70B model' mean, and why does parameter count matter?",
            topics: ['model parameters', 'model scale', 'compute requirements'],
            sectionLink: '/docs/phase-1/how-ai-works#parameters-what-a-70b-model-means',
          },
          {
            id: '1-4',
            shortTitle: 'The AI harness and agentic loop',
            question: "Describe what an AI harness does. When you type a message to Copilot CLI, what happens before and after the LLM is called?",
            topics: ['AI harness', 'agentic loop', 'context assembly', 'tool calls', 'skills and extensions'],
            sectionLink: '/docs/phase-1/how-ai-works#what-happens-when-you-send-a-prompt',
          },
        ],
      },
      {
        number: 2,
        title: 'Using AI Effectively',
        docLink: '/docs/phase-1/using-ai-effectively',
        questions: [
          {
            id: '2-1',
            shortTitle: 'Context window',
            question: "What is a context window, and what are two practical ways it affects how you use AI tools?",
            topics: ['context window', 'lost in the middle', 'context management'],
            sectionLink: '/docs/phase-1/using-ai-effectively#the-context-window',
          },
          {
            id: '2-2',
            shortTitle: 'Hallucination and grounding',
            question: "What is hallucination, and what's the most reliable technique for reducing it when you need factually accurate output?",
            topics: ['hallucination', 'RAG', 'grounding', 'source-grounded generation'],
            sectionLink: '/docs/phase-1/using-ai-effectively#hallucination',
          },
          {
            id: '2-3',
            shortTitle: 'Prompting techniques',
            question: "Explain the difference between zero-shot, few-shot, and chain-of-thought prompting. When would you use each?",
            topics: ['prompting techniques', 'few-shot prompting', 'chain of thought'],
            sectionLink: '/docs/phase-1/using-ai-effectively#prompt-engineering-techniques',
          },
        ],
      },
      {
        number: 3,
        title: 'AI in Your Engineering Workflow',
        docLink: '/docs/phase-1/ai-in-your-workflow',
        questions: [
          {
            id: '3-1',
            shortTitle: 'What is an agent?',
            question: "What is an agent, and what makes it different from a single prompt-response interaction?",
            topics: ['agent loop', 'tool use', 'ReAct pattern'],
            sectionLink: '/docs/phase-1/ai-in-your-workflow#what-is-an-agent',
          },
          {
            id: '3-2',
            shortTitle: 'Prompt injection',
            question: "What is prompt injection, and give an example of an indirect injection attack in a real engineering context.",
            topics: ['prompt injection', 'indirect injection', 'AI security', 'RAG security'],
            sectionLink: '/docs/phase-1/ai-in-your-workflow#prompt-injection-mandatory-security-knowledge',
          },
          {
            id: '3-3',
            shortTitle: 'Blast radius and approval',
            question: "When should an AI agent always require human approval before taking an action? Use the 'blast radius' framing.",
            topics: ['human-in-the-loop', 'blast radius', 'agent safety'],
            sectionLink: '/docs/phase-1/ai-in-your-workflow#human-in-the-loop',
          },
        ],
      },
    ],
  },
  {
    phase: 2,
    label: 'Phase 2 — Copilot in Practice',
    modules: [
      {
        number: 4,
        title: 'Copilot CLI Essentials',
        docLink: '/docs/phase-2/copilot-cli-essentials',
        questions: [
          {
            id: '4-1',
            shortTitle: 'First session setup',
            question: "You open your terminal, navigate to a repo, and run `copilot` there for the first time. Walk me through what happens, why the trust and setup prompts matter, and what you should do next.",
            topics: ['first-use experience', 'trust prompt', '/init', 'working directory context'],
            sectionLink: '/docs/phase-2/copilot-cli-essentials#your-first-session-in-a-new-directory',
          },
          {
            id: '4-2',
            shortTitle: 'Context drift recovery',
            question: "Your Copilot CLI session has been running for a long time and the answers are getting less relevant. What's likely happening, and what are two slash-command-based ways to recover?",
            topics: ['/compact', '/clear', 'context window management', 'session hygiene'],
            sectionLink: '/docs/phase-2/copilot-cli-essentials#slash-commands--the-complete-reference',
          },
          {
            id: '4-3',
            shortTitle: 'Three context layers',
            question: "What are the three levels of context or memory in Copilot CLI, and when would you use each one?",
            topics: ['persistent memory', 'custom instructions', 'session context', '/memory'],
            sectionLink: '/docs/phase-2/copilot-cli-essentials#memory-in-depth',
          },
        ],
      },
      {
        number: 5,
        title: 'Copilot in VS Code',
        docLink: '/docs/phase-2/copilot-in-vscode',
        questions: [
          {
            id: '5-1',
            shortTitle: 'Three VS Code modes',
            question: "What's the difference between Copilot inline completions, Copilot Chat, and Copilot Edits in VS Code? Give a concrete example of when you'd use each.",
            topics: ['inline completions', 'Copilot Chat', 'Copilot Edits', 'mode selection'],
            sectionLink: '/docs/phase-2/copilot-in-vscode#inline-vs-chat-vs-edits',
          },
          {
            id: '5-2',
            shortTitle: 'Chat context variables',
            question: "What are context variables in VS Code Copilot Chat, and name three you use to make prompts more relevant.",
            topics: ['context variables', '@workspace', '#file', '#selection', '#terminal'],
            sectionLink: '/docs/phase-2/copilot-in-vscode#context-variables-in-chat',
          },
          {
            id: '5-3',
            shortTitle: 'Edits review workflow',
            question: "You want Copilot to make a coordinated change across several files in VS Code. What does a strong Copilot Edits workflow look like, and what should you review in the diff before accepting it?",
            topics: ['Copilot Edits', 'multi-file changes', 'diff review', 'scoping prompts'],
            sectionLink: '/docs/phase-2/copilot-in-vscode#copilot-edits',
          },
        ],
      },
      {
        number: 6,
        title: 'Skills & Customization',
        docLink: '/docs/phase-2/skills-and-customization',
        questions: [
          {
            id: '6-1',
            shortTitle: 'Instructions file basics',
            question: "What is a `.github/copilot-instructions.md` file, where does it live, and what are two examples of guidance you'd put in it for a TypeScript or Java project?",
            topics: ['copilot-instructions.md', 'repo-level instructions', 'team conventions'],
            sectionLink: '/docs/phase-2/skills-and-customization#custom-instructions-githubcopilot-instructionsmd',
          },
          {
            id: '6-2',
            shortTitle: 'Repo-local skills',
            question: "What is a Copilot CLI skill or extension, why would a team package one inside `.github/extensions/`, and what kinds of workflows are good candidates?",
            topics: ['Copilot extensions', '.github/extensions', 'repo-local workflows', 'custom skills'],
            sectionLink: '/docs/phase-2/skills-and-customization#the-githubextensions-directory',
          },
          {
            id: '6-3',
            shortTitle: 'Context quality setup',
            question: "Without writing any extension code, what can you do in the workspace or repo to help Copilot get better context and produce stronger suggestions?",
            topics: ['workspace configuration', 'context quality', 'open files', 'canonical patterns'],
            sectionLink: '/docs/phase-2/skills-and-customization#workspace-configuration-helping-copilot-get-good-context',
          },
        ],
      },
      {
        number: 7,
        title: 'MCP & Integrations',
        docLink: '/docs/phase-2/mcp-and-integrations',
        questions: [
          {
            id: '7-1',
            shortTitle: 'MCP in practice',
            question: "What is the Model Context Protocol (MCP), and how does it change what Copilot can do compared to a plain chat session?",
            topics: ['MCP protocol', 'tool integration', 'external context'],
            sectionLink: '/docs/phase-2/mcp-and-integrations#mcp-revisited-now-in-practical-terms',
          },
          {
            id: '7-2',
            shortTitle: 'Connect an MCP server',
            question: "How do you connect an MCP server to Copilot CLI? Walk through the basic setup and verification steps.",
            topics: ['/mcp add', 'mcp-config.json', '/mcp show', 'server configuration'],
            sectionLink: '/docs/phase-2/mcp-and-integrations#how-to-configure-mcp-in-copilot-cli',
          },
          {
            id: '7-3',
            shortTitle: 'Safe first integrations',
            question: "If you were rolling out MCP to a software engineering team, what three integrations would you start with first, and what security principles would guide that rollout?",
            topics: ['GitHub MCP', 'practical integrations', 'least privilege', 'read-heavy rollout'],
            sectionLink: '/docs/phase-2/mcp-and-integrations#popular-mcp-servers',
          },
        ],
      },
      {
        number: 8,
        title: 'Real-World Workflows',
        docLink: '/docs/phase-2/real-world-workflows',
        questions: [
          {
            id: '8-1',
            shortTitle: 'Diff review workflow',
            question: "Walk me through how you'd use Copilot CLI to help with a code review — from getting the diff to producing useful feedback.",
            topics: ['code review workflow', '!git diff', 'risk-focused review', 'review comments'],
            sectionLink: '/docs/phase-2/real-world-workflows#code-review-workflow',
          },
          {
            id: '8-2',
            shortTitle: 'Generate useful tests',
            question: "You have a function with no tests. How would you use Copilot to generate a strong test suite, and what would you verify before committing those tests?",
            topics: ['test generation', 'edge cases', 'framework specification', 'test review'],
            sectionLink: '/docs/phase-2/real-world-workflows#test-generation-workflow',
          },
          {
            id: '8-3',
            shortTitle: 'Hypothesis-driven debugging',
            question: "Describe a debugging workflow using Copilot when you have an error message but don't yet know the root cause.",
            topics: ['debugging workflow', '#terminal', 'hypothesis-driven debugging', 'validation loop'],
            sectionLink: '/docs/phase-2/real-world-workflows#debugging-workflow',
          },
        ],
      },
    ],
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function QuestionCard({ q, moduleNumber, expanded, onToggle }) {
  return (
    <div className={styles.qCard}>
      <button className={styles.qHeader} onClick={() => onToggle(q.id)}>
        <span className={styles.qId}>{q.id}</span>
        <span className={styles.qTitle}>{q.shortTitle}</span>
        <span className={styles.qChevron}>{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className={styles.qBody}>
          <p className={styles.qText}><strong>Question:</strong> {q.question}</p>
          <div className={styles.qMeta}>
            <div>
              <span className={styles.metaLabel}>Topics covered</span>
              <div className={styles.topics}>
                {q.topics.map(t => <span key={t} className={styles.topic}>{t}</span>)}
              </div>
            </div>
            <div>
              <span className={styles.metaLabel}>Related section</span>
              <Link to={q.sectionLink} className={styles.sectionLink}>
                Go to module section →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleBlock({ mod }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const expandAll = () => {
    const all = {};
    mod.questions.forEach(q => all[q.id] = true);
    setExpanded(all);
  };
  const collapseAll = () => setExpanded({});
  const anyOpen = mod.questions.some(q => expanded[q.id]);

  return (
    <div className={styles.moduleBlock}>
      <div className={styles.moduleHeader}>
        <div>
          <span className={styles.moduleTag}>Module {mod.number}</span>
          <h3 className={styles.moduleTitle}>
            <Link to={mod.docLink}>{mod.title}</Link>
          </h3>
        </div>
        <div className={styles.moduleActions}>
          <span className={styles.qCount}>{mod.questions.length} questions</span>
          <button className={styles.toggleBtn} onClick={anyOpen ? collapseAll : expandAll}>
            {anyOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      </div>
      {mod.questions.map(q => (
        <QuestionCard
          key={q.id}
          q={q}
          moduleNumber={mod.number}
          expanded={!!expanded[q.id]}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function QuestionBankPage() {
  const totalQ = PHASES.flatMap(p => p.modules).flatMap(m => m.questions).length;
  const totalMod = PHASES.flatMap(p => p.modules).length;

  return (
    <Layout title="Assessment Question Bank" description="All self-assessment questions by phase and module">
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Assessment Question Bank</h1>
          <p>
            {totalQ} questions across {totalMod} modules — organized by phase.
            These are the questions used in the Copilot CLI self-assessments.
            Use this to preview what's assessed, review gaps, or prepare for a module.
          </p>
          <div className={styles.cliBox}>
            <span className={styles.cliLabel}>Run an assessment</span>
            <code>copilot  →  assess me phase 1 module 1</code>
          </div>
        </div>

        {PHASES.map(phase => (
          <section key={phase.phase} className={styles.phaseSection}>
            <h2 className={styles.phaseTitle}>{phase.label}</h2>
            {phase.modules.map(mod => (
              <ModuleBlock key={mod.number} mod={mod} />
            ))}
          </section>
        ))}
      </main>
    </Layout>
  );
}
