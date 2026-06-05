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
            sectionLink: '/docs/phase-1/how-ai-works#how-text-generation-actually-works',
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
            sectionLink: '/docs/phase-1/how-ai-works#parameters-and-scale',
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
            sectionLink: '/docs/phase-1/using-ai-effectively#prompting-techniques',
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
            shortTitle: 'First-use trust and init',
            question: "You open your terminal, navigate to a project repo, and type `copilot`. Walk me through what happens the very first time — what prompts appear, why they appear, and what you should do.",
            topics: ['first-use experience', 'trust prompt', '/init', 'directory context'],
            sectionLink: '/docs/phase-2/copilot-cli-essentials#first-time-setup',
          },
          {
            id: '4-2',
            shortTitle: 'Context degradation and /compact',
            question: "Your Copilot session has been running for an hour across a large codebase. The model starts giving less relevant answers. What's likely happening and what are two things you can do about it?",
            topics: ['/compact', '/clear', 'context window management', 'session memory'],
            sectionLink: '/docs/phase-2/copilot-cli-essentials#slash-commands',
          },
          {
            id: '4-3',
            shortTitle: 'Three levels of memory',
            question: "What are the three levels of memory in Copilot CLI, and how do you use each one?",
            topics: ['session memory', 'persistent memory', 'copilot instructions', '/memory command'],
            sectionLink: '/docs/phase-2/copilot-cli-essentials#memory',
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
            sectionLink: '/docs/phase-2/copilot-in-vscode#the-three-modes',
          },
          {
            id: '5-2',
            shortTitle: 'Context variables',
            question: "What are context variables in VS Code Copilot Chat, and name three that are most useful in day-to-day development?",
            topics: ['context variables', '@workspace', '#file', '#selection'],
            sectionLink: '/docs/phase-2/copilot-in-vscode#context-variables',
          },
          {
            id: '5-3',
            shortTitle: 'CLI vs VS Code',
            question: "When should you use Copilot CLI vs the VS Code Copilot extension? What factors drive that choice?",
            topics: ['CLI vs VS Code', 'tool selection', 'workflow optimization'],
            sectionLink: '/docs/phase-2/copilot-in-vscode#cli-vs-vscode',
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
            shortTitle: 'copilot-instructions.md',
            question: "What is a copilot-instructions.md file, where does it live, and give two examples of things you'd put in it for a TypeScript/Java project?",
            topics: ['copilot-instructions.md', 'persistent instructions', 'team conventions'],
            sectionLink: '/docs/phase-2/skills-and-customization#copilot-instructions',
          },
          {
            id: '6-2',
            shortTitle: 'When to build a skill',
            question: "What is a Copilot CLI skill (extension), and when would you build one for your team?",
            topics: ['Copilot extensions', 'custom skills', 'tool registration', 'extension.mjs'],
            sectionLink: '/docs/phase-2/skills-and-customization#custom-skills',
          },
          {
            id: '6-3',
            shortTitle: 'User vs project extensions',
            question: "What's the difference between a user-level extension and a project-level extension in Copilot CLI? When would you use each?",
            topics: ['extension locations', 'project vs user scope', 'team sharing'],
            sectionLink: '/docs/phase-2/skills-and-customization#extension-locations',
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
            shortTitle: 'What is MCP?',
            question: "What is the Model Context Protocol (MCP), and how does it change what Copilot can do compared to a plain chat session?",
            topics: ['MCP protocol', 'tool integration', 'external data sources'],
            sectionLink: '/docs/phase-2/mcp-and-integrations#what-is-mcp',
          },
          {
            id: '7-2',
            shortTitle: 'Connecting an MCP server',
            question: "How do you connect an MCP server to Copilot CLI? Walk through the basic steps.",
            topics: ['MCP configuration', 'mcp.json', '/mcp command', 'server connection'],
            sectionLink: '/docs/phase-2/mcp-and-integrations#connecting-mcp',
          },
          {
            id: '7-3',
            shortTitle: 'Practical MCP integrations',
            question: "What are three practical MCP integrations that would immediately improve a software engineering team's workflow?",
            topics: ['GitHub MCP', 'database MCP', 'practical integrations', 'context switching reduction'],
            sectionLink: '/docs/phase-2/mcp-and-integrations#practical-integrations',
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
            shortTitle: 'Code review workflow',
            question: "Walk me through how you'd use Copilot CLI to help with a code review — from getting the diff to giving feedback.",
            topics: ['code review workflow', '!git diff', 'diff analysis', 'interactive session'],
            sectionLink: '/docs/phase-2/real-world-workflows#code-review',
          },
          {
            id: '8-2',
            shortTitle: 'Test generation and review',
            question: "You have a function with no tests. How would you use Copilot to generate a comprehensive test suite, and what would you verify before committing those tests?",
            topics: ['test generation', 'test quality', 'edge cases', 'test review'],
            sectionLink: '/docs/phase-2/real-world-workflows#test-generation',
          },
          {
            id: '8-3',
            shortTitle: 'Debugging workflow',
            question: "Describe a debugging workflow using Copilot CLI for a bug where you have an error message but don't immediately know the root cause.",
            topics: ['debugging workflow', 'error analysis', 'hypothesis-driven debugging', 'iterative diagnosis'],
            sectionLink: '/docs/phase-2/real-world-workflows#debugging',
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
            <code>copilot  →  assess me module 1</code>
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
