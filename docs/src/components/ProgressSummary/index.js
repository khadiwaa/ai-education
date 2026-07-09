import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { getStats, resetProgress } from '../../lib/progress';
import styles from './styles.module.css';

function PhaseBar({ label, complete, total }) {
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100);
  return (
    <div className={styles.phaseRow}>
      <div className={styles.phaseLabel}>
        <span>{label}</span>
        <span className={styles.phaseFraction}>{complete}/{total}</span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ProgressSummary() {
  const [stats, setStats] = useState(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setStats(getStats());
  }, []);

  function handleReset() {
    resetProgress();
    setStats(getStats());
    setShowReset(false);
  }

  if (!stats) return null;

  const { lastVisited, completedCount, totalModules, phase1Complete, phase1Total, phase2Complete, phase2Total, phase3Complete, phase3Total, modules } = stats;
  const overallPct = Math.round((completedCount / totalModules) * 100);

  // Find the last-visited module label
  const lastModule = modules.find(m => m.id === lastVisited);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Progress</h3>
        <span className={styles.pct}>{overallPct}%</span>
      </div>

      {lastVisited && lastModule && lastVisited !== '/docs/intro' && (
        <div className={styles.continueRow}>
          <span className={styles.continueLabel}>Continue where you left off:</span>
          <Link to={lastVisited} className={styles.continueLink}>
            {lastModule.label} →
          </Link>
        </div>
      )}

      <PhaseBar label="Phase 1 — AI Essentials" complete={phase1Complete} total={phase1Total} />
      <PhaseBar label="Phase 2 — Claude in Practice" complete={phase2Complete} total={phase2Total} />
      <PhaseBar label="Phase 3 — Working Confidently with AI" complete={phase3Complete} total={phase3Total} />

      <div className={styles.moduleList}>
        {modules.map(m => (
          <Link key={m.id} to={m.id} className={styles.moduleItem} title={m.label}>
            <span className={m.complete ? styles.dotComplete : m.visited ? styles.dotVisited : styles.dotEmpty}>
              {m.complete ? '✓' : m.visited ? '·' : '○'}
            </span>
            <span className={m.complete ? styles.moduleLabelComplete : styles.moduleLabel}>
              {m.label}
            </span>
          </Link>
        ))}
      </div>

      <div className={styles.legend}>
        <span><span className={styles.dotComplete}>✓</span> complete</span>
        <span><span className={styles.dotVisited}>·</span> visited</span>
        <span><span className={styles.dotEmpty}>○</span> not started</span>
        {completedCount > 0 && (
          showReset
            ? <span>
                <button className={styles.resetConfirm} onClick={handleReset}>Confirm reset</button>
                <button className={styles.resetCancel} onClick={() => setShowReset(false)}>cancel</button>
              </span>
            : <button className={styles.resetBtn} onClick={() => setShowReset(true)}>Reset progress</button>
        )}
      </div>
    </div>
  );
}
