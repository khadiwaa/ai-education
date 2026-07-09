import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { getModuleResult, subscribe } from '@site/src/lib/assessments';
import styles from './styles.module.css';

const LEVELS = {
  Strong:     { color: '#2e7d32', bg: 'rgba(46,125,50,0.1)'  },
  Solid:      { color: '#1565c0', bg: 'rgba(21,101,192,0.1)' },
  Developing: { color: '#e65100', bg: 'rgba(230,81,0,0.1)'   },
};

function ScorePip({ score, max = 3 }) {
  return (
    <span className={styles.pips}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < score ? styles.pipFilled : styles.pipEmpty} />
      ))}
    </span>
  );
}

export default function AssessmentResults({ moduleNumber, phase, moduleInPhase }) {
  // Display label: "Phase X · Module Y" if phase info provided, else "Module N"
  const displayLabel = (phase && moduleInPhase)
    ? `Phase ${phase} · Module ${moduleInPhase}`
    : `Module ${moduleNumber}`;

  // What the learner says to Claude to run this assessment
  const claudePrompt = (phase && moduleInPhase)
    ? `Assess me on phase ${phase} module ${moduleInPhase}`
    : `Assess me on module ${moduleNumber}`;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage is only available in the browser, so read inside the effect
    const refresh = () => setData(getModuleResult(moduleNumber));
    refresh();
    setLoading(false);
    return subscribe(refresh);
  }, [moduleNumber]);

  if (loading) return null;

  if (!data) {
    return (
      <div className={styles.prompt}>
        <span className={styles.promptIcon}>📋</span>
        <div>
          <strong>Check your understanding</strong>
          <p>Open the Claude app and say:</p>
          <code className={styles.cliCommand}>{claudePrompt}</code>
          <p className={styles.hint}>
            First time? <Link to="/assessments#setup">Install the assessment skill</Link> (one-time
            setup). When Claude gives you your results block,{' '}
            <Link to="/assessments#import">paste it on the Assessments page</Link> to see your
            score here.
          </p>
        </div>
      </div>
    );
  }

  const level = LEVELS[data.level] || LEVELS.Solid;
  const pct = data.percentage ?? Math.round((data.score / data.maxScore) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.label}>Self-Assessment — {displayLabel}</div>
          <div className={styles.name}>Completed by {data.name} · {data.date}</div>
        </div>
        <div className={styles.scoreBlock} style={{ background: level.bg, borderColor: level.color }}>
          <span className={styles.scorePct} style={{ color: level.color }}>{pct}%</span>
          <span className={styles.scoreLevel} style={{ color: level.color }}>{data.level}</span>
        </div>
      </div>

      {data.questions && (
        <div className={styles.questionList}>
          {data.questions.map(q => (
            <div key={q.id} className={styles.questionRow}>
              <ScorePip score={q.score} />
              <span className={q.score < 3 ? styles.qLabelWeak : styles.qLabel}>{q.shortTitle}</span>
            </div>
          ))}
        </div>
      )}

      {data.strengths && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>✓ Strengths</div>
          <p className={styles.sectionText}>{data.strengths}</p>
        </div>
      )}

      {data.focusAreas && data.focusAreas.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>📌 Focus areas</div>
          <ul className={styles.focusList}>
            {data.focusAreas.map((fa, i) => (
              <li key={i}>
                <strong>{fa.topic}</strong>
                {fa.detail && <span> — {fa.detail}</span>}
                {fa.sectionLink && (
                  <> · <Link to={fa.sectionLink} className={styles.sectionLink}>Revisit section →</Link></>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.retake}>
        Want to retake? Say <code>{claudePrompt}</code> to Claude, then paste your new
        results block on the <Link to="/assessments#import">Assessments page</Link>.
      </div>
    </div>
  );
}
