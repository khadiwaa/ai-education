import React from 'react';
import Layout from '@theme/Layout';
import AssessmentResults from '@site/src/components/AssessmentResults';
import styles from './assessments.module.css';

const MODULES = [
  {
    number: 1,
    phase: 1,
    title: 'How AI Actually Works',
    description: 'Token generation, training vs. inference, parameters and scale.',
    link: '/docs/phase-1/how-ai-works',
  },
  {
    number: 2,
    phase: 1,
    title: 'Using AI Effectively',
    description: 'Context windows, hallucination, prompting techniques.',
    link: '/docs/phase-1/using-ai-effectively',
  },
  {
    number: 3,
    phase: 1,
    title: 'AI in Your Engineering Workflow',
    description: 'Agents, prompt injection, human-in-the-loop.',
    link: '/docs/phase-1/ai-in-your-workflow',
  },
];

export default function AssessmentsPage() {
  return (
    <Layout
      title="Assessments"
      description="Your Phase 1 self-assessment results"
    >
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Self-Assessments</h1>
          <p>
            Run each module's assessment from your terminal using Copilot CLI, then
            come back here to review your results and identify areas to revisit.
          </p>
          <div className={styles.cliBox}>
            <span className={styles.cliLabel}>How to take an assessment</span>
            <code>copilot  →  assess me module 1</code>
          </div>
        </div>

        <div className={styles.grid}>
          {MODULES.map(mod => (
            <section key={mod.number} className={styles.moduleSection}>
              <div className={styles.moduleHeader}>
                <div className={styles.moduleTag}>Phase {mod.phase} · Module {mod.number}</div>
                <h2 className={styles.moduleTitle}>{mod.title}</h2>
                <p className={styles.moduleDesc}>{mod.description}</p>
                <a href={mod.link} className={styles.moduleLink}>Go to module →</a>
              </div>
              <AssessmentResults moduleNumber={mod.number} />
            </section>
          ))}
        </div>
      </main>
    </Layout>
  );
}
