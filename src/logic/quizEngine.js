
/**
 * Quiz engine for the AZ-900 Study Buddy.
 * These functions do not modify the original question data.
 */

/**
 * Shuffle a copy of an array using the Fisher-Yates algorithm.
 * @param {Array} items
 * @param {Function} random
 * @returns {Array}
 */
function shuffle(items, random = Math.random) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));

    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

/**
 * Build a quiz filtered by topic and difficulty.
 *
 * @param {Array} questions
 * @param {Object} options
 * @param {string} [options.topic='all']
 * @param {number} [options.count=10]
 * @param {string} [options.difficulty='all']
 * @param {Function} [options.random=Math.random]
 * @returns {Array}
 */
export function buildQuiz(
  questions,
  {
    topic = 'all',
    count = 10,
    difficulty = 'all',
    random = Math.random,
  } = {},
) {
  if (!Array.isArray(questions) || !Number.isFinite(count) || count <= 0) {
    return [];
  }

  const matchingQuestions = questions.filter((question) => {
    if (!question || typeof question !== 'object') return false;

    const matchesTopic =
      topic === 'all' ||
      topic === 'All topics (mixed)' ||
      question.topic === topic;

    const matchesDifficulty =
      difficulty === 'all' || question.difficulty === difficulty;

    return matchesTopic && matchesDifficulty;
  });

  return shuffle(matchingQuestions, random).slice(0, Math.floor(count));
}

/**
 * Check a selected answer against a question.
 *
 * @param {Object} question
 * @param {number} selectedIndex
 * @returns {Object}
 */
export function checkAnswer(question, selectedIndex) {
  const correctIndex = question?.correctIndex;
  const validAnswer =
    Number.isInteger(selectedIndex) &&
    Array.isArray(question?.options) &&
    selectedIndex >= 0 &&
    selectedIndex < question.options.length;

  const hasCorrectAnswer =
    Number.isInteger(correctIndex) &&
    Array.isArray(question?.options) &&
    correctIndex >= 0 &&
    correctIndex < question.options.length;

  return {
    isCorrect:
      validAnswer && hasCorrectAnswer && selectedIndex === correctIndex,
    selectedIndex,
    correctIndex,
    explanation: question?.explanation ?? '',
    whyWrong: question?.whyOthersWrong ?? [],
  };
}

/**
 * Calculate the overall score and scores by subtopic.
 *
 * @param {Array} answers
 * @returns {Object}
 */
export function calculateScore(answers) {
  const validAnswers = Array.isArray(answers)
    ? answers.filter((answer) => answer && typeof answer === 'object')
    : [];

  const bySubtopicMap = new Map();

  for (const answer of validAnswers) {
    const subtopic = answer.question?.subtopic ?? 'General';

    const entry = bySubtopicMap.get(subtopic) ?? {
      subtopic,
      correct: 0,
      total: 0,
    };

    entry.total += 1;

    if (answer.isCorrect === true) {
      entry.correct += 1;
    }

    bySubtopicMap.set(subtopic, entry);
  }

  const correct = validAnswers.filter(
    (answer) => answer.isCorrect === true,
  ).length;

  const total = validAnswers.length;

  return {
    correct,
    total,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    bySubtopic: [...bySubtopicMap.values()].map((entry) => ({
      ...entry,
      percentage: Math.round((entry.correct / entry.total) * 100),
    })),
  };
}
