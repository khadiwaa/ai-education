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
  { id: '/docs/phase-1/ai-in-your-workflow',   label: 'AI in Your Workflow',            phase: 1 },
  { id: '/docs/phase-2/copilot-cli-essentials',label: 'Copilot CLI Essentials',         phase: 2 },
  { id: '/docs/phase-2/copilot-in-vscode',     label: 'Copilot in VS Code',             phase: 2 },
  { id: '/docs/phase-2/skills-and-customization', label: 'Skills & Customization',     phase: 2 },
  { id: '/docs/phase-2/mcp-and-integrations',  label: 'MCP & Integrations',             phase: 2 },
  { id: '/docs/phase-2/real-world-workflows',  label: 'Real-World Workflows',           phase: 2 },
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
  return {
    lastVisited: data.lastVisited || null,
    totalModules: CURRICULUM.length,
    completedCount: CURRICULUM.filter(m => completed.has(m.id)).length,
    visitedCount: CURRICULUM.filter(m => visited.has(m.id)).length,
    phase1Complete: phase1.filter(m => completed.has(m.id)).length,
    phase1Total: phase1.length,
    phase2Complete: phase2.filter(m => completed.has(m.id)).length,
    phase2Total: phase2.length,
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
