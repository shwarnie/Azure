
import { beforeEach, describe, it, expect, vi } from 'vitest';
import {
  saveResult,
  getProgress,
  getMissedQuestionIds,
  resetProgress,
} from './storage.js';

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem: vi.fn((key) => store.get(key) ?? null),
    setItem: vi.fn((key, value) => store.set(key, String(value))),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
  };
}

describe('storage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock());
    resetProgress();
  });

  it('saves and retrieves quiz progress', () => {
    saveResult('Cloud Concepts', 8, 10, ['q2']);

    expect(getProgress()['Cloud Concepts']).toMatchObject({
      bestPercentage: 80,
      latestPercentage: 80,
      correct: 8,
      total: 10,
    });
  });

  it('keeps the best score when a later score is lower', () => {
    saveResult('Cloud Concepts', 9, 10, []);
    saveResult('Cloud Concepts', 5, 10, []);

    expect(getProgress()['Cloud Concepts'].bestPercentage).toBe(90);
    expect(getProgress()['Cloud Concepts'].latestPercentage).toBe(50);
  });

  it('stores unique missed question IDs', () => {
    saveResult('Cloud Concepts', 1, 3, ['q1', 'q2']);
    saveResult('Cloud Concepts', 2, 3, ['q2', 'q3']);

    expect(getMissedQuestionIds()).toEqual(['q1', 'q2', 'q3']);
  });

  it('handles corrupted progress JSON', () => {
    localStorage.setItem('cloudready-progress', '{broken json');

    expect(() => getProgress()).not.toThrow();
    expect(getProgress()).toEqual({});
  });

  it('handles corrupted missed-question JSON', () => {
    localStorage.setItem('cloudready-missed', '{broken json');

    expect(() => getMissedQuestionIds()).not.toThrow();
    expect(getMissedQuestionIds()).toEqual([]);
  });

  it('resets saved progress and missed questions', () => {
    saveResult('Cloud Concepts', 8, 10, ['q1']);

    resetProgress();

    expect(getProgress()).toEqual({});
    expect(getMissedQuestionIds()).toEqual([]);
  });

  it('handles a zero-question result', () => {
    saveResult('Cloud Concepts', 0, 0, []);

    expect(getProgress()['Cloud Concepts'].latestPercentage).toBe(0);
  });
});
