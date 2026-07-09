import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import questionBank from '@site/src/data/question-bank.json';
import styles from './index.module.css';

// Question data lives in docs/src/data/question-bank.json — shared by this page,
// the Assessments page, and the Claude assessment skill (see npm run build:skill).

const PHASES = questionBank.phases;

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
                {q.learningTopics.map(t => <span key={t} className={styles.topic}>{t}</span>)}
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
            These are the questions Claude asks in the self-assessments.
            Use this to preview what's assessed, review gaps, or prepare for a module.
          </p>
          <div className={styles.cliBox}>
            <span className={styles.cliLabel}>Run an assessment — say this to Claude</span>
            <code>Assess me on phase 1 module 1</code>
          </div>
          <p className={styles.heroNote}>
            Needs the assessment skill installed — <a href="/assessments#setup">one-time setup here</a>.
          </p>
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
