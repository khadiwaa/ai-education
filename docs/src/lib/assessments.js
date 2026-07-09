// Client-side store for assessment results imported from the Claude skill.
// Results are pasted on /assessments as a JSON block, validated here, and kept
// in localStorage — this browser only, no server.

const STORAGE_KEY = 'ai-education.assessments.v1';
const UPDATE_EVENT = 'ai-education-assessment-updated';

const MIN_MODULE = 1;
const MAX_MODULE = 8;
const MAX_TEXT = 2000;

function readStore() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function getModuleResult(moduleNumber) {
  return readStore()[String(moduleNumber)] || null;
}

export function clearResults() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function subscribe(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(UPDATE_EVENT, callback);
  return () => window.removeEventListener(UPDATE_EVENT, callback);
}

function levelFor(percentage) {
  if (percentage >= 80) return 'Strong';
  if (percentage >= 55) return 'Solid';
  return 'Developing';
}

function cleanText(value) {
  if (typeof value !== 'string') return '';
  return value.slice(0, MAX_TEXT);
}

// Pull the first JSON object/array out of pasted text that may include
// markdown fences or surrounding prose from the Claude conversation.
function extractJson(text) {
  const stripped = text.replace(/```(?:json)?/gi, '').trim();
  try {
    return JSON.parse(stripped);
  } catch {
    // fall through to bracket slicing
  }
  const firstObj = stripped.indexOf('{');
  const firstArr = stripped.indexOf('[');
  const start =
    firstArr !== -1 && (firstObj === -1 || firstArr < firstObj) ? firstArr : firstObj;
  if (start === -1) return null;
  const closer = stripped[start] === '[' ? ']' : '}';
  const end = stripped.lastIndexOf(closer);
  if (end <= start) return null;
  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch {
    return null;
  }
}

// Validate one result payload. Returns { result } or { error }.
function sanitizeResult(raw) {
  if (!raw || typeof raw !== 'object') {
    return { error: 'Not a results object.' };
  }
  if (raw.kind !== 'ai-education-assessment') {
    return { error: 'This doesn’t look like an assessment results block (missing "kind").' };
  }
  const module = Number(raw.module);
  if (!Number.isInteger(module) || module < MIN_MODULE || module > MAX_MODULE) {
    return { error: `Invalid module number: ${raw.module}` };
  }
  const score = Number(raw.score);
  const maxScore = Number(raw.maxScore);
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || score < 0 || score > maxScore) {
    return { error: `Module ${module}: score/maxScore are missing or invalid.` };
  }

  // Recompute derived fields rather than trusting the pasted values.
  const percentage = Math.round((score / maxScore) * 100);
  const level = levelFor(percentage);

  const focusAreas = Array.isArray(raw.focusAreas)
    ? raw.focusAreas
        .filter((fa) => fa && typeof fa === 'object')
        .map((fa) => {
          const link = typeof fa.sectionLink === 'string' && fa.sectionLink.startsWith('/docs/')
            ? fa.sectionLink
            : undefined;
          return {
            topic: cleanText(fa.topic),
            detail: cleanText(fa.detail),
            ...(link ? { sectionLink: link } : {}),
          };
        })
        .filter((fa) => fa.topic)
    : [];

  const questions = Array.isArray(raw.questions)
    ? raw.questions
        .filter((q) => q && typeof q === 'object')
        .map((q) => ({
          id: cleanText(q.id),
          shortTitle: cleanText(q.shortTitle),
          score: Math.max(0, Math.min(3, Number(q.score) || 0)),
        }))
        .filter((q) => q.id)
    : [];

  return {
    result: {
      kind: 'ai-education-assessment',
      module,
      phase: Number(raw.phase) || undefined,
      moduleInPhase: Number(raw.moduleInPhase) || undefined,
      moduleName: cleanText(raw.moduleName),
      name: cleanText(raw.name) || 'Anonymous',
      date: cleanText(raw.date) || new Date().toISOString().slice(0, 10),
      score,
      maxScore,
      percentage,
      level,
      strengths: cleanText(raw.strengths),
      recommendedNextStep: cleanText(raw.recommendedNextStep),
      focusAreas,
      questions,
    },
  };
}

// Import pasted text. Accepts a single result object or an array of them.
// Returns { imported: [moduleNumbers], errors: [messages] }.
export function importResults(text) {
  if (typeof window === 'undefined') {
    return { imported: [], errors: ['Import only works in the browser.'] };
  }
  const parsed = extractJson(String(text || ''));
  if (parsed == null) {
    return {
      imported: [],
      errors: ['Couldn’t find valid JSON in what you pasted. Copy the whole results block from Claude, including the curly braces.'],
    };
  }
  const items = Array.isArray(parsed) ? parsed : [parsed];
  const imported = [];
  const errors = [];
  const store = readStore();

  for (const item of items) {
    const { result, error } = sanitizeResult(item);
    if (error) {
      errors.push(error);
    } else {
      store[String(result.module)] = result;
      imported.push(result.module);
    }
  }

  if (imported.length > 0) writeStore(store);
  return { imported, errors };
}
