/**
 * Progress tracking utilities.
 * All state lives in localStorage under 'ai-education-progress'.
 * Safe to call server-side (guards against missing window).
 */

const STORAGE_KEY = 'ai-education-progress';

// Modules that count toward progress, in order.
export const CURRICULUM = [
  { id: '/docs/phase-1/how-ai-works',          label: 'How AI Actually Works',        phase: 1 },
  { id: '/docs/phase-1/using-ai-effectively',  label: 'Using AI Effectively',          phase: 1 },
  { id: '/docs/phase-1/ai-in-your-workflow',   label: 'AI in Your Workday',             phase: 1 },
  { id: '/docs/phase-2/claude-essentials',     label: 'Getting Started with Claude',    phase: 2 },
  { id: '/docs/phase-2/projects-and-instructions', label: 'Projects & Instructions',    phase: 2 },
  { id: '/docs/phase-2/creating-with-artifacts', label: 'Creating with Artifacts',      phase: 2 },
  { id: '/docs/phase-2/connectors-and-skills', label: 'Connectors, MCP & Skills',       phase: 2 },
  { id: '/docs/phase-2/everyday-workflows',    label: 'Everyday Workflows',             phase: 2 },
  { id: '/docs/phase-3/confidentiality-and-privacy', label: 'Confidentiality & Privacy', phase: 3 },
  { id: '/docs/phase-3/verifying-ai-output',   label: 'Verifying AI Output',            phase: 3 },
  { id: '/docs/phase-3/choosing-tools-and-plans', label: 'Choosing AI Tools & Plans',   phase: 3 },
  { id: '/docs/phase-3/bringing-ai-to-your-team', label: 'Bringing AI to Your Team',    phase: 3 },
  { id: '/docs/phase-3/staying-current',       label: 'Staying Current',                phase: 3 },
];

function load() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markVisited(path) {
  const data = load();
  const visited = new Set(data.visited || []);
  visited.add(path);
  save({ ...data, visited: [...visited], lastVisited: path });
}

export function markComplete(path) {
  const data = load();
  const completed = new Set(data.completed || []);
  completed.add(path);
  save({ ...data, completed: [...completed] });
}

export function unmarkComplete(path) {
  const data = load();
  const completed = new Set(data.completed || []);
  completed.delete(path);
  save({ ...data, completed: [...completed] });
}

export function isComplete(path) {
  return (load().completed || []).includes(path);
}

export function isVisited(path) {
  return (load().visited || []).includes(path);
}

export function getLastVisited() {
  return load().lastVisited || null;
}

export function getStats() {
  const data = load();
  const completed = new Set(data.completed || []);
  const visited = new Set(data.visited || []);
  const phase1 = CURRICULUM.filter(m => m.phase === 1);
  const phase2 = CURRICULUM.filter(m => m.phase === 2);
  const phase3 = CURRICULUM.filter(m => m.phase === 3);
  return {
    lastVisited: data.lastVisited || null,
    totalModules: CURRICULUM.length,
    completedCount: CURRICULUM.filter(m => completed.has(m.id)).length,
    visitedCount: CURRICULUM.filter(m => visited.has(m.id)).length,
    phase1Complete: phase1.filter(m => completed.has(m.id)).length,
    phase1Total: phase1.length,
    phase2Complete: phase2.filter(m => completed.has(m.id)).length,
    phase2Total: phase2.length,
    phase3Complete: phase3.filter(m => completed.has(m.id)).length,
    phase3Total: phase3.length,
    completedIds: [...completed],
    modules: CURRICULUM.map(m => ({
      ...m,
      visited: visited.has(m.id),
      complete: completed.has(m.id),
    })),
  };
}

export function resetProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
