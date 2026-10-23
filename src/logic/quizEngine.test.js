
import { describe, it, expect } from 'vitest';
import {
  buildQuiz,
  checkAnswer,
  calculateScore,
} from './quizEngine.js';

const questions = [
  {
    id: 'q1',
    topic: 'Describe Cloud Concepts',
    subtopic: 'Scalability',
    difficulty: 'easy',
    question: 'What is scalability?',
    options: ['Adjusting resources to demand', 'Buying more servers'],
    correctIndex: 0,
    explanation: 'Scalability adjusts capacity to demand.',
    whyOthersWrong: [null, 'This is not always necessary.'],
  },
  {
    id: 'q2',
    topic: 'Azure Architecture',
    subtopic: 'Availability zones',
    difficulty: 'medium',
    question: 'What are availability zones?',
    options: ['Physical locations', 'Billing categories'],
    correctIndex: 0,
    explanation: 'Zones are separate physical locations.',
    whyOthersWrong: [null, 'Zones are not billing categories.'],
  },
];

describe('buildQuiz', () => {
  it('returns an empty array for missing question data', () => {
    expect(buildQuiz(null)).toEqual([]);
    expect(buildQuiz(undefined)).toEqual([]);
  });

  it('filters by topic', () => {
    const result = buildQuiz(questions, {
      topic: 'Azure Architecture',
      count: 10,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('q2');
  });

  it('supports the all topics filter', () => {
    const result = buildQuiz(questions, {
      topic: 'all',
      count: 10,
    });

    expect(result).toHaveLength(2);
  });

  it('filters by difficulty', () => {
    const result = buildQuiz(questions, {
      topic: 'all',
      difficulty: 'easy',
      count: 10,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('q1');
  });

  it('limits the number of questions', () => {
    expect(
      buildQuiz(questions, { topic: 'all', count: 1 }),
    ).toHaveLength(1);
  });
});

describe('checkAnswer', () => {
  it('marks a correct answer', () => {
    expect(checkAnswer(questions[0], 0).isCorrect).toBe(true);
  });

  it('marks a wrong answer', () => {
    expect(checkAnswer(questions[0], 1).isCorrect).toBe(false);
  });

  it('handles missing question data safely', () => {
    expect(checkAnswer(null, 0).isCorrect).toBe(false);
  });
});

describe('calculateScore', () => {
  it('returns zero for no answers', () => {
    expect(calculateScore([])).toEqual({
      correct: 0,
      total: 0,
      percentage: 0,
      bySubtopic: [],
    });
  });

  it('calculates a score when all answers are correct', () => {
    const result = calculateScore([
      { question: questions[0], isCorrect: true },
      { question: questions[1], isCorrect: true },
    ]);

    expect(result.correct).toBe(2);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(100);
  });

  it('calculates a score when all answers are wrong', () => {
    const result = calculateScore([
      { question: questions[0], isCorrect: false },
      { question: questions[1], isCorrect: false },
    ]);

    expect(result.correct).toBe(0);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(0);
  });

  it('groups results by subtopic', () => {
    const result = calculateScore([
      { question: questions[0], isCorrect: true },
      { question: questions[0], isCorrect: false },
    ]);

    expect(result.bySubtopic).toHaveLength(1);
    expect(result.bySubtopic[0].subtopic).toBe('Scalability');
    expect(result.bySubtopic[0].percentage).toBe(50);
  });
});
