import React from 'react';
import Layout from '@theme/Layout';
import AssessmentResults from '@site/src/components/AssessmentResults';
import styles from './assessments.module.css';

const MODULES = [
  {
    number: 1, moduleInPhase: 1,
    phase: 1, phaseLabel: 'Phase 1 — AI Essentials',
    title: 'How AI Actually Works',
    description: 'Token generation, training vs. inference, parameters and scale.',
    link: '/docs/phase-1/how-ai-works',
  },
  {
    number: 2, moduleInPhase: 2,
    phase: 1, phaseLabel: 'Phase 1 — AI Essentials',
    title: 'Using AI Effectively',
    description: 'Context windows, hallucination, prompting techniques.',
    link: '/docs/phase-1/using-ai-effectively',
  },
  {
    number: 3, moduleInPhase: 3,
    phase: 1, phaseLabel: 'Phase 1 — AI Essentials',
    title: 'AI in Your Engineering Workflow',
    description: 'Agents, prompt injection, human-in-the-loop.',
    link: '/docs/phase-1/ai-in-your-workflow',
  },
  {
    number: 4, moduleInPhase: 1,
    phase: 2, phaseLabel: 'Phase 2 — Copilot in Practice',
    title: 'Copilot CLI Essentials',
    description: 'Interactive sessions, slash commands, memory management.',
    link: '/docs/phase-2/copilot-cli-essentials',
  },
  {
    number: 5, moduleInPhase: 2,
    phase: 2, phaseLabel: 'Phase 2 — Copilot in Practice',
    title: 'Copilot in VS Code',
    description: 'Inline completions, Chat, Edits, context variables.',
    link: '/docs/phase-2/copilot-in-vscode',
  },
  {
    number: 6, moduleInPhase: 3,
    phase: 2, phaseLabel: 'Phase 2 — Copilot in Practice',
    title: 'Skills & Customization',
    description: 'Instructions files, custom skills, extension locations.',
    link: '/docs/phase-2/skills-and-customization',
  },
  {
    number: 7, moduleInPhase: 4,
    phase: 2, phaseLabel: 'Phase 2 — Copilot in Practice',
    title: 'MCP & Integrations',
    description: 'Model Context Protocol, connecting tools and services.',
    link: '/docs/phase-2/mcp-and-integrations',
  },
  {
    number: 8, moduleInPhase: 5,
    phase: 2, phaseLabel: 'Phase 2 — Copilot in Practice',
    title: 'Real-World Workflows',
    description: 'Code review, test generation, debugging workflows.',
    link: '/docs/phase-2/real-world-workflows',
  },
];

export default function AssessmentsPage() {
  return (
    <Layout
      title="Assessments"
      description="Your Phase 1 and Phase 2 self-assessment results"
    >
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Self-Assessments</h1>
          <p>
            Run each module&apos;s assessment from your terminal using Copilot CLI, then
            come back here to review your results and identify areas to revisit.
          </p>
          <div className={styles.cliBox}>
            <span className={styles.cliLabel}>How to take an assessment</span>
            <code>copilot  →  assess me phase 1 module 1</code>
          </div>
        </div>

        <div className={styles.grid}>
          {MODULES.map((mod, index) => {
            const showPhaseDivider = index === 0 || MODULES[index - 1].phase !== mod.phase;

            return (
              <React.Fragment key={mod.number}>
                {showPhaseDivider && (
                  <div className={styles.phaseDivider}>
                    <h2 className={styles.phaseTitle}>{mod.phaseLabel}</h2>
                  </div>
                )}
                <section className={styles.moduleSection}>
                  <div className={styles.moduleHeader}>
                  <div className={styles.moduleTag}>Phase {mod.phase} · Module {mod.moduleInPhase}</div>
                    <h3 className={styles.moduleTitle}>{mod.title}</h3>
                     <p className={styles.moduleDesc}>{mod.description}</p>
                    <a href={mod.link} className={styles.moduleLink}>Go to module →</a>
                  </div>
                  <AssessmentResults moduleNumber={mod.number} phase={mod.phase} moduleInPhase={mod.moduleInPhase} />
                </section>
              </React.Fragment>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
