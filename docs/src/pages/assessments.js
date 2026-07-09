import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import AssessmentResults from '@site/src/components/AssessmentResults';
import { importResults, clearResults } from '@site/src/lib/assessments';
import questionBank from '@site/src/data/question-bank.json';
import styles from './assessments.module.css';

// Flatten the shared question data into the module list this page renders.
const MODULES = questionBank.phases.flatMap((phase) =>
  phase.modules.map((mod) => ({
    number: mod.number,
    moduleInPhase: mod.moduleInPhase,
    phase: phase.phase,
    phaseLabel: phase.label,
    title: mod.title,
    description: mod.description,
    link: mod.docLink,
  }))
);

function ImportBox() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null); // { ok, message }

  const handleImport = () => {
    const { imported, errors } = importResults(text);
    if (imported.length > 0) {
      const list = imported.map((n) => `Module ${n}`).join(', ');
      setStatus({
        ok: true,
        message: `Imported results for ${list} ✓${errors.length ? ` (${errors.join(' ')})` : ''}`,
      });
      setText('');
    } else {
      setStatus({ ok: false, message: errors.join(' ') || 'Nothing to import.' });
    }
  };

  const handleClear = () => {
    clearResults();
    setStatus({ ok: true, message: 'All saved results cleared from this browser.' });
  };

  return (
    <div className={styles.importBox}>
      <textarea
        className={styles.importArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'Paste your results block from Claude here — it starts with {"kind": "ai-education-assessment", ...}'}
        rows={6}
      />
      <div className={styles.importActions}>
        <button className={styles.importButton} onClick={handleImport} disabled={!text.trim()}>
          Import results
        </button>
        <button className={styles.clearButton} onClick={handleClear}>
          Clear all results
        </button>
      </div>
      {status && (
        <p className={status.ok ? styles.statusOk : styles.statusError}>{status.message}</p>
      )}
    </div>
  );
}

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
            Each module has an interview-style self-assessment you take <strong>inside the
            Claude app</strong>. Claude asks a few open-ended questions, scores your answers,
            and gives you a personalized review plan — then you paste your results below to
            track your progress here.
          </p>
        </div>

        <section id="setup" className={styles.stepCard}>
          <h2>1 · One-time setup: install the assessment skill</h2>
          <ol className={styles.stepList}>
            <li>
              <a href="/downloads/ai-assessment-skill.zip" download>
                <strong>Download the assessment skill</strong>
              </a>{' '}
              (a small .zip file — don&apos;t unzip it).
            </li>
            <li>
              In the Claude app, open <strong>Settings → Capabilities → Skills</strong> and
              upload the zip.
            </li>
            <li>
              In any chat, say <code>Assess me on phase 1 module 1</code> — Claude takes it
              from there.
            </li>
          </ol>
          <p className={styles.stepNote}>
            Skills require a paid Claude plan — full walkthrough in{' '}
            <Link to="/docs/phase-2/connectors-and-skills#installing-a-skill">
              Phase 2 · Module 4
            </Link>. On a free plan? You can still self-assess: copy a question from
            the <Link to="/question-bank">Question Bank</Link> into any chat, answer it
            in your own words, and ask Claude to critique your answer.
          </p>
        </section>

        <section id="import" className={styles.stepCard}>
          <h2>2 · Import your results</h2>
          <p>
            At the end of each assessment, Claude gives you a results block (a snippet of
            text in curly braces). Copy the whole block and paste it here:
          </p>
          <ImportBox />
          <p className={styles.stepNote}>
            Results are saved in <strong>this browser only</strong> — nothing is uploaded
            anywhere. If you switch devices or clear your browser data, just re-paste your
            results blocks.
          </p>
        </section>

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
