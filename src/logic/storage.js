
const PROGRESS_KEY = 'cloudready-progress';
const MISSED_KEY = 'cloudready-missed';

let memoryProgress = {};
let memoryMissed = [];

function hasLocalStorage() {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function readJSON(key, fallback) {
  try {
    if (!hasLocalStorage()) return fallback;

    const stored = localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    if (!hasLocalStorage()) return false;

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Save a quiz result and remember missed question IDs.
 * @param {string} topic
 * @param {number} correct
 * @param {number} total
 * @param {string[]} missedIds
 * @returns {Object} The saved topic progress.
 */
export function saveResult(topic, correct, total, missedIds = []) {
  const safeTopic = typeof topic === 'string' ? topic : 'General';
  const safeCorrect = Number.isFinite(correct) ? correct : 0;
  const safeTotal = Number.isFinite(total) ? total : 0;
  const percentage =
    safeTotal > 0
      ? Math.round((safeCorrect / safeTotal) * 100)
      : 0;

  const storedProgress = readJSON(PROGRESS_KEY, memoryProgress);
  const progress =
    storedProgress &&
    typeof storedProgress === 'object' &&
    !Array.isArray(storedProgress)
      ? { ...storedProgress }
      : { ...memoryProgress };

  const previousBest = progress[safeTopic]?.bestPercentage ?? 0;

  progress[safeTopic] = {
    bestPercentage: Math.max(previousBest, percentage),
    latestPercentage: percentage,
    correct: safeCorrect,
    total: safeTotal,
  };

  memoryProgress = progress;

  const storedMissed = readJSON(MISSED_KEY, memoryMissed);
  const missed = Array.isArray(storedMissed)
    ? storedMissed
    : memoryMissed;

  memoryMissed = [
    ...new Set([
      ...missed,
      ...(Array.isArray(missedIds)
        ? missedIds.filter((id) => typeof id === 'string')
        : []),
    ]),
  ];

  writeJSON(PROGRESS_KEY, memoryProgress);
  writeJSON(MISSED_KEY, memoryMissed);

  return progress[safeTopic];
}

/**
 * Retrieve progress, using memory if browser storage is unavailable.
 * @returns {Object}
 */
export function getProgress() {
  const stored = readJSON(PROGRESS_KEY, memoryProgress);

  if (
    !stored ||
    typeof stored !== 'object' ||
    Array.isArray(stored)
  ) {
    return { ...memoryProgress };
  }

  memoryProgress = stored;
  return { ...stored };
}

/**
 * Return unique IDs of missed questions.
 * @returns {string[]}
 */
export function getMissedQuestionIds() {
  const stored = readJSON(MISSED_KEY, memoryMissed);

  if (!Array.isArray(stored)) {
    return [...memoryMissed];
  }

  memoryMissed = [
    ...new Set(stored.filter((id) => typeof id === 'string')),
  ];

  return [...memoryMissed];
}

/**
 * Reset saved progress and missed questions.
 * @returns {void}
 */
export function resetProgress() {
  memoryProgress = {};
  memoryMissed = [];

  try {
    if (hasLocalStorage()) {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(MISSED_KEY);
    }
  } catch {
    // Memory has still been reset if browser storage is unavailable.
  }
}
