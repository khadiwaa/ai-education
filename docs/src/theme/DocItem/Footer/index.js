import React, { useState, useEffect } from 'react';
import OriginalDocItemFooter from '@theme-original/DocItem/Footer';
import { useLocation } from '@docusaurus/router';
import { markVisited, markComplete, unmarkComplete, isComplete } from '../../../lib/progress';
import styles from './styles.module.css';

export default function DocItemFooterWrapper(props) {
  const { pathname } = useLocation();
  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    markVisited(pathname);
    setComplete(isComplete(pathname));
  }, [pathname]);

  function toggle() {
    if (complete) {
      unmarkComplete(pathname);
      setComplete(false);
    } else {
      markComplete(pathname);
      setComplete(true);
    }
  }

  return (
    <>
      <OriginalDocItemFooter {...props} />
      {mounted && (
        <div className={styles.completeRow}>
          <button
            className={complete ? styles.btnComplete : styles.btnMark}
            onClick={toggle}
            aria-pressed={complete}
          >
            <span className={styles.checkbox}>{complete ? '✓' : ''}</span>
            {complete ? 'Completed' : 'Mark as complete'}
          </button>
          {complete && (
            <button className={styles.btnUndo} onClick={toggle}>
              Undo
            </button>
          )}
        </div>
      )}
    </>
  );
}
